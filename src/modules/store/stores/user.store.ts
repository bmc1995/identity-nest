import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../../common/entities/user.entity';
import { Tenant } from '../../../common/entities/tenant.entity';

export interface StoredUser {
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
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fields a caller may patch on an existing user. All optional. A `password`
 * value is bcrypt-hashed before persistence and replaces the current hash.
 */
export interface UserPatch {
  email?: string;
  emailVerified?: boolean;
  nickname?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  status?: string;
  password?: string;
}

/**
 * Data-access facade for {@link User} records.
 *
 * Passwords are bcrypt-hashed on write and never exposed in plaintext. Read
 * methods rely on TypeORM soft-delete semantics: rows with a non-null
 * `deletedAt` are excluded automatically.
 */
@Injectable()
export class UserStore {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async create(
    tenantId: string,
    email: string,
    password: string,
    options: {
      emailVerified?: boolean;
      nickname?: string | null;
      givenName?: string | null;
      familyName?: string | null;
    } = {},
  ): Promise<StoredUser> {
    if (!(await this.tenantRepo.findBy({ id: tenantId })).length) {
      throw new NotFoundException({ error: 'tenant_not_found' });
    }
    if (await this.findByEmailInTenant(tenantId, email)) {
      throw new ConflictException({ error: 'tenant_user_email_exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = this.repo.create({
      tenant: { id: tenantId } as Tenant,
      email: email.toLowerCase(),
      emailVerified: options.emailVerified ?? false,
      nickname: options.nickname ?? null,
      givenName: options.givenName ?? null,
      familyName: options.familyName ?? null,
      passwordHash,
    });

    const saved = await this.repo.save(user);
    return this.toStored(saved);
  }

  async findById(id: string): Promise<StoredUser | undefined> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['tenant'],
    });

    return user ? this.toStored(user) : undefined;
  }

  async findByEmail(email: string): Promise<StoredUser | undefined> {
    const user = await this.repo.findOne({
      where: { email: email.toLowerCase() },
      relations: ['tenant'],
    });

    return user ? this.toStored(user) : undefined;
  }

  /** Look up a user by email within a single tenant (emails are unique per tenant). */
  async findByEmailInTenant(
    tenantId: string,
    email: string,
  ): Promise<StoredUser | undefined> {
    const user = await this.repo.findOne({
      where: { email: email.toLowerCase(), tenant: { id: tenantId } },
      relations: ['tenant'],
    });

    return user ? this.toStored(user) : undefined;
  }

  /** Return every (non-deleted) user, newest first. */
  async findAll(): Promise<StoredUser[]> {
    const users = await this.repo.find({
      relations: ['tenant'],
      order: { createdAt: 'DESC' },
    });

    return users.map((u) => this.toStored(u));
  }

  /**
   * Apply a partial update to an existing user. Only defined keys on `patch`
   * are written; `undefined` values are ignored so unspecified fields keep
   * their current values.
   *
   * @throws NotFoundException when the user id does not exist.
   */
  async update(id: string, patch: UserPatch): Promise<StoredUser> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!user) {
      throw new NotFoundException({ error: 'user_not_found' });
    }

    if (patch.email !== undefined) user.email = patch.email.toLowerCase();
    if (patch.emailVerified !== undefined)
      user.emailVerified = patch.emailVerified;
    if (patch.nickname !== undefined) user.nickname = patch.nickname;
    if (patch.givenName !== undefined) user.givenName = patch.givenName;
    if (patch.familyName !== undefined) user.familyName = patch.familyName;
    if (patch.status !== undefined) user.status = patch.status;
    if (patch.password !== undefined) {
      user.passwordHash = await bcrypt.hash(patch.password, 12);
      user.passwordChangedAt = new Date();
    }

    const saved = await this.repo.save(user);
    return this.toStored(saved);
  }

  /**
   * Soft-delete a user by stamping `deletedAt`. The row is retained for
   * audit/recovery but excluded from all subsequent reads.
   *
   * @throws NotFoundException when the user id does not exist (or is already deleted).
   */
  async softDelete(id: string): Promise<void> {
    const result = await this.repo.softDelete({ id });
    if (!result.affected) {
      throw new NotFoundException({ error: 'user_not_found' });
    }
  }

  async verifyPassword(user: StoredUser, password: string): Promise<boolean> {
    if (!user.passwordHash) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  private toStored(entity: User): StoredUser {
    return {
      id: entity.id,
      tenantId: entity.tenant.id,
      email: entity.email,
      emailVerified: entity.emailVerified,
      nickname: entity.nickname,
      givenName: entity.givenName,
      familyName: entity.familyName,
      status: entity.status,
      mfaEnabled: entity.mfaEnabled,
      lastLogin: entity.lastLogin,
      passwordHash: entity.passwordHash,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
