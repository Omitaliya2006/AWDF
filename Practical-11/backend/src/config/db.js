const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://mongodb:27017/taskdb';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Timeout fast if service name not reachable
    });
    console.log(`✅ [Database] Connected to MongoDB: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    // If running outside Docker and mongodb:27017 is unreachable, attempt localhost fallback
    if (uri.includes('mongodb://mongodb:27017')) {
      console.warn(`⚠️ [Database] Could not reach "mongodb:27017" (outside container). Retrying localhost fallback...`);
      try {
        const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/awdf_docker_24it029');
        console.log(`✅ [Database] Connected via localhost fallback: ${fallbackConn.connection.host}/${fallbackConn.connection.name}`);
        return fallbackConn;
      } catch (fallbackError) {
        console.error(`❌ [Database Error] Localhost fallback failed: ${fallbackError.message}`);
      }
    }
    console.error(`❌ [Database Error] Failed to connect: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
