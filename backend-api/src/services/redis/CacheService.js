const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    this._client.connect();
  }

  async set(key, value, ttlInSeconds = 1800) {
    await this._client.set(key, JSON.stringify(value), {
      EX: ttlInSeconds,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    if (!result) throw new Error('Cache not found');
    return JSON.parse(result);
  }

  async delete(key) {
    await this._client.del(key);
  }
}

module.exports = CacheService;