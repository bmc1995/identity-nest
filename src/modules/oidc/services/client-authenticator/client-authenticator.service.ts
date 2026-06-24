import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import {
  createLocalJWKSet,
  createRemoteJWKSet,
  decodeJwt,
  decodeProtectedHeader,
  jwtVerify,
  JSONWebKeySet,
  JWTVerifyGetKey,
} from 'jose';
import { ClientStore, StoredClient } from '../../../store/stores/client.store';
import { JwksService } from '../../../../common/crypto/jwks/jwks.service';
import { ClientAssertionReplayService } from '../client-assertion-replay/client-assertion-replay.service';

export interface ClientCredentialsBody {
  client_id?: string;
  client_secret?: string;
  client_assertion?: string;
  client_assertion_type?: string;
}

/** The only assertion type defined for JWT client authentication (RFC 7523). */
const JWT_BEARER_ASSERTION_TYPE =
  'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';

/** HMAC algorithm accepted for client_secret_jwt (matches discovery metadata). */
const HMAC_ALGS = ['HS256'];

/** Asymmetric algorithms accepted for private_key_jwt (matches discovery). */
const ASYMMETRIC_ALGS = ['RS256', 'ES256'];

/** Tolerance (seconds) for assertion exp/iat clock skew. */
const CLOCK_TOLERANCE = 5;

@Injectable()
export class ClientAuthenticatorService {
  private readonly logger = new Logger(ClientAuthenticatorService.name);

  // createRemoteJWKSet returns a fetcher that maintains its own cache + cooldown.
  // Reuse one per URL so we don't refetch the JWKS on every assertion.
  private readonly remoteJwksByUri = new Map<string, JWTVerifyGetKey>();

  constructor(
    private readonly clientStore: ClientStore,
    private readonly jwks: JwksService,
    private readonly replay: ClientAssertionReplayService,
  ) {}

  /**
   * Resolve and verify client credentials from the request. Supports
   * `client_secret_basic` / `client_secret_post` (shared secret),
   * `client_secret_jwt` / `private_key_jwt` (signed assertion, RFC 7523), and
   * public clients (`none`). Returns the active client on success, else null.
   *
   * The authentication method actually used must match the one the client
   * registered with — a confidential client cannot be authenticated by merely
   * presenting its `client_id`.
   */
  async authenticate(
    req: Request,
    body: ClientCredentialsBody,
  ): Promise<StoredClient | null> {
    if (body.client_assertion || body.client_assertion_type) {
      return this.authenticateAssertion(body);
    }
    return this.authenticateSecret(req, body);
  }

  /** client_secret_basic / client_secret_post / none. */
  private async authenticateSecret(
    req: Request,
    body: ClientCredentialsBody,
  ): Promise<StoredClient | null> {
    let clientId: string | undefined;
    let clientSecret: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Basic ')) {
      const decoded = Buffer.from(authHeader.slice(6), 'base64').toString();
      const colonIndex = decoded.indexOf(':');
      if (colonIndex !== -1) {
        clientId = decodeURIComponent(decoded.substring(0, colonIndex));
        clientSecret = decodeURIComponent(decoded.substring(colonIndex + 1));
      }
    }

    if (!clientId) {
      clientId = body.client_id;
      clientSecret = body.client_secret;
    }

    if (!clientId) {
      this.logger.warn('No client_id provided');
      return null;
    }

    const client = await this.clientStore.findByClientId(clientId);
    if (!client || client.status !== 'active') {
      this.logger.warn(`Unknown or inactive client: ${clientId}`);
      return null;
    }

    const method = client.tokenEndpointAuthMethod;

    // Public client: identified by client_id, proven by PKCE at code exchange.
    if (method === 'none') return client;

    // JWT-assertion clients must not be admitted via the shared-secret path,
    // even if they happen to hold a secret — that would bypass their stronger
    // registered method.
    if (method !== 'client_secret_basic' && method !== 'client_secret_post') {
      this.logger.warn(
        `Client ${clientId} must authenticate with ${method}, not a shared secret`,
      );
      return null;
    }

