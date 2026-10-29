/**
 * MongoDB ObjectId Validation Middleware
 * Checks that the ':id' parameter conforms to a valid 24-character hexadecimal ObjectId
 * before dispatching to the controller.
 */

const mongoose = require('mongoose');

function validateObjectId(req, res, next) {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid MongoDB ObjectId',
      message: `The provided identifier "${id}" is not a valid 24-character hexadecimal MongoDB ObjectId.`,
      receivedId: id,
      statusCode: 400
    });
  }

  next();
}

module.exports = validateObjectId;
