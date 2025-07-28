// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); // Assuming your User model path is correct

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
      
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error(error); // Log the actual error for debugging
      res.status(401); // Unauthorized status
      throw new Error('Not authorized, token failed'); // Error message for the client
    }
  }

  // If no token is provided in the header
  if (!token) {
    res.status(401); // Unauthorized status
    throw new Error('Not authorized, no token'); // Error message for the client
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
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            res.status(403); // Forbidden status
            throw new Error('Not authorized to access this route'); // Error message for the client
        }
        next(); // User is authorized, proceed
    };
};

module.exports = { protect, authorize };
