import { Module } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { StoreModule } from '../store/store.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [StoreModule, AuthModule],
  controllers: [AppsController],
})
export class AppsModule {}
