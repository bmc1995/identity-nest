import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscoveryController } from './common/controllers/discovery/discovery.controller';
import { JwksService } from './common/crypto/jwks/jwks.service';
import { JwksController } from './common/controllers/jwks/jwks.controller';
import { JwtService } from './common/crypto/jwt/jwt.service';
import { OidcModule } from './modules/oidc/oidc.module';
import { ClientModule } from './modules/client/client.module';
import { UserModule } from './modules/user/user.module';
import { StoreModule } from './modules/store/store.module';
import { KeygenService } from './common/crypto/keygen/keygen.service';
import { AccountController } from './common/controllers/account/account.controller';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [OidcModule, ClientModule, UserModule, StoreModule, AuthModule],
  controllers: [AppController, DiscoveryController, JwksController, AccountController],
  providers: [AppService, JwksService, JwtService, KeygenService],
})
export class AppModule {}
