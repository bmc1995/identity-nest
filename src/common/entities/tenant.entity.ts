import {
  Entity,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('tenant')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'citext', unique: true }) 
  name!: string;

// Data residency & encryption 
  @Column({ type: 'text', default: 'local' })
  region: string;
  
  @Column({ type: 'text' })
  encryption_key!: string;

// Tenant branding customization
  @Column({ type: 'jsonb', nullable: true }) //logo_url, primary_color, custom_domain
  branding!: Record<string, any> | null;

  // Tenant-specific configuration
  @Column({ type: 'jsonb', default: {} }) //mfa_required, session_timeout, password_policy
  settings!: Record<string, any>;


  /*
  -- Contact & billing --
  admin_email VARCHAR(255),
  plan_id UUID,
  billing_email VARCHAR(255), 
  
  -- Metadata --
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ,
  
  -- Indexes --
  CONSTRAINT active_tenants CHECK (deleted_at IS NULL),
  INDEX idx_status (status),
  INDEX idx_region (region),
  UNIQUE INDEX idx_encryption_key_id (encryption_key_id)
  */

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: Date | null;

}
