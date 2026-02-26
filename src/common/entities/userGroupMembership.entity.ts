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
import { Group } from './group.entity';

@Entity('user_group_membership')
@Unique('membership_unique', ['user', 'group'])
@Index('idx_user_groups', ['tenant', 'user'])
@Index('idx_group_members', ['group', 'status'])
export class UserGroupMembership {
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

  @ManyToOne(() => Group, (group) => group.userMemberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  @Index()
  group!: Group;

  // Role within group (optional)
  @Column({ type: 'varchar', length: 50, nullable: true })
  role!: string | null; // admin, member, viewer

  // Lifecycle
  @CreateDateColumn({ type: 'timestamptz' })
  assignedAt!: Date;

  @Column({ type: 'uuid', nullable: true })
  assignedBy!: string | null; // User ID who assigned

  // Status
  @Column({ type: 'varchar', length: 50, default: 'active' })
  status!: string;

  @Column({ type: 'timestamptz', nullable: true })
  removedAt!: Date | null;
}
