const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket');

// Get all tickets
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('user', 'name email');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).send('Error fetching tickets: ' + error.message);
    }
});


// Get a single ticket by ID
router.get('/tickets/:id', async (req, res) => {
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

module.exports = router;
