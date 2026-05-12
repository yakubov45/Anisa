import { Redis } from '@upstash/redis'

// Provide fallback to avoid crashing during build/local dev if UPSTASH is not configured
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy-url.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy-token',
})

// Helper to get or set cache
export async function getCachedData(key, fetchFunction, expirationInSeconds = 3600) {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    // If Redis is not configured, just return the fresh data directly
    return await fetchFunction();
  }

  try {
    const cached = await redis.get(key);
    if (cached) {
      return cached;
    }

    const freshData = await fetchFunction();
    await redis.set(key, freshData, { ex: expirationInSeconds });
    return freshData;
  } catch (error) {
    console.error('Redis cache error:', error);
    // Fallback to fetch on redis failure
    return await fetchFunction();
  }
}
