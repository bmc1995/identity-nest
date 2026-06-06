# Status Checklist — Identity Nest

> Snapshot date: 2026-06-05. Cross-references [`plan_overview.md`](./plan_overview.md),
> [`production_roadmap.md`](./production_roadmap.md), and the `docs/` guide set.
> "Done" here means **verified in source**, not merely planned or entity-defined.

## Legend

- [x] **Done** — implemented and wired end-to-end
- [~] **Partial** — some pieces exist; gaps noted inline
- [ ] **Not started**

---

## ✅ Done (verified in code)

### OIDC / OAuth core
- [x] `GET /oidc/authorize` — Authorization Code flow, client + redirect_uri validation
- [x] Authorization Code + **PKCE** (`S256` and `plain`; `requirePkce` forces S256)
- [x] `POST /oidc/token` — `authorization_code` and `refresh_token` grants
- [x] `GET /oidc/userinfo` — bearer-guarded, scope-filtered claims
- [x] `POST /oidc/revoke` — **RFC 7009** token revocation (anti-oracle responses)
- [x] `GET /.well-known/openid-configuration` — discovery document
- [x] `GET /oidc/jwks.json` — JWKS publication
- [x] Interaction UI: `/interaction/:uid` login + consent (server-rendered)

### Crypto / tokens
- [x] RS256 JWT signing (`at+jwt`, `rt+jwt`, ID token)
- [x] JWKS service with key rotation + `kid` lookup
- [x] Keygen service
- [x] Token denylist (Redis, TTL = remaining token life) consulted by `BearerTokenGuard`

### Storage / infra
- [x] PostgreSQL via TypeORM
- [x] Redis cache layer (typed config)
- [x] Sessions in Redis (HMAC-signed cookies, `httpOnly`, `sameSite=lax`)
- [x] Auth codes + interactions in Redis
- [x] Grants + consent persisted in Postgres
- [x] HTTPS with self-signed cert (`src/common/https/`)

### Admin / clients
- [x] Client registration `POST /api/v1/clients` (+ list, get, rotate-secret)
- [x] `AdminGuard` (session-cookie + `ADMIN_EMAILS` allowlist)

### Separation of concerns (recent refactor)
- [x] `UserService`, `SessionService`, `InteractionViewService`,
      `ClientAuthenticatorService`, `TokenDenylistService` extracted from god-objects

### Tests / docs
- [~] Unit tests: pkce, jwt, jwks, keygen, discovery, jwks-controller, InMemoryStore
- [~] e2e: `app.e2e-spec.ts` (broken import path), `seed.e2e-spec.ts`
- [x] `docs/` guide set (architecture, api-reference, auth-flows, data-model, config)

---

## ~ Partial / gaps in "done" features

- [~] **Refresh tokens are stateless JWTs.** No rotation, no family/replay
      detection, no persistent store. `RefreshToken` entity + `family_id`/
      `parent_token_id` columns exist but are **never written**. → M4
- [~] **Revoke is best-effort only.** Denylists the access-token `jti` and
      soft-deletes the `Grant`; sibling access tokens from the same grant stay
      valid until expiry (no per-grant JTI index). → M4
- [~] **Discovery advertises only `S256`** for PKCE but `/authorize` still
      accepts `plain`. Minor spec inconsistency. → M1/M4 cleanup
- [~] **Tenancy is seed-only.** A `default` tenant is seeded and stamped on
      users, but **no isolation is enforced** at query or DB level. → M1
- [~] **Test coverage well below the ≥70% gate.** Controllers, stores,
      oidc.service, auth flow are largely untested. → M7

---

## ❌ Not started (entity may exist; behavior does not)

### M1 — Schema discipline & tenant isolation
- [ ] TypeORM migrations workflow; `synchronize: false` for non-dev
- [ ] `TenantContext` request-scoped provider (`src/common/tenant/` is empty)
- [ ] `TenantScopedRepository<T>` injecting `WHERE tenant_id`
- [ ] Postgres row-level security policies
- [ ] Cross-tenant leak e2e test

### M2 — Security baseline
- [ ] Rate limiting (Redis throttler)
- [ ] Account lockout (`failed_login_attempts`, `locked_until`, `423 Locked`)
- [ ] Audit logging service → `audit_logs` (entity exists, unwired)
- [ ] Encryption-at-rest `Cipher` service (AES-256-GCM)
- [ ] Structured logging (pino, redaction, correlation IDs)

### M3 — MFA
- [ ] TOTP enroll/verify; recovery codes
- [ ] `mfa` interaction prompt + partial-auth state
- [ ] Persist factors in `Credential` entity (exists, unwired)
- [ ] `acr`/`amr` claims in ID token

### M4 — User lifecycle & token hygiene
- [ ] Email verification + `MailerService`
- [ ] Password reset (request/confirm, session invalidation)
- [ ] Refresh-token rotation + family/replay detection
- [ ] `POST /oidc/introspect` (RFC 7662)
- [ ] `GET /oidc/end_session` (RP-initiated logout)
- [x] ~~`POST /oidc/revoke` (RFC 7009)~~ **DONE** (roadmap lists as pending)

### M5 — Multi-tenant management APIs
- [ ] `/api/v1/tenants`, `/api/v1/users`, `/api/v1/orgs`, `/api/v1/groups`
- [ ] Session list/revoke; grant list/revoke (per-user Redis session index)

### M6 — Adaptive auth & policy
- [ ] Password policy, session policy, conditional access, step-up auth, webhooks

### M7 — Hardening
- [ ] Coverage ≥70%, testcontainers e2e, contract tests
- [ ] Secrets vault abstraction
- [ ] `/health` + `/ready`, OpenTelemetry, Prometheus `/metrics`
- [ ] GitHub Actions CI/CD (`.github/workflows/` does not exist)

### M8 — Pre-launch
- [ ] Security review (ASVS L2, npm audit, gitleaks, Trivy)
- [ ] `threat_model.md`, runbooks, load test, DR drill, launch checklist

---

## Issue tracking

Paste-ready GitHub issue drafts live in [`github-issues/`](./github-issues/).
Run [`github-issues/create-issues.sh`](./github-issues/create-issues.sh) once
`gh` is installed and authenticated to open them all (one epic per milestone).
