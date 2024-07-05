const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid')
const ticketSchema = new mongoose.Schema({
    department: { type: String, required: true },
    priority: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Working on it', 'Closed'], default: 'Open' } // New status field
});

module.exports = mongoose.model('Ticket', ticketSchema);
