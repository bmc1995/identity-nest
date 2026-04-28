import { Injectable, Logger } from '@nestjs/common';
import { UserStore, StoredUser } from '../store/stores/user.store';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userStore: UserStore) {}

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
}
