import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { AdminViewService } from './admin-view.service';

/**
 * Server-rendered admin portal (`/admin`) for managing client applications
 * and users.
 *
 * Imports:
 *   - {@link AuthModule} for {@link SessionService} (login/logout cookies).
 *   - {@link UserModule} for credential verification and user lookup.
 */
@Module({
  imports: [StoreModule, AuthModule, UserModule],
  controllers: [AdminController],
  providers: [AdminViewService],
})
export class AdminModule {}
