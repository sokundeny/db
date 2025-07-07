import mysql.connector
import random
import string
from faker import Faker

fake = Faker()

# DATABASE CONNECTION DETAIL
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="Denys3npai@"
DB_NAME="sms"

def generate_data():
    comment = fake.paragraph(nb_sentences=3)
    # comment = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(random.randint(10, 30)))
    # description = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(random.randint(69, 168)))
    rating = random.randint(1, 5)
    review_date = fake.date_time_between(start_date="-5y", end_date="now")
    softwareId = random.randint(7, 9)
    customerId = random.randint(1, 3)
    return comment, rating, review_date, softwareId, customerId

# CONNECT TO THE DATABASE
try: 
    connection = mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
    cursor = connection.cursor()
except mysql.connector.Error as err:
    print("Error connecting to database:", err)
    exit()


# Create table if it doesn't exist
create_table_query = """
CREATE TABLE IF NOT EXISTS Reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    comment TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    software_id INT,
    customer_id INT,
    FOREIGN KEY (software_id) REFERENCES Software(software_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);
"""

cursor.execute(create_table_query)
connection.commit()

# Generate and insert data
print('Start inserting ...')
insertion_amount = 10000
num_records = 100
i = 0

for k in range(insertion_amount):
    for _ in range(num_records):
        comment, rating, review_at, software_id, customer_id = generate_data()
        insert_query = """
        INSERT INTO reviews (comment, rating, review_date, software_id, customer_id)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (comment, rating, review_at, software_id, customer_id))
    connection.commit()
    i = i + 1
    print('Insertion round', i, num_records, 'records.')

print(f"Successfully inserted {num_records*insertion_amount} records into the database.")

# Close the connection
cursor.close()
connection.close()

print('Finished inserting!!!')