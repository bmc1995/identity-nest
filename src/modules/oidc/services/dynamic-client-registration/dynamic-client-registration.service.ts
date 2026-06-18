import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ClientService } from '../../../client/client.service';
import {
  ClientType,
  RegisterClientDto,
} from '../../../client/dto/register-client.dto';
import { ClientRegistrationDto } from '../../dto/client-registration.dto';

/** Client authentication methods this server can actually verify. */
const SUPPORTED_AUTH_METHODS = [
  'client_secret_basic',
  'client_secret_post',
  'none',
] as const;

/** Grant types the token endpoint actually implements. */
const SUPPORTED_GRANT_TYPES = ['authorization_code', 'refresh_token'] as const;

/** Response types the authorize endpoint actually implements. */
const SUPPORTED_RESPONSE_TYPES = ['code'] as const;

/**
 * Successful RFC 7591 registration response. `client_secret` and
 * `client_secret_expires_at` are present only for confidential clients.
 */
export interface ClientRegistrationResponse {
  client_id: string;
  client_secret?: string;
  client_id_issued_at: number;
  client_secret_expires_at?: number;
  redirect_uris: string[];
  token_endpoint_auth_method: string;
  grant_types: string[];
  response_types: string[];
  client_name: string;
  scope?: string;
}

/**
 * OAuth 2.0 Dynamic Client Registration (RFC 7591).
 *
 * Translates the RFC's snake_case client metadata into the internal client
 * model and delegates persistence, secret minting, and redirect-URI validation
 * to {@link ClientService} so dynamic and admin registration share one code
 * path. Metadata referencing capabilities this server does not implement
 * (e.g. the client_credentials grant or JWT client assertions) is rejected
 * with `invalid_client_metadata` rather than silently downgraded.
 */
@Injectable()
export class DynamicClientRegistrationService {
  private readonly logger = new Logger(DynamicClientRegistrationService.name);

  constructor(private readonly clientService: ClientService) {}

  async register(
    dto: ClientRegistrationDto,
  ): Promise<ClientRegistrationResponse> {
    const authMethod = dto.token_endpoint_auth_method ?? 'client_secret_basic';
    const grantTypes = dto.grant_types ?? ['authorization_code'];
    const responseTypes = dto.response_types ?? ['code'];

    this.assertSupported(
      authMethod,
      SUPPORTED_AUTH_METHODS,
      'token_endpoint_auth_method',
    );
    for (const grant of grantTypes) {
      this.assertSupported(grant, SUPPORTED_GRANT_TYPES, 'grant_types');
    }
    for (const responseType of responseTypes) {
      this.assertSupported(
        responseType,
        SUPPORTED_RESPONSE_TYPES,
        'response_types',
      );
    }

    // The only interactive grant we support is authorization_code, which needs
    // response_type "code" and at least one redirect URI.
    if (grantTypes.includes('authorization_code') && !responseTypes.includes('code')) {
      throw this.invalidMetadata(
        'response_types must include "code" for the authorization_code grant',
      );
    }
    if (!dto.redirect_uris?.length) {
      throw new BadRequestException({
        error: 'invalid_redirect_uri',
        error_description: 'At least one redirect_uri is required',
      });
    }

    const isPublic = authMethod === 'none';
    const type: ClientType = isPublic
      ? dto.application_type === 'native'
        ? 'native'
        : 'spa'
      : 'web';

    const params: RegisterClientDto = {
      name: dto.client_name?.trim() || this.deriveName(dto.redirect_uris[0]),
      type,
      redirectUris: dto.redirect_uris,
      grantTypes,
      responseTypes,
      tokenEndpointAuthMethod:
        authMethod as RegisterClientDto['tokenEndpointAuthMethod'],
      // requirePkce is left to ClientService, which forces it on for public clients.
    };

    const created = await this.clientService.register(params);
    this.logger.log(
      `Dynamically registered client ${created.clientId} (type=${type})`,
    );

    const response: ClientRegistrationResponse = {
      client_id: created.clientId,
      client_id_issued_at: Math.floor(created.createdAt.getTime() / 1000),
      redirect_uris: created.redirectUris,
      token_endpoint_auth_method: created.tokenEndpointAuthMethod,
      grant_types: created.grantTypes,
      response_types: created.responseTypes,
      client_name: created.name,
      ...(dto.scope ? { scope: dto.scope } : {}),
    };

    if (created.clientSecret) {
      response.client_secret = created.clientSecret;
      response.client_secret_expires_at = 0; // 0 = does not expire (RFC 7591 §3.2.1)
    }

    return response;
  }

  /** Fall back to the redirect URI's host when no client_name is supplied. */
  private deriveName(redirectUri: string): string {
    try {
      return new URL(redirectUri).host || 'Dynamically Registered Client';
    } catch {
      return 'Dynamically Registered Client';
    }
  }

  private assertSupported(
    value: string,
    supported: readonly string[],
    field: string,
  ): void {
    if (!supported.includes(value)) {
      throw this.invalidMetadata(
        `Unsupported ${field} value "${value}". Supported: ${supported.join(', ')}`,
      );
    }
  }

  private invalidMetadata(description: string): BadRequestException {
    return new BadRequestException({
      error: 'invalid_client_metadata',
      error_description: description,
    });
  }
}
