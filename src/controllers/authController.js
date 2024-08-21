const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Function to generate a JWT token
function generateToken(payload) {
    // Create the header and body and convert them to base64
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64');

    // Create the signature using the header, body, and secret key, then convert to base64
    console.log("-----------------------------",process.env.SECRET_KEY)
    const signature = crypto.createHmac('sha256', process.env.SECRET_KEY).update(`${header}.${body}`).digest('base64');
    const authenticationToken = `${header}.${body}.${signature}`
    // Combine header, body, and signature to form the JWT
    return authenticationToken;
}

exports.register = async (req, res) => {
    //console.log(req.body)
    const newUser = req.body 
    const password = req.body.password;
    const password_hash = await bcrypt.hash(password, 10);
    User.create({...newUser, password: password_hash}, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send({ id: result.insertId, result: result });
        }})
}


exports.login = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    User.getByUsername(username, async (err,result) =>  {
        if(err) {
            res.status(500).send(err);
        }
        else {
            if(result.length === 0) {
                res.status(401).send("Invalid credentials")
            } else {
                console.log(result[0].password_hash)
                console.log(password)
                const isValidPassword = await bcrypt.compare(password,result[0].password_hash)
                if(!isValidPassword) {
                res.status(401).send("Invalid credentials")
            } else {
                const token = generateToken({ id: result[0].id, username: username });
                res.json({ token });
            }
            }
            
        }
    })
}