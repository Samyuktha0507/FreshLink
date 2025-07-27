const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cost: Number,
  status: String,
});

module.exports = mongoose.model('Delivery', deliverySchema);
