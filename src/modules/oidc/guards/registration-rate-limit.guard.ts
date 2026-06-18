import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CacheService } from '../../../common/cache/cache.service';

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_SECONDS = 3600; // 1 hour

/**
 * Per-IP fixed-window rate limit for the dynamic client registration endpoint
 * (defence-in-depth on top of {@link RegistrationAccessTokenGuard}).
 *
 * Placed *before* the token guard so it throttles every attempt — including
 * invalid-token requests, which bounds brute-forcing of the initial access
 * token as well as registration spam.
 *
 * Tunable via `OIDC_REGISTRATION_RATE_LIMIT` (max requests) and
 * `OIDC_REGISTRATION_RATE_WINDOW_SECONDS` (window length). Backed by Redis so
 * the limit holds across instances.
 *
 * Note: the client IP comes from `req.ip`; behind a proxy/load balancer set
 * Express `trust proxy` so this reflects the real caller rather than the hop.
 */
@Injectable()
export class RegistrationRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RegistrationRateLimitGuard.name);

  constructor(private readonly cache: CacheService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const limit = this.positiveIntEnv(
      'OIDC_REGISTRATION_RATE_LIMIT',
      DEFAULT_LIMIT,
    );
    const windowSeconds = this.positiveIntEnv(
      'OIDC_REGISTRATION_RATE_WINDOW_SECONDS',
      DEFAULT_WINDOW_SECONDS,
    );

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const ip = request.ip || request.socket?.remoteAddress || 'unknown';
    const key = `ratelimit:oidc-register:${ip}`;

    const count = await this.cache.incrementInWindow(key, windowSeconds);
    if (count > limit) {
      const retryAfter = Math.max(await this.cache.ttl(key), 1);
      response.setHeader('Retry-After', String(retryAfter));
      this.logger.warn(
        `Registration rate limit exceeded for ip=${ip} (${count}/${limit})`,
      );
      throw new HttpException(
        {
          error: 'too_many_requests',
          error_description:
            'Registration rate limit exceeded. Try again later.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  /** Parse a positive integer env var, falling back to `fallback` if unset/invalid. */
  private positiveIntEnv(name: string, fallback: number): number {
    const parsed = parseInt(process.env[name] ?? '', 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }
}
