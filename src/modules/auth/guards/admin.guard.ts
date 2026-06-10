import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from '../session.service';
import { UserService } from '../../user/user.service';
import { isAdminEmail } from '../admin-emails';

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
    private readonly sessions: SessionService,
    private readonly users: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const signed = request.cookies?.[this.sessions.getCookieName()];
    if (!signed) {
      throw new UnauthorizedException({ error: 'unauthenticated' });
    }

    const sessionId = this.sessions.unsign(signed);
    if (!sessionId) {
      throw new UnauthorizedException({ error: 'invalid_session' });
    }

    const session = await this.sessions.validate(sessionId);
    if (!session) {
      throw new UnauthorizedException({ error: 'session_expired' });
    }

    const user = await this.users.findById(session.userId);
    if (!user) {
      throw new UnauthorizedException({ error: 'user_not_found' });
    }

    if (!isAdminEmail(user.email)) {
      this.logger.warn(`Non-admin "${user.email}" attempted admin action`);
      throw new ForbiddenException({ error: 'admin_required' });
    }

    (request as any).adminUser = user;
    return true;
  }
}
