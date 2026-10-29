/**
 * Authenticated API Service for Practical 7
 * Automatically attaches JWT Bearer token to protected endpoints.
 * Handles 401 Unauthorized token expiry with auto-logout.
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'awdf_jwt_token_24it029';
const USER_KEY = 'awdf_jwt_user_24it029';

let onUnauthorizedCallback = null;

export const setUnauthorizedHandler = (cb) => {
  onUnauthorizedCallback = cb;
};

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Attach JWT Bearer token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => null);

    // Handle 401 Unauthorized (token missing, invalid, or expired)
    if (response.status === 401) {
      if (token) {
        // Clear expired or invalid token
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback(data?.message || 'Session expired. Please log in again.');
        }
      }
    }

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
  // --- AUTHENTICATION ENDPOINTS ---
  register: async (credentials) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (res.token) {
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    }
    return res;
  },

  login: async (credentials) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (res.token) {
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    }
    return res;
  },

  getMe: async () => {
    const res = await request('/auth/me');
    return res.user;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // --- PROTECTED TASK CRUD ENDPOINTS ---
  getTasks: async () => {
    const res = await request('/tasks');
    return res.data || [];
  },

  createTask: async (taskData) => {
    const res = await request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
    return res.data;
  },

  updateTask: async (id, updateData) => {
    const res = await request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    return res.data;
  },

  deleteTask: async (id) => {
    const res = await request(`/tasks/${id}`, {
      method: 'DELETE'
    });
    return res;
  },

  seedTasks: async () => {
    const res = await request('/tasks/seed', {
      method: 'POST'
    });
    return res.data || [];
  },

  // --- SYSTEM & MONITOR ENDPOINTS ---
  getHealth: async () => {
    const res = await request('/api/health');
    return res;
  },

  getLogs: async () => {
    const res = await request('/api/logs');
    return res.logs || [];
  },

  getBaseUrl: () => API_BASE
};

export default api;
