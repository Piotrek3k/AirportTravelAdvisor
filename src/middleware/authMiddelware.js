const crypto = require('crypto');
require('dotenv/config') 

const SECRET_KEY = process.env.SECRET_KEY

function verifyToken(token) {
    const [header, payload, signature] = token.split('.');

    const validSignature = crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${payload}`).digest('base64');

    if (signature === validSignature) {
        return JSON.parse(Buffer.from(payload, 'base64').toString());
    } else {
        throw new Error('Invalid token');
    }
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access denied');
    }

    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (err) {
        res.status(403).send('Invalid token');
    }
}

module.exports = authMiddleware;
