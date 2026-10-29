/**
 * Practical 4: Task Manager RESTful API Server
 *
 * Student Name: Om Italiya
 * Roll Number:  24IT029
 * Department:   Information Technology, CSPIT (CHARUSAT)
 * Course:       Advanced Web Development Frameworks (AWDF)
 * CO / PO:      CO2 / PO3, PO5
 *
 * Pipeline Architecture:
 * Client Request
 *   │
 *   ▼
 * 1. [CORS Middleware]
 *   │
 *   ▼
 * 2. [Global Request Logging Middleware] (Logs Method, URL, Timestamp, Latency)
 *   │
 *   ▼
 * 3. [express.json() Body Parser]
 *   │
 *   ▼
 * 4. [Static Files Middleware] (Serves interactive test dashboard from /public)
 *   │
 *   ▼
 * 5. Express Routers (/tasks, /simulate-error, /api/logs)
 *   │
 *   ▼
 * 6. [404 Not Found Middleware] (Structured JSON response for undefined routes)
 *   │
 *   ▼
 * 7. [Global Centralized Error Handling Middleware (err, req, res, next)] (Defined LAST)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const logger = require('./src/middleware/logger');
const taskRoutes = require('./src/routes/taskRoutes');
const { notFoundHandler, globalErrorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Cross-Origin Resource Sharing
app.use(cors());

// 2. Step 3: Request Logging Middleware applied GLOBALLY
app.use(logger);

// 3. Step 2: Body Parsing Middleware for JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Serve Static Frontend Dashboard
app.use(express.static(path.join(__dirname, 'public')));

// 5. API Meta & Health Information Route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Task Manager RESTful API',
    course: 'AWDF Practical 4',
    student: {
      name: 'Om Italiya',
      rollNo: '24IT029',
      institution: 'CSPIT - CHARUSAT',
      department: 'Information Technology'
    },
    version: '1.0.0',
    documentation: {
      routes: [
        { method: 'GET', path: '/tasks', description: 'Retrieve all tasks (with ?status & ?priority filtering)' },
        { method: 'GET', path: '/tasks/:id', description: 'Retrieve task by ID' },
        { method: 'POST', path: '/tasks', description: 'Create a new task (requires Content-Type: application/json)' },
        { method: 'PUT', path: '/tasks/:id', description: 'Update an existing task by ID' },
        { method: 'DELETE', path: '/tasks/:id', description: 'Delete a task by ID' },
        { method: 'GET', path: '/simulate-error', description: 'Simulate 500 Internal Error to test Global Error Handler' },
        { method: 'GET', path: '/api/logs', description: 'View live request logs captured by middleware' }
      ]
    },
    statusCode: 200
  });
});

// Live server logs endpoint for the interactive dashboard
app.get('/api/logs', (req, res) => {
  res.status(200).json({
    success: true,
    count: logger.getLogs().length,
    logs: logger.getLogs()
  });
});

// Step 4: Mount CRUD Task Routes
app.use('/tasks', taskRoutes);

// Faculty Teaching Guide: Endpoint that deliberately throws an unhandled error
// to demonstrate the global error handler catching it in the pipeline
app.get('/simulate-error', (req, res, next) => {
  console.log('[SIMULATE-ERROR] Deliberately throwing uncaught error for lab evaluation...');
  const deliberateError = new Error('Simulated Uncaught Exception: Database connection timeout failure.');
  deliberateError.statusCode = 500;
  next(deliberateError);
});

// Supplementary Problem 3: 404 Handler for undefined routes
app.use(notFoundHandler);

// Step 5: Global Error Handling Middleware defined as the LAST middleware
app.use(globalErrorHandler);

// Start server when run directly
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Task Manager RESTful API Server running on port ${PORT}`);
    console.log(`👤 Student: Om Italiya (24IT029) - CSPIT CHARUSAT`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`📋 API Docs: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const fallbackPort = Number(PORT) + 1;
      console.warn(`Port ${PORT} is currently in use. Switching to fallback port ${fallbackPort}...`);
      app.listen(fallbackPort, () => {
        console.log(`🚀 Task Manager API running on fallback port ${fallbackPort}`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
}

module.exports = app;
