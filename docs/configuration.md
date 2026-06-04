# Configuration & Deployment

How to configure, run, and operate Identity Nest. All configuration is via environment variables, loaded by `@nestjs/config` through `src/common/config/configuration.ts` (typed) and read directly in a few services.

- [Environment variables](#environment-variables)
- [Running with Docker Compose](#running-with-docker-compose)
- [Running from source](#running-from-source)
- [TLS and signing keys](#tls-and-signing-keys)
- [Seeded data](#seeded-data)
- [Production checklist](#production-checklist)
- [Troubleshooting](#troubleshooting)

---

## Environment variables

Copy `.env.example` to `.env` and adjust. Defaults are development-friendly and
**insecure** — several MUST be overridden before any non-local deployment.

### Runtime

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTPS listen port. |
| `NODE_ENV` | `development` | When `production`: disables `synchronize` for the DB and **disables dev seeding**. |

### Database (Postgres / TypeORM)

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_HOST` | `localhost` | Postgres host. |
| `DATABASE_PORT` | `5432` | Postgres port. |
| `DATABASE_USER` | `identity` | Username. |
| `DATABASE_PASSWORD` | `identity` | Password. |
| `DATABASE_NAME` | `identity` | Database name. |

> `synchronize` is derived: `true` when `NODE_ENV !== 'production'`, else
> `false`. There are no migrations yet, so production schema management is an
> open gap (roadmap M1).

### Redis

| Variable | Default | Purpose |
| --- | --- | --- |
| `REDIS_HOST` | `localhost` | Redis host. |
| `REDIS_PORT` | `6379` | Redis port. |
| `REDIS_PASSWORD` | _(none)_ | Optional auth. |
| `REDIS_KEY_PREFIX` | `idp:` | Prefix applied to every key (see [Redis key reference](./data-model.md#redis-key-reference)). |

### OIDC

| Variable | Default | Purpose |
| --- | --- | --- |
| `OIDC_ISSUER` | `https://idp.example.com` *(code default in `JwksService`)* / `http://localhost:3000` *(in `.env.example`)* | The `iss` claim and the base for all discovery URLs. **Set this** to your externally reachable HTTPS origin. |

### HTTP / CORS

| Variable | Default | Purpose |
| --- | --- | --- |
| `CORS_ORIGINS` | `http://localhost:8080,http://0.0.0.0:5173,http://localhost:5173,https://127.0.0.1:5173` | Comma-separated allowlist of browser origins. Only relevant for browser clients; API tools (Postman/Bruno/Insomnia) don't enforce CORS. |

### Session / cookies

| Variable | Default | Purpose |
| --- | --- | --- |
| `SESSION_COOKIE_NAME` | `idp_session` | Name of the session cookie. |
| `SESSION_TTL_MS` | `3600000` (1 h) | Session lifetime (Redis TTL + cookie `maxAge`). |
| `COOKIE_SECRET` | `dev-cookie-secret-change-in-production` | HMAC key for signing the session cookie. **MUST override in production.** |

### Admin & tenant

| Variable | Default | Purpose |
| --- | --- | --- |
| `ADMIN_EMAILS` | `admin@example.com` | Comma-separated, case-insensitive allowlist of admin user emails (enforced by `AdminGuard`). |
| `TENANT_ENCRYPTION_KEY` | `dev-key-change-in-production` | Stored on the auto-created `default` tenant. **MUST override in production.** |

---

## Running with Docker Compose

`docker-compose.yml` defines three services: `db` (Postgres 17), `redis`
(Redis 7), and `app` (this server). Postgres runs `docker/init.sql` on first
boot to install required extensions (e.g. `citext`, used by the tenant `name`
column).

```bash
# Postgres + Redis only (run the app from source for hot reload)
docker compose up -d db redis

# Or the whole stack, app included
docker compose up --build
```

The `app` service reads DB/Redis host as `db`/`redis` (the compose service
names) and accepts the same env vars as above via compose interpolation
(`${VAR:-default}`).

> The compose `app` defaults `OIDC_ISSUER` to `https://localhost:3000`. The
> server listens on HTTPS with a self-signed cert, so when reaching it from the
> host use `https://localhost:3000` and accept the certificate.

### Reset state

```bash
docker compose down -v   # drops Postgres + Redis volumes; re-seeds on next boot
```

Redis-backed authorization codes, sessions, and interactions also expire on
their own (short TTLs) without a full reset.

---

## Running from source

```bash
cp .env.example .env
docker compose up -d db redis
npm install
npm run start:dev      # watch mode, https://localhost:3000
```

Other scripts (`package.json`):

| Script | Action |
| --- | --- |
| `npm run start` | Start once. |
| `npm run start:dev` | Start in watch mode. |
| `npm run start:debug` | Watch + inspector. |
| `npm run start:prod` | Run the compiled `dist/main`. |
| `npm run build` | `nest build`. |
| `npm run lint` | ESLint with `--fix`. |
| `npm run format` | Prettier write. |
| `npm run test` / `test:cov` | Unit tests (`*.spec.ts`) / with coverage. |
| `npm run test:e2e` | End-to-end tests (require Postgres + Redis). |

---

## TLS and signing keys

- **TLS:** The app boots an HTTPS server using the cert/key in
  `src/common/https/` (`cert.crt`, `key.pem`) via `httpsOptions`. These are
  self-signed and for local development only — terminate TLS at a real
  certificate (or a reverse proxy) in production.
- **JWT signing keys:** `JwksService` generates a fresh **RS256** key pair in
  memory at startup (`onModuleInit`) and exposes it via `/oidc/jwks.json`. Keys
  are **not persisted**: every restart produces a new `kid`, invalidating all
  previously issued JWTs, and multiple instances would each sign with different
  keys. A persistent, shared key store is required before scaling out or going
  to production.

---

## Seeded data

When `NODE_ENV !== 'production'`, `SeedService.onModuleInit` idempotently creates
a `default` tenant and the following (see
[`src/modules/store/seed.service.ts`](../src/modules/store/seed.service.ts)).

**Users** (sign in with the **email**; the login form rejects `username`):

| Email | Password | Nickname | Email verified | Admin? |
| --- | --- | --- | --- | --- |
| `test@example.com` | `password` | `testuser` | yes | no |
| `admin@example.com` | `admin123` | `admin` | yes | **yes** (matches default `ADMIN_EMAILS`) |
| `jane.doe@example.com` | `password` | `jane.doe` | no | no |

**Clients:**

| `client_id` | Type | Auth method | Secret | PKCE |
| --- | --- | --- | --- | --- |
| `test-client` | web | `client_secret_basic` | `test-secret` | required |
| `dashboard-spa` | spa | `none` (public) | — | required |
| `mobile-app` | native | `none` (public) | — | required |

Registered redirect URIs include `https://oauth.pstmn.io/v1/callback`,
`http://localhost:8080/callback`, and `https://localhost:5173/` (web/spa); the
native client uses `com.example.app://callback`.

**Grant:** `test@example.com` is pre-authorized for `dashboard-spa` with
`openid profile email`, so its [consent step is skipped](./authentication-flows.md#consent-skip-fast-path).

---

## Production checklist

This project is **work in progress**; the items below are the minimum from the
[roadmap](../__planning/production_roadmap.md) before exposing it publicly:

- [ ] Override `COOKIE_SECRET`, `TENANT_ENCRYPTION_KEY`, DB and Redis credentials with real secrets (ideally from a secret manager).
- [ ] Set `NODE_ENV=production` (disables seeding and DB `synchronize`).
- [ ] Replace `synchronize` with real migrations (M1).
- [ ] Persist and rotate JWT signing keys (don't regenerate in memory per instance).
- [ ] Terminate TLS with a trusted certificate; set `OIDC_ISSUER` to the public HTTPS origin.
- [ ] Add rate limiting, account lockout, and audit logging (M2).
- [ ] Implement refresh-token rotation with replay detection (M4).
- [ ] Enforce tenant scoping at the query layer (M1).
- [ ] Replace the email-allowlist `AdminGuard` with real RBAC.
- [ ] Set secure cookie flags appropriate for cross-site SPA use (`Secure`, and `SameSite` per deployment).

---

## Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| `invalid_request: Redirect URI not registered for this client` | The exact `redirect_uri` isn't on the client. Register it (admin API) or use a seeded URI. |
| `invalid_grant: PKCE verification failed` | The `code_verifier` at `/token` doesn't match the `code_challenge` from `/authorize`. Ensure the same pair is used and `code_challenge_method=S256`. |
| `invalid_client` at `/token` for a public client | Tool sent an empty Basic header. Switch to "credentials in body" so only `client_id` is sent. |
| Login rejected though credentials look right | Post `email=` (a valid email), not `username=`. The strict validation pipe rejects unknown fields. |
| `401` from `/api/v1/clients` | No/expired `idp_session` cookie. Re-run the interaction login as an admin. |
| `403 admin_required` | Authenticated as a non-admin. Use `admin@example.com` or add the email to `ADMIN_EMAILS`. |
| Tokens stop verifying after a restart | Expected — signing keys are in-memory and regenerate on boot (new `kid`). Re-authenticate. Persist keys for stable deployments. |
| Browser/API client TLS warning | The dev server uses a self-signed cert. Accept it, or use `curl -k` / disable TLS verification locally. |
| `PORT 3000 / 5432 / 6379` already in use | Stop the conflicting service or change the port mapping in `docker-compose.yml`. |
</content>
