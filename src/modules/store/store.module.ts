import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { ClientApplication } from '../../common/entities/clientApplication.entity';
import { Grant } from '../../common/entities/grant.entity';
import { Tenant } from '../../common/entities/tenant.entity';
import { UserStore } from './stores/user.store';
import { ClientStore } from './stores/client.store';
import { InteractionStore } from './stores/interaction.store';
import { AuthorizationCodeStore } from './stores/authorization-code.store';
import { GrantStore } from './stores/grant.store';
import { SeedService } from './seed.service';

const stores = [
  UserStore,
  ClientStore,
  InteractionStore,
  AuthorizationCodeStore,
  GrantStore,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ClientApplication, Grant, Tenant]),
  ],
  providers: [...stores, SeedService],
  exports: stores,
})
export class StoreModule {}
