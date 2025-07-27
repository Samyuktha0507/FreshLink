const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, enum: ['vendor', 'producer', 'driver'] },
  password: String,
  contact: String,
});

module.exports = mongoose.model('User', userSchema);
