import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

@Entity('credentials')
@Unique('creds_per_user', ['user', 'type', 'status'])
@Index('idx_user_credentials', ['tenant', 'user', 'type'])
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  @Index()
  tenant!: Tenant;

  @ManyToOne(() => User, (user) => user.credentials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user!: User;

  // Credential type
  @Column({
    type: 'varchar',
    length: 50,
    comment: 'password, totp, webauthn, backup_code, recovery_phone',
  })
  type!: string;

  // Encrypted credential value
  @Column({ type: 'text' })
  encryptedValue!: string; // AES-256-GCM encrypted

  @Column({ type: 'uuid' })
  encryptionKeyId!: string;

  // WebAuthn specific
  @Column({ type: 'text', nullable: true })
  credentialId!: string | null; // base64 encoded

  @Column({ type: 'jsonb', nullable: true })
  publicKey!: Record<string, any> | null;

  @Column({ type: 'bigint', nullable: true })
  counter!: number | null;

  @Column({ type: 'jsonb', nullable: true })
  transports!: string[] | null;

  // TOTP/backup codes
  @Column({ type: 'varchar', length: 255, nullable: true })
  secret!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  backupCodes!: string[] | null;

  // Status & lifecycle
  @Column({ type: 'varchar', length: 50, default: 'active' })
  status!: string;

  @Column({ type: 'boolean', default: false })
  verified!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  verifiedAt!: Date | null;

  // Lifecycle
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;
}
