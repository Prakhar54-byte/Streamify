import { getRedisClient, isRedisConnected, publishEvent } from './redis.js';

const ONLINE_SET_KEY = 'online_users';
const PRESENCE_CHANNEL = 'presence_events';
const USER_TTL = 300; // 5 minutes — heartbeat keeps alive

/**
 * Mark a user as online (with auto-expiry via sorted set)
 */
export const setUserOnline = async (userId) => {
  if (!isRedisConnected()) return;
  const client = getRedisClient();
  try {
    const now = Date.now();
    await client.zadd(ONLINE_SET_KEY, now, userId.toString());

    await publishEvent(PRESENCE_CHANNEL, {
      type: 'user_online',
      userId: userId.toString(),
      timestamp: now,
    });
  } catch (error) {
    console.error('Error setting user online:', error.message);
  }
};

/**
 * Mark a user as offline
 */
export const setUserOffline = async (userId) => {
  if (!isRedisConnected()) return;
  const client = getRedisClient();
  try {
    await client.zrem(ONLINE_SET_KEY, userId.toString());

    await publishEvent(PRESENCE_CHANNEL, {
      type: 'user_offline',
      userId: userId.toString(),
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error setting user offline:', error.message);
  }
};

/**
 * Get all online user IDs (removing stale entries older than USER_TTL)
 */
export const getOnlineUsers = async () => {
  if (!isRedisConnected()) return [];
  const client = getRedisClient();
  try {
    // Remove entries older than USER_TTL seconds
    const cutoff = Date.now() - USER_TTL * 1000;
    await client.zremrangebyscore(ONLINE_SET_KEY, '-inf', cutoff);

    // Get remaining online users
    const userIds = await client.zrange(ONLINE_SET_KEY, 0, -1);
    return userIds;
  } catch (error) {
    console.error('Error getting online users:', error.message);
    return [];
  }
};

/**
 * Heartbeat — refresh user's online timestamp
 */
export const heartbeat = async (userId) => {
  if (!isRedisConnected()) return;
  const client = getRedisClient();
  try {
    await client.zadd(ONLINE_SET_KEY, Date.now(), userId.toString());
  } catch (error) {
    console.error('Error in heartbeat:', error.message);
  }
};
