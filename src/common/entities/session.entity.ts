import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

@Entity('sessions')
@Index('idx_user_sessions', ['tenant', 'user'])
@Index('idx_token_lookup', ['sessionTokenHash'])
@Index('idx_active_sessions', ['tenant', 'status', 'expiresAt'])
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 512 })
  sessionToken!: string; // Long random string or JWT

  @Column({ type: 'varchar', length: 255, unique: true })
  sessionTokenHash!: string; // SHA-256 hash for lookup

  // References
  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  @Index()
  tenant!: Tenant;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user!: User;

  // Device info
  @Column({ type: 'varchar', length: 255, nullable: true })
  deviceId!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deviceFingerprint!: string | null;

  @Column({ type: 'inet', nullable: true })
  ipAddress!: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent!: string | null;

  // Authentication context
  @Column({ type: 'jsonb', nullable: true })
  authenticationMethods!: string[] | null; // ["password", "totp"]

  @Column({ type: 'timestamptz' })
  authenticatedAt!: Date;

  // Status
  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
    comment: 'active, expired, revoked, invalidated',
  })
  status!: string;

  // Lifecycle
  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ type: 'timestamptz' })
  lastActivity!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  // Constraint: ensure expires_at > authenticated_at
  // This would be handled at the database level with CHECK constraint
}
