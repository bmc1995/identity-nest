import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../../common/entities/account.entity';
import { ClientApplication } from '../../common/entities/clientApplication.entity';
import { Grant } from '../../common/entities/grant.entity';
import { Tenant } from '../../common/entities/tenant.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(ClientApplication)
    private readonly clientRepo: Repository<ClientApplication>,
    @InjectRepository(Grant)
    private readonly grantRepo: Repository<Grant>,
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') return;

    this.logger.log('Seeding test data...');

    const tenant = await this.seedTenant();
    const accounts = await this.seedAccounts();
    const clients = await this.seedClients(tenant);
    await this.seedGrants(accounts, clients);

    this.logger.log('Test data seeding complete');
  }

  private async seedTenant(): Promise<Tenant> {
    let tenant = await this.tenantRepo.findOneBy({ name: 'default' });
    if (!tenant) {
      tenant = await this.tenantRepo.save(
        this.tenantRepo.create({
          name: 'default',
          region: 'local',
          encryption_key:
            process.env.TENANT_ENCRYPTION_KEY ?? 'dev-key-change-in-production',
          settings: {
            mfa_required: false,
            session_timeout: 3600,
            password_policy: { min_length: 8 },
          },
        }),
      );
      this.logger.log('Seeded tenant: default');
    }
    return tenant;
  }

  private async seedAccounts(): Promise<Account[]> {
    const seeds = [
      {
        username: 'testuser',
        password: 'password',
        email: 'test@example.com',
        emailVerified: true,
      },
      {
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com',
        emailVerified: true,
      },
      {
        username: 'jane.doe',
        password: 'password',
        email: 'jane.doe@example.com',
        emailVerified: false,
      },
    ];

    const accounts: Account[] = [];
    for (const seed of seeds) {
      let account = await this.accountRepo.findOneBy({ username: seed.username });
      if (!account) {
        const passwordHash = await bcrypt.hash(seed.password, 12);
        account = await this.accountRepo.save(
          this.accountRepo.create({
            username: seed.username,
            email: seed.email,
            emailVerified: seed.emailVerified,
            passwordHash,
          }),
        );
        this.logger.log(`Seeded account: ${seed.username}`);
      }
      accounts.push(account);
    }
    return accounts;
  }

  private async seedClients(tenant: Tenant): Promise<ClientApplication[]> {
    const seeds = [
      {
        clientId: 'test-client',
        clientSecret: 'test-secret',
        name: 'Test Application',
        type: 'web',
        redirectUris: ['http://localhost:3000/callback'],
        grantTypes: ['authorization_code', 'refresh_token'],
        responseTypes: ['code'],
        tokenEndpointAuthMethod: 'client_secret_basic',
        requirePkce: true,
      },
      {
        clientId: 'dashboard-spa',
        name: 'Admin Dashboard',
        type: 'spa',
        redirectUris: ['http://localhost:4200/auth/callback'],
        grantTypes: ['authorization_code'],
        responseTypes: ['code'],
        tokenEndpointAuthMethod: 'none',
        requirePkce: true,
      },
      {
        clientId: 'mobile-app',
        name: 'Mobile App',
        type: 'native',
        redirectUris: ['com.example.app://callback'],
        grantTypes: ['authorization_code', 'refresh_token'],
        responseTypes: ['code'],
        tokenEndpointAuthMethod: 'none',
        requirePkce: true,
      },
    ];

    const clients: ClientApplication[] = [];
    for (const seed of seeds) {
      let client = await this.clientRepo.findOneBy({ clientId: seed.clientId });
      if (!client) {
        const clientSecretHash = seed.clientSecret
          ? await bcrypt.hash(seed.clientSecret, 12)
          : null;
        client = await this.clientRepo.save(
          this.clientRepo.create({
            clientId: seed.clientId,
            clientSecretHash,
            name: seed.name,
            type: seed.type,
            redirectUris: seed.redirectUris,
            grantTypes: seed.grantTypes,
            responseTypes: seed.responseTypes,
            tokenEndpointAuthMethod: seed.tokenEndpointAuthMethod,
            requirePkce: seed.requirePkce,
            tenant,
          }),
        );
        this.logger.log(`Seeded client: ${seed.clientId}`);
      }
      clients.push(client);
    }
    return clients;
  }

  private async seedGrants(
    accounts: Account[],
    clients: ClientApplication[],
  ): Promise<void> {
    // Pre-authorize testuser for the dashboard-spa
    const testuser = accounts.find((a) => a.username === 'testuser');
    const dashboardSpa = clients.find((c) => c.clientId === 'dashboard-spa');

    if (testuser && dashboardSpa) {
      const existing = await this.grantRepo.findOne({
        where: {
          account: { id: testuser.id },
          client: { id: dashboardSpa.id },
        },
      });
      if (!existing) {
        await this.grantRepo.save(
          this.grantRepo.create({
            account: { id: testuser.id },
            client: { id: dashboardSpa.id },
            scope: 'openid profile email',
            revokedAt: null,
          }),
        );
        this.logger.log('Seeded grant: testuser -> dashboard-spa (openid profile email)');
      }
    }
  }
}
