import { Module } from '@nestjs/common';
import { AccountStore } from './stores/account.store';
import { ClientStore } from './stores/client.store';
import { InteractionStore } from './stores/interaction.store';
import { AuthorizationCodeStore } from './stores/authorization-code.store';
import { GrantStore } from './stores/grant.store';

const stores = [
  AccountStore,
  ClientStore,
  InteractionStore,
  AuthorizationCodeStore,
  GrantStore,
];

@Module({
  providers: stores,
  exports: stores,
})
export class StoreModule {}
