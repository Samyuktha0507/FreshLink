const asyncHandler = require('express-async-handler');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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

module.exports = {
  getDeliveryFee,
};
