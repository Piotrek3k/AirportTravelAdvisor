const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airportController')
const authMiddleware = require('../middleware/authMiddelware');

router.get('/',authMiddleware, airportController.getAllAirports);
router.get('/:id', authMiddleware, airportController.getAirportById);
router.post('/', authMiddleware, airportController.createAirport);
router.put('/:id', authMiddleware, airportController.updateAirport);
router.delete('/:id', authMiddleware, airportController.deleteAirport);

module.exports = router;