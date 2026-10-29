/**
 * Practical 7: Authentication and Middleware Pipeline
 *
 * Student Name: Om Italiya
 * Roll Number:  24IT029
 * Department:   Information Technology, CSPIT (CHARUSAT)
 * Course:       Advanced Web Development Frameworks (AWDF)
 * CO / PO:      CO2, CO6 / PO3, PO5
 *
 * Architecture:
 * Client Request (Authorization: Bearer <token>)
 *   │
 *   ▼
 * 1. [CORS Middleware]
 *   │
 *   ▼
 * 2. [Request Logger Middleware]
 *   │
 *   ▼
 * 3. [Body Parser Middleware] (express.json)
 *   │
 *   ▼
 * 4. [Auth Middleware] -> verifies JWT token -> sets req.user
 *   │
 *   ▼
 * 5. [Validation Middleware] -> checks inputs (email, password, title, priority)
 *   │
 *   ▼
 * 6. Controller Handlers (User & Task Models in MongoDB)
 *   │
 *   ▼
 * 7. [Global Centralized Error Handler] (Clean JSON, NO stack traces exposed)
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const logger = require('./src/middleware/logger');
const { notFoundHandler, globalErrorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().catch((err) => {
  console.error('Fatal database startup notice:', err.message);
});

// 1. CORS Middleware (Permits React Vite dev client on port 5173 or other origins)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 2. Request Logging Middleware
app.use(logger);

// 3. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Root Endpoint - Basic API Status
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to AWDF Practical 7: JWT Authentication & Middleware Pipeline API',
    student: {
      name: 'Om Italiya',
      rollNo: '24IT029',
      institution: 'CSPIT - CHARUSAT',
      department: 'Information Technology'
    },
    endpoints: {
      health: 'GET /api/health',
      metadata: 'GET /api',
      register: 'POST /auth/register',
      login: 'POST /auth/login',
      currentUser: 'GET /auth/me (Protected)',
      tasks: 'GET /tasks (Protected)',
      createTask: 'POST /tasks (Protected, Validated)',
      taskById: 'GET /tasks/:id (Protected)',
      updateTask: 'PUT /tasks/:id (Protected, Validated)',
      deleteTask: 'DELETE /tasks/:id (Protected)',
      seedTasks: 'POST /tasks/seed (Protected)'
    },
    statusCode: 200
  });
});

// 5. API Meta & Health Information
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'JWT Authentication & Task Manager REST API',
    course: 'AWDF Practical 7',
    student: {
      name: 'Om Italiya',
      rollNo: '24IT029',
      institution: 'CSPIT - CHARUSAT',
      department: 'Information Technology'
    },
    database: {
      name: mongoose.connection.name || 'awdf_auth_taskmanager_24it029',
      host: mongoose.connection.host || '127.0.0.1',
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected',
      readyState: mongoose.connection.readyState
    },
    pipeline: [
      '1. CORS',
      '2. Request Logger',
      '3. express.json() Body Parser',
      '4. Authentication Middleware (JWT Bearer Token verification)',
      '5. Validation Middleware (At least 3 rules: email, password, title, priority)',
      '6. Route Controllers (Scoped to req.user.id)',
      '7. Global Centralized Error Handler (Consistent JSON, no stack traces)'
    ],
    statusCode: 200
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    success: true,
    status: 'healthy',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      readyState: dbState,
      name: mongoose.connection.name || 'awdf_auth_taskmanager_24it029'
    },
    statusCode: 200
  });
});

// Live server logs endpoint
app.get('/api/logs', (req, res) => {
  res.status(200).json({
    success: true,
    count: logger.getLogs().length,
    logs: logger.getLogs()
  });
});

// 6. Mount Authentication Routes (support both /auth and /api/auth)
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

// 7. Mount Protected Task Routes (support both /tasks and /api/tasks)
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);

// 8. 404 Handler for undefined routes
app.use(notFoundHandler);

// 9. Global Centralized Error Handler (Defined LAST in pipeline)
app.use(globalErrorHandler);

// Start server if run directly
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🔐 Practical 7 Server running on port ${PORT}`);
    console.log(`👤 Student: Om Italiya (24IT029) - CSPIT CHARUSAT`);
    console.log(`🌐 Base URL:   http://localhost:${PORT}`);
    console.log(`🔑 Auth API:   http://localhost:${PORT}/auth`);
    console.log(`📋 Tasks API:  http://localhost:${PORT}/tasks (Protected)`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const fallbackPort = Number(PORT) + 1;
      console.warn(`Port ${PORT} in use. Starting on fallback port ${fallbackPort}...`);
      server = app.listen(fallbackPort, () => {
        console.log(`🚀 Backend running on fallback port ${fallbackPort}`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
}

module.exports = app;
