import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Query string for `GET /oidc/authorize`.
 *
 * Validation here is intentionally limited to type/shape. OAuth-/OIDC-specific
 * validation (unsupported response_type, unsupported code_challenge_method,
 * unknown client) is performed in the controller so that errors can be
 * returned via the spec-defined redirect-with-error mechanism.
 */
export class AuthorizeQueryDto {
  @ApiProperty()
  @IsString()
  response_type!: string;

  @ApiProperty()
  @IsString()
  client_id!: string;

  @ApiProperty()
  @IsString()
  redirect_uri!: string;

  @ApiProperty({ description: 'Space-separated scope list.' })
  @IsString()
  scope!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nonce?: string;

  @ApiProperty()
  @IsString()
  code_challenge!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code_challenge_method?: string;

  // The following fields are defined by the OIDC core spec. We do not currently
  // act on them but accept them here so that compliant clients are not rejected
  // by the global `forbidNonWhitelisted` ValidationPipe.

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  display?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prompt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  max_age?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id_token_hint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  login_hint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  acr_values?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ui_locales?: string;
}
