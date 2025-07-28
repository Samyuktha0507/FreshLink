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
      enum: ['vendor', 'producer', 'delivery-partner', 'admin'], // Define your roles
      default: 'vendor', // Default role for new users
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
