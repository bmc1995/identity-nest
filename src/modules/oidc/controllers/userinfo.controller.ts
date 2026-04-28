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
import { UserService } from '../../user/user.service';

@Controller('oidc')
export class UserinfoController {
  private readonly logger = new Logger(UserinfoController.name);

  constructor(private readonly users: UserService) {}

  @Get('userinfo')
  @UseGuards(BearerTokenGuard)
  async userinfo(@Req() req: Request, @Res() res: Response) {
    const tokenPayload = (req as any).tokenPayload as {
      sub: string;
      scope: string;
    };

    const user = await this.users.findById(tokenPayload.sub);
    if (!user) {
      this.logger.warn(`User not found for sub=${tokenPayload.sub}`);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: 'invalid_token',
        error_description: 'User not found',
      });
    }

    const scopes = new Set(tokenPayload.scope.split(' '));
    const claims: Record<string, any> = { sub: user.id };

    if (scopes.has('profile')) {
      claims.preferred_username = user.nickname ?? user.email;
    }

    if (scopes.has('email')) {
      claims.email = user.email;
      claims.email_verified = user.emailVerified;
    }

    return res.status(HttpStatus.OK).json(claims);
  }
}
