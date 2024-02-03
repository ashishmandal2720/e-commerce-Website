const jwt = require('jsonwebtoken');
// Generate access token function
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '15m' });
  };
  module.exports = generateAccessToken;