/**
 * Task Express Routes for Practical 5
 * Maps CRUD endpoints to controller functions with ObjectId validation middleware.
 */

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const validateObjectId = require('../middleware/validateObjectId');

// GET /tasks - Retrieve all tasks from MongoDB
router.get('/', taskController.getAllTasks);

// GET /tasks/:id - Retrieve single task by MongoDB ObjectId
router.get('/:id', validateObjectId, taskController.getTaskById);

// POST /tasks - Create a new task document in MongoDB
router.post('/', taskController.createTask);

// PUT /tasks/:id - Update existing task document
router.put('/:id', validateObjectId, taskController.updateTask);

// DELETE /tasks/:id - Delete task document from MongoDB
router.delete('/:id', validateObjectId, taskController.deleteTask);

module.exports = router;
