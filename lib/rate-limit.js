/**
 * Simple in-memory sliding-window rate limiter (best-effort on serverless).
 * For stronger protection, add edge/WAF rate limits in production.
 */
export function rateLimit({ intervalMs, maxRequests }) {
  const hits = new Map();

  function prune(now) {
    for (const [key, times] of hits) {
      const fresh = times.filter((t) => now - t < intervalMs);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }
  }

  return {
    check(key) {
      const now = Date.now();
      prune(now);
      const times = hits.get(key) || [];
      if (times.length >= maxRequests) return false;
      times.push(now);
      hits.set(key, times);
      return true;
    },
  };
}
