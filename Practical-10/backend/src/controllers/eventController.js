/**
 * Event Audit and Telemetry Controller
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const notificationStore = require('../listeners/notificationLog');
const taskEvents = require('../config/events');

function getEventLogs(req, res) {
  return res.status(200).json({
    success: true,
    count: notificationStore.logs.length,
    data: notificationStore.getLogs()
  });
}

function getEventStats(req, res) {
  return res.status(200).json({
    success: true,
    data: notificationStore.getStats()
  });
}

function updateDelay(req, res) {
  const { delayMs } = req.body;
  const newDelay = notificationStore.setDelay(delayMs);
  return res.status(200).json({
    success: true,
    message: `Background notification delay updated to ${newDelay}ms`,
    delayMs: newDelay
  });
}

function triggerSimulatedError(req, res) {
  const err = new Error(req.body.message || 'Simulated unhandled background exception in task handler');
  taskEvents.emit('error', err);
  return res.status(200).json({
    success: true,
    message: 'Error event emitted to taskEvents error listener.',
    errorEmitted: err.message
  });
}

function clearLogs(req, res) {
  notificationStore.clear();
  return res.status(200).json({
    success: true,
    message: 'Event logs cleared.'
  });
}

module.exports = {
  getEventLogs,
  getEventStats,
  updateDelay,
  triggerSimulatedError,
  clearLogs
};

