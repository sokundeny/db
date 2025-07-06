import mysql.connector
import random
import string

# DATABASE CONNECTION DETAIL
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD=""
DB_NAME="sms"

with open('../note.txt', 'r') as file:
    DB_PASSWORD = file.read()

def generate_data():
    name = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(random.randint(5, 10)))
    description = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(random.randint(69, 168)))
    return name, description

# CONNECT TO THE DATABASE
try: 
    connection = mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
    cursor = connection.cursor()
except mysql.connector.Error as err:
    print("Error connecting to database:", err)
    exit()


# Create table if it doesn't exist
create_table_query = """
CREATE TABLE IF NOT EXISTS categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    description TEXT
);
"""

cursor.execute(create_table_query)
connection.commit()

# Generate and insert data
print('Start inserting ...')
insertion_amount = 10
num_records = 1000
i = 0

for k in range(insertion_amount):
    for _ in range(num_records):
        name, description = generate_data()
        insert_query = """
        INSERT INTO categories (name, description)
        VALUES (%s, %s)
        """
        cursor.execute(insert_query, (name, description))
    connection.commit()
    i = i + 1
    print('Insertion round', i, num_records, 'records.')

print(f"Successfully inserted {num_records*insertion_amount} records into the database.")

# Close the connection
cursor.close()
connection.close()

print('Finished inserting!!!')