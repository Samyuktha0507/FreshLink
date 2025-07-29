// backend/controllers/productController.js

const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel'); // USE THE CONSOLIDATED productModel
const User = require('../models/userModel'); // USE THE CONSOLIDATED userModel

console.log('productController.js: Loading...');

// @desc    Get all products
// @route   GET /api/products
// @access  Public (or Private if you want only logged-in users to see products)
const getProducts = asyncHandler(async (req, res) => {
    console.log('getProducts: Fetching all products...');
    const products = await Product.find({});
    res.status(200).json(products);
});

// @desc    Add a new product
// @route   POST /api/products
// @access  Private (Producer only)
const addProduct = asyncHandler(async (req, res) => {
    console.log('addProduct: Attempting to add new product...');
    const { name, companyName, category, stock, price, image, location } = req.body;

    if (!name || !companyName || !category || stock === undefined || price === undefined) {
        res.status(400);
        throw new Error('Please add all required product fields: name, companyName, category, stock, price.');
    }

    if (!req.user || req.user.role !== 'producer') {
        res.status(403);
        throw new Error('Not authorized to add products. Only producers can add products.');
    }

    const product = await Product.create({
        name,
        companyName,
        category,
        stock: Number(stock),
        price: Number(price),
        image: image || 'https://placehold.co/300x200/cccccc/333?text=No+Image',
        user: req.user.id,
        location: location
    });

    res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Producer only, and only their own products)
const updateProduct = asyncHandler(async (req, res) => {
    console.log('updateProduct: Attempting to update product...');
    const { id } = req.params;
    const { name, companyName, category, stock, price, image, location } = req.body;

    const product = await Product.findById(id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (!req.user || req.user.role !== 'producer') {
        res.status(403);
        throw new Error('Not authorized to update products. Only producers can update products.');
    }

    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to update this product. You can only update your own products.');
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
            name,
            companyName,
            category,
            stock: Number(stock),
            price: Number(price),
            image: image || 'https://placehold.co/300x200/cccccc/333?text=No+Image',
            location
        },
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Producer only, and only their own products)
const deleteProduct = asyncHandler(async (req, res) => {
    console.log('deleteProduct: Attempting to delete product...');
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (!req.user || req.user.role !== 'producer') {
        res.status(403);
        throw new Error('Not authorized to delete products. Only producers can delete products.');
    }

    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to delete this product. You can only delete your own products.');
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'Product removed successfully', id: id });
});

module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
};
