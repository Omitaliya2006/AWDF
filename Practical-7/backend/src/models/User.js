/**
 * User Mongoose Model for Practical 7 (JWT Authentication)
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long.']
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address.'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters long.']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    createdAt: {
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
        delete ret.password; // NEVER expose hashed password in JSON responses
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('User', userSchema);
