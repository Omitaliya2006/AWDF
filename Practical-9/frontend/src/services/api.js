/**
 * API Service for Practical 9
 * Supports latency tracking, cache inspection, and cache bypassing
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function requestWithTelemetry(endpoint, options = {}) {
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
    const serverLatency = response.headers.get('X-Response-Time') || `${clientLatency}ms`;
    const cacheStatus = response.headers.get('X-Cache') || 'NONE';

    const json = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      status: response.status,
      data: json.data !== undefined ? json.data : json,
      raw: json,
      telemetry: {
        cacheStatus,
        serverLatency,
        clientLatencyMs: clientLatency,
        source: json.source || (cacheStatus === 'HIT' ? 'cache' : 'database')
      }
    };
  } catch (error) {
    const clientLatency = parseFloat((performance.now() - start).toFixed(2));
    return {
      ok: false,
      status: 0,
      data: null,
      error: error.message,
      telemetry: {
        cacheStatus: 'ERROR',
        serverLatency: '0ms',
        clientLatencyMs: clientLatency,
        source: 'error'
      }
    };
  }
}

export const api = {
  // Task endpoints
  getTasks: (bypass = false) =>
    requestWithTelemetry(`/tasks${bypass ? '?bypassCache=true' : ''}`, { method: 'GET' }),

  getTaskById: (id, bypass = false) =>
    requestWithTelemetry(`/tasks/${id}${bypass ? '?bypassCache=true' : ''}`, { method: 'GET' }),

  createTask: (taskData) =>
    requestWithTelemetry('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    }),

  updateTask: (id, updates) =>
    requestWithTelemetry(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  deleteTask: (id) =>
    requestWithTelemetry(`/tasks/${id}`, {
      method: 'DELETE'
    }),

  // Cache & Optimization endpoints
  getCacheStats: () =>
    requestWithTelemetry('/cache/stats', { method: 'GET' }),

  flushCache: () =>
    requestWithTelemetry('/cache/flush', { method: 'POST' }),

  updateTTL: (ttl) =>
    requestWithTelemetry('/cache/ttl', {
      method: 'POST',
      body: JSON.stringify({ ttl })
    }),

  runBenchmark: () =>
    requestWithTelemetry('/cache/benchmark', { method: 'GET' })
};
