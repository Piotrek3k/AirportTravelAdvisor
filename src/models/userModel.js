const db = require('../../config/dbConfig');


class User {
    static getAll (callback) {
        db.query('SELECT * FROM users', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM users WHERE id = ?', [id], callback);
    }

    static getByUsername (username, callback){
        db.query('SELECT * FROM users WHERE username = ?', [username], callback);
    }

    static create (user, callback)  {
        const { username, email, password } = user;
        db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', 
            [username, email, password], callback);
    }

    static update (id, user, callback) {
        const { username, password, email, full_name } = user;
        db.query('UPDATE users SET username = ?, password = ?, email = ?, full_name = ? WHERE id = ?', 
            [username, password, email, full_name, id], callback);
    }

    static delete (id, callback)  {
        db.query('DELETE FROM users WHERE id = ?', [id], callback);
    }

};

module.exports = User;
