import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { isAdminEmail } from '../auth/admin-emails';
import { SessionService } from '../auth/session.service';
import { UserService } from '../user/user.service';
import { StoredUser } from '../store/stores/user.store';
import { AdminViewService } from './admin-view.service';
import { AdminLoginDto } from './dto/admin-login.dto';

/**
 * Server-rendered admin portal for managing client applications and users.
 *
 * Mounts under `/admin`:
 *   - `GET  /admin`        — the portal page (redirects to login when unauthenticated)
 *   - `GET  /admin/login`  — login form
 *   - `POST /admin/login`  — credential check; issues the same signed session
 *                            cookie used by the OIDC interaction flow
 *   - `POST /admin/logout` — destroys the session and clears the cookie
 *
 * The portal page itself is a static shell; all data access goes through the
 * JSON management APIs, which are enforced by {@link AdminGuard}. The page
 * routes only decide between rendering and redirecting, so they validate the
 * session inline instead of using the guard (which responds with JSON errors).
 */
@ApiExcludeController()
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly sessions: SessionService,
    private readonly users: UserService,
    private readonly view: AdminViewService,
  ) {}

  @Get()
  async portal(@Req() req: Request, @Res() res: Response) {
    const admin = await this.currentAdmin(req);
    if (!admin) {
      return res.redirect(303, '/admin/login');
    }
    return res
      .status(200)
      .header('Content-Type', 'text/html')
      .send(this.view.renderPortal(admin.email));
  }

  @Get('login')
  async loginPage(@Req() req: Request, @Res() res: Response) {
    const admin = await this.currentAdmin(req);
    if (admin) {
      return res.redirect(303, '/admin');
    }
    return res
      .status(200)
      .header('Content-Type', 'text/html')
      .send(this.view.renderLogin());
  }

  @Post('login')
  async login(@Body() body: AdminLoginDto, @Res() res: Response) {
    const user = await this.users.verifyCredentials(body.email, body.password);
    if (!user || !isAdminEmail(user.email)) {
      this.logger.warn(`Failed admin portal login for "${body.email}"`);
      return res
        .status(200)
        .header('Content-Type', 'text/html')
        .send(this.view.renderLogin('Invalid credentials or not an administrator'));
    }

    const session = await this.sessions.create(user.id);
    res.cookie(this.sessions.getCookieName(), this.sessions.sign(session.sessionId), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: this.sessions.getTtlMs(),
      path: '/',
    });

    this.logger.log(`Admin "${user.email}" signed in to the portal`);
    return res.redirect(303, '/admin');
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const signed = req.cookies?.[this.sessions.getCookieName()];
    if (signed) {
      const sessionId = this.sessions.unsign(signed);
      if (sessionId) {
        await this.sessions.destroy(sessionId);
      }
    }
    res.clearCookie(this.sessions.getCookieName(), { path: '/' });
    return res.redirect(303, '/admin/login');
  }

  /**
   * Resolve the request's session cookie to an admin user, or null when the
   * cookie is missing, invalid, expired, or belongs to a non-admin.
   */
  private async currentAdmin(req: Request): Promise<StoredUser | null> {
    const signed = req.cookies?.[this.sessions.getCookieName()];
    if (!signed) return null;

    const sessionId = this.sessions.unsign(signed);
    if (!sessionId) return null;

    const session = await this.sessions.validate(sessionId);
    if (!session) return null;

    const user = await this.users.findById(session.userId);
    if (!user || !isAdminEmail(user.email)) return null;

    return user;
  }
}
