import Redis from 'ioredis';
import { CacheService } from './cache.service';

describe('CacheService.incrementInWindow', () => {
  it('runs INCR + EXPIRE atomically via a single eval and returns the count', async () => {
    const evalMock = jest.fn().mockResolvedValue(2);
    const cache = new CacheService({ eval: evalMock } as unknown as Redis);

    const count = await cache.incrementInWindow('counter', 60);

    expect(count).toBe(2);
    expect(evalMock).toHaveBeenCalledTimes(1);
    const [script, numKeys, key, windowArg] = evalMock.mock.calls[0];
    expect(script).toContain('INCR');
    expect(script).toContain('EXPIRE');
    expect(numKeys).toBe(1);
    expect(key).toBe('counter');
    expect(windowArg).toBe('60');
  });
});
