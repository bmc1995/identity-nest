# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A NestJS **OAuth 2.0 Authorization Server / OpenID Connect Provider** (work in progress; goal is OpenID Connect Core 1.0 certification). The Authorization Code + PKCE flow works end-to-end. Many TypeORM entities (`organization`, `policy`, `group`, `credential`, `auditLog`, `accessToken`, `refreshToken`, `consentRecord`) are scaffolding for the roadmap and are **not yet wired into the running flow** — the live durable records are tenants, users, applications (clients), and grants. Don't assume an entity is used just because it exists.

Deep docs live in [`docs/`](./docs/README.md): [architecture](./docs/architecture.md), [api-reference](./docs/api-reference.md), [authentication-flows](./docs/authentication-flows.md), [data-model](./docs/data-model.md), [configuration](./docs/configuration.md). The roadmap of unbuilt production concerns is [`docs/plans/production_roadmap.md`](./docs/plans/production_roadmap.md). Keep these in sync when you change behavior they describe.

## Commands

```bash
cp .env.example .env            # first time only
docker compose up -d db redis   # Postgres 17 + Redis 7 — required to boot the app
npm install
npm run start:dev               # https://localhost:3000 (self-signed cert → use curl -k)

npm run build                   # nest build (also a full typecheck)
npx tsc --noEmit -p tsconfig.json   # typecheck only
npm run lint                    # eslint --fix over {src,apps,libs,test}
npm test                        # all unit/integration specs (*.spec.ts under src/)
npx jest src/modules/oidc                       # one dir
npx jest path/to/file.spec.ts                   # one file
npx jest -t "advertises every supported"        # one test by name
npm run test:e2e                # jest --config src/test/jest-e2e.json (*.e2e-spec.ts)
```

Most unit/integration specs mock their dependencies and need **no** Postgres/Redis (e.g. everything under `src/modules/oidc`). The app itself and e2e tests do need both services running.

## Architecture essentials

**Storage split is deliberate — pick the right one.** Durable identity records (tenants, users, clients, grants) live in **PostgreSQL** via TypeORM; short-lived protocol state lives in **Redis** with TTLs: sessions (`SESSION_TTL_MS`), authorization codes (`authcode:*`, 10 min, single-use), interactions (`interaction:*`, 30 min), and the access-token denylist (`revoked:<jti>`, until token `exp`). Redis keys are namespaced by `REDIS_KEY_PREFIX` (default `idp:`), applied by the ioredis client.

**All data access goes through `*Store` facades** (`src/modules/store/stores/`), not raw repositories. `StoreModule` exports them; services depend on stores. `CacheService` (`src/common/cache/`, `@Global`) is the typed wrapper over Redis. Don't inject `Repository<>` or the raw Redis client into feature code.

**Signing keys are in-memory only.** `JwksService` generates an RS256 keypair at boot and never persists it. Restarting changes the `kid`, which invalidates every previously issued JWT. This blocks multi-instance deployment until a persistent key store exists — relevant when reasoning about token verification failures across restarts.

**Crypto is centralized in `src/common/crypto/`.** `JwtService` mints/verifies all tokens and distinguishes them by the `typ` header: `JWT` (ID token, 5 min), `at+jwt` (access, RFC 9068, ~1 h), `rt+jwt` (refresh, ~30 d). Revocation logic keys off these `typ` values. Verification resolves the key by `kid` via `JwksService`.

**The OIDC protocol surface is `src/modules/oidc/`.** Controllers (`authorize`, `token`, `userinfo`, `revoke`, `interaction`, `discovery`, `client-registration`) are thin; `OidcService` holds the core flow logic (`completeConsent`, `exchangeCode`, `refreshTokens`, `revokeToken`). The browser flow is: `/oidc/authorize` → creates a Redis `interaction` → server-rendered login/consent pages (`InteractionController` + `InteractionViewService`) → session cookie + grant → authorization code → `/oidc/token` exchange. Existing session + grant lets `authorize` skip consent (the consent-skip fast path).

**PKCE is mandatory.** Every client requires PKCE; `S256` is the only advertised method (`plain` is accepted by the authorize endpoint for non-PKCE-required clients but intentionally not advertised). Discovery metadata should reflect what is *actually implemented*, not the full spec — unsupported methods/grants/algs are kept as commented-out entries with reasons in `discovery.controller.ts`.

## Conventions and gotchas

- **Global `ValidationPipe` uses `whitelist + forbidNonWhitelisted + transform`.** Any request field not declared on the DTO is rejected with 400. When an endpoint must accept-but-ignore spec fields (e.g. extra OIDC `/authorize` params, RFC 7591 metadata), declare them on the DTO as optional anyway — see `authorize-query.dto.ts` and `client-registration.dto.ts`.
- **Guards run before pipes.** Guard order in `@UseGuards(A, B)` is significant — e.g. the registration endpoint lists the rate-limit guard before the auth-token guard so invalid-token attempts are throttled too.
- **Config is read two ways.** Typed config (DB, Redis, session) flows through `src/common/config/configuration.ts` + `ConfigService`. Operational toggles are read directly from `process.env` in guards/services: `OIDC_ISSUER`, `ADMIN_EMAILS`, `OIDC_REGISTRATION_ACCESS_TOKEN`, `OIDC_REGISTRATION_RATE_*`. Match the surrounding file's pattern.
- **Errors follow OAuth/OIDC shapes**: return `{ error, error_description }` with the correct status (e.g. `invalid_client` → 401, `invalid_grant`/`invalid_client_metadata` → 400). The revoke endpoint deliberately returns 200 for unknown tokens (no validity oracle).
- **TypeORM `synchronize` is ON in non-production**, so entity definitions are the schema source of truth in dev; a `migrations/` dir exists for the eventual production path.
- **Dev seeding** (non-production boot) creates a `default` tenant, demo users, and clients — sign in with `test@example.com` / `password`.
- **Admin API** (`/api/v1/clients`) is gated by `AdminGuard` (signed session cookie + `ADMIN_EMAILS` allowlist), distinct from the OIDC client-auth path used at the token/revoke endpoints.
