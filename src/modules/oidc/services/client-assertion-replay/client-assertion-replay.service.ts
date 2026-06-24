import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '../../../../common/cache/cache.service';

/**
 * Single-use guard for JWT client-assertion `jti` values (OpenID Connect Core
 * §9 / RFC 7523 §3). A client may present a given assertion only once; replaying
 * it must fail. The `jti` is recorded until the assertion's own expiry, after
 * which the entry can drop because the assertion is no longer valid anyway.
 */
@Injectable()
export class ClientAssertionReplayService {
  private readonly logger = new Logger(ClientAssertionReplayService.name);

  constructor(private readonly cache: CacheService) {}

  /**
   * Atomically claim a `(client, jti)` pair until `exp`. Returns true when the
   * jti had not been seen (assertion may proceed) and false when it is a replay.
   *
   * @param clientId  Authenticating client (jti uniqueness is per-issuer).
   * @param jti       The assertion's `jti` claim.
   * @param exp       The assertion's `exp` claim, seconds since epoch.
   */
  async claim(clientId: string, jti: string, exp: number): Promise<boolean> {
    const ttl = exp - Math.floor(Date.now() / 1000);
    if (ttl <= 0) {
      // Already expired — verification should have rejected it; treat as a miss.
      return false;
    }
    const fresh = await this.cache.setJsonIfAbsent(
      this.key(clientId, jti),
      { usedAt: Date.now() },
      ttl,
    );
    if (!fresh) {
      this.logger.warn(`Replayed client-assertion jti=${jti} for ${clientId}`);
    }
    return fresh;
  }

  private key(clientId: string, jti: string): string {
    return `assertion_jti:${clientId}:${jti}`;
  }
}
