import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminGuard } from './guards/admin.guard';
import { StoreModule } from '../store/store.module';
import { OidcModule } from '../oidc/oidc.module';

@Module({
  imports: [StoreModule, forwardRef(() => OidcModule)],
  controllers: [AuthController],
  providers: [AuthService, AdminGuard],
  exports: [AuthService, AdminGuard],
})
export class AuthModule {}
