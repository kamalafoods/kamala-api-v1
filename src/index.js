const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./db');
const authRoutes = require('./routes/authRoutes');
const pickleRoutes = require('./routes/pickleRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Kamala API is running' });
});

// Routes
app.use('/api', authRoutes);
app.use('/api', pickleRoutes);
app.use('/api', userRoutes);

// Start server
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kamala-api';

async function start() {
  try {
    await connectToDatabase(MONGODB_URI);

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

