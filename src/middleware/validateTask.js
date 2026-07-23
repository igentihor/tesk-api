const VALID_STATUSES = ['pending', 'in-progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

function validateTask(req, res, next) {
  const { title, status, priority } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('title must be a non-empty string');
    }
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }

  if (errors.length > 0) {
    const { AppError } = require('../utils/errors');
    return next(new AppError(400, errors.join('; ')));
  }

  next();
}

function validateCreateTask(req, res, next) {
  const { title } = req.body;
  const errors = [];

  if (title === undefined || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title is required and must be a non-empty string');
  }

  const { status, priority } = req.body;

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }

  if (errors.length > 0) {
    const { AppError } = require('../utils/errors');
    return next(new AppError(400, errors.join('; ')));
  }

  next();
}

module.exports = {
  validateTask,
  validateCreateTask,
  VALID_STATUSES,
  VALID_PRIORITIES,
};
