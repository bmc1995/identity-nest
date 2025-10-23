import { Module } from '@nestjs/common';
import { PkceService } from './services/pkce/pkce.service';

@Module({
  providers: [PkceService],
})
export class OidcModule {}
