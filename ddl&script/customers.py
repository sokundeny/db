import random
import string
import datetime
import mysql.connector
from faker import Faker

fake = Faker()

# Database connection details
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = ""
DB_NAME = "sms"

# Ensure email uniqueness during generation
used_emails = set()

# Function to generate realistic customer data
def generate_customer_data():
    while True:
        name = fake.name()
        email = f"{name.lower().replace(" ", "")}@{random.randint(1, 100)}.com"
        if email not in used_emails:
            used_emails.add(email)
            break
    join_date = datetime.date.today() - datetime.timedelta(days=random.randint(0, 1000))
    payment_info = "Visa **** **** **** " + str(random.randint(1000, 9999))
    phone = f"+855-{random.randint(10000000, 99999999)}"
    address = random.choice([
        "Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville",
        "Takeo", "Kampot", "Kandal", "Kampong Cham"
    ])
    return (name, email, join_date, payment_info, phone, address)

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

# Insert 10,000 records
print("🚀 Start inserting...")
batch_size = 1000
total_records = 10000
for i in range(total_records // batch_size):
    data_batch = [generate_customer_data() for _ in range(batch_size)]
    insert_query = """
        INSERT INTO Customers (name, email, join_date, payment_info, phone, address)
        VALUES (%s, %s, %s, %s, %s, %s)
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
print("✅ Finished inserting 10,000 records into Customers table.")
