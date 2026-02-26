import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Grant } from './grant.entity.js';
import { AccessToken } from './accessToken.entity.js';
import { RefreshToken } from './refreshToken.entity.js';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'citext', unique: true })
  username!: string;

  @Index()
  @Column({ type: 'citext', nullable: true, unique: true })
  email!: string | null;

  @Column({ type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({ type: 'text', nullable: true })
  passwordHash!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => Grant, (g) => g.account)
  grants!: Grant[];

  @OneToMany(() => AccessToken, (t) => t.account)
  accessTokens!: AccessToken[];

  @OneToMany(() => RefreshToken, (t) => t.account)
  refreshTokens!: RefreshToken[];
}
