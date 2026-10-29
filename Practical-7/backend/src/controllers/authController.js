/**
 * Authentication Controller for Practical 7
 * Handles user registration, bcrypt password hashing, JWT login, and /me profile.
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'awdf_jwt_secret_key_24it029_secure_random_token_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Helper function to sign JWT
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// 1. POST /auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'An account with this email already exists.',
        statusCode: 409
      });
    }

    // Step 3: Hash password with bcrypt before saving to MongoDB
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // Generate JWT token on registration
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully with hashed password.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      },
      statusCode: 201
    });
  } catch (err) {
    next(err);
  }
}

// 2. POST /auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Step 4: Find user and verify credentials with bcrypt.compare
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email or password.',
        statusCode: 401
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email or password.',
        statusCode: 401
      });
    }

    // Sign JWT on successful authentication
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Authentication successful. JWT generated.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      statusCode: 200
    });
  } catch (err) {
    next(err);
  }
}

// 3. GET /auth/me (Supplementary problem)
async function getMe(req, res, next) {
  try {
    // req.user was populated by authMiddleware from decoded JWT
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User account not found.',
        statusCode: 404
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      tokenPayload: {
        id: req.user.id,
        email: req.user.email,
        iat: req.user.iat,
        exp: req.user.exp
      },
      statusCode: 200
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe
};
