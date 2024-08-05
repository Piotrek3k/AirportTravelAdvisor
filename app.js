// const express = require('express');
// const app = express();

// // Use built-in middleware for parsing JSON and urlencoded data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.listen(3000, () => {
//     console.log('Server started on port 3000');
// });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const airportRoutes = require('./src/routes/airportRoutes');
const flightRoutes = require('./src/routes/flightRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/airports', airportRoutes);
app.use('/api/v1/flights', flightRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Airport Travel Advisor API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;