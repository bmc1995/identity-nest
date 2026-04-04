import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClientStore, StoredClient } from '../../store/stores/client.store';
import { OidcService, OidcError } from '../oidc.service';

@Controller('oidc')
export class TokenController {
  constructor(
    private readonly clientStore: ClientStore,
    private readonly oidcService: OidcService,
  ) {}

  @Post('token')
  async token(
    @Req() req: Request,
    @Body() body: Record<string, string>,
    @Res() res: Response,
  ) {
    try {
      // Authenticate the client
      const client = await this.authenticateClient(req, body);
      if (!client) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: 'invalid_client',
          error_description: 'Client authentication failed',
        });
      }

      const grantType = body.grant_type;

      if (grantType === 'authorization_code') {
        const result = await this.oidcService.exchangeCode(
          body.code,
          client.clientId,
          body.redirect_uri,
          body.code_verifier,
        );
        return res.status(HttpStatus.OK).json(result);
      }

      if (grantType === 'refresh_token') {
        const result = await this.oidcService.refreshTokens(
          body.refresh_token,
          client.clientId,
        );
        return res.status(HttpStatus.OK).json(result);
      }

      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'unsupported_grant_type',
        error_description: `Grant type '${grantType}' is not supported`,
      });
    } catch (err) {
      if (err instanceof OidcError) {
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
    body: Record<string, string>,
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

    if (!clientId) return null;

    const client = this.clientStore.findByClientId(clientId);
    if (!client || client.status !== 'active') return null;

    // Public clients (no secret required)
    if (!client.clientSecretHash) return client;

    // Confidential clients must provide a valid secret
    if (!clientSecret) return null;
    const valid = await this.clientStore.validateSecret(client, clientSecret);
    return valid ? client : null;
  }
}
