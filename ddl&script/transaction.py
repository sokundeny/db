import random
import mysql.connector
from faker import Faker

fake = Faker()

# Database connection details
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = ""
DB_NAME = "sms"

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

# Fetch valid customer_ids and software_ids
cursor.execute("SELECT customer_id FROM Customers")
valid_customer_ids = [row[0] for row in cursor.fetchall()]

cursor.execute("SELECT software_id FROM Software")
valid_software_ids = [row[0] for row in cursor.fetchall()]

if not valid_customer_ids or not valid_software_ids:
    print("❌ No valid IDs found in Customers or Software.")
    cursor.close()
    connection.close()
    exit()

# Transaction generation
payment_methods = ["Credit Card", "PayPal", "Bank Transfer", "Cash", "Crypto"]
statuses = ["Completed", "Pending", "Failed", "Refunded"]

def generate_transaction_data():
    date = fake.date_time_between(start_date='-5y', end_date='now')
    amount = round(random.uniform(5.0, 9999.99), 2)
    method = random.choice(payment_methods)
    status = random.choice(statuses)
    customer_id = random.choice(valid_customer_ids)
    software_id = random.choice(valid_software_ids)
    return (date, amount, method, status, customer_id, software_id)

# Insert 1,000,000 records in batches
print("🚀 Start inserting 1,000,000 transactions...")
total_records = 1_000_000
batch_size = 10000  # Insert 10,000 records per batch
inserted = 0

insert_query = """
    INSERT INTO Transactions (date, amount, payment_method, status, customer_id, software_id)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

for batch_num in range(total_records // batch_size):
    data_batch = [generate_transaction_data() for _ in range(batch_size)]
    try:
        cursor.executemany(insert_query, data_batch)
        connection.commit()
        inserted += batch_size
        print(f"✅ Batch {batch_num + 1}: Inserted {batch_size} records (Total: {inserted})")
    except mysql.connector.Error as err:
        print(f"❌ Batch {batch_num + 1} failed:", err)
        break

# Close connection
cursor.close()
connection.close()
print(f"🎉 Finished inserting {inserted} transaction records.")
