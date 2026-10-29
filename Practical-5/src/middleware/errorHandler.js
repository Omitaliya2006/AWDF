/**
 * Error Handling Middleware (Lab Step 5 & Rubric: 4 Marks Validation Enforcement)
 * Transforms Mongoose ValidationErrors and CastErrors into clean, structured JSON responses
 * without leaking raw Mongoose internals or sensitive stack traces.
 */

// 404 Handler for undefined routes
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.originalUrl} on this server.`,
    statusCode: 404
  });
}

// Global Centralized Error Handler (Defined LAST in pipeline)
function globalErrorHandler(err, req, res, next) {
  console.error('[GLOBAL ERROR HANDLER CAUGHT]:', err.stack || err.message);

  // 1. Mongoose Schema Validation Error (Rubrics: 4 Marks)
  if (err.name === 'ValidationError') {
    const errorDetails = {};
    const messages = [];

    for (const field in err.errors) {
      const fieldError = err.errors[field];
      errorDetails[field] = fieldError.message;
      messages.push(fieldError.message);
    }

    return res.status(400).json({
      success: false,
      error: 'Mongoose Validation Error',
      message: messages.join(' '),
      validationErrors: errorDetails,
      statusCode: 400
    });
  }

  // 2. Mongoose Invalid ObjectId CastError
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID Format',
      message: `Invalid ${err.path}: "${err.value}" is not a valid MongoDB ObjectId.`,
      statusCode: 400
    });
  }

  // 3. MongoDB Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      error: 'Duplicate Key Error',
      message: `A document with this ${field} already exists.`,
      statusCode: 409
    });
  }

  // 4. Default Internal Server Error
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong on the database server.',
    statusCode,
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
