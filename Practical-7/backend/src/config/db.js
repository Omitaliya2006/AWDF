/**
 * MongoDB Database Connection for Practical 7
 * JWT Authentication & Middleware Pipeline
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const mongoose = require('mongoose');

async function connectDB() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_auth_taskmanager_24it029';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(`====================================================`);
    console.log(`🍃 Practical 7 MongoDB Connected!`);
    console.log(`📁 Host:     ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    console.log(`====================================================`);

    return conn;
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    throw err;
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected.');
});

module.exports = connectDB;
