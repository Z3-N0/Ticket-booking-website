CREATE DATABASE IF NOT EXISTS train_booking;

USE train_booking;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL
);
select * from users;

drop table locations;
drop table routes;
CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE
);

select * from locations;

CREATE TABLE routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    seats INT NOT NULL,
    departure_time VARCHAR(255) NOT NULL,
    arrival_time VARCHAR(255) NOT NULL,
    FOREIGN KEY (from_location) REFERENCES locations(name),
    FOREIGN KEY (to_location) REFERENCES locations(name)
);
select * from routes;

DROP TABLE IF EXISTS bookings;

CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY,  -- Booking ID generated
    user_id INT NOT NULL,
    route_id INT NOT NULL,
    number_of_tickets INT NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);


select * from bookings;



