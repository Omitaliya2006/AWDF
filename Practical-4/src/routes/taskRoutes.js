/**
 * Task Express Router (Lab Step 4 & Architecture Diagram)
 * Assembles endpoints with route-specific and Content-Type validation middlewares.
 */

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const validateTaskId = require('../middleware/validateTaskId');
const contentTypeValidator = require('../middleware/contentTypeValidator');

// GET /tasks - Retrieve all tasks
router.get('/', taskController.getAllTasks);

// GET /tasks/:id - Retrieve single task (applies validateTaskId)
router.get('/:id', validateTaskId, taskController.getTaskById);

// POST /tasks - Create task (applies contentTypeValidator)
router.post('/', contentTypeValidator, taskController.createTask);

// PUT /tasks/:id - Update task (applies validateTaskId & contentTypeValidator)
router.put('/:id', validateTaskId, contentTypeValidator, taskController.updateTask);

// DELETE /tasks/:id - Delete task (applies validateTaskId)
router.delete('/:id', validateTaskId, taskController.deleteTask);

module.exports = router;
