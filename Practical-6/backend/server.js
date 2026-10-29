/**
 * Practical 6: Full Stack Integration (React + Node.js/Express + MongoDB)
 *
 * Student Name: Om Italiya
 * Roll Number:  24IT029
 * Department:   Information Technology, CSPIT (CHARUSAT)
 * Course:       Advanced Web Development Frameworks (AWDF)
 * CO / PO:      CO2, CO3, CO4 / PO3, PO5
 *
 * Architecture:
 * React Client (Vite) <---> Express REST API (Node.js) <---> Mongoose ODM <---> MongoDB
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const connectDB = require('./src/config/db');
const Task = require('./src/models/Task');
const taskRoutes = require('./src/routes/taskRoutes');
const logger = require('./src/middleware/logger');
const { notFoundHandler, globalErrorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Seed Initial Data if empty
connectDB()
  .then(async () => {
    try {
      const count = await Task.countDocuments();
      if (count === 0) {
        await Task.insertMany([
          {
            title: 'Connect React Frontend to Express Backend',
            description: 'Fetch tasks via REST API and render with reactive state and loading spinners.',
            completed: true,
            priority: 'high'
          },
          {
            title: 'Implement Full-Stack CRUD Operations',
            description: 'Support create, read, update, toggle complete, and delete across frontend and MongoDB.',
            completed: true,
            priority: 'high'
          },
          {
            title: 'Prepare for AWDF Lab Evaluation & Viva',
            description: 'Review architecture diagram, CORS handling, Mongoose ODM, and HTTP status codes.',
            completed: false,
            priority: 'medium'
          }
        ]);
        console.log('🌱 Practical 6 database auto-seeded with 3 sample tasks.');
      }
    } catch (seedErr) {
      console.warn('Notice: Seeding check skipped:', seedErr.message);
    }
  })
  .catch((err) => {
    console.error('Fatal database startup notice:', err.message);
  });

// 1. CORS Middleware (Permit React Vite dev server on 5173 or other local origins)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Request Logging Middleware
app.use(logger);

// 3. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Root Endpoint - Basic API Status
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to AWDF Practical 6 Full-Stack Task Manager Backend API',
    student: {
      name: 'Om Italiya',
      rollNo: '24IT029',
      institution: 'CSPIT - CHARUSAT',
      department: 'Information Technology'
    },
    endpoints: {
      health: 'GET /api/health',
      metadata: 'GET /api',
      tasks: 'GET /tasks',
      createTask: 'POST /tasks',
      taskById: 'GET /tasks/:id',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id',
      seedTasks: 'POST /tasks/seed'
    },
    statusCode: 200
  });
});

// 5. API Meta & Health Information
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Full-Stack Task Manager REST API',
    course: 'AWDF Practical 6',
    student: {
      name: 'Om Italiya',
      rollNo: '24IT029',
      institution: 'CSPIT - CHARUSAT',
      department: 'Information Technology'
    },
    database: {
      name: mongoose.connection.name || 'awdf_fullstack_24it029',
      host: mongoose.connection.host || '127.0.0.1',
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected',
      readyState: mongoose.connection.readyState
    },
    schema: {
      model: 'Task',
      fields: [
        'title (String, required, minlength: 2, trim: true)',
        'description (String, trim: true)',
        'completed (Boolean, default: false)',
        'priority (String, enum: low|medium|high, default: medium)',
        'createdAt (Date, default: Date.now)',
        'updatedAt (Date, updated via pre-save)'
      ]
    },
    statusCode: 200
  });
});

// Health check endpoint for React frontend monitor
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
      name: mongoose.connection.name || 'awdf_fullstack_24it029'
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

// 6. Mount CRUD Task Routes
app.use('/tasks', taskRoutes);

// 7. 404 Handler for undefined routes
app.use(notFoundHandler);

// 8. Global Centralized Error Handler (Defined LAST in pipeline)
app.use(globalErrorHandler);

// Start server if run directly
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Practical 6 Backend running on port ${PORT}`);
    console.log(`👤 Student: Om Italiya (24IT029) - CSPIT CHARUSAT`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`📋 API Docs: http://localhost:${PORT}/api`);
    console.log(`📋 Tasks:    http://localhost:${PORT}/tasks`);
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

