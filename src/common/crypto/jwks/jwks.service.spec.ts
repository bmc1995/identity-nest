import { Test, TestingModule } from '@nestjs/testing';
import { JwksService } from './jwks.service';

describe('JwksService', () => {
  let service: JwksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwksService],
    }).compile();

    service = module.get<JwksService>(JwksService);
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate an active key on init', () => {
    const inventory = service.getKeyInventory();
    expect(inventory.length).toBeGreaterThanOrEqual(1);
    expect(inventory[0].active).toBe(true);
  });

  it('should return a JWKS with public keys only', async () => {
    const jwks = await service.getJWKS();
    expect(jwks.keys.length).toBeGreaterThanOrEqual(1);
    for (const key of jwks.keys) {
      expect(key.kid).toBeDefined();
      expect(key.alg).toBeDefined();
      expect(key.use).toBe('sig');
      // Must not expose private key material
      expect(key.d).toBeUndefined();
      expect(key.p).toBeUndefined();
      expect(key.q).toBeUndefined();
    }
  });

  it('should return the active signing key', async () => {
    const signingKey = await service.getActiveSigningKey();
    expect(signingKey.kid).toBeDefined();
    expect(signingKey.alg).toBe('RS256');
    expect(signingKey.privateJwk).toBeDefined();
    expect(signingKey.issuer).toBe('https://idp.example.com');
  });

  it('should look up a verification key by kid', async () => {
    const { kid } = await service.getActiveSigningKey();
    const verification = await service.getVerificationKeyByKid(kid);
    expect(verification.publicKey).toBeDefined();
    expect(verification.issuer).toBe('https://idp.example.com');
  });

  it('should throw when looking up a non-existent kid', async () => {
    await expect(
      service.getVerificationKeyByKid('non-existent-kid'),
    ).rejects.toThrow('Key not found');
  });

  it('should rotate keys and deactivate the previous one', async () => {
    const oldKey = await service.getActiveSigningKey();
    await service.rotateKey('RS256');
    const newKey = await service.getActiveSigningKey();

    expect(newKey.kid).not.toBe(oldKey.kid);

    const inventory = service.getKeyInventory();
    const activeKeys = inventory.filter((k) => k.active);
    expect(activeKeys.length).toBe(1);
    expect(activeKeys[0].kid).toBe(newKey.kid);

    // Old key should still be in JWKS for verification
    const jwks = await service.getJWKS();
    const kids = jwks.keys.map((k) => k.kid);
    expect(kids).toContain(oldKey.kid);
    expect(kids).toContain(newKey.kid);
  });

  it('should generate an ES256 key', async () => {
    const key = await service.generateKey('ES256');
    expect(key.alg).toBe('ES256');
    expect(key.active).toBe(true);
    expect(key.kid).toBeDefined();
  });
});
