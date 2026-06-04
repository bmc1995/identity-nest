import {
  Controller,
  Logger,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OidcService, OidcError } from '../oidc.service';
import { ClientAuthenticatorService } from '../services/client-authenticator/client-authenticator.service';
import { TokenRequestDto } from '../dto/token-request.dto';

@Controller('oidc')
export class TokenController {
  private readonly logger = new Logger(TokenController.name);

  constructor(
    private readonly clientAuth: ClientAuthenticatorService,
    private readonly oidcService: OidcService,
  ) {}

  @Post('token')
  async token(
    @Req() req: Request,
    @Body() body: TokenRequestDto,
    @Res() res: Response,
  ) {
    try {
      const client = await this.clientAuth.authenticate(req, body);
      if (!client) {
        this.logger.warn(`Client authentication failed`);
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: 'invalid_client',
          error_description: 'Client authentication failed',
        });
      }

      const grantType = body.grant_type;
      this.logger.log(`Token request: grant_type=${grantType}, client_id=${client.clientId}`);

      if (grantType === 'authorization_code') {
        const result = await this.oidcService.exchangeCode(
          body.code,
          client.clientId,
          body.redirect_uri,
          body.code_verifier,
        );
        this.logger.log(`Authorization code exchanged successfully for client_id=${client.clientId}`);
        return res.status(HttpStatus.OK).json(result);
      }

      if (grantType === 'refresh_token') {
        const result = await this.oidcService.refreshTokens(
          body.refresh_token,
          client.clientId,
        );
        this.logger.log(`Token refreshed successfully for client_id=${client.clientId}`);
        return res.status(HttpStatus.OK).json(result);
      }

      this.logger.warn(`Unsupported grant_type=${grantType} from client_id=${client.clientId}`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'unsupported_grant_type',
        error_description: `Grant type '${grantType}' is not supported`,
      });
    } catch (err) {
      if (err instanceof OidcError) {
        this.logger.warn(`Token error: ${err.error} — ${err.errorDescription}`);
        const status =
          err.error === 'invalid_client'
            ? HttpStatus.UNAUTHORIZED
            : HttpStatus.BAD_REQUEST;
        return res.status(status).json({
          error: err.error,
          error_description: err.errorDescription,
        });
      }
      throw err;
    }
  }
}
