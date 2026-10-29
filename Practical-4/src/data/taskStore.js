/**
 * In-Memory Task Storage (Lab Step 4 & Rubrics)
 * Holds tasks in a temporary array data structure (no database yet).
 * Pre-populated with initial sample tasks for Om Italiya (24IT029).
 */

let nextId = 4;

let tasks = [
  {
    id: 1,
    title: 'Complete AWDF Practical 4',
    description: 'Build a RESTful API with Node.js, Express, middleware pipeline, and CRUD endpoints.',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2026-10-29T10:00:00.000Z',
    updatedAt: '2026-10-29T10:00:00.000Z'
  },
  {
    id: 2,
    title: 'Review IBM Coursera Backend Module',
    description: 'Study RESTful API design, request-response lifecycles, and Express middleware architectures.',
    status: 'completed',
    priority: 'medium',
    createdAt: '2026-10-28T14:30:00.000Z',
    updatedAt: '2026-10-28T16:00:00.000Z'
  },
  {
    id: 3,
    title: 'Test Endpoints with Postman / Thunder Client',
    description: 'Verify HTTP status codes (200, 201, 400, 404, 500) and request logging outputs.',
    status: 'pending',
    priority: 'low',
    createdAt: '2026-10-29T11:15:00.000Z',
    updatedAt: '2026-10-29T11:15:00.000Z'
  }
];

const taskStore = {
  getAll: () => [...tasks],
  getById: (id) => tasks.find((t) => t.id === Number(id)),
  create: ({ title, description = '', status = 'pending', priority = 'medium' }) => {
    const now = new Date().toISOString();
    const newTask = {
      id: nextId++,
      title: title.trim(),
      description: description.trim(),
      status: ['pending', 'in-progress', 'completed'].includes(status) ? status : 'pending',
      priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
      createdAt: now,
      updatedAt: now
    };
    tasks.push(newTask);
    return newTask;
  },
  update: (id, updates) => {
    const taskIndex = tasks.findIndex((t) => t.id === Number(id));
    if (taskIndex === -1) return null;

    const existing = tasks[taskIndex];
    const now = new Date().toISOString();

    const updatedTask = {
      ...existing,
      ...(updates.title !== undefined && { title: updates.title.trim() }),
      ...(updates.description !== undefined && { description: updates.description.trim() }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.priority !== undefined && { priority: updates.priority }),
      updatedAt: now
    };

    tasks[taskIndex] = updatedTask;
    return updatedTask;
  },
  delete: (id) => {
    const taskIndex = tasks.findIndex((t) => t.id === Number(id));
    if (taskIndex === -1) return false;
    tasks.splice(taskIndex, 1);
    return true;
  },
  reset: (initialTasks = null) => {
    if (initialTasks) {
      tasks = [...initialTasks];
      nextId = Math.max(...tasks.map((t) => t.id), 0) + 1;
    } else {
      tasks = [];
      nextId = 1;
    }
  }
};

module.exports = taskStore;
