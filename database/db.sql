CREATE DATABASE car_cleaning_system;
USE car_cleaning_system;


CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100) UNIQUE,
password VARCHAR(255),
role ENUM('customer','admin','employee') DEFAULT 'customer'
);

CREATE TABLE services (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
description TEXT,
price DECIMAL(10,2)
);

CREATE TABLE bookings (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
service_id INT,
employee_id INT,
booking_date DATE,
location VARCHAR(255),
status VARCHAR(50) DEFAULT 'Pending',
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (service_id) REFERENCES services(id),
FOREIGN KEY (employee_id) REFERENCES users(id)
);