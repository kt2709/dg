from bs4 import BeautifulSoup
from datetime import datetime
import urllib
import json

import os
import psycopg2
import urlparse

urlparse.uses_netloc.append("postgres")
url = urlparse.urlparse(os.environ["DATABASE_URL"])
BASE_URL = "https://www.goldratetoday.com"

def extractCityName(city_link):
	name = city_link.split(".")[0]
	return name.split("-")[2]

def convertToDate(dateStr):
	return datetime.strptime(''.join(dateStr.split(" ")[3:6]), '%d%b%Y')

def convertToDate2(dateStr):
	return datetime.strptime(''.join(dateStr.split(" ")), '%d%b%Y')

def extractPrice(priceStr):
	return (priceStr.split(" ")[1].replace(",",""))

page = urllib.urlopen(BASE_URL).read()
page_soup = BeautifulSoup(page,"lxml")

today_table = page_soup.find('table', {'class': 'dbx-hp-tdymn'})
today_rows = today_table.findAll('tr')
today_cols = today_rows[1].findAll('td')
yday_cols = today_rows[4].findAll('td')

today_date = convertToDate2(today_cols[0].find('span').getText()).strftime("%Y-%m-%d")
today_gold_price = extractPrice(today_cols[2].getText())
yday_date = convertToDate2(yday_cols[0].find('span').getText()).strftime("%Y-%m-%d")
yday_gold_price = extractPrice(yday_cols[2].getText())

records = []
records.append({"city":'India', "date":today_date, "price24":today_gold_price, "price22":today_gold_price})
#records.append({"city":'India', "date":yday_date, "price24":yday_gold_price, "price22":yday_gold_price})

#print today_date,today_gold_price,yday_date,yday_gold_price,highest_gold_price,lowest_gold_price


table = page_soup.find('table', {'class': 'dbx-indctylkbx'})
rows = table.findAll('tr')

for (ix,tr) in enumerate(rows):
	if ix > 0:
		cols = tr.findAll('td')
		try:
			for cc in cols:
				city_link = cc.find('a').get('href')
				city_name =  extractCityName(city_link)
				new_url = BASE_URL+"/"+city_link
				city = urllib.urlopen(new_url).read()
				city_soup = BeautifulSoup(city,"lxml")
				city_table = city_soup.find('table', {'class': 'dbx-hp-tdymn'})
				city_rows = city_table.findAll('tr')
				latest_city_row = city_rows[2]

				latest_city_col = latest_city_row.findAll('td')
				latest_city_col_date = latest_city_col[0].find('span')
				date =  convertToDate2(latest_city_col_date.getText()).strftime("%Y-%m-%d")
				#date = convertToDate(latest_city_col[0].getText()).strftime("%Y-%m-%d")
				price24 = extractPrice(latest_city_col[1].getText())
				price22 = extractPrice(latest_city_col[2].getText())
				item = {}
				item["city"] = city_name.title()
				item["date"] = date
				item["price24"] = price24
				item["price22"] = price22
				records.append({"city":city_name.title(), "date":date, "price24":price24, "price22":price22})
				
		except:
			print "No href"


print records
try:
	conn = psycopg2.connect(
	    database=url.path[1:],
	    user=url.username,
	    password=url.password,
	    host=url.hostname,
	    port=url.port
	)
	cur = conn.cursor()
	for record in records:
		cur.execute("insert into goldrates(date, city, price24, price22) values ('{}', '{}', {}, {})".format( datetime.strptime(record['date'], '%Y-%m-%d'), record['city'], record['price24'], record['price22']))
		
	conn.commit()
	
	conn.close()
except Exception, e:
	print e
