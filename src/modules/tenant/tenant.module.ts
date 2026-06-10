import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StoreModule } from '../store/store.module';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

/**
 * Admin-facing tenant management module.
 *
 * Imports:
 *   - {@link StoreModule} for {@link TenantStore}.
 *   - {@link AuthModule} for the `AdminGuard` that protects every route.
 */
@Module({
  imports: [StoreModule, AuthModule],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
