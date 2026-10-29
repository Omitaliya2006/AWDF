/**
 * Error Handling Middleware for Practical 7
 *
 * Rubric Requirement:
 * "All errors returned as consistent JSON with status code and message; no stack traces exposed."
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.originalUrl} on backend server.`,
    statusCode: 404
  });
}

function globalErrorHandler(err, req, res, next) {
  // Log internally for debugging, but NEVER leak stack trace to the client!
  console.error('[ERROR PIPELINE]:', err.message || err);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: messages.join(' '),
      statusCode: 400
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID Format',
      message: `Invalid ID: "${err.value}" is not a valid MongoDB ObjectId.`,
      statusCode: 400
    });
  }

  // MongoDB Duplicate Key Error (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      error: 'Conflict',
      message: `An account with that ${field} already exists.`,
      statusCode: 409
    });
  }

  // Generic or custom application errors (Clean JSON without stack trace)
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Server Error',
    message: err.message || 'An unexpected error occurred on the server.',
    statusCode
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
