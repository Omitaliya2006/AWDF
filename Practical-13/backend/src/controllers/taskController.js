/**
 * Practical 13: AI API Integration into a Web Application
 * Task Controller with AI Provenance Recording & Resilient Fallback
 * Author: Om Italiya (24IT029)
 */

const mongoose = require('mongoose');
const Task = require('../models/Task');

let inMemoryTasks = [
  {
    _id: '663000000000000000000001',
    title: 'Integrate OpenAI / Gemini Text Generation API',
    description: '[AI API Integration]\nSummary: Complete implementation and verification for AI endpoints.\n• Connect to OpenAI / Gemini via secure server-side SDK.\n• Implement graceful degradation fallback for unconfigured keys.\n• Display editable suggestions with responsible AI disclaimers.',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Om Italiya (24IT029)',
    isAiGenerated: true,
    aiProvider: 'openai',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '663000000000000000000002',
    title: 'Implement In-Memory Sliding Window Rate Limiter',
    description: 'Enforce maximum 10 AI requests per minute per IP to protect API quotas and prevent wallet exhaustion.',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Om Italiya (24IT029)',
    isAiGenerated: false,
    aiProvider: 'none',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '663000000000000000000003',
    title: 'Test Live Graceful Degradation on Broken Key',
    description: '[Bug Fix & Defect Remediation]\nSummary: Verify that external 401 Unauthorized or network timeouts do not crash the Task Management app.',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'Om Italiya (24IT029)',
    isAiGenerated: true,
    aiProvider: 'graceful-fallback-engine',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getTasks = async (req, res) => {
  try {
    const { status, priority, search, aiOnly } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (status && status !== 'all') query.status = status;
      if (priority && priority !== 'all') query.priority = priority;
      if (aiOnly === 'true') query.isAiGenerated = true;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const tasks = await Task.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: tasks.length, data: tasks });
    }

    let tasks = [...inMemoryTasks];
    if (status && status !== 'all') tasks = tasks.filter(t => t.status === status);
    if (priority && priority !== 'all') tasks = tasks.filter(t => t.priority === priority);
    if (aiOnly === 'true') tasks = tasks.filter(t => t.isAiGenerated === true);
    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid task ID format' });
      }
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      return res.status(200).json({ success: true, data: task });
    }

    const task = inMemoryTasks.find(t => t._id === id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate, isAiGenerated, aiProvider } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    if (isDbConnected()) {
      const task = await Task.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        status: status || 'pending',
        priority: priority || 'medium',
        assignedTo: assignedTo ? assignedTo.trim() : 'Om Italiya (24IT029)',
        dueDate: dueDate || null,
        isAiGenerated: !!isAiGenerated,
        aiProvider: aiProvider || (isAiGenerated ? 'openai' : 'none')
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
      isAiGenerated: !!isAiGenerated,
      aiProvider: aiProvider || (isAiGenerated ? 'openai' : 'none'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inMemoryTasks.unshift(newTask);
    return res.status(201).json({ success: true, message: 'Task created successfully', data: newTask });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

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
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      return res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
    }

    const idx = inMemoryTasks.findIndex(t => t._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Task not found' });
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

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid task ID format' });
      }
      const task = await Task.findByIdAndDelete(id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      return res.status(200).json({ success: true, message: 'Task deleted successfully', data: { id } });
    }

    const idx = inMemoryTasks.findIndex(t => t._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Task not found' });
    inMemoryTasks.splice(idx, 1);
    return res.status(200).json({ success: true, message: 'Task deleted successfully', data: { id } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
