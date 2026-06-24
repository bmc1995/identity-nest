import { Injectable, Logger } from '@nestjs/common';
import { decodeProtectedHeader } from 'jose';
import { JwtService } from '../../common/crypto/jwt/jwt.service';
import { PkceService } from './services/pkce/pkce.service';
import { TokenDenylistService } from './services/token-denylist/token-denylist.service';
import { UserService } from '../user/user.service';
import { ClientStore } from '../store/stores/client.store';
import { AuthorizationCodeStore } from '../store/stores/authorization-code.store';
import { GrantStore } from '../store/stores/grant.store';
import { StoredInteraction } from '../store/stores/interaction.store';
import {
  defaultResponseMode,
  parseResponseType,
  ResponseMode,
} from './utils/response-type';

@Injectable()
export class OidcService {
  private readonly logger = new Logger(OidcService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly pkceService: PkceService,
    private readonly users: UserService,
    private readonly clientStore: ClientStore,
    private readonly authorizationCodeStore: AuthorizationCodeStore,
    private readonly grantStore: GrantStore,
    private readonly denylist: TokenDenylistService,
  ) {}

  /**
   * Complete the consent step: create a grant, mint the artifacts the client's
   * `response_type` calls for (authorization code, access token, and/or ID
   * token), and return the redirect URL with those artifacts placed in the
   * query string or fragment per the resolved `response_mode`.
   *
   * Covers the authorization code, implicit, hybrid, and `none` flows. Implicit
   * and hybrid responses carry tokens directly here; the code flow defers token
   * minting to {@link exchangeCode} at the token endpoint.
   */
  async completeConsent(interaction: StoredInteraction): Promise<string> {
    const { params, userId } = interaction;
    if (!userId) {
      this.logger.error('completeConsent called on interaction with no authenticated user');
      throw new Error('Interaction has no authenticated user');
    }

    const parsed = parseResponseType(params.response_type);
    if (!parsed) {
      // Authorize already validated this; a mismatch indicates a bug upstream.
      throw new Error(`Unsupported response_type: ${params.response_type}`);
    }
    const mode: ResponseMode =
      params.response_mode === 'query' || params.response_mode === 'fragment'
        ? params.response_mode
        : defaultResponseMode(parsed);

    // Create or update the grant recording the user's consent.
    const grant = await this.grantStore.findOrCreate(
      userId,
      params.client_id,
      params.scope,
    );

    const out: Record<string, string> = {};
    if (params.state) out.state = params.state;

    // Access/ID tokens (implicit + hybrid) need the client and user records;
    // the pure code flow does not, so only load them when required.
    const needsTokens = parsed.hasToken || parsed.hasIdToken;
    const client = needsTokens
      ? await this.clientStore.findByClientId(params.client_id)
      : null;
    const user = needsTokens ? await this.users.findById(userId) : null;
    if (needsTokens && (!client || !user)) {
      this.logger.error('Missing client or user while minting implicit/hybrid tokens');
      throw new Error('Cannot mint tokens: client or user not found');
    }

    let codeValue: string | undefined;
    if (parsed.hasCode) {
      const authCode = await this.authorizationCodeStore.save({
        clientId: params.client_id,
        userId,
        grantId: grant.id,
        redirectUri: params.redirect_uri,
        scope: params.scope,
        nonce: params.nonce,
        codeChallenge: params.code_challenge ?? '',
        codeChallengeMethod: params.code_challenge_method ?? '',
      });
      codeValue = authCode.code;
      out.code = codeValue;
    }

    let accessTokenValue: string | undefined;
    if (parsed.hasToken && client) {
      accessTokenValue = await this.jwtService.signAccessToken(
        userId,
        params.client_id,
        params.scope,
        { ttlSeconds: client.accessTokenLifetime },
      );
      out.access_token = accessTokenValue;
      out.token_type = 'Bearer';
      out.expires_in = String(client.accessTokenLifetime);
      out.scope = params.scope;
    }

    if (parsed.hasIdToken && user) {
      // Hash bindings tie the ID token to the code/access token delivered in the
      // same response (OIDC Core §3.3.2.11).
      const [cHash, atHash] = await Promise.all([
        codeValue ? this.jwtService.tokenHash(codeValue) : undefined,
        accessTokenValue ? this.jwtService.tokenHash(accessTokenValue) : undefined,
      ]);
      out.id_token = await this.jwtService.signIdToken(userId, params.client_id, {
        nonce: params.nonce ?? undefined,
        auth_time: Math.floor(Date.now() / 1000),
        email: user.email,
        email_verified: user.emailVerified,
        preferred_username: user.nickname ?? user.email,
        ...(cHash ? { c_hash: cHash } : {}),
        ...(atHash ? { at_hash: atHash } : {}),
      });
    }

    return this.buildAuthorizationRedirect(params.redirect_uri, out, mode);
  }

