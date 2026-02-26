import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class PkceService {
  constructor() {}
  private _base64UrlEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  /**
   * ---
   * Temporary server-side implementation for generating a code challenge from the code verifier;
   * should be done by client using SHA-256 and base64-url encoding.
   *
   * flow:
   *
   * app requests auth code from this auth server, and includes the code challenge and method
   * --> user AuthN and approves
   * --> app req. to redeem auth code for tokens, including the code verifier
   * --> auth server verifies the code verifier against the code challenge
   * --> server issues tokens
   */
  private _exampleGenerateCodeChallenge(codeVerifier: string): string {
    //if env === 'production', throw new Error('Client must generate code challenge');
    console.warn(
      '[PkceService] Code challenge generated server-side; verifier:',
      codeVerifier,
    );
    const hash = createHash('sha256').update(codeVerifier);
    return hash.digest('base64url');
  }

  verifyCodeChallenge(
    codeVerifier: string,
    codeChallenge: string,
    method: string,
  ): boolean {
    if (method === 'plain') {
      return codeVerifier === codeChallenge;
    } else if (method === 'S256') {
      const hash = createHash('sha256').update(codeVerifier);
      const digest = this._base64UrlEncode(hash.digest());
      return digest === codeChallenge;
    }
    console.error(`Unsupported code challenge method: ${method}`);
    return false;
  }
}
