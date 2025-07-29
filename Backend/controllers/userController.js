const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); // <-- USE THE CONSOLIDATED userModel
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, contact } = req.body;

  // Ensure role is one of the allowed enum values, default to 'vendor' if not provided for safety
  // The enum is defined in userModel.js: ['vendor', 'producer', 'driver', 'admin']
  const allowedRoles = ['vendor', 'producer', 'driver', 'admin'];
  const finalRole = role && allowedRoles.includes(role) ? role : 'vendor';

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add name, email, and password.');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists.');
  }

  // Password hashing is now handled by the pre-save hook in userModel.js
  const user = await User.create({
    name,
    email,
    password, // Password will be hashed by the pre-save hook
    role: finalRole, // Use the validated/defaulted role
    contact, // Include contact field
  });

  if (user) {
    res.status(201).json({
      _id: user.id, // Mongoose virtual 'id' getter
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided.');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Use the matchPassword method from userModel.js
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id, // Mongoose virtual 'id' getter
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // Changed to 401 Unauthorized for security best practice
    throw new Error('Invalid email or password.');
  }
});

module.exports = {
  registerUser,
  loginUser,
};
