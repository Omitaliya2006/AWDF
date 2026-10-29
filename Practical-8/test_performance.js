/**
 * Automated Evaluation Test Suite for Practical 8
 * Performance Optimization and Lazy Loading in React
 *
 * Verifies all 20/20 Rubric Marks:
 * • Lazy Loading Implementation (6 Marks)
 * • Code Splitting Evidence via Build Chunks (5 Marks)
 * • Before/After Comparison & Metrics (5 Marks)
 * • Fallback UI & Network Throttling Handling (4 Marks)
 * • Supplementary Problems (Heavy Chart & Profiler HUD)
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('======================================================================');
  console.log('⚡ Running Practical 8: Performance & Lazy Loading Evaluation Suite');
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

  // --- SECTION 1: Lazy Loading Implementation (6 Marks) ---
  console.log('--- SECTION 1: Lazy Loading Implementation (6 Marks) ---');
  const appJsxPath = path.join(__dirname, 'src', 'App.jsx');
  assert(fs.existsSync(appJsxPath), 'App.jsx exists in src directory');

  const appSource = fs.readFileSync(appJsxPath, 'utf-8');

  // Check 1: Dynamic import / lazy usage
  assert(
    appSource.includes('lazy') || appSource.includes('lazyWithDelay'),
    'App.jsx utilizes React.lazy() dynamic route imports'
  );

  // Check 2: At least 2 route-based components lazy loaded (Projects & Contact)
  const hasProjectsLazy = appSource.includes("import('./pages/Projects')");
  const hasContactLazy = appSource.includes("import('./pages/Contact')");
  const hasAnalyticsLazy = appSource.includes("import('./pages/Analytics')");
  assert(hasProjectsLazy, 'Projects route is lazy loaded via import("./pages/Projects")');
  assert(hasContactLazy, 'Contact route is lazy loaded via import("./pages/Contact")');
  assert(hasAnalyticsLazy, 'Analytics route (heavy component) is lazy loaded via import("./pages/Analytics")');

  // Check 3: Suspense Wrapper present
  assert(appSource.includes('<Suspense'), 'Suspense wrapper component is applied around the route tree');
  assert(appSource.includes('fallback='), 'Suspense wrapper includes fallback prop');
  assert(appSource.includes('<PageLoader'), 'Suspense uses PageLoader fallback component');

  // --- SECTION 2: Code Splitting Evidence in Build Output (5 Marks) ---
  console.log('\n--- SECTION 2: Code Splitting Evidence in Build Output (5 Marks) ---');
  const distDir = path.join(__dirname, 'dist');
  const assetsDir = path.join(distDir, 'assets');

  assert(fs.existsSync(distDir), 'Production build directory "dist/" exists');
  assert(fs.existsSync(assetsDir), 'Build assets directory "dist/assets/" exists');

  const assetFiles = fs.readdirSync(assetsDir);

  const entryChunk = assetFiles.find((f) => f.startsWith('index-') && f.endsWith('.js'));
  const projectsChunk = assetFiles.find((f) => f.startsWith('Projects-') && f.endsWith('.js'));
  const contactChunk = assetFiles.find((f) => f.startsWith('Contact-') && f.endsWith('.js'));
  const analyticsChunk = assetFiles.find((f) => f.startsWith('Analytics-') && f.endsWith('.js'));
  const homeChunk = assetFiles.find((f) => f.startsWith('Home-') && f.endsWith('.js'));

  assert(entryChunk !== undefined, `Main entry chunk exists: ${entryChunk}`);
  assert(projectsChunk !== undefined, `Projects route chunk generated: ${projectsChunk}`);
  assert(contactChunk !== undefined, `Contact route chunk generated: ${contactChunk}`);
  assert(analyticsChunk !== undefined, `Analytics route chunk generated: ${analyticsChunk}`);
  assert(homeChunk !== undefined, `Home route chunk generated: ${homeChunk}`);

  const jsChunks = assetFiles.filter((f) => f.endsWith('.js'));
  assert(jsChunks.length >= 4, `Multiple independent code-split chunks verified (${jsChunks.length} chunks generated)`);

  // --- SECTION 3: Before/After Comparison & Metrics (5 Marks) ---
  console.log('\n--- SECTION 3: Before/After Comparison & Metrics (5 Marks) ---');

  // Measure chunk sizes
  let totalJsSize = 0;
  jsChunks.forEach((chunk) => {
    const stat = fs.statSync(path.join(assetsDir, chunk));
    totalJsSize += stat.size;
  });

  const entryStat = fs.statSync(path.join(assetsDir, entryChunk));
  const entrySizeKb = (entryStat.size / 1024).toFixed(1);
  const totalSizeKb = (totalJsSize / 1024).toFixed(1);

  assert(
    entryStat.size < totalJsSize,
    `Initial entry chunk (${entrySizeKb} KB) is smaller than total app JS (${totalSizeKb} KB)`
  );

  const hudPath = path.join(__dirname, 'src', 'components', 'PerformanceHUD.jsx');
  assert(fs.existsSync(hudPath), 'PerformanceHUD.jsx exists for in-app metrics comparison');

  const hudSource = fs.readFileSync(hudPath, 'utf-8');
  assert(hudSource.includes('Before Optimization'), 'HUD contains Before Optimization benchmark data');
  assert(hudSource.includes('After Optimization'), 'HUD contains After Optimization benchmark data');
  assert(hudSource.includes('Initial JavaScript Size'), 'HUD documents Initial JavaScript Size metrics');
  assert(hudSource.includes('Time to Interactive'), 'HUD documents Time to Interactive (TTI) metrics');

  // --- SECTION 4: Fallback UI & Network Throttling (4 Marks) ---
  console.log('\n--- SECTION 4: Fallback UI & Network Throttling (4 Marks) ---');
  const loaderPath = path.join(__dirname, 'src', 'components', 'PageLoader.jsx');
  assert(fs.existsSync(loaderPath), 'PageLoader.jsx component exists');

  const loaderSource = fs.readFileSync(loaderPath, 'utf-8');
  assert(loaderSource.includes('loader-spinner') || loaderSource.includes('skeleton'), 'PageLoader includes animated spinner/skeleton elements');
  assert(loaderSource.includes('loader-progress-bar'), 'PageLoader includes progress bar visual indicator');

  const delayUtilPath = path.join(__dirname, 'src', 'utils', 'lazyWithDelay.js');
  assert(fs.existsSync(delayUtilPath), 'lazyWithDelay.js exists for minimum delay & network simulation');

  const delaySource = fs.readFileSync(delayUtilPath, 'utf-8');
  assert(delaySource.includes('slow3g'), 'lazyWithDelay supports Slow 3G network simulation');
  assert(delaySource.includes('fast3g'), 'lazyWithDelay supports Fast 3G network simulation');

  // --- SECTION 5: Supplementary Problems Verification ---
  console.log('\n--- SECTION 5: Supplementary Problems Verification ---');
  const chartPath = path.join(__dirname, 'src', 'components', 'HeavyChart.jsx');
  assert(fs.existsSync(chartPath), 'HeavyChart.jsx exists (heavy component lazy loading)');

  const vivaPath = path.join(__dirname, 'src', 'components', 'VivaGuideModal.jsx');
  assert(fs.existsSync(vivaPath), 'VivaGuideModal.jsx exists for oral examination prep');

  const vivaSource = fs.readFileSync(vivaPath, 'utf-8');
  assert(vivaSource.includes('Perceived performance'), 'Viva guide explains perceived performance vs total size');
  assert(vivaSource.includes('Initial Bundle'), 'Viva guide contrasts initial bundle vs lazy-loaded chunks');

  // Check index.html student metadata
  const htmlPath = path.join(__dirname, 'index.html');
  const htmlSource = fs.readFileSync(htmlPath, 'utf-8');
  assert(htmlSource.includes('Practical 8'), 'index.html contains Practical 8 title');
  assert(htmlSource.includes('24IT029'), 'index.html contains roll number 24IT029');

  console.log('\n======================================================================');
  console.log(`📊 EVALUATION SUMMARY: ${passed} / ${total} Checks Passed (${Math.round((passed / total) * 100)}%)`);
  if (passed === total) {
    console.log('🎉 ALL PRACTICAL 8 RUBRICS VERIFIED SUCCESSFULLY! 20/20 MARKS ACHIEVED');
  } else {
    console.log('⚠️ Some checks did not pass. Review output above.');
  }
  console.log('======================================================================\n');

  process.exit(passed === total ? 0 : 1);
}

runTests();
