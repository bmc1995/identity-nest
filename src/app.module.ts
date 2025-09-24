import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscoveryController } from './controllers/discovery/discovery.controller';
import { JwksService } from './services/jwks/jwks.service';
import { JwksController } from './controllers/jwks/jwks.controller';

@Module({
  imports: [],
  controllers: [AppController, DiscoveryController, JwksController],
  providers: [AppService, JwksService],
})
export class AppModule {}
