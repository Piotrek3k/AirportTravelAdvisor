const db = require('../../config/dbConfig');

const Airport = {
    getAll: (callback) => {
        db.query(`SELECT * FROM airports`, callback)
    }
}

module.exports = Airport