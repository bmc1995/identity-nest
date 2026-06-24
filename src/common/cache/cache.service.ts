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

  /**
   * Atomically set `key` only if it does not already exist (SET NX), with an
   * expiry. Returns true when the key was created, false when it already
   * existed — useful for single-use / replay guards.
   */
  async setJsonIfAbsent<T>(
    key: string,
    value: T,
    ttlSeconds: number,
  ): Promise<boolean> {
    const res = await this.redis.set(
      key,
      JSON.stringify(value),
      'EX',
      ttlSeconds,
      'NX',
    );
    return res === 'OK';
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

  /**
   * Increment a fixed-window counter and return the new value. The window's
   * TTL is set on the first hit only, so the counter resets `windowSeconds`
   * after that first request rather than sliding on every call.
   *
   * INCR and EXPIRE run in a single Lua script so they are atomic: the counter
   * can never be left without a TTL (which would otherwise pin a key forever if
   * the process died between the two commands).
   */
  async incrementInWindow(key: string, windowSeconds: number): Promise<number> {
    const count = await this.redis.eval(
      CacheService.INCREMENT_IN_WINDOW_SCRIPT,
      1,
      key,
      String(windowSeconds),
    );
    return count as number;
  }

  private static readonly INCREMENT_IN_WINDOW_SCRIPT = `
    local count = redis.call('INCR', KEYS[1])
    if count == 1 then
      redis.call('EXPIRE', KEYS[1], ARGV[1])
    end
    return count
  `;
}
