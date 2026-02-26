import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity.js';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  @Index()
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;

  // Event info
  @Column({ type: 'varchar', length: 100 })
  eventType!: string;
  // user.created, user.deleted, auth.success, policy.updated, etc.

  // Actor (who did it)
  @Column({ type: 'uuid', nullable: true })
  actorId!: string | null; // user or service account

  @Column({ type: 'varchar', length: 50 })
  actorType!: string; // user, service, system, admin

  @Column({ type: 'varchar', length: 255, nullable: true })
  actorName!: string | null;

  // Resource (what was affected)
  @Column({ type: 'varchar', length: 255, nullable: true })
  resourceId!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  resourceType!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resourceName!: string | null;

  // Action details
  @Column({ type: 'varchar', length: 100, nullable: true })
  action!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  changes!: Record<string, any> | null; // before/after for updates

  // Context
  @Column({ type: 'inet', nullable: true })
  ipAddress!: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  requestId!: string | null; // correlation ID

  // Outcome
  @Column({ type: 'varchar', length: 50, default: 'success' })
  status!: string; // success, failure

  @Column({ type: 'text', nullable: true })
  errorMessage!: string | null; // if status = failure

  // Metadata
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  @Column({ type: 'timestamptz' })
  retentionUntil!: Date;
}
