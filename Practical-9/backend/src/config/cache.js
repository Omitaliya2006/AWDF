const NodeCache = require('node-cache');

// Initialize cache instance with 60 seconds TTL and 120 seconds cleanup cycle
const ttl = parseInt(process.env.CACHE_TTL, 10) || 60;
const checkperiod = parseInt(process.env.CACHE_CHECK_PERIOD, 10) || 120;

const cache = new NodeCache({
  stdTTL: ttl,
  checkperiod: checkperiod,
  useClones: true, // Clone objects to prevent accidental mutations in memory
  deleteOnExpire: true
});

// Telemetry tracker for debugging and HUD inspection
const telemetry = {
  invalidationLog: [],
  lastInvalidation: null,
  totalInvalidations: 0
};

// Listen for cache lifecycle events
cache.on('set', (key) => {
  // console.log(`📦 [Cache SET] Key: "${key}" cached with TTL: ${ttl}s`);
});

cache.on('del', (key) => {
  telemetry.lastInvalidation = {
    key,
    timestamp: new Date().toISOString()
  };
  telemetry.totalInvalidations += 1;
  telemetry.invalidationLog.unshift({
    key,
    timestamp: new Date().toISOString(),
    reason: 'Explicit invalidation via write operation'
  });
  if (telemetry.invalidationLog.length > 20) telemetry.invalidationLog.pop();
});

cache.on('expired', (key) => {
  telemetry.invalidationLog.unshift({
    key,
    timestamp: new Date().toISOString(),
    reason: 'TTL expired (automatic cleanup)'
  });
  if (telemetry.invalidationLog.length > 20) telemetry.invalidationLog.pop();
});

cache.on('flush', () => {
  telemetry.lastInvalidation = {
    key: '* (ALL KEYS)',
    timestamp: new Date().toISOString()
  };
  telemetry.totalInvalidations += 1;
});

// Attach custom helper to retrieve unified stats
cache.getDetailedStats = () => {
  const nativeStats = cache.getStats();
  const totalRequests = nativeStats.hits + nativeStats.misses;
  const hitRate = totalRequests > 0 ? ((nativeStats.hits / totalRequests) * 100).toFixed(2) : '0.00';
  const keys = cache.keys();

  return {
    hits: nativeStats.hits,
    misses: nativeStats.misses,
    totalRequests,
    hitRate: `${hitRate}%`,
    hitRateValue: parseFloat(hitRate),
    keysCount: nativeStats.keys,
    activeKeys: keys,
    ksize: nativeStats.ksize,
    vsize: nativeStats.vsize,
    stdTTL: ttl,
    lastInvalidation: telemetry.lastInvalidation,
    totalInvalidations: telemetry.totalInvalidations,
    recentInvalidations: telemetry.invalidationLog.slice(0, 5)
  };
};

module.exports = cache;
