require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: MONGO_URI or JWT_SECRET is not defined in .env file');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// --- CORS Configuration Start ---
// IMPORTANT: Replace this with your actual Vercel frontend URL
const frontendURL = "https://your-frontend-app.vercel.app"; 

const corsOptions = {
  origin: frontendURL,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// --- CORS Configuration End ---


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));

app.get('/', (req, res) => {
  res.send('🚀 FreshLink Backend Running!');
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
