// backend/models/productModel.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    user: { // Link to the user (producer) who created the product
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Refers to your User model
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0,
    },
    image: {
      type: String,
      default: 'https://placehold.co/300x200/cccccc/333?text=No+Image', // Placeholder image URL
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Check if the model already exists before compiling it (to prevent OverwriteModelError)
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
