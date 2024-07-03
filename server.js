const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/ticketing_system';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['User', 'IT'], default: 'User' }
});

const User = mongoose.model('User', userSchema);

// Ticket Schema
const ticketSchema = new mongoose.Schema({
    department: { type: String, required: true },
    priority: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// Authentication Middleware
async function auth(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        req.user = await User.findById(decoded.userId);
        if (!req.user) {
            throw new Error();
        }
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

// User Routes
app.post('/users/signup', async (req, res) => {
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

app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).send('Invalid credentials');
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, 'SECRET_KEY');
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(400).send('Error logging in');
    }
});

// Ticket Routes
app.post('/tickets/submit-ticket', auth, async (req, res) => {
    try {
        const { department, priority, subject, description } = req.body;
        const newTicket = new Ticket({ department, priority, subject, description, user: req.user._id });
        await newTicket.save();
        res.status(201).send('Ticket submitted');
    } catch (error) {
        res.status(400).send('Error submitting ticket');
    }
});

app.get('/tickets', auth, async (req, res) => {
    try {
        if (req.user.role !== 'IT') {
            return res.status(403).send('Access denied');
        }
        const tickets = await Ticket.find().populate('user', 'name email');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).send('Error fetching tickets');
    }
});

app.get('/tickets/:id', auth, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('user', 'name email');
        if (!ticket) {
            return res.status(404).send('Ticket not found');
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(400).send('Error fetching ticket');
    }
});

// Get all tickets for a specific user
app.get('/user/tickets', auth, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user._id }).populate('user', 'name email');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).send('Error fetching tickets');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
