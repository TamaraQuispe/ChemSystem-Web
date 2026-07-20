const rateLimitStore = new Map();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;

function rateLimit(req, res, next) {
  const userId = req.user?.id || req.ip;
  const now = Date.now();

  if (!rateLimitStore.has(userId)) {
    rateLimitStore.set(userId, []);
  }

  const timestamps = rateLimitStore.get(userId).filter(t => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  }

  timestamps.push(now);
  rateLimitStore.set(userId, timestamps);

  if (rateLimitStore.size > 10000) {
    for (const [key] of rateLimitStore) {
      const valid = rateLimitStore.get(key).filter(t => now - t < WINDOW_MS);
      if (valid.length === 0) rateLimitStore.delete(key);
    }
  }

  next();
}

module.exports = rateLimit;
