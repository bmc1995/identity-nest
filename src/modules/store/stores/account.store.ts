import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../../../common/entities/account.entity';

export interface StoredAccount {
  id: string;
  username: string;
  email: string | null;
  emailVerified: boolean;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AccountStore {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
  ) {}

  async create(
    username: string,
    password: string,
    email?: string,
  ): Promise<StoredAccount> {
    const passwordHash = await bcrypt.hash(password, 12);

    const account = this.repo.create({
      username: username.toLowerCase(),
      email: email ?? null,
      emailVerified: false,
      passwordHash,
    });

    const saved = await this.repo.save(account);
    return this.toStored(saved);
  }

  async findById(id: string): Promise<StoredAccount | undefined> {
    const account = await this.repo.findOneBy({ id });
    return account ? this.toStored(account) : undefined;
  }

  async findByUsername(username: string): Promise<StoredAccount | undefined> {
    const account = await this.repo.findOneBy({ username: username.toLowerCase() });
    return account ? this.toStored(account) : undefined;
  }

  async verifyPassword(
    account: StoredAccount,
    password: string,
  ): Promise<boolean> {
    if (!account.passwordHash) return false;
    return bcrypt.compare(password, account.passwordHash);
  }

  private toStored(entity: Account): StoredAccount {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      emailVerified: entity.emailVerified,
      passwordHash: entity.passwordHash,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
