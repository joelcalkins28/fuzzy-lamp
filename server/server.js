// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
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