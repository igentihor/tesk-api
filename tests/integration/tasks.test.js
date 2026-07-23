const request = require('supertest');
const app = require('../../src/app');
const store = require('../../src/store/inMemoryStore');

beforeEach(() => {
  store.reset();
});

describe('Task API Integration Tests', () => {
  describe('GET /health', () => {
    test('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('POST /api/tasks', () => {
    test('should create a task with only title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Buy groceries' });
      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.title).toBe('Buy groceries');
      expect(res.body.status).toBe('pending');
      expect(res.body.priority).toBe('medium');
    });

    test('should create a task with all fields', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Deploy app',
          description: 'Deploy to production',
          status: 'in-progress',
          priority: 'high',
        });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Deploy app');
      expect(res.body.description).toBe('Deploy to production');
      expect(res.body.status).toBe('in-progress');
      expect(res.body.priority).toBe('high');
    });

    test('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('title is required');
    });

    test('should return 400 when title is empty', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: '   ' });
      expect(res.status).toBe(400);
    });

    test('should return 400 with invalid status', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', status: 'invalid' });
      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('status must be one of');
    });

    test('should return 400 with invalid priority', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', priority: 'urgent' });
      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('priority must be one of');
    });
  });

  describe('GET /api/tasks', () => {
    test('should return empty array when no tasks', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test('should return all tasks', async () => {
      await request(app).post('/api/tasks').send({ title: 'Task 1' });
      await request(app).post('/api/tasks').send({ title: 'Task 2' });
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    test('should filter by status', async () => {
      await request(app).post('/api/tasks').send({ title: 'T1', status: 'pending' });
      await request(app).post('/api/tasks').send({ title: 'T2', status: 'completed' });
      await request(app).post('/api/tasks').send({ title: 'T3', status: 'pending' });
      const res = await request(app).get('/api/tasks?status=pending');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body.every((t) => t.status === 'pending')).toBe(true);
    });

    test('should filter by priority', async () => {
      await request(app).post('/api/tasks').send({ title: 'T1', priority: 'high' });
      await request(app).post('/api/tasks').send({ title: 'T2', priority: 'low' });
      await request(app).post('/api/tasks').send({ title: 'T3', priority: 'high' });
      const res = await request(app).get('/api/tasks?priority=high');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body.every((t) => t.priority === 'high')).toBe(true);
    });

    test('should filter by both status and priority', async () => {
      await request(app).post('/api/tasks').send({ title: 'T1', status: 'pending', priority: 'high' });
      await request(app).post('/api/tasks').send({ title: 'T2', status: 'completed', priority: 'high' });
      await request(app).post('/api/tasks').send({ title: 'T3', status: 'pending', priority: 'low' });
      const res = await request(app).get('/api/tasks?status=pending&priority=high');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('T1');
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('should return a task by id', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'My Task' });
      const res = await request(app).get(`/api/tasks/${created.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('My Task');
    });

    test('should return 404 for non-existent task', async () => {
      const res = await request(app).get('/api/tasks/999');
      expect(res.status).toBe(404);
      expect(res.body.error.message).toContain('not found');
    });

    test('should return 400 for invalid id format', async () => {
      const res = await request(app).get('/api/tasks/abc');
      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('valid integer');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('should update a task fully', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'Old' });
      const res = await request(app)
        .put(`/api/tasks/${created.body.id}`)
        .send({ title: 'New', status: 'completed', priority: 'high' });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('New');
      expect(res.body.status).toBe('completed');
      expect(res.body.priority).toBe('high');
    });

    test('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .put('/api/tasks/999')
        .send({ title: 'X' });
      expect(res.status).toBe(404);
    });

    test('should return 400 for invalid status', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'T' });
      const res = await request(app)
        .put(`/api/tasks/${created.body.id}`)
        .send({ status: 'invalid' });
      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    test('should partially update a task', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'T', priority: 'low' });
      const res = await request(app)
        .patch(`/api/tasks/${created.body.id}`)
        .send({ status: 'completed' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('completed');
      expect(res.body.priority).toBe('low');
    });

    test('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .patch('/api/tasks/999')
        .send({ title: 'X' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('should delete a task', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'To delete' });
      const res = await request(app).delete(`/api/tasks/${created.body.id}`);
      expect(res.status).toBe(204);
      const getRes = await request(app).get(`/api/tasks/${created.body.id}`);
      expect(getRes.status).toBe(404);
    });

    test('should return 404 for non-existent task', async () => {
      const res = await request(app).delete('/api/tasks/999');
      expect(res.status).toBe(404);
    });

    test('should return 400 for invalid id', async () => {
      const res = await request(app).delete('/api/tasks/abc');
      expect(res.status).toBe(400);
    });
  });

  describe('404 handler', () => {
    test('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.status).toBe(404);
      expect(res.body.error.message).toContain('not found');
    });
  });

  describe('Error response format', () => {
    test('should have consistent error format', async () => {
      const res = await request(app).get('/api/tasks/999');
      expect(res.body.error).toBeDefined();
      expect(res.body.error.statusCode).toBeDefined();
      expect(res.body.error.message).toBeDefined();
    });
  });
});
