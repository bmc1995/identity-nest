import {
  Column,
  CreateDateColumn,
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
import { Group } from './group.entity';

@Entity('organizations')
@Unique('org_name_unique', ['tenant', 'name'])
@Index('idx_tenant_orgs', ['tenant', 'status'])
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  @Index()
  tenant!: Tenant;

  // Hierarchical organization structure
  @ManyToOne(() => Organization, (org) => org.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  @Index()
  parent!: Organization | null;

  @OneToMany(() => Organization, (org) => org.parent)
  children!: Organization[];

  // Organization info
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  // Organization settings
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  // Status
  @Column({ type: 'varchar', length: 50, default: 'active' })
  status!: string; // active, suspended, deleted

  // Metadata
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Group, (group) => group.organization)
  groups!: Group[];
}
