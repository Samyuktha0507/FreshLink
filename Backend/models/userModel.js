// backend/models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Needed for password hashing

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: { // To distinguish between 'vendor', 'producer', 'delivery-partner', etc.
      type: String,
      enum: ['vendor', 'producer', 'driver', 'admin'], // Define your roles, 'driver' for delivery partner
      default: 'vendor', // Default role for new users
    },
    contact: { // Added from the simpler User.js model
      type: String,
      required: false, // Made optional, as it might not be required for all user types
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { // Only hash if password field is new or modified
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if the model already exists before compiling it
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
