/**
 * Task Controller for Practical 6 Backend
 * Full-Stack Task Manager (React + Express + MongoDB)
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const Task = require('../models/Task');

// GET /tasks - Fetch all tasks
async function getAllTasks(req, res, next) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
      statusCode: 200
    });
  } catch (err) {
    next(err);
  }
}

// GET /tasks/:id - Fetch single task by ID
async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID ${req.params.id} does not exist.`,
        statusCode: 404
      });
    }
    res.status(200).json({
      success: true,
      data: task,
      statusCode: 200
    });
  } catch (err) {
    next(err);
  }
}

// POST /tasks - Create new task
async function createTask(req, res, next) {
  try {
    const { title, description, completed, priority } = req.body;
    const newTask = await Task.create({
      title,
      description,
      completed,
      priority
    });
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
      statusCode: 201
    });
  } catch (err) {
    next(err);
  }
}

// PUT /tasks/:id - Update task by ID
async function updateTask(req, res, next) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID ${req.params.id} does not exist.`,
        statusCode: 404
      });
    }
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
      statusCode: 200
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /tasks/:id - Delete task by ID
async function deleteTask(req, res, next) {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID ${req.params.id} does not exist.`,
        statusCode: 404
      });
    }
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask,
      deletedTaskId: deletedTask._id,
      statusCode: 200
    });
  } catch (err) {
    next(err);
  }
}

// POST /tasks/seed - Reset and seed sample tasks
async function seedTasks(req, res, next) {
  try {
    await Task.deleteMany({});
    const sampleTasks = [
      {
        title: 'Connect React Frontend to Express Backend',
        description: 'Fetch tasks via REST API and render with reactive state and loading spinners.',
        completed: true,
        priority: 'high'
      },
      {
        title: 'Implement Full-Stack CRUD Operations',
        description: 'Support create, read, update, toggle complete, and delete across frontend and MongoDB.',
        completed: true,
        priority: 'high'
      },
      {
        title: 'Prepare for AWDF Lab Evaluation & Viva',
        description: 'Review architecture diagram, CORS handling, Mongoose ODM, and HTTP status codes.',
        completed: false,
        priority: 'medium'
      }
    ];
    const createdTasks = await Task.insertMany(sampleTasks);
    res.status(201).json({
      success: true,
      message: 'Default sample tasks seeded successfully.',
      count: createdTasks.length,
      data: createdTasks,
      statusCode: 201
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
  deleteTask,
  seedTasks
};
