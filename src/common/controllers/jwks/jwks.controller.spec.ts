import { Test, TestingModule } from '@nestjs/testing';
import { JwksController } from './jwks.controller';
import { JwksService } from '../../crypto/jwks/jwks.service';

describe('JwksController', () => {
  let controller: JwksController;
  let jwksService: JwksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JwksController],
      providers: [JwksService],
    }).compile();

    controller = module.get<JwksController>(JwksController);
    jwksService = module.get<JwksService>(JwksService);
    await jwksService.onModuleInit();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a JWKS document from the endpoint', async () => {
    const result = await controller.jwksJson();
    expect(result.keys).toBeDefined();
    expect(result.keys.length).toBeGreaterThanOrEqual(1);
    expect(result.keys[0].kid).toBeDefined();
    expect(result.keys[0].use).toBe('sig');
    // Must not expose private key material
    expect(result.keys[0].d).toBeUndefined();
  });
});
