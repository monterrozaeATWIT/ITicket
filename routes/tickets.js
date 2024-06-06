const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket');

// Create a new ticket
router.post('/', async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).send(ticket);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
