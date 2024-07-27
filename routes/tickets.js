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

router.get('/user/tickets', authenticateToken, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add comment to a ticket
router.post('/tickets/:id/comments', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        ticket.comments.push(req.body.comment);
        await ticket.save();
        res.json(req.body.comment);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.get('/tickets/statistics', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        
        let responseTimes = [];
        let statusChangeTimes = [];

        tickets.forEach(ticket => {
            if (ticket.statusChanges && ticket.statusChanges.length > 0) {
                const responseTime = (ticket.statusChanges[0].timestamp - ticket.createdAt) / 1000 / 60; // in minutes
                responseTimes.push(responseTime);

                ticket.statusChanges.forEach((change, index) => {
                    if (index > 0) {
                        const statusChangeTime = (change.timestamp - ticket.statusChanges[index - 1].timestamp) / 1000 / 60; // in minutes
                        statusChangeTimes.push(statusChangeTime);
                    }
                });
            }
        });

        const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        const averageStatusChangeTime = statusChangeTimes.reduce((a, b) => a + b, 0) / statusChangeTimes.length;

        res.json({ averageResponseTime, averageStatusChangeTime });
    } catch (error) {
        res.status(500).send('Server error');
    }
}); 

module.exports = router;
