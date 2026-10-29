/**
 * Input Validation Middleware for Practical 7
 * Enforces server-side validation rules before requests reach the database or controllers.
 *
 * Enforces:
 * 1. Required fields presence
 * 2. Strict email format regex
 * 3. Minimum password length (>= 6 chars)
 * 4. Task title length (>= 2 chars)
 * 5. Priority enum constraint ('low', 'medium', 'high')
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister(req, res, next) {
  const { name, email, password } = req.body || {};
  const errors = [];

  // Rule 1: Name validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required.');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }

  // Rule 2: Email validation
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email is required.');
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('Invalid email format. Please provide a valid email (e.g. user@example.com).');
  }

  // Rule 3: Password validation
  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: errors.join(' '),
      errors,
      statusCode: 400
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email is required.');
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('Invalid email format.');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: errors.join(' '),
      errors,
      statusCode: 400
    });
  }

  next();
}

function validateTask(req, res, next) {
  const { title, priority, completed } = req.body || {};
  const errors = [];

  // Rule 4: Task Title validation
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Task title is required.');
    } else if (title.trim().length < 2) {
      errors.push('Task title must be at least 2 characters long.');
    }
  } else if (req.method === 'PUT' && title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Task title cannot be empty.');
    } else if (title.trim().length < 2) {
      errors.push('Task title must be at least 2 characters long.');
    }
  }

  // Rule 5: Priority enum validation
  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      errors.push('Priority must be one of: low, medium, high.');
    }
  }

  // Rule 6: Completed flag validation
  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('Completed status must be a boolean (true or false).');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: errors.join(' '),
      errors,
      statusCode: 400
    });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateTask
};
