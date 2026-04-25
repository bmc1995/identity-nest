import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async setJson<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async setJsonKeepTtl<T>(key: string, value: T): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'KEEPTTL');
  }

  async getJsonAndDelete<T>(key: string): Promise<T | null> {
    const raw = await this.redis.getdel(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async delete(key: string): Promise<boolean> {
    const removed = await this.redis.del(key);
    return removed > 0;
  }

  async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) > 0;
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }
}
