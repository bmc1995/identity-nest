import { Controller, Get } from '@nestjs/common';
import { JwksService } from '../../common/crypto/jwks/jwks.service';

@Controller('oidc')
export class JwksController {
  constructor(private readonly jwks: JwksService) {}
  @Get('jwks.json') async jwksJson() {
    return this.jwks.getJWKS();
  }
}
