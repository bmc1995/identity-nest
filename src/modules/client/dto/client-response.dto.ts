import { ApiProperty } from '@nestjs/swagger';

/**
 * Admin-facing projection of a registered client.
 *
 * Used as the Swagger response schema for `GET` endpoints and the base
 * class for {@link ClientWithSecretDto}.
 */
export class ClientViewDto {
  @ApiProperty({ format: 'uuid', description: 'Internal primary-key UUID' })
  id!: string;

  @ApiProperty({
    description: 'Opaque public client identifier used on OAuth requests',
    example: 'a3f1c9b2d8e04f5a6b7c8d9e0f1a2b3c',
  })
  clientId!: string;

  @ApiProperty({ description: 'Human-readable application name', example: 'Acme Dashboard' })
  name!: string;

  @ApiProperty({ nullable: true, description: 'Optional admin-facing description' })
  description!: string | null;

  @ApiProperty({ enum: ['web', 'native', 'spa', 'service'] })
  type!: string;

  @ApiProperty({ type: [String], example: ['https://app.example.com/callback'] })
  redirectUris!: string[];

  @ApiProperty({ type: [String], example: ['authorization_code', 'refresh_token'] })
  grantTypes!: string[];

  @ApiProperty({ type: [String], example: ['code'] })
  responseTypes!: string[];

  @ApiProperty({ enum: ['client_secret_basic', 'client_secret_post', 'none'] })
  tokenEndpointAuthMethod!: string;

  @ApiProperty({ description: 'When true, PKCE is required on authorization requests' })
  requirePkce!: boolean;

  @ApiProperty({ description: 'Access token lifetime in seconds', example: 3600 })
  accessTokenLifetime!: number;

  @ApiProperty({ description: 'Refresh token lifetime in seconds', example: 2592000 })
  refreshTokenLifetime!: number;

  @ApiProperty({ example: 'active' })
  status!: string;

  @ApiProperty({ description: 'True when a client secret is configured' })
  hasSecret!: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}

/**
 * Response shape for endpoints that mint a secret (`POST /` and
 * `POST /:id/rotate-secret`). The plaintext `clientSecret` is returned
 * exactly once and must be captured by the caller.
 */
export class ClientWithSecretDto extends ClientViewDto {
  @ApiProperty({
    nullable: true,
    description:
      'Plaintext client secret. Returned once on registration or rotation; ' +
      'null for public clients. Not retrievable afterwards.',
  })
  clientSecret!: string | null;
}
