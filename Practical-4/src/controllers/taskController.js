/**
 * Task Controller (Lab Step 4 & Rubrics: 8 Marks)
 * Handles CRUD business logic for Task Management REST API.
 */

const taskStore = require('../data/taskStore');

// 1. GET /tasks - Retrieve all tasks (with optional query filtering)
function getAllTasks(req, res, next) {
  try {
    let tasks = taskStore.getAll();
    const { status, priority, search } = req.query;

    if (status) {
      tasks = tasks.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }
    if (priority) {
      tasks = tasks.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }

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

// 2. GET /tasks/:id - Retrieve a single task by ID
function getTaskById(req, res, next) {
  try {
    const id = req.parsedTaskId || parseInt(req.params.id, 10);
    const task = taskStore.getById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID ${id} does not exist.`,
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

// 3. POST /tasks - Create a new task
function createTask(req, res, next) {
  try {
    const { title, description, status, priority } = req.body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task "title" is required and cannot be empty.',
        statusCode: 400
      });
    }

    // Validate status enum if provided
    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Field "status" must be one of: pending, in-progress, completed.',
        receivedStatus: status,
        statusCode: 400
      });
    }

    // Validate priority enum if provided
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Field "priority" must be one of: low, medium, high.',
        receivedPriority: priority,
        statusCode: 400
      });
    }

    const newTask = taskStore.create({ title, description, status, priority });

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

// 4. PUT /tasks/:id - Update an existing task by ID
function updateTask(req, res, next) {
  try {
    const id = req.parsedTaskId || parseInt(req.params.id, 10);
    const existingTask = taskStore.getById(id);

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Cannot update. Task with ID ${id} was not found.`,
        statusCode: 404
      });
    }

    const { title, description, status, priority } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Request body cannot be empty for task updates.',
        statusCode: 400
      });
    }

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task "title" cannot be set to an empty string.',
        statusCode: 400
      });
    }

    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Field "status" must be one of: pending, in-progress, completed.',
        receivedStatus: status,
        statusCode: 400
      });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Field "priority" must be one of: low, medium, high.',
        receivedPriority: priority,
        statusCode: 400
      });
    }

    const updatedTask = taskStore.update(id, { title, description, status, priority });

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

// 5. DELETE /tasks/:id - Delete a task by ID
function deleteTask(req, res, next) {
  try {
    const id = req.parsedTaskId || parseInt(req.params.id, 10);
    const existingTask = taskStore.getById(id);

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Cannot delete. Task with ID ${id} does not exist.`,
        statusCode: 404
      });
    }

    taskStore.delete(id);

    res.status(200).json({
      success: true,
      message: `Task with ID ${id} deleted successfully.`,
      deletedTaskId: id,
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
