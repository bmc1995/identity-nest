import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { AppsModule } from './modules/apps/apps.module';
import { RedisModule } from './common/cache/redis.module';
import configuration, { DatabaseConfig } from './common/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = config.getOrThrow<DatabaseConfig>('database');
        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          autoLoadEntities: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: db.synchronize,
        };
      },
    }),
    RedisModule,
    OidcModule,
    ClientModule,
    UserModule,
    StoreModule,
    AuthModule,
    AppsModule,
  ],
  controllers: [AppController, DiscoveryController, JwksController, AccountController],
  providers: [AppService, JwksService, JwtService, KeygenService],
})
export class AppModule {}
