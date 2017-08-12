import re,sys

mystring = "Gowri's    jewellers"

print re.sub('[ ]+',' ',re.sub('[^A-Za-z0-9 ]+', '', mystring))


from datetime import datetime
dateStr = "06 Aug 2017"
#print datetime.strptime(''.join(dateStr.split(" ")[3:6]), '%d%b%Y')
print datetime.strptime(''.join(dateStr.split(" ")), '%d%b%Y')