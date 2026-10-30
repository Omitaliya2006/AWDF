/**
 * Practical 12: CI/CD Pipeline with GitHub Actions
 * Database Connection Module
 * Author: Om Italiya (24IT029)
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/awdf_ci_24it029';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      autoIndex: true
    });
    console.log(`[CI DB] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[CI DB WARNING] MongoDB connection failed (${error.message}). Running in fallback mode.`);
    return null;
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('[CI DB] MongoDB disconnected gracefully.');
    }
  } catch (error) {
    console.warn(`[CI DB] Error during disconnect: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
