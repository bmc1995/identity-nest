import { ApiProperty } from '@nestjs/swagger';
import { USER_STATUSES } from './create-user.dto';

/**
 * Admin-facing projection of a user account.
 *
 * Used as the Swagger response schema for user endpoints. The password hash
 * never leaves the server boundary.
 */
export class UserViewDto {
  @ApiProperty({ format: 'uuid', description: 'Internal primary-key UUID' })
  id!: string;

  @ApiProperty({ format: 'uuid', description: 'Owning tenant UUID' })
  tenantId!: string;

  @ApiProperty({ description: 'Login email (lowercased)', example: 'jane.doe@example.com' })
  email!: string;

  @ApiProperty({ description: 'Whether the email address has been verified' })
  emailVerified!: boolean;

  @ApiProperty({ nullable: true, description: 'Display nickname, or null' })
  nickname!: string | null;

  @ApiProperty({ nullable: true, description: 'Given (first) name, or null' })
  givenName!: string | null;

  @ApiProperty({ nullable: true, description: 'Family (last) name, or null' })
  familyName!: string | null;

  @ApiProperty({ enum: USER_STATUSES, description: 'Account lifecycle state' })
  status!: string;

  @ApiProperty({ description: 'Whether multi-factor authentication is enabled' })
  mfaEnabled!: boolean;

  @ApiProperty({
    nullable: true,
    type: String,
    format: 'date-time',
    description: 'Timestamp of the most recent successful login, or null',
  })
  lastLogin!: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
