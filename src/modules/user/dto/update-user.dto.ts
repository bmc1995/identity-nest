import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { USER_STATUSES, UserStatus } from './create-user.dto';

/**
 * Shape of the request body for `PATCH /api/v1/users/:id`.
 *
 * All fields are optional; only supplied fields are changed. Tenant-scoped
 * email uniqueness on rename is enforced in {@link UserService.update}.
 */
export class UpdateUserDto {
  /** New login email; unique per tenant, stored lowercased. */
  @ApiPropertyOptional({
    description: 'New login email. Unique per tenant; stored lowercased.',
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  /** Replacement password. Hashed server-side; invalidates the old one immediately. */
  @ApiPropertyOptional({
    description:
      'Replacement password. Hashed server-side; the old password stops working immediately.',
    minLength: 8,
    maxLength: 128,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password?: string;

  /** Display nickname. */
  @ApiPropertyOptional({ maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nickname?: string;

  /** Given (first) name. */
  @ApiPropertyOptional({ maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  givenName?: string;

  /** Family (last) name. */
  @ApiPropertyOptional({ maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  familyName?: string;

  /** Email verification flag. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  /** Account lifecycle state (suspend/lock/reactivate an account). */
  @ApiPropertyOptional({ enum: USER_STATUSES })
  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: UserStatus;
}
