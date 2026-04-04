import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

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
export class ClientStore implements OnModuleInit {
  private clients = new Map<string, StoredClient>();
  private clientIdIndex = new Map<string, string>(); // clientId → id

  async onModuleInit() {
    await this.create({
      clientId: 'test-client',
      clientSecret: 'test-secret',
      name: 'Test Application',
      type: 'web',
      redirectUris: ['http://localhost:3000/callback'],
      grantTypes: ['authorization_code', 'refresh_token'],
      responseTypes: ['code'],
      tokenEndpointAuthMethod: 'client_secret_basic',
      requirePkce: true,
    });
  }

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
  }): Promise<StoredClient> {
    const id = randomUUID();
    const clientSecretHash = params.clientSecret
      ? await bcrypt.hash(params.clientSecret, 12)
      : null;

    const client: StoredClient = {
      id,
      clientId: params.clientId,
      clientSecretHash,
      name: params.name,
      type: params.type,
      redirectUris: params.redirectUris,
      grantTypes: params.grantTypes,
      responseTypes: params.responseTypes,
      tokenEndpointAuthMethod: params.tokenEndpointAuthMethod,
      requirePkce: params.requirePkce ?? false,
      accessTokenLifetime: 3600,
      refreshTokenLifetime: 2592000,
      status: 'active',
    };

    this.clients.set(id, client);
    this.clientIdIndex.set(params.clientId, id);
    return client;
  }

  findByClientId(clientId: string): StoredClient | undefined {
    const id = this.clientIdIndex.get(clientId);
    return id ? this.clients.get(id) : undefined;
  }

  async validateSecret(
    client: StoredClient,
    secret: string,
  ): Promise<boolean> {
    if (!client.clientSecretHash) return false;
    return bcrypt.compare(secret, client.clientSecretHash);
  }
}
