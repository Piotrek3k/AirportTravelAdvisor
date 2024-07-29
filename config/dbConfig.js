require('dotenv/config') 
const mysql = require('mysql2');
//require('dotenv').config();

console.log('DB_HOST:', process.env.DB_HOST); // Debug log
console.log('DB_USER:', process.env.DB_USER); // Debug log
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Debug log
console.log('DB_NAME:', process.env.DB_NAME); // Debug log

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "airport_advisor_system_db",
// });

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = connection;