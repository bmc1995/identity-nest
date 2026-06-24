import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('applications')
@Unique('app_client_id_unique', ['tenant', 'clientId'])
@Index('idx_tenant_apps', ['tenant', 'status'])
export class ClientApplication {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  @Index()
  tenant!: Tenant;

  // Application info
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'web, native, spa, service, saml_app',
  })
  type!: string;

  // OAuth/OIDC credentials
  @Column({ type: 'varchar', length: 255 })
  clientId!: string;

  // Client secret sealed with AES-256-GCM at rest (see ClientSecretCipher).
  // Reversible — not a one-way hash — because client_secret_jwt assertions
  // require the raw secret as the HMAC verification key.
  @Column({ type: 'varchar', length: 512, nullable: true })
  clientSecretEnc!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  clientSecretExpiry!: Date | null;

  // Per-client JWKS for private_key_jwt assertion verification. Either an
  // inline JWK Set (`jwks`) or a URL the server fetches it from (`jwksUri`);
  // RFC 7591 forbids supplying both.
  @Column({ type: 'text', nullable: true })
  jwksUri!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  jwks!: Record<string, unknown> | null;

  // Redirect URIs (CORS whitelist)
  @Column({ type: 'text', array: true })
  redirectUris!: string[]; // JSON array

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  logoutRedirectUris!: string[] | null;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  allowedOrigins!: string[] | null;

  // OIDC/OAuth settings
  @Column({
    type: 'text',
    array: true,
    default: () => `ARRAY['authorization_code', 'refresh_token']::text[]`,
  })
  grantTypes!: string[];

  @Column({
    type: 'text',
    array: true,
    default: () => `ARRAY['code', 'id_token', 'token']::text[]`,
  })
  responseTypes!: string[];

  @Column({
    type: 'varchar',
    length: 50,
    default: 'client_secret_basic',
  })
  tokenEndpointAuthMethod!: string;

  @Column({ type: 'varchar', length: 50, default: 'jwt' })
  accessTokenFormat!: string;

  @Column({ type: 'integer', default: 3600 })
  accessTokenLifetime!: number; // seconds

  @Column({ type: 'integer', default: 2592000 })
  refreshTokenLifetime!: number; // 30 days in seconds

  // Advanced settings
  @Column({ type: 'boolean', default: false })
  requirePkce!: boolean;

  @Column({ type: 'boolean', default: false })
  requireAuthTime!: boolean;

  @Column({ type: 'varchar', length: 20, default: 'RS256' })
  idTokenSignedResponseAlg!: string;

  @Column({ type: 'boolean', default: false })
  idTokenEncrypted!: boolean;

  // Branding
  @Column({ type: 'text', nullable: true })
  logoUri!: string | null;

  @Column({ type: 'text', nullable: true })
  policyUri!: string | null;

  @Column({ type: 'text', nullable: true })
  termsUri!: string | null;

  // Features
  @Column({
    type: 'text',
    array: true,
    default: () => `ARRAY['oidc']::text[]`,
  })
  enabledFeatures!: string[]; // ['oidc', 'saml', 'scim']

  @Column({ type: 'jsonb', nullable: true })
  samlConfig!: Record<string, any> | null; // ACS URL, entity ID, etc.

  // Status
  @Column({ type: 'varchar', length: 50, default: 'active' })
  status!: string;

  // Metadata
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
