/**
 * API Service for Practical 6 Full-Stack Task Manager
 * Communicates with the Express REST API backend on port 5000.
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP error ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend server at ${API_BASE}. Ensure "npm run start:backend" is running.`);
    }
    throw err;
  }
}

export const api = {
  // Fetch all tasks from MongoDB
  getTasks: async () => {
    const res = await request('/tasks');
    return res.data || [];
  },

  // Fetch a single task by ID
  getTaskById: async (id) => {
    const res = await request(`/tasks/${id}`);
    return res.data;
  },

  // Create a new task document
  createTask: async (taskData) => {
    const res = await request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return res.data;
  },

  // Update an existing task document
  updateTask: async (id, updateData) => {
    const res = await request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return res.data;
  },

  // Delete a task document by ID
  deleteTask: async (id) => {
    const res = await request(`/tasks/${id}`, {
      method: 'DELETE',
    });
    return res;
  },

  // Seed sample tasks into MongoDB
  seedTasks: async () => {
    const res = await request('/tasks/seed', {
      method: 'POST',
    });
    return res.data || [];
  },

  // Check backend server and MongoDB health status
  getHealth: async () => {
    const res = await request('/api/health');
    return res;
  },

  // Get live server request logs
  getLogs: async () => {
    const res = await request('/api/logs');
    return res.logs || [];
  },

  // Root metadata
  getMeta: async () => {
    const res = await request('/api');
    return res;
  },

  getBaseUrl: () => API_BASE,
};

export default api;

