import { setupTestDb, teardownTestDb, TestDb } from './test-db';

describe('SeedService (e2e)', () => {
  let db: TestDb;

  beforeAll(async () => {
    db = await setupTestDb();
  }, 30_000);

  afterAll(async () => {
    await teardownTestDb(db);
  });

  describe('accounts', () => {
    it('should seed testuser', async () => {
      const account = await db.stores.account.findByUsername('testuser');
      expect(account).toBeDefined();
      expect(account!.email).toBe('test@example.com');
      expect(account!.emailVerified).toBe(true);
    });

    it('should seed admin', async () => {
      const account = await db.stores.account.findByUsername('admin');
      expect(account).toBeDefined();
      expect(account!.email).toBe('admin@example.com');
    });

    it('should seed jane.doe', async () => {
      const account = await db.stores.account.findByUsername('jane.doe');
      expect(account).toBeDefined();
      expect(account!.emailVerified).toBe(false);
    });

    it('should verify testuser password', async () => {
      const account = await db.stores.account.findByUsername('testuser');
      const valid = await db.stores.account.verifyPassword(account!, 'password');
      expect(valid).toBe(true);
    });

    it('should reject wrong password', async () => {
      const account = await db.stores.account.findByUsername('testuser');
      const valid = await db.stores.account.verifyPassword(account!, 'wrong');
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
      expect(client!.redirectUris).toContain('http://localhost:4200/auth/callback');
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
      const account = await db.stores.account.findByUsername('testuser');
      const grant = await db.stores.grant.findByAccountAndClient(
        account!.id,
        'dashboard-spa',
      );
      expect(grant).toBeDefined();
      expect(grant!.scope).toBe('openid profile email');
      expect(grant!.revokedAt).toBeNull();
    });
  });
});
