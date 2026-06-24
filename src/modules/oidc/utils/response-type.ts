/**
 * Parsing and policy helpers for the OAuth/OIDC `response_type` and
 * `response_mode` request parameters, shared by the authorize controller (input
 * validation) and {@link OidcService.completeConsent} (artifact minting).
 */

export type ResponseMode = 'query' | 'fragment';

export interface ParsedResponseType {
  /** Issue an authorization code (code + hybrid flows). */
  hasCode: boolean;
  /** Issue an ID token directly from /authorize (implicit + hybrid). */
  hasIdToken: boolean;
  /** Issue an access token directly from /authorize (implicit + hybrid). */
  hasToken: boolean;
  /** The `none` response type — authenticate but return no code/tokens. */
  isNone: boolean;
  /** The original, unmodified request value. */
  raw: string;
}

/**
 * Supported response types in canonical (sorted-token) form. The space-
 * delimited set is order-insensitive per RFC 6749 §3.1.1, so requests are
 * normalized before lookup.
 */
const SUPPORTED = new Set<string>([
  'code', // Authorization Code
  'id_token', // Implicit
  'id_token token', // Implicit
  'code id_token', // Hybrid
  'code token', // Hybrid
  'code id_token token', // Hybrid
  'none',
]);

function normalize(raw: string): string {
  return raw.trim().split(/\s+/).filter(Boolean).sort().join(' ');
}

/**
 * Parse and validate a `response_type` value. Returns null when the value is
 * empty or not a supported combination.
 */
export function parseResponseType(raw: string): ParsedResponseType | null {
  if (!raw || !raw.trim()) return null;
  const normalized = normalize(raw);
  if (!SUPPORTED.has(normalized)) return null;
  const tokens = new Set(normalized.split(' '));
  return {
    hasCode: tokens.has('code'),
    hasIdToken: tokens.has('id_token'),
    hasToken: tokens.has('token'),
    isNone: normalized === 'none',
    raw,
  };
}

/**
 * Default response mode for a response type. Anything that returns a token or
 * ID token defaults to `fragment` so credentials don't land in query strings
 * (and therefore server logs / Referer headers); code and none default to
 * `query`.
 */
export function defaultResponseMode(parsed: ParsedResponseType): ResponseMode {
  return parsed.hasIdToken || parsed.hasToken ? 'fragment' : 'query';
}

/**
 * Whether `mode` is permitted for the given response type. `query` is refused
 * for token-bearing responses (the reason `fragment` is their default); both
 * modes are otherwise allowed.
 */
export function isResponseModeAllowed(
  parsed: ParsedResponseType,
  mode: ResponseMode,
): boolean {
  if (mode === 'query' && (parsed.hasIdToken || parsed.hasToken)) return false;
  return true;
}
