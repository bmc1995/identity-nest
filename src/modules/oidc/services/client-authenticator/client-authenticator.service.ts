import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { ClientStore, StoredClient } from '../../../store/stores/client.store';

export interface ClientCredentialsBody {
  client_id?: string;
  client_secret?: string;
}

@Injectable()
export class ClientAuthenticatorService {
  private readonly logger = new Logger(ClientAuthenticatorService.name);

  constructor(private readonly clientStore: ClientStore) {}

  /**
   * Resolve and verify client credentials from the request, accepting either
   * `client_secret_basic` (Authorization header) or `client_secret_post`
   * (form body). Returns the active client on success, `null` otherwise.
   */
  async authenticate(
    req: Request,
    body: ClientCredentialsBody,
  ): Promise<StoredClient | null> {
    let clientId: string | undefined;
    let clientSecret: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Basic ')) {
      const decoded = Buffer.from(authHeader.slice(6), 'base64').toString();
      const colonIndex = decoded.indexOf(':');
      if (colonIndex !== -1) {
        clientId = decodeURIComponent(decoded.substring(0, colonIndex));
        clientSecret = decodeURIComponent(decoded.substring(colonIndex + 1));
      }
    }

    if (!clientId) {
      clientId = body.client_id;
      clientSecret = body.client_secret;
    }

    if (!clientId) {
      this.logger.warn('No client_id provided');
      return null;
    }

    const client = await this.clientStore.findByClientId(clientId);
    if (!client || client.status !== 'active') {
      this.logger.warn(`Unknown or inactive client: ${clientId}`);
      return null;
    }

    if (!client.clientSecretHash) return client;

    if (!clientSecret) {
      this.logger.warn(`Confidential client ${clientId} did not provide a secret`);
      return null;
    }
    const valid = await this.clientStore.validateSecret(client, clientSecret);
    if (!valid) {
      this.logger.warn(`Invalid secret for client ${clientId}`);
    }
    return valid ? client : null;
  }
}
