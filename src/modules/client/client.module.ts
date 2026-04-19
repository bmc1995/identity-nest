import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StoreModule } from '../store/store.module';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

/**
 * Admin-facing client application management module.
 *
 * Imports:
 *   - {@link StoreModule} for {@link ClientStore}.
 *   - {@link AuthModule} for the `AdminGuard` that protects every route.
 */
@Module({
  imports: [StoreModule, AuthModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
