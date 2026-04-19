import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { exportJWK, generateKeyPair, importJWK, JWK, CryptoKey } from 'jose';
import { randomUUID } from 'crypto';

export interface StoredKey {
  kid: string;
  alg: 'RS256' | 'ES256';
  privateJwk: JWK;
  publicJwk: JWK;
  createdAt: Date;
  active: boolean;
}

@Injectable()
export class JwksService implements OnModuleInit {
  private readonly logger = new Logger(JwksService.name);
  private issuer = process.env.OIDC_ISSUER ?? 'https://idp.example.com';
  private keys: StoredKey[] = [];

  async onModuleInit() {
    // Generate an initial RS256 signing key on startup
    // In production this would load from a persistent store
    await this.generateKey('RS256');
    this.logger.log(
      `JWKS initialized with ${this.keys.length} key(s). Active kid: ${this.keys[0]?.kid}`,
    );
  }

  /** Generate a new asymmetric key pair and store it */
  async generateKey(alg: 'RS256' | 'ES256' = 'RS256'): Promise<StoredKey> {
    const { publicKey, privateKey } = await generateKeyPair(alg, {
      extractable: true,
    });

    const privateJwk = await exportJWK(privateKey);
    const publicJwk = await exportJWK(publicKey);
    const kid = randomUUID();

    const storedKey: StoredKey = {
      kid,
      alg,
      privateJwk,
      publicJwk,
      createdAt: new Date(),
      active: true,
    };

    // Deactivate previous keys of the same algorithm
    for (const k of this.keys) {
      if (k.alg === alg) k.active = false;
    }

    this.keys.unshift(storedKey);
    return storedKey;
  }

  /** Rotate the active key: generate a new one, deactivate the old */
  async rotateKey(alg: 'RS256' | 'ES256' = 'RS256'): Promise<StoredKey> {
    this.logger.log(`Rotating ${alg} signing key`);
    return this.generateKey(alg);
  }

  getIssuer(): string {
    return this.issuer;
  }

  /** Return the JWKS document (public keys only, including recently rotated keys for verification) */
  async getJWKS(): Promise<{ keys: JWK[] }> {
    return {
      keys: this.keys.map((k) => ({
        ...k.publicJwk,
        kid: k.kid,
        alg: k.alg,
        use: 'sig',
      })),
    };
  }

  /** Get the currently active signing key */
  async getActiveSigningKey(): Promise<{
    privateJwk: JWK;
    kid: string;
    alg: 'RS256' | 'ES256';
    issuer: string;
  }> {
    const k = this.keys.find((key) => key.active);
    if (!k) {
      throw new Error('No active signing key available');
    }
    return {
      privateJwk: k.privateJwk,
      kid: k.kid,
      alg: k.alg,
      issuer: this.issuer,
    };
  }

  /** Look up a public key by kid for JWT verification */
  async getVerificationKeyByKid(kid: string): Promise<{
    publicKey: CryptoKey;
    alg: string;
    issuer: string;
  }> {
    const k = this.keys.find((key) => key.kid === kid);
    if (!k) {
      throw new Error(`Key not found for kid: ${kid}`);
    }
    const publicKey = (await importJWK(k.publicJwk, k.alg)) as CryptoKey;
    return { publicKey, alg: k.alg, issuer: this.issuer };
  }

  /** Return all stored keys (for admin/debugging) */
  getKeyInventory(): { kid: string; alg: string; active: boolean; createdAt: Date }[] {
    return this.keys.map(({ kid, alg, active, createdAt }) => ({
      kid,
      alg,
      active,
      createdAt,
    }));
  }
}
