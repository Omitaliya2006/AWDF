/**
 * Automated Evaluation Test Suite for Practical 7
 * Authentication and Middleware Pipeline (JWT, bcryptjs, Input Validation)
 *
 * Verifies all 20/20 Rubric Marks:
 * • User Registration & bcrypt Hashing (3 Marks)
 * • JWT Login Flow & Credentials Validation (5 Marks)
 * • Auth Middleware & Protected Route Guarding (5 Marks)
 * • Input Validation Rules Enforcement (4 Marks)
 * • Structured Error Responses without Stack Traces (3 Marks)
 * • Supplementary Endpoints (/me & /tasks/seed)
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
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

const app = require('./backend/server');
const User = require('./backend/src/models/User');
const Task = require('./backend/src/models/Task');

const TEST_PORT = 5097;
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
  console.log('🔐 Running Practical 7: Authentication & Middleware Evaluation Suite');
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

    if (mongoose.connection.readyState !== 1) {
      console.log('[TEST HARNESS] Awaiting MongoDB connection readyState...');
      await new Promise((resolve) => {
        mongoose.connection.once('open', resolve);
        setTimeout(resolve, 3000);
      });
    }

    const testUserEmail = `test.student.${Date.now()}@charusat.edu.in`;
    const testPassword = 'SecurePassword123!';
    let authToken = '';
    let registeredUserId = '';

    console.log('\n--- SECTION 1: User Registration & bcrypt Hashing (3 Marks) ---');

    // Test 1: User Registration
    const regRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        name: 'Om Italiya',
        email: testUserEmail,
        password: testPassword
      }
    );
    assert(regRes.statusCode === 201, 'POST /auth/register returns HTTP 201 Created');
    assert(regRes.body?.token !== undefined, 'Registration response includes signed JWT token');
    assert(regRes.body?.user?.email === testUserEmail.toLowerCase(), 'Registration returns correct user email');
    assert(regRes.body?.user?.password === undefined, 'Password is NOT exposed in registration response');

    registeredUserId = regRes.body?.user?.id;

    // Test 2: Verify Password Hashing in MongoDB
    const userInDb = await User.findOne({ email: testUserEmail });
    assert(userInDb !== null, 'User document saved in MongoDB database');
    assert(userInDb.password !== testPassword, 'Password is NOT stored in plain text');
    assert(userInDb.password.startsWith('$2a$') || userInDb.password.startsWith('$2b$'), 'Password is encrypted using bcrypt hash ($2a$/$2b$)');

    // Test 3: Duplicate Email Rejection
    const dupRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        name: 'Duplicate Student',
        email: testUserEmail,
        password: 'AnotherPassword123'
      }
    );
    assert(dupRes.statusCode === 409, 'Registration with duplicate email returns HTTP 409 Conflict');

    console.log('\n--- SECTION 2: JWT Login Flow & Credentials Verification (5 Marks) ---');

    // Test 4: Successful Login
    const loginRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        email: testUserEmail,
        password: testPassword
      }
    );
    assert(loginRes.statusCode === 200, 'POST /auth/login returns HTTP 200 OK');
    assert(typeof loginRes.body?.token === 'string', 'Login returns valid JWT token string');
    assert(loginRes.body?.user?.password === undefined, 'Password is NOT exposed in login response');

    authToken = loginRes.body?.token;

    // Test 5: Login with Wrong Password
    const wrongPassRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        email: testUserEmail,
        password: 'IncorrectPassword'
      }
    );
    assert(wrongPassRes.statusCode === 401, 'Login with incorrect password returns HTTP 401 Unauthorized');

    // Test 6: Login with Non-Existent Email
    const unknownUserRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        email: 'nonexistent.user@charusat.edu.in',
        password: 'SomePassword123'
      }
    );
    assert(unknownUserRes.statusCode === 401, 'Login with non-existent email returns HTTP 401 Unauthorized');

    // Test 7: Supplementary /auth/me Endpoint
    const meRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/auth/me',
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(meRes.statusCode === 200, 'GET /auth/me with Bearer token returns HTTP 200 OK');
    assert(meRes.body?.user?.email === testUserEmail, '/auth/me returns currently authenticated user details');

    console.log('\n--- SECTION 3: Auth Middleware & Protected Routes (5 Marks) ---');

    // Test 8: Request without Authorization Header
    const noAuthRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/tasks',
      method: 'GET'
    });
    assert(noAuthRes.statusCode === 401, 'GET /tasks without Authorization header returns HTTP 401 Unauthorized');

    // Test 9: Request with Invalid / Tampered Token
    const badTokenRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/tasks',
      method: 'GET',
      headers: { Authorization: 'Bearer invalid.tampered.token.string' }
    });
    assert(badTokenRes.statusCode === 401, 'GET /tasks with invalid token signature returns HTTP 401 Unauthorized');

    // Test 10: Request with Malformed Header (No Bearer Prefix)
    const malformedAuthRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/tasks',
      method: 'GET',
      headers: { Authorization: `${authToken}` }
    });
    assert(malformedAuthRes.statusCode === 401, 'Authorization without "Bearer " prefix returns HTTP 401');

    // Test 11: Valid Token Grants Access to Protected Route
    const authTasksRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/tasks',
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(authTasksRes.statusCode === 200, 'GET /tasks with valid Bearer token returns HTTP 200 OK');

    // Test 12: Create Task Associated with User
    const createTaskRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/tasks',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      },
      {
        title: 'Verify JWT Protected Task Creation',
        description: 'Created through authenticated API pipeline with valid Bearer token',
        priority: 'high'
      }
    );
    assert(createTaskRes.statusCode === 201, 'POST /tasks with valid JWT returns HTTP 201 Created');
    assert(createTaskRes.body?.data?.user !== undefined, 'Task document in MongoDB is linked to authenticated user ID');

    const createdTaskId = createTaskRes.body?.data?._id || createTaskRes.body?.data?.id;

    // Test 13: Seed Tasks for Authenticated User
    const seedRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/tasks/seed',
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      },
      {}
    );
    assert(seedRes.statusCode === 201, 'POST /tasks/seed seeds tasks for logged-in user (HTTP 201)');

    console.log('\n--- SECTION 4: Input Validation Rules (4 Marks) ---');

    // Rule 1: Registration with invalid email format
    const badEmailRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        name: 'Test Student',
        email: 'invalid-email-format-without-at',
        password: 'Password123'
      }
    );
    assert(badEmailRes.statusCode === 400, 'Validation Rule 1: Invalid email format rejected with HTTP 400');

    // Rule 2: Registration with short password (< 6 chars)
    const shortPassRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        name: 'Test Student',
        email: 'valid.email@charusat.edu.in',
        password: '123'
      }
    );
    assert(shortPassRes.statusCode === 400, 'Validation Rule 2: Password < 6 characters rejected with HTTP 400');

    // Rule 3: Registration with missing name
    const missingNameRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        email: 'valid.email2@charusat.edu.in',
        password: 'Password123'
      }
    );
    assert(missingNameRes.statusCode === 400, 'Validation Rule 3: Missing name rejected with HTTP 400');

    // Rule 4: Task creation with missing/short title
    const shortTitleRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/tasks',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      },
      {
        title: 'a', // only 1 char
        priority: 'low'
      }
    );
    assert(shortTitleRes.statusCode === 400, 'Validation Rule 4: Task title < 2 characters rejected with HTTP 400');

    // Rule 5: Task creation with invalid priority enum
    const badPriorityRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/tasks',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      },
      {
        title: 'Task with invalid priority',
        priority: 'ultra-critical'
      }
    );
    assert(badPriorityRes.statusCode === 400, 'Validation Rule 5: Unsupported priority enum rejected with HTTP 400');

    console.log('\n--- SECTION 5: Error Response Structure & Security (3 Marks) ---');

    // Test 14: Consistent JSON structure (success, error, message, statusCode)
    assert(badEmailRes.body?.success === false, 'Error response includes "success: false"');
    assert(typeof badEmailRes.body?.message === 'string', 'Error response includes human-readable "message"');
    assert(badEmailRes.body?.statusCode === 400, 'Error response includes "statusCode"');

    // Test 15: No Stack Traces Exposed
    assert(badEmailRes.body?.stack === undefined, 'Security check: No stack trace leaked in 400 response');
    assert(noAuthRes.body?.stack === undefined, 'Security check: No stack trace leaked in 401 response');

    // Test 16: Structured 404 for undefined routes
    const notFoundRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/undefined-route-testing-404',
      method: 'GET'
    });
    assert(notFoundRes.statusCode === 404, 'Undefined route triggers structured HTTP 404 handler');
    assert(notFoundRes.body?.stack === undefined, 'Security check: No stack trace leaked in 404 response');

    console.log('\n--- SECTION 6: Frontend Build Verification ---');

    // Test 17: React Production Build Artifacts
    const distHtmlPath = path.join(__dirname, 'frontend', 'dist', 'index.html');
    const distExists = fs.existsSync(distHtmlPath);
    assert(distExists, 'React production build file "frontend/dist/index.html" exists');
    if (distExists) {
      const htmlContent = fs.readFileSync(distHtmlPath, 'utf-8');
      assert(htmlContent.includes('Practical 7'), 'Build index.html contains Practical 7 title metadata');
      assert(htmlContent.includes('24IT029'), 'Build index.html contains roll number 24IT029');
    }

    console.log('\n======================================================================');
    console.log(`📊 EVALUATION SUMMARY: ${passed} / ${total} Checks Passed (${Math.round((passed / total) * 100)}%)`);
    if (passed === total) {
      console.log('🎉 ALL PRACTICAL 7 RUBRICS VERIFIED SUCCESSFULLY! 20/20 MARKS ACHIEVED');
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
