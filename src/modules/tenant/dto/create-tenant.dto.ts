import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Subscription tiers a tenant may be assigned. */
export const TENANT_TIERS = ['free', 'pro', 'enterprise'] as const;
export type TenantTier = (typeof TENANT_TIERS)[number];

/**
 * Shape of the request body for `POST /api/v1/tenants`.
 *
 * Field-level validation runs via the global `ValidationPipe`. The per-tenant
 * `encryption_key` is intentionally absent: it is generated server-side in
 * {@link TenantService.create} and never accepted from clients.
 */
export class CreateTenantDto {
  /** Unique, case-insensitive tenant name (slug or organisation identifier). */
  @ApiProperty({
    description: 'Unique, case-insensitive tenant name.',
    minLength: 1,
    maxLength: 255,
    example: 'acme-corp',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  /** Data-residency region. Defaults to `local` when omitted. */
  @ApiPropertyOptional({
    description: 'Data-residency region. Defaults to `local`.',
    maxLength: 255,
    example: 'us-east-1',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  region?: string;

  /** Branding overrides (e.g. `logo_url`, `primary_color`, `custom_domain`). */
  @ApiPropertyOptional({
    description: 'Branding overrides: logo_url, primary_color, custom_domain, etc.',
    type: 'object',
    additionalProperties: true,
    example: { primary_color: '#1a73e8', custom_domain: 'id.acme.com' },
  })
  @IsOptional()
  @IsObject()
  branding?: Record<string, any>;

  /** Tenant configuration (e.g. `mfa_required`, `session_timeout`, `password_policy`). */
  @ApiPropertyOptional({
    description: 'Tenant configuration: mfa_required, session_timeout, password_policy, etc.',
    type: 'object',
    additionalProperties: true,
    example: { mfa_required: true, session_timeout: 3600 },
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  /** Free-form bag for additional tenant-specific data. */
  @ApiPropertyOptional({
    description: 'Free-form metadata for additional tenant-specific data.',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  /** Primary administrative contact email for the tenant. */
  @ApiPropertyOptional({
    description: 'Primary administrative contact email.',
    maxLength: 255,
    example: 'admin@acme.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  adminEmail?: string;

  /** Identifier of the subscription plan assigned to the tenant. */
  @ApiPropertyOptional({
    description: 'UUID of the subscription plan assigned to the tenant.',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  planId?: string;

  /** Billing contact email for the tenant. */
  @ApiPropertyOptional({
    description: 'Billing contact email.',
    maxLength: 255,
    example: 'billing@acme.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  billingEmail?: string;

  /** Subscription tier. */
  @ApiPropertyOptional({
    description: 'Subscription tier.',
    enum: TENANT_TIERS,
    example: 'free',
  })
  @IsOptional()
  @IsIn(TENANT_TIERS)
  tier?: TenantTier;
}
