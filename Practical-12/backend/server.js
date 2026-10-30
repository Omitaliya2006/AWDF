/**
 * Practical 12: CI/CD Pipeline with GitHub Actions
 * Main Express Application Server
 * Author: Om Italiya (24IT029)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, disconnectDB } = require('./src/config/db');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint (Essential for CI/CD Container Probes)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Practical 12 Task Management API',
    author: 'Om Italiya (24IT029)',
    ciReady: true
  });
});

// Task Management API Routes
app.use('/api/tasks', taskRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server only when executed directly (not when required by Jest / Supertest)
let serverInstance = null;
if (require.main === module) {
  connectDB().then(() => {
    serverInstance = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` Practical 12: CI/CD Pipeline with GitHub Actions`);
      console.log(` Student: Om Italiya | Roll No: 24IT029`);
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(` CI Telemetry: http://localhost:${PORT}/api/tasks/ci-status`);
      console.log(`====================================================`);
    });
  });

  const handleShutdown = async () => {
    console.log('\n[Server] Graceful shutdown initiated...');
    if (serverInstance) {
      serverInstance.close(async () => {
        await disconnectDB();
        console.log('[Server] Server closed and DB disconnected.');
        process.exit(0);
      });
    } else {
      await disconnectDB();
      process.exit(0);
    }
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
}

module.exports = app;
