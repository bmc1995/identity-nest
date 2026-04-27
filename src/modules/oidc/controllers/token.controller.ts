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
import { ClientStore, StoredClient } from '../../store/stores/client.store';
import { OidcService, OidcError } from '../oidc.service';
import { TokenRequestDto } from '../dto/token-request.dto';

@Controller('oidc')
export class TokenController {
  private readonly logger = new Logger(TokenController.name);

  constructor(
    private readonly clientStore: ClientStore,
    private readonly oidcService: OidcService,
  ) {}

  @Post('token')
  async token(
    @Req() req: Request,
    @Body() body: TokenRequestDto,
    @Res() res: Response,
  ) {
    try {
      // Authenticate the client
      const client = await this.authenticateClient(req, body);
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

  /**
   * Authenticate the client via Basic auth or POST body credentials.
   */
  private async authenticateClient(
    req: Request,
    body: TokenRequestDto,
  ): Promise<StoredClient | null> {
    let clientId: string | undefined;
    let clientSecret: string | undefined;

    // Try HTTP Basic auth first
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Basic ')) {
      const decoded = Buffer.from(authHeader.slice(6), 'base64').toString();
      const colonIndex = decoded.indexOf(':');
      if (colonIndex !== -1) {
        clientId = decodeURIComponent(decoded.substring(0, colonIndex));
        clientSecret = decodeURIComponent(decoded.substring(colonIndex + 1));
      }
    }

    // Fall back to POST body
    if (!clientId) {
      clientId = body.client_id;
      clientSecret = body.client_secret;
    }

    if (!clientId) {
      this.logger.warn('No client_id provided in token request');
      return null;
    }

    const client = await this.clientStore.findByClientId(clientId);
    if (!client || client.status !== 'active') {
      this.logger.warn(`Unknown or inactive client: ${clientId}`);
      return null;
    }

    // Public clients (no secret required)
    if (!client.clientSecretHash) return client;

    // Confidential clients must provide a valid secret
    if (!clientSecret) {
      this.logger.warn(`Confidential client ${clientId} did not provide a secret`);
      return null;
    }
    const valid = await this.clientStore.validateSecret(client, clientSecret);
    if (!valid) {
      this.logger.warn(`Invalid secret for client ${clientId}`);
    }
    return valid ? client : null;
  }
}
