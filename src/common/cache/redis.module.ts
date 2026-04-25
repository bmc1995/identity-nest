import { Global, Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CacheService } from './cache.service';
import { REDIS_CLIENT } from './redis.constants';
import { RedisConfig } from '../config/configuration';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const logger = new Logger('RedisClient');
        const redisConfig = config.getOrThrow<RedisConfig>('redis');

        const client = new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
          keyPrefix: redisConfig.keyPrefix,
          lazyConnect: false,
          maxRetriesPerRequest: 3,
        });

        client.on('connect', () =>
          logger.log(`Connected to redis ${redisConfig.host}:${redisConfig.port}`),
        );
        client.on('error', (err) => logger.error(`Redis error: ${err.message}`));
        return client;
      },
    },
    CacheService,
  ],
  exports: [CacheService, REDIS_CLIENT],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onApplicationShutdown() {
    await this.redis.quit();
  }
}
