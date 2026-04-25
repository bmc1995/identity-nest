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
import { AccountStore } from '../../store/stores/account.store';

/**
 * Guards routes that require an authenticated admin account.
 *
 * Validates the signed session cookie issued by the /apps login flow,
 * loads the account, and checks its username against the `ADMIN_USERNAMES`
 * env allowlist (comma-separated; defaults to `admin`).
 *
 * Attaches the admin account to `req.adminAccount` on success.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly accountStore: AccountStore,
  ) {}

  /**
   * Authorizes the request if a valid session belongs to an allowlisted admin.
   * @throws UnauthorizedException when the session is missing, tampered, or expired.
   * @throws ForbiddenException when the account is not in the admin allowlist.
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

    const account = await this.accountStore.findById(session.accountId);
    if (!account) {
      throw new UnauthorizedException({ error: 'account_not_found' });
    }

    if (!this.isAdmin(account.username)) {
      this.logger.warn(`Non-admin "${account.username}" attempted admin action`);
      throw new ForbiddenException({ error: 'admin_required' });
    }

    (request as any).adminAccount = account;
    return true;
  }

  /**
   * Returns true when `username` appears in the `ADMIN_USERNAMES` allowlist
   * (case-insensitive).
   */
  private isAdmin(username: string): boolean {
    const raw = process.env.ADMIN_USERNAMES ?? 'admin';
    const admins = raw
      .split(',')
      .map((u) => u.trim().toLowerCase())
      .filter(Boolean);
    return admins.includes(username.toLowerCase());
  }
}
