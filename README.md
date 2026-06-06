# identity-nest

A [NestJS](https://nestjs.com/) **OAuth 2.0 Authorization Server / OpenID Connect Provider**.

> ### Status: Work in progress
> The OIDC Authorization Code + PKCE flow works end-to-end. The long-term goal is
> [certification](https://openid.net/certification/) against
> [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
> — the identity layer on top of
> [OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749). Production concerns
> (migrations, MFA, rate limiting, audit logging, refresh-token rotation,
> multi-tenant enforcement) are tracked in
> [`__planning/production_roadmap.md`](./docs/plans/production_roadmap.md) and are
> not yet implemented.

## What it does today

- **Authorization Code flow with PKCE** (`S256`) — PKCE is required for every client.
- **RS256-signed JWTs**: ID tokens, access tokens (`at+jwt`, RFC 9068), refresh tokens (`rt+jwt`).
- **JWKS** publication (`/oidc/jwks.json`) and **OIDC discovery** (`/.well-known/openid-configuration`).
- **UserInfo** endpoint with scope-filtered claims.
- **Token revocation** (RFC 7009) with an access-token denylist + grant revocation.
- **Server-rendered login & consent** pages, with session reuse and consent-skip when scopes are already granted.
- **Admin client API** (`/api/v1/clients`) for registering and rotating OAuth/OIDC clients.
- **Swagger UI** at `/api/docs`.

Persistent data (users, clients, grants, tenants) lives in **PostgreSQL**;
short-lived protocol state (sessions, authorization codes, interactions, token
denylist) lives in **Redis**.

## Quick start

```bash
cp .env.example .env            # first time only
docker compose up -d db redis   # Postgres 17 + Redis 7
npm install
npm run start:dev               # https://localhost:3000 (self-signed cert)
```

On startup (non-production) the app seeds a `default` tenant, three users, and
three OAuth clients — sign in with **`test@example.com` / `password`** and the
seeded `dashboard-spa` / `test-client` clients. See
[seeded data](./docs/configuration.md#seeded-data).

```bash
# verify it's up
curl -k https://localhost:3000/.well-known/openid-configuration
```

## Documentation

Full documentation lives in [`docs/`](./docs/README.md):

| Doc | Contents |
| --- | --- |
| [Architecture](./docs/architecture.md) | Tech stack, module map, storage split, request lifecycle, security model, known gaps |
| [API Reference](./docs/api-reference.md) | Every endpoint: params, responses, error codes, auth |
| [Authentication Flows](./docs/authentication-flows.md) | Sequence diagrams: authorize → consent → token, refresh, revoke |
| [Data Model](./docs/data-model.md) | Entity ERD, Postgres/Redis split, key reference, token claims |
| [Configuration](./docs/configuration.md) | Env vars, Docker, TLS/keys, seeded data, troubleshooting |
| [API Testing Guide](./docs/api-testing.md) | Hands-on Postman / Bruno / Insomnia walkthroughs |

The interactive OpenAPI UI is served by the running app at **`/api/docs`**
(JSON at `/api/docs/openapi.json`).

## Tests

```bash
npm run test        # unit tests (*.spec.ts)
npm run test:cov    # with coverage
npm run test:e2e    # end-to-end (requires Postgres + Redis)
```

## Tech stack

NestJS 11 · TypeScript · TypeORM + PostgreSQL · Redis (ioredis) · `jose`
(RS256 JWT/JWKS) · bcrypt · class-validator · @nestjs/swagger. HTTPS via a
self-signed dev certificate.

> ⚠ Defaults in `.env.example` are insecure and for local development only.
> Review the [production checklist](./docs/configuration.md#production-checklist)
> before deploying.
</content>
