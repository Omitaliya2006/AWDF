/**
 * Task Mongoose Model & Schema (Lab Step 3, Supplementary 1 & 2, Rubrics: 5 Marks)
 *
 * Requirements Met:
 * • Minimum 4 fields defined: title, description, completed, priority, createdAt, updatedAt
 * • Explicit data types assigned (String, Boolean, Date)
 * • Required constraints (title required)
 * • Default values defined (completed: false, priority: 'medium', createdAt: Date.now)
 * • Enum validation constraint on priority: ['low', 'medium', 'high'] (Supplementary 1)
 * • Pre-save hook: Automatically trims title whitespace and updates timestamp (Supplementary 2)
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required and cannot be empty.'],
      trim: true,
      minlength: [2, 'Task title must be at least 2 characters long.'],
      maxlength: [100, 'Task title cannot exceed 100 characters.']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters.']
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority "{VALUE}" is invalid. Allowed values are: low, medium, high.'
      },
      default: 'medium'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    // Schema options: enables virtual id string and prevents __v pollution in JSON
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Supplementary Problem 2: Pre-save hook that automatically trims whitespace from title
taskSchema.pre('save', function (next) {
  if (this.title) {
    this.title = this.title.trim();
  }
  this.updatedAt = new Date();
  next();
});

// Pre-update hook for findOneAndUpdate / findByIdAndUpdate
taskSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update && update.title && typeof update.title === 'string') {
    update.title = update.title.trim();
  }
  if (update) {
    update.updatedAt = new Date();
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
