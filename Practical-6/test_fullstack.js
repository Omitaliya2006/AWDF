/**
 * Automated Full-Stack Evaluation Test Suite for Practical 6
 * Full Stack Integration: React + Node.js/Express + MongoDB (MERN)
 *
 * Student: Om Italiya (24IT029)
 * Department: Information Technology, CSPIT (CHARUSAT)
 * Course: Advanced Web Development Frameworks (AWDF)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
let mongoose;
try {
  mongoose = require('mongoose');
} catch {
  mongoose = require('./backend/node_modules/mongoose');
}

// Point to backend server and model
const app = require('./backend/server');
const Task = require('./backend/src/models/Task');

const TEST_PORT = 5099;
let server;

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch {
          parsed = body;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: parsed
        });
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('======================================================================');
  console.log('🚀 Running Practical 6: Full-Stack MERN Integration Evaluation Suite');
  console.log('👤 Student: Om Italiya (24IT029) | CSPIT - CHARUSAT');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message, details = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      console.error(`  ❌ [FAIL] ${message} ${details ? `(${details})` : ''}`);
    }
  }

  try {
    // 1. Start Server on TEST_PORT
    await new Promise((resolve) => {
      server = app.listen(TEST_PORT, () => {
        console.log(`[TEST HARNESS] Express test instance running on port ${TEST_PORT}`);
        resolve();
      });
    });

    // Wait briefly for Mongoose connection if needed
    if (mongoose.connection.readyState !== 1) {
      console.log('[TEST HARNESS] Awaiting MongoDB connection readyState...');
      await new Promise((resolve) => {
        mongoose.connection.once('open', resolve);
        setTimeout(resolve, 3000);
      });
    }

    console.log('\n--- SECTION 1: System Health, Root & CORS Verification ---');

    // Test 1: Root status & Student Attribution
    const rootRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/',
      method: 'GET'
    });
    assert(rootRes.statusCode === 200, 'GET / returns HTTP 200 OK');
    assert(rootRes.body?.student?.rollNo === '24IT029', 'Root endpoint attributes student Om Italiya (24IT029)');

    // Test 2: CORS Header
    assert(
      rootRes.headers['access-control-allow-origin'] !== undefined,
      'CORS header "Access-Control-Allow-Origin" is configured for React client'
    );

    // Test 3: Health Endpoint
    const healthRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/health',
      method: 'GET'
    });
    assert(healthRes.statusCode === 200, 'GET /api/health returns HTTP 200 OK');
    assert(healthRes.body?.status === 'healthy', 'Health API reports status: "healthy"');
    assert(healthRes.body?.database?.status === 'connected', 'Database reports status: "connected"');

    // Test 4: API Meta info
    const metaRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api',
      method: 'GET'
    });
    assert(metaRes.statusCode === 200, 'GET /api returns metadata 200 OK');
    assert(metaRes.body?.schema?.model === 'Task', 'Meta references Mongoose Task model');

    console.log('\n--- SECTION 2: Database Seeding & Reset Endpoint ---');

    // Test 5: Seed sample tasks
    const seedRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/tasks/seed',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {}
    );
    assert(seedRes.statusCode === 201, 'POST /tasks/seed returns HTTP 201 Created');
    assert(seedRes.body?.data?.length === 3, 'Seed endpoint populates exactly 3 sample tasks');

    console.log('\n--- SECTION 3: Full CRUD API Operations ---');

    // Test 6: GET all tasks
    const getTasksRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/tasks',
      method: 'GET'
    });
    assert(getTasksRes.statusCode === 200, 'GET /tasks returns HTTP 200 OK');
    assert(Array.isArray(getTasksRes.body?.data), 'GET /tasks returns an array in data');

    // Test 7: POST Create Task
    const createRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/tasks',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        title: '  Full-Stack Integration Verification  ',
        description: 'Automated test task verifying Mongoose pre-save trimming and persistence',
        priority: 'high',
        completed: false
      }
    );
    assert(createRes.statusCode === 201, 'POST /tasks returns HTTP 201 Created');
    assert(createRes.body?.data?.title === 'Full-Stack Integration Verification', 'Pre-save hook trimmed title whitespace');
    assert(createRes.body?.data?.priority === 'high', 'Priority set to "high" correctly');

    const createdId = createRes.body?.data?._id || createRes.body?.data?.id;

    // Test 8: GET Task by ID
    const getByIdRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: `/tasks/${createdId}`,
      method: 'GET'
    });
    assert(getByIdRes.statusCode === 200, 'GET /tasks/:id returns HTTP 200 OK');
    assert(getByIdRes.body?.data?.title === 'Full-Stack Integration Verification', 'Retrieved task document title matches');

    // Test 9: PUT Update Task
    const updateRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: `/tasks/${createdId}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        title: 'Updated Full-Stack Task',
        completed: true
      }
    );
    assert(updateRes.statusCode === 200, 'PUT /tasks/:id returns HTTP 200 OK');
    assert(updateRes.body?.data?.completed === true, 'Updated task completed status toggled to true');
    assert(updateRes.body?.data?.title === 'Updated Full-Stack Task', 'Updated task title reflects new text');

    // Test 10: DELETE Task
    const deleteRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: `/tasks/${createdId}`,
      method: 'DELETE'
    });
    assert(deleteRes.statusCode === 200, 'DELETE /tasks/:id returns HTTP 200 OK');

    // Test 11: Verify 404 after deletion
    const verifyDeleteRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: `/tasks/${createdId}`,
      method: 'GET'
    });
    assert(verifyDeleteRes.statusCode === 404, 'GET /tasks/:id returns HTTP 404 Not Found after deletion');

    console.log('\n--- SECTION 4: Schema Validation & Error Handling ---');

    // Test 12: Missing title validation
    const missingTitleRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/tasks',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      { description: 'No title provided', priority: 'low' }
    );
    assert(missingTitleRes.statusCode === 400, 'POST /tasks without title triggers HTTP 400 ValidationError');

    // Test 13: Invalid priority enum constraint
    const invalidPriorityRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/tasks',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      { title: 'Invalid Enum Test', priority: 'super-urgent' }
    );
    assert(invalidPriorityRes.statusCode === 400, 'POST /tasks with invalid priority triggers HTTP 400');

    // Test 14: Invalid MongoDB ObjectId CastError
    const castErrorRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/tasks/not-a-valid-object-id',
      method: 'GET'
    });
    assert(castErrorRes.statusCode === 400, 'Invalid ObjectId format returns HTTP 400 CastError handling');

    // Test 15: Undefined route 404 handler
    const notFoundRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/undefined-api-path',
      method: 'GET'
    });
    assert(notFoundRes.statusCode === 404, 'Undefined route triggers structured HTTP 404 handler');

    console.log('\n--- SECTION 5: Frontend Build Verification ---');

    // Test 16: Verify React production build output exists
    const distHtmlPath = path.join(__dirname, 'frontend', 'dist', 'index.html');
    const distExists = fs.existsSync(distHtmlPath);
    assert(distExists, 'React production build file "frontend/dist/index.html" exists');

    if (distExists) {
      const htmlContent = fs.readFileSync(distHtmlPath, 'utf-8');
      assert(htmlContent.includes('Practical 6'), 'Build index.html contains Practical 6 title metadata');
      assert(htmlContent.includes('24IT029'), 'Build index.html contains roll number 24IT029');
    }

    console.log('\n======================================================================');
    console.log(`📊 EVALUATION SUMMARY: ${passed} / ${total} Checks Passed (${Math.round((passed / total) * 100)}%)`);
    if (passed === total) {
      console.log('🎉 ALL FULL-STACK INTEGRATION REQUIREMENTS VERIFIED SUCCESSFULLY! 20/20');
    } else {
      console.log('⚠️ Some checks did not pass. Review output above.');
    }
    console.log('======================================================================\n');

  } catch (err) {
    console.error('Fatal evaluation suite error:', err);
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
    process.exit(passed === total ? 0 : 1);
  }
}

runTests();
