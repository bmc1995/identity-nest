import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StoredUser, UserStore } from '../store/stores/user.store';
import { StoredTenant, TenantStore } from '../store/stores/tenant.store';
import { UserService } from './user.service';

const TENANT_ID = '22222222-2222-2222-2222-222222222222';

/** Build a {@link StoredUser} with sensible defaults for assertions. */
function makeStored(overrides: Partial<StoredUser> = {}): StoredUser {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    tenantId: TENANT_ID,
    email: 'jane.doe@example.com',
    emailVerified: false,
    nickname: null,
    givenName: null,
    familyName: null,
    status: 'active',
    mfaEnabled: false,
    lastLogin: null,
    passwordHash: '$2b$12$hash',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}

/** Build a {@link StoredTenant} with sensible defaults for assertions. */
function makeTenant(overrides: Partial<StoredTenant> = {}): StoredTenant {
  return {
    id: TENANT_ID,
    name: 'default',
    region: 'local',
    branding: null,
    settings: {},
    metadata: null,
    adminEmail: null,
    planId: null,
    billingEmail: null,
    tier: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}

describe('UserService', () => {
  let service: UserService;
  let userStore: jest.Mocked<UserStore>;
  let tenantStore: jest.Mocked<TenantStore>;

  beforeEach(async () => {
    const userStoreMock: Partial<jest.Mocked<UserStore>> = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByEmailInTenant: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      verifyPassword: jest.fn(),
    };
    const tenantStoreMock: Partial<jest.Mocked<TenantStore>> = {
      findById: jest.fn(),
      findByName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserStore, useValue: userStoreMock },
        { provide: TenantStore, useValue: tenantStoreMock },
      ],
    }).compile();

    service = module.get(UserService);
    userStore = module.get(UserStore);
    tenantStore = module.get(TenantStore);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('falls back to the default tenant when tenantId is omitted', async () => {
      tenantStore.findByName.mockResolvedValue(makeTenant());
      userStore.findByEmailInTenant.mockResolvedValue(undefined);
      userStore.create.mockResolvedValue(makeStored());

      const result = await service.create({
        email: 'jane.doe@example.com',
        password: 'password123',
      });

      expect(tenantStore.findByName).toHaveBeenCalledWith('default');
      expect(userStore.create).toHaveBeenCalledWith(
        TENANT_ID,
        'jane.doe@example.com',
        'password123',
        expect.any(Object),
      );
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('rejects an unknown tenantId', async () => {
      tenantStore.findById.mockResolvedValue(undefined);

      await expect(
        service.create({
          email: 'jane.doe@example.com',
          password: 'password123',
          tenantId: '99999999-9999-9999-9999-999999999999',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(userStore.create).not.toHaveBeenCalled();
    });

    it('rejects when no default tenant exists and tenantId is omitted', async () => {
      tenantStore.findByName.mockResolvedValue(undefined);

      await expect(
        service.create({ email: 'jane.doe@example.com', password: 'password123' }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(userStore.create).not.toHaveBeenCalled();
    });

    it('rejects a duplicate email within the tenant with a conflict', async () => {
      tenantStore.findByName.mockResolvedValue(makeTenant());
      userStore.findByEmailInTenant.mockResolvedValue(makeStored());

      await expect(
        service.create({ email: 'jane.doe@example.com', password: 'password123' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(userStore.create).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('returns the admin view without the password hash', async () => {
      userStore.findById.mockResolvedValue(makeStored());

      const result = await service.getById('11111111-1111-1111-1111-111111111111');

      expect(result.email).toBe('jane.doe@example.com');
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('throws NotFound when the user is missing', async () => {
      userStore.findById.mockResolvedValue(undefined);

      await expect(service.getById('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('rejects an email change that collides within the tenant', async () => {
      userStore.findById.mockResolvedValue(makeStored({ id: 'a' }));
      userStore.findByEmailInTenant.mockResolvedValue(
        makeStored({ id: 'b', email: 'taken@example.com' }),
      );

      await expect(
        service.update('a', { email: 'taken@example.com' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(userStore.update).not.toHaveBeenCalled();
    });

    it('allows a no-op email update to the user’s own address', async () => {
      const current = makeStored({ id: 'a' });
      userStore.findById.mockResolvedValue(current);
      userStore.update.mockResolvedValue(makeStored({ id: 'a', status: 'suspended' }));

      const result = await service.update('a', {
        email: 'Jane.Doe@example.com',
        status: 'suspended',
      });

      expect(userStore.findByEmailInTenant).not.toHaveBeenCalled();
      expect(result.status).toBe('suspended');
    });

    it('throws NotFound when the user does not exist', async () => {
      userStore.findById.mockResolvedValue(undefined);

      await expect(service.update('missing', { status: 'locked' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('delegates to the store soft-delete', async () => {
      userStore.softDelete.mockResolvedValue(undefined);

      await service.remove('a');

      expect(userStore.softDelete).toHaveBeenCalledWith('a');
    });
  });
});
