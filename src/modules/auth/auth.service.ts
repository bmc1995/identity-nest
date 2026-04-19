import { Injectable, Logger } from '@nestjs/common';
import { randomUUID, createHmac } from 'crypto';
import { AccountStore, StoredAccount } from '../store/stores/account.store';

interface SessionData {
  sessionId: string;
  accountId: string;
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
  private sessions = new Map<string, SessionData>();

  constructor(private readonly accountStore: AccountStore) {}

  async authenticate(
    username: string,
    password: string,
  ): Promise<StoredAccount | null> {
    const account = await this.accountStore.findByUsername(username);
    if (!account) {
      this.logger.warn(`Authentication failed: unknown username "${username}"`);
      return null;
    }
    const valid = await this.accountStore.verifyPassword(account, password);
    if (!valid) {
      this.logger.warn(`Authentication failed: invalid password for username "${username}"`);
    }
    return valid ? account : null;
  }

  createSession(accountId: string): SessionData {
    const sessionId = randomUUID();
    const now = new Date();
    const session: SessionData = {
      sessionId,
      accountId,
      authenticatedAt: now,
      expiresAt: new Date(now.getTime() + this.sessionTtlMs),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  validateSession(sessionId: string): SessionData | null {
    const session = this.sessions.get(sessionId);
    if (!session) {
      this.logger.warn(`Session not found: ${sessionId}`);
      return null;
    }
    if (session.expiresAt < new Date()) {
      this.logger.warn(`Session expired for account=${session.accountId}`);
      this.sessions.delete(sessionId);
      return null;
    }
    return session;
  }

  destroySession(sessionId: string): void {
    this.sessions.delete(sessionId);
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
}
