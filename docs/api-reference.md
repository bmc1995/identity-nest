# API Reference

Complete reference for every HTTP endpoint exposed by Identity Nest, derived from the controllers in `src/`. An interactive, always-current OpenAPI UI is also served by the running app at **`/api/docs`** (raw spec at `/api/docs/openapi.json`).

**Base URL (local):** `https://localhost:3000` (HTTPS, self-signed certificate)

Endpoint groups:

- [Discovery & keys](#discovery--keys)
- [OAuth 2.0 / OIDC core](#oauth-20--oidc-core)
- [Interaction (login & consent)](#interaction-login--consent)
- [Admin: client management](#admin-client-management)
- [Authentication mechanisms](#authentication-mechanisms)
- [Error format](#error-format)

---

## Discovery & keys

No authentication. Safe to cache.

### `GET /`

Basic liveness probe (`AppController`). Returns `200` with an empty body.

### `GET /.well-known/openid-configuration`

OIDC discovery document. Source: `DiscoveryController`. The `issuer` is taken
from `OIDC_ISSUER`.

```jsonc
{
  "issuer": "https://localhost:3000",
  "authorization_endpoint": "https://localhost:3000/oidc/authorize",
  "token_endpoint": "https://localhost:3000/oidc/token",
  "userinfo_endpoint": "https://localhost:3000/oidc/userinfo",
  "revocation_endpoint": "https://localhost:3000/oidc/revoke",
  "jwks_uri": "https://localhost:3000/oidc/jwks.json",
  "registration_endpoint": "https://localhost:3000/connect/register", // ⚠ advertised, not implemented
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
  "revocation_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
  "scopes_supported": ["openid", "profile", "email"],
  "claims_supported": ["sub", "name", "email"],
  "code_challenge_methods_supported": ["S256"]
}
```

> `registration_endpoint` is present in the document but there is no handler for
> `/connect/register`. Use the [admin client API](#admin-client-management) instead.

### `GET /oidc/jwks.json`

JSON Web Key Set — public keys for verifying issued JWTs. Source:
`JwksController`. Includes the active key and any recently rotated keys (so
in-flight tokens still verify).

```jsonc
{
  "keys": [
    { "kty": "RSA", "n": "…", "e": "AQAB", "kid": "<uuid>", "alg": "RS256", "use": "sig" }
  ]
}
```

---

## OAuth 2.0 / OIDC core

### `GET /oidc/authorize`

Authorization endpoint (browser-facing). Source: `AuthorizeController`.

**Query parameters**

| Param | Required | Notes |
| --- | --- | --- |
| `response_type` | ✅ | Must be `code`; anything else → `unsupported_response_type`. |
| `client_id` | ✅ | Must resolve to an `active` client. |
| `redirect_uri` | ✅ | Must exactly match a registered redirect URI. |
| `scope` | ✅ | Space-separated; e.g. `openid profile email`. |
| `code_challenge` | ✅ | PKCE challenge (always required by this server). |
| `code_challenge_method` | optional | `S256` or `plain`. Defaults to `plain` if omitted. Forced to reject `plain` when the client has `requirePkce=true`. **Always send `S256`.** |
| `state` | recommended | Echoed back on redirect; CSRF protection. |
| `nonce` | optional | Carried into the ID token. |
| `display`, `prompt`, `max_age`, `id_token_hint`, `login_hint`, `acr_values`, `ui_locales` | optional | Accepted (so compliant clients aren't rejected by the strict validation pipe) but **not currently acted upon**. |

**Behavior & responses**

- Missing any required param → `400` `{ "error": "invalid_request", … }`.
- Unknown/inactive client → `400` `{ "error": "invalid_client", … }`.
- Unregistered `redirect_uri` → `400` `{ "error": "invalid_request", … }`
  (returned as JSON, **not** redirected, to avoid open-redirect).
- Invalid `code_challenge_method`, or `plain` when the client requires PKCE →
  `303` redirect to `redirect_uri` with `error=invalid_request` (and `state`).
- **No valid session** → `303` to `/interaction/:uid` (login).
- **Valid session, scopes already granted** → consent is skipped; `303`
  straight to `redirect_uri?code=…&state=…`.
- **Valid session, new scopes** → `303` to `/interaction/:uid` (consent).

On success the browser ultimately lands on
`redirect_uri?code=<authorization_code>&state=<state>`.

---

### `POST /oidc/token`

Token endpoint. Source: `TokenController` → `OidcService`. Requires
[client authentication](#authentication-mechanisms). Body is
`application/x-www-form-urlencoded` (or JSON; both are parsed).

Supported `grant_type` values: **`authorization_code`**, **`refresh_token`**.
(`client_credentials` is accepted by validation but returns
`unsupported_grant_type`.)

#### Authorization code grant

| Field | Required | Notes |
| --- | --- | --- |
| `grant_type` | ✅ | `authorization_code` |
| `code` | ✅ | The code from `/authorize`. Single-use, 10-minute TTL. |
| `redirect_uri` | ✅ | Must match the value used at `/authorize`. |
| `code_verifier` | ✅ | PKCE verifier matching the original challenge. |
| `client_id` / `client_secret` | depends | Required in body for `client_secret_post`/public clients; or send Basic auth. |

**`200 OK`**

```json
{
  "access_token": "<at+jwt>",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "<id jwt>",
  "refresh_token": "<rt+jwt>",
  "scope": "openid profile email"
}
```

**Errors** (`400`, unless noted): `invalid_grant` (code invalid/expired/used,
client mismatch, redirect-uri mismatch, PKCE failure, user not found),
`invalid_client` (`401`).

#### Refresh token grant

| Field | Required | Notes |
| --- | --- | --- |
| `grant_type` | ✅ | `refresh_token` |
| `refresh_token` | ✅ | A valid, unexpired `rt+jwt` issued to this client. |
| `client_id` / `client_secret` | depends | As above. |

**`200 OK`**

```json
{
  "access_token": "<at+jwt>",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "<new rt+jwt>",
  "scope": "openid profile email"
}
```

> ⚠ **The previous refresh token is not invalidated.** A new one is issued, but
> the old token remains valid until it expires. Rotation-with-revocation is on
> the roadmap (M4).

**Errors:** `invalid_grant` (token invalid/expired or client mismatch),
`invalid_client` (`401`).

---

### `GET /oidc/userinfo`

OIDC UserInfo. Source: `UserinfoController`, guarded by `BearerTokenGuard`.

**Headers:** `Authorization: Bearer <access_token>`

Claims are filtered by the access token's `scope`:

| Scope present | Claims added |
| --- | --- |
| (always) | `sub` |
| `profile` | `preferred_username` (user `nickname`, falling back to `email`) |
| `email` | `email`, `email_verified` |

**`200 OK`**

```json
{
  "sub": "<user-uuid>",
  "preferred_username": "testuser",
  "email": "test@example.com",
  "email_verified": true
}
```

**Errors:** `401` `invalid_token` (missing/malformed header, invalid/expired
token, revoked `jti`, or the user no longer exists).

---

### `POST /oidc/revoke`

Token revocation per **RFC 7009**. Source: `RevokeController` → `OidcService`.
Requires [client authentication](#authentication-mechanisms).

| Field | Required | Notes |
| --- | --- | --- |
| `token` | ✅ | Access or refresh token to revoke. |
| `token_type_hint` | optional | Accepted; not required. |
| `client_id` / `client_secret` | depends | As for the token endpoint. |

**Behavior**

- `200 OK` (empty body) for success **and** for unknown/invalid/expired tokens —
  the endpoint is not a validity oracle.
- If the token was issued to a **different** client, the request returns `200`
  silently (no action), per RFC 7009.
- Access tokens: the `jti` is added to the Redis denylist until `exp`.
- Refresh tokens (`typ: rt+jwt`): additionally, the underlying grant is marked
  revoked, so future refreshes against that grant fail.
- `400` `invalid_request` if `token` is missing.
- `401` `invalid_client` if client authentication fails.

---

## Interaction (login & consent)

Server-rendered HTML pages reached via redirects from `/authorize`. Source:
`InteractionController` + `InteractionViewService`. OAuth helper tools open these
in a browser automatically; you rarely call them directly.

### `GET /interaction/:uid`

Renders the **login** form (prompt `login`) or **consent** form (prompt
`consent`) for the pending interaction. `400` if the interaction is unknown or
expired (30-minute TTL).

### `POST /interaction/:uid/login`

Submit credentials. Body fields (form-encoded):

| Field | Required | Notes |
| --- | --- | --- |
| `email` | ✅ | Validated as an email address (**not** `username`). |
| `password` | ✅ | |

- On success: creates a Redis session, sets the signed `idp_session` cookie
  (`httpOnly`, `sameSite=lax`), advances the interaction to `consent`, and
  `303` redirects to `/interaction/:uid`.
- On failure: re-renders the login page (`200`) with an inline error.

### `POST /interaction/:uid/consent`

Submit the consent decision. Body field:

| Field | Required | Notes |
| --- | --- | --- |
| `approved` | ✅ | `"true"` to allow; any other value denies. |

- `approved=true`: creates/updates the grant, issues an authorization code, and
  `303` redirects to `redirect_uri?code=…&state=…`.
- Denied: `303` redirects to `redirect_uri?error=access_denied&…`.

### `GET /interaction/:uid/abort`

Aborts a pending interaction and `303` redirects to
`redirect_uri?error=access_denied&error_description=The+authorization+request+was+aborted`.

---

## Admin: client management

REST API for registering and managing OAuth/OIDC clients. Source:
`ClientController` → `ClientService`. **All routes require an admin session**
(`AdminGuard`): a valid `idp_session` cookie whose user's email is in
`ADMIN_EMAILS`. Mounted at `/api/v1/clients`.

Common error responses: `401` (missing/invalid session), `403` `admin_required`
(authenticated but not an admin).

### `POST /api/v1/clients`

Register a new client. Returns the full metadata plus a one-time `clientSecret`
(null for public clients — **not retrievable afterwards**).

**Request body** (`RegisterClientDto`)

| Field | Required | Notes |
| --- | --- | --- |
| `name` | ✅ | 1–255 chars. |
| `type` | ✅ | One of `web`, `native`, `spa`, `service`. Drives secure defaults. |
| `redirectUris` | ✅ | Non-empty array of unique, absolute URIs (no fragment). HTTPS required except loopback; native clients may use custom schemes/loopback. |
| `description` | optional | ≤ 1024 chars. |
| `grantTypes` | optional | Subset of `authorization_code`, `refresh_token`, `client_credentials`. Default: `['authorization_code','refresh_token']` (or `['client_credentials']` for `service`). |
| `responseTypes` | optional | Subset of `code`, `id_token`, `token`. Default `['code']`. |
| `tokenEndpointAuthMethod` | optional | `client_secret_basic`, `client_secret_post`, or `none`. Default: `none` for `spa`/`native`, else `client_secret_basic`. |
| `requirePkce` | optional | Forced to `true` for public (`none`) clients. |

**Defaults by type**

| `type` | Default auth method | Public? | Default grants |
| --- | --- | --- | --- |
| `web` | `client_secret_basic` | no | `authorization_code`, `refresh_token` |
| `service` | `client_secret_basic` | no | `client_credentials` |
| `spa` | `none` | yes | `authorization_code`, `refresh_token` |
| `native` | `none` | yes | `authorization_code`, `refresh_token` |

> `service` clients may not be public — `none` + `service` → `400`
> `invalid_client_metadata`.

**`201 Created`** (`ClientWithSecretDto`)

```json
{
  "id": "<uuid>",
  "clientId": "<32 hex chars>",
  "clientSecret": "<base64url, shown once>",
  "name": "Acme Dashboard",
  "description": null,
  "type": "web",
  "redirectUris": ["https://app.example.com/callback"],
  "grantTypes": ["authorization_code", "refresh_token"],
  "responseTypes": ["code"],
  "tokenEndpointAuthMethod": "client_secret_basic",
  "requirePkce": true,
  "accessTokenLifetime": 3600,
  "refreshTokenLifetime": 2592000,
  "status": "active",
  "hasSecret": true,
  "createdAt": "…",
  "updatedAt": "…"
}
```

**Errors:** `400` `invalid_redirect_uri` / `invalid_client_metadata`.

### `GET /api/v1/clients`

List all clients (admin view; secrets never included — `hasSecret` boolean
only). Returns an array of `ClientViewDto`.

### `GET /api/v1/clients/:id`

Fetch one client by **primary-key UUID** (`:id` must be a UUID). `404`
`client_not_found` if absent.

### `POST /api/v1/clients/:id/rotate-secret`

Generate a fresh secret for a confidential client. The previous secret stops
working immediately; the new plaintext is returned once. `400` for public
clients (no secret), `404` if the client doesn't exist. Returns
`ClientWithSecretDto` (`200`).

---

## Authentication mechanisms

| Context | Mechanism | Detail |
| --- | --- | --- |
| `/oidc/token`, `/oidc/revoke` | **Client auth** | `client_secret_basic` (HTTP Basic: `base64(client_id:client_secret)`) **or** `client_secret_post` (`client_id`/`client_secret` in the body). Public clients send `client_id` only. Source: `ClientAuthenticatorService`. |
| `/oidc/userinfo` | **Bearer access token** | `Authorization: Bearer <at+jwt>`; verified and denylist-checked by `BearerTokenGuard`. |
| `/api/v1/clients/*` | **Admin session cookie** | Signed `idp_session` cookie from the interaction login; user email must be in `ADMIN_EMAILS`. Source: `AdminGuard`. |
| `/oidc/authorize`, `/interaction/*` | **Browser session** | Signed `idp_session` cookie (created on login). |

---

## Error format

OAuth/OIDC endpoints return errors in the standard shape:

```json
{ "error": "invalid_grant", "error_description": "Human-readable detail" }
```

| HTTP | Typical `error` values |
| --- | --- |
| `400 Bad Request` | `invalid_request`, `invalid_grant`, `unsupported_response_type`, `unsupported_grant_type`, `invalid_redirect_uri`, `invalid_client_metadata` |
| `401 Unauthorized` | `invalid_client`, `invalid_token`, `unauthenticated`, `invalid_session`, `session_expired` |
| `403 Forbidden` | `admin_required` |
| `404 Not Found` | `client_not_found` |

For `/authorize`, certain errors are returned by **redirecting** to the client's
`redirect_uri` with `error` / `error_description` (and `state`) query
parameters, rather than as a JSON body — except for client/redirect-URI
validation failures, which are returned as JSON to avoid redirecting to an
untrusted location.
</content>
