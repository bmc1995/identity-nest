import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryController } from './discovery.controller';
import { JwksService } from '../../../../common/crypto/jwks/jwks.service';

describe('DiscoveryController', () => {
  let controller: DiscoveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscoveryController],
      providers: [JwksService],
    }).compile();

    controller = module.get<DiscoveryController>(DiscoveryController);
    const jwksService = module.get<JwksService>(JwksService);
    await jwksService.onModuleInit();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an OpenID configuration document', async () => {
    const config = await controller.openidConfig();
    expect(config.issuer).toBe('https://idp.example.com');
    expect(config.jwks_uri).toContain('jwks.json');
    expect(config.response_types_supported).toContain('code');
    expect(config.id_token_signing_alg_values_supported).toContain('RS256');
  });

  it('advertises every supported client authentication method', async () => {
    const config = await controller.openidConfig();
    expect(config.token_endpoint_auth_methods_supported).toEqual([
      'client_secret_basic',
      'client_secret_post',
      'client_secret_jwt',
      'private_key_jwt',
      'none',
    ]);
    expect(config.revocation_endpoint_auth_methods_supported).toEqual([
      'client_secret_basic',
      'client_secret_post',
      'client_secret_jwt',
      'private_key_jwt',
      'none',
    ]);
    expect(config.token_endpoint_auth_signing_alg_values_supported).toEqual([
      'RS256',
      'ES256',
      'HS256',
    ]);
  });

  it('advertises the implemented response types and modes', async () => {
    const config = await controller.openidConfig();
    expect(config.response_types_supported).toEqual([
      'code',
      'id_token',
      'id_token token',
      'code id_token',
      'code token',
      'code id_token token',
      'none',
    ]);
    expect(config.response_modes_supported).toEqual(['query', 'fragment']);
    expect(config.grant_types_supported).toContain('implicit');
    expect(config.grant_types_supported).not.toContain('client_credentials');
  });

  it('only advertises claims the tokens actually carry', async () => {
    const config = await controller.openidConfig();
    expect(config.claims_supported).toEqual(
      expect.arrayContaining(['sub', 'preferred_username', 'email', 'email_verified']),
    );
    expect(config.claims_supported).not.toContain('name');
  });
});
