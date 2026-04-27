import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { StoreModule } from '../modules/store/store.module';
import { UserStore } from '../modules/store/stores/user.store';
import { ClientStore } from '../modules/store/stores/client.store';
import { InteractionStore } from '../modules/store/stores/interaction.store';
import { AuthorizationCodeStore } from '../modules/store/stores/authorization-code.store';
import { GrantStore } from '../modules/store/stores/grant.store';
import { SeedService } from '../modules/store/seed.service';

/**
 * TypeORM config targeting the `identity_test` database.
 * Expects the test DB to exist (created by docker/init.sql).
 */
export const testTypeOrmModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER ?? 'identity',
  password: process.env.DATABASE_PASSWORD ?? 'identity',
  database: process.env.DATABASE_NAME ?? 'identity_test',
  autoLoadEntities: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true, // clean slate each test run
});

export interface TestDb {
  module: TestingModule;
  app: INestApplication;
  dataSource: DataSource;
  stores: {
    user: UserStore;
    client: ClientStore;
    interaction: InteractionStore;
    authorizationCode: AuthorizationCodeStore;
    grant: GrantStore;
  };
  seed: SeedService;
}

/**
 * Boot a NestJS test module wired to `identity_test` with seeded data.
 *
 * Usage:
 * ```ts
 * let db: TestDb;
 * beforeAll(async () => { db = await setupTestDb(); });
 * afterAll(async () => { await teardownTestDb(db); });
 * ```
 */
export async function setupTestDb(): Promise<TestDb> {
  const module = await Test.createTestingModule({
    imports: [testTypeOrmModule, StoreModule],
  }).compile();

  const app = module.createNestApplication();
  await app.init(); // triggers SeedService.onModuleInit()

  const dataSource = module.get(DataSource);

  return {
    module,
    app,
    dataSource,
    stores: {
      user: module.get(UserStore),
      client: module.get(ClientStore),
      interaction: module.get(InteractionStore),
      authorizationCode: module.get(AuthorizationCodeStore),
      grant: module.get(GrantStore),
    },
    seed: module.get(SeedService),
  };
}

export async function teardownTestDb(db: TestDb): Promise<void> {
  await db.app.close();
}
