/**
 * Authentication Routes for Practical 7
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

// Public routes with validation middleware
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected profile route
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
