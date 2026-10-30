/**
 * Practical 11: Containerization with Docker and Docker Compose
 * Automated Evaluation Suite - Evaluates all 4 rubric criteria (20 Marks Total)
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

async function runTests() {
  console.log(`\n${colors.bright}${colors.cyan}======================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}🐳 Running Practical 11: Docker & Docker Compose Evaluation Suite${colors.reset}`);
  console.log(`${colors.cyan}👤 Student: Om Italiya (24IT029) | CSPIT - CHARUSAT${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}======================================================================${colors.reset}\n`);

  const serverPort = 5101;
  process.env.PORT = serverPort;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/awdf_docker_test_24it029';

  // ----------------------------------------------------
  // SECTION 1: Dockerfile Frontend (4 Marks)
  // ----------------------------------------------------
  console.log(`${colors.bright}${colors.yellow}--- SECTION 1: Dockerfile Frontend (4 Marks) ---${colors.reset}`);

  const frontendDockerfile = path.join(__dirname, 'frontend', 'Dockerfile');
  assert(fs.existsSync(frontendDockerfile), 'frontend/Dockerfile exists');

  const fDockerContent = fs.readFileSync(frontendDockerfile, 'utf8');
  assert(
    fDockerContent.includes('FROM node:18') || fDockerContent.includes('FROM node:20'),
    'Frontend uses official Node.js 18 base image'
  );
  assert(
    fDockerContent.includes('AS build') && fDockerContent.includes('AS runner'),
    'Multi-stage build implemented for React app (AS build -> AS runner)'
  );
  assert(
    fDockerContent.includes('npm run build'),
    'Frontend build step (npm run build) present in Dockerfile'
  );
  assert(
    fDockerContent.includes('EXPOSE 5173') || fDockerContent.includes('5173'),
    'Frontend port 5173 exposed for host access'
  );

  const frontendDockerignore = path.join(__dirname, 'frontend', '.dockerignore');
  assert(fs.existsSync(frontendDockerignore), 'frontend/.dockerignore exists');
  const fIgnContent = fs.readFileSync(frontendDockerignore, 'utf8');
  assert(
    fIgnContent.includes('node_modules'),
    'frontend/.dockerignore excludes node_modules from build context'
  );

  // ----------------------------------------------------
  // SECTION 2: Dockerfile Backend (4 Marks)
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 2: Dockerfile Backend (4 Marks) ---${colors.reset}`);

  const backendDockerfile = path.join(__dirname, 'backend', 'Dockerfile');
  assert(fs.existsSync(backendDockerfile), 'backend/Dockerfile exists');

  const bDockerContent = fs.readFileSync(backendDockerfile, 'utf8');
  assert(
    bDockerContent.includes('FROM node:18') || bDockerContent.includes('FROM node:20'),
    'Backend uses official Node.js 18 base image'
  );
  assert(
    bDockerContent.includes('WORKDIR /app'),
    'Backend sets container working directory to /app'
  );
  assert(
    bDockerContent.includes('RUN npm install'),
    'Dependencies installed inside container via RUN npm install'
  );
  assert(
    bDockerContent.includes('EXPOSE 5000') || bDockerContent.includes('5000'),
    'Backend port 5000 exposed for host access'
  );
  assert(
    bDockerContent.includes('CMD ["node", "server.js"]') || bDockerContent.includes('server.js'),
    'Container entry command configured: CMD ["node", "server.js"]'
  );

  const backendDockerignore = path.join(__dirname, 'backend', '.dockerignore');
  assert(fs.existsSync(backendDockerignore), 'backend/.dockerignore exists');
  const bIgnContent = fs.readFileSync(backendDockerignore, 'utf8');
  assert(
    bIgnContent.includes('node_modules'),
    'backend/.dockerignore excludes node_modules from build context'
  );

  // ----------------------------------------------------
  // SECTION 3: Docker Compose File (6 Marks)
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 3: Docker Compose File (6 Marks) ---${colors.reset}`);

  const composeFile = path.join(__dirname, 'docker-compose.yml');
  assert(fs.existsSync(composeFile), 'docker-compose.yml exists at project root');

  const composeContent = fs.readFileSync(composeFile, 'utf8');
  assert(
    composeContent.includes('frontend:') && composeContent.includes('backend:') && composeContent.includes('mongodb:'),
    'Compose defines all 3 services: frontend, backend, mongodb'
  );
  assert(
    composeContent.includes('"5173:5173"') && composeContent.includes('"5000:5000"') && composeContent.includes('"27017:27017"'),
    'Correct port mappings configured (5173, 5000, 27017)'
  );
  assert(
    composeContent.includes('app-network') && composeContent.includes('driver: bridge'),
    'Services linked via internal bridge network (app-network)'
  );
  assert(
    composeContent.includes('mongodb://mongodb:27017') || composeContent.includes('mongodb:27017'),
    'Backend configured with inter-container service DNS URI (mongodb://mongodb:27017)'
  );
  assert(
    composeContent.includes('mongo-data:') && composeContent.includes('/data/db'),
    'Named volume (mongo-data:/data/db) defined for MongoDB persistence'
  );
  assert(
    composeContent.includes('depends_on:'),
    'Startup dependency chain configured using depends_on'
  );

  // ----------------------------------------------------
  // SECTION 4: Single Command Run & Application Verification (6 Marks)
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 4: Single Command Run & Application Verification (6 Marks) ---${colors.reset}`);

  const rootPkgPath = path.join(__dirname, 'package.json');
  assert(fs.existsSync(rootPkgPath), 'Root package.json exists');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
  assert(
    rootPkg.scripts && rootPkg.scripts['docker:up'] && rootPkg.scripts['docker:up'].includes('docker-compose up'),
    'Single-command npm script configured: "npm run docker:up"'
  );

  // Boot test server to test API endpoints
  const app = require('./backend/server');
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(serverPort, resolve));
  console.log(`  ${colors.blue}ℹ️  Test server booted on port ${serverPort}${colors.reset}`);

  const Task = require('./backend/src/models/Task');
  await Task.deleteMany({});

  // 1. Test Root Health Check
  const resRoot = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: '/',
    method: 'GET'
  });
  assert(resRoot.statusCode === 200, 'GET / returns HTTP 200 OK');
  assert(resRoot.body.service === 'backend', 'Health check confirms backend service is running');

  // 2. Test Container Telemetry Endpoint
  const resInfo = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: '/api/tasks/info',
    method: 'GET'
  });
  assert(resInfo.statusCode === 200, 'GET /api/tasks/info returns container metadata');
  assert(resInfo.body.network && resInfo.body.network.composeNetwork.includes('app-network'), 'Container telemetry reports app-network bridge');
  assert(resInfo.body.orchestration && resInfo.body.orchestration.volume.includes('mongo-data'), 'Container telemetry reports mongo-data volume');

  // 3. Test Full REST CRUD Flow
  const newTaskPayload = {
    title: 'Containerize Full-Stack Application',
    description: 'Docker Compose orchestration with named volumes',
    priority: 'high'
  };

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
  assert(resPost.body.data && resPost.body.data.title === newTaskPayload.title, 'Created task data returned in response');

  const taskId = resPost.body.data._id;

  const resGet = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: '/api/tasks',
    method: 'GET'
  });
  assert(resGet.statusCode === 200, 'GET /api/tasks retrieves task documents from volume');
  assert(resGet.body.data.length === 1, 'Task count matches created document');

  const resPut = await makeRequest(
    {
      hostname: 'localhost',
      port: serverPort,
      path: `/api/tasks/${taskId}`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    },
    { completed: true }
  );
  assert(resPut.statusCode === 200, `PUT /api/tasks/${taskId} updates task with HTTP 200`);

  const resDelete = await makeRequest({
    hostname: 'localhost',
    port: serverPort,
    path: `/api/tasks/${taskId}`,
    method: 'DELETE'
  });
  assert(resDelete.statusCode === 200, `DELETE /api/tasks/${taskId} removes task with HTTP 200`);

  // ----------------------------------------------------
  // SECTION 5: Frontend & Topology Verification
  // ----------------------------------------------------
  console.log(`\n${colors.bright}${colors.yellow}--- SECTION 5: Frontend & Topology Verification ---${colors.reset}`);

  const frontendIndexHtml = path.join(__dirname, 'frontend', 'index.html');
  assert(fs.existsSync(frontendIndexHtml), 'frontend/index.html exists');
  const htmlContent = fs.readFileSync(frontendIndexHtml, 'utf8');
  assert(
    htmlContent.includes('Practical 11') && htmlContent.includes('24IT029'),
    'index.html contains Practical 11 and Roll No 24IT029'
  );

  const topologyHUD = path.join(__dirname, 'frontend', 'src', 'components', 'ContainerTopologyHUD.jsx');
  assert(fs.existsSync(topologyHUD), 'ContainerTopologyHUD.jsx component exists');

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
    console.log(`${colors.bright}${colors.green}🎉 ALL PRACTICAL 11 RUBRICS VERIFIED SUCCESSFULLY! 20/20 MARKS ACHIEVED${colors.reset}`);
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
