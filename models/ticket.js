const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  id: { type: String, required: true },
  created: { type: Date, default: Date.now },
  description: { type: String },
  status: { type: String, default: 'open' }
});

module.exports = mongoose.model('Ticket', ticketSchema);
