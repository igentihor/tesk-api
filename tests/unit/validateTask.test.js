const { validateTask, validateCreateTask, VALID_STATUSES, VALID_PRIORITIES } = require('../../src/middleware/validateTask');

function runMiddleware(middleware, body) {
  const req = { body };
  let nextCalled = false;
  let nextError = null;
  const next = (err) => {
    nextCalled = true;
    nextError = err;
  };
  const res = {};
  middleware(req, res, next);
  return { nextCalled, nextError };
}

describe('validateCreateTask', () => {
  test('should call next() for valid data', () => {
    const { nextCalled, nextError } = runMiddleware(validateCreateTask, {
      title: 'My Task',
      status: 'pending',
      priority: 'high',
    });
    expect(nextCalled).toBe(true);
    expect(nextError).toBeUndefined();
  });

  test('should pass with only title', () => {
    const { nextCalled, nextError } = runMiddleware(validateCreateTask, { title: 'My Task' });
    expect(nextCalled).toBe(true);
    expect(nextError).toBeUndefined();
  });

  test('should fail when title is missing', () => {
    const { nextError } = runMiddleware(validateCreateTask, {});
    expect(nextError).toBeDefined();
    expect(nextError.statusCode).toBe(400);
    expect(nextError.message).toContain('title is required');
  });

  test('should fail when title is empty string', () => {
    const { nextError } = runMiddleware(validateCreateTask, { title: '   ' });
    expect(nextError).toBeDefined();
    expect(nextError.statusCode).toBe(400);
  });

  test('should fail when title is not a string', () => {
    const { nextError } = runMiddleware(validateCreateTask, { title: 123 });
    expect(nextError).toBeDefined();
    expect(nextError.statusCode).toBe(400);
  });

  test('should fail with invalid status', () => {
    const { nextError } = runMiddleware(validateCreateTask, { title: 'X', status: 'invalid' });
    expect(nextError).toBeDefined();
    expect(nextError.statusCode).toBe(400);
    expect(nextError.message).toContain('status must be one of');
  });

  test('should fail with invalid priority', () => {
    const { nextError } = runMiddleware(validateCreateTask, { title: 'X', priority: 'urgent' });
    expect(nextError).toBeDefined();
    expect(nextError.statusCode).toBe(400);
    expect(nextError.message).toContain('priority must be one of');
  });
});

describe('validateTask (for updates)', () => {
  test('should call next() with no fields', () => {
    const { nextCalled, nextError } = runMiddleware(validateTask, {});
    expect(nextCalled).toBe(true);
    expect(nextError).toBeUndefined();
  });

  test('should pass with valid fields', () => {
    const { nextCalled, nextError } = runMiddleware(validateTask, {
      title: 'Updated',
      status: 'completed',
      priority: 'low',
    });
    expect(nextCalled).toBe(true);
    expect(nextError).toBeUndefined();
  });

  test('should fail with empty title', () => {
    const { nextError } = runMiddleware(validateTask, { title: '' });
    expect(nextError).toBeDefined();
    expect(nextError.statusCode).toBe(400);
  });

  test('should fail with invalid status', () => {
    const { nextError } = runMiddleware(validateTask, { status: 'invalid' });
    expect(nextError).toBeDefined();
    expect(nextError.statusCode).toBe(400);
  });

  test('should fail with invalid priority', () => {
    const { nextError } = runMiddleware(validateTask, { priority: 'invalid' });
    expect(nextError).toBeDefined();
    expect(nextError.statusCode).toBe(400);
  });

  test('should collect multiple errors', () => {
    const { nextError } = runMiddleware(validateTask, { title: '', status: 'bad', priority: 'bad' });
    expect(nextError).toBeDefined();
    expect(nextError.message).toContain(';');
  });
});

describe('constants', () => {
  test('VALID_STATUSES should include pending, in-progress, completed', () => {
    expect(VALID_STATUSES).toEqual(['pending', 'in-progress', 'completed']);
  });

  test('VALID_PRIORITIES should include low, medium, high', () => {
    expect(VALID_PRIORITIES).toEqual(['low', 'medium', 'high']);
  });
});
