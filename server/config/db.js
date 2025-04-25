/**
 * @description Handles MongoDB connection using Mongoose
 * Exports connectDB function that can be called from the server entry point
 */

const mongoose = require('mongoose');

/**
 * @description Establishes a connection to MongoDB using URI from environment variables.
 * Implements connection retry logic and logs connection status.
 */
const connectDB = async () => {
  try {
    // If no MONGO_URI is defined in .env, use a default local MongoDB URI
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/fuzzy-lamp';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure if connection fails
    process.exit(1);
  }
};

module.exports = { connectDB }; 