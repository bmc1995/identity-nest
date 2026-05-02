import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../common/entities/user.entity';
import { ClientApplication } from '../../common/entities/clientApplication.entity';
import { Grant } from '../../common/entities/grant.entity';
import { Tenant } from '../../common/entities/tenant.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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
    const users = await this.seedUsers(tenant);
    const clients = await this.seedClients(tenant);
    await this.seedGrants(users, clients);

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

  private async seedUsers(tenant: Tenant): Promise<User[]> {
    const seeds = [
      {
        email: 'test@example.com',
        nickname: 'testuser',
        password: 'password',
        emailVerified: true,
      },
      {
        email: 'admin@example.com',
        nickname: 'admin',
        password: 'admin123',
        emailVerified: true,
      },
      {
        email: 'jane.doe@example.com',
        nickname: 'jane.doe',
        password: 'password',
        emailVerified: false,
      },
    ];

    const users: User[] = [];
    for (const seed of seeds) {
      let user = await this.userRepo.findOne({
        where: { email: seed.email, tenant: { id: tenant.id } },
      });
      if (!user) {
        const passwordHash = await bcrypt.hash(seed.password, 12);
        user = await this.userRepo.save(
          this.userRepo.create({
            tenant,
            email: seed.email,
            nickname: seed.nickname,
            emailVerified: seed.emailVerified,
            passwordHash,
          }),
        );
        this.logger.log(`Seeded user: ${seed.email}`);
      }
      users.push(user);
    }
    return users;
  }

  private async seedClients(tenant: Tenant): Promise<ClientApplication[]> {
    const seeds = [
      {
        clientId: 'test-client',
        clientSecret: 'test-secret',
        name: 'Test Application (confidential)',
        type: 'web',
        redirectUris: [
          'https://oauth.pstmn.io/v1/callback',
          'http://localhost:8080/callback',
          'https://localhost:5173/',
        ],
        grantTypes: ['authorization_code', 'refresh_token'],
        responseTypes: ['code'],
        tokenEndpointAuthMethod: 'client_secret_basic',
        requirePkce: true,
      },
      {
        clientId: 'dashboard-spa',
        name: 'Test SPA (public)',
        type: 'spa',
        redirectUris: [
          'https://oauth.pstmn.io/v1/callback',
          'http://localhost:8080/callback',
          'https://localhost:5173/',
        ],
        grantTypes: ['authorization_code'],
        responseTypes: ['code'],
        tokenEndpointAuthMethod: 'none',
        requirePkce: true,
      },
      {
        clientId: 'mobile-app',
        name: 'Mobile App (public)',
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
    users: User[],
    clients: ClientApplication[],
  ): Promise<void> {
    // Pre-authorize testuser for the dashboard-spa
    const testuser = users.find((u) => u.email === 'test@example.com');
    const dashboardSpa = clients.find((c) => c.clientId === 'dashboard-spa');

    if (testuser && dashboardSpa) {
      const existing = await this.grantRepo.findOne({
        where: {
          user: { id: testuser.id },
          client: { id: dashboardSpa.id },
        },
      });
      if (!existing) {
        await this.grantRepo.save(
          this.grantRepo.create({
            user: { id: testuser.id },
            client: { id: dashboardSpa.id },
            scope: 'openid profile email',
            revokedAt: null,
          }),
        );
        this.logger.log('Seeded grant: test@example.com -> dashboard-spa (openid profile email)');
      }
    }
  }
}
