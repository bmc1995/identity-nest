import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { ClientStore, StoredClient } from '../store/stores/client.store';
import { RegisterClientDto } from './dto/register-client.dto';

/**
 * Public view of a registered client returned to admin callers.
 *
 * Excludes the stored secret hash so it never leaves the server boundary.
 */
export interface ClientView {
  id: string;
  clientId: string;
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
  hasSecret: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Response shape for endpoints that mint a new client secret. The plaintext
 * `clientSecret` is returned exactly once and is not retrievable afterwards.
 */
export interface ClientWithSecret extends ClientView {
  clientSecret: string | null;
}

/**
 * Business logic for the admin client-registration API.
 *
 * Responsibilities:
 *   - Generate opaque `client_id` / `client_secret` values.
 *   - Apply per-type secure defaults (grants, response types, auth method, PKCE).
 *   - Validate redirect URIs according to OAuth 2.1 guidance.
 *   - Delegate persistence to {@link ClientStore}.
 */
@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(private readonly clientStore: ClientStore) {}

  /**
   * Register a new client application.
   *
   * Applies type-based defaults, validates redirect URIs, mints a new
   * `client_id` and — for confidential clients — a `client_secret`. The
   * plaintext secret is returned in the response and is not recoverable.
   *
   * @throws BadRequestException on invalid redirect URIs or inconsistent
   *   PKCE / auth-method combinations.
   */
  async register(dto: RegisterClientDto): Promise<ClientWithSecret> {
    const tokenEndpointAuthMethod =
      dto.tokenEndpointAuthMethod ?? this.defaultAuthMethod(dto.type);
    const isPublic = tokenEndpointAuthMethod === 'none';

    if (isPublic && dto.type === 'service') {
      throw new BadRequestException({
        error: 'invalid_client_metadata',
        error_description: 'Service clients must be confidential',
      });
    }

    const requirePkce = isPublic ? true : (dto.requirePkce ?? true);
    const grantTypes = dto.grantTypes ?? this.defaultGrantTypes(dto.type);
    const responseTypes = dto.responseTypes ?? ['code'];

    this.validateRedirectUris(dto.redirectUris, dto.type);

    const clientId = this.generateClientId();
    const clientSecret = isPublic ? undefined : this.generateClientSecret();

    const stored = await this.clientStore.create({
      clientId,
      clientSecret,
      name: dto.name,
      description: dto.description ?? null,
      type: dto.type,
      redirectUris: dto.redirectUris,
      grantTypes,
      responseTypes,
      tokenEndpointAuthMethod,
      requirePkce,
    });

    this.logger.log(
      `Registered client "${stored.name}" (${stored.clientId}, type=${stored.type})`,
    );

    return { ...this.toView(stored), clientSecret: clientSecret ?? null };
  }

  /** Return every client application as its admin-facing view. */
  async list(): Promise<ClientView[]> {
    const clients = await this.clientStore.findAll();
    return clients.map((c) => this.toView(c));
  }

  /**
   * Return a single client by its primary-key UUID.
   * @throws NotFoundException when no matching client exists.
   */
  async getById(id: string): Promise<ClientView> {
    const client = await this.clientStore.findById(id);
    if (!client) {
      throw new NotFoundException({ error: 'client_not_found' });
    }
    return this.toView(client);
  }

  /**
   * Generate a fresh client secret, persist its hash, and return the plaintext
   * value to the caller. The previous secret is invalidated immediately.
   *
   * @throws BadRequestException for public clients (no secret to rotate).
   * @throws NotFoundException when no matching client exists.
   */
  async rotateSecret(id: string): Promise<ClientWithSecret> {
    const client = await this.clientStore.findById(id);
    if (!client) {
      throw new NotFoundException({ error: 'client_not_found' });
    }
    if (client.tokenEndpointAuthMethod === 'none') {
      throw new BadRequestException({
        error: 'invalid_client_metadata',
        error_description: 'Public clients do not have a secret to rotate',
      });
    }

    const newSecret = this.generateClientSecret();
    const updated = await this.clientStore.updateSecret(id, newSecret);
    this.logger.log(`Rotated secret for client ${updated.clientId}`);
    return { ...this.toView(updated), clientSecret: newSecret };
  }

  /**
   * Validate redirect URIs:
   *   - must parse as absolute URIs,
   *   - must not include a fragment,
   *   - web/SPA clients must use HTTPS unless host is `localhost`/`127.0.0.1`,
   *   - native clients may use custom schemes or loopback.
   *
   * @throws BadRequestException describing the first invalid URI encountered.
   */
  private validateRedirectUris(uris: string[], type: string): void {
    for (const raw of uris) {
      let url: URL;
      try {
        url = new URL(raw);
      } catch {
        throw new BadRequestException({
          error: 'invalid_redirect_uri',
          error_description: `Not a valid URI: ${raw}`,
        });
      }

      if (url.hash) {
        throw new BadRequestException({
          error: 'invalid_redirect_uri',
          error_description: `Redirect URIs must not contain a fragment: ${raw}`,
        });
      }

      const isLoopback =
        url.hostname === 'localhost' ||
        url.hostname === '127.0.0.1' ||
        url.hostname === '[::1]';

      if (type === 'native') {
        // Native apps use either custom schemes or loopback HTTP.
        if (url.protocol === 'http:' && !isLoopback) {
          throw new BadRequestException({
            error: 'invalid_redirect_uri',
            error_description: `Native clients must use HTTPS, loopback, or a custom scheme: ${raw}`,
          });
        }
        continue;
      }

      if (url.protocol === 'http:' && !isLoopback) {
        throw new BadRequestException({
          error: 'invalid_redirect_uri',
          error_description: `Redirect URI must use HTTPS (loopback excepted): ${raw}`,
        });
      }
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        throw new BadRequestException({
          error: 'invalid_redirect_uri',
          error_description: `Unsupported scheme for ${type} client: ${raw}`,
        });
      }
    }
  }

  /** Default grant types applied when the caller omits `grantTypes`. */
  private defaultGrantTypes(type: string): string[] {
    if (type === 'service') return ['client_credentials'];
    return ['authorization_code', 'refresh_token'];
  }

  /** Default token-endpoint auth method applied when the caller omits it. */
  private defaultAuthMethod(type: string): string {
    if (type === 'spa' || type === 'native') return 'none';
    return 'client_secret_basic';
  }

  /** Generate a 32-hex-char opaque `client_id`. */
  private generateClientId(): string {
    return randomBytes(16).toString('hex');
  }

  /** Generate a 256-bit base64url-encoded `client_secret`. */
  private generateClientSecret(): string {
    return randomBytes(32).toString('base64url');
  }

  /** Project a {@link StoredClient} into the admin-facing {@link ClientView}. */
  private toView(stored: StoredClient): ClientView {
    return {
      id: stored.id,
      clientId: stored.clientId,
      name: stored.name,
      description: stored.description,
      type: stored.type,
      redirectUris: stored.redirectUris,
      grantTypes: stored.grantTypes,
      responseTypes: stored.responseTypes,
      tokenEndpointAuthMethod: stored.tokenEndpointAuthMethod,
      requirePkce: stored.requirePkce,
      accessTokenLifetime: stored.accessTokenLifetime,
      refreshTokenLifetime: stored.refreshTokenLifetime,
      status: stored.status,
      hasSecret: stored.clientSecretHash !== null,
      createdAt: stored.createdAt,
      updatedAt: stored.updatedAt,
    };
  }
}
