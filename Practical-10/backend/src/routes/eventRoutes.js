const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/logs', eventController.getEventLogs);
router.get('/stats', eventController.getEventStats);
router.post('/delay', eventController.updateDelay);
router.post('/simulate-error', eventController.triggerSimulatedError);
router.post('/clear', eventController.clearLogs);

module.exports = router;

