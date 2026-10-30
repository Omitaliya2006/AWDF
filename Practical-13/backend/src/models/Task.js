/**
 * Practical 13: AI API Integration into a Web Application
 * Task Mongoose Model with AI Provenance & Governance Tracking
 * Author: Om Italiya (24IT029)
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be pending, in-progress, or completed'
      },
      default: 'pending'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high'
      },
      default: 'medium'
    },
    assignedTo: {
      type: String,
      trim: true,
      default: 'Om Italiya (24IT029)'
    },
    dueDate: {
      type: Date,
      default: null
    },
    // Responsible AI Metadata (Provenance & Auditing)
    isAiGenerated: {
      type: Boolean,
      default: false
    },
    aiProvider: {
      type: String,
      default: 'none' // 'openai' | 'gemini' | 'graceful-fallback' | 'none'
    },
    aiConfidenceScore: {
      type: Number,
      default: 1.0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);
