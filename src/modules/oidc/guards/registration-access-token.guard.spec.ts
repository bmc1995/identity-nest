import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegistrationAccessTokenGuard } from './registration-access-token.guard';

const ctx = (authorization?: string): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ headers: authorization ? { authorization } : {} }),
    }),
  }) as unknown as ExecutionContext;

describe('RegistrationAccessTokenGuard', () => {
  let guard: RegistrationAccessTokenGuard;
  const original = process.env.OIDC_REGISTRATION_ACCESS_TOKEN;

  beforeEach(() => {
    guard = new RegistrationAccessTokenGuard();
  });

  afterEach(() => {
    if (original === undefined) {
      delete process.env.OIDC_REGISTRATION_ACCESS_TOKEN;
    } else {
      process.env.OIDC_REGISTRATION_ACCESS_TOKEN = original;
    }
  });

  it('disables registration entirely when no token is configured', () => {
    delete process.env.OIDC_REGISTRATION_ACCESS_TOKEN;
    expect(() => guard.canActivate(ctx('Bearer anything'))).toThrow(
      ForbiddenException,
    );
  });

  it('rejects a missing Authorization header', () => {
    process.env.OIDC_REGISTRATION_ACCESS_TOKEN = 'secret-iat';
    expect(() => guard.canActivate(ctx())).toThrow(UnauthorizedException);
  });

  it('rejects an incorrect token', () => {
    process.env.OIDC_REGISTRATION_ACCESS_TOKEN = 'secret-iat';
    expect(() => guard.canActivate(ctx('Bearer wrong'))).toThrow(
      UnauthorizedException,
    );
  });

  it('allows a correct token', () => {
    process.env.OIDC_REGISTRATION_ACCESS_TOKEN = 'secret-iat';
    expect(guard.canActivate(ctx('Bearer secret-iat'))).toBe(true);
  });
});
