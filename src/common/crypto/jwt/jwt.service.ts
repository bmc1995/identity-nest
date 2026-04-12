import { Injectable, Logger } from '@nestjs/common';
import { SignJWT, jwtVerify, importJWK, JWK, CryptoKey, decodeProtectedHeader } from 'jose';
import { JwksService } from '../jwks/jwks.service';
import {
  IdTokenClaims,
  AccessTokenClaims,
  RefreshTokenClaims,
} from '../../interfaces/jwt-claims/jwt-claims.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);

  constructor(private readonly jwksService: JwksService) {}

  /** Sign an OIDC ID Token (short-lived, 5 min) */
  async signIdToken(
    sub: string,
    aud: string,
    extra: Partial<IdTokenClaims> = {},
  ): Promise<string> {
    const { privateJwk, kid, alg, issuer } =
      await this.jwksService.getActiveSigningKey();
    const key = await importJWK(privateJwk as JWK, alg);
    const now = Math.floor(Date.now() / 1000);

    return new SignJWT({
      sub,
      aud,
      iss: issuer,
      iat: now,
      exp: now + 300,
      ...extra,
    })
      .setProtectedHeader({ alg, kid, typ: 'JWT' })
      .sign(key);
  }

  /** Sign an OAuth 2.0 Access Token (RFC 9068, configurable TTL) */
  async signAccessToken(
    sub: string,
    clientId: string,
    scope: string,
    opts: {
      aud?: string;
      ttlSeconds?: number;
      tenantId?: string;
      extra?: Record<string, unknown>;
    } = {},
  ): Promise<string> {
    const { privateJwk, kid, alg, issuer } =
      await this.jwksService.getActiveSigningKey();
    const key = await importJWK(privateJwk as JWK, alg);
    const now = Math.floor(Date.now() / 1000);

    const payload: Omit<AccessTokenClaims, 'iss' | 'iat' | 'exp'> & Record<string, unknown> = {
      sub,
      client_id: clientId,
      scope,
      jti: randomUUID(),
      aud: opts.aud ?? issuer,
      ...(opts.tenantId && { tenant_id: opts.tenantId }),
      ...opts.extra,
    };

    return new SignJWT(payload)
      .setProtectedHeader({ alg, kid, typ: 'at+jwt' })
      .setIssuer(issuer)
      .setIssuedAt(now)
      .setExpirationTime(now + (opts.ttlSeconds ?? 3600))
      .sign(key);
  }

  /** Sign a Refresh Token (longer-lived, 30 days default) */
  async signRefreshToken(
    sub: string,
    clientId: string,
    scope: string,
    opts: {
      ttlSeconds?: number;
      tenantId?: string;
    } = {},
  ): Promise<string> {
    const { privateJwk, kid, alg, issuer } =
      await this.jwksService.getActiveSigningKey();
    const key = await importJWK(privateJwk as JWK, alg);
    const now = Math.floor(Date.now() / 1000);
    const thirtyDays = 30 * 24 * 60 * 60;

    const payload: Omit<RefreshTokenClaims, 'iss' | 'iat' | 'exp'> = {
      sub,
      client_id: clientId,
      scope,
      jti: randomUUID(),
      ...(opts.tenantId && { tenant_id: opts.tenantId }),
    };

    return new SignJWT(payload)
      .setProtectedHeader({ alg, kid, typ: 'rt+jwt' })
      .setIssuer(issuer)
      .setIssuedAt(now)
      .setExpirationTime(now + (opts.ttlSeconds ?? thirtyDays))
      .sign(key);
  }

  /** Verify any JWT signed by this service, looking up the key by kid from the header */
  async verifyJwt<T extends Record<string, unknown> = Record<string, unknown>>(
    token: string,
    opts: { audience?: string } = {},
  ): Promise<T> {
    const header = decodeProtectedHeader(token);
    if (!header.kid) {
      this.logger.warn('JWT verification failed: missing kid in header');
      throw new Error('JWT missing kid in header');
    }

    let publicKey: CryptoKey;
    let issuer: string;
    try {
      ({ publicKey, issuer } = await this.jwksService.getVerificationKeyByKid(header.kid));
    } catch (err) {
      this.logger.warn(`JWT verification failed: unknown kid="${header.kid}"`);
      throw err;
    }

    const { payload } = await jwtVerify(token, publicKey, {
      issuer,
      ...(opts.audience && { audience: opts.audience }),
    });

    return payload as T;
  }
}
