import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

/**
 * Body for `POST /oidc/token`.
 *
 * The token endpoint accepts multiple grant flows; required fields differ per
 * `grant_type` and are validated by the service layer. Field-level checks here
 * cover only the type/shape of values that may appear on the wire.
 */
export const TOKEN_GRANT_TYPES = [
  'authorization_code',
  'refresh_token',
  'client_credentials',
] as const;

export class TokenRequestDto {
  @ApiPropertyOptional({ enum: TOKEN_GRANT_TYPES })
  @IsOptional()
  @IsIn(TOKEN_GRANT_TYPES)
  grant_type?: (typeof TOKEN_GRANT_TYPES)[number];

  /** Authorization code returned from `/authorize` (auth-code grant). */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;

  /** Redirect URI that was used in the original `/authorize` request. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  redirect_uri?: string;

  /** PKCE verifier matching the original `code_challenge`. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code_verifier?: string;

  /** Refresh token (refresh-token grant). */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refresh_token?: string;

  /** Optional space-separated scope subset on refresh. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  scope?: string;

  /** Client identifier when authenticating via POST body instead of Basic auth. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  client_id?: string;

  /** Client secret when authenticating via POST body instead of Basic auth. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  client_secret?: string;

  /**
   * Client-assertion type for JWT client authentication (client_secret_jwt /
   * private_key_jwt). Must be the jwt-bearer URN when present.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  client_assertion_type?: string;

  /** Signed JWT proving client identity (client_secret_jwt / private_key_jwt). */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  client_assertion?: string;
}
