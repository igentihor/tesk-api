# tesk-api

REST API for a todo/task manager — CRUD endpoints, filtering by status/priority, validation, and error handling. In-memory store, no DB needed.

## Tech Stack

- **Node.js + Express** — web framework
- **Jest + Supertest** — unit & integration tests
- **ESLint** — linting

## Getting Started

```bash
npm install      # install dependencies
npm start        # start the server (port 3000)
npm run dev      # start with auto-reload on file changes
```

## Pipeline Scripts

```bash
npm install              # install dependencies
npm run build            # build step (loads app to verify it compiles)
npm run lint             # ESLint check
npm test                 # run all tests
npm run test:coverage    # coverage report with threshold gate (80%)
```

## API Endpoints

| Method | Route              | Description                        |
|--------|--------------------|------------------------------------|
| GET    | `/health`          | Health check                       |
| POST   | `/api/tasks`       | Create a new task                  |
| GET    | `/api/tasks`       | Get all tasks (supports filtering) |
| GET    | `/api/tasks/:id`   | Get a task by ID                   |
| PUT    | `/api/tasks/:id`   | Update a task (full)               |
| PATCH  | `/api/tasks/:id`   | Update a task (partial)            |
| DELETE | `/api/tasks/:id`   | Delete a task                      |

### Query Parameters for GET `/api/tasks`

- `status` — filter by status: `pending`, `in-progress`, `completed`
- `priority` — filter by priority: `low`, `medium`, `high`

### Task Object

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "pending",
  "priority": "medium",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Project Structure

```
tesk-api/
├── src/
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server entry point
│   ├── routes/tasks.js           # Task routes
│   ├── controllers/taskController.js
│   ├── middleware/
│   │   ├── errorHandler.js       # Error handling middleware
│   │   └── validateTask.js       # Input validation
│   ├── store/inMemoryStore.js    # In-memory data store
│   └── utils/errors.js           # Custom error class
├── tests/
│   ├── unit/
│   │   ├── inMemoryStore.test.js
│   │   └── validateTask.test.js
│   └── integration/
│       └── tasks.test.js
├── jest.config.js
├── .eslintrc.json
└── package.json
```
