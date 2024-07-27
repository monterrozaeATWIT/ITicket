const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function auth(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        req.user = await User.findById(decoded.userId);
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = auth;
