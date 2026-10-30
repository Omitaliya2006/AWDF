/**
 * Task Controller with Asynchronous Event Emission
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const Task = require('../models/Task');
const taskEvents = require('../config/events');

/**
 * GET /tasks - Fetch all tasks
 */
async function getAllTasks(req, res, next) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /tasks/:id - Fetch single task
 */
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

/**
 * POST /tasks - Step 3: Create task and emit 'task-created' asynchronously
 * Crucial Requirement: The main API response must return immediately before the listener finishes.
 */
async function createTask(req, res, next) {
  try {
    const { title, description, completed, priority, assignedTo, simulateError } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task title is required.'
      });
    }

    // Save task to MongoDB
    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: Boolean(completed),
      priority: priority || 'medium',
      assignedTo: assignedTo ? assignedTo.trim() : 'Om Italiya (24IT029)'
    });

    // Capture precise API response timestamp
    const apiResponseTime = new Date().toISOString();
    console.log(`[API] Response sent at ${apiResponseTime}`);

    // Step 3: Respond immediately with HTTP 201 Created
    res.status(201).json({
      success: true,
      message: 'Task created successfully; notification dispatched to background queue.',
      apiResponseTime,
      data: task
    });

    // Step 3: Emit 'task-created' event asynchronously (handled non-blocking)
    const eventPayload = {
      ...task.toObject(),
      apiResponseTime,
      simulateError: Boolean(simulateError)
    };
    taskEvents.emit('task-created', eventPayload);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /tasks/:id - Update task and emit 'task-updated'
 */
async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID ${id} not found.`
      });
    }

    const apiResponseTime = new Date().toISOString();
    console.log(`[API] Response sent at ${apiResponseTime}`);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully; notification queued.',
      apiResponseTime,
      data: updatedTask
    });

    taskEvents.emit('task-updated', {
      ...updatedTask.toObject(),
      apiResponseTime
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /tasks/:id - Supplementary Problem: Delete task and emit 'task-deleted'
 */
async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID ${id} not found.`
      });
    }

    const apiResponseTime = new Date().toISOString();
    console.log(`[API] Response sent at ${apiResponseTime}`);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully; audit event emitted.',
      apiResponseTime,
      data: deletedTask
    });

    // Emit supplementary 'task-deleted' event
    taskEvents.emit('task-deleted', {
      ...deletedTask.toObject(),
      apiResponseTime
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};

