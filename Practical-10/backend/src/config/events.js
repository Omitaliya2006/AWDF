/**
 * Dedicated EventEmitter Module for Task Management
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const EventEmitter = require('events');

class TaskEvents extends EventEmitter {}

module.exports = new TaskEvents();

