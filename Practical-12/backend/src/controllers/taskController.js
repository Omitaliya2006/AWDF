/**
 * Task Controller with Container Topology Metadata
 * Practical 11: Containerization with Docker and Docker Compose
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const os = require('os');
const mongoose = require('mongoose');
const Task = require('../models/Task');

// GET /api/tasks - Retrieve all tasks
async function getAllTasks(req, res, next) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
      containerHost: os.hostname()
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/tasks/:id - Retrieve single task
async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID ${req.params.id} does not exist.`
      });
    }
    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks - Create task
async function createTask(req, res, next) {
  try {
    const { title, description, completed, priority } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task title is required.'
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: Boolean(completed),
      priority: priority || 'medium',
      environment: 'Docker Containerized'
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully in MongoDB container.',
      data: task,
      persistedInVolume: 'awdf-mongo-data-24it029'
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/tasks/:id - Update task
async function updateTask(req, res, next) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID ${req.params.id} does not exist.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tasks/:id - Delete task
async function deleteTask(req, res, next) {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID ${req.params.id} does not exist.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task removed from persistent container volume.',
      data: deletedTask
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/info - Docker container telemetry & inter-container network status
function getContainerInfo(req, res) {
  const dbState = mongoose.connection.readyState;
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  return res.status(200).json({
    success: true,
    container: {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMB: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    },
    network: {
      composeNetwork: 'app-network (bridge)',
      databaseTarget: process.env.MONGODB_URI || 'mongodb://mongodb:27017/taskdb',
      dbConnectionState: dbStates[dbState] || 'unknown',
      connectedHost: mongoose.connection.host || 'mongodb'
    },
    orchestration: {
      services: ['frontend (5173)', 'backend (5000)', 'mongodb (27017)'],
      volume: 'mongo-data -> /data/db',
      singleCommand: 'docker-compose up --build'
    },
    student: 'Om Italiya (24IT029) - CSPIT CHARUSAT'
  });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getContainerInfo
};
