/**
 * KV CACHING — Reduces D1 reads to stay within shared free tier
 *
 * D1 reads: 5M/day SHARED across both sites on same account
 * KV reads: 100k/day SEPARATE per namespace — NOT shared with publishing site
 *
 * KV reads do NOT count against D1 limits.
 */
export type KVEnv = { KV: KVNamespace }

export async function getCached<T>(env: KVEnv, key: string): Promise<T | null> {
  try { return await env.KV.get(key, 'json') as T | null } catch { return null }
}

export async function setCache(env: KVEnv, key: string, data: unknown, ttlSeconds: number): Promise<void> {
  try { await env.KV.put(key, JSON.stringify(data), { expirationTtl: ttlSeconds }) } catch {}
}

export async function invalidateCache(env: KVEnv, ...keys: string[]): Promise<void> {
  await Promise.all(keys.map(k => env.KV.delete(k).catch(() => {})))
}

export const CACHE_KEYS = {
  PUBLISHED_PAPERS: 'papers:published',
  PUBLISHED_BY_SUBJECT: (s: string) => `papers:subject:${s}`,
  EDITORIAL_BOARD: 'members:editorial',
  ADVISORY_BOARD: 'members:advisory',
  REVIEWER_COMMITTEE: 'members:reviewer',
  CONFERENCES: 'conferences:active',
  TESTIMONIALS: 'testimonials:active',
  STATS: 'stats:homepage',
}

export const TTL = {
  PAPERS: 300,       // 5 min
  MEMBERS: 3600,     // 1 hour
  CONFERENCES: 600,  // 10 min
  TESTIMONIALS: 3600,// 1 hour
  STATS: 600,        // 10 min
}
