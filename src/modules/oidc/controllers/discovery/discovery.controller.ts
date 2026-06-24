import { Controller, Get } from '@nestjs/common';
import { JwksService } from '../../../../common/crypto/jwks/jwks.service'

@Controller('.well-known')
export class DiscoveryController {
  constructor(private readonly jwks: JwksService) {}

  @Get('openid-configuration')
  async openidConfig() {
    const issuer = this.jwks.getIssuer();
    // Dynamic client registration is gated by an initial access token; only
    // advertise the endpoint when that token is configured and the endpoint
    // is therefore live (see RegistrationAccessTokenGuard).
    const registrationEnabled =
      !!process.env.OIDC_REGISTRATION_ACCESS_TOKEN?.trim();
    return {
      issuer,
      authorization_endpoint: `${issuer}/oidc/authorize`,
      token_endpoint: `${issuer}/oidc/token`,
      userinfo_endpoint: `${issuer}/oidc/userinfo`,
      revocation_endpoint: `${issuer}/oidc/revoke`,
      end_session_endpoint: `${issuer}/oidc/sessions/logout`,
      jwks_uri: `${issuer}/oidc/jwks.json`,
      // OAuth 2.0 Dynamic Client Registration (RFC 7591). Omitted when the
      // endpoint is disabled (no initial access token configured).
      ...(registrationEnabled && {
        registration_endpoint: `${issuer}/oidc/register`,
      }),
      response_types_supported: [
        'code', // Authorization Code Flow
        'id_token', // Implicit Flow
        'id_token token', // Implicit Flow
        'code id_token', // Hybrid Flow
        'code token', // Hybrid Flow
        'code id_token token', // Hybrid Flow
        'none',
      ],
      response_modes_supported: ['query', 'fragment'],
      grant_types_supported: [
        'authorization_code',
        'refresh_token',
        // implicit covers the tokens returned directly from /authorize by the
        // implicit and hybrid response types.
        'implicit',
        // Unsupported — the token endpoint does not implement this grant:
        // 'client_credentials',
      ],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: [
        'RS256',
        // JwksService can generate ES256 keys, but none is activated at
        // startup, so verifiers would not find a matching JWK:
        // 'ES256',
      ],
      // `none` covers public clients that authenticate with PKCE alone — the
      // client authenticator admits clients that have no stored secret.
      token_endpoint_auth_methods_supported: [
        'client_secret_basic',
        'client_secret_post',
        'client_secret_jwt',
        'private_key_jwt',
        'none',
      ],
      // Algorithms accepted on client-assertion JWTs: HS256 for client_secret_jwt
      // (HMAC keyed by the client secret), RS256/ES256 for private_key_jwt.
      token_endpoint_auth_signing_alg_values_supported: [
        'RS256',
        'ES256',
        'HS256',
      ],
      revocation_endpoint_auth_methods_supported: [
        'client_secret_basic',
        'client_secret_post',
        'client_secret_jwt',
        'private_key_jwt',
        'none',
      ],
      scopes_supported: ['openid', 'profile', 'email'],
      claims_supported: [
        'sub',
        'auth_time',
        'preferred_username',
        'email',
        'email_verified',
      ],
      code_challenge_methods_supported: [
        'S256',
        // Accepted by the authorize endpoint for non-PKCE-required clients, but
        // intentionally not advertised — 'plain' is discouraged (RFC 7636 §4.2):
        // 'plain',
      ],
    };
  }
}
