/**
 * Request Logging Middleware (Lab Step 3 Requirement & Rubrics)
 * Logs HTTP Method, URL, and Timestamp for every incoming request.
 * Applied globally across the Express middleware pipeline.
 */

// In-memory buffer for real-time dashboard inspection
const serverLogs = [];
const MAX_LOGS = 100;

function logger(req, res, next) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  req.requestTimestamp = timestamp;

  // Immediate log matching exact lab instruction specification:
  // console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  console.log(`[REQ] ${req.method} ${req.originalUrl || req.url} - ${timestamp}`);

  // Listen to response finish event to capture status code & response time
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logEntry = {
      id: Date.now() + Math.random(),
      method: req.method,
      url: req.originalUrl || req.url,
      timestamp,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress
    };

    serverLogs.unshift(logEntry);
    if (serverLogs.length > MAX_LOGS) {
      serverLogs.pop();
    }

    console.log(`[RES] ${req.method} ${req.originalUrl || req.url} -> ${res.statusCode} (${duration}ms)`);
  });

  // CRITICAL: Call next() so pipeline proceeds to subsequent middleware
  next();
}

logger.getLogs = () => [...serverLogs];
logger.clearLogs = () => {
  serverLogs.length = 0;
};

module.exports = logger;
