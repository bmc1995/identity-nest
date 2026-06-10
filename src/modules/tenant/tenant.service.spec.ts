import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StoredTenant, TenantStore } from '../store/stores/tenant.store';
import { TenantService } from './tenant.service';

/** Build a {@link StoredTenant} with sensible defaults for assertions. */
function makeStored(overrides: Partial<StoredTenant> = {}): StoredTenant {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'acme-corp',
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

describe('TenantService', () => {
  let service: TenantService;
  let store: jest.Mocked<TenantStore>;

  beforeEach(async () => {
    const storeMock: Partial<jest.Mocked<TenantStore>> = {
      create: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        { provide: TenantStore, useValue: storeMock },
      ],
    }).compile();

    service = module.get(TenantService);
    store = module.get(TenantStore);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('generates a server-side encryption key and never exposes it', async () => {
      store.findByName.mockResolvedValue(undefined);
      store.create.mockResolvedValue(makeStored());

      const result = await service.create({ name: 'acme-corp' });

      expect(store.create).toHaveBeenCalledTimes(1);
      const params = store.create.mock.calls[0][0];
      expect(params.name).toBe('acme-corp');
      expect(typeof params.encryptionKey).toBe('string');
      expect(params.encryptionKey.length).toBeGreaterThan(0);
      expect(result).not.toHaveProperty('encryption_key');
      expect(result).not.toHaveProperty('encryptionKey');
    });

    it('rejects a duplicate name with a conflict', async () => {
      store.findByName.mockResolvedValue(makeStored());

      await expect(service.create({ name: 'acme-corp' })).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(store.create).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('throws NotFound when the tenant is missing', async () => {
      store.findById.mockResolvedValue(undefined);

      await expect(service.getById('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('rejects renaming onto an existing tenant name', async () => {
      store.findById.mockResolvedValue(makeStored({ id: 'a', name: 'acme-corp' }));
      store.findByName.mockResolvedValue(makeStored({ id: 'b', name: 'globex' }));

      await expect(
        service.update('a', { name: 'globex' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(store.update).not.toHaveBeenCalled();
    });

    it('allows a no-op rename to the tenant’s own name', async () => {
      const current = makeStored({ id: 'a', name: 'acme-corp' });
      store.findById.mockResolvedValue(current);
      store.update.mockResolvedValue(makeStored({ id: 'a', name: 'acme-corp', region: 'us-east-1' }));

      const result = await service.update('a', { name: 'acme-corp', region: 'us-east-1' });

      expect(store.findByName).not.toHaveBeenCalled();
      expect(result.region).toBe('us-east-1');
    });

    it('throws NotFound when the tenant does not exist', async () => {
      store.findById.mockResolvedValue(undefined);

      await expect(service.update('missing', { region: 'eu' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('delegates to the store soft-delete', async () => {
      store.softDelete.mockResolvedValue(undefined);

      await service.remove('a');

      expect(store.softDelete).toHaveBeenCalledWith('a');
    });
  });
});
