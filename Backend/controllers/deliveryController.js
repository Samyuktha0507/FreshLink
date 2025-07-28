const asyncHandler = require('express-async-handler');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// Assuming you have a DeliveryPartner model to save the partner details
// If you don't have this model, you'll need to create it in backend/models/
const DeliveryPartner = require('../models/deliveryPartnerModel'); 

// Helper function to get distance from OpenRouteService
const getDistanceKm = async (origin, dest) => {
    const { lat: origin_lat, lng: origin_lng } = origin;
    const { lat: dest_lat, lng: dest_lng } = dest;

    const url = "https://api.openrouteservice.org/v2/directions/driving-car";
    const headers = { "Authorization": process.env.ORS_API_KEY };
    const payload = {
        "coordinates": [
            [parseFloat(origin_lng), parseFloat(origin_lat)],
            [parseFloat(dest_lng), parseFloat(dest_lat)]
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { ...headers, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        const distanceMeters = data.routes[0].summary.distance;
        return distanceMeters / 1000; // Convert meters to km
    } catch (error) {
        console.error("OpenRouteService API Error:", error);
        return null;
    }
};

// @desc    Calculate delivery fee based on distance
// @route   POST /api/delivery/calculate-fee
// @access  Public
const getDeliveryFee = asyncHandler(async (req, res) => {
    const { cartItems, userLocation } = req.body;

    if (!cartItems || cartItems.length === 0 || !userLocation) {
        res.status(400);
        throw new Error('Cart items and user location are required.');
    }

    // In a real app, you'd get this from the product/producer data.
    // For this demo, we'll hardcode the producer's warehouse in Chennai.
    const producerLocation = { lat: 13.0827, lng: 80.2707 }; // Chennai coordinates

    const distanceKm = await getDistanceKm(producerLocation, userLocation);

    if (distanceKm === null) {
        res.status(500);
        throw new Error('Could not calculate the distance for delivery.');
    }

    // Dynamic fee calculation
    const baseRate = 50; // Base fee
    const ratePerKm = 10; // Fee per kilometer
    const standardFee = Math.round(baseRate + (distanceKm * ratePerKm));
    const instantFee = Math.round(standardFee * 1.8); // Instant is 80% more expensive

    res.json({
        distance: distanceKm.toFixed(2),
        standardFee,
        instantFee
    });
});

// @desc    Register a new delivery partner
// @route   POST /api/delivery/register-partner
// @access  Public (or Private if you add authentication)
const registerDeliveryPartner = asyncHandler(async (req, res) => {
    const { name, contact, aadhaar } = req.body;

    // Basic validation
    if (!name || !contact || !aadhaar) {
        res.status(400);
        throw new Error('Please enter all required fields for delivery partner registration.');
    }

    // Optional: Add more validation for contact (e.g., regex for phone number)
    // Optional: Add more validation for aadhaar (e.g., unique check, format)

    // Check if a partner with this Aadhaar already exists (optional but recommended)
    const partnerExists = await DeliveryPartner.findOne({ aadhaar });
    if (partnerExists) {
        res.status(400);
        throw new Error('A delivery partner with this Aadhaar number already exists.');
    }

    const deliveryPartner = await DeliveryPartner.create({
        name,
        contact,
        aadhaar,
        status: 'pending' // Default status
    });

    if (deliveryPartner) {
        res.status(201).json({
            message: 'Delivery partner registered successfully',
            partner: {
                id: deliveryPartner._id,
                name: deliveryPartner.name,
                contact: deliveryPartner.contact,
                status: deliveryPartner.status
            }
        });
    } else {
        res.status(400);
        throw new Error('Invalid delivery partner data');
    }
});


module.exports = {
    getDeliveryFee,
    registerDeliveryPartner // <-- NEW: Export the new function
};
