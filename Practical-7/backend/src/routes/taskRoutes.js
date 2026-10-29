/**
 * Protected Task Routes for Practical 7
 * All routes require valid JWT Bearer token authentication.
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/validationMiddleware');

// Step 6: Apply auth middleware to protect all task routes
router.use(authMiddleware);

// Collection routes
router.get('/', taskController.getAllTasks);
router.post('/', validateTask, taskController.createTask);
router.post('/seed', taskController.seedTasks);

// Document routes
router.get('/:id', taskController.getTaskById);
router.put('/:id', validateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
