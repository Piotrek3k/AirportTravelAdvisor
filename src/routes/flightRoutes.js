const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const authMiddleware = require('../middleware/authMiddelware');

router.get('/', authMiddleware, flightController.getAllFlights);
router.get('/:id', authMiddleware, flightController.getFlightById);
router.post('/', authMiddleware, flightController.createFlight);
router.put('/:id', authMiddleware, flightController.updateFlight);
router.delete('/:id', authMiddleware, flightController.deleteFlight);
router.post('/search', authMiddleware, flightController.findRoute);

module.exports = router;
