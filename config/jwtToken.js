const jwt = require('jsonwebtoken');

const secretKey = "apple"; // Replace with your actual secret key

const generateToken = (id) => {
    return jwt.sign({ id }, secretKey, { expiresIn: '24h' });
}

module.exports = { generateToken };
