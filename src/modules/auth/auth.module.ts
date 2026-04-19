import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminGuard } from './guards/admin.guard';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [StoreModule],
  providers: [AuthService, AdminGuard],
  exports: [AuthService, AdminGuard],
})
export class AuthModule {}
