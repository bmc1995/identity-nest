import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ClientApplication } from '../../../common/entities/clientApplication.entity';
import { Tenant } from '../../../common/entities/tenant.entity';

export interface StoredClient {
  id: string;
  clientId: string;
  clientSecretHash: string | null;
  name: string;
  type: string;
  redirectUris: string[];
  grantTypes: string[];
  responseTypes: string[];
  tokenEndpointAuthMethod: string;
  requirePkce: boolean;
  accessTokenLifetime: number;
  refreshTokenLifetime: number;
  status: string;
}

@Injectable()
export class ClientStore {
  constructor(
    @InjectRepository(ClientApplication)
    private readonly repo: Repository<ClientApplication>,
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async create(params: {
    clientId: string;
    clientSecret?: string;
    name: string;
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

  async findByClientId(clientId: string): Promise<StoredClient | undefined> {
    const client = await this.repo.findOneBy({ clientId });
    return client ? this.toStored(client) : undefined;
  }

  async findAllActive(): Promise<StoredClient[]> {
    const clients = await this.repo.find({ where: { status: 'active' } });
    return clients.map((c) => this.toStored(c));
  }

  async validateSecret(
    client: StoredClient,
    secret: string,
  ): Promise<boolean> {
    if (!client.clientSecretHash) return false;
    return bcrypt.compare(secret, client.clientSecretHash);
  }

  private async ensureDefaultTenant(): Promise<Tenant> {
    let tenant = await this.tenantRepo.findOneBy({ name: 'default' });
    if (!tenant) {
      tenant = this.tenantRepo.create({
        name: 'default',
        region: 'local',
        encryption_key: 'dev-key-change-in-production',
        settings: {},
      });
      tenant = await this.tenantRepo.save(tenant);
    }
    return tenant;
  }

  private toStored(entity: ClientApplication): StoredClient {
    return {
      id: entity.id,
      clientId: entity.clientId,
      clientSecretHash: entity.clientSecretHash,
      name: entity.name,
      type: entity.type,
      redirectUris: entity.redirectUris,
      grantTypes: entity.grantTypes,
      responseTypes: entity.responseTypes,
      tokenEndpointAuthMethod: entity.tokenEndpointAuthMethod,
      requirePkce: entity.requirePkce,
      accessTokenLifetime: entity.accessTokenLifetime,
      refreshTokenLifetime: entity.refreshTokenLifetime,
      status: entity.status,
    };
  }
}
