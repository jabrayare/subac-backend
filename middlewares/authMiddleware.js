const jwt = require('jsonwebtoken');
const CRYPTO_SECRET = process.env.CRYPTO_SECRET

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Token: ", authHeader);
    if (!authHeader) return res.status(401).json({ message: 'Access denied' });
    const token = authHeader.split(' ')[1]
    jwt.verify(token, CRYPTO_SECRET, (err, user) => {
      console.log("USER:: ", user);
      if (err) return res.status(403).json({ message: err.message, Error: err });
      req.user = user.userInfo.username;
      req.roles = user.userInfo.roles
      next();
    });
  }
  

  module.exports = verifyToken;