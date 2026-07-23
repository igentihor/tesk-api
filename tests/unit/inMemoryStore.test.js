const store = require('../../src/store/inMemoryStore');

beforeEach(() => {
  store.reset();
});

describe('inMemoryStore', () => {
  describe('create', () => {
    test('should create a task with defaults', () => {
      const task = store.create({ title: 'Buy groceries' });
      expect(task.id).toBe(1);
      expect(task.title).toBe('Buy groceries');
      expect(task.description).toBe('');
      expect(task.status).toBe('pending');
      expect(task.priority).toBe('medium');
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    test('should create a task with all fields', () => {
      const task = store.create({
        title: 'Deploy app',
        description: 'Deploy to production',
        status: 'in-progress',
        priority: 'high',
      });
      expect(task.id).toBe(1);
      expect(task.title).toBe('Deploy app');
      expect(task.description).toBe('Deploy to production');
      expect(task.status).toBe('in-progress');
      expect(task.priority).toBe('high');
    });

    test('should increment id for each task', () => {
      const t1 = store.create({ title: 'Task 1' });
      const t2 = store.create({ title: 'Task 2' });
      expect(t1.id).toBe(1);
      expect(t2.id).toBe(2);
    });
  });

  describe('getAll', () => {
    test('should return all tasks when no filters', () => {
      store.create({ title: 'Task 1' });
      store.create({ title: 'Task 2' });
      expect(store.getAll()).toHaveLength(2);
    });

    test('should filter by status', () => {
      store.create({ title: 'Task 1', status: 'pending' });
      store.create({ title: 'Task 2', status: 'completed' });
      store.create({ title: 'Task 3', status: 'pending' });
      expect(store.getAll({ status: 'pending' })).toHaveLength(2);
      expect(store.getAll({ status: 'completed' })).toHaveLength(1);
    });

    test('should filter by priority', () => {
      store.create({ title: 'Task 1', priority: 'high' });
      store.create({ title: 'Task 2', priority: 'low' });
      store.create({ title: 'Task 3', priority: 'high' });
      expect(store.getAll({ priority: 'high' })).toHaveLength(2);
      expect(store.getAll({ priority: 'low' })).toHaveLength(1);
    });

    test('should filter by both status and priority', () => {
      store.create({ title: 'Task 1', status: 'pending', priority: 'high' });
      store.create({ title: 'Task 2', status: 'completed', priority: 'high' });
      store.create({ title: 'Task 3', status: 'pending', priority: 'low' });
      const result = store.getAll({ status: 'pending', priority: 'high' });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Task 1');
    });

    test('should return empty array when no tasks', () => {
      expect(store.getAll()).toHaveLength(0);
    });
  });

  describe('getById', () => {
    test('should return task by id', () => {
      store.create({ title: 'Task 1' });
      const task = store.getById(1);
      expect(task.title).toBe('Task 1');
    });

    test('should throw AppError when task not found', () => {
      expect(() => store.getById(999)).toThrow('Task with id 999 not found');
    });
  });

  describe('update', () => {
    test('should update title', () => {
      store.create({ title: 'Old title' });
      const updated = store.update(1, { title: 'New title' });
      expect(updated.title).toBe('New title');
    });

    test('should update multiple fields', () => {
      store.create({ title: 'Task 1' });
      const updated = store.update(1, { status: 'completed', priority: 'high' });
      expect(updated.status).toBe('completed');
      expect(updated.priority).toBe('high');
    });

    test('should update updatedAt timestamp', () => {
      const time1 = new Date('2024-01-01T00:00:00.000Z');
      const time2 = new Date('2024-01-01T00:00:01.000Z');
      jest.useFakeTimers().setSystemTime(time1);
      store.create({ title: 'Task 1' });
      const originalUpdatedAt = store.getById(1).updatedAt;
      jest.setSystemTime(time2);
      const updated = store.update(1, { title: 'Updated' });
      expect(updated.updatedAt).not.toBe(originalUpdatedAt);
      jest.useRealTimers();
    });

    test('should not modify fields not provided', () => {
      store.create({ title: 'Task 1', description: 'Keep me' });
      const updated = store.update(1, { title: 'New title' });
      expect(updated.description).toBe('Keep me');
    });

    test('should throw AppError when task not found', () => {
      expect(() => store.update(999, { title: 'X' })).toThrow('Task with id 999 not found');
    });
  });

  describe('remove', () => {
    test('should remove a task', () => {
      store.create({ title: 'Task 1' });
      store.remove(1);
      expect(store.getAll()).toHaveLength(0);
    });

    test('should throw AppError when task not found', () => {
      expect(() => store.remove(999)).toThrow('Task with id 999 not found');
    });
  });

  describe('reset', () => {
    test('should clear all tasks and reset id counter', () => {
      store.create({ title: 'Task 1' });
      store.create({ title: 'Task 2' });
      store.reset();
      expect(store.getAll()).toHaveLength(0);
      const task = store.create({ title: 'New task' });
      expect(task.id).toBe(1);
    });
  });
});
