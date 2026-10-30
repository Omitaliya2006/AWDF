/**
 * Practical 12: CI/CD Pipeline with GitHub Actions
 * Passing Automated Test Suite (Jest + Supertest)
 * Demonstrates successful pipeline execution (Green Checkmark)
 * Author: Om Italiya (24IT029)
 */

const request = require('supertest');
const app = require('../server');
const { disconnectDB } = require('../src/config/db');

describe('AWDF Practical 12 - CI/CD Automated Test Suite (24IT029)', () => {
  let createdTaskId = null;

  afterAll(async () => {
    await disconnectDB();
  });

  describe('1. Health Check & CI Telemetry Verification', () => {
    it('GET /api/health should return HTTP 200 with service status OK', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('ciReady', true);
      expect(res.body.author).toContain('24IT029');
    });

    it('GET /api/tasks/ci-status should report pipeline metadata and roll number', async () => {
      const res = await request(app).get('/api/tasks/ci-status');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.rollNumber).toBe('24IT029');
      expect(res.body.pipeline.workflowName).toBe('AWDF CI Pipeline - 24IT029');
      expect(res.body.pipeline.branch).toBe('main');
    });
  });

  describe('2. Task CRUD Endpoints in CI Pipeline', () => {
    it('POST /api/tasks should successfully create a new task (HTTP 201)', async () => {
      const payload = {
        title: 'CI Test Task - Automated Verification',
        description: 'Testing task creation inside GitHub Actions runner',
        status: 'pending',
        priority: 'high',
        assignedTo: 'Om Italiya (24IT029)'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.status).toBe('pending');
      createdTaskId = res.body.data._id;
    });

    it('POST /api/tasks should reject requests missing a required title (HTTP 400)', async () => {
      const payload = {
        description: 'Missing title property',
        status: 'pending'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/title is required/i);
    });

    it('GET /api/tasks should return all tasks in array format (HTTP 200)', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/tasks?status=completed should filter tasks appropriately', async () => {
      const res = await request(app).get('/api/tasks?status=completed');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      res.body.data.forEach(task => {
        expect(task.status).toBe('completed');
      });
    });

    it('GET /api/tasks/:id should retrieve the created task by ID', async () => {
      expect(createdTaskId).not.toBeNull();
      const res = await request(app).get(`/api/tasks/${createdTaskId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(createdTaskId);
    });

    it('PUT /api/tasks/:id should update task status and title (HTTP 200)', async () => {
      expect(createdTaskId).not.toBeNull();
      const updates = {
        title: 'CI Test Task - Updated Title',
        status: 'completed',
        priority: 'high'
      };

      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updates.title);
      expect(res.body.data.status).toBe('completed');
    });

    it('DELETE /api/tasks/:id should delete the task (HTTP 200)', async () => {
      expect(createdTaskId).not.toBeNull();
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it is gone
      const checkRes = await request(app).get(`/api/tasks/${createdTaskId}`);
      expect(checkRes.statusCode).toBe(404);
    });
  });
});