    if (!clientSecret) {
      this.logger.warn(`Confidential client ${clientId} did not provide a secret`);
      return null;
    }
    const valid = this.clientStore.validateSecret(client, clientSecret);
    if (!valid) {
      this.logger.warn(`Invalid secret for client ${clientId}`);
      return null;
    }
    return client;
  }

  /** client_secret_jwt / private_key_jwt (RFC 7523 §3, OIDC Core §9). */
  private async authenticateAssertion(
    body: ClientCredentialsBody,
  ): Promise<StoredClient | null> {
    if (body.client_assertion_type !== JWT_BEARER_ASSERTION_TYPE) {
      this.logger.warn('Unsupported client_assertion_type');
      return null;
    }
    const assertion = body.client_assertion;
    if (!assertion) {
      this.logger.warn('client_assertion missing');
      return null;
    }

    // Decode (unverified) to discover the issuer (= client_id) and algorithm.
    let alg: string | undefined;
    let unverifiedIssuer: unknown;
    try {
      alg = decodeProtectedHeader(assertion).alg;
      unverifiedIssuer = decodeJwt(assertion).iss;
    } catch {
      this.logger.warn('Malformed client_assertion');
      return null;
    }

    const clientId =
      typeof unverifiedIssuer === 'string' ? unverifiedIssuer : undefined;
    if (!clientId) {
      this.logger.warn('client_assertion missing iss');
      return null;
    }
    // If client_id is also sent in the body it must agree with the assertion.
    if (body.client_id && body.client_id !== clientId) {
      this.logger.warn('client_id does not match assertion issuer');
      return null;
    }

    const client = await this.clientStore.findByClientId(clientId);
    if (!client || client.status !== 'active') {
      this.logger.warn(`Unknown or inactive client: ${clientId}`);
      return null;
    }

    // Resolve the verification key and enforce that the algorithm family
    // matches the client's registered method.
    const method = client.tokenEndpointAuthMethod;
    let key: Uint8Array | JWTVerifyGetKey;
    let algorithms: string[];

    if (method === 'client_secret_jwt') {
      if (!alg || !HMAC_ALGS.includes(alg)) {
        this.logger.warn(`client_secret_jwt requires ${HMAC_ALGS.join('/')}`);
        return null;
      }
      const secret = this.clientStore.getDecryptedSecret(client);
      if (!secret) {
        this.logger.warn(`No secret available for client ${clientId}`);
        return null;
      }
      key = new TextEncoder().encode(secret);
      algorithms = HMAC_ALGS;
    } else if (method === 'private_key_jwt') {
      if (!alg || !ASYMMETRIC_ALGS.includes(alg)) {
        this.logger.warn(
          `private_key_jwt requires ${ASYMMETRIC_ALGS.join('/')}`,
        );
        return null;
      }
      const resolved = this.resolveClientJwks(client);
      if (!resolved) {
        this.logger.warn(`Client ${clientId} has no JWKS for private_key_jwt`);
        return null;
      }
      key = resolved;
      algorithms = ASYMMETRIC_ALGS;
    } else {
      this.logger.warn(
        `Client ${clientId} is not registered for JWT client assertions`,
      );
      return null;
    }

    // jose validates the signature, exp/nbf/iat, and the iss/sub/aud claims.
    let jti: unknown;
    let exp: number | undefined;
    try {
      const { payload } = await jwtVerify(assertion, key as never, {
        issuer: clientId,
        subject: clientId,
        audience: this.acceptedAudiences(),
        algorithms,
        clockTolerance: CLOCK_TOLERANCE,
      });
      jti = payload.jti;
      exp = payload.exp;
    } catch (err) {
      this.logger.warn(
        `client_assertion verification failed for ${clientId}: ${(err as Error).message}`,
      );
      return null;
    }

    if (typeof jti !== 'string' || typeof exp !== 'number') {
      this.logger.warn(`client_assertion from ${clientId} missing jti or exp`);
      return null;
    }
    // Enforce single use to defeat replay.
    const fresh = await this.replay.claim(clientId, jti, exp);
    if (!fresh) return null;

    return client;
  }

  /**
   * Build a verification key resolver from the client's registered JWKS —
   * inline (`jwks`) or remote (`jwksUri`). Remote sets are fetched lazily and
   * cached by jose.
   */
  private resolveClientJwks(client: StoredClient): JWTVerifyGetKey | null {
    if (client.jwks) {
      return createLocalJWKSet(client.jwks as unknown as JSONWebKeySet);
    }
    if (client.jwksUri) {
      let fetcher = this.remoteJwksByUri.get(client.jwksUri);
      if (!fetcher) {
        fetcher = createRemoteJWKSet(new URL(client.jwksUri));
        this.remoteJwksByUri.set(client.jwksUri, fetcher);
      }
      return fetcher;
    }
    return null;
  }

  /**
   * Audiences a client assertion may target. RFC 7523/OIDC require the audience
   * to identify the authorization server; in practice clients use the issuer or
   * the specific endpoint URL, so accept both the issuer and the token/revoke
   * endpoints.
   */
  private acceptedAudiences(): string[] {
    const issuer = this.jwks.getIssuer();
    return [issuer, `${issuer}/oidc/token`, `${issuer}/oidc/revoke`];
  }
}
