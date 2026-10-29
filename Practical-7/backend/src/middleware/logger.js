/**
 * Request Logger Middleware for Practical 7
 * Records HTTP method, URL, timestamp, response code, and latency.
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const serverLogs = [];
const MAX_LOGS = 100;

function logger(req, res, next) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  req.requestTimestamp = timestamp;

  console.log(`[REQ] ${req.method} ${req.originalUrl || req.url} - ${timestamp}`);

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logEntry = {
      id: Date.now() + Math.random(),
      method: req.method,
      url: req.originalUrl || req.url,
      timestamp,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      user: req.user ? req.user.email || req.user.id : 'Anonymous'
    };

    serverLogs.unshift(logEntry);
    if (serverLogs.length > MAX_LOGS) serverLogs.pop();

    console.log(`[RES] ${req.method} ${req.originalUrl || req.url} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
}

logger.getLogs = () => [...serverLogs];
logger.clearLogs = () => { serverLogs.length = 0; };

module.exports = logger;
