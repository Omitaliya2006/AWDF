/**
 * Task Routes for Practical 6 Backend
 * Full-Stack Task Manager (React + Express + MongoDB)
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Collection routes
router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.post('/seed', taskController.seedTasks);

// Document routes
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
