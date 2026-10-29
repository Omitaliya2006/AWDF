/**
 * Practical 9: In-Memory Caching and Query Optimization
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
const cacheRoutes = require('./src/routes/cacheRoutes');
const cache = require('./src/config/cache');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Mount API routes
app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes); // Direct root mapping for lab manual compatibility
app.use('/api/cache', cacheRoutes);
app.use('/cache', cacheRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Practical 9: In-Memory Caching & Query Optimization',
    student: 'Om Italiya (24IT029)',
    status: 'online',
    cachingEngine: 'node-cache',
    ttl: cache.options.stdTTL,
    endpoints: {
      tasks: '/api/tasks',
      singleTask: '/api/tasks/:id',
      cacheStats: '/api/cache/stats',
      cacheFlush: 'POST /api/cache/flush',
      benchmark: '/api/cache/benchmark'
    }
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start server if not run via require in tests
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 [Server] Practical 9 Server running on port ${PORT}`);
    console.log(`⚡ [Cache Engine] node-cache active with ${cache.options.stdTTL}s TTL`);
    console.log(`🔍 [Debug] Live stats at http://localhost:${PORT}/api/cache/stats`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Gracefully shutting down server...');
    server.close(() => {
      console.log('✅ HTTP server closed.');
      process.exit(0);
    });
  });
}

module.exports = app;
