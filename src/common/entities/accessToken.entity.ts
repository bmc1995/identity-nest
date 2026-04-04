import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ClientApplication } from './clientApplication.entity.js';
import { Account } from './account.entity.js';
import { Grant } from './grant.entity.js';

@Entity('access_tokens')
export class AccessToken {
  @PrimaryColumn({ type: 'text' })
  value!: string; // opaque or JWT

  @Index()
  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  jti!: string;

  @ManyToOne(() => ClientApplication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  @Index()
  client!: ClientApplication;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  @Index()
  account!: Account;

  @ManyToOne(() => Grant, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'grant_id' })
  grant!: Grant | null;

  @Column({ type: 'text' })
  scope!: string;

  @Column({ type: 'text', nullable: true })
  audience!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Index()
  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;
}
