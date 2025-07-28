// backend/models/deliveryPartnerModel.js
const mongoose = require('mongoose');

const deliveryPartnerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    contact: {
      type: String,
      required: [true, 'Please add a contact number'],
      unique: true, // Assuming contact number should be unique
    },
    aadhaar: {
      type: String,
      required: [true, 'Please add an Aadhaar number'],
      unique: true, // Aadhaar number should be unique
      length: 12, // Ensure it's 12 digits
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'], // Example statuses
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
