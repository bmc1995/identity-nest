import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../common/entities/account.entity';
import { ClientApplication } from '../../common/entities/clientApplication.entity';
import { Interaction } from '../../common/entities/interaction.entity';
import { AuthorizationCode } from '../../common/entities/authorizationCode';
import { Grant } from '../../common/entities/grant.entity';
import { Tenant } from '../../common/entities/tenant.entity';
import { AccountStore } from './stores/account.store';
import { ClientStore } from './stores/client.store';
import { InteractionStore } from './stores/interaction.store';
import { AuthorizationCodeStore } from './stores/authorization-code.store';
import { GrantStore } from './stores/grant.store';
import { SeedService } from './seed.service';

const stores = [
  AccountStore,
  ClientStore,
  InteractionStore,
  AuthorizationCodeStore,
  GrantStore,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      ClientApplication,
      Interaction,
      AuthorizationCode,
      Grant,
      Tenant,
    ]),
  ],
  providers: [...stores, SeedService],
  exports: stores,
})
export class StoreModule {}
