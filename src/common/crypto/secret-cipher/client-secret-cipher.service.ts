import { Injectable, Logger } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
  timingSafeEqual,
} from 'crypto';

/**
 * Reversible encryption for client secrets at rest.
 *
 * Client secrets must be recoverable (not one-way hashed) so the server can use
 * the raw value as the HMAC key when verifying a `client_secret_jwt` assertion
 * (OpenID Connect Core §9). Secrets are sealed with AES-256-GCM under a key
 * derived from the deployment's encryption secret; the authenticated tag makes
 * tampering detectable.
 *
 * Stored format (all components base64url): `v1.<iv>.<tag>.<ciphertext>`. The
 * version prefix lets the key-derivation or cipher change later without
 * ambiguity over how an existing value was sealed.
 */
@Injectable()
export class ClientSecretCipher {
  private readonly logger = new Logger(ClientSecretCipher.name);
  private static readonly VERSION = 'v1';
  private static readonly IV_BYTES = 12; // GCM standard nonce length
  private readonly key: Buffer;

  constructor() {
    // The single-tenant `default` tenant's encryption_key is itself sourced
    // from TENANT_ENCRYPTION_KEY, so deriving from the same env value keeps
    // dev/seed and runtime in agreement until per-tenant keying lands.
    const secret =
      process.env.CLIENT_SECRET_ENC_KEY ??
      process.env.TENANT_ENCRYPTION_KEY ??
      'dev-key-change-in-production';
    if (
      process.env.NODE_ENV === 'production' &&
      secret === 'dev-key-change-in-production'
    ) {
      this.logger.error(
        'CLIENT_SECRET_ENC_KEY / TENANT_ENCRYPTION_KEY is unset in production — client secrets are being sealed with the insecure default key',
      );
    }
    // HKDF stretches the (possibly low-entropy) env secret to a fixed 32-byte
    // AES key. The info string namespaces this key so the same env secret used
    // elsewhere derives independent keys.
    this.key = Buffer.from(
      hkdfSync('sha256', secret, '', 'idp:client-secret', 32),
    );
  }

  /** Seal a plaintext secret. Returns the versioned, encoded ciphertext. */
  encrypt(plaintext: string): string {
    const iv = randomBytes(ClientSecretCipher.IV_BYTES);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return [
      ClientSecretCipher.VERSION,
      iv.toString('base64url'),
      tag.toString('base64url'),
      ciphertext.toString('base64url'),
    ].join('.');
  }

  /**
   * Recover the plaintext from a sealed value.
   * @throws Error when the value is malformed or fails authentication.
   */
  decrypt(sealed: string): string {
    const parts = sealed.split('.');
    if (parts.length !== 4 || parts[0] !== ClientSecretCipher.VERSION) {
      throw new Error('Unrecognized sealed-secret format');
    }
    const [, ivB64, tagB64, ctB64] = parts;
    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.key,
      Buffer.from(ivB64, 'base64url'),
    );
    decipher.setAuthTag(Buffer.from(tagB64, 'base64url'));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ctB64, 'base64url')),
      decipher.final(),
    ]);
    return plaintext.toString('utf8');
  }

  /**
   * Constant-time comparison of a presented secret against a sealed value.
   * Returns false (rather than throwing) on any decryption failure so callers
   * can treat it as a plain authentication miss.
   */
  verify(presented: string, sealed: string): boolean {
    let actual: string;
    try {
      actual = this.decrypt(sealed);
    } catch {
      return false;
    }
    const a = Buffer.from(actual, 'utf8');
    const b = Buffer.from(presented, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }
}
