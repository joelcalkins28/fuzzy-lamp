// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to database
connectDB();

// Middleware
// Configure CORS to allow requests from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 
app.use(express.json()); // Enable parsing JSON request bodies

/**
 * @description Root endpoint to check if the server is running.
 * @route GET /
 * @access Public
 */
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Define routes
app.use('/api/applications', require('./routes/applications'));
app.use('/api/contacts', require('./routes/contacts'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Any route that is not an API route should be handled by React
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
} else {
  /**
   * @description Root endpoint to check if the server is running.
   * @route GET /
   * @access Public
   */
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Define the port
const PORT = process.env.PORT || 5001; // Use environment variable or default

/**
 * @description Starts the Express server and listens on the defined port.
 */
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

module.exports = app; // Export app for potential testing 