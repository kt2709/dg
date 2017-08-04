import re,sys

mystring = "Gowri's    jewellers"

print re.sub('[ ]+',' ',re.sub('[^A-Za-z0-9 ]+', '', mystring))

print sys.argv[1]