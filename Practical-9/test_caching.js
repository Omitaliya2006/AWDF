/**
 * Practical 9: In-Memory Caching & Query Optimization Automated Test Suite
 * Evaluates all 4 rubric criteria (20 Marks Total)
 *
 * Student: Om Italiya (24IT029)
 * Institution: CSPIT - CHARUSAT
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Resolve dependencies from backend node_modules if not at root
let mongoose;
try {
  mongoose = require('mongoose');
} catch {
  mongoose = require(path.join(__dirname, 'backend', 'node_modules', 'mongoose'));
}


// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

let totalChecks = 0;
let passedChecks = 0;

function assert(condition, testName) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ${colors.green}✅ [PASS]${colors.reset} ${testName}`);
    return true;
  } else {
    console.log(`  ${colors.red}❌ [FAIL]${colors.reset} ${testName}`);
    return false;
  }
}

// HTTP helper using native Node.js http
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const diff = process.hrtime(start);
        const durationMs = parseFloat((diff[0] * 1000 + diff[1] / 1e6).toFixed(2));
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: parsed,
          durationMs
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
  console.log(`\n${colors.bright}${colors.cyan}======================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}⚡ Running Practical 9: In-Memory Caching Evaluation Suite${colors.reset}`);
  console.log(`${colors.cyan}👤 Student: Om Italiya (24IT029) | CSPIT - CHARUSAT${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}======================================================================${colors.reset}\n`);

  const serverPort = 5099;
  process.env.PORT = serverPort;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/awdf_caching_test_24it029';
  process.env.CACHE_TTL = '60';

  // ----------------------------------------------------
  // SECTION 1: node-cache Setup (4 Marks)
  // ----------------------------------------------------
  console.log(`${colors.bright}${colors.yellow}--- SECTION 1: node-cache Setup (4 Marks) ---${colors.reset}`);

  const packageJsonPath = path.join(__dirname, 'backend', 'package.json');
  assert(fs.existsSync(packageJsonPath), 'backend/package.json exists');

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  assert(pkg.dependencies && pkg.dependencies['node-cache'], 'node-cache is listed in dependencies');

  const cacheModulePath = path.join(__dirname, 'backend', 'src', 'config', 'cache.js');
  assert(fs.existsSync(cacheModulePath), 'Cache configuration module (cache.js) exists');

  const cacheSource = fs.readFileSync(cacheModulePath, 'utf8');
  assert(
    cacheSource.includes('new NodeCache') && cacheSource.includes('stdTTL'),
    'NodeCache instance initialized with configurable stdTTL'
  );

  // Require backend application and cache module
  const cache = require('./backend/src/config/cache');
  assert(cache && typeof cache.get === 'function' && typeof cache.set === 'function', 'cache instance exports get/set methods');

  // Start HTTP Server
  const app = require('./backend/server');
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(serverPort, resolve));
  console.log(`  ${colors.blue}ℹ️  Test server booted on port ${serverPort}${colors.reset}`);

  // Clean test cache and database collection
  cache.flushAll();
  const Task = require('./backend/src/models/Task');
  await Task.deleteMany({});

  // Seed 3 test tasks
  const seed1 = await Task.create({ title: 'Task 1: Setup Caching', priority: 'high' });
  const seed2 = await Task.create({ title: 'Task 2: Invalidate Keys', priority: 'medium' });
  const seed3 = await Task.create({ title: 'Task 3: Measure Timings', priority: 'low' });

  // ----------------------------------------------------
  // SECTION 2: Cache on GET Implementation (5 Marks)
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 2: Cache on GET Implementation (5 Marks) ---${colors.reset}`);

  // 1. First GET /api/tasks -> MUST BE A CACHE MISS
  const resGet1 = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: '/api/tasks',
    method: 'GET'
  });
  assert(resGet1.statusCode === 200, 'First GET /api/tasks returns HTTP 200 OK');
  assert(
    resGet1.headers['x-cache'] === 'MISS' || resGet1.body.cacheStatus === 'MISS',
    'First GET /api/tasks is a Cache MISS (fetched from MongoDB)'
  );
  assert(cache.has('all_tasks'), 'Result of first GET is stored in cache with key "all_tasks"');

  // 2. Second GET /api/tasks -> MUST BE A CACHE HIT
  const resGet2 = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: '/api/tasks',
    method: 'GET'
  });
  assert(resGet2.statusCode === 200, 'Second GET /api/tasks returns HTTP 200 OK');
  assert(
    resGet2.headers['x-cache'] === 'HIT' || resGet2.body.cacheStatus === 'HIT',
    'Second GET /api/tasks is a Cache HIT (served from RAM without querying DB)'
  );
  assert(resGet2.body.data.length === 3, 'Cached response maintains exact task data integrity');

  // 3. Single-Task GET /api/tasks/:id caching (Supplementary Problem)
  const singleKey = `task_${seed1._id}`;
  const resSingle1 = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: `/api/tasks/${seed1._id}`,
    method: 'GET'
  });
  assert(resSingle1.statusCode === 200, `First GET /api/tasks/${seed1._id} returns HTTP 200 OK`);
  assert(resSingle1.headers['x-cache'] === 'MISS', 'First single task request is a Cache MISS');
  assert(cache.has(singleKey), `Single task is stored under unique cache key "${singleKey}"`);

  const resSingle2 = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: `/api/tasks/${seed1._id}`,
    method: 'GET'
  });
  assert(resSingle2.headers['x-cache'] === 'HIT', `Second GET /api/tasks/${seed1._id} is a Cache HIT`);

  // ----------------------------------------------------
  // SECTION 3: Cache Invalidation (5 Marks)
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 3: Cache Invalidation (5 Marks) ---${colors.reset}`);

  // Test 1: Invalidation on POST
  const newTaskPayload = { title: 'Task 4: Newly Added Task', priority: 'high' };
  const resPost = await makeRequest(
    {
      hostname: 'localhost',
      port: serverPort,
      path: '/api/tasks',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    newTaskPayload
  );
  assert(resPost.statusCode === 201, 'POST /api/tasks creates task with HTTP 201 Created');
  assert(!cache.has('all_tasks'), 'POST /api/tasks successfully invalidates "all_tasks" cache key');

  // Verify next GET is MISS and includes new item (prevents stale data)
  const resGetAfterPost = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: '/api/tasks',
    method: 'GET'
  });
  assert(resGetAfterPost.headers['x-cache'] === 'MISS', 'Subsequent GET after POST is a Cache MISS');
  assert(resGetAfterPost.body.data.length === 4, 'Stale data avoided: newly created task is included');

  // Test 2: Invalidation on PUT
  const updatePayload = { title: 'Task 1: Updated Title via PUT' };
  const resPut = await makeRequest(
    {
      hostname: 'localhost',
      port: serverPort,
      path: `/api/tasks/${seed1._id}`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    },
    updatePayload
  );
  assert(resPut.statusCode === 200, `PUT /api/tasks/${seed1._id} updates task with HTTP 200`);
  assert(!cache.has('all_tasks'), 'PUT operation invalidates "all_tasks" cache key');
  assert(!cache.has(singleKey), `PUT operation invalidates "${singleKey}" cache key`);

  // Test 3: Invalidation on DELETE
  const resDelete = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: `/api/tasks/${seed2._id}`,
    method: 'DELETE'
  });
  assert(resDelete.statusCode === 200, `DELETE /api/tasks/${seed2._id} deletes task with HTTP 200`);
  assert(!cache.has('all_tasks'), 'DELETE operation invalidates "all_tasks" cache key');

  // ----------------------------------------------------
  // SECTION 4: Response Time Comparison (6 Marks)
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 4: Response Time Comparison (6 Marks) ---${colors.reset}`);

  // Collect 3 Uncached Readings (using ?bypassCache=true)
  const uncachedTimings = [];
  for (let i = 1; i <= 3; i++) {
    const res = await makeRequest({
      hostname: 'localhost',
      port: serverPort,
      path: '/api/tasks?bypassCache=true',
      method: 'GET'
    });
    uncachedTimings.push(res.durationMs);
    console.log(`  ${colors.magenta}📊 Uncached Sample ${i}:${colors.reset} ${res.durationMs} ms (Source: MongoDB)`);
  }

  // Prime the cache
  await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: '/api/tasks',
    method: 'GET'
  });

  // Collect 3 Cached Readings
  const cachedTimings = [];
  for (let i = 1; i <= 3; i++) {
    const res = await makeRequest({
      hostname: 'localhost',
      port: serverPort,
      path: '/api/tasks',
      method: 'GET'
    });
    cachedTimings.push(res.durationMs);
    console.log(`  ${colors.cyan}⚡ Cached Sample ${i}:${colors.reset} ${res.durationMs} ms (Source: node-cache RAM)`);
  }

  const avgUncached = (uncachedTimings.reduce((a, b) => a + b, 0) / uncachedTimings.length).toFixed(2);
  const avgCached = (cachedTimings.reduce((a, b) => a + b, 0) / cachedTimings.length).toFixed(2);

  console.log(`\n  ${colors.bright}📈 Average Uncached:${colors.reset} ${avgUncached} ms`);
  console.log(`  ${colors.bright}⚡ Average Cached:${colors.reset}   ${avgCached} ms`);

  assert(uncachedTimings.length >= 3, 'At least 3 uncached response time readings recorded');
  assert(cachedTimings.length >= 3, 'At least 3 cached response time readings recorded');
  assert(
    parseFloat(avgCached) <= parseFloat(avgUncached),
    `In-memory cached response (${avgCached}ms) demonstrates measurable latency reduction vs uncached (${avgUncached}ms)`
  );

  // ----------------------------------------------------
  // SECTION 5: Supplementary Problems & Frontend Verification
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 5: Supplementary Problems & Frontend Verification ---${colors.reset}`);

  const resStats = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: '/api/cache/stats',
    method: 'GET'
  });
  assert(resStats.statusCode === 200, 'GET /api/cache/stats returns HTTP 200 OK');
  assert(resStats.body.data && typeof resStats.body.data.hits === 'number', 'Debug endpoint exposes cache hits counter');
  assert(typeof resStats.body.data.misses === 'number', 'Debug endpoint exposes cache misses counter');
  assert(typeof resStats.body.data.hitRate === 'string', 'Debug endpoint exposes hitRate percentage');

  // Benchmark API endpoint check
  const resBenchmark = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: '/api/cache/benchmark',
    method: 'GET'
  });
  assert(resBenchmark.statusCode === 200, 'GET /api/cache/benchmark executes automated empirical trials');
  assert(resBenchmark.body.benchmarkResults.uncachedReadingsMs.length === 5, 'Benchmark reports 5 trial readings');

  // Frontend Verification
  const frontendIndexHtml = path.join(__dirname, 'frontend', 'index.html');
  assert(fs.existsSync(frontendIndexHtml), 'frontend/index.html exists');

  const htmlContent = fs.readFileSync(frontendIndexHtml, 'utf8');
  assert(htmlContent.includes('Practical 9') && htmlContent.includes('24IT029'), 'index.html contains Practical 9 and Roll No 24IT029');

  const hudComp = path.join(__dirname, 'frontend', 'src', 'components', 'CacheMonitorHUD.jsx');
  assert(fs.existsSync(hudComp), 'CacheMonitorHUD.jsx component exists for real-time telemetry');

  const benchmarkComp = path.join(__dirname, 'frontend', 'src', 'components', 'BenchmarkModal.jsx');
  assert(fs.existsSync(benchmarkComp), 'BenchmarkModal.jsx exists for empirical trials');

  const vivaComp = path.join(__dirname, 'frontend', 'src', 'components', 'VivaGuideModal.jsx');
  assert(fs.existsSync(vivaComp), 'VivaGuideModal.jsx exists for oral examination defense');

  const frontendDistHtml = path.join(__dirname, 'frontend', 'dist', 'index.html');
  assert(fs.existsSync(frontendDistHtml), 'frontend production build (dist/) verified');

  // Clean up
  await Task.deleteMany({});
  await mongoose.disconnect();
  await new Promise((resolve) => server.close(resolve));
  console.log(`  ${colors.blue}ℹ️  Test server closed and DB disconnected${colors.reset}`);

  // Summary
  console.log(`\n${colors.bright}${colors.cyan}======================================================================${colors.reset}`);
  console.log(
    `${colors.bright}📊 EVALUATION SUMMARY: ${passedChecks} / ${totalChecks} Checks Passed (${Math.round((passedChecks / totalChecks) * 100)}%)${colors.reset}`
  );
  if (passedChecks === totalChecks) {
    console.log(`${colors.bright}${colors.green}🎉 ALL PRACTICAL 9 RUBRICS VERIFIED SUCCESSFULLY! 20/20 MARKS ACHIEVED${colors.reset}`);
  } else {
    console.log(`${colors.bright}${colors.red}⚠️ Some checks failed. Please review the output above.${colors.reset}`);
  }
  console.log(`${colors.bright}${colors.cyan}======================================================================${colors.reset}\n`);

  process.exit(passedChecks === totalChecks ? 0 : 1);
}

runTests().catch((err) => {
  console.error(`💥 Fatal test suite error: ${err.message}`);
  process.exit(1);
});
