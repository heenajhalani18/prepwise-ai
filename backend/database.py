from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["prepwise_db"]

interviews_collection = db["interviews"]