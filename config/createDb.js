const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database.');
  });

  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS airport_advisor_system_db`;

connection.query(createDatabaseQuery, (err, results) => {
  if (err) {
    console.error('Error creating the database:', err.stack);
    return;
  }
  console.log('Created database or database already exists:', results);
});

const useDatabaseQuery = `USE airport_advisor_system_db`;

connection.query(useDatabaseQuery, (err, results) => {
  if (err) {
    console.error('Error changing database:', err.stack);
    return;
  }
  console.log('Database selected:', results);

  const createTablesQuery = `
    CREATE TABLE airports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(3) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL
    );


    CREATE TABLE flights (
    id INT PRIMARY KEY AUTO_INCREMENT,
    flight_number VARCHAR(20) UNIQUE NOT NULL,
    airline VARCHAR(255) NOT NULL,
    departure_airport_id INT,
    arrival_airport_id INT,
    cost DECIMAL(10, 2),
    departure_time DATETIME,
    arrival_time DATETIME,
    FOREIGN KEY (departure_airport_id) REFERENCES airports(id),
    FOREIGN KEY (arrival_airport_id) REFERENCES airports(id)
    );

    CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `;

  connection.query(createTablesQuery, (err, results) => {
    if (err) {
      console.error('Error creating tables:', err.stack);
      return;
    }
    console.log('Tables have been created:', results);
  });
});

connection.end((err) => {
    if (err) {
      console.error('Error closing connection:', err.stack);
      return;
    }
    console.log('Database connection closed:');
  });