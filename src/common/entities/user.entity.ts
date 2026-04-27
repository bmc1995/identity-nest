import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { Credential } from './credential.entity';
import { Session } from './session.entity';
import { Grant } from './grant.entity';
import { AccessToken } from './accessToken.entity';
import { RefreshToken } from './refreshToken.entity';

@Entity('users')
@Unique('users_email_unique', ['tenant', 'email'])
@Index('idx_tenant_email', ['tenant', 'email'])
@Index('idx_status', ['tenant', 'status'])
@Index('idx_last_login', ['tenant', 'lastLogin'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  @Index()
  tenant!: Tenant;

  // Identity
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  emailVerifiedAt!: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: 'boolean', default: false })
  phoneVerified!: boolean;

  // Profile
  @Column({ type: 'varchar', length: 255, nullable: true })
  givenName!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  familyName!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  middleName!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nickname!: string | null;

  @Column({ type: 'text', nullable: true })
  profilePictureUrl!: string | null;

  // Status
  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
    comment: 'active, suspended, deprovisioned, locked',
  })
  status!: string;

  // Password
  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordHash!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  passwordChangedAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  passwordExpiresAt!: Date | null;

  // Custom attributes
  @Column({ type: 'jsonb', default: {} })
  attributes!: Record<string, any>;

  // MFA & Security
  @Column({ type: 'boolean', default: false })
  mfaEnabled!: boolean;

  @Column({ type: 'jsonb', default: '[]' })
  mfaMethods!: string[]; // TOTP, WebAuthn, SMS, Email

  @Column({ type: 'timestamptz', nullable: true })
  lastLogin!: Date | null;

  @Column({ type: 'integer', default: 0 })
  loginCount!: number;

  @Column({ type: 'integer', default: 0 })
  failedLoginAttempts!: number;

  @Column({ type: 'timestamptz', nullable: true })
  lockedUntil!: Date | null;

  // Metadata
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  // Relations
  @OneToMany(() => Credential, (cred) => cred.user)
  credentials!: Credential[];

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @OneToMany(() => Grant, (g) => g.user)
  grants!: Grant[];

  @OneToMany(() => AccessToken, (t) => t.user)
  accessTokens!: AccessToken[];

  @OneToMany(() => RefreshToken, (t) => t.user)
  refreshTokens!: RefreshToken[];
}
