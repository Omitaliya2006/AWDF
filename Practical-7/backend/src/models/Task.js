/**
 * Task Mongoose Model for Practical 7 (Scoped to Authenticated User)
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required.'],
      trim: true,
      minlength: [2, 'Task title must be at least 2 characters long.']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high.'
      },
      default: 'medium'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to an authenticated user.']
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
    timestamps: true,
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

taskSchema.pre('save', function (next) {
  if (this.title) {
    this.title = this.title.trim();
  }
  this.updatedAt = new Date();
  next();
});

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

module.exports = mongoose.model('Task', taskSchema);
