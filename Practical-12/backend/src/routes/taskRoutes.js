/**
 * Practical 12: CI/CD Pipeline with GitHub Actions
 * Task API Routes
 * Author: Om Italiya (24IT029)
 */

const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getCiTelemetry
} = require('../controllers/taskController');

// CI pipeline telemetry endpoint
router.get('/ci-status', getCiTelemetry);

// CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
