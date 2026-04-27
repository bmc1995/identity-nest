import { Injectable, Logger } from '@nestjs/common';
import { randomUUID, createHmac } from 'crypto';
import { UserStore, StoredUser } from '../store/stores/user.store';
import { CacheService } from '../../common/cache/cache.service';

interface SessionData {
  sessionId: string;
  userId: string;
  authenticatedAt: Date;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly sessionCookieName = process.env.SESSION_COOKIE_NAME ?? 'idp_session';
  private readonly sessionTtlMs = parseInt(process.env.SESSION_TTL_MS ?? '3600000', 10);
  private readonly cookieSecret =
    process.env.COOKIE_SECRET ?? 'dev-cookie-secret-change-in-production';

  constructor(
    private readonly userStore: UserStore,
    private readonly cache: CacheService,
  ) {}

  async authenticate(
    email: string,
    password: string,
  ): Promise<StoredUser | null> {
    const user = await this.userStore.findByEmail(email);
    if (!user) {
      this.logger.warn(`Authentication failed: unknown email "${email}"`);
      return null;
    }
    const valid = await this.userStore.verifyPassword(user, password);
    if (!valid) {
      this.logger.warn(`Authentication failed: invalid password for email "${email}"`);
    }
    return valid ? user : null;
  }

  async createSession(userId: string): Promise<SessionData> {
    const sessionId = randomUUID();
    const now = new Date();
    const session: SessionData = {
      sessionId,
      userId,
      authenticatedAt: now,
      expiresAt: new Date(now.getTime() + this.sessionTtlMs),
    };
    await this.cache.setJson(
      this.sessionKey(sessionId),
      session,
      Math.floor(this.sessionTtlMs / 1000),
    );
    return session;
  }

  async validateSession(sessionId: string): Promise<SessionData | null> {
    const session = await this.cache.getJson<SessionData>(this.sessionKey(sessionId));
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

  async destroySession(sessionId: string): Promise<void> {
    await this.cache.delete(this.sessionKey(sessionId));
  }

  /** Sign a session ID for tamper-proof cookie storage */
  signSessionId(sessionId: string): string {
    const signature = createHmac('sha256', this.cookieSecret)
      .update(sessionId)
      .digest('base64url');
    return `${sessionId}.${signature}`;
  }

  /** Verify and extract session ID from a signed cookie value */
  verifySignedSessionId(signedValue: string): string | null {
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
    if (signature !== expected) {
      this.logger.warn('Session cookie signature mismatch — possible tampering');
      return null;
    }
    return sessionId;
  }

  getSessionCookieName(): string {
    return this.sessionCookieName;
  }

  getSessionTtlMs(): number {
    return this.sessionTtlMs;
  }

  private sessionKey(sessionId: string): string {
    return `session:${sessionId}`;
  }
}
