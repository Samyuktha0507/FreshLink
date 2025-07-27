const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [String],
  total: Number,
  deliveryType: String,
  paymentStatus: String,
});

module.exports = mongoose.model('Order', orderSchema);
