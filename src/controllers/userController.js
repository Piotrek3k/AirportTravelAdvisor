const User = require('../models/userModel');
const bcrypt = require('bcrypt');

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
        } else if (!result) {
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
            res.status(201).json({ id: result.insertId, ...newUser });
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

exports.register = async (req, res) => {
    const newUser = req.body 
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    User.create({...newUser, password: hashedPassword}, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).json({ id: result.insertId, result });
        }})
}

exports.login = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    User.findByUsername(username, (err,result) => {
        if(err) {
            res.status(500).send(err);
        }
        else {
            if(!bcrypt.compare(result[0].password,password)){
                res.status(401).send("Invalid credentials")
            }
        }
    })
}
