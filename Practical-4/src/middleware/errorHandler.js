/**
 * Global Error Handling & 404 Middleware (Lab Step 5 & Supplementary Problem 3)
 *
 * 1. notFoundHandler: Captures any unmatched requests and returns structured 404 JSON.
 * 2. globalErrorHandler: 4-parameter error middleware defined LAST in pipeline.
 */

// 404 Handler for undefined routes (Supplementary Problem 3)
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.originalUrl} on this server.`,
    availableEndpoints: [
      'GET    /tasks',
      'GET    /tasks/:id',
      'POST   /tasks',
      'PUT    /tasks/:id',
      'DELETE /tasks/:id',
      'GET    /simulate-error'
    ],
    statusCode: 404
  });
}

// Global Centralized Error Handler (Lab Step 5 & Rubric: 5 Marks)
// Note: Must have exactly 4 arguments: (err, req, res, next)
function globalErrorHandler(err, req, res, next) {
  // Log the internal stack trace server-side for debugging
  console.error('[GLOBAL ERROR HANDLER CAUGHT]:', err.stack || err.message);

  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Return structured, clean JSON without exposing sensitive internal stack traces
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong on the server',
    statusCode,
    timestamp: new Date().toISOString(),
    ...(isProduction ? {} : { stack: err.stack ? err.stack.split('\n')[0] : undefined })
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
