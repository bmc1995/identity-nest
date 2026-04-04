// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   Index,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { ClientAuthMethod } from '../enums/clientAuthMethod.enum.js';
// import { Grant } from './grant.entity';
// import { AccessToken } from './accessToken.entity.js';
// import { RefreshToken } from './refreshToken.entity.js';

// @Entity('clients')
// export class Client {
//   @PrimaryGeneratedColumn('uuid')
//   id!: string;

//   @Index()
//   @Column({ type: 'text', unique: true })
//   clientId!: string;

//   @Column({ type: 'text', nullable: true })
//   clientSecretHash!: string | null;

//   @Column({
//     type: 'enum',
//     enum: ClientAuthMethod,
//     default: ClientAuthMethod.CLIENT_SECRET_BASIC,
//   })
//   tokenEndpointAuthMethod!: ClientAuthMethod;

//   @Column({ type: 'text', array: true })
//   redirectUris!: string[];

//   @Column({ type: 'text', array: true, default: () => `'{}'` })
//   postLogoutRedirectUris!: string[];

//   @Column({ type: 'text', default: 'web' })
//   applicationType!: string; // web/native/spa

//   @Column({ type: 'text', nullable: true })
//   sectorIdentifierUri!: string | null;

//   @Column({ type: 'text', nullable: true })
//   jwksUri!: string | null;

//   @Column({ type: 'jsonb', nullable: true })
//   jwks!: any | null;

//   @Column({
//     type: 'text',
//     array: true,
//     default: () => `ARRAY['authorization_code','refresh_token']::text[]`,
//   })
//   grantTypes!: string[];

//   @Column({ type: 'text', array: true, default: () => `ARRAY['code']::text[]` })
//   responseTypes!: string[];

//   @Column({
//     type: 'text',
//     array: true,
//     default: () => `ARRAY['openid','profile','email','offline_access']::text[]`,
//   })
//   defaultScopes!: string[];

//   @Column({ type: 'text', nullable: true })
//   name!: string | null;

//   @Column({ type: 'text', nullable: true })
//   logoUri!: string | null;

//   @Column({ type: 'text', nullable: true })
//   tosUri!: string | null;

//   @Column({ type: 'text', nullable: true })
//   policyUri!: string | null;

//   @CreateDateColumn({ type: 'timestamptz' })
//   createdAt!: Date;

//   @UpdateDateColumn({ type: 'timestamptz' })
//   updatedAt!: Date;

//   @OneToMany(() => Grant, (g) => g.client)
//   grants!: Grant[];

//   @OneToMany(() => AccessToken, (t) => t.client)
//   accessTokens!: AccessToken[];

//   @OneToMany(() => RefreshToken, (t) => t.client)
//   refreshTokens!: RefreshToken[];
// }