  /**
   * Assemble the authorization response redirect, placing `params` in the query
   * string (`query` mode) or the URL fragment (`fragment` mode, used by token-
   * bearing responses).
   */
  private buildAuthorizationRedirect(
    redirectUri: string,
    params: Record<string, string>,
    mode: ResponseMode,
  ): string {
    const url = new URL(redirectUri);
    if (mode === 'fragment') {
      const fragment = new URLSearchParams(params);
      url.hash = fragment.toString();
    } else {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }
    return url.toString();
  }

  /**
   * Exchange an authorization code for tokens.
   */
  async exchangeCode(
    code: string,
    clientId: string,
    redirectUri: string,
    codeVerifier: string,
  ): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
    scope: string;
  }> {
    // Consume the authorization code
    const authCode = await this.authorizationCodeStore.findAndConsume(code);
    if (!authCode) {
      this.logger.warn(`Invalid, expired, or already-used authorization code for client_id=${clientId}`);
      throw new OidcError('invalid_grant', 'Authorization code is invalid, expired, or already used');
    }

    // Validate client_id matches
    if (authCode.clientId !== clientId) {
      this.logger.warn(`Authorization code client mismatch: code issued to ${authCode.clientId}, requested by ${clientId}`);
      throw new OidcError('invalid_grant', 'Authorization code was not issued to this client');
    }

    // Validate redirect_uri matches
    if (authCode.redirectUri !== redirectUri) {
      this.logger.warn(`Redirect URI mismatch for client_id=${clientId}`);
      throw new OidcError('invalid_grant', 'Redirect URI mismatch');
    }

    // Verify PKCE code_verifier
    const pkceValid = this.pkceService.verifyCodeChallenge(
      codeVerifier,
      authCode.codeChallenge,
      authCode.codeChallengeMethod,
    );
    if (!pkceValid) {
      this.logger.warn(`PKCE verification failed for client_id=${clientId}`);
      throw new OidcError('invalid_grant', 'PKCE verification failed');
    }

    // Look up the client for token lifetime config
    const client = await this.clientStore.findByClientId(clientId);
    if (!client) {
      this.logger.error(`Client not found during code exchange: ${clientId}`);
      throw new OidcError('invalid_client', 'Client not found');
    }

    // Look up user for ID token claims
    const user = await this.users.findById(authCode.userId);
    if (!user) {
      this.logger.error(`User not found during code exchange: ${authCode.userId}`);
      throw new OidcError('invalid_grant', 'User not found');
    }

    // Mint tokens
    const [accessToken, idToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken(
        user.id,
        clientId,
        authCode.scope,
        { ttlSeconds: client.accessTokenLifetime },
      ),
      this.jwtService.signIdToken(user.id, clientId, {
        nonce: authCode.nonce ?? undefined,
        auth_time: Math.floor(Date.now() / 1000),
        email: user.email,
        email_verified: user.emailVerified,
        preferred_username: user.nickname ?? user.email,
      }),
      this.jwtService.signRefreshToken(user.id, clientId, authCode.scope, {
        ttlSeconds: client.refreshTokenLifetime,
      }),
    ]);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: client.accessTokenLifetime,
      id_token: idToken,
      refresh_token: refreshToken,
      scope: authCode.scope,
    };
  }

  /**
   * Refresh tokens: verify the refresh token, mint new access + refresh tokens.
   */
  async refreshTokens(
    refreshTokenJwt: string,
    clientId: string,
  ): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  }> {
    // Verify the refresh token JWT
    let payload: { sub: string; client_id: string; scope: string };
    try {
      payload = await this.jwtService.verifyJwt<{
        sub: string;
        client_id: string;
        scope: string;
      }>(refreshTokenJwt);
    } catch {
      this.logger.warn(`Invalid or expired refresh token for client_id=${clientId}`);
      throw new OidcError('invalid_grant', 'Refresh token is invalid or expired');
    }

    if (payload.client_id !== clientId) {
      this.logger.warn(`Refresh token client mismatch: token issued to ${payload.client_id}, requested by ${clientId}`);
      throw new OidcError('invalid_grant', 'Refresh token was not issued to this client');
    }

    const client = await this.clientStore.findByClientId(clientId);
    if (!client) {
      this.logger.error(`Client not found during token refresh: ${clientId}`);
      throw new OidcError('invalid_client', 'Client not found');
    }

    // Mint new tokens
    const [accessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAccessToken(
        payload.sub,
        clientId,
        payload.scope,
        { ttlSeconds: client.accessTokenLifetime },
      ),
      this.jwtService.signRefreshToken(payload.sub, clientId, payload.scope, {
        ttlSeconds: client.refreshTokenLifetime,
      }),
    ]);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: client.accessTokenLifetime,
      refresh_token: newRefreshToken,
      scope: payload.scope,
    };
  }

  /**
   * Revoke a token (RFC 7009). The endpoint is best-effort and returns
   * successfully to the caller in all cases except client mismatch; this
   * method therefore swallows verification failures and only signals an
   * error to the caller when the token was issued to a different client.
   *
   * For refresh tokens we also revoke the underlying Grant so subsequent
   * refresh attempts fail (access tokens issued from the same grant remain
   * valid until they expire — the access-token denylist handles known JTIs,
   * but only those explicitly revoked).
   */
  async revokeToken(token: string, authenticatedClientId: string): Promise<void> {
    let payload: {
      sub: string;
      client_id: string;
      scope?: string;
      jti?: string;
      exp?: number;
    };
    try {
      payload = await this.jwtService.verifyJwt(token);
    } catch {
      this.logger.log(`Revocation: token is invalid or expired — no-op`);
      return;
    }

    if (payload.client_id !== authenticatedClientId) {
      this.logger.warn(
        `Revocation refused: token issued to ${payload.client_id} but request from ${authenticatedClientId}`,
      );
      // Per RFC 7009, do not reveal validity to the caller; return silently.
      return;
    }

    if (!payload.jti || !payload.exp) {
      this.logger.warn('Revocation: token missing jti or exp claim — cannot denylist');
      return;
    }

    await this.denylist.revoke(payload.jti, payload.exp);

    // If this is a refresh token, also revoke the underlying grant so future
    // refreshes against it fail. Discriminate by the `typ` header set in
    // JwtService (rt+jwt for refresh, at+jwt for access).
    const { typ } = decodeProtectedHeader(token);
    if (typ === 'rt+jwt') {
      const grant = await this.grantStore.findByUserAndClient(
        payload.sub,
        authenticatedClientId,
      );
      if (grant) {
        await this.grantStore.revoke(grant.id);
        this.logger.log(`Revocation: grant ${grant.id} marked revoked`);
      }
    }
  }
}

export class OidcError extends Error {
  constructor(
    public readonly error: string,
    public readonly errorDescription: string,
  ) {
    super(errorDescription);
    this.name = 'OidcError';
  }
}
