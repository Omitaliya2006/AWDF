function errorHandler(err, req, res, next) {
  console.error(`💥 [Docker Backend Error] ${err.name}: ${err.message}`);

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID Format',
      message: `The provided ID "${err.value}" is not a valid MongoDB ObjectId.`
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: messages.join('. ')
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected server error occurred in container.'
  });
}

module.exports = errorHandler;
