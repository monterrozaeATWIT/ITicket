const mongoose = require('mongoose');

// Import bycrypt to add hashing function to store passwords securely 
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  department: {type: String },
  password: { type: String, required: true }

});

// Hash the password before storing on MongoDB with 10 rounds of salt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare given password with the database hash with bcrypt
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
