const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.methods.verifyPassword = function(password){
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
