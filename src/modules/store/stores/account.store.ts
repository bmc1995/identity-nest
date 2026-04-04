import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export interface StoredAccount {
  id: string;
  username: string;
  email: string | null;
  emailVerified: boolean;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AccountStore implements OnModuleInit {
  private accounts = new Map<string, StoredAccount>();
  private usernameIndex = new Map<string, string>(); // username → id

  async onModuleInit() {
    // Seed a test account
    await this.create('testuser', 'password', 'test@example.com');
  }

  async create(
    username: string,
    password: string,
    email?: string,
  ): Promise<StoredAccount> {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    const account: StoredAccount = {
      id,
      username: username.toLowerCase(),
      email: email ?? null,
      emailVerified: false,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    this.accounts.set(id, account);
    this.usernameIndex.set(account.username, id);
    return account;
  }

  findById(id: string): StoredAccount | undefined {
    return this.accounts.get(id);
  }

  findByUsername(username: string): StoredAccount | undefined {
    const id = this.usernameIndex.get(username.toLowerCase());
    return id ? this.accounts.get(id) : undefined;
  }

  async verifyPassword(
    account: StoredAccount,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, account.passwordHash);
  }
}
