import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { StoredTenant, TenantStore } from '../store/stores/tenant.store';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

/**
 * Admin-facing view of a tenant returned to API callers.
 *
 * Mirrors {@link StoredTenant} and likewise excludes the per-tenant
 * `encryption_key`, which never leaves the server boundary.
 */
export interface TenantView {
  id: string;
  name: string;
  region: string;
  branding: Record<string, any> | null;
  settings: Record<string, any>;
  metadata: Record<string, any> | null;
  adminEmail: string | null;
  planId: string | null;
  billingEmail: string | null;
  tier: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Business logic for the admin tenant-management API.
 *
 * Responsibilities:
 *   - Enforce name uniqueness with a friendly conflict error.
 *   - Mint a per-tenant data-encryption key on creation (never client-supplied).
 *   - Delegate persistence to {@link TenantStore}.
 */
@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);

  constructor(private readonly tenantStore: TenantStore) {}

  /**
   * Create a new tenant.
   *
   * Generates a fresh per-tenant encryption key server-side. The key is stored
   * but never returned in the response.
   *
   * @throws ConflictException when a tenant with the same name already exists.
   */
  async create(dto: CreateTenantDto): Promise<TenantView> {
    const existing = await this.tenantStore.findByName(dto.name);
    if (existing) {
      throw new ConflictException({
        error: 'tenant_exists',
        error_description: `A tenant named "${dto.name}" already exists`,
      });
    }

    const stored = await this.tenantStore.create({
      name: dto.name,
      encryptionKey: this.generateEncryptionKey(),
      region: dto.region,
      branding: dto.branding ?? null,
      settings: dto.settings,
      metadata: dto.metadata ?? null,
      adminEmail: dto.adminEmail ?? null,
      planId: dto.planId ?? null,
      billingEmail: dto.billingEmail ?? null,
      tier: dto.tier ?? null,
    });

    this.logger.log(`Created tenant "${stored.name}" (${stored.id})`);
    return this.toView(stored);
  }

  /** Return every tenant as its admin-facing view. */
  async list(): Promise<TenantView[]> {
    const tenants = await this.tenantStore.findAll();
    return tenants.map((t) => this.toView(t));
  }

  /**
   * Return a single tenant by its primary-key UUID.
   * @throws NotFoundException when no matching tenant exists.
   */
  async getById(id: string): Promise<TenantView> {
    const tenant = await this.tenantStore.findById(id);
    if (!tenant) {
      throw new NotFoundException({ error: 'tenant_not_found' });
    }
    return this.toView(tenant);
  }

  /**
   * Apply a partial update to a tenant.
   *
   * @throws NotFoundException when the tenant does not exist.
   * @throws ConflictException when renaming would collide with another tenant.
   */
  async update(id: string, dto: UpdateTenantDto): Promise<TenantView> {
    const tenant = await this.tenantStore.findById(id);
    if (!tenant) {
      throw new NotFoundException({ error: 'tenant_not_found' });
    }

    if (dto.name !== undefined && dto.name !== tenant.name) {
      const clash = await this.tenantStore.findByName(dto.name);
      if (clash && clash.id !== id) {
        throw new ConflictException({
          error: 'tenant_exists',
          error_description: `A tenant named "${dto.name}" already exists`,
        });
      }
    }

    const updated = await this.tenantStore.update(id, dto);
    this.logger.log(`Updated tenant "${updated.name}" (${updated.id})`);
    return this.toView(updated);
  }

  /**
   * Soft-delete a tenant.
   * @throws NotFoundException when the tenant does not exist.
   */
  async remove(id: string): Promise<void> {
    await this.tenantStore.softDelete(id);
    this.logger.log(`Soft-deleted tenant ${id}`);
  }

  /** Generate a 256-bit base64url-encoded per-tenant data-encryption key. */
  private generateEncryptionKey(): string {
    return randomBytes(32).toString('base64url');
  }

  /** Project a {@link StoredTenant} into the admin-facing {@link TenantView}. */
  private toView(stored: StoredTenant): TenantView {
    return {
      id: stored.id,
      name: stored.name,
      region: stored.region,
      branding: stored.branding,
      settings: stored.settings,
      metadata: stored.metadata,
      adminEmail: stored.adminEmail,
      planId: stored.planId,
      billingEmail: stored.billingEmail,
      tier: stored.tier,
      createdAt: stored.createdAt,
      updatedAt: stored.updatedAt,
    };
  }
}
