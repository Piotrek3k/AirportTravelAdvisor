const db = require('../../config/dbConfig');

const User = {
    getAll: (callback) => {
        db.query(`SELECT * FROM users`, callback)
    },
    findPath: () => {
        
    }
}

export default User