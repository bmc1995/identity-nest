import {
  Controller,
  Get,
  Logger,
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
import { SessionService } from '../../auth/session.service';
import { OidcService } from '../oidc.service';
import { AuthorizeQueryDto } from '../dto/authorize-query.dto';
import { PkceMethod } from '../../../common/enums/pkce-method';

@Controller('oidc')
export class AuthorizeController {
  private readonly logger = new Logger(AuthorizeController.name);

  constructor(
    private readonly clientStore: ClientStore,
    private readonly interactionStore: InteractionStore,
    private readonly grantStore: GrantStore,
    private readonly sessions: SessionService,
    private readonly oidcService: OidcService,
  ) {}

  @Get('authorize')
  async authorize(
    @Query() query: AuthorizeQueryDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      state,
      nonce,
      code_challenge: codeChallenge,
    } = query;
    let codeChallengeMethod = query.code_challenge_method;
    this.logger.log(`Authorize request for client_id=${clientId}`);

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
    const client = await this.clientStore.findByClientId(clientId);
    if (!client || client.status !== 'active') {
      this.logger.warn(`Invalid or inactive client: ${clientId}`);
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
      codeChallengeMethod = PkceMethod.PLAIN;
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
    const cookieName = this.sessions.getCookieName();
    const signedSessionId = req.cookies?.[cookieName];
    if (signedSessionId) {
      const sessionId = this.sessions.unsign(signedSessionId);
      if (sessionId) {
        const session = await this.sessions.validate(sessionId);
        if (session) {
          // User is already authenticated — check for existing consent
          const grant = await this.grantStore.findByUserAndClient(
            session.userId,
            clientId,
          );
          if (grant) {
            // Check if all requested scopes are already granted
            const grantedScopes = new Set(grant.scope.split(' '));
            const requestedScopes = scope.split(' ');
            const allGranted = requestedScopes.every((s) => grantedScopes.has(s));

            if (allGranted) {
              this.logger.log(`Existing grant covers requested scopes for user=${session.userId}, skipping consent`);
              // Skip consent — issue code immediately
              const interaction = await this.interactionStore.create('consent', {
                client_id: clientId,
                redirect_uri: redirectUri,
                response_type: responseType,
                scope,
                state,
                nonce,
                code_challenge: codeChallenge,
                code_challenge_method: codeChallengeMethod,
              });
              const currInteraction = await this.interactionStore.update(interaction.uid, {
                userId: session.userId,
              });
              const redirectUrl = await this.oidcService.completeConsent(currInteraction);
              await this.interactionStore.delete(currInteraction.uid);
              return res.redirect(303, redirectUrl);
            }
          }

          // Has session but needs consent for new scopes
          this.logger.log(`Session valid for user=${session.userId}, requesting consent for new scopes`);
          const interaction = await this.interactionStore.create('consent', {
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: responseType,
            scope,
            state,
            nonce,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod,
          });
          await this.interactionStore.update(interaction.uid, {
            userId: session.userId,
          });
          return res.redirect(303, `/interaction/${interaction.uid}`);
        }
      }
    }

    // No valid session — create login interaction
    this.logger.log(`No valid session, redirecting to login`);
    const interaction = await this.interactionStore.create('login', {
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
