/**
 * Database Connection Module (Lab Step 2 & Rubrics: 3 Marks)
 * Connects Mongoose to MongoDB with connection string from .env,
 * handling events and logging connection status.
 */

const mongoose = require('mongoose');

async function connectDB() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_task_manager_24it029';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // Fast failover if database server is unreachable
    });

    console.log(`====================================================`);
    console.log(`🍃 MongoDB Connected Successfully!`);
    console.log(`📁 Host:     ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    console.log(`🔌 State:    ${conn.connection.readyState === 1 ? 'Connected (1)' : conn.connection.readyState}`);
    console.log(`====================================================`);

    return conn;
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.error(`💡 Tip: Verify that MongoDB Server is running or check MONGO_URI in .env`);
    // Re-throw so caller or test runner is aware
    throw err;
  }
}

// Connection event monitors
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection lost. Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected successfully.');
});

module.exports = connectDB;
