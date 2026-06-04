import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../crypto/jwt/jwt.service';
import { TokenDenylistService } from '../../modules/oidc/services/token-denylist/token-denylist.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  private readonly logger = new Logger(BearerTokenGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly denylist: TokenDenylistService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      this.logger.warn('Missing or malformed Authorization header');
      throw new UnauthorizedException({
        error: 'invalid_token',
        error_description: 'Missing or malformed Authorization header',
      });
    }

    const token = authHeader.slice(7);

    let payload: Record<string, unknown> & { jti?: string };
    try {
      payload = await this.jwtService.verifyJwt(token);
    } catch {
      this.logger.warn('Bearer token verification failed: invalid or expired');
      throw new UnauthorizedException({
        error: 'invalid_token',
        error_description: 'Access token is invalid or expired',
      });
    }

    if (payload.jti && (await this.denylist.isRevoked(payload.jti))) {
      this.logger.warn(`Bearer token rejected: jti=${payload.jti} is revoked`);
      throw new UnauthorizedException({
        error: 'invalid_token',
        error_description: 'Access token has been revoked',
      });
    }

    (request as any).tokenPayload = payload;
    return true;
  }
}
