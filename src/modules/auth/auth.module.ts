import { forwardRef, Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { AdminGuard } from './guards/admin.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [SessionService, AdminGuard],
  exports: [SessionService, AdminGuard],
})
export class AuthModule {}
