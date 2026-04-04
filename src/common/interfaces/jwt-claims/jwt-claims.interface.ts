import { JWTPayload } from 'jose';

/** Standard OIDC ID Token claims (RFC 7519 + OpenID Connect Core §2) */
export interface IdTokenClaims extends JWTPayload {
  sub: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
  auth_time?: number;
  nonce?: string;
  at_hash?: string;
  acr?: string;
  amr?: string[];

  // OIDC standard profile claims
  name?: string;
  email?: string;
  email_verified?: boolean;
  preferred_username?: string;
  picture?: string;
}

/** Access token claims (RFC 9068 - JWT Profile for OAuth 2.0 Access Tokens) */
export interface AccessTokenClaims extends JWTPayload {
  sub: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  jti: string;
  client_id: string;
  scope: string;
  tenant_id?: string;
}

/** Refresh token claims (opaque or JWT-based) */
export interface RefreshTokenClaims extends JWTPayload {
  sub: string;
  iss: string;
  jti: string;
  client_id: string;
  scope: string;
  iat: number;
  exp: number;
  tenant_id?: string;
}
