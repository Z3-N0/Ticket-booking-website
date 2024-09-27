# Train Ticket Booking System

## Overview
This project is a Train Ticket Booking System that allows users to register, log in, check seat availability, and book tickets for various train routes. The admin can manage locations and routes, ensuring the smooth operation of the ticket booking system.

## Technologies Used
- Frontend: React
- Backend: Node.js, Express
- Database: MySQL
- Environment Variables: `.env` files for sensitive content

## Features
1. **Register a User**: Users can create an account by registering through a dedicated endpoint.
2. **Login User**: Users can log into their accounts using their credentials.
3. **Add a New Train**: Admins can create a new train with source and destination information.
4. **Get Seat Availability**: Users can check the availability of seats for trains on specified routes.
5. **Book a Seat**: Users can book a seat on a selected train.
6. **Get Specific Booking Details**: Users can retrieve details of their specific bookings.

## Mandatory Requirements
1. All admin API endpoints are protected by an API key to prevent unauthorized access and data tampering.
2. For booking seats and retrieving specific booking details, users must provide an Authorization Token received upon logging in.

## Setup Instructions

### Prerequisites
- Node.js (version >= 14.x)
- MySQL (version >= 5.x)
- npm or yarn

### Database Setup
1. **Create a new SQL database**:
   - Open your MySQL command line or use a GUI like phpMyAdmin.
   - Run the following command to create a new database:

     ```sql
     CREATE DATABASE train_ticket_booking;
     ```

2. **Create necessary tables**:
     ```sql
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

    ```



### Environment Variables
- Create a `.env` file in the root directory of the backend project.
- Add the following environment variables:
- The values given here are samples, you can change to any values of your preferance 

```plaintext
front end:
REACT_APP_ADMIN_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiImlhdCI6MTYxNjIz4wMjAwMCwiZXhwIjoxNjE2MjM2ODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
REACT_APP_API_URL=http://localhost:5000/api


backend:
JWT_SECRET=8c1d30a69fa1e4f9c0a8b92c7a9ecbcf5f3c7e4e9c5d3e4e0d5d6a54c0e6f7b8
ADMIN_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiImlhdCI6MTYxNjIz4wMjAwMCwiZXhwIjoxNjE2MjM2ODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
JWT_SECRET=d08f6c47879c7f8b8ef68f4e4b4b2b2dc54aabfdfc5349a6120c4dcb1cbe4842b23ee8363f54c5a2db8e179f4d9bb7e8
```
### Running the Project
1.Clone the repository:
```
git clone https://github.com/Z3-N0/ticket-booking-website
cd train-ticket-booking
```
2. Install dependencies:

Navigate to the backend directory and install the dependencies:
```
cd backend
npm install
```
Navigate to the frontend directory and install the dependencies
```
cd frontend
npm install
```
3. Start the backend server:

In the backend directory, run:
```
node index.js
```
4. Start the frontend application:

In the frontend directory, run:
```
npm start
```

### API Documentation
Refer to the API documentation for details on endpoint usage and expected request/response formats.
