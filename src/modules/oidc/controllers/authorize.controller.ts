import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClientStore } from '../../store/stores/client.store';
import { InteractionStore } from '../../store/stores/interaction.store';
import { GrantStore } from '../../store/stores/grant.store';
import { AuthService } from '../../auth/auth.service';
import { OidcService } from '../oidc.service';

@Controller('oidc')
export class AuthorizeController {
  constructor(
    private readonly clientStore: ClientStore,
    private readonly interactionStore: InteractionStore,
    private readonly grantStore: GrantStore,
    private readonly authService: AuthService,
    private readonly oidcService: OidcService,
  ) {}

  @Get('authorize')
  async authorize(
    @Query('response_type') responseType: string,
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('scope') scope: string,
    @Query('state') state: string | undefined,
    @Query('nonce') nonce: string | undefined,
    @Query('code_challenge') codeChallenge: string,
    @Query('code_challenge_method') codeChallengeMethod: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Validate required parameters
    if (!responseType || !clientId || !redirectUri || !scope || !codeChallenge) {
      throw new HttpException(
        { error: 'invalid_request', error_description: 'Missing required parameters: response_type, client_id, redirect_uri, scope, code_challenge' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (responseType !== 'code') {
      throw new HttpException(
        { error: 'unsupported_response_type', error_description: 'Only response_type=code is supported' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate client
    const client = this.clientStore.findByClientId(clientId);
    if (!client || client.status !== 'active') {
      throw new HttpException(
        { error: 'invalid_client', error_description: 'Unknown or inactive client' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate redirect_uri
    if (!client.redirectUris.includes(redirectUri)) {
      throw new HttpException(
        { error: 'invalid_request', error_description: 'Redirect URI not registered for this client' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate code_challenge_method
    if (!codeChallengeMethod) {
      codeChallengeMethod = 'plain';
    }
    if (!['S256', 'plain'].includes(codeChallengeMethod)) {
      this.redirectWithError(res, redirectUri, 'invalid_request', 'Unsupported code_challenge_method', state);
      return;
    }

    // PKCE required check
    if (client.requirePkce && codeChallengeMethod === 'plain') {
      this.redirectWithError(res, redirectUri, 'invalid_request', 'S256 code_challenge_method is required', state);
      return;
    }

    // Check for existing session
    const cookieName = this.authService.getSessionCookieName();
    const signedSessionId = req.cookies?.[cookieName];
    if (signedSessionId) {
      const sessionId = this.authService.verifySignedSessionId(signedSessionId);
      if (sessionId) {
        const session = this.authService.validateSession(sessionId);
        if (session) {
          // User is already authenticated — check for existing consent
          const grant = this.grantStore.findByAccountAndClient(
            session.accountId,
            clientId,
          );
          if (grant) {
            // Check if all requested scopes are already granted
            const grantedScopes = new Set(grant.scope.split(' '));
            const requestedScopes = scope.split(' ');
            const allGranted = requestedScopes.every((s) => grantedScopes.has(s));

            if (allGranted) {
              // Skip consent — issue code immediately
              const interaction = this.interactionStore.create('consent', {
                client_id: clientId,
                redirect_uri: redirectUri,
                response_type: responseType,
                scope,
                state,
                nonce,
                code_challenge: codeChallenge,
                code_challenge_method: codeChallengeMethod,
              });
              this.interactionStore.update(interaction.uid, {
                accountId: session.accountId,
              });
              const redirectUrl = this.oidcService.completeConsent(interaction);
              this.interactionStore.delete(interaction.uid);
              return res.redirect(303, redirectUrl);
            }
          }

          // Has session but needs consent for new scopes
          const interaction = this.interactionStore.create('consent', {
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: responseType,
            scope,
            state,
            nonce,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod,
          });
          this.interactionStore.update(interaction.uid, {
            accountId: session.accountId,
          });
          return res.redirect(303, `/interaction/${interaction.uid}`);
        }
      }
    }

    // No valid session — create login interaction
    const interaction = this.interactionStore.create('login', {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope,
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
    });

    return res.redirect(303, `/interaction/${interaction.uid}`);
  }

  private redirectWithError(
    res: Response,
    redirectUri: string,
    error: string,
    description: string,
    state?: string,
  ) {
    const url = new URL(redirectUri);
    url.searchParams.set('error', error);
    url.searchParams.set('error_description', description);
    if (state) url.searchParams.set('state', state);
    res.redirect(303, url.toString());
  }
}
