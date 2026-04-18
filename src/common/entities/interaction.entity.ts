import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('interactions')
export class Interaction {
  @PrimaryColumn({ type: 'text' })
  uid!: string;

  @Column({ type: 'text' })
  prompt!: string; // 'login'|'consent'|...

  @Column({ type: 'jsonb' })
  params!: any;

  @Column({ type: 'text', nullable: true })
  returnTo!: string | null;

  @Column({ type: 'uuid', nullable: true })
  accountId!: string | null;

  @Column({ type: 'text', nullable: true })
  sessionHint!: string | null;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;

  @Index()
  @Column({ type: 'timestamptz' })
  expiresAt!: Date;
}
