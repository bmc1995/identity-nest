import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Account } from './account.entity';
import { Grant } from './grant.entity';
import { PkceMethod } from '../enums/PKCEMethod.enum';

@Entity('authorization_codes')
export class AuthorizationCode {
  @PrimaryColumn({ type: 'text' })
  code!: string; // opaque

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  @Index()
  client!: Client;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  @Index()
  account!: Account;

  @ManyToOne(() => Grant, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'grant_id' })
  grant!: Grant | null;

  @Column({ type: 'text' })
  redirectUri!: string;

  @Column({ type: 'text' })
  scope!: string;

  @Column({ type: 'text', nullable: true })
  nonce!: string | null;

  @Column({ type: 'text' })
  codeChallenge!: string;

  @Column({ type: 'enum', enum: PkceMethod, default: PkceMethod.S256 })
  codeChallengeMethod!: PkceMethod;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  consumedAt!: Date | null;
}
