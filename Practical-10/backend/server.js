/**
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * Student: Om Italiya (24IT029)
 * Institution: CSPIT - CHARUSAT
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const requestLogger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

// CRITICAL: Ensure event listeners are registered once at server startup
require('./src/listeners/taskListeners');

const taskRoutes = require('./src/routes/taskRoutes');
const eventRoutes = require('./src/routes/eventRoutes');

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
app.use('/tasks', taskRoutes); // Direct mapping for lab manual compatibility
app.use('/api/events', eventRoutes);
app.use('/events', eventRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Practical 10: Asynchronous Processing with Event-Driven Architecture',
    student: 'Om Italiya (24IT029)',
    status: 'online',
    architecture: 'Node.js native EventEmitter (Decoupled background processing)',
    endpoints: {
      tasks: '/api/tasks',
      eventLogs: '/api/events/logs',
      eventStats: '/api/events/stats',
      eventDelay: 'POST /api/events/delay',
      simulateError: 'POST /api/events/simulate-error'
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
    console.log(`🚀 [Server] Practical 10 Server running on port ${PORT}`);
    console.log(`⚡ [EventEmitter] Native event pipeline active`);
    console.log(`🔍 [Telemetry] Live event audit at http://localhost:${PORT}/api/events/logs`);
  });

  process.on('SIGINT', async () => {
    console.log('\n🛑 Gracefully shutting down server...');
    server.close(() => {
      console.log('✅ HTTP server closed.');
      process.exit(0);
    });
  });
}

module.exports = app;

