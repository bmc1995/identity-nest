import { Injectable, Logger } from '@nestjs/common';
import { randomUUID, createHmac, timingSafeEqual } from 'crypto';
import { CacheService } from '../../common/cache/cache.service';

export interface SessionData {
  sessionId: string;
  userId: string;
  authenticatedAt: Date;
  expiresAt: Date;
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  private readonly cookieName = process.env.SESSION_COOKIE_NAME ?? 'idp_session';
  private readonly ttlMs = parseInt(process.env.SESSION_TTL_MS ?? '3600000');
  private readonly cookieSecret =
    process.env.COOKIE_SECRET ?? 'dev-cookie-secret-change-in-production';

  constructor(private readonly cache: CacheService) {}

  async create(userId: string): Promise<SessionData> {
    const sessionId = randomUUID();
    const now = new Date();
    const session: SessionData = {
      sessionId,
      userId,
      authenticatedAt: now,
      expiresAt: new Date(now.getTime() + this.ttlMs),
    };
    await this.cache.setJson(
      this.key(sessionId),
      session,
      Math.floor(this.ttlMs / 1000),
    );
    return session;
  }

  async validate(sessionId: string): Promise<SessionData | null> {
    const session = await this.cache.getJson<SessionData>(this.key(sessionId));
    if (!session) {
      this.logger.warn(`Session not found: ${sessionId}`);
      return null;
    }
    return {
      ...session,
      authenticatedAt: new Date(session.authenticatedAt),
      expiresAt: new Date(session.expiresAt),
    };
  }

  async destroy(sessionId: string): Promise<void> {
    await this.cache.delete(this.key(sessionId));
  }

  sign(sessionId: string): string {
    const signature = createHmac('sha256', this.cookieSecret)
      .update(sessionId)
      .digest('base64url');
    return `${sessionId}.${signature}`;
  }

  unsign(signedValue: string): string | null {
    const dotIndex = signedValue.lastIndexOf('.');
    if (dotIndex === -1) {
      this.logger.warn('Malformed signed session cookie (no separator)');
      return null;
    }
    const sessionId = signedValue.substring(0, dotIndex);
    const signature = signedValue.substring(dotIndex + 1);
    const expected = createHmac('sha256', this.cookieSecret)
      .update(sessionId)
      .digest('base64url');
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      this.logger.warn('Session cookie signature mismatch — possible tampering');
      return null;
    }
    return sessionId;
  }

  getCookieName(): string {
    return this.cookieName;
  }

  getTtlMs(): number {
    return this.ttlMs;
  }

  private key(sessionId: string): string {
    return `session:${sessionId}`;
  }
}
