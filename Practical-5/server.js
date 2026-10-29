/**
 * Practical 5: MongoDB Integration and Schema Design with Mongoose
 *
 * Student Name: Om Italiya
 * Roll Number:  24IT029
 * Department:   Information Technology, CSPIT (CHARUSAT)
 * Course:       Advanced Web Development Frameworks (AWDF)
 * CO / PO:      CO2, CO3 / PO3, PO5
 *
 * Architecture:
 * Client Request -> Express -> Mongoose ODM -> MongoDB (tasks collection)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const connectDB = require('./src/config/db');
const Task = require('./src/models/Task');
const taskRoutes = require('./src/routes/taskRoutes');
const logger = require('./src/middleware/logger');
const { notFoundHandler, globalErrorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(async () => {
    // Optional seeding: Insert initial tasks if collection is empty
    try {
      const count = await Task.countDocuments();
      if (count === 0) {
        await Task.insertMany([
          {
            title: 'Implement Mongoose Schema & Validation',
            description: 'Enforce required fields, priority enum, and pre-save hook for Practical 5.',
            completed: true,
            priority: 'high'
          },
          {
            title: 'Connect Express to MongoDB Database',
            description: 'Establish live database connection via Mongoose and verify with mongod.',
            completed: true,
            priority: 'high'
          },
          {
            title: 'Verify CRUD Operations in Postman',
            description: 'Test GET, POST, PUT, DELETE with structured error responses.',
            completed: false,
            priority: 'medium'
          }
        ]);
        console.log('🌱 Database seeded with initial sample tasks.');
      }
    } catch (seedErr) {
      console.warn('Notice: Seeding check skipped:', seedErr.message);
    }
  })
  .catch((err) => {
    console.error('Fatal database startup notice:', err.message);
  });

// 1. CORS
app.use(cors());

// 2. Request Logging Middleware
app.use(logger);

// 3. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Serve Static Frontend Dashboard
app.use(express.static(path.join(__dirname, 'public')));

// 5. API Meta & Health Information
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'MongoDB Task Manager REST API',
    course: 'AWDF Practical 5',
    student: {
      name: 'Om Italiya',
      rollNo: '24IT029',
      institution: 'CSPIT - CHARUSAT',
      department: 'Information Technology'
    },
    database: {
      name: mongoose.connection.name || 'awdf_task_manager_24it029',
      host: mongoose.connection.host || '127.0.0.1',
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected',
      readyState: mongoose.connection.readyState
    },
    schema: {
      model: 'Task',
      fields: ['title (String, required)', 'description (String)', 'completed (Boolean, default false)', 'priority (String, enum: low/medium/high)', 'createdAt (Date)', 'updatedAt (Date)'],
      validation: 'Mongoose schema validation active with pre-save whitespace trimming hook.'
    },
    statusCode: 200
  });
});

// Live server logs endpoint for dashboard
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

// Start server
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Practical 5 Server running on port ${PORT}`);
    console.log(`👤 Student: Om Italiya (24IT029) - CSPIT CHARUSAT`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`📋 API Docs: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const fallbackPort = Number(PORT) + 1;
      console.warn(`Port ${PORT} in use. Starting on fallback port ${fallbackPort}...`);
      app.listen(fallbackPort, () => {
        console.log(`🚀 Server running on fallback port ${fallbackPort}`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
}

module.exports = app;
