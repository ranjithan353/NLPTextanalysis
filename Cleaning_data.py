import pandas as pd
from pymongo import MongoClient
import sys

# Load the dataset
file_path = sys.argv[1]
df = pd.read_csv(file_path)

# Data Cleaning
# Remove duplicates
df = df.drop_duplicates()

# Trim whitespace in column names
df.columns = df.columns.str.strip()

# Remove leading/trailing spaces in string columns
df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)

# Handle missing values (if any)
df = df.dropna()

# Ensure correct data types
df['UserRating'] = df['UserRating'].astype(float)
df['Reviews'] = df['Reviews'].astype(int)
df['Price'] = df['Price'].astype(int)
df['Year'] = df['Year'].astype(int)


# Upload to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["bestsellers_db"]
collection = db["books"]

# Convert DataFrame to dictionary and insert into MongoDB
collection.insert_many(df.to_dict(orient="records"))

print("Data cleaning and upload to MongoDB complete.")
