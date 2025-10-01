const memoryCache = new Map<string, { value: unknown; expiresAt: number }>();

export async function getCache<T = unknown>(key: string): Promise<T | null> {
  const e = memoryCache.get(key);
  if (!e) return null;
  if (Date.now() > e.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return e.value as unknown as T;
}

export async function setCache(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
  memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}


