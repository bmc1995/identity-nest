import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '../../../../common/cache/cache.service';

@Injectable()
export class TokenDenylistService {
  private readonly logger = new Logger(TokenDenylistService.name);

  constructor(private readonly cache: CacheService) {}

  /**
   * Mark a JWT as revoked. TTL matches the token's remaining lifetime — once
   * the token would have expired anyway, the denylist entry can drop.
   *
   * @param jti  JWT ID from the token's `jti` claim
   * @param exp  Token expiry in seconds since epoch (from `exp` claim)
   */
  async revoke(jti: string, exp: number): Promise<void> {
    const ttl = exp - Math.floor(Date.now() / 1000);
    if (ttl <= 0) {
      // Already expired — nothing to do.
      return;
    }
    await this.cache.setJson(this.key(jti), { revokedAt: Date.now() }, ttl);
    this.logger.log(`Revoked jti=${jti} (ttl=${ttl}s)`);
  }

  async isRevoked(jti: string): Promise<boolean> {
    return this.cache.exists(this.key(jti));
  }

  private key(jti: string): string {
    return `revoked:${jti}`;
  }
}
