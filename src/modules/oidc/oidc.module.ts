import { Module } from '@nestjs/common';
import { PkceService } from './services/pkce/pkce.service';
import { InteractionViewService } from './services/interaction-view/interaction-view.service';
import { ClientAuthenticatorService } from './services/client-authenticator/client-authenticator.service';
import { TokenDenylistService } from './services/token-denylist/token-denylist.service';
import { OidcService } from './oidc.service';
import { AuthorizeController } from './controllers/authorize.controller';
import { InteractionController } from './controllers/interaction.controller';
import { TokenController } from './controllers/token.controller';
import { UserinfoController } from './controllers/userinfo.controller';
import { RevokeController } from './controllers/revoke.controller';
import { DiscoveryController } from './controllers/discovery/discovery.controller';
import { ClientRegistrationController } from './controllers/client-registration.controller';
import { DynamicClientRegistrationService } from './services/dynamic-client-registration/dynamic-client-registration.service';
import { RegistrationAccessTokenGuard } from './guards/registration-access-token.guard';
import { RegistrationRateLimitGuard } from './guards/registration-rate-limit.guard';
import { StoreModule } from '../store/store.module';
import { JwksService } from '../../common/crypto/jwks/jwks.service';
import { JwtService } from '../../common/crypto/jwt/jwt.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [StoreModule, AuthModule, UserModule, ClientModule],
  controllers: [
    AuthorizeController,
    InteractionController,
    TokenController,
    UserinfoController,
    RevokeController,
    DiscoveryController,
    ClientRegistrationController,
  ],
  providers: [
    PkceService,
    InteractionViewService,
    ClientAuthenticatorService,
    TokenDenylistService,
    OidcService,
    JwksService,
    JwtService,
    DynamicClientRegistrationService,
    RegistrationAccessTokenGuard,
    RegistrationRateLimitGuard,
  ],
  exports: [OidcService, PkceService, TokenDenylistService],
})
export class OidcModule {}
