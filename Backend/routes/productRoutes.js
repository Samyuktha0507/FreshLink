// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController'); // Import controller functions
const { protect, authorize } = require('../middleware/authMiddleware'); // Assuming you have authMiddleware

// Define routes for products
// Protect routes that require authentication (e.g., for producers)
router.route('/')
    .get(getProducts) // GET /api/products (to fetch all products)
    .post(protect, authorize(['producer']), addProduct); // POST /api/products (to add a new product, only by producers)

router.route('/:id')
    .put(protect, authorize(['producer']), updateProduct) // PUT /api/products/:id (to update a product, only by producers)
    .delete(protect, authorize(['producer']), deleteProduct); // DELETE /api/products/:id (to delete a product, only by producers)

module.exports = router;
