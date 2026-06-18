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
        'code',
        // Unsupported — the authorize endpoint only implements the code flow.
        // Implicit/hybrid response types are intentionally not offered:
        // 'id_token',
        // 'token',
        // 'code id_token',
      ],
      response_modes_supported: ['query'],
      grant_types_supported: [
        'authorization_code',
        'refresh_token',
        // Unsupported — the token endpoint does not implement these grants:
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
      // client authenticator admits clients that have no stored secret hash.
      token_endpoint_auth_methods_supported: [
        'client_secret_basic',
        'client_secret_post',
        'none',
        // Unsupported — no JWT client-assertion verification is implemented:
        // 'client_secret_jwt',  // would also need token_endpoint_auth_signing_alg_values_supported
        // 'private_key_jwt',    // would also need per-client JWKS resolution
      ],
      // Only meaningful once client_secret_jwt / private_key_jwt are enabled:
      // token_endpoint_auth_signing_alg_values_supported: ['RS256'],
      revocation_endpoint_auth_methods_supported: [
        'client_secret_basic',
        'client_secret_post',
        'none',
        // Unsupported (see token_endpoint_auth_methods_supported):
        // 'client_secret_jwt',
        // 'private_key_jwt',
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
