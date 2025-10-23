import { Test, TestingModule } from '@nestjs/testing';
import { PkceService } from './pkce.service';

describe('PkceService', () => {
  let service: PkceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PkceService],
    }).compile();

    service = module.get<PkceService>(PkceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
