/**
 * API Service for Practical 11 Containerized Architecture
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const start = performance.now();
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    const clientLatency = parseFloat((performance.now() - start).toFixed(2));
    const json = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      status: response.status,
      data: json.data !== undefined ? json.data : json,
      raw: json,
      clientLatencyMs: clientLatency
    };
  } catch (error) {
    const clientLatency = parseFloat((performance.now() - start).toFixed(2));
    return {
      ok: false,
      status: 0,
      data: null,
      error: error.message,
      clientLatencyMs: clientLatency
    };
  }
}

export const api = {
  // Tasks API
  getTasks: () => request('/tasks', { method: 'GET' }),
  getTaskById: (id) => request(`/tasks/${id}`, { method: 'GET' }),
  createTask: (payload) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateTask: (id, payload) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),

  // Container Info Telemetry
  getContainerInfo: () => request('/tasks/info', { method: 'GET' })
};
