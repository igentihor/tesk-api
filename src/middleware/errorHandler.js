const { AppError } = require('../utils/errors');

function notFound(req, _res, next) {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  if (!err.isOperational) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: {
      statusCode,
      message,
    },
  });
}

module.exports = { notFound, errorHandler };
