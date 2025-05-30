const mongoose = require('mongoose');

const WhitelistedEmailSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true },
  allowedRole:  { type: String, enum: ['admin'], default: 'admin' }
});

module.exports = mongoose.model('whitelistedEmail', WhitelistedEmailSchema);
// This model defines a schema for whitelisted emails that can register as admins.
// It includes an email field that must be unique and an allowedRole field that defaults to 'admin'.