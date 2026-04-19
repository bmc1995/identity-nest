import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ClientApplication } from '../../../common/entities/clientApplication.entity';
import { Tenant } from '../../../common/entities/tenant.entity';

/**
 * Projection of {@link ClientApplication} returned by {@link ClientStore}.
 * Excludes tenant and branding fields not needed by the current consumers.
 */
export interface StoredClient {
  id: string;
  clientId: string;
  clientSecretHash: string | null;
  name: string;
  description: string | null;
  type: string;
  redirectUris: string[];
  grantTypes: string[];
  responseTypes: string[];
  tokenEndpointAuthMethod: string;
  requirePkce: boolean;
  accessTokenLifetime: number;
  refreshTokenLifetime: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data-access facade for {@link ClientApplication} records.
 *
 * Hashes client secrets with bcrypt on write and never exposes plaintext
 * secrets; callers that need the plaintext value (registration, rotation)
 * must capture it at the call site before persistence.
 */
@Injectable()
export class ClientStore {
  constructor(
    @InjectRepository(ClientApplication)
    private readonly repo: Repository<ClientApplication>,
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  /**
   * Persist a new client application. When `clientSecret` is provided it is
   * hashed with bcrypt and stored; the caller is responsible for returning
   * the plaintext to the end user before it is discarded.
   */
  async create(params: {
    clientId: string;
    clientSecret?: string;
    name: string;
    description?: string | null;
    type: string;
    redirectUris: string[];
    grantTypes: string[];
    responseTypes: string[];
    tokenEndpointAuthMethod: string;
    requirePkce?: boolean;
    tenant?: Tenant;
  }): Promise<StoredClient> {
    const clientSecretHash = params.clientSecret
      ? await bcrypt.hash(params.clientSecret, 12)
      : null;

    const tenant = params.tenant ?? await this.ensureDefaultTenant();

    const client = this.repo.create({
      clientId: params.clientId,
      clientSecretHash,
      name: params.name,
      description: params.description ?? null,
      type: params.type,
      redirectUris: params.redirectUris,
      grantTypes: params.grantTypes,
      responseTypes: params.responseTypes,
      tokenEndpointAuthMethod: params.tokenEndpointAuthMethod,
      requirePkce: params.requirePkce ?? false,
      tenant,
    });

    const saved = await this.repo.save(client);
    return this.toStored(saved);
  }

  /** Look up a client by its primary-key UUID. */
  async findById(id: string): Promise<StoredClient | undefined> {
    const client = await this.repo.findOneBy({ id });
    return client ? this.toStored(client) : undefined;
  }

  /** Look up a client by its public `client_id` string. */
  async findByClientId(clientId: string): Promise<StoredClient | undefined> {
    const client = await this.repo.findOneBy({ clientId });
    return client ? this.toStored(client) : undefined;
  }

  /** Return every client regardless of status, ordered by creation time. */
  async findAll(): Promise<StoredClient[]> {
    const clients = await this.repo.find({ order: { createdAt: 'DESC' } });
    return clients.map((c) => this.toStored(c));
  }

  /** Return clients currently flagged `active`. */
  async findAllActive(): Promise<StoredClient[]> {
    const clients = await this.repo.find({ where: { status: 'active' } });
    return clients.map((c) => this.toStored(c));
  }

  /**
   * Replace a client's stored secret with the bcrypt hash of `newSecret`.
   * @throws NotFoundException when the client id does not exist.
   */
  async updateSecret(id: string, newSecret: string): Promise<StoredClient> {
    const client = await this.repo.findOneBy({ id });
    if (!client) {
      throw new NotFoundException({ error: 'client_not_found' });
    }
    client.clientSecretHash = await bcrypt.hash(newSecret, 12);
    client.clientSecretExpiry = null;
    const saved = await this.repo.save(client);
    return this.toStored(saved);
  }

  /**
   * Compare a plaintext `secret` against the client's stored hash.
   * Returns false when the client has no secret (public client).
   */
  async validateSecret(
    client: StoredClient,
    secret: string,
  ): Promise<boolean> {
    if (!client.clientSecretHash) return false;
    return bcrypt.compare(secret, client.clientSecretHash);
  }

  /**
   * Lazily create the `default` tenant used for single-tenant deployments.
   * Removed once multi-tenant onboarding lands.
   */
  private async ensureDefaultTenant(): Promise<Tenant> {
    let tenant = await this.tenantRepo.findOneBy({ name: 'default' });
    if (!tenant) {
      tenant = this.tenantRepo.create({
        name: 'default',
        region: 'local',
        encryption_key:
          process.env.TENANT_ENCRYPTION_KEY ?? 'dev-key-change-in-production',
        settings: {},
      });
      tenant = await this.tenantRepo.save(tenant);
    }
    return tenant;
  }

  /** Map a TypeORM entity to the public {@link StoredClient} projection. */
  private toStored(entity: ClientApplication): StoredClient {
    return {
      id: entity.id,
      clientId: entity.clientId,
      clientSecretHash: entity.clientSecretHash,
      name: entity.name,
      description: entity.description,
      type: entity.type,
      redirectUris: entity.redirectUris,
      grantTypes: entity.grantTypes,
      responseTypes: entity.responseTypes,
      tokenEndpointAuthMethod: entity.tokenEndpointAuthMethod,
      requirePkce: entity.requirePkce,
      accessTokenLifetime: entity.accessTokenLifetime,
      refreshTokenLifetime: entity.refreshTokenLifetime,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
