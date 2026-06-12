import { Controller, Get } from '@nestjs/common';
import { JwksService } from '../../crypto/jwks/jwks.service';

@Controller('.well-known')
export class DiscoveryController {
  constructor(private readonly jwks: JwksService) {}

  @Get('openid-configuration')
  async openidConfig() {
    const issuer = this.jwks.getIssuer();
    return {
      issuer,
      authorization_endpoint: `${issuer}/oidc/authorize`,
      token_endpoint: `${issuer}/oidc/token`,
      userinfo_endpoint: `${issuer}/oidc/userinfo`,
      revocation_endpoint: `${issuer}/oidc/revoke`,
      // TODO end_session_endpoint: `ex: ${issuer}/oidc/oauth2/sessions/logout`
      jwks_uri: `${issuer}/oidc/jwks.json`,
      registration_endpoint: `${issuer}/connect/register`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      token_endpoint_auth_methods_supported: [
        'client_secret_basic',
        'client_secret_post',
      ],
      revocation_endpoint_auth_methods_supported: [
        'client_secret_basic',
        'client_secret_post',
      ],
      scopes_supported: ['openid', 'profile', 'email'],
      claims_supported: ['sub', 'name', 'email'],
      code_challenge_methods_supported: ['S256'],
    };
  }
}
