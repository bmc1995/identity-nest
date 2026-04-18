import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { ClientApplication } from './clientApplication.entity';

@Entity('consent_records')
@Unique('consent_per_app', ['user', 'clientApplication'])
@Index('idx_user_consents', ['tenant', 'user'])
@Index('idx_app_consents', ['clientApplication', 'revokedAt'])
export class ConsentRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  @Index()
  tenant!: Tenant;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user!: User;

  @ManyToOne(() => ClientApplication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  @Index()
  clientApplication!: ClientApplication;

  // Consent details
  @Column({ type: 'text' })
  scope!: string; // space-separated scopes

  @Column({
    type: 'varchar',
    length: 50,
    default: 'explicit',
    comment: 'explicit, implicit, delegated',
  })
  consentType!: string;

  // Tracking
  @Column({ type: 'timestamptz' })
  givenAt!: Date;

  @Column({ type: 'inet', nullable: true })
  givenByIp!: string | null;

  @Column({ type: 'text', nullable: true })
  givenByUserAgent!: string | null;

  // Revocation
  @Column({ type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  revokedReason!: string | null;

  // Audit
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
