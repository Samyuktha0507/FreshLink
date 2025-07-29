// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); // <-- USE THE CONSOLIDATED userModel

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's payload (decoded.id is usually the user ID)
      // Select '-password' to exclude the password hash from the user object
      req.user = await User.findById(decoded.id).select('-password');
      
      // If user not found (e.g., deleted user), throw error
      if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found');
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error(error); // Log the actual error for debugging
      res.status(401); // Unauthorized status
      throw new Error('Not authorized, token failed or expired'); // More specific error message
    }
  }

  // If no token is provided in the header
  if (!token) {
    res.status(401); // Unauthorized status
    throw new Error('Not authorized, no token provided'); // More specific error message
  }
});

// Middleware to authorize users based on their role
const authorize = (roles = []) => {
    // If roles is a single string, convert it to an array
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        // Check if user is authenticated (req.user is set by 'protect' middleware)
        // And if roles are specified, check if the user's role is included in the allowed roles
        if (!req.user) { // User must be authenticated first
            res.status(401); // Unauthorized
            throw new Error('Not authorized, user not authenticated');
        }

        if (roles.length && !roles.includes(req.user.role)) {
            res.status(403); // Forbidden status
            throw new Error(`Not authorized. Required roles: ${roles.join(', ')}. Your role: ${req.user.role}`); // More specific error message
        }
        next(); // User is authorized, proceed
    };
};

module.exports = { protect, authorize };
