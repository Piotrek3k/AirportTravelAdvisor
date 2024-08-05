const Flight = require('../models/flightModel');

exports.getAllFlights = (req, res) => {
    console.log("here2")
    Flight.getAll((err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(results);
        }
    });
};

exports.getFlightById = (req, res) => {
    const id = req.params.id;
    Flight.getById(id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (!result) {
            res.status(404).send('Flight not found');
        } else {
            res.status(200).json(result[0]);
        }
    });
};

exports.createFlight = (req, res) => {
    const newFlight = req.body;
    Flight.create(newFlight, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send({ id: result.insertId, ...newFlight });
        }
    });
};

exports.updateFlight = (req, res) => {
    const id = req.params.id;
    const updatedFlight = req.body;
    Flight.update(id, updatedFlight, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Flight not found' });
        } else {
            res.status(200).send({ id, ...updatedFlight });
        }
    });
};

exports.deleteFlight = (req, res) => {
    const id = req.params.id;
    Flight.delete(id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Flight not found' });
        } else {
            res.status(200).send({ message: 'Flight deleted successfully' });
        }
    });
};

exports.findRoute = (req, res) => {
    console.log("here")
    const departure_id = req.body.departure_id;
    const arrival_id = req.body.arrival_id;
    const criteria = req.body.criteria
    Flight.findRoute(departure_id,arrival_id,20,criteria).then((results) => {
        res.status(201).json(results)
    }).catch((err) => {
        res.status(500).send(err)
    })
}
