const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error.middleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

const ingestRoutes = require('./routes/ingest.routes');
const analyticsRoutes = require('./routes/analytics.routes');

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Order Analytics API is running'
  });
});

app.use('/api/ingest', ingestRoutes);
app.use('/api/analytics', analyticsRoutes);

// Centralized error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
