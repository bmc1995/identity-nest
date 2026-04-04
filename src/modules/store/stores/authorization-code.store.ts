import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

export interface StoredAuthorizationCode {
  code: string;
  clientId: string;
  accountId: string;
  grantId: string;
  redirectUri: string;
  scope: string;
  nonce: string | null;
  codeChallenge: string;
  codeChallengeMethod: string;
  createdAt: Date;
  expiresAt: Date;
  consumedAt: Date | null;
}

@Injectable()
export class AuthorizationCodeStore {
  private codes = new Map<string, StoredAuthorizationCode>();

  save(params: {
    clientId: string;
    accountId: string;
    grantId: string;
    redirectUri: string;
    scope: string;
    nonce?: string;
    codeChallenge: string;
    codeChallengeMethod: string;
  }): StoredAuthorizationCode {
    const code = randomBytes(32).toString('base64url');
    const now = new Date();

    const stored: StoredAuthorizationCode = {
      code,
      clientId: params.clientId,
      accountId: params.accountId,
      grantId: params.grantId,
      redirectUri: params.redirectUri,
      scope: params.scope,
      nonce: params.nonce ?? null,
      codeChallenge: params.codeChallenge,
      codeChallengeMethod: params.codeChallengeMethod,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 10 * 60 * 1000), // 10 minutes
      consumedAt: null,
    };

    this.codes.set(code, stored);
    return stored;
  }

  /**
   * Find and atomically consume an authorization code.
   * Returns the code data if valid and unconsumed, otherwise undefined.
   */
  findAndConsume(code: string): StoredAuthorizationCode | undefined {
    const stored = this.codes.get(code);
    if (!stored) return undefined;
    if (stored.consumedAt) return undefined;
    if (stored.expiresAt < new Date()) {
      this.codes.delete(code);
      return undefined;
    }
    stored.consumedAt = new Date();
    return stored;
  }
}
