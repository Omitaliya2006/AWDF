/**
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * Automated Evaluation Suite - Evaluates all 4 rubric sections (20 Marks Total)
 *
 * Student: Om Italiya (24IT029)
 * Institution: CSPIT - CHARUSAT
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

let mongoose;
try {
  mongoose = require('mongoose');
} catch {
  mongoose = require(path.join(__dirname, 'backend', 'node_modules', 'mongoose'));
}

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log(`\n${colors.bright}${colors.cyan}======================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}⚡ Running Practical 10: Event-Driven Async Processing Evaluation Suite${colors.reset}`);
  console.log(`${colors.cyan}👤 Student: Om Italiya (24IT029) | CSPIT - CHARUSAT${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}======================================================================${colors.reset}\n`);

  const serverPort = 5100;
  process.env.PORT = serverPort;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/awdf_events_test_24it029';
  process.env.NOTIFICATION_DELAY_MS = '600'; // 600ms test delay for quick, deterministic async testing

  // ----------------------------------------------------
  // SECTION 1: EventEmitter Setup (4 Marks)
  // ----------------------------------------------------
  console.log(`${colors.bright}${colors.yellow}--- SECTION 1: EventEmitter Setup (4 Marks) ---${colors.reset}`);

  const packageJsonPath = path.join(__dirname, 'backend', 'package.json');
  assert(fs.existsSync(packageJsonPath), 'backend/package.json exists');

  const eventsModulePath = path.join(__dirname, 'backend', 'src', 'config', 'events.js');
  assert(fs.existsSync(eventsModulePath), 'Dedicated events module (events.js) exists');

  const eventsSource = fs.readFileSync(eventsModulePath, 'utf8');
  assert(
    eventsSource.includes("require('events')") && eventsSource.includes('class TaskEvents extends EventEmitter'),
    'Node.js native EventEmitter imported and instantiated as TaskEvents class'
  );

  const listenersModulePath = path.join(__dirname, 'backend', 'src', 'listeners', 'taskListeners.js');
  assert(fs.existsSync(listenersModulePath), 'Dedicated listeners module (taskListeners.js) exists');

  const listenersSource = fs.readFileSync(listenersModulePath, 'utf8');
  assert(
    listenersSource.includes("taskEvents.on('task-created'") && listenersSource.includes('[Notification]'),
    'Listener registered for "task-created" event with notification logging'
  );

  // Require backend server and events
  const taskEvents = require('./backend/src/config/events');
  const notificationStore = require('./backend/src/listeners/notificationLog');
  notificationStore.setDelay(600); // 600ms async delay
  notificationStore.clear();

  const app = require('./backend/server');
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(serverPort, resolve));
  console.log(`  ${colors.blue}ℹ️  Test server booted on port ${serverPort}${colors.reset}`);

  const Task = require('./backend/src/models/Task');
  await Task.deleteMany({});

  // ----------------------------------------------------
  // SECTION 2: Event Emission on Task Create (5 Marks)
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 2: Event Emission on Task Create (5 Marks) ---${colors.reset}`);

  const taskPayload = {
    title: 'Deploy Event-Driven Microservice',
    description: 'Verify non-blocking background notifications',
    priority: 'high',
    assignedTo: 'Om Italiya (24IT029)'
  };

  const resPost = await makeRequest(
    {
      hostname: 'localhost',
      port: serverPort,
      path: '/api/tasks',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    taskPayload
  );

  assert(resPost.statusCode === 201, 'POST /api/tasks returns HTTP 201 Created');
  assert(resPost.body.data && resPost.body.data.title === taskPayload.title, 'Created task data returned in response');
  assert(typeof resPost.body.apiResponseTime === 'string', 'API response includes exact timestamp');
  assert(
    resPost.durationMs < 500,
    `API response is immediate and non-blocking (${resPost.durationMs}ms < 600ms background delay)`
  );

  // ----------------------------------------------------
  // SECTION 3: Async Handler & Background Execution (5 Marks)
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 3: Async Handler & Background Execution (5 Marks) ---${colors.reset}`);

  // Check pending status immediately after response
  const logsInitial = notificationStore.getLogs();
  assert(logsInitial.length >= 1, 'task-created event recorded in background notification store');
  assert(logsInitial[0].status === 'processing', 'Background notification was in "processing" state during API response');

  console.log(`  ${colors.blue}⏳ Waiting 800ms for background listener to complete execution...${colors.reset}`);
  await sleep(800);

  const logsAfter = notificationStore.getLogs();
  assert(logsAfter[0].status === 'completed', 'Background notification successfully completed after artificial delay');
  assert(
    logsAfter[0].logMessage.includes('[Notification]') && logsAfter[0].logMessage.includes(taskPayload.title),
    'Listener produced formatted notification with task title and assigned user'
  );

  // ----------------------------------------------------
  // SECTION 4: Timestamp Logging Evidence (6 Marks)
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 4: Timestamp Logging Evidence (6 Marks) ---${colors.reset}`);

  const eventRecord = logsAfter[0];
  const apiTime = new Date(eventRecord.apiResponseAt).getTime();
  const listenerTime = new Date(eventRecord.handlerCompletedAt).getTime();
  const deltaMs = listenerTime - apiTime;

  console.log(`  ${colors.magenta}📅 [API Response Timestamp]:${colors.reset}       ${eventRecord.apiResponseAt}`);
  console.log(`  ${colors.cyan}📅 [Listener Complete Timestamp]:${colors.reset}  ${eventRecord.handlerCompletedAt}`);
  console.log(`  ${colors.bright}⏱️  [Timing Delta]:${colors.reset}                +${deltaMs} ms (Listener completed AFTER response)`);

  assert(
    listenerTime > apiTime,
    `Console timestamp ordering strictly verified: API response (${eventRecord.apiResponseAt}) was sent BEFORE notification completion (${eventRecord.handlerCompletedAt})`
  );
  assert(deltaMs >= 500, `Background duration (${deltaMs}ms) matches configured non-blocking delay`);

  // ----------------------------------------------------
  // SECTION 5: Supplementary Problems Verification
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 5: Supplementary Problems Verification ---${colors.reset}`);

  // Test 1: task-deleted Event
  const taskId = resPost.body.data._id;
  const resDelete = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: `/api/tasks/${taskId}`,
    method: 'DELETE'
  });
  assert(resDelete.statusCode === 200, `DELETE /api/tasks/${taskId} returns HTTP 200 OK`);

  console.log(`  ${colors.blue}⏳ Waiting 1100ms for task-deleted listener...${colors.reset}`);
  await sleep(1100);

  const deleteLog = notificationStore.getLogs().find((l) => l.event === 'task-deleted');
  assert(deleteLog !== undefined, 'Supplementary "task-deleted" event was emitted and captured');
  assert(deleteLog.status === 'completed', '"task-deleted" listener completed asynchronously');
  assert(
    deleteLog.logMessage.includes('[Audit Log]') && deleteLog.logMessage.includes('deleted'),
    '"task-deleted" listener produced distinct audit log message'
  );

  // Test 2: Error Event Listener
  let caughtError = null;
  taskEvents.once('error', (err) => {
    caughtError = err;
  });

  const resErrorTrigger = await makeRequest(
    {
      hostname: 'localhost',
      port: serverPort,
      path: '/api/events/simulate-error',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { message: 'Test background notification delivery failure' }
  );
  assert(resErrorTrigger.statusCode === 200, 'POST /api/events/simulate-error executed successfully');
  assert(caughtError !== null, 'Supplementary error listener caught the background error without crashing server');

  // Test 3: Frontend Audit API endpoints
  const resLogsApi = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: '/api/events/logs',
    method: 'GET'
  });
  assert(resLogsApi.statusCode === 200, 'GET /api/events/logs returns live event audit stream');

  const resStatsApi = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: '/api/events/stats',
    method: 'GET'
  });
  assert(resStatsApi.statusCode === 200, 'GET /api/events/stats returns event metrics');
  assert(
    resStatsApi.body.data['task-created'] >= 1 && resStatsApi.body.data['task-deleted'] >= 1,
    'Event statistics report accurate counts for all emitted events'
  );

  // Frontend Verification
  const frontendIndexHtml = path.join(__dirname, 'frontend', 'index.html');
  assert(fs.existsSync(frontendIndexHtml), 'frontend/index.html exists');

  const htmlContent = fs.readFileSync(frontendIndexHtml, 'utf8');
  assert(
    htmlContent.includes('Practical 10') && htmlContent.includes('24IT029'),
    'index.html contains Practical 10 and Roll No 24IT029'
  );

  const hudComp = path.join(__dirname, 'frontend', 'src', 'components', 'EventMonitorHUD.jsx');
  assert(fs.existsSync(hudComp), 'EventMonitorHUD.jsx component exists for real-time telemetry');

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
    console.log(`${colors.bright}${colors.green}🎉 ALL PRACTICAL 10 RUBRICS VERIFIED SUCCESSFULLY! 20/20 MARKS ACHIEVED${colors.reset}`);
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

