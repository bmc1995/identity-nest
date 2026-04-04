import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryController } from './discovery.controller';
import { JwksService } from '../../crypto/jwks/jwks.service';

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
});
