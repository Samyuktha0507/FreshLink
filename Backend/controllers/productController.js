// backend/controllers/productController.js

const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel'); // Import Product model
const User = require('../models/userModel'); // Import User model (needed for producer check)

// @desc    Get all products
// @route   GET /api/products
// @access  Public (or Private if you want only logged-in users to see products)
const getProducts = asyncHandler(async (req, res) => {
    // You can add filtering/pagination here if needed
    const products = await Product.find({}); // Find all products
    res.status(200).json(products);
});

// @desc    Add a new product
// @route   POST /api/products
// @access  Private (Producer only)
const addProduct = asyncHandler(async (req, res) => {
    const { name, companyName, category, stock, price, image } = req.body;

    // Basic validation
    if (!name || !companyName || !category || !stock || !price) {
        res.status(400);
        throw new Error('Please add all required product fields');
    }

    // Ensure the logged-in user is a producer (req.user is set by protect middleware)
    if (req.user.role !== 'producer') {
        res.status(403); // Forbidden
        throw new Error('Not authorized to add products');
    }

    const product = await Product.create({
        name,
        companyName,
        category,
        stock,
        price,
        image: image || 'https://placehold.co/300x200/cccccc/333?text=No+Image', // Default image if none provided
        user: req.user.id, // Link product to the producer who created it
    });

    res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Producer only, and only their own products)
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Product ID from URL
    const { name, companyName, category, stock, price, image } = req.body;

    const product = await Product.findById(id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Check if the logged-in user is the owner of the product
    if (product.user.toString() !== req.user.id) {
        res.status(401); // Unauthorized
        throw new Error('User not authorized to update this product');
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, companyName, category, stock, price, image }, // Update specific fields
        { new: true } // Return the updated document
    );

    res.status(200).json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Producer only, and only their own products)
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Product ID from URL

    const product = await Product.findById(id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Check if the logged-in user is the owner of the product
    if (product.user.toString() !== req.user.id) {
        res.status(401); // Unauthorized
        throw new Error('User not authorized to delete this product');
    }

    await Product.findByIdAndDelete(id); // Use findByIdAndDelete for simplicity

    res.status(200).json({ message: 'Product removed' });
});

module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
};
