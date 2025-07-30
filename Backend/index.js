require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// --- IMPORTANT: Vercel Frontend URL ---
// Define the allowed frontend origins as an array
const allowedFrontendOrigins = [
  "https://fresh-link-00001.vercel.app",
  "https://fresh-link-00001.vercel.app/", // Include with trailing slash
  "https://fresh-link-00001-15buixvpy-samyukthas-projects-e3a77e2d.vercel.app", // <-- ADDED THIS NEW VERCEL DOMAIN
  "https://fresh-link-00001-15buixvpy-samyukthas-projects-e3a77e2d.vercel.app/" // Include with trailing slash
];

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: MONGO_URI or JWT_SECRET is not defined in .env file');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// --- CORS Configuration ---
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in the allowed list or is a localhost development origin
    if (allowedFrontendOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      console.log(`CORS Blocked: Origin ${origin} is not allowed.`); // Log for debugging
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true // Crucial for sending/receiving cookies (if you use them for auth)
};
app.use(cors(corsOptions));
// --- End CORS Configuration ---

app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

app.get('/', (req, res) => {
  res.send('🚀 FreshLink Backend Running!');
});

app.use(errorHandler); // Error handling middleware should be last

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
