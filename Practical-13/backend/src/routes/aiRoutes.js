/**
 * Practical 13: AI API Integration into a Web Application
 * AI Routes with Rate Limiting Protection
 * Author: Om Italiya (24IT029)
 */

const express = require('express');
const router = express.Router();
const { generateDescription, simulateFailure, getAIStatus } = require('../controllers/aiController');
const { aiRateLimiter } = require('../middleware/rateLimiter');

// Public status & governance metadata
router.get('/status', getAIStatus);

// AI Text Generation (Protected by Rate Limiter)
router.post('/generate-description', aiRateLimiter(), generateDescription);

// Live Failure Simulation Route (For Faculty / Viva Graceful Degradation Demo)
router.post('/simulate-failure', simulateFailure);

module.exports = router;
