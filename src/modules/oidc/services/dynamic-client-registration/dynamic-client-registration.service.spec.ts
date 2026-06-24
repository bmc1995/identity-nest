import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DynamicClientRegistrationService } from './dynamic-client-registration.service';
import {
  ClientService,
  ClientWithSecret,
} from '../../../client/client.service';

describe('DynamicClientRegistrationService', () => {
  let service: DynamicClientRegistrationService;
  let register: jest.Mock;

  const baseClient = (
    overrides: Partial<ClientWithSecret> = {},
  ): ClientWithSecret => ({
    id: 'uuid',
    clientId: 'abc123',
    name: 'app.example.com',
    description: null,
    type: 'web',
    redirectUris: ['https://app.example.com/cb'],
    grantTypes: ['authorization_code', 'refresh_token'],
    responseTypes: ['code'],
    tokenEndpointAuthMethod: 'client_secret_basic',
    requirePkce: true,
    accessTokenLifetime: 3600,
    refreshTokenLifetime: 2592000,
    status: 'active',
    hasSecret: true,
    clientSecret: 's3cret',
    createdAt: new Date('2026-06-18T00:00:00Z'),
    updatedAt: new Date('2026-06-18T00:00:00Z'),
    ...overrides,
  });

  beforeEach(async () => {
    register = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamicClientRegistrationService,
        { provide: ClientService, useValue: { register } },
      ],
    }).compile();
    service = module.get(DynamicClientRegistrationService);
  });

  it('registers a confidential client and returns its one-time secret', async () => {
    register.mockResolvedValue(baseClient());

    const res = await service.register({
      redirect_uris: ['https://app.example.com/cb'],
      client_name: 'My App',
    });

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'web',
        tokenEndpointAuthMethod: 'client_secret_basic',
        grantTypes: ['authorization_code'],
        responseTypes: ['code'],
      }),
    );
    expect(res.client_id).toBe('abc123');
    expect(res.client_secret).toBe('s3cret');
    expect(res.client_secret_expires_at).toBe(0);
    expect(res.client_id_issued_at).toBe(
      Math.floor(new Date('2026-06-18T00:00:00Z').getTime() / 1000),
    );
  });

  it('maps a public (none) client to type spa and omits the secret', async () => {
    register.mockResolvedValue(
      baseClient({
        type: 'spa',
        tokenEndpointAuthMethod: 'none',
        hasSecret: false,
        clientSecret: null,
      }),
    );

    const res = await service.register({
      redirect_uris: ['https://spa.example.com/cb'],
      token_endpoint_auth_method: 'none',
    });

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'spa', tokenEndpointAuthMethod: 'none' }),
    );
    expect(res.client_secret).toBeUndefined();
    expect(res.client_secret_expires_at).toBeUndefined();
  });

  it('maps a public native client to type native', async () => {
    register.mockResolvedValue(
      baseClient({ type: 'native', tokenEndpointAuthMethod: 'none', clientSecret: null }),
    );

    await service.register({
      redirect_uris: ['com.example.app:/cb'],
      token_endpoint_auth_method: 'none',
      application_type: 'native',
    });

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'native' }),
    );
  });

  it('rejects an unsupported grant type with invalid_client_metadata', async () => {
    await expect(
      service.register({
        redirect_uris: ['https://app.example.com/cb'],
        grant_types: ['client_credentials'],
      }),
    ).rejects.toThrow(BadRequestException);
    expect(register).not.toHaveBeenCalled();
  });

  it('rejects an unsupported auth method', async () => {
    await expect(
      service.register({
        redirect_uris: ['https://app.example.com/cb'],
        token_endpoint_auth_method: 'tls_client_auth',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('passes a private_key_jwt client and its jwks_uri through to ClientService', async () => {
    register.mockResolvedValue(
      baseClient({
        tokenEndpointAuthMethod: 'private_key_jwt',
        hasSecret: false,
        clientSecret: null,
      }),
    );

    const res = await service.register({
      redirect_uris: ['https://app.example.com/cb'],
      token_endpoint_auth_method: 'private_key_jwt',
      jwks_uri: 'https://app.example.com/jwks.json',
    });

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenEndpointAuthMethod: 'private_key_jwt',
        jwksUri: 'https://app.example.com/jwks.json',
      }),
    );
    expect(res.jwks_uri).toBe('https://app.example.com/jwks.json');
    expect(res.client_secret).toBeUndefined();
  });

  it('rejects supplying both jwks and jwks_uri', async () => {
    await expect(
      service.register({
        redirect_uris: ['https://app.example.com/cb'],
        token_endpoint_auth_method: 'private_key_jwt',
        jwks_uri: 'https://app.example.com/jwks.json',
        jwks: { keys: [] },
      }),
    ).rejects.toThrow(BadRequestException);
    expect(register).not.toHaveBeenCalled();
  });

  it('normalizes hybrid response_type token order before validating', async () => {
    register.mockResolvedValue(
      baseClient({ responseTypes: ['code id_token'] }),
    );

    await service.register({
      redirect_uris: ['https://app.example.com/cb'],
      response_types: ['id_token code'],
    });

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({ responseTypes: ['code id_token'] }),
    );
  });

  it('requires at least one redirect_uri', async () => {
    await expect(service.register({})).rejects.toThrow(BadRequestException);
    expect(register).not.toHaveBeenCalled();
  });

  it('treats empty grant_types/response_types as omitted and applies defaults', async () => {
    register.mockResolvedValue(baseClient());

    await service.register({
      redirect_uris: ['https://app.example.com/cb'],
      grant_types: [],
      response_types: [],
    });

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({
        grantTypes: ['authorization_code'],
        responseTypes: ['code'],
      }),
    );
  });
});
