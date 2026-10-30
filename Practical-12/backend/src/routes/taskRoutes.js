const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Container Telemetry Endpoint
router.get('/info', taskController.getContainerInfo);

// Task CRUD
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
