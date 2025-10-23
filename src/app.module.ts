import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscoveryController } from './common/controllers/discovery/discovery.controller';
import { JwksService } from './common/crypto/jwks/jwks.service';
import { JwksController } from './common/controllers/jwks/jwks.controller';
import { JwtService } from './common/crypto/jwt/jwt.service';

@Module({
  imports: [],
  controllers: [AppController, DiscoveryController, JwksController],
  providers: [AppService, JwksService, JwtService],
})
export class AppModule {}
