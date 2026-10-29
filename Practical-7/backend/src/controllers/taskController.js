/**
 * Task Controller for Practical 7
 * Scoped to Authenticated User via req.user.id
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const Task = require('../models/Task');

// GET /tasks - Fetch tasks belonging to logged-in user
async function getAllTasks(req, res, next) {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
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
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID "${req.params.id}" does not exist in your account.`,
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

// POST /tasks - Create task for logged-in user
async function createTask(req, res, next) {
  try {
    const { title, description, completed, priority } = req.body;
    const newTask = await Task.create({
      title,
      description,
      completed,
      priority,
      user: req.user.id // Associate task with authenticated user
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully in MongoDB.',
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
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID "${req.params.id}" does not exist or you do not have permission to update it.`,
        statusCode: 404
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully in MongoDB.',
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
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID "${req.params.id}" does not exist or you do not have permission to delete it.`,
        statusCode: 404
      });
    }

    res.status(200).json({
      success: true,
      message: `Task "${deletedTask.title}" deleted successfully.`,
      data: deletedTask,
      deletedTaskId: deletedTask._id,
      statusCode: 200
    });
  } catch (err) {
    next(err);
  }
}

// POST /tasks/seed - Reset and seed sample tasks for logged-in user
async function seedTasks(req, res, next) {
  try {
    await Task.deleteMany({ user: req.user.id });
    const sampleTasks = [
      {
        title: 'Review JWT Middleware Pipeline',
        description: 'Understand token signing, Bearer extraction, and error handling.',
        completed: true,
        priority: 'high',
        user: req.user.id
      },
      {
        title: 'Secure Password Storage with bcryptjs',
        description: 'Verify 10 salt rounds and direct hash comparison in auth controller.',
        completed: true,
        priority: 'high',
        user: req.user.id
      },
      {
        title: 'Complete AWDF Practical 7 Lab Evaluation',
        description: 'Demonstrate Postman test flow and answer oral examination viva questions.',
        completed: false,
        priority: 'medium',
        user: req.user.id
      }
    ];

    const created = await Task.insertMany(sampleTasks);
    res.status(201).json({
      success: true,
      message: 'Sample tasks seeded successfully for your account.',
      count: created.length,
      data: created,
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
