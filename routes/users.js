const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/users/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(400).send('Error creating user');
    }
});


// Login a user

app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email');
        }
        
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid password');
            
        }
        const token = jwt.sign({ userId: user._id, role: user.role, email: email, username: user.username }, secretKey);
        res.status(200).json({ userId: user._id, role: user.role, email: email, username: user.username, token });
    } catch (error) {
        res.status(400).send('Error logging in: ' + error.message);
    }
});

// router.post('/users/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user || !await bcrypt.compare(password, user.password)) {
//             return res.status(400).send('Invalid credentials');
//         }
//         const token = jwt.sign({ userId: user._id, role: user.role }, 'SECRET_KEY');
//         res.json({ token });
//     } catch (error) {
//         res.status(400).send('Error logging in');
//     }
// });

module.exports = router;
