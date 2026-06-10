import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserStore, StoredUser } from '../store/stores/user.store';
import { TenantStore } from '../store/stores/tenant.store';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Admin-facing view of a user account returned to API callers.
 *
 * Mirrors {@link StoredUser} but excludes the password hash, which never
 * leaves the server boundary.
 */
export interface UserView {
  id: string;
  tenantId: string;
  email: string;
  emailVerified: boolean;
  nickname: string | null;
  givenName: string | null;
  familyName: string | null;
  status: string;
  mfaEnabled: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userStore: UserStore,
    private readonly tenantStore: TenantStore,
  ) {}

  findById(id: string): Promise<StoredUser | undefined> {
    return this.userStore.findById(id);
  }

  findByEmail(email: string): Promise<StoredUser | undefined> {
    return this.userStore.findByEmail(email);
  }

  async verifyCredentials(
    email: string,
    password: string,
  ): Promise<StoredUser | null> {
    const user = await this.userStore.findByEmail(email);
    if (!user) {
      this.logger.warn('Credential check failed: unknown email');
      return null;
    }
    const valid = await this.userStore.verifyPassword(user, password);
    if (!valid) {
      this.logger.warn(`Credential check failed: bad password for user=${user.id}`);
      return null;
    }
    return user;
  }

  /**
   * Create a new user account.
   *
   * Resolves the owning tenant (explicit `tenantId` or the `default` tenant),
   * enforces per-tenant email uniqueness, and hashes the initial password.
   *
   * @throws BadRequestException when the tenant cannot be resolved.
   * @throws ConflictException when the email is already taken in the tenant.
   */
  async create(dto: CreateUserDto): Promise<UserView> {
    const tenantId = await this.resolveTenantId(dto.tenantId);

    const existing = await this.userStore.findByEmailInTenant(tenantId, dto.email);
    if (existing) {
      throw new ConflictException({
        error: 'user_exists',
        error_description: `A user with email "${dto.email}" already exists in this tenant`,
      });
    }

    const stored = await this.userStore.create(tenantId, dto.email, dto.password, {
      emailVerified: dto.emailVerified,
      nickname: dto.nickname ?? null,
      givenName: dto.givenName ?? null,
      familyName: dto.familyName ?? null,
    });

    this.logger.log(`Created user "${stored.email}" (${stored.id})`);
    return this.toView(stored);
  }

  /** Return every user account as its admin-facing view. */
  async list(): Promise<UserView[]> {
    const users = await this.userStore.findAll();
    return users.map((u) => this.toView(u));
  }

  /**
   * Return a single user by its primary-key UUID.
   * @throws NotFoundException when no matching user exists.
   */
  async getById(id: string): Promise<UserView> {
    const user = await this.userStore.findById(id);
    if (!user) {
      throw new NotFoundException({ error: 'user_not_found' });
    }
    return this.toView(user);
  }

  /**
   * Apply a partial update to a user (profile, email, status, password reset).
   *
   * @throws NotFoundException when the user does not exist.
   * @throws ConflictException when an email change collides with another user
   *   in the same tenant.
   */
  async update(id: string, dto: UpdateUserDto): Promise<UserView> {
    const user = await this.userStore.findById(id);
    if (!user) {
      throw new NotFoundException({ error: 'user_not_found' });
    }

    if (dto.email !== undefined && dto.email.toLowerCase() !== user.email) {
      const clash = await this.userStore.findByEmailInTenant(
        user.tenantId,
        dto.email,
      );
      if (clash && clash.id !== id) {
        throw new ConflictException({
          error: 'user_exists',
          error_description: `A user with email "${dto.email}" already exists in this tenant`,
        });
      }
    }

    const updated = await this.userStore.update(id, dto);
    this.logger.log(`Updated user "${updated.email}" (${updated.id})`);
    return this.toView(updated);
  }

  /**
   * Soft-delete a user. The record is retained for audit/recovery but
   * excluded from all subsequent reads, so existing sessions stop validating.
   *
   * @throws NotFoundException when the user does not exist.
   */
  async remove(id: string): Promise<void> {
    await this.userStore.softDelete(id);
    this.logger.log(`Soft-deleted user ${id}`);
  }

  /**
   * Resolve the owning tenant for a new user: validate an explicit
   * `tenantId`, or fall back to the tenant named `default`.
   *
   * @throws BadRequestException when the tenant does not exist.
   */
  private async resolveTenantId(tenantId?: string): Promise<string> {
    if (tenantId) {
      const tenant = await this.tenantStore.findById(tenantId);
      if (!tenant) {
        throw new BadRequestException({
          error: 'invalid_tenant',
          error_description: `Tenant ${tenantId} does not exist`,
        });
      }
      return tenant.id;
    }

    const fallback = await this.tenantStore.findByName('default');
    if (!fallback) {
      throw new BadRequestException({
        error: 'invalid_tenant',
        error_description: 'No tenantId supplied and no `default` tenant exists',
      });
    }
    return fallback.id;
  }

  /** Project a {@link StoredUser} into the admin-facing {@link UserView}. */
  private toView(stored: StoredUser): UserView {
    return {
      id: stored.id,
      tenantId: stored.tenantId,
      email: stored.email,
      emailVerified: stored.emailVerified,
      nickname: stored.nickname,
      givenName: stored.givenName,
      familyName: stored.familyName,
      status: stored.status,
      mfaEnabled: stored.mfaEnabled,
      lastLogin: stored.lastLogin,
      createdAt: stored.createdAt,
      updatedAt: stored.updatedAt,
    };
  }
}
