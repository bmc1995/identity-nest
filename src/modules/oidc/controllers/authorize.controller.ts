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
import {
  defaultResponseMode,
  isResponseModeAllowed,
  parseResponseType,
  ResponseMode,
} from '../utils/response-type';

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

    // Required parameters common to every response_type.
    if (!responseType || !clientId || !redirectUri || !scope) {
      throw new HttpException(
        {
          error: 'invalid_request',
          error_description:
            'Missing required parameters: response_type, client_id, redirect_uri, scope',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate the client and redirect_uri before trusting the redirect target.
    // Errors here cannot be safely redirected, so they surface as 400s.
    const client = await this.clientStore.findByClientId(clientId);
    if (!client || client.status !== 'active') {
      this.logger.warn(`Invalid or inactive client: ${clientId}`);
      throw new HttpException(
        {
          error: 'invalid_client',
          error_description: 'Unknown or inactive client',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!client.redirectUris.includes(redirectUri)) {
      throw new HttpException(
        {
          error: 'invalid_request',
          error_description: 'Redirect URI not registered for this client',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // redirect_uri is trusted from here on — remaining errors go back to the
    // client via the redirect, in the response_mode they will receive.
    const parsed = parseResponseType(responseType);
    if (!parsed) {
      this.redirectWithError(
        res,
        redirectUri,
        'unsupported_response_type',
        `Unsupported response_type: ${responseType}`,
        state,
      );
      return;
    }

    // Resolve response_mode (explicit override or per-type default).
    let responseMode: ResponseMode;
    if (query.response_mode) {
      if (query.response_mode !== 'query' && query.response_mode !== 'fragment') {
        this.redirectWithError(
          res,
          redirectUri,
          'invalid_request',
          'Unsupported response_mode',
          state,
        );
        return;
      }
      responseMode = query.response_mode;
      if (!isResponseModeAllowed(parsed, responseMode)) {
        this.redirectWithError(
          res,
          redirectUri,
          'invalid_request',
          'response_mode=query is not allowed for a token-bearing response_type',
          state,
          defaultResponseMode(parsed),
        );
        return;
      }
    } else {
      responseMode = defaultResponseMode(parsed);
    }

    // PKCE applies only to flows that return an authorization code.
    if (parsed.hasCode) {
      if (!codeChallenge) {
        this.redirectWithError(
          res,
          redirectUri,
          'invalid_request',
          'code_challenge is required',
          state,
          responseMode,
        );
        return;
      }
      if (!codeChallengeMethod) {
        codeChallengeMethod = PkceMethod.PLAIN;
      }
      if (!['S256', 'plain'].includes(codeChallengeMethod)) {
        this.redirectWithError(
          res,
          redirectUri,
          'invalid_request',
          'Unsupported code_challenge_method',
          state,
          responseMode,
        );
        return;
      }
      if (client.requirePkce && codeChallengeMethod === 'plain') {
        this.redirectWithError(
          res,
          redirectUri,
          'invalid_request',
          'S256 code_challenge_method is required',
          state,
          responseMode,
        );
        return;
      }
    }

    // When an ID token is returned directly (implicit/hybrid), OIDC requires a
    // nonce and the openid scope.
    if (parsed.hasIdToken) {
      if (!nonce) {
        this.redirectWithError(
          res,
          redirectUri,
          'invalid_request',
          'nonce is required for this response_type',
          state,
          responseMode,
        );
        return;
      }
      if (!scope.split(' ').includes('openid')) {
        this.redirectWithError(
          res,
          redirectUri,
          'invalid_scope',
          'openid scope is required for this response_type',
          state,
          responseMode,
        );
        return;
      }
    }

    // Snapshot of the request to resume after any login/consent prompt.
    const interactionParams = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      response_mode: responseMode,
      scope,
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
    };

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
            const allGranted = requestedScopes.every((s) =>
              grantedScopes.has(s),
            );

            if (allGranted) {
              this.logger.log(
                `Existing grant covers requested scopes for user=${session.userId}, skipping consent`,
              );
              // Skip consent — issue the response artifacts immediately
              const interaction = await this.interactionStore.create(
                'consent',
                interactionParams,
              );
              const currInteraction = await this.interactionStore.update(
                interaction.uid,
                {
                  userId: session.userId,
                },
              );
              const redirectUrl =
                await this.oidcService.completeConsent(currInteraction);
              await this.interactionStore.delete(currInteraction.uid);
              return res.redirect(303, redirectUrl);
            }
          }

          // Has session but needs consent for new scopes
          this.logger.log(
            `Session valid for user=${session.userId}, requesting consent for new scopes`,
          );
          const interaction = await this.interactionStore.create(
            'consent',
            interactionParams,
          );
          await this.interactionStore.update(interaction.uid, {
            userId: session.userId,
          });
          return res.redirect(303, `/interaction/${interaction.uid}`);
        }
      }
    }

    // No valid session — create login interaction
    this.logger.log(`No valid session, redirecting to login`);
    const interaction = await this.interactionStore.create(
      'login',
      interactionParams,
    );

    return res.redirect(303, `/interaction/${interaction.uid}`);
  }

  @Get('/sessions/logout')
  private async endSession(@Req() req: Request, @Res() res: Response) {
    // Check for existing session
    const cookieName = this.sessions.getCookieName();
    const signedSessionId = req.cookies?.[cookieName];
    if (signedSessionId) {
      const sessionId = this.sessions.unsign(signedSessionId);
      if (sessionId) {
        const session = await this.sessions.validate(sessionId);
        const grants = await this.grantStore.findByUser(session.userId);
        if (grants.length) {
          grants.forEach((grant) => {
            this.grantStore.revoke(grant.id);
          });
        }
        this.sessions.destroy(sessionId);
      }
    }
  }

  private redirectWithError(
    res: Response,
    redirectUri: string,
    error: string,
    description: string,
    state?: string,
    mode: ResponseMode = 'query',
  ) {
    const url = new URL(redirectUri);
    const params = new URLSearchParams();
    params.set('error', error);
    params.set('error_description', description);
    if (state) params.set('state', state);
    if (mode === 'fragment') {
      url.hash = params.toString();
    } else {
      for (const [key, value] of params) url.searchParams.set(key, value);
    }
    res.redirect(303, url.toString());
  }
}
