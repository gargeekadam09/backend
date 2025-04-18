-- Create database
CREATE DATABASE IF NOT EXISTS pageturner_servicestore;
USE pageturner_servicestore;

-- Create tables
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  service_id INT,
  quantity INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- Insert sample data
INSERT INTO services (title, author, isbn, price, stock) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 12.99, 25),
('To Kill a Mockingbird', 'Harper Lee', '9780060935467', 14.99, 30),
('1984', 'George Orwell', '9780451524935', 11.99, 20),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 9.99, 15),
('The Hobbit', 'J.R.R. Tolkien', '9780618260300', 13.99, 40);

INSERT INTO customers (name, email, phone, address) VALUES
('John Smith', 'john.smith@example.com', '555-123-4567', '123 Main St, Anytown, USA'),
('Emma Johnson', 'emma.j@example.com', '555-234-5678', '456 Oak Ave, Somewhere, USA'),
('Michael Brown', 'michael.b@example.com', '555-345-6789', '789 Pine Rd, Nowhere, USA'),
('Sarah Wilson', 'sarah.w@example.com', '555-456-7890', '321 Elm St, Anywhere, USA');

INSERT INTO sales (customer_id, service_id, quantity, total_price) VALUES
(1, 1, 2, 25.98),
(2, 3, 1, 11.99),
(3, 5, 3, 41.97),
(4, 2, 1, 14.99);