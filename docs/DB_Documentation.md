# Database Schema

## Overview

This document describes the schema of the database used in our flight routing application. The database consists of the following tables:
- `users`
- `airports`
- `flights`

## Tables

### Users Table

The `users` table stores information about the users of the application.

| Column Name     | Data Type       | Constraints                      |
|-----------------|-----------------|----------------------------------|
| `id`            | `INT`           | PRIMARY KEY, AUTO_INCREMENT      |
| `username`      | `VARCHAR(50)`   | NOT NULL, UNIQUE                 |
| `email`         | `VARCHAR(100)`  | NOT NULL, UNIQUE                 |
| `password_hash` | `VARCHAR(255)`  | NOT NULL                         |
| `created_at`    | `TIMESTAMP`     | DEFAULT CURRENT_TIMESTAMP        |
| `updated_at`    | `TIMESTAMP`     | DEFAULT CURRENT_TIMESTAMP        |

### Airports Table

The `airports` table stores information about the airports.

| Column Name         | Data Type       | Constraints        |
|---------------------|-----------------|--------------------|
| `id`                | `INT`           | PRIMARY KEY, AUTO_INCREMENT |
| `code`              | `VARCHAR(3)`    | UNIQUE, NOT NULL   |
| `name`              | `VARCHAR(255)`  | NOT NULL           |
| `city`              | `VARCHAR(255)`  | NOT NULL           |
| `country`           | `VARCHAR(255)`  | NOT NULL           |

### Flights Table

The `flights` table stores information about the flights.

| Column Name              | Data Type       | Constraints                      |
|--------------------------|-----------------|----------------------------------|
| `id`                     | `INT`           | PRIMARY KEY, AUTO_INCREMENT      |
| `flight_number`          | `VARCHAR(20)`   | UNIQUE, NOT NULL                 |
| `airline`                | `VARCHAR(255)`  | NOT NULL                         |
| `departure_airport_id`   | `INT`           | FOREIGN KEY REFERENCES `airports(id)` |
| `arrival_airport_id`     | `INT`           | FOREIGN KEY REFERENCES `airports(id)` |
| `cost`                   | `DECIMAL(10, 2)`|                                  |
| `departure_time`         | `DATETIME`      |                                  |
| `arrival_time`           | `DATETIME`      |                                  |

## Detailed Descriptions

### Users Table
- **id**: A unique identifier for each user. The `INT` data type with `AUTO_INCREMENT` ensures it automatically increments with each new user.
- **username**: The user's name, which must be unique and cannot be null.
- **email**: The user's email address, which must be unique and cannot be null.
- **password_hash**: The hashed version of the user's password, which cannot be null.
- **created_at**: The timestamp when the user was created, defaulting to the current timestamp.
- **updated_at**: The timestamp when the user's information was last updated, defaulting to the current timestamp.

### Airports Table
- **id**: A unique identifier for each airport. The `INT` data type with `AUTO_INCREMENT` ensures it automatically increments with each new airport.
- **code**: A unique three-character code for the airport, which must be unique and cannot be null.
- **name**: The name of the airport, which cannot be null.
- **city**: The city where the airport is located, which cannot be null.
- **country**: The country where the airport is located, which cannot be null.

### Flights Table
- **id**: A unique identifier for each flight. The `INT` data type with `AUTO_INCREMENT` ensures it automatically increments with each new flight.
- **flight_number**: The flight number, which must be unique and cannot be null.
- **airline**: The airline operating the flight, which cannot be null.
- **departure_airport_id**: The ID of the airport from which the flight departs. This is a foreign key referencing the `id` in the `airports` table.
- **arrival_airport_id**: The ID of the airport at which the flight arrives. This is a foreign key referencing the `id` in the `airports` table.
- **cost**: The cost of the flight.
- **departure_time**: The departure time of the flight.
- **arrival_time**: The arrival time of the flight.

