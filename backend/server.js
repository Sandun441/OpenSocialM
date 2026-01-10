const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const postRoutes = require('./routes/posts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Improved MongoDB Connection Logic
const connectDB = async () => {
  try {
    // Note: Options like useNewUrlParser are no longer needed in modern Mongoose
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

// Call the connection function
connectDB();

app.use('/api/chat', chatRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/posts', postRoutes);

app.use('/api/events', require('./routes/events'));

app.use('/api/academic', require('./routes/academic'));

app.use('/api/discussion', require('./routes/discussion'));

// 2. Health Check Route (Good practice for debugging)
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
