const { AppError } = require('../utils/errors');

let tasks = [];
let nextId = 1;

function reset() {
  tasks = [];
  nextId = 1;
}

function getAll(filters = {}) {
  return tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    return true;
  });
}

function getById(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new AppError(404, `Task with id ${id} not found`);
  }
  return task;
}

function create(data) {
  const task = {
    id: nextId++,
    title: data.title,
    description: data.description || '',
    status: data.status || 'pending',
    priority: data.priority || 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

function update(id, data) {
  const task = getById(id);
  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.status !== undefined) task.status = data.status;
  if (data.priority !== undefined) task.priority = data.priority;
  task.updatedAt = new Date().toISOString();
  return task;
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new AppError(404, `Task with id ${id} not found`);
  }
  tasks.splice(index, 1);
}

module.exports = {
  reset,
  getAll,
  getById,
  create,
  update,
  remove,
};
