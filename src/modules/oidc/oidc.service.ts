import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '../../common/crypto/jwt/jwt.service';
import { PkceService } from './services/pkce/pkce.service';
import { AccountStore } from '../store/stores/account.store';
import { ClientStore } from '../store/stores/client.store';
import { AuthorizationCodeStore } from '../store/stores/authorization-code.store';
import { GrantStore } from '../store/stores/grant.store';
import { StoredInteraction } from '../store/stores/interaction.store';

@Injectable()
export class OidcService {
  private readonly logger = new Logger(OidcService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly pkceService: PkceService,
    private readonly accountStore: AccountStore,
    private readonly clientStore: ClientStore,
    private readonly authorizationCodeStore: AuthorizationCodeStore,
    private readonly grantStore: GrantStore,
  ) {}

  /**
   * Complete the consent step: create a grant, issue an authorization code,
   * and return the redirect URL.
   */
  completeConsent(interaction: StoredInteraction): string {
    const { params, accountId } = interaction;
    if (!accountId) {
      this.logger.error('completeConsent called on interaction with no authenticated account');
      throw new Error('Interaction has no authenticated account');
    }

    // Create or update the grant
    const grant = this.grantStore.findOrCreate(
      accountId,
      params.client_id,
      params.scope,
    );

    // Issue authorization code
    const authCode = this.authorizationCodeStore.save({
      clientId: params.client_id,
      accountId,
      grantId: grant.id,
      redirectUri: params.redirect_uri,
      scope: params.scope,
      nonce: params.nonce,
      codeChallenge: params.code_challenge,
      codeChallengeMethod: params.code_challenge_method,
    });

    // Build redirect URL
    const redirectUri = new URL(params.redirect_uri);
    redirectUri.searchParams.set('code', authCode.code);
    if (params.state) {
      redirectUri.searchParams.set('state', params.state);
    }

    return redirectUri.toString();
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
    const authCode = this.authorizationCodeStore.findAndConsume(code);
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
    const client = this.clientStore.findByClientId(clientId);
    if (!client) {
      this.logger.error(`Client not found during code exchange: ${clientId}`);
      throw new OidcError('invalid_client', 'Client not found');
    }

    // Look up account for ID token claims
    const account = this.accountStore.findById(authCode.accountId);
    if (!account) {
      this.logger.error(`Account not found during code exchange: ${authCode.accountId}`);
      throw new OidcError('invalid_grant', 'Account not found');
    }

    // Mint tokens
    const [accessToken, idToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken(
        account.id,
        clientId,
        authCode.scope,
        { ttlSeconds: client.accessTokenLifetime },
      ),
      this.jwtService.signIdToken(account.id, clientId, {
        nonce: authCode.nonce ?? undefined,
        auth_time: Math.floor(Date.now() / 1000),
        email: account.email ?? undefined,
        email_verified: account.emailVerified,
        preferred_username: account.username,
      }),
      this.jwtService.signRefreshToken(account.id, clientId, authCode.scope, {
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

    const client = this.clientStore.findByClientId(clientId);
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
