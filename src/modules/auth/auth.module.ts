import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StoreModule } from '../store/store.module';
import { OidcModule } from '../oidc/oidc.module';

@Module({
  imports: [StoreModule, forwardRef(() => OidcModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
