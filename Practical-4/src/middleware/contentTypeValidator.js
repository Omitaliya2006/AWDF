/**
 * Content-Type Validator Middleware (Supplementary Problem 1)
 * Rejects POST and PUT requests that lack 'Content-Type: application/json' header.
 */
function contentTypeValidator(req, res, next) {
  const method = req.method.toUpperCase();

  if (method === 'POST' || method === 'PUT') {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return res.status(415).json({
        success: false,
        error: 'Unsupported Media Type',
        message: 'Requests with method POST or PUT must specify Content-Type: application/json header.',
        receivedHeader: contentType || 'None',
        statusCode: 415
      });
    }
  }

  next();
}

module.exports = contentTypeValidator;
