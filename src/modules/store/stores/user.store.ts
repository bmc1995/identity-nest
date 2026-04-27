import { Injectable } from '@nestjs/common';
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
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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
    options: { emailVerified?: boolean; nickname?: string | null } = {},
  ): Promise<StoredUser> {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = this.repo.create({
      tenant: { id: tenantId } as Tenant,
      email: email.toLowerCase(),
      emailVerified: options.emailVerified ?? false,
      nickname: options.nickname ?? null,
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
      passwordHash: entity.passwordHash,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
