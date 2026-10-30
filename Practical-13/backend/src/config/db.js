/**
 * Practical 13: AI API Integration into a Web Application
 * Database Connection Module
 * Author: Om Italiya (24IT029)
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/awdf_ai_24it029';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      autoIndex: true
    });
    console.log(`[AI Backend DB] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[AI Backend DB WARNING] MongoDB connection failed (${error.message}). Running in fallback mode.`);
    return null;
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('[AI Backend DB] Disconnected gracefully.');
    }
  } catch (error) {
    console.warn(`[AI Backend DB] Disconnect error: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
