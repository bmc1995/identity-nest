import { ApiProperty } from '@nestjs/swagger';
import { TENANT_TIERS } from './create-tenant.dto';

/**
 * Admin-facing projection of a tenant.
 *
 * Used as the Swagger response schema for tenant endpoints. The per-tenant
 * `encryption_key` is never included.
 */
export class TenantViewDto {
  @ApiProperty({ format: 'uuid', description: 'Internal primary-key UUID' })
  id!: string;

  @ApiProperty({ description: 'Unique, case-insensitive tenant name', example: 'acme-corp' })
  name!: string;

  @ApiProperty({ description: 'Data-residency region', example: 'local' })
  region!: string;

  @ApiProperty({
    nullable: true,
    type: 'object',
    additionalProperties: true,
    description: 'Branding overrides, or null',
  })
  branding!: Record<string, any> | null;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    description: 'Tenant configuration object',
  })
  settings!: Record<string, any>;

  @ApiProperty({
    nullable: true,
    type: 'object',
    additionalProperties: true,
    description: 'Free-form metadata, or null',
  })
  metadata!: Record<string, any> | null;

  @ApiProperty({ nullable: true, description: 'Primary admin contact email' })
  adminEmail!: string | null;

  @ApiProperty({ nullable: true, format: 'uuid', description: 'Assigned subscription plan UUID' })
  planId!: string | null;

  @ApiProperty({ nullable: true, description: 'Billing contact email' })
  billingEmail!: string | null;

  @ApiProperty({ nullable: true, enum: TENANT_TIERS, description: 'Subscription tier' })
  tier!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
