type Entry = { tokens: number; last: number };

const buckets = new Map<string, Entry>();

export function consumeToken(key: string, capacity = 120, refillPerSec = 2, cost = 1) {
  const now = Date.now();
  const existing = buckets.get(key) || { tokens: capacity, last: now };
  const elapsed = Math.max(0, (now - existing.last) / 1000);
  const refilled = Math.min(capacity, existing.tokens + elapsed * refillPerSec);
  const next = { tokens: refilled - cost, last: now };
  buckets.set(key, next);
  return next.tokens >= 0;
}

const idem = new Map<string, number>();

export function checkAndMarkIdempotency(key: string, ttlMs = 5 * 60 * 1000) {
  const now = Date.now();
  const found = idem.get(key);
  if (found && found > now) return false;
  idem.set(key, now + ttlMs);
  return true;
}
