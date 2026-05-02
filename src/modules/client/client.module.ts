import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StoreModule } from '../store/store.module';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { UserModule } from '../user/user.module';

/**
 * Admin-facing client application management module.
 *
 * Imports:
 *   - {@link StoreModule} for {@link ClientStore}.
 *   - {@link AuthModule} for the `AdminGuard` that protects every route.
 */
@Module({
  imports: [StoreModule, AuthModule, UserModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
