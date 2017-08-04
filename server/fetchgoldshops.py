import json, requests
import os
import psycopg2
import urlparse, urllib
import time
import re,sys

url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyCg0o8LJyvFb8EB7mIp96At49XbTfxMqzM'
urlparse.uses_netloc.append("postgres")
db_url = urlparse.urlparse(os.environ["DATABASE_URL"])

"""with open('cities.csv') as f:
	cities = f.read().splitlines()

print cities
#for city in cities:
	#params['query'] = "gold shops in %s" % city
params = dict()
params['query'] = "gold shops in nanded"
params['type'] = 'jewelry_store'
params['radius'] = 50000
resp = requests.get(url=url, params=params)
data = json.loads(resp.text)
print data"""

try:
	conn = psycopg2.connect(
	    database=db_url.path[1:],
	    user=db_url.username,
	    password=db_url.password,
	    host=db_url.hostname,
	    port=db_url.port
	)
	cur = conn.cursor()

	print "Getting data for %s" % sys.argv[1]
	params = dict()
	params['query'] = "gold shops in %s" % sys.argv[1]
	params['type'] = 'jewelry_store'
	params['radius'] = 50000

	print params

	while True:
		resp = requests.get(url=url, params=params)
		data = json.loads(resp.text)
		for result in data['results']:
			name = result['name']
			cleaned_name = re.sub('[ ]+',' ',re.sub('[^A-Za-z0-9 ]+', '', name))
			address = result['formatted_address']
			cleaned_address = re.sub('[ ]+',' ',re.sub('[^A-Za-z0-9 ]+', '', address))
			cur.execute("insert into goldshops(name, city, latitude, longitude, address) values ('{}', '{}', {}, {}, '{}')".format(cleaned_name, sys.argv[1], result['geometry']['location']['lat'], result['geometry']['location']['lng'], cleaned_address ))
			conn.commit()
			
		next_token = data['next_page_token'] if 'next_page_token' in data else ''
		print next_token
		if next_token:
			params['pagetoken'] = urllib.quote_plus(next_token)
			time.sleep(5)
		else:
			break
	
	conn.close()

except Exception, e:
	print e
