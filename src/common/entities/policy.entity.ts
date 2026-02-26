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

@Entity('policies')
@Unique('policy_name_unique', ['tenant', 'name'])
@Index('idx_tenant_policies', ['tenant', 'enabled', 'priority'])
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  @Index()
  tenant!: Tenant;

  // Policy info
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  // Evaluation rules
  @Column({ type: 'jsonb' })
  conditions!: Record<string, any>; // complex JSON structure

  @Column({ type: 'jsonb' })
  actions!: Record<string, any>; // what to do when conditions match

  // Example conditions:
  // {
  //   "location": {"country": ["CN", "RU"]},
  //   "device_trust": "untrusted",
  //   "network": {"type": "suspicious"}
  // }
  // Example actions:
  // {
  //   "require_mfa": true,
  //   "require_step_up": true,
  //   "deny_access": false,
  //   "log_event": true
  // }

  // Applicability
  @Column({ type: 'jsonb', nullable: true })
  appliesToUsers!: Record<string, any> | null; // users, groups, apps

  @Column({ type: 'jsonb', nullable: true })
  appliesToGroups!: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  appliesToApps!: Record<string, any> | null;

  @Column({ type: 'integer', default: 100 })
  priority!: number; // lower = higher priority

  // Status
  @Column({ type: 'boolean', default: true })
  enabled!: boolean;

  // Metadata
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
