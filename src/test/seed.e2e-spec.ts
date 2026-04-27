import { setupTestDb, teardownTestDb, TestDb } from './test-db';

describe('SeedService (e2e)', () => {
  let db: TestDb;

  beforeAll(async () => {
    db = await setupTestDb();
  }, 30_000);

  afterAll(async () => {
    await teardownTestDb(db);
  });

  describe('users', () => {
    it('should seed testuser', async () => {
      const user = await db.stores.user.findByEmail('test@example.com');
      expect(user).toBeDefined();
      expect(user!.nickname).toBe('testuser');
      expect(user!.emailVerified).toBe(true);
    });

    it('should seed admin', async () => {
      const user = await db.stores.user.findByEmail('admin@example.com');
      expect(user).toBeDefined();
      expect(user!.nickname).toBe('admin');
    });

    it('should seed jane.doe', async () => {
      const user = await db.stores.user.findByEmail('jane.doe@example.com');
      expect(user).toBeDefined();
      expect(user!.emailVerified).toBe(false);
    });

    it('should verify testuser password', async () => {
      const user = await db.stores.user.findByEmail('test@example.com');
      const valid = await db.stores.user.verifyPassword(user!, 'password');
      expect(valid).toBe(true);
    });

    it('should reject wrong password', async () => {
      const user = await db.stores.user.findByEmail('test@example.com');
      const valid = await db.stores.user.verifyPassword(user!, 'wrong');
      expect(valid).toBe(false);
    });
  });

  describe('clients', () => {
    it('should seed test-client (confidential, web)', async () => {
      const client = await db.stores.client.findByClientId('test-client');
      expect(client).toBeDefined();
      expect(client!.type).toBe('web');
      expect(client!.tokenEndpointAuthMethod).toBe('client_secret_basic');
      expect(client!.clientSecretHash).not.toBeNull();
      expect(client!.requirePkce).toBe(true);
    });

    it('should seed dashboard-spa (public, spa)', async () => {
      const client = await db.stores.client.findByClientId('dashboard-spa');
      expect(client).toBeDefined();
      expect(client!.type).toBe('spa');
      expect(client!.tokenEndpointAuthMethod).toBe('none');
      expect(client!.clientSecretHash).toBeNull();
      expect(client!.redirectUris).toContain('https://oauth.pstmn.io/v1/callback');
    });

    it('should seed mobile-app (public, native)', async () => {
      const client = await db.stores.client.findByClientId('mobile-app');
      expect(client).toBeDefined();
      expect(client!.type).toBe('native');
      expect(client!.redirectUris).toContain('com.example.app://callback');
    });

    it('should validate test-client secret', async () => {
      const client = await db.stores.client.findByClientId('test-client');
      const valid = await db.stores.client.validateSecret(client!, 'test-secret');
      expect(valid).toBe(true);
    });

    it('should list all active clients', async () => {
      const clients = await db.stores.client.findAllActive();
      expect(clients.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('grants', () => {
    it('should pre-authorize testuser for dashboard-spa', async () => {
      const user = await db.stores.user.findByEmail('test@example.com');
      const grant = await db.stores.grant.findByUserAndClient(
        user!.id,
        'dashboard-spa',
      );
      expect(grant).toBeDefined();
      expect(grant!.scope).toBe('openid profile email');
      expect(grant!.revokedAt).toBeNull();
    });
  });
});
