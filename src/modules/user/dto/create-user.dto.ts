import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Account lifecycle states accepted by the user management endpoints. */
export const USER_STATUSES = [
  'active',
  'suspended',
  'locked',
  'deprovisioned',
] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

/**
 * Shape of the request body for `POST /api/v1/users`.
 *
 * Field-level validation runs via the global `ValidationPipe`. Tenant-scoped
 * email uniqueness is enforced in {@link UserService.create}.
 */
export class CreateUserDto {
  /** Login email; unique per tenant, stored lowercased. */
  @ApiProperty({
    description: 'Login email. Unique per tenant; stored lowercased.',
    example: 'jane.doe@example.com',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  /** Initial password. Hashed server-side; never stored or returned in plaintext. */
  @ApiProperty({
    description: 'Initial password. Hashed server-side and never returned.',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  /** Owning tenant UUID. Defaults to the `default` tenant when omitted. */
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Owning tenant UUID. Defaults to the `default` tenant.',
  })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  /** Optional display nickname. */
  @ApiPropertyOptional({ maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nickname?: string;

  /** Optional given (first) name. */
  @ApiPropertyOptional({ maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  givenName?: string;

  /** Optional family (last) name. */
  @ApiPropertyOptional({ maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  familyName?: string;

  /** Mark the email as already verified (e.g. admin-provisioned accounts). */
  @ApiPropertyOptional({
    description: 'Mark the email as already verified. Defaults to false.',
  })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;
}
