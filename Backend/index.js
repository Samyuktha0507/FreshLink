require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// --- IMPORTANT: Vercel Frontend URL ---
// You must replace this with the EXACT URL your Vercel frontend is deployed at.
// Using the primary Vercel domain as requested:
const frontendURL = "https://fresh-link-00001.vercel.app"; 

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: MONGO_URI or JWT_SECRET is not defined in .env file');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// --- CORS Configuration ---
const corsOptions = {
  origin: frontendURL,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// --- End CORS Configuration ---

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
// Assuming you have this route for products, as per previous discussions
app.use('/api/products', require('./routes/productRoutes')); 


app.get('/', (req, res) => {
  res.send('🚀 FreshLink Backend Running!');
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
