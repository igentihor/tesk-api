const store = require('../store/inMemoryStore');

function createTask(req, res, next) {
  try {
    const task = store.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

function getTasks(req, res, next) {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    const tasks = store.getAll(filters);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}

function getTaskById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      const { AppError } = require('../utils/errors');
      throw new AppError(400, 'id must be a valid integer');
    }
    const task = store.getById(id);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

function updateTask(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      const { AppError } = require('../utils/errors');
      throw new AppError(400, 'id must be a valid integer');
    }
    const task = store.update(id, req.body);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

function deleteTask(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      const { AppError } = require('../utils/errors');
      throw new AppError(400, 'id must be a valid integer');
    }
    store.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
