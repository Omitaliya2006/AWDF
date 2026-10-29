/**
 * Task Controller for Practical 5 (Lab Step 4 & Rubrics: 8 Marks)
 * Executes live MongoDB CRUD operations via Mongoose Model methods:
 * • Task.find()
 * • Task.create()
 * • Task.findById()
 * • Task.findByIdAndUpdate()
 * • Task.findByIdAndDelete()
 */

const Task = require('../models/Task');

// 1. GET /tasks - Retrieve all tasks from MongoDB (with filtering & sorting)
async function getAllTasks(req, res, next) {
  try {
    const { completed, priority, search, sort } = req.query;
    const query = {};

    // Filter by completed boolean
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    // Filter by priority enum
    if (priority) {
      query.priority = priority.toLowerCase();
    }

    // Keyword search on title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort order (default: newest first)
    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const tasks = await Task.find(query).sort(sortOption);

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

// 2. GET /tasks/:id - Retrieve a single task by ID from MongoDB (Supplementary 3)
async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `No task found in database with ID "${req.params.id}".`,
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

// 3. POST /tasks - Create a new task document in MongoDB
async function createTask(req, res, next) {
  try {
    const { title, description, completed, priority } = req.body;

    // Enforce Mongoose schema validation during creation
    const newTask = await Task.create({
      title,
      description,
      completed,
      priority
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully in MongoDB database.',
      data: newTask,
      statusCode: 201
    });
  } catch (err) {
    next(err); // Mongoose ValidationError caught by globalErrorHandler
  }
}

// 4. PUT /tasks/:id - Update an existing task document in MongoDB
async function updateTask(req, res, next) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return modified document
        runValidators: true // Enforce schema validation rules on updates!
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Cannot update. Task with ID "${req.params.id}" does not exist in MongoDB.`,
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

// 5. DELETE /tasks/:id - Delete a task document from MongoDB
async function deleteTask(req, res, next) {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Cannot delete. Task with ID "${req.params.id}" does not exist in MongoDB.`,
        statusCode: 404
      });
    }

    res.status(200).json({
      success: true,
      message: `Task "${deletedTask.title}" (${deletedTask._id}) deleted successfully from MongoDB.`,
      deletedTaskId: deletedTask._id,
      statusCode: 200
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
