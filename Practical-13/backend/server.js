/**
 * Practical 13: AI API Integration into a Web Application
 * Express Backend Server with AI Integration & Responsible AI Governance
 * Author: Om Italiya (24IT029)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, disconnectDB } = require('./src/config/db');
const aiRoutes = require('./src/routes/aiRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Practical 13 AI Integration Task API',
    author: 'Om Italiya (24IT029)',
    aiProvider: process.env.AI_SERVICE_PROVIDER || 'openai',
    aiKeyConfigured: !!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('mock-'),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/ai', aiRoutes);
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
  console.error('[AI Backend Error Handler]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server when run directly
let serverInstance = null;
if (require.main === module) {
  connectDB().then(() => {
    serverInstance = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` Practical 13: AI API Integration into Web App`);
      console.log(` Student: Om Italiya | Roll No: 24IT029`);
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` Health Check:  http://localhost:${PORT}/api/health`);
      console.log(` AI Status:     http://localhost:${PORT}/api/ai/status`);
      console.log(` AI Generator:  POST http://localhost:${PORT}/api/ai/generate-description`);
      console.log(`====================================================`);
    });
  });

  const handleShutdown = async () => {
    console.log('\n[AI Server] Graceful shutdown initiated...');
    if (serverInstance) {
      serverInstance.close(async () => {
        await disconnectDB();
        console.log('[AI Server] Server closed and DB disconnected.');
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
