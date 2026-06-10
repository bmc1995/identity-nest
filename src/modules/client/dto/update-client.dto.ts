import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { GRANT_TYPES, RESPONSE_TYPES } from './register-client.dto';

/** Lifecycle states accepted by the client update endpoint. */
export const CLIENT_STATUSES = ['active', 'disabled'] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

/**
 * Shape of the request body for `PATCH /api/v1/clients/:id`.
 *
 * All fields are optional; only supplied fields are changed. Redirect URIs
 * are re-validated against the client's `type` in {@link ClientService.update}.
 * The client `type`, `client_id`, and auth method are immutable after
 * registration — re-register the client to change them.
 */
export class UpdateClientDto {
  /** Human-readable display name shown on consent screens. */
  @ApiPropertyOptional({
    description: 'Human-readable display name shown on consent screens.',
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  /** Long-form description surfaced to tenant admins. */
  @ApiPropertyOptional({ maxLength: 1024 })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description?: string;

  /** Replacement set of allowed redirect URIs. At least one is required. */
  @ApiPropertyOptional({
    description: 'Replacement set of allowed redirect URIs.',
    type: [String],
    minItems: 1,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  redirectUris?: string[];

  /** OAuth grant types permitted for this client. */
  @ApiPropertyOptional({ type: [String], enum: GRANT_TYPES, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsIn(GRANT_TYPES, { each: true })
  grantTypes?: string[];

  /** OAuth response types permitted for this client. */
  @ApiPropertyOptional({ type: [String], enum: RESPONSE_TYPES, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsIn(RESPONSE_TYPES, { each: true })
  responseTypes?: string[];

  /** Whether PKCE is required. Cannot be disabled for public clients. */
  @ApiPropertyOptional({
    description: 'Whether PKCE is required. Cannot be disabled for public clients.',
  })
  @IsOptional()
  @IsBoolean()
  requirePkce?: boolean;

  /** Lifecycle state: `disabled` clients are rejected on OAuth flows. */
  @ApiPropertyOptional({ enum: CLIENT_STATUSES })
  @IsOptional()
  @IsIn(CLIENT_STATUSES)
  status?: ClientStatus;

  /** Access token lifetime in seconds. */
  @ApiPropertyOptional({ minimum: 60, example: 3600 })
  @IsOptional()
  @IsInt()
  @Min(60)
  accessTokenLifetime?: number;

  /** Refresh token lifetime in seconds. */
  @ApiPropertyOptional({ minimum: 60, example: 2592000 })
  @IsOptional()
  @IsInt()
  @Min(60)
  refreshTokenLifetime?: number;
}
