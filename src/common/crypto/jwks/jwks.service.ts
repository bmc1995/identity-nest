import { Injectable } from '@nestjs/common';
import { KeyObject } from 'crypto';
import { importJWK, JWK } from 'jose';

@Injectable()
export class JwksService {
  private issuer = 'https://idp.example.com';
  private keys: {
    kid: string;
    alg: 'RS256' | 'ES256';
    privateJwk: JWK;
    publicJwk: JWK;
  }[] = [
    // Load from DB or file
  ];

  getIssuer() {
    return this.issuer;
  }

  async getJWKS() {
    return { keys: this.keys.map((k) => ({ ...k.publicJwk, kid: k.kid })) };
  }

  async getActiveSigningKey() {
    const k = this.keys[0]; // pick active; add rotation policy
    return { ...k, issuer: this.issuer };
  }

  async getVerificationKeyFor() {
    const k = this.keys[0];
    const publicKey = await (async () => {
      const pub = await importJWK(k.publicJwk, k.alg);
      return pub as unknown as KeyObject;
    })();
    return { publicKey, issuer: this.issuer, audience: undefined };
  }
}
