import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StoreModule } from '../store/store.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

/**
 * User account module: shared {@link UserService} plus the admin-facing
 * user management API.
 *
 * Imports:
 *   - {@link StoreModule} for {@link UserStore} / {@link TenantStore}.
 *   - {@link AuthModule} (via `forwardRef`, since AuthModule's guard depends
 *     on this module's UserService) for the `AdminGuard` protecting the API.
 */
@Module({
  imports: [StoreModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
