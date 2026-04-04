import { Injectable } from '@nestjs/common';
import { randomUUID, createHmac } from 'crypto';
import { AccountStore, StoredAccount } from '../store/stores/account.store';

interface SessionData {
  sessionId: string;
  accountId: string;
  authenticatedAt: Date;
  expiresAt: Date;
}

const SESSION_COOKIE = 'idp_session';
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour
const COOKIE_SECRET = 'dev-cookie-secret-change-in-production';

@Injectable()
export class AuthService {
  private sessions = new Map<string, SessionData>();

  constructor(private readonly accountStore: AccountStore) {}

  async authenticate(
    username: string,
    password: string,
  ): Promise<StoredAccount | null> {
    const account = this.accountStore.findByUsername(username);
    if (!account) return null;
    const valid = await this.accountStore.verifyPassword(account, password);
    return valid ? account : null;
  }

  createSession(accountId: string): SessionData {
    const sessionId = randomUUID();
    const now = new Date();
    const session: SessionData = {
      sessionId,
      accountId,
      authenticatedAt: now,
      expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  validateSession(sessionId: string): SessionData | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    if (session.expiresAt < new Date()) {
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
    const signature = createHmac('sha256', COOKIE_SECRET)
      .update(sessionId)
      .digest('base64url');
    return `${sessionId}.${signature}`;
  }

  /** Verify and extract session ID from a signed cookie value */
  verifySignedSessionId(signedValue: string): string | null {
    const dotIndex = signedValue.lastIndexOf('.');
    if (dotIndex === -1) return null;
    const sessionId = signedValue.substring(0, dotIndex);
    const signature = signedValue.substring(dotIndex + 1);
    const expected = createHmac('sha256', COOKIE_SECRET)
      .update(sessionId)
      .digest('base64url');
    if (signature !== expected) return null;
    return sessionId;
  }

  getSessionCookieName(): string {
    return SESSION_COOKIE;
  }
}
