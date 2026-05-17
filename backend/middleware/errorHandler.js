const { ValidationError, UniqueConstraintError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  if (err instanceof UniqueConstraintError) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  if (err instanceof ValidationError) {
    const message = err.errors.map((val) => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
