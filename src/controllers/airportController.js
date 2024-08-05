const Airport = require('../models/airportModel');

// Get all airports
exports.getAllAirports = (req, res) => {
    Airport.getAll((err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(results);
        }
    });
};

// Get airport by ID
exports.getAirportById = (req, res) => {
    const id = req.params.id;
    Airport.getById(id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.length === 0) {
            res.status(404).send({ message: 'Airport not found' });
        } else {
            res.status(200).json(result[0]);
        }
    });
};

// Create a new airport
exports.createAirport = (req, res) => {
    const newAirport = req.body;
    Airport.create(newAirport, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send({ id: result.insertId, ...newAirport });
        }
    });
};

// Update an airport
exports.updateAirport = (req, res) => {
    const id = req.params.id;
    const updatedAirport = req.body;
    Airport.update(id, updatedAirport, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Airport not found' });
        } else {
            res.status(200).send({ id, ...updatedAirport });
        }
    });
};

// Delete an airport
exports.deleteAirport = (req, res) => {
    const id = req.params.id;
    Airport.delete(id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Airport not found' });
        } else {
            res.status(200).send({ message: 'Airport deleted successfully' });
        }
    });
};

