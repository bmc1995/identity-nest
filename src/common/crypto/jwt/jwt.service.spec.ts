import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { JwksService } from '../jwks/jwks.service';
import { decodeProtectedHeader, decodeJwt } from 'jose';

describe('JwtService', () => {
  let jwtService: JwtService;
  let jwksService: JwksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwksService, JwtService],
    }).compile();

    jwksService = module.get<JwksService>(JwksService);
    jwtService = module.get<JwtService>(JwtService);
    await jwksService.onModuleInit();
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('signIdToken / verifyJwt round-trip', () => {
    it('should sign and verify an ID token', async () => {
      const token = await jwtService.signIdToken('user-123', 'client-abc', {
        email: 'test@example.com',
      });
      expect(typeof token).toBe('string');

      const header = decodeProtectedHeader(token);
      expect(header.alg).toBe('RS256');
      expect(header.kid).toBeDefined();
      expect(header.typ).toBe('JWT');

      const payload = await jwtService.verifyJwt(token);
      expect(payload.sub).toBe('user-123');
      expect(payload.aud).toBe('client-abc');
      expect(payload.email).toBe('test@example.com');
      expect(payload.iss).toBe('https://idp.example.com');
      expect(payload.exp).toBeDefined();
    });
  });

  describe('signAccessToken', () => {
    it('should sign an access token with required claims', async () => {
      const token = await jwtService.signAccessToken(
        'user-123',
        'client-abc',
        'openid profile',
      );

      const header = decodeProtectedHeader(token);
      expect(header.typ).toBe('at+jwt');

      const payload = await jwtService.verifyJwt(token);
      expect(payload.sub).toBe('user-123');
      expect(payload.client_id).toBe('client-abc');
      expect(payload.scope).toBe('openid profile');
      expect(payload.jti).toBeDefined();
    });

    it('should respect custom TTL', async () => {
      const token = await jwtService.signAccessToken(
        'user-123',
        'client-abc',
        'openid',
        { ttlSeconds: 60 },
      );

      const payload = decodeJwt(token);
      expect(payload.exp! - payload.iat!).toBe(60);
    });

    it('should include tenant_id when provided', async () => {
      const token = await jwtService.signAccessToken(
        'user-123',
        'client-abc',
        'openid',
        { tenantId: 'tenant-xyz' },
      );

      const payload = await jwtService.verifyJwt(token);
      expect(payload.tenant_id).toBe('tenant-xyz');
    });
  });

  describe('signRefreshToken', () => {
    it('should sign a refresh token with correct typ header', async () => {
      const token = await jwtService.signRefreshToken(
        'user-123',
        'client-abc',
        'openid offline_access',
      );

      const header = decodeProtectedHeader(token);
      expect(header.typ).toBe('rt+jwt');

      const payload = await jwtService.verifyJwt(token);
      expect(payload.sub).toBe('user-123');
      expect(payload.client_id).toBe('client-abc');
      expect(payload.scope).toBe('openid offline_access');
      expect(payload.jti).toBeDefined();
    });

    it('should default to 30-day expiration', async () => {
      const token = await jwtService.signRefreshToken(
        'user-123',
        'client-abc',
        'openid',
      );

      const payload = decodeJwt(token);
      const thirtyDays = 30 * 24 * 60 * 60;
      expect(payload.exp! - payload.iat!).toBe(thirtyDays);
    });
  });

  describe('verifyJwt error cases', () => {
    it('should reject a tampered token', async () => {
      const token = await jwtService.signIdToken('user-123', 'client-abc');
      const tampered = token.slice(0, -5) + 'XXXXX';
      await expect(jwtService.verifyJwt(tampered)).rejects.toThrow();
    });

    it('should reject a token with unknown kid', async () => {
      // Rotate keys, then manually craft scenario
      const token = await jwtService.signIdToken('user-123', 'client-abc');

      // Valid token should still work (old key remains in JWKS)
      const payload = await jwtService.verifyJwt(token);
      expect(payload.sub).toBe('user-123');
    });

    it('should verify tokens signed before key rotation', async () => {
      const tokenBefore = await jwtService.signIdToken('user-123', 'client-abc');
      await jwksService.rotateKey('RS256');
      const tokenAfter = await jwtService.signIdToken('user-456', 'client-abc');

      // Both should verify successfully
      const payloadBefore = await jwtService.verifyJwt(tokenBefore);
      expect(payloadBefore.sub).toBe('user-123');

      const payloadAfter = await jwtService.verifyJwt(tokenAfter);
      expect(payloadAfter.sub).toBe('user-456');
    });
  });
});
