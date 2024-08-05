const db = require('../db');


const User = {
    getAll: (callback) => {
        db.query('SELECT * FROM users', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM users WHERE id = ?', [id], callback);
    },

    getByUsername: (username, callback) => {
        db.query('SELECT * FROM users WHERE username = ?', [username], callback);
    },
    
    create: (user, callback) => {
        const { username, password, email, full_name } = user;
        db.query('INSERT INTO users (username, password, email, full_name) VALUES (?, ?, ?, ?)', 
            [username, password, email, full_name], callback);
    },

    update: (id, user, callback) => {
        const { username, password, email, full_name } = user;
        db.query('UPDATE users SET username = ?, password = ?, email = ?, full_name = ? WHERE id = ?', 
            [username, password, email, full_name, id], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM users WHERE id = ?', [id], callback);
    },

};

module.exports = User;
