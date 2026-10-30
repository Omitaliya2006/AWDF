/**
 * In-Memory Event & Notification Audit Store
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

class NotificationStore {
  constructor() {
    this.logs = [];
    this.delayMs = parseInt(process.env.NOTIFICATION_DELAY_MS, 10) || 1500;
    this.stats = {
      'task-created': 0,
      'task-updated': 0,
      'task-deleted': 0,
      'error': 0
    };
  }

  addPendingLog({ id, event, taskTitle, assignedUser, apiResponseAt }) {
    const entry = {
      id: id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      event,
      taskTitle: taskTitle || 'Untitled Task',
      assignedUser: assignedUser || 'Om Italiya (24IT029)',
      apiResponseAt: apiResponseAt || new Date().toISOString(),
      handlerStartedAt: new Date().toISOString(),
      handlerCompletedAt: null,
      durationMs: null,
      delayConfiguredMs: this.delayMs,
      status: 'processing',
      logMessage: `[Queued] Processing "${event}" notification in background...`
    };

    if (this.stats[event] !== undefined) {
      this.stats[event] += 1;
    }

    this.logs.unshift(entry);
    if (this.logs.length > 50) this.logs.pop();
    return entry;
  }

  markCompleted(id, logMessage) {
    const entry = this.logs.find((l) => l.id === id);
    if (entry) {
      entry.handlerCompletedAt = new Date().toISOString();
      const diff = new Date(entry.handlerCompletedAt).getTime() - new Date(entry.apiResponseAt).getTime();
      entry.durationMs = diff;
      entry.status = 'completed';
      entry.logMessage = logMessage;
    }
    return entry;
  }

  markFailed(id, errorMessage) {
    const entry = this.logs.find((l) => l.id === id);
    if (entry) {
      entry.handlerCompletedAt = new Date().toISOString();
      entry.status = 'failed';
      entry.logMessage = `[Error] ${errorMessage}`;
    }
    return entry;
  }

  getLogs() {
    return this.logs;
  }

  getStats() {
    return {
      ...this.stats,
      totalEvents: Object.values(this.stats).reduce((a, b) => a + b, 0),
      currentDelayMs: this.delayMs
    };
  }

  setDelay(ms) {
    const parsed = parseInt(ms, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      this.delayMs = parsed;
    }
    return this.delayMs;
  }

  clear() {
    this.logs = [];
    this.stats = {
      'task-created': 0,
      'task-updated': 0,
      'task-deleted': 0,
      'error': 0
    };
  }
}

module.exports = new NotificationStore();

