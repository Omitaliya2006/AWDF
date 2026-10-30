/**
 * Practical 13: AI API Integration into a Web Application
 * Automated Backend Test Suite (Jest + Supertest)
 * Verifies AI Generation, Graceful Degradation, Rate Limiting & Security
 * Author: Om Italiya (24IT029)
 */

const request = require('supertest');
const app = require('../server');
const { disconnectDB } = require('../src/config/db');
const { resetRateLimiter } = require('../src/middleware/rateLimiter');

describe('AWDF Practical 13 - AI API Integration Test Suite (24IT029)', () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('1. Health Check & AI Governance Status', () => {
    it('GET /api/health should return HTTP 200 with service metadata', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.author).toContain('24IT029');
    });

    it('GET /api/ai/status should verify API key is stored server-side only in .env', async () => {
      const res = await request(app).get('/api/ai/status');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status.keyStorageLocation).toContain('.env (Server-Side Only)');
      expect(res.body.status.fallbackEngineActive).toBe(true);

      // CRITICAL SECURITY ASSERTION: Real API key must NEVER be in response body
      const rawText = JSON.stringify(res.body);
      expect(rawText).not.toContain(process.env.OPENAI_API_KEY || 'sk-');
    });
  });

  describe('2. AI Description Generation Endpoint', () => {
    it('POST /api/ai/generate-description should return structured suggestion for valid title', async () => {
      const res = await request(app)
        .post('/api/ai/generate-description')
        .send({ title: 'Implement JWT authentication and password hashing' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.description).toBe('string');
      expect(res.body.description.length).toBeGreaterThan(10);
      expect(res.body).toHaveProperty('suggestedPriority');
      expect(res.body).toHaveProperty('suggestedDueDate');
      expect(res.body.disclaimer).toMatch(/AI(-generated)? suggestion/i);
    });

    it('POST /api/ai/generate-description should reject missing title with HTTP 400', async () => {
      const res = await request(app)
        .post('/api/ai/generate-description')
        .send({ title: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/title is required/i);
    });
  });

  describe('3. Graceful Degradation on API Failure', () => {
    it('POST /api/ai/simulate-failure should return fallback response and NOT crash with 500', async () => {
      const res = await request(app)
        .post('/api/ai/simulate-failure')
        .send({ title: 'Deploy Docker container to Kubernetes cluster' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fallback).toBe(true);
      expect(res.body.data.description).toContain('Deploy Docker container to Kubernetes cluster');
      expect(res.body.data.disclaimer).toMatch(/fallback engine|review and adjust/i);
    });

    it('POST /api/ai/generate-description with forceFailure: true degrades gracefully', async () => {
      const res = await request(app)
        .post('/api/ai/generate-description')
        .send({ title: 'Fix CSS z-index modal bug', forceFailure: true });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.fallback).toBe(true);
      expect(res.body.description).toMatch(/Bug Fix|Remediation/i);
    });
  });

  describe('4. Rate Limiting Protection (Supplementary Problem 2)', () => {
    it('should block excessive requests with HTTP 429 when quota is exceeded', async () => {
      // Send 10 allowed requests
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/ai/generate-description')
          .send({ title: `Task request number ${i}` });
      }

      // 11th request must trigger rate limit
      const rateLimitedRes = await request(app)
        .post('/api/ai/generate-description')
        .send({ title: 'Exceeding request' });

      expect(rateLimitedRes.statusCode).toBe(429);
      expect(rateLimitedRes.body.rateLimited).toBe(true);
      expect(rateLimitedRes.headers).toHaveProperty('retry-after');
    });
  });

  describe('5. Task CRUD with AI Provenance', () => {
    it('POST /api/tasks should save task with isAiGenerated metadata', async () => {
      const payload = {
        title: 'Refactor Mongoose Queries for Indexing',
        description: 'Auto-generated AI description for indexing optimization.',
        priority: 'high',
        isAiGenerated: true,
        aiProvider: 'openai'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isAiGenerated).toBe(true);
    });

    it('GET /api/tasks should return list of tasks', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
