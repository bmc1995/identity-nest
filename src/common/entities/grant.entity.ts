import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Client } from './client.entity';
import { AccessToken } from './accessToken.entity.js';
import { RefreshToken } from './refreshToken.entity.js';

@Entity('grants')
@Unique('grants_unique_account_client', ['account', 'client'])
export class Grant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Account, (a) => a.grants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  @Index()
  account!: Account;

  @ManyToOne(() => Client, (c) => c.grants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  @Index()
  client!: Client;

  @Column({ type: 'text' })
  scope!: string; // space-delimited

  @Column({ type: 'jsonb', nullable: true })
  claims!: any | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;

  @OneToMany(() => AccessToken, (t) => t.grant)
  accessTokens!: AccessToken[];

  @OneToMany(() => RefreshToken, (t) => t.grant)
  refreshTokens!: RefreshToken[];
}
