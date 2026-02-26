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
import { Organization } from './organization.entity';
import { UserGroupMembership } from './userGroupMembership.entity';

@Entity('groups')
@Unique('group_name_unique', ['organization', 'name'])
@Index('idx_org_groups', ['tenant', 'organization'])
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  @Index()
  tenant!: Tenant;

  @ManyToOne(() => Organization, (org) => org.groups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'org_id' })
  @Index()
  organization!: Organization;

  // Group info
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  // Dynamic group rule (optional)
  @Column({ type: 'boolean', default: false })
  isDynamic!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  dynamicRule!: Record<string, any> | null; // JSON rule expression

  // Example dynamic rule:
  // {
  //   "operator": "AND",
  //   "rules": [
  //     {"field": "department", "condition": "equals", "value": "engineering"},
  //     {"field": "status", "condition": "equals", "value": "active"}
  //   ]
  // }

  // Metadata
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  // Relations
  @OneToMany(
    () => UserGroupMembership,
    (membership) => membership.group,
    { cascade: ['soft-remove'] },
  )
  userMemberships!: UserGroupMembership[];
}
