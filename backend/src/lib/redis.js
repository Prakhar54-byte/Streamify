import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let publisher = null;
let subscriber = null;
let isConnected = false;

/**
 * Initialize Redis clients (publisher + subscriber)
 * Gracefully handles unavailable Redis — app continues without real-time features
 */
export const connectRedis = async () => {
  try {
    publisher = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null; // Stop retrying after 5 attempts
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    subscriber = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null;
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    await publisher.connect();
    await subscriber.connect();
    isConnected = true;
    console.log('✅ Redis connected successfully');

    publisher.on('error', (err) => {
      console.error('Redis publisher error:', err.message);
      isConnected = false;
    });

    subscriber.on('error', (err) => {
      console.error('Redis subscriber error:', err.message);
      isConnected = false;
    });
  } catch (error) {
    console.warn('⚠️  Redis unavailable — running without real-time features:', error.message);
    isConnected = false;
  }
};

/**
 * Publish an event to a Redis channel
 */
export const publishEvent = async (channel, data) => {
  if (!isConnected || !publisher) return false;
  try {
    await publisher.publish(channel, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Redis publish error:', error.message);
    return false;
  }
};

/**
 * Subscribe to a Redis channel
 */
export const subscribeToChannel = async (channel, handler) => {
  if (!isConnected || !subscriber) return false;
  try {
    await subscriber.subscribe(channel);
    subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        try {
          handler(JSON.parse(message));
        } catch {
          handler(message);
        }
      }
    });
    return true;
  } catch (error) {
    console.error('Redis subscribe error:', error.message);
    return false;
  }
};

/**
 * Get/Set cached data with TTL
 */
export const cacheGet = async (key) => {
  if (!isConnected || !publisher) return null;
  try {
    const data = await publisher.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key, data, ttlSeconds = 60) => {
  if (!isConnected || !publisher) return false;
  try {
    await publisher.set(key, JSON.stringify(data), 'EX', ttlSeconds);
    return true;
  } catch {
    return false;
  }
};

export const cacheDelete = async (key) => {
  if (!isConnected || !publisher) return false;
  try {
    await publisher.del(key);
    return true;
  } catch {
    return false;
  }
};

export const getRedisClient = () => publisher;
export const isRedisConnected = () => isConnected;
