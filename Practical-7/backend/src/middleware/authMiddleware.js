/**
 * JWT Authentication Middleware for Practical 7
 * Verifies Bearer token in Authorization header and sets req.user.
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 1. Verify Authorization header presence and format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Access denied. Authorization token missing or malformed. Expected format: Bearer <token>',
        statusCode: 401
      });
    }

    // 2. Extract Bearer token
    const token = authHeader.split(' ')[1];

    if (!token || token.trim() === '') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Access denied. Bearer token is empty.',
        statusCode: 401
      });
    }

    // 3. Verify JWT signature & expiration (wrapped in try/catch)
    const secret = process.env.JWT_SECRET || 'awdf_jwt_secret_key_24it029_secure_random_token_2026';
    const decoded = jwt.verify(token, secret);

    // 4. Attach decoded token payload to req.user
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token Expired',
        message: 'Your session token has expired. Please log in again.',
        statusCode: 401
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid Token',
        message: 'Invalid token signature. Authentication failed.',
        statusCode: 401
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication failed: ' + err.message,
      statusCode: 401
    });
  }
}

module.exports = authMiddleware;
