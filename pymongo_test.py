import pymongo
from pymongo import Connection

con = Connection()
rows = con.austindb.austindb.find()

#print [row for row in rows]
for row in rows:
    if row
