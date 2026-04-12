import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../crypto/jwt/jwt.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  private readonly logger = new Logger(BearerTokenGuard.name);

  constructor(private readonly jwtService: JwtService) {}

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

    try {
      const payload = await this.jwtService.verifyJwt(token);
      (request as any).tokenPayload = payload;
      return true;
    } catch {
      this.logger.warn('Bearer token verification failed: invalid or expired');
      throw new UnauthorizedException({
        error: 'invalid_token',
        error_description: 'Access token is invalid or expired',
      });
    }
  }
}
