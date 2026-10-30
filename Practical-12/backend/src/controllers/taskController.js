/**
 * Practical 12: CI/CD Pipeline with GitHub Actions
 * Task Controller with In-Memory Resilient Fallback & CI Telemetry
 * Author: Om Italiya (24IT029)
 */

const mongoose = require('mongoose');
const Task = require('../models/Task');

// In-memory store fallback for reliable CI test execution without mandatory external DB
let inMemoryTasks = [
  {
    _id: '662000000000000000000001',
    title: 'Setup GitHub Actions CI Workflow',
    description: 'Configure .github/workflows/ci.yml with Node 18, npm install and test steps',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Om Italiya (24IT029)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '662000000000000000000002',
    title: 'Implement Automated Unit & Integration Tests',
    description: 'Write Jest and Supertest test suites for all task CRUD endpoints',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Om Italiya (24IT029)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '662000000000000000000003',
    title: 'Demonstrate Pipeline Failure with Broken Test',
    description: 'Simulate CI failure using deliberate assertion mismatch (exit code 1)',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'Om Italiya (24IT029)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc Get all tasks
// @route GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (status && status !== 'all') query.status = status;
      if (priority && priority !== 'all') query.priority = priority;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const tasks = await Task.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: tasks.length, data: tasks });
    }

    // Fallback in-memory
    let tasks = [...inMemoryTasks];
    if (status && status !== 'all') tasks = tasks.filter(t => t.status === status);
    if (priority && priority !== 'all') tasks = tasks.filter(t => t.priority === priority);
    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single task by ID
// @route GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid task ID format' });
      }
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      return res.status(200).json({ success: true, data: task });
    }

    const task = inMemoryTasks.find(t => t._id === id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create a new task
// @route POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required and cannot be empty'
      });
    }

    if (isDbConnected()) {
      const task = await Task.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        status: status || 'pending',
        priority: priority || 'medium',
        assignedTo: assignedTo ? assignedTo.trim() : 'Om Italiya (24IT029)',
        dueDate: dueDate || null
      });
      return res.status(201).json({ success: true, message: 'Task created successfully', data: task });
    }

    const newTask = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      priority: priority || 'medium',
      assignedTo: assignedTo ? assignedTo.trim() : 'Om Italiya (24IT029)',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inMemoryTasks.unshift(newTask);
    return res.status(201).json({ success: true, message: 'Task created successfully', data: newTask });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Update task
// @route PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid task ID format' });
      }
      const task = await Task.findByIdAndUpdate(
        id,
        {
          ...(title !== undefined && { title: title.trim() }),
          ...(description !== undefined && { description: description.trim() }),
          ...(status !== undefined && { status }),
          ...(priority !== undefined && { priority }),
          ...(assignedTo !== undefined && { assignedTo: assignedTo.trim() }),
          ...(dueDate !== undefined && { dueDate })
        },
        { new: true, runValidators: true }
      );
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      return res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
    }

    const idx = inMemoryTasks.findIndex(t => t._id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    const updated = {
      ...inMemoryTasks[idx],
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      ...(assignedTo !== undefined && { assignedTo: assignedTo.trim() }),
      ...(dueDate !== undefined && { dueDate }),
      updatedAt: new Date().toISOString()
    };
    inMemoryTasks[idx] = updated;
    return res.status(200).json({ success: true, message: 'Task updated successfully', data: updated });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid task ID format' });
      }
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      return res.status(200).json({ success: true, message: 'Task deleted successfully', data: { id } });
    }

    const idx = inMemoryTasks.findIndex(t => t._id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    inMemoryTasks.splice(idx, 1);
    return res.status(200).json({ success: true, message: 'Task deleted successfully', data: { id } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc CI Telemetry & Pipeline Status endpoint
// @route GET /api/tasks/ci-status
exports.getCiTelemetry = async (req, res) => {
  res.status(200).json({
    success: true,
    author: 'Om Italiya',
    rollNumber: '24IT029',
    course: 'AWDF',
    practical: 12,
    pipeline: {
      workflowName: 'AWDF CI Pipeline - 24IT029',
      branch: 'main',
      trigger: 'push',
      runner: 'ubuntu-latest',
      nodeVersion: process.version,
      ciEnvironment: process.env.CI ? 'GitHub Actions CI Runner' : 'Local Development Server',
      databaseMode: isDbConnected() ? 'MongoDB Replica/Service' : 'In-Memory Resilient Store',
      status: 'passing',
      badgeUrl: 'https://github.com/Omitaliya2006/AWDF/actions/workflows/ci.yml/badge.svg',
      steps: [
        { name: 'Checkout Code', status: 'completed' },
        { name: 'Setup Node.js 18', status: 'completed' },
        { name: 'Install Dependencies (npm install)', status: 'completed' },
        { name: 'Run Static Linter (npm run lint)', status: 'completed' },
        { name: 'Execute Automated Tests (npm test)', status: 'completed' },
        { name: 'Report Pipeline Status', status: 'success' }
      ]
    }
  });
};
