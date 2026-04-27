import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { UserStore } from '../../store/stores/user.store';

/**
 * Guards routes that require an authenticated admin user.
 *
 * Validates the signed session cookie issued by the OIDC interaction
 * login flow, loads the user, and checks its email against the
 * `ADMIN_EMAILS` env allowlist (comma-separated; defaults to `admin@example.com`).
 *
 * Attaches the admin user to `req.adminUser` on success.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userStore: UserStore,
  ) {}

  /**
   * Authorizes the request if a valid session belongs to an allowlisted admin.
   * @throws UnauthorizedException when the session is missing, tampered, or expired.
   * @throws ForbiddenException when the user is not in the admin allowlist.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const cookieName = this.authService.getSessionCookieName();
    const signed = request.cookies?.[cookieName];
    if (!signed) {
      throw new UnauthorizedException({ error: 'unauthenticated' });
    }

    const sessionId = this.authService.verifySignedSessionId(signed);
    if (!sessionId) {
      throw new UnauthorizedException({ error: 'invalid_session' });
    }

    const session = await this.authService.validateSession(sessionId);
    if (!session) {
      throw new UnauthorizedException({ error: 'session_expired' });
    }

    const user = await this.userStore.findById(session.userId);
    if (!user) {
      throw new UnauthorizedException({ error: 'user_not_found' });
    }

    if (!this.isAdmin(user.email)) {
      this.logger.warn(`Non-admin "${user.email}" attempted admin action`);
      throw new ForbiddenException({ error: 'admin_required' });
    }

    (request as any).adminUser = user;
    return true;
  }

  /**
   * Returns true when `email` appears in the `ADMIN_EMAILS` allowlist
   * (case-insensitive).
   *
   * FOR DEMO/TESTING PURPOSES ONLY. In production, you should implement a
   * more robust RBAC system rather than relying on env vars and emails.
   */
  private isAdmin(email: string): boolean {
    const raw = process.env.ADMIN_EMAILS ?? 'admin@example.com';
    const admins = raw
      .split(',')
      .map((u) => u.trim().toLowerCase())
      .filter(Boolean);
    return admins.includes(email.toLowerCase());
  }
}
