// backend/routes/deliveryRoutes.js

const express = require('express');
const router = express.Router();
const {
    getDeliveryFee,
    registerDeliveryPartner // <-- NEW: Import the new controller function
} = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Assuming you have authMiddleware

// Route for calculating delivery fee (existing)
router.post('/calculate-fee', getDeliveryFee);

// <-- NEW: Route for registering a delivery partner -->
// This route should be protected and only accessible by users with a specific role
// (e.g., 'admin' or perhaps 'vendor' if vendors can invite partners, or 'public' if anyone can register)
// For now, I'll make it publicly accessible, as the frontend doesn't seem to enforce login for this page.
// If you want to restrict it, add protect and authorize middleware.
router.post('/register-partner', registerDeliveryPartner); // Matches the endpoint used in DeliveryPartnerPage.jsx

module.exports = router;
