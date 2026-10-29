const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const cacheController = require('../controllers/cacheController');

// Debug stats alias under /tasks
router.get('/cache/stats', cacheController.getCacheStats);

// Task CRUD with in-memory caching
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
