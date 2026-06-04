import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { OidcService } from '../oidc.service';
import { ClientAuthenticatorService } from '../services/client-authenticator/client-authenticator.service';
import { RevokeRequestDto } from '../dto/revoke-request.dto';

/**
 * OAuth 2.0 Token Revocation (RFC 7009).
 *
 * Responds 200 OK in all success and "unknown token" cases so the caller
 * cannot use the endpoint as an oracle to probe token validity. Only client
 * authentication failures surface as 401.
 */
@ApiTags('oidc')
@Controller('oidc')
export class RevokeController {
  private readonly logger = new Logger(RevokeController.name);

  constructor(
    private readonly clientAuth: ClientAuthenticatorService,
    private readonly oidcService: OidcService,
  ) {}

  @Post('revoke')
  async revoke(
    @Req() req: Request,
    @Body() body: RevokeRequestDto,
    @Res() res: Response,
  ) {
    const client = await this.clientAuth.authenticate(req, body);
    if (!client) {
      this.logger.warn('Revocation: client authentication failed');
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: 'invalid_client',
        error_description: 'Client authentication failed',
      });
    }

    if (!body.token) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'invalid_request',
        error_description: 'Missing "token" parameter',
      });
    }

    await this.oidcService.revokeToken(body.token, client.clientId);
    this.logger.log(`Revocation processed for client_id=${client.clientId}`);
    return res.status(HttpStatus.OK).send();
  }
}
