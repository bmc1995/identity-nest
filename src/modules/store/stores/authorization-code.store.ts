import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CacheService } from '../../../common/cache/cache.service';

const AUTH_CODE_TTL_SECONDS = 10 * 60;

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
  constructor(private readonly cache: CacheService) {}

  async save(params: {
    clientId: string;
    accountId: string;
    grantId: string;
    redirectUri: string;
    scope: string;
    nonce?: string;
    codeChallenge: string;
    codeChallengeMethod: string;
  }): Promise<StoredAuthorizationCode> {
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
      expiresAt: new Date(now.getTime() + AUTH_CODE_TTL_SECONDS * 1000),
      consumedAt: null,
    };

    await this.cache.setJson(this.codeKey(code), stored, AUTH_CODE_TTL_SECONDS);
    return stored;
  }

  async findAndConsume(code: string): Promise<StoredAuthorizationCode | undefined> {
    const stored = await this.cache.getJsonAndDelete<StoredAuthorizationCode>(
      this.codeKey(code),
    );
    if (!stored) return undefined;

    return {
      ...stored,
      createdAt: new Date(stored.createdAt),
      expiresAt: new Date(stored.expiresAt),
      consumedAt: new Date(),
    };
  }

  private codeKey(code: string): string {
    return `authcode:${code}`;
  }
}
