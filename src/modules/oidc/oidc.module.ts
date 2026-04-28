import { Module } from '@nestjs/common';
import { PkceService } from './services/pkce/pkce.service';
import { InteractionViewService } from './services/interaction-view/interaction-view.service';
import { OidcService } from './oidc.service';
import { AuthorizeController } from './controllers/authorize.controller';
import { InteractionController } from './controllers/interaction.controller';
import { TokenController } from './controllers/token.controller';
import { UserinfoController } from './controllers/userinfo.controller';
import { StoreModule } from '../store/store.module';
import { JwksService } from '../../common/crypto/jwks/jwks.service';
import { JwtService } from '../../common/crypto/jwt/jwt.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [StoreModule, AuthModule, UserModule],
  controllers: [
    AuthorizeController,
    InteractionController,
    TokenController,
    UserinfoController,
  ],
  providers: [
    PkceService,
    InteractionViewService,
    OidcService,
    JwksService,
    JwtService,
  ],
  exports: [OidcService, PkceService],
})
export class OidcModule {}
