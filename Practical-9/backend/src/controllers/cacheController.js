/**
 * Cache Debug and Benchmark Controller
 * Practical 9: In-Memory Caching and Query Optimization
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const cache = require('../config/cache');
const Task = require('../models/Task');

/**
 * GET /api/cache/stats (also accessible via /api/tasks/cache/stats)
 * Exposes hits, misses, hit rate, active keys, ksize, vsize, and invalidations
 */
function getCacheStats(req, res) {
  const stats = cache.getDetailedStats();
  return res.status(200).json({
    success: true,
    message: 'Cache statistics retrieved successfully.',
    data: stats
  });
}

/**
 * POST /api/cache/flush
 * Manually flushes the in-memory cache
 */
function flushCache(req, res) {
  cache.flushAll();
  return res.status(200).json({
    success: true,
    message: 'All in-memory cache keys flushed successfully.',
    data: cache.getDetailedStats()
  });
}

/**
 * POST /api/cache/ttl
 * Dynamically adjust standard TTL to observe staleness vs speed trade-offs
 */
function updateTTL(req, res) {
  const { ttl } = req.body;
  const newTTL = parseInt(ttl, 10);
  if (isNaN(newTTL) || newTTL < 1) {
    return res.status(400).json({
      success: false,
      error: 'Invalid TTL',
      message: 'TTL must be a positive integer in seconds.'
    });
  }

  cache.options.stdTTL = newTTL;
  return res.status(200).json({
    success: true,
    message: `Default cache TTL updated to ${newTTL} seconds.`,
    stdTTL: newTTL
  });
}

/**
 * GET /api/cache/benchmark
 * Runs an empirical benchmark comparing 5 uncached requests vs 5 cached requests
 * Emits precise high-resolution timings (ms) and calculates latency reduction percentage
 */
async function runBenchmark(req, res) {
  try {
    const trials = 5;
    const uncachedReadings = [];
    const cachedReadings = [];

    // Ensure there is at least some seed data for meaningful MongoDB query duration
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.create([
        { title: 'Learn In-Memory Caching', description: 'Study node-cache and Redis architectures', priority: 'high' },
        { title: 'Benchmark API Response Times', description: 'Measure latency with high-res timers', priority: 'medium' },
        { title: 'Cache Invalidation Strategy', description: 'Ensure stale data is never returned', priority: 'high' }
      ]);
    }

    // 1. Run Uncached Trials (bypassing cache)
    for (let i = 0; i < trials; i++) {
      const start = process.hrtime();
      await Task.find().sort({ createdAt: -1 });
      const diff = process.hrtime(start);
      const ms = parseFloat((diff[0] * 1000 + diff[1] / 1e6).toFixed(3));
      uncachedReadings.push(ms);
    }

    // 2. Prime the cache
    const initialTasks = await Task.find().sort({ createdAt: -1 });
    cache.set('all_tasks', initialTasks);

    // 3. Run Cached Trials (reading from node-cache)
    for (let i = 0; i < trials; i++) {
      const start = process.hrtime();
      cache.get('all_tasks');
      const diff = process.hrtime(start);
      const ms = parseFloat((diff[0] * 1000 + diff[1] / 1e6).toFixed(3));
      cachedReadings.push(ms);
    }

    const avgUncached = parseFloat((uncachedReadings.reduce((a, b) => a + b, 0) / trials).toFixed(3));
    const avgCached = parseFloat((cachedReadings.reduce((a, b) => a + b, 0) / trials).toFixed(3));
    const speedupMultiplier = parseFloat((avgUncached / (avgCached || 0.001)).toFixed(1));
    const reductionPercent = parseFloat((((avgUncached - avgCached) / avgUncached) * 100).toFixed(1));

    return res.status(200).json({
      success: true,
      trials,
      benchmarkResults: {
        uncachedReadingsMs: uncachedReadings,
        cachedReadingsMs: cachedReadings,
        averageUncachedMs: avgUncached,
        averageCachedMs: avgCached,
        speedupMultiplier: `${speedupMultiplier}x faster`,
        latencyReductionPercent: `${reductionPercent}% reduction`
      },
      system: {
        cacheEngine: 'node-cache (In-Memory RAM)',
        storageEngine: 'MongoDB (Disk/WiredTiger)',
        student: 'Om Italiya (24IT029)'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getCacheStats,
  flushCache,
  updateTTL,
  runBenchmark
};
