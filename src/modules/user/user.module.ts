import { Module } from '@nestjs/common';
import { StoreModule } from '../store/store.module';
import { UserService } from './user.service';

@Module({
  imports: [StoreModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
