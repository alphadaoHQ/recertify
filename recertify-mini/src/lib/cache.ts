import { Redis } from 'ioredis';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  compress?: boolean; // Compress large values
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
}

class CacheManager {
  private redis: Redis;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0,
  };
  private defaultTTL = 3600; // 1 hour
  private keyPrefix = 'recertify:';

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
      // Connection pooling
      family: 4,
      db: 0,
    });

    // Error handling
    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
      this.stats.errors++;
    });

    this.redis.on('connect', () => {
      console.log('Redis connected successfully');
    });

    this.redis.on('ready', () => {
      console.log('Redis ready for operations');
    });
  }

  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  private async compress(data: string): Promise<string> {
    if (typeof window !== 'undefined') return data; // Skip compression in browser
    
    try {
      const zlib = await import('zlib');
      const compressed = zlib.gzipSync(data);
      return compressed.toString('base64');
    } catch (error) {
      console.warn('Compression failed, using uncompressed data:', error);
      return data;
    }
  }

  private async decompress(data: string): Promise<string> {
    if (typeof window !== 'undefined') return data; // Skip decompression in browser
    
    try {
      const zlib = await import('zlib');
      const buffer = Buffer.from(data, 'base64');
      const decompressed = zlib.gunzipSync(buffer);
      return decompressed.toString();
    } catch (error) {
      // If decompression fails, assume data is not compressed
      return data;
    }
  }

  async get<T>(key: string, options: { decompress?: boolean } = {}): Promise<T | null> {
    try {
      const cacheKey = this.getKey(key);
      const cached = await this.redis.get(cacheKey);
      
      if (cached === null) {
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      
      let data = cached;
      if (options.decompress) {
        data = await this.decompress(cached);
      }

      return JSON.parse(data);
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.errors++;
      return null;
    }
  }

  async set(
    key: string, 
    value: any, 
    options: CacheOptions = {}
  ): Promise<boolean> {
    try {
      const cacheKey = this.getKey(key);
      const ttl = options.ttl || this.defaultTTL;
      
      let data = JSON.stringify(value);
      
      // Compress large values
      if (options.compress || data.length > 1024) {
        data = await this.compress(data);
      }

      await this.redis.setex(cacheKey, ttl, data);
      
      // Store tags for invalidation
      if (options.tags && options.tags.length > 0) {
        const tagPromises = options.tags.map(tag => 
          this.redis.sadd(`${this.keyPrefix}tag:${tag}`, cacheKey)
        );
        await Promise.all(tagPromises);
      }

      this.stats.sets++;
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      this.stats.errors++;
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const cacheKey = this.getKey(key);
      const result = await this.redis.del(cacheKey);
      this.stats.deletes++;
      return result > 0;
    } catch (error) {
      console.error('Cache delete error:', error);
      this.stats.errors++;
      return false;
    }
  }

  async invalidateByTag(tag: string): Promise<number> {
    try {
      const tagKey = `${this.keyPrefix}tag:${tag}`;
      const keys = await this.redis.smembers(tagKey);
      
      if (keys.length === 0) return 0;

      // Delete all keys with this tag
      const deletePromises = keys.map(key => this.redis.del(key));
      await Promise.all(deletePromises);
      
      // Remove the tag set
      await this.redis.del(tagKey);
      
      this.stats.deletes += keys.length;
      return keys.length;
    } catch (error) {
      console.error('Cache tag invalidation error:', error);
      this.stats.errors++;
      return 0;
    }
  }

  async invalidateByPattern(pattern: string): Promise<number> {
    try {
      const searchPattern = this.getKey(pattern);
      const keys = await this.redis.keys(searchPattern);
      
      if (keys.length === 0) return 0;

      await this.redis.del(...keys);
      this.stats.deletes += keys.length;
      return keys.length;
    } catch (error) {
      console.error('Cache pattern invalidation error:', error);
      this.stats.errors++;
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const cacheKey = this.getKey(key);
      const result = await this.redis.exists(cacheKey);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      this.stats.errors++;
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      const cacheKey = this.getKey(key);
      return await this.redis.ttl(cacheKey);
    } catch (error) {
      console.error('Cache TTL error:', error);
      this.stats.errors++;
      return -1;
    }
  }

  async extend(key: string, additionalTTL: number): Promise<boolean> {
    try {
      const cacheKey = this.getKey(key);
      const currentTTL = await this.redis.ttl(cacheKey);
      
      if (currentTTL > 0) {
        await this.redis.expire(cacheKey, currentTTL + additionalTTL);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Cache extend error:', error);
      this.stats.errors++;
      return false;
    }
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const cacheKeys = keys.map(key => this.getKey(key));
      const results = await this.redis.mget(...cacheKeys);
      
      return results.map(result => {
        if (result === null) {
          this.stats.misses++;
          return null;
        }
        
        this.stats.hits++;
        try {
          return JSON.parse(result);
        } catch {
          return null;
        }
      });
    } catch (error) {
      console.error('Cache mget error:', error);
      this.stats.errors++;
      return keys.map(() => null);
    }
  }

  async mset(entries: Array<{ key: string; value: any; ttl?: number }>): Promise<boolean> {
    try {
      const pipeline = this.redis.pipeline();
      
      entries.forEach(({ key, value, ttl }) => {
        const cacheKey = this.getKey(key);
        const data = JSON.stringify(value);
        const expiry = ttl || this.defaultTTL;
        
        pipeline.setex(cacheKey, expiry, data);
      });

      await pipeline.exec();
      this.stats.sets += entries.length;
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      this.stats.errors++;
      return false;
    }
  }

  async flush(): Promise<boolean> {
    try {
      await this.redis.flushdb();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      this.stats.errors++;
      return false;
    }
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  async getInfo(): Promise<any> {
    try {
      const info = await this.redis.info();
      return info;
    } catch (error) {
      console.error('Cache info error:', error);
      return null;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      console.error('Cache disconnect error:', error);
    }
  }
}

// Singleton instance
export const cache = new CacheManager();

// Cache decorators and utilities
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    keyGenerator: (...args: Parameters<T>) => string;
    ttl?: number;
    tags?: string[];
  }
): T {
  return (async (...args: Parameters<T>) => {
    const key = options.keyGenerator(...args);
    
    // Try cache first
    const cached = await cache.get(key);
    if (cached !== null) {
      return cached;
    }
    
    // Execute function and cache result
    const result = await fn(...args);
    await cache.set(key, result, {
      ttl: options.ttl,
      tags: options.tags,
    });
    
    return result;
  }) as T;
}

// Cache key generators
export const CacheKeys = {
  quiz: (id: string) => `quiz:${id}`,
  quizzes: (category?: string, difficulty?: string) => 
    `quizzes:${category || 'all'}:${difficulty || 'all'}`,
  userProfile: (userId: string) => `user:${userId}`,
  leaderboard: (timeframe: string) => `leaderboard:${timeframe}`,
  aiFeedback: (userId: string, quizId: string) => `ai:feedback:${userId}:${quizId}`,
  learningState: (userId: string) => `learning:${userId}`,
  fraudCheck: (userId: string, sessionId: string) => `fraud:${userId}:${sessionId}`,
};

// Cache tags for invalidation
export const CacheTags = {
  QUIZZES: 'quizzes',
  USER_DATA: 'user_data',
  LEADERBOARD: 'leaderboard',
  AI_FEEDBACK: 'ai_feedback',
  LEARNING_STATE: 'learning_state',
};

export default cache;