const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting to MongoDB (Atlas or Local fallback)
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/noteninja';
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Primary Connection Error: ${error.message}. Attempting local fallback...`);
    try {
      const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/noteninja');
      console.log(`MongoDB Connected (Local Fallback): ${fallbackConn.connection.host}`);
    } catch (fallbackError) {
      console.error(`MongoDB Fallback Connection Error: ${fallbackError.message}`);
      // Keep server running for API mock/test capabilities
    }
  }
};

module.exports = connectDB;
