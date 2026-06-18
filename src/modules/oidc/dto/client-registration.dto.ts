import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * Client metadata for OAuth 2.0 Dynamic Client Registration (RFC 7591).
 *
 * Field names follow the RFC's snake_case wire format — distinct from the
 * camelCase admin {@link RegisterClientDto}. Only the metadata this server
 * acts on carries semantic validation; the remaining standard members are
 * whitelisted and ignored so that spec-compliant clients are not rejected by
 * the global `forbidNonWhitelisted` ValidationPipe (RFC 7591 §3.1 — servers
 * MUST ignore unknown/unsupported metadata).
 */
export class ClientRegistrationDto {
  /** Redirection URIs. Required for the authorization_code grant. */
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  redirect_uris?: string[];

  /** Requested client authentication method. Defaults to client_secret_basic. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  token_endpoint_auth_method?: string;

  /** Requested grant types. Defaults to ['authorization_code']. */
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  grant_types?: string[];

  /** Requested response types. Defaults to ['code']. */
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  response_types?: string[];

  /** Human-readable client name shown on the consent screen. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  client_name?: string;

  /** OIDC application type; selects the public-client default (spa vs native). */
  @ApiPropertyOptional({ enum: ['web', 'native'] })
  @IsOptional()
  @IsIn(['web', 'native'])
  application_type?: 'web' | 'native';

  /** Space-separated scope values the client may request. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  scope?: string;

  // --- Accepted-and-ignored RFC 7591 members. Whitelisted so compliant
  //     clients are not rejected; this server does not act on them yet. ---

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  client_uri?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo_uri?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tos_uri?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  policy_uri?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jwks_uri?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  jwks?: Record<string, unknown>;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contacts?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  software_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  software_statement?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  software_version?: string;

  // OpenID Connect Dynamic Client Registration 1.0 §2 members. Declared so the
  // forbidNonWhitelisted pipe does not 400 a compliant request; not acted on.

  @ApiPropertyOptional({ enum: ['public', 'pairwise'] })
  @IsOptional()
  @IsString()
  subject_type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sector_identifier_uri?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id_token_signed_response_alg?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id_token_encrypted_response_alg?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id_token_encrypted_response_enc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userinfo_signed_response_alg?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userinfo_encrypted_response_alg?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userinfo_encrypted_response_enc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  request_object_signing_alg?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  request_object_encryption_alg?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  request_object_encryption_enc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  token_endpoint_auth_signing_alg?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  default_max_age?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  require_auth_time?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  default_acr_values?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  initiate_login_uri?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  request_uris?: string[];
}
