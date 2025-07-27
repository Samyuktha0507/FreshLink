const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  producerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  qualityTier: String,
  quantity: Number,
  // Storing location as a GeoJSON Point for geospatial queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [80.2707, 13.0827] // Default to Chennai
    }
  }
});

module.exports = mongoose.model('Product', productSchema);
