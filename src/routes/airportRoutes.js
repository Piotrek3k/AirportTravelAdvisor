const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airportController')

// Get all airports
console.log(airportController.getAllAirports, "----")
router.get('/', airportController.getAllAirports);

// Get airport by ID
router.get('/:id', airportController.getAirportById);

// Create a new airport
router.post('/', airportController.createAirport);

// Update an airport
router.put('/:id', airportController.updateAirport);

// Delete an airport
router.delete('/:id', airportController.deleteAirport);

module.exports = router;