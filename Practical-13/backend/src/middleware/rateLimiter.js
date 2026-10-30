/**
 * Practical 13: AI API Integration into a Web Application
 * Sliding Window In-Memory Rate Limiter for AI Endpoints
 * Prevents API quota exhaustion, denial-of-wallet, and excessive calls
 * Author: Om Italiya (24IT029)
 */

const clientRequests = new Map();

const aiRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || parseInt(process.env.RATE_LIMIT_AI_WINDOW_MS, 10) || 60000; // 1 minute
  const maxRequests = options.max || parseInt(process.env.RATE_LIMIT_AI_MAX, 10) || 10; // 10 requests per minute

  return (req, res, next) => {
    // In test environment or simulated bypass, skip rate limiting if header provided
    if (req.headers['x-bypass-ratelimit'] === 'true' && process.env.NODE_ENV === 'test') {
      return next();
    }

    const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const now = Date.now();

    let record = clientRequests.get(clientIp);

    if (!record) {
      record = { timestamps: [] };
      clientRequests.set(clientIp, record);
    }

    // Filter out requests older than the current window
    record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

    const currentCount = record.timestamps.length;
    const remaining = Math.max(0, maxRequests - currentCount - 1);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

    if (currentCount >= maxRequests) {
      const oldestTimestamp = record.timestamps[0];
      const retryAfterSeconds = Math.ceil((windowMs - (now - oldestTimestamp)) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);

      return res.status(429).json({
        success: false,
        rateLimited: true,
        message: `AI rate limit reached (${maxRequests} requests per minute). Please wait ${retryAfterSeconds}s before retrying.`,
        retryAfter: retryAfterSeconds,
        fallbackNotice: 'Rate limiting protects third-party API quotas and controls costs.'
      });
    }

    record.timestamps.push(now);
    next();
  };
};

const resetRateLimiter = () => {
  clientRequests.clear();
};

module.exports = { aiRateLimiter, resetRateLimiter };
