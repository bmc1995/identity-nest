import { Request } from 'express';
import { SignJWT, generateKeyPair, exportJWK } from 'jose';
import { ClientAuthenticatorService } from './client-authenticator.service';
import { StoredClient } from '../../../store/stores/client.store';

const ISSUER = 'https://idp.example.com';
const TOKEN_AUD = `${ISSUER}/oidc/token`;
const ASSERTION_TYPE =
  'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';

const baseClient = (overrides: Partial<StoredClient> = {}): StoredClient => ({
  id: 'uuid',
  clientId: 'client-1',
  clientSecretEnc: null,
  name: 'App',
  description: null,
  type: 'web',
  redirectUris: ['https://app/cb'],
  grantTypes: ['authorization_code'],
  responseTypes: ['code'],
  tokenEndpointAuthMethod: 'client_secret_basic',
  jwksUri: null,
  jwks: null,
  requirePkce: true,
  accessTokenLifetime: 3600,
  refreshTokenLifetime: 2592000,
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('ClientAuthenticatorService', () => {
  let service: ClientAuthenticatorService;
  let clientStore: {
    findByClientId: jest.Mock;
    validateSecret: jest.Mock;
    getDecryptedSecret: jest.Mock;
  };
  let replay: { claim: jest.Mock };

  beforeEach(() => {
    clientStore = {
      findByClientId: jest.fn(),
      validateSecret: jest.fn(),
      getDecryptedSecret: jest.fn(),
    };
    replay = { claim: jest.fn().mockResolvedValue(true) };
    service = new ClientAuthenticatorService(
      clientStore as never,
      { getIssuer: () => ISSUER } as never,
      replay as never,
    );
  });

  const noHeaders = { headers: {} } as Request;

  const signHs256 = (secret: string, claims: Record<string, unknown> = {}) =>
    new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('client-1')
      .setSubject('client-1')
      .setAudience(TOKEN_AUD)
      .setJti('jti-1')
      .setIssuedAt()
      .setExpirationTime('2m')
      .sign(new TextEncoder().encode(secret));

  describe('client_secret_jwt', () => {
    it('authenticates a valid HS256 assertion', async () => {
      clientStore.findByClientId.mockResolvedValue(
        baseClient({ tokenEndpointAuthMethod: 'client_secret_jwt' }),
      );
      clientStore.getDecryptedSecret.mockReturnValue('shhh');

      const assertion = await signHs256('shhh');
      const result = await service.authenticate(noHeaders, {
        client_assertion: assertion,
        client_assertion_type: ASSERTION_TYPE,
      });

      expect(result?.clientId).toBe('client-1');
      expect(replay.claim).toHaveBeenCalledWith('client-1', 'jti-1', expect.any(Number));
    });

    it('rejects a replayed jti', async () => {
      clientStore.findByClientId.mockResolvedValue(
        baseClient({ tokenEndpointAuthMethod: 'client_secret_jwt' }),
      );
      clientStore.getDecryptedSecret.mockReturnValue('shhh');
      replay.claim.mockResolvedValue(false);

      const assertion = await signHs256('shhh');
      const result = await service.authenticate(noHeaders, {
        client_assertion: assertion,
        client_assertion_type: ASSERTION_TYPE,
      });

      expect(result).toBeNull();
    });

    it('rejects an assertion signed with the wrong secret', async () => {
      clientStore.findByClientId.mockResolvedValue(
        baseClient({ tokenEndpointAuthMethod: 'client_secret_jwt' }),
      );
      clientStore.getDecryptedSecret.mockReturnValue('the-real-secret');

      const assertion = await signHs256('a-different-secret');
      const result = await service.authenticate(noHeaders, {
        client_assertion: assertion,
        client_assertion_type: ASSERTION_TYPE,
      });

      expect(result).toBeNull();
    });

    it('rejects an assertion whose audience is not this server', async () => {
      clientStore.findByClientId.mockResolvedValue(
        baseClient({ tokenEndpointAuthMethod: 'client_secret_jwt' }),
      );
      clientStore.getDecryptedSecret.mockReturnValue('shhh');

      const assertion = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer('client-1')
        .setSubject('client-1')
        .setAudience('https://evil.example.com')
        .setJti('jti-1')
        .setIssuedAt()
        .setExpirationTime('2m')
        .sign(new TextEncoder().encode('shhh'));

      const result = await service.authenticate(noHeaders, {
        client_assertion: assertion,
        client_assertion_type: ASSERTION_TYPE,
      });

      expect(result).toBeNull();
    });
  });

  describe('private_key_jwt', () => {
    it('authenticates a valid RS256 assertion against the inline jwks', async () => {
      const { publicKey, privateKey } = await generateKeyPair('RS256', {
        extractable: true,
      });
      const jwk = await exportJWK(publicKey);

      clientStore.findByClientId.mockResolvedValue(
        baseClient({
          tokenEndpointAuthMethod: 'private_key_jwt',
          jwks: { keys: [{ ...jwk, alg: 'RS256', use: 'sig', kid: 'k1' }] },
        }),
      );

      const assertion = await new SignJWT({})
        .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
        .setIssuer('client-1')
        .setSubject('client-1')
        .setAudience(TOKEN_AUD)
        .setJti('jti-rsa')
        .setIssuedAt()
        .setExpirationTime('2m')
        .sign(privateKey);

      const result = await service.authenticate(noHeaders, {
        client_assertion: assertion,
        client_assertion_type: ASSERTION_TYPE,
      });

      expect(result?.clientId).toBe('client-1');
    });

    it('rejects an HS256 assertion for a private_key_jwt client', async () => {
      clientStore.findByClientId.mockResolvedValue(
        baseClient({
          tokenEndpointAuthMethod: 'private_key_jwt',
          jwks: { keys: [] },
        }),
      );

      const assertion = await signHs256('whatever');
      const result = await service.authenticate(noHeaders, {
        client_assertion: assertion,
        client_assertion_type: ASSERTION_TYPE,
      });

      expect(result).toBeNull();
    });
  });

  describe('shared-secret method consistency', () => {
    it('admits a client_secret_basic client with the right secret', async () => {
      clientStore.findByClientId.mockResolvedValue(
        baseClient({
          tokenEndpointAuthMethod: 'client_secret_basic',
          clientSecretEnc: 'sealed',
        }),
      );
      clientStore.validateSecret.mockReturnValue(true);

      const result = await service.authenticate(noHeaders, {
        client_id: 'client-1',
        client_secret: 'plaintext',
      });

      expect(result?.clientId).toBe('client-1');
    });

    it('refuses to authenticate a private_key_jwt client via shared secret', async () => {
      clientStore.findByClientId.mockResolvedValue(
        baseClient({ tokenEndpointAuthMethod: 'private_key_jwt' }),
      );

      const result = await service.authenticate(noHeaders, {
        client_id: 'client-1',
        client_secret: 'anything',
      });

      expect(result).toBeNull();
      expect(clientStore.validateSecret).not.toHaveBeenCalled();
    });

    it('admits a public (none) client by client_id alone', async () => {
      clientStore.findByClientId.mockResolvedValue(
        baseClient({ tokenEndpointAuthMethod: 'none' }),
      );

      const result = await service.authenticate(noHeaders, {
        client_id: 'client-1',
      });

      expect(result?.clientId).toBe('client-1');
    });
  });
});
