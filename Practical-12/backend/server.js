/**
 * Practical 11: Containerization with Docker and Docker Compose
 * Student: Om Italiya (24IT029)
 * Institution: CSPIT - CHARUSAT
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const requestLogger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB container service
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Mount API routes
app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes); // Direct root mapping for lab manual compatibility

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Practical 11: Containerization with Docker and Docker Compose',
    student: 'Om Italiya (24IT029)',
    service: 'backend',
    status: 'healthy',
    port: PORT,
    containerNetwork: 'app-network',
    database: process.env.MONGODB_URI || 'mongodb://mongodb:27017/taskdb',
    endpoints: {
      tasks: '/api/tasks',
      containerInfo: '/api/tasks/info'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handler
app.use(errorHandler);

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`🐳 [Docker] Backend Service running inside container on port ${PORT}`);
    console.log(`🔗 [Network] Inter-container database URI: ${process.env.MONGODB_URI || 'mongodb://mongodb:27017/taskdb'}`);
  });

  process.on('SIGINT', async () => {
    console.log('\n🛑 Gracefully shutting down backend container...');
    server.close(() => {
      console.log('✅ Backend container stopped.');
      process.exit(0);
    });
  });
}

module.exports = app;
