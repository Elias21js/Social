// lib/likeLimiter.ts
const rateMap = new Map<string, number>(); // userId -> timestamp do último like

export function canLike(userId: string, cooldownMs = 1000) {
  const now = Date.now();
  const last = rateMap.get(userId) || 0;

  if (now - last < cooldownMs) {
    return false; // ainda no cooldown
  }

  rateMap.set(userId, now);
  return true;
}
