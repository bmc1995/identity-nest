import {
  Controller,
  Get,
  Logger,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BearerTokenGuard } from '../../../common/guards/bearer-token.guard';
import { AccountStore } from '../../store/stores/account.store';

@Controller('oidc')
export class UserinfoController {
  private readonly logger = new Logger(UserinfoController.name);

  constructor(private readonly accountStore: AccountStore) {}

  @Get('userinfo')
  @UseGuards(BearerTokenGuard)
  async userinfo(@Req() req: Request, @Res() res: Response) {
    const tokenPayload = (req as any).tokenPayload as {
      sub: string;
      scope: string;
    };

    const account = await this.accountStore.findById(tokenPayload.sub);
    if (!account) {
      this.logger.warn(`Account not found for sub=${tokenPayload.sub}`);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: 'invalid_token',
        error_description: 'Account not found',
      });
    }

    const scopes = new Set(tokenPayload.scope.split(' '));
    const claims: Record<string, any> = { sub: account.id };

    if (scopes.has('profile')) {
      claims.preferred_username = account.username;
    }

    if (scopes.has('email')) {
      claims.email = account.email;
      claims.email_verified = account.emailVerified;
    }

    return res.status(HttpStatus.OK).json(claims);
  }
}
