const User = require('../models/userModel');


exports.getAllUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(results);
        }
    });
};

exports.getUserById = (req, res) => {
    const id = req.params.id;
    User.getById(id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.status(200).json(result[0]);
        }
    });
};

exports.createUser = (req, res) => {
    const newUser = req.body;
    User.create(newUser, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send({ id: result.insertId, ...newUser });
        }
    });
};

exports.updateUser = (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    User.update(id, updatedUser, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ message: 'User not found' });
        } else {
            res.status(200).send({ id, ...updatedUser });
        }
    });
};

exports.deleteUser = (req, res) => {
    const id = req.params.id;
    User.delete(id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (result.affectedRows === 0) {
            res.status(404).send({ message: 'User not found' });
        } else {
            res.status(200).send({ message: 'User deleted successfully' });
        }
    });
};

