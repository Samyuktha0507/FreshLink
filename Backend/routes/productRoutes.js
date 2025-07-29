// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
// Import the entire controller object
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

console.log('productRoutes.js: Loading...');
console.log('productController object:', productController);
console.log('productController.getProducts:', productController.getProducts);

// Define routes for products
router.route('/')
    .get(productController.getProducts) // Use productController.getProducts
    .post(protect, authorize(['producer']), productController.addProduct); // Use productController.addProduct

router.route('/:id')
    .put(protect, authorize(['producer']), productController.updateProduct) // Use productController.updateProduct
    .delete(protect, authorize(['producer']), productController.deleteProduct); // Use productController.deleteProduct

module.exports = router;
