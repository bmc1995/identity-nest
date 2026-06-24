import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Application types accepted by the registration endpoint. */
export const CLIENT_TYPES = ['web', 'native', 'spa', 'service'] as const;
export type ClientType = (typeof CLIENT_TYPES)[number];

/** OAuth grant types currently supported by the authorization server. */
export const GRANT_TYPES = [
  'authorization_code',
  'refresh_token',
  'implicit',
  'client_credentials',
] as const;

/**
 * OAuth/OIDC response types supported by the authorization server: the code
 * flow, the implicit flow (`id_token`, `id_token token`), the hybrid flow
 * (`code id_token`, `code token`, `code id_token token`), and `none`.
 */
export const RESPONSE_TYPES = [
  'code',
  'id_token',
  'id_token token',
  'code id_token',
  'code token',
  'code id_token token',
  'none',
] as const;

/** Supported token-endpoint client authentication methods. */
export const AUTH_METHODS = [
  'client_secret_basic',
  'client_secret_post',
  'client_secret_jwt',
  'private_key_jwt',
  'none',
] as const;

/**
 * Shape of the request body for `POST /api/v1/clients`.
 *
 * Field-level validation runs via the global `ValidationPipe`. Cross-field
 * rules (e.g. public clients must not request `client_secret_*` auth) are
 * enforced in {@link ClientService.register}.
 */
export class RegisterClientDto {
  /** Human-readable display name shown on consent screens and the app launcher. */
  @ApiProperty({
    description: 'Human-readable display name shown on consent screens.',
    minLength: 1,
    maxLength: 255,
    example: 'Acme Dashboard',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  /** Optional long-form description surfaced to tenant admins. */
  @ApiPropertyOptional({
    description: 'Optional long-form description surfaced to tenant admins.',
    maxLength: 1024,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description?: string;

  /** Application category; drives secure defaults (PKCE, auth method). */
  @ApiProperty({
    description: 'Application category; drives secure defaults.',
    enum: CLIENT_TYPES,
    example: 'web',
  })
  @IsIn(CLIENT_TYPES)
  type!: ClientType;

  /**
   * Redirect URIs the authorization server may redirect to after user
   * authentication. At least one is required; entries must be unique.
   */
  @ApiProperty({
    description: 'Allowed redirect URIs. At least one is required.',
    type: [String],
    minItems: 1,
    example: ['https://app.example.com/callback'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  redirectUris!: string[];

  /** OAuth grant types permitted for this client. Defaults applied per `type`. */
  @ApiPropertyOptional({
    description: 'OAuth grant types permitted for this client.',
    type: [String],
    enum: GRANT_TYPES,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(GRANT_TYPES, { each: true })
  grantTypes?: string[];

  /** OAuth response types permitted for this client. Defaults to `['code']`. */
  @ApiPropertyOptional({
    description: 'OAuth response types permitted for this client.',
    type: [String],
    enum: RESPONSE_TYPES,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(RESPONSE_TYPES, { each: true })
  responseTypes?: string[];

  /** Token-endpoint authentication method. Public clients must use `none`. */
  @ApiPropertyOptional({
    description: 'Token-endpoint auth method. Public clients must use `none`.',
    enum: AUTH_METHODS,
  })
  @IsOptional()
  @IsIn(AUTH_METHODS)
  tokenEndpointAuthMethod?: (typeof AUTH_METHODS)[number];

  /**
   * URL of the client's JWK Set, used to verify `private_key_jwt` assertions.
   * Mutually exclusive with `jwks`.
   */
  @ApiPropertyOptional({
    description: "URL of the client's JWK Set (private_key_jwt).",
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  jwksUri?: string;

  /**
   * Inline JWK Set for verifying `private_key_jwt` assertions. Mutually
   * exclusive with `jwksUri`.
   */
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    description: "Inline JWK Set (private_key_jwt).",
  })
  @IsOptional()
  @IsObject()
  jwks?: Record<string, unknown>;

  /**
   * Whether to require PKCE for this client. When the auth method is `none`
   * the service forces this to `true` regardless of the submitted value.
   */
  @ApiPropertyOptional({
    description:
      'Whether to require PKCE. Forced to true for public clients regardless of this value.',
  })
  @IsOptional()
  @IsBoolean()
  requirePkce?: boolean;
}
