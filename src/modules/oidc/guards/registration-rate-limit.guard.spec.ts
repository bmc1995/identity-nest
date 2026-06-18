import { ExecutionContext, HttpException } from '@nestjs/common';
import { RegistrationRateLimitGuard } from './registration-rate-limit.guard';
import { CacheService } from '../../../common/cache/cache.service';

describe('RegistrationRateLimitGuard', () => {
  let guard: RegistrationRateLimitGuard;
  let cache: { incrementInWindow: jest.Mock; ttl: jest.Mock };
  let setHeader: jest.Mock;

  const ctx = (): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ ip: '203.0.113.7', socket: {} }),
        getResponse: () => ({ setHeader }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    cache = { incrementInWindow: jest.fn(), ttl: jest.fn() };
    setHeader = jest.fn();
    guard = new RegistrationRateLimitGuard(cache as unknown as CacheService);
    process.env.OIDC_REGISTRATION_RATE_LIMIT = '3';
  });

  afterEach(() => {
    delete process.env.OIDC_REGISTRATION_RATE_LIMIT;
    delete process.env.OIDC_REGISTRATION_RATE_WINDOW_SECONDS;
  });

  it('allows requests at or below the limit', async () => {
    cache.incrementInWindow.mockResolvedValue(3);
    await expect(guard.canActivate(ctx())).resolves.toBe(true);
    expect(setHeader).not.toHaveBeenCalled();
  });

  it('rejects requests over the limit with 429 and a Retry-After header', async () => {
    cache.incrementInWindow.mockResolvedValue(4);
    cache.ttl.mockResolvedValue(120);

    await expect(guard.canActivate(ctx())).rejects.toThrow(HttpException);
    expect(setHeader).toHaveBeenCalledWith('Retry-After', '120');
  });

  it('keys the counter per client IP within the configured window', async () => {
    process.env.OIDC_REGISTRATION_RATE_WINDOW_SECONDS = '600';
    cache.incrementInWindow.mockResolvedValue(1);

    await guard.canActivate(ctx());

    expect(cache.incrementInWindow).toHaveBeenCalledWith(
      'ratelimit:oidc-register:203.0.113.7',
      600,
    );
  });
});
