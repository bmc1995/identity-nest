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
import { User } from './user.entity';
import { ClientApplication } from './clientApplication.entity';
import { AccessToken } from './accessToken.entity';
import { RefreshToken } from './refreshToken.entity';

@Entity('grants')
@Unique('grants_unique_user_client', ['user', 'client'])
export class Grant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (u) => u.grants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user!: User;

  @ManyToOne(() => ClientApplication, (c) => c.grantTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  @Index()
  client!: ClientApplication;

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
