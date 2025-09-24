import { Injectable } from '@nestjs/common';
import { SignJWT, jwtVerify, importJWK, JWK, JWTPayload } from 'jose';
import { JwksService } from '../jwks/jwks.service';

@Injectable()
export class JwtService {
  constructor(private readonly jwksService: JwksService) {}

  async signIdToken(sub: string, aud: string, extra: Record<string, any> = {}) {
    const { privateJwk, kid, alg, issuer } =
      await this.jwksService.getActiveSigningKey();
    const key = await importJWK(privateJwk as JWK, alg);
    const now = Math.floor(Date.now() / 1000);
    return await new SignJWT({
      sub,
      aud,
      iss: issuer,
      iat: now,
      exp: now + 300,
      ...extra,
    })
      .setProtectedHeader({ alg, kid })
      .sign(key);
  }

  async verifyJwt(jwt: string) {
    const { publicKey, issuer, audience } =
      await this.jwksService.getVerificationKeyFor(/*jwt*/);
    const { payload } = await jwtVerify(jwt, publicKey, { issuer, audience });
    return payload as JWTPayload;
  }
}
