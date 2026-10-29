const express = require('express');
const router = express.Router();
const cacheController = require('../controllers/cacheController');

// Debug telemetry & benchmarking endpoints
router.get('/stats', cacheController.getCacheStats);
router.post('/flush', cacheController.flushCache);
router.post('/ttl', cacheController.updateTTL);
router.get('/benchmark', cacheController.runBenchmark);

module.exports = router;
