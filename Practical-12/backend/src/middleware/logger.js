function requestLogger(req, res, next) {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const ms = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [Docker Backend] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });

  next();
}

module.exports = requestLogger;
