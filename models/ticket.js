const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid')
const ticketSchema = new mongoose.Schema({
    // ticketID: { type: String, default: generateTicketId, unique: true },
    department: { type: String, required: true },
    priority: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String, required: true },
    ticketID: { type: String, required: true},
    comments: { type: String},  
    comments: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    statusChanges: [{
        status: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    status: { type: String, enum: ['Open', 'Working on it', 'Closed'], default: 'Open' } // New status field
});

// function generateTicketId() {
//   return Math.floor(10000 + Math.random() * 90000).toString(); // Generates a 5-digit number
// }

module.exports = mongoose.model('Ticket', ticketSchema);
