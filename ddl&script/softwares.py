import random
import datetime
import mysql.connector
from faker import Faker

fake = Faker()

# Database connection details
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = ""
DB_NAME = "sms"

# Function to generate realistic software data
def generate_software_data():
    name = fake.bs()
    description = fake.text(max_nb_chars=200)
    price = round(random.uniform(5.0, 999.99), 2)
    release_date = fake.date_time_between(start_date="-5y", end_date="now")
    version = f"{random.randint(1, 10)}.{random.randint(0, 20)}.{random.randint(0, 9)}"
    location = f"https://download.example.com/software/{fake.slug()}.zip"
    developer_id = random.randint(1, 10000)
    category_id = random.randint(1, 10000)
    return (name, description, price, release_date, version, location, developer_id, category_id)

# Connect to the database
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

# Insert 500,000 records
print("🚀 Start inserting into Software table...")
batch_size = 1000
total_records = 500000

for i in range(total_records // batch_size):
    data_batch = [generate_software_data() for _ in range(batch_size)]
    insert_query = """
        INSERT INTO Software 
        (name, description, price, release_date, version, location, developer_id, category_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    try:
        cursor.executemany(insert_query, data_batch)
        connection.commit()
        print(f"✅ Batch {i + 1}: {batch_size} records inserted.")
    except mysql.connector.Error as err:
        print(f"❌ Batch {i + 1} failed:", err)

# Close connection
cursor.close()
connection.close()
print("✅ Finished inserting 500,000 records into Software table.")
