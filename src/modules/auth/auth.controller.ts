import {
  Controller,
  Get,
  Logger,
  Post,
  Param,
  Body,
  Res,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { InteractionStore } from '../store/stores/interaction.store';
import { OidcService } from '../oidc/oidc.service';

@Controller('interaction')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly interactionStore: InteractionStore,
    private readonly oidcService: OidcService,
  ) {}

  @Get(':uid')
  async showInteraction(
    @Param('uid') uid: string,
    @Res() res: Response,
  ) {
    const interaction = await this.interactionStore.find(uid);
    if (!interaction) {
      this.logger.warn(`Interaction not found: ${uid}`);
      throw new HttpException('Interaction not found or expired', HttpStatus.BAD_REQUEST);
    }

    if (interaction.prompt === 'login') {
      return res.status(200).header('Content-Type', 'text/html').send(
        this.renderLoginPage(uid, interaction.params.client_id),
      );
    }

    if (interaction.prompt === 'consent') {
      const scopes = interaction.params.scope.split(' ');
      return res.status(200).header('Content-Type', 'text/html').send(
        this.renderConsentPage(uid, interaction.params.client_id, scopes),
      );
    }

    this.logger.error(`Unknown interaction prompt "${interaction.prompt}" for uid=${uid}`);
    throw new HttpException('Unknown interaction prompt', HttpStatus.BAD_REQUEST);
  }

  @Post(':uid/login')
  async submitLogin(
    @Param('uid') uid: string,
    @Body() body: { username: string; password: string },
    @Res() res: Response,
  ) {
    const interaction = await this.interactionStore.find(uid);
    if (!interaction || interaction.prompt !== 'login') {
      this.logger.warn(`Login submission for invalid or expired interaction: ${uid}`);
      throw new HttpException('Interaction not found or expired', HttpStatus.BAD_REQUEST);
    }

    const account = await this.authService.authenticate(
      body.username,
      body.password,
    );
    if (!account) {
      this.logger.warn(`Failed login attempt for username="${body.username}" on interaction=${uid}`);
      return res.status(200).header('Content-Type', 'text/html').send(
        this.renderLoginPage(uid, interaction.params.client_id, 'Invalid username or password'),
      );
    }

    // Create session and set cookie
    const session = this.authService.createSession(account.id);
    const signedId = this.authService.signSessionId(session.sessionId);
    res.cookie(this.authService.getSessionCookieName(), signedId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    // Advance interaction to consent
    await this.interactionStore.update(uid, {
      prompt: 'consent',
      accountId: account.id,
    });

    return res.redirect(303, `/interaction/${uid}`);
  }

  @Post(':uid/consent')
  async submitConsent(
    @Param('uid') uid: string,
    @Body() body: { approved?: string },
    @Res() res: Response,
  ) {
    const interaction = await this.interactionStore.find(uid);
    if (!interaction || interaction.prompt !== 'consent' || !interaction.accountId) {
      this.logger.warn(`Consent submission for invalid or expired interaction: ${uid}`);
      throw new HttpException('Interaction not found or expired', HttpStatus.BAD_REQUEST);
    }

    if (body.approved !== 'true') {
      this.logger.warn(`User denied consent for client_id=${interaction.params.client_id}, interaction=${uid}`);
      // User denied consent — redirect back with error
      const redirectUri = new URL(interaction.params.redirect_uri);
      redirectUri.searchParams.set('error', 'access_denied');
      redirectUri.searchParams.set('error_description', 'The user denied the authorization request');
      if (interaction.params.state) {
        redirectUri.searchParams.set('state', interaction.params.state);
      }
      await this.interactionStore.delete(uid);
      return res.redirect(303, redirectUri.toString());
    }

    // Complete the consent and get the redirect URL with auth code
    const redirectUrl = await this.oidcService.completeConsent(interaction);
    await this.interactionStore.delete(uid);
    return res.redirect(303, redirectUrl);
  }

  @Get(':uid/abort')
  async abortInteraction(
    @Param('uid') uid: string,
    @Res() res: Response,
  ) {
    const interaction = await this.interactionStore.find(uid);
    if (!interaction) {
      this.logger.warn(`Abort requested for unknown interaction: ${uid}`);
      throw new HttpException('Interaction not found', HttpStatus.BAD_REQUEST);
    }

    this.logger.warn(`Interaction aborted: uid=${uid}, client_id=${interaction.params.client_id}`);
    const redirectUri = new URL(interaction.params.redirect_uri);
    redirectUri.searchParams.set('error', 'access_denied');
    redirectUri.searchParams.set('error_description', 'The authorization request was aborted');
    if (interaction.params.state) {
      redirectUri.searchParams.set('state', interaction.params.state);
    }
    await this.interactionStore.delete(uid);
    return res.redirect(303, redirectUri.toString());
  }

  private renderLoginPage(uid: string, clientId: string, error?: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign In</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 2rem; width: 100%; max-width: 400px; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .subtitle { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .error { background: #fee; color: #c00; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; font-size: 0.9rem; }
    label { display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.9rem; }
    input[type="text"], input[type="password"] { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; margin-bottom: 1rem; }
    button { width: 100%; padding: 0.75rem; background: #111; color: #fff; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    button:hover { background: #333; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Sign In</h1>
    <p class="subtitle">Application <strong>${this.escapeHtml(clientId)}</strong> is requesting access</p>
    ${error ? `<div class="error">${this.escapeHtml(error)}</div>` : ''}
    <form method="POST" action="/interaction/${this.escapeHtml(uid)}/login">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" required autofocus>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required>
      <button type="submit">Sign In</button>
    </form>
  </div>
</body>
</html>`;
  }

  private renderConsentPage(uid: string, clientId: string, scopes: string[]): string {
    const scopeList = scopes
      .map((s) => `<li>${this.escapeHtml(this.scopeDescription(s))}</li>`)
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Authorize</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 2rem; width: 100%; max-width: 400px; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .subtitle { color: #666; margin-bottom: 1rem; font-size: 0.9rem; }
    ul { margin: 0 0 1.5rem 1.5rem; }
    li { margin-bottom: 0.25rem; }
    .actions { display: flex; gap: 0.75rem; }
    button { flex: 1; padding: 0.75rem; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    .approve { background: #111; color: #fff; }
    .approve:hover { background: #333; }
    .deny { background: #eee; color: #333; }
    .deny:hover { background: #ddd; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Authorize</h1>
    <p class="subtitle"><strong>${this.escapeHtml(clientId)}</strong> is requesting the following permissions:</p>
    <ul>${scopeList}</ul>
    <div class="actions">
      <form method="POST" action="/interaction/${this.escapeHtml(uid)}/consent" style="flex:1">
        <input type="hidden" name="approved" value="true">
        <button type="submit" class="approve">Allow</button>
      </form>
      <form method="POST" action="/interaction/${this.escapeHtml(uid)}/consent" style="flex:1">
        <input type="hidden" name="approved" value="false">
        <button type="submit" class="deny">Deny</button>
      </form>
    </div>
  </div>
</body>
</html>`;
  }

  private scopeDescription(scope: string): string {
    const descriptions: Record<string, string> = {
      openid: 'Verify your identity',
      profile: 'Access your profile information (name, picture)',
      email: 'Access your email address',
      offline_access: 'Maintain access when you are not present',
    };
    return descriptions[scope] ?? scope;
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
