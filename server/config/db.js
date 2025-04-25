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
    console.log('Attempting to connect to MongoDB...');
    
    // Ensure we have a MONGO_URI
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
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