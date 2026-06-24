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
  'client_secret_jwt',
  'private_key_jwt',
  'none',
] as const;

/** Grant types the server implements (token-endpoint grants + implicit). */
const SUPPORTED_GRANT_TYPES = [
  'authorization_code',
  'refresh_token',
  'implicit',
] as const;

/**
 * Response types the authorize endpoint implements: code, implicit, hybrid,
 * and none.
 */
const SUPPORTED_RESPONSE_TYPES = [
  'code',
  'id_token',
  'id_token token',
  'code id_token',
  'code token',
  'code id_token token',
  'none',
] as const;

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
  jwks_uri?: string;
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
    // Treat an empty array like an omitted field so the RFC 7591 defaults apply
    // (a `?? []` would otherwise persist a client with no usable grants).
    const grantTypes = dto.grant_types?.length
      ? dto.grant_types
      : ['authorization_code'];
    const rawResponseTypes = dto.response_types?.length
      ? dto.response_types
      : ['code'];

    this.assertSupported(
      authMethod,
      SUPPORTED_AUTH_METHODS,
      'token_endpoint_auth_method',
    );
    for (const grant of grantTypes) {
      this.assertSupported(grant, SUPPORTED_GRANT_TYPES, 'grant_types');
    }
    // Normalize each response_type to a canonical token order before checking
    // support — RFC 6749 treats the space-delimited set as order-insensitive.
    const responseTypes = rawResponseTypes.map((rt) =>
      this.normalizeResponseType(rt),
    );
    for (const responseType of responseTypes) {
      this.assertSupported(
        responseType,
        SUPPORTED_RESPONSE_TYPES,
        'response_types',
      );
    }

    // Flows that return a code (authorization_code / hybrid) need response_type
    // to include "code"; conversely "code" requires the authorization_code grant.
    const wantsCode = responseTypes.some((rt) => rt.split(' ').includes('code'));
    if (grantTypes.includes('authorization_code') && !wantsCode) {
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
    // jwks and jwks_uri are mutually exclusive (RFC 7591 §2); private_key_jwt
    // presence/consistency is enforced downstream by ClientService.
    if (dto.jwks && dto.jwks_uri) {
      throw this.invalidMetadata('Provide only one of jwks or jwks_uri');
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
      ...(dto.jwks_uri ? { jwksUri: dto.jwks_uri } : {}),
      ...(dto.jwks ? { jwks: dto.jwks } : {}),
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
      ...(dto.jwks_uri ? { jwks_uri: dto.jwks_uri } : {}),
    };

    if (created.clientSecret) {
      response.client_secret = created.clientSecret;
      response.client_secret_expires_at = 0; // 0 = does not expire (RFC 7591 §3.2.1)
    }

    return response;
  }

  /**
   * Canonicalize a space-delimited response_type by sorting its tokens, so
   * "token id_token" and "id_token token" compare equal against the supported
   * set (RFC 6749 §3.1.1 — the set is order-insensitive).
   */
  private normalizeResponseType(responseType: string): string {
    return responseType.trim().split(/\s+/).sort().join(' ');
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
