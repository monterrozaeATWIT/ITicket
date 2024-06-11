const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid')

// Template for ticket
const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  id: { type: String, default: uuidv4, unique: true, required: true},
  created: { type: Date, default: Date.now }, 
  description: { type: String },
  priority: { type: String },
  department: { type: String, required: true },
  status: { type: String, default: 'open' }
  // Todo: add username field
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
