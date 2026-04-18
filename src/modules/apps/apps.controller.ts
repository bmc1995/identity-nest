import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { ClientStore, StoredClient } from '../store/stores/client.store';
import { GrantStore, StoredGrant } from '../store/stores/grant.store';

@Controller('apps')
export class AppsController {
  private readonly logger = new Logger(AppsController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly clientStore: ClientStore,
    private readonly grantStore: GrantStore,
  ) {}

  @Get()
  async listApps(@Req() req: Request, @Res() res: Response) {
    // Check for authenticated session
    const cookieName = this.authService.getSessionCookieName();
    const signedSessionId = req.cookies?.[cookieName];

    if (!signedSessionId) {
      return res.redirect(303, '/apps/login');
    }

    const sessionId = this.authService.verifySignedSessionId(signedSessionId);
    if (!sessionId) {
      return res.redirect(303, '/apps/login');
    }

    const session = this.authService.validateSession(sessionId);
    if (!session) {
      return res.redirect(303, '/apps/login');
    }

    const clients = await this.clientStore.findAllActive();
    const grants = await this.grantStore.findByAccount(session.accountId);
    const grantsByClient = new Map(grants.map((g) => [g.clientId, g]));

    this.logger.log(`Rendering app selector for account=${session.accountId}, ${clients.length} apps available`);

    return res
      .status(200)
      .header('Content-Type', 'text/html')
      .send(this.renderAppsPage(clients, grantsByClient));
  }

  @Get('login')
  async showLogin(@Req() req: Request, @Res() res: Response) {
    // If already logged in, go to apps
    const cookieName = this.authService.getSessionCookieName();
    const signedSessionId = req.cookies?.[cookieName];
    if (signedSessionId) {
      const sessionId = this.authService.verifySignedSessionId(signedSessionId);
      if (sessionId && this.authService.validateSession(sessionId)) {
        return res.redirect(303, '/apps');
      }
    }

    const error = req.query.error as string | undefined;
    return res
      .status(200)
      .header('Content-Type', 'text/html')
      .send(this.renderLoginPage(error));
  }

  @Post('login')
  async submitLogin(
    @Body() body: { username: string; password: string },
    @Res() res: Response,
  ) {
    const account = await this.authService.authenticate(
      body.username,
      body.password,
    );
    if (!account) {
      this.logger.warn(`Failed login attempt from apps page for username="${body.username}"`);
      return res.redirect(303, '/apps/login?error=Invalid+username+or+password');
    }

    const session = this.authService.createSession(account.id);
    const signedId = this.authService.signSessionId(session.sessionId);
    res.cookie(this.authService.getSessionCookieName(), signedId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    this.logger.log(`User "${body.username}" signed in from apps page`);
    return res.redirect(303, '/apps');
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const cookieName = this.authService.getSessionCookieName();
    const signedSessionId = req.cookies?.[cookieName];
    if (signedSessionId) {
      const sessionId = this.authService.verifySignedSessionId(signedSessionId);
      if (sessionId) {
        this.authService.destroySession(sessionId);
      }
    }
    res.clearCookie(cookieName, { path: '/' });
    return res.redirect(303, '/apps/login');
  }

  private renderAppsPage(
    clients: StoredClient[],
    grantsByClient: Map<string, StoredGrant>,
  ): string {
    const cards = clients
      .map((client) => {
        const grant = grantsByClient.get(client.clientId);
        const statusBadge = grant
          ? '<span class="badge connected">Connected</span>'
          : '<span class="badge available">Available</span>';
        const scopes = grant
          ? `<p class="scopes">Scopes: ${this.escapeHtml(grant.scope)}</p>`
          : '';
        const typeLabel = this.clientTypeLabel(client.type);
        const launchUrl = `/oidc/authorize?response_type=code&client_id=${encodeURIComponent(client.clientId)}&redirect_uri=${encodeURIComponent(client.redirectUris[0])}&scope=openid%20profile%20email&code_challenge=placeholder&code_challenge_method=S256`;

        return `
      <div class="card">
        <div class="card-icon">${this.clientTypeIcon(client.type)}</div>
        <div class="card-body">
          <div class="card-header">
            <h2>${this.escapeHtml(client.name)}</h2>
            ${statusBadge}
          </div>
          <p class="meta">${typeLabel} &middot; <code>${this.escapeHtml(client.clientId)}</code></p>
          ${scopes}
        </div>
        <a href="${launchUrl}" class="launch-btn">Launch</a>
      </div>`;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Applications</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f0f2f5;
      color: #1a1a1a;
      min-height: 100vh;
    }
    .topbar {
      background: #111;
      color: #fff;
      padding: 0.75rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .topbar h1 { font-size: 1.1rem; font-weight: 600; }
    .topbar a { color: #aaa; text-decoration: none; font-size: 0.85rem; }
    .topbar a:hover { color: #fff; }
    .container {
      max-width: 720px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .page-title {
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .page-subtitle {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    .card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      padding: 1.25rem;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: box-shadow 0.15s ease;
    }
    .card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      background: #f0f2f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      flex-shrink: 0;
    }
    .card-body { flex: 1; min-width: 0; }
    .card-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
    .card-header h2 { font-size: 1rem; font-weight: 600; }
    .badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .badge.connected { background: #dcfce7; color: #166534; }
    .badge.available { background: #f0f2f5; color: #666; }
    .meta { font-size: 0.8rem; color: #888; }
    .meta code {
      background: #f5f5f5;
      padding: 0.1rem 0.35rem;
      border-radius: 3px;
      font-size: 0.75rem;
    }
    .scopes { font-size: 0.8rem; color: #555; margin-top: 0.25rem; }
    .launch-btn {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1.25rem;
      background: #111;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s ease;
    }
    .launch-btn:hover { background: #333; }
    .empty {
      text-align: center;
      padding: 3rem;
      color: #888;
      font-size: 0.95rem;
    }
  </style>
</head>
<body>
  <div class="topbar">
    <h1>Identity</h1>
    <a href="/apps/logout">Sign out</a>
  </div>
  <div class="container">
    <h1 class="page-title">My Applications</h1>
    <p class="page-subtitle">Select an application to launch</p>
    ${clients.length > 0 ? cards : '<div class="empty">No applications available</div>'}
  </div>
</body>
</html>`;
  }

  private renderLoginPage(error?: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign In</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f0f2f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .card {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      padding: 2rem;
      width: 100%;
      max-width: 380px;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .subtitle { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .error { background: #fee; color: #c00; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.85rem; }
    label { display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.85rem; }
    input[type="text"], input[type="password"] {
      width: 100%;
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }
    input:focus { outline: none; border-color: #111; }
    button {
      width: 100%;
      padding: 0.7rem;
      background: #111;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
    }
    button:hover { background: #333; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Sign In</h1>
    <p class="subtitle">Sign in to view your applications</p>
    ${error ? `<div class="error">${this.escapeHtml(error)}</div>` : ''}
    <form method="POST" action="/apps/login">
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

  private clientTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      web: 'Web Application',
      spa: 'Single-Page App',
      native: 'Native App',
    };
    return labels[type] ?? type;
  }

  private clientTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      web: '&#127760;',
      spa: '&#9889;',
      native: '&#128241;',
    };
    return icons[type] ?? '&#128187;';
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
