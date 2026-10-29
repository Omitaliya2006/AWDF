/**
 * Task ID Validation Middleware (Supplementary Problem 2)
 * Route-specific middleware that validates the ':id' parameter format
 * before the request reaches the controller.
 */
function validateTaskId(req, res, next) {
  const { id } = req.params;

  // Validate that id exists and consists purely of digits (positive integer)
  if (!id || !/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Task ID Format',
      message: `Task ID must be a valid positive integer. Received: "${id}"`,
      statusCode: 400
    });
  }

  // Attach parsed numeric ID to request object for convenience
  req.parsedTaskId = parseInt(id, 10);
  next();
}

module.exports = validateTaskId;
