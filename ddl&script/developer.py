import random
import mysql.connector
from faker import Faker

fake = Faker()

# Database connection details
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = ""
DB_NAME = "sms"

# Ensure email uniqueness
used_emails = set()

# Function to generate realistic developer data
def generate_developer_data(dev_id):
    while True:
        name = fake.name()
        email = fake.unique.email()
        if email not in used_emails:
            used_emails.add(email)
            break
    company = fake.company()
    join_date = fake.date_between(start_date='-10y', end_date='today')
    phone = fake.phone_number()[:20]
    return (dev_id, name, email, company, join_date, phone)

# Connect to database
try:
    connection = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    cursor = connection.cursor()
    print("✅ Connected to database.")
except mysql.connector.Error as err:
    print("❌ Connection error:", err)
    exit()

# Insert 1000 records with developer_id from 1 to 1000
print("🚀 Start inserting...")
data_batch = [generate_developer_data(dev_id) for dev_id in range(1, 10001)]

insert_query = """
    INSERT INTO Developer (developer_id, name, email, company, join_date, phone)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

try:
    cursor.executemany(insert_query, data_batch)
    connection.commit()
    print(f"✅ Inserted {len(data_batch)} developer records.")
except mysql.connector.Error as err:
    print("❌ Insertion failed:", err)

# Close connection
cursor.close()
connection.close()
print("✅ Finished inserting 1,0000 records with IDs 1 to 10000.")
