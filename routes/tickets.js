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

// Edit an existing ticket with provided ticket ID
router.put('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true
    });

    res.send(ticket);
  } catch (err) {
    res.status(404).send({ error: 'Ticket not found' });
  }
});

module.exports = router;
