/**
 * Dedicated Event Listeners Module
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const taskEvents = require('../config/events');
const notificationStore = require('./notificationLog');

// 1. Register listener for 'task-created' event
taskEvents.on('task-created', (task) => {
  const eventId = task.eventId || `evt_created_${Date.now()}`;
  const logEntry = notificationStore.addPendingLog({
    id: eventId,
    event: 'task-created',
    taskTitle: task.title,
    assignedUser: task.assignedTo || 'Om Italiya (24IT029)',
    apiResponseAt: task.apiResponseTime
  });

  // Step 5: Artificial delay (setTimeout) to clearly exhibit asynchronous non-blocking behavior
  const delay = notificationStore.delayMs;
  setTimeout(() => {
    try {
      // Intentional error simulation hook if requested
      if (task.simulateError) {
        throw new Error(`Simulated notification delivery failure for task "${task.title}"`);
      }

      const completedAt = new Date().toISOString();
      const logMessage = `[Notification] Task "${task.title}" created at ${completedAt} (Assigned to: ${task.assignedTo || 'Om Italiya (24IT029)'})`;
      
      console.log(logMessage);
      notificationStore.markCompleted(eventId, logMessage);
    } catch (err) {
      notificationStore.markFailed(eventId, err.message);
      // Supplementary Task: Emit error event to be handled by error listener
      taskEvents.emit('error', err);
    }
  }, delay);
});

// 2. Supplementary Task: Register listener for 'task-deleted' event
taskEvents.on('task-deleted', (task) => {
  const eventId = task.eventId || `evt_deleted_${Date.now()}`;
  notificationStore.addPendingLog({
    id: eventId,
    event: 'task-deleted',
    taskTitle: task.title,
    assignedUser: task.assignedTo || 'Om Italiya (24IT029)',
    apiResponseAt: task.apiResponseTime
  });

  const delay = Math.min(notificationStore.delayMs, 1000);
  setTimeout(() => {
    const completedAt = new Date().toISOString();
    const logMessage = `[Audit Log] Task "${task.title}" (ID: ${task._id}) deleted at ${completedAt}`;
    
    console.log(logMessage);
    notificationStore.markCompleted(eventId, logMessage);
  }, delay);
});

// 3. Register listener for 'task-updated' event
taskEvents.on('task-updated', (task) => {
  const eventId = task.eventId || `evt_updated_${Date.now()}`;
  notificationStore.addPendingLog({
    id: eventId,
    event: 'task-updated',
    taskTitle: task.title,
    assignedUser: task.assignedTo || 'Om Italiya (24IT029)',
    apiResponseAt: task.apiResponseTime
  });

  const delay = Math.min(notificationStore.delayMs, 800);
  setTimeout(() => {
    const completedAt = new Date().toISOString();
    const logMessage = `[Notification] Task "${task.title}" updated at ${completedAt}`;
    
    console.log(logMessage);
    notificationStore.markCompleted(eventId, logMessage);
  }, delay);
});

// 4. Supplementary Task: Error Event Listener
taskEvents.on('error', (err) => {
  const timestamp = new Date().toISOString();
  console.error(`[Error Listener] Caught background processing error at ${timestamp}: ${err.message}`);
});

console.log('📢 [Events] Task event listeners registered: task-created, task-updated, task-deleted, error');

module.exports = taskEvents;

