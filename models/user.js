const mongoose = require('mongoose');

// Template for new user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }
  // Todo: add department field (and password field?)
});

module.exports = mongoose.model('User', userSchema);
