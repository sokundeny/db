CREATE DATABASE sms;
USE sms;
-- Table: Developer
CREATE TABLE Developer (
    developer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    company VARCHAR(100),
    join_date TIMESTAMP,
    phone VARCHAR(20)
);

-- Table: Categories
CREATE TABLE Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    description TEXT
);

-- Table: Customers
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    join_date TIMESTAMP,
    payment_info TEXT,
    phone VARCHAR(20),
    address TEXT
);

-- Table: Software
CREATE TABLE Software (
    software_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    release_date TIMESTAMP,
    version VARCHAR(20),
    location VARCHAR(100),
    developer_id INT,
    category_id INT,
    FOREIGN KEY (developer_id) REFERENCES Developer(developer_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- Table: Reviews
CREATE TABLE Reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    comment TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_date TIMESTAMP,
    software_id INT,
    customer_id INT,
    FOREIGN KEY (software_id) REFERENCES Software(software_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Table: Transactions
CREATE TABLE Transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    date TIMESTAMP,
    amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    status VARCHAR(20),
    customer_id INT,
    software_id INT,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (software_id) REFERENCES Software(software_id)
);
