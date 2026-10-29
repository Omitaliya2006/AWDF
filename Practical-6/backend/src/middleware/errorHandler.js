/**
 * Error Handling Middleware for Practical 6 Backend
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
  console.error('[ERROR HANDLER]:', err.stack || err.message);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: messages.join(' '),
      statusCode: 400
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID Format',
      message: `Invalid ID: "${err.value}" is not a valid MongoDB ObjectId.`,
      statusCode: 400
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong on the server.',
    statusCode
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
