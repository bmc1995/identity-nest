import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { createHash, timingSafeEqual } from 'crypto';

/**
 * Gates the RFC 7591 dynamic client registration endpoint with an initial
 * access token (RFC 7591 §1.2). The caller must present
 * `Authorization: Bearer <token>` matching `OIDC_REGISTRATION_ACCESS_TOKEN`.
 *
 * Closed by default: when the env var is unset the endpoint is disabled
 * entirely rather than silently open, so an unconfigured deployment cannot
 * accept anonymous client registrations. The discovery document omits
 * `registration_endpoint` in that case (see {@link DiscoveryController}).
 */
@Injectable()
export class RegistrationAccessTokenGuard implements CanActivate {
  private readonly logger = new Logger(RegistrationAccessTokenGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const configured = process.env.OIDC_REGISTRATION_ACCESS_TOKEN?.trim();
    if (!configured) {
      this.logger.warn(
        'Dynamic client registration is disabled: OIDC_REGISTRATION_ACCESS_TOKEN is not set',
      );
      throw new ForbiddenException({
        error: 'registration_not_supported',
        error_description: 'Dynamic client registration is not enabled',
      });
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        error: 'invalid_token',
        error_description:
          'An initial access token is required (Authorization: Bearer <token>)',
      });
    }

    const provided = authHeader.slice(7).trim();
    if (!this.tokensMatch(provided, configured)) {
      this.logger.warn(
        'Dynamic client registration rejected: invalid initial access token',
      );
      throw new UnauthorizedException({
        error: 'invalid_token',
        error_description: 'Invalid initial access token',
      });
    }

    return true;
  }

  /**
   * Constant-time comparison. Both inputs are folded through SHA-256 first so
   * the comparison is length-independent and never leaks the expected token's
   * length via early return or `timingSafeEqual`'s length check.
   */
  private tokensMatch(provided: string, expected: string): boolean {
    const a = createHash('sha256').update(provided).digest();
    const b = createHash('sha256').update(expected).digest();
    return timingSafeEqual(a, b);
  }
}
