const db = require('../../config/dbConfig');

class Airport {
    
    static getAll(callback) {
        db.query('SELECT * FROM airports', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM airports WHERE id = ?', [id], callback);
    }

    static create(airport, callback) {
        const query = 'INSERT INTO airports (code, name, city, country) VALUES (?, ?, ?, ?)';
        db.query(query, [airport.code, airport.name, airport.city, airport.country], callback);
    }

    static update(id, airport, callback) {
        const query = 'UPDATE airports SET code = ?, name = ?, city = ?, country = ? WHERE id = ?';
        db.query(query, [airport.code, airport.name, airport.city, airport.country, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM airports WHERE id = ?', [id], callback);
    }
}

module.exports = Airport;
