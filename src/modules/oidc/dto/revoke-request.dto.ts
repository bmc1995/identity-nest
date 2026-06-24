import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export const TOKEN_TYPE_HINTS = ['access_token', 'refresh_token'] as const;
export type TokenTypeHint = (typeof TOKEN_TYPE_HINTS)[number];

/** Body for `POST /oidc/revoke` (RFC 7009). */
export class RevokeRequestDto {
  @ApiProperty()
  @IsString()
  token!: string;

  @ApiPropertyOptional({ enum: TOKEN_TYPE_HINTS })
  @IsOptional()
  @IsIn(TOKEN_TYPE_HINTS)
  token_type_hint?: TokenTypeHint;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  client_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  client_secret?: string;

  /** Client-assertion type for JWT client authentication (jwt-bearer URN). */
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
