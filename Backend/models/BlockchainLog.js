const mongoose = require('mongoose');
const blockchainLogSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  checkpoints: [
    {
      timestamp: Date,
      location: String,
      hash: String,
    },
  ],
});
module.exports = mongoose.model('BlockchainLog', blockchainLogSchema);