/**
 * Practical 12: CI/CD Pipeline with GitHub Actions
 * Deliberately Broken Test Suite (Jest + Supertest)
 * Demonstrates pipeline failure (Red X on GitHub Actions)
 * Author: Om Italiya (24IT029)
 */

const request = require('supertest');
const app = require('../server');
const { disconnectDB } = require('../src/config/db');

describe('AWDF Practical 12 - Deliberately Broken Pipeline Demonstration (24IT029)', () => {
  afterAll(async () => {
    await disconnectDB();
  });

  it('DELIBERATELY BROKEN TEST: Should fail pipeline by expecting HTTP status 999 instead of 200', async () => {
    const res = await request(app).get('/api/health');

    // This assertion is intentionally broken to demonstrate pipeline failure in CI/CD.
    // Expected: 200 (Real status)
    // Received: 200
    // But assertion asserts 999 to force Jest to fail with exit code 1
    console.log('[CI DEMO] Running deliberately broken assertion to simulate build failure...');
    expect(res.statusCode).toBe(999);
  });
});
