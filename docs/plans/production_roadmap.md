# Production Roadmap — 8-Week Plan to v1 Launch

## Operating Principles

- **Each milestone is a shippable slice.** End every week on a green build with the new feature behind a flag if needed; never carry broken state into the next milestone.
- **Security debt is not deferrable.** Anything in M1–M4 must land before launch. M5–M8 may be reordered by priority.
- **No `synchronize: true` in production.** All schema changes from M1 onward go through migrations.
- **Tests gate features.** Each new endpoint ships with at least one e2e spec. Coverage target ≥70% by M8.
- **Threat-model each milestone** before coding it. Capture the model in a short comment block in the relevant module.

## Where We Are Today

**Implemented (no rework needed):**
- OIDC core: `/oidc/authorize`, `/oidc/token`, `/oidc/userinfo`, `/oidc/revoke`, `/.well-known/openid-configuration`, `/.well-known/jwks.json`
- Response types: code, implicit (`id_token`, `id_token token`), hybrid (`code id_token`, `code token`, `code id_token token`), and `none` — with `query`/`fragment` response modes and `at_hash`/`c_hash` binding
- Auth code + PKCE flow, JWT (RS256) issuance, JWKS rotation
- Client authentication: `client_secret_basic`/`post`, `client_secret_jwt`/`private_key_jwt` (RFC 7523 assertions with single-use `jti` replay guard), and public `none`
- Client secrets sealed at rest with AES-256-GCM (`ClientSecretCipher`) — an early slice of the M2 encryption-at-rest work
- RFC 7591 dynamic client registration at `/oidc/register` (initial-access-token gated) + admin-guarded `/clients` API
- Postgres (TypeORM) + Redis cache (sessions, auth codes, interactions, denylist, assertion-replay)
- Internal apps dashboard (`/apps`) + login/logout
- ConfigModule with typed config

**Entities defined but not wired to APIs:** `User`, `Tenant`, `Organization`, `Group`, `UserGroupMembership`, `ConsentRecord`, `Policy`, `AuditLog`, `Credential`, `Session` (legacy), `AccessToken`.

**Missing for production:** migrations, tenant isolation enforcement, MFA, rate limiting, account lockout, audit logging, email verification, password reset, refresh-token rotation+revocation, RP-initiated logout, observability, CI/CD, hardened secrets, comprehensive tests.

---

## Milestone 1 — Schema Discipline & Tenant Isolation (Week 1)

**Goal:** Replace `synchronize: true` with migrations and make every query tenant-scoped at the framework level so we cannot leak across tenants.

**Scope:**
- Adopt `typeorm-migrations` workflow. Generate baseline migration from current schema. Add npm scripts: `migration:generate`, `migration:run`, `migration:revert`. Set `synchronize: false` for non-dev envs in [src/common/config/configuration.ts](src/common/config/configuration.ts).
- Introduce a `TenantContext` request-scoped provider that pulls `tenant_id` from the JWT (for token-authenticated requests) or from an admin-supplied header on management APIs. Reject requests with no tenant.
- Create a `TenantScopedRepository<T>` base class (or a TypeORM subscriber) that injects `WHERE tenant_id = :ctx.tenantId` into every find/update/delete. Refactor `AccountStore`, `ClientStore`, `GrantStore` to extend it.
- Backfill `tenant_id` on every existing entity that lacks it (`Account`, `ClientApplication`, `Grant`, `RefreshToken`).
- Add Postgres row-level security policies as a defense-in-depth backstop (per-table `USING (tenant_id = current_setting('app.tenant_id')::uuid)`).

**Acceptance:**
- Cross-tenant leak test (e2e): client A from tenant T1 cannot read client B from tenant T2. Returns 404, not 403.
- `npm run migration:run` produces an empty diff against a freshly seeded dev DB.

**Critical files:** `src/common/config/configuration.ts`, new `src/common/tenant/tenant.context.ts`, new `src/common/db/tenant-scoped.repository.ts`, all `src/modules/store/stores/*.store.ts`, new `src/migrations/`.

---

## Milestone 2 — Security Baseline (Week 2)

**Goal:** Stand up the controls every endpoint will rely on.

**Scope:**
- **Rate limiting** via Redis (INCR + EXPIRE). Wrap as a `@Throttle()` decorator + `ThrottlerGuard`. Apply tighter limits to `/oidc/token`, `/oidc/authorize`, `/interaction/*/login`, password reset, and MFA verify than to read endpoints.
- **Account lockout**: track `failed_login_attempts` and `locked_until` on `accounts`. Lock for 15min after 5 failures; lock for 1h after 20 in 60min. Surface as `423 Locked` with `Retry-After`.
- **Audit logging** service that writes to the `audit_logs` table for: every auth attempt (success/failure), every token issuance/revocation, every admin write, every consent grant/revoke. Async via a NestJS event bus so audit failures never block the request path. Include correlation IDs (`X-Request-Id`).
- **Encryption at rest** for sensitive columns: MFA secrets, recovery codes, refresh-token opaque values. Use a `Cipher` service backed by AES-256-GCM, with the master key from `TENANT_ENCRYPTION_KEY` (move to KMS in M7).
- **Structured logging**: replace `console.log`-style usage with `pino` JSON output, redact secrets, attach `requestId`/`tenantId`/`accountId`.

**Acceptance:**
- A login brute-force test triggers lockout and rate-limit responses.
- Every endpoint produces an `audit_logs` row visible by tenant.
- `psql` shows MFA secrets as ciphertext, not plaintext.

**Critical files:** new `src/common/throttle/`, new `src/common/audit/audit.service.ts`, new `src/common/crypto/cipher/`, `src/modules/auth/auth.service.ts` (lockout fields).

---

## Milestone 3 — MFA (Week 3)

**Goal:** TOTP enrollment + step-up at login. Recovery codes for break-glass.

**Scope:**
- TOTP enrollment endpoints: `POST /api/v1/mfa/totp/enroll` returns a base32 secret + QR-data URI; `POST /api/v1/mfa/totp/verify` activates after the user submits the first 6-digit code.
- Recovery codes: 10 single-use codes generated on enrollment, hashed with bcrypt at rest, displayed once.
- Login flow update: after password verification, if the account has `mfa_enabled`, the interaction enters an `mfa` prompt (alongside `login`/`consent`). Store the partial-auth state in Redis (TTL 5min, attempts ≤5 with lockout-on-fail).
- `POST /interaction/:uid/mfa` accepts a TOTP code or a recovery code. Successful recovery-code use marks the code as consumed and warns the user.
- Persist MFA factors in `Credential` entity (already exists). Factor types: `totp`, `recovery_code`. Reserve hooks for `webauthn` and `sms` later.
- ACR/AMR claims in the ID token reflect the methods used (`pwd`, `otp`, `mfa`).

**Acceptance:**
- Full enroll → log out → log in with MFA → recovery-code fallback flow works in the dev SPA.
- ID tokens for MFA users include `acr: "urn:mace:incommon:iap:silver"` (or chosen value) and `amr: ["pwd","otp"]`.

**Critical files:** new `src/modules/mfa/`, `src/modules/oidc/controllers/interaction.controller.ts`, `src/common/crypto/jwt/jwt.service.ts` (claims), `src/common/entities/credential.entity.ts`.

---

## Milestone 4 — User Lifecycle, Token Hygiene, RP-Initiated Logout (Week 4)

**Goal:** Close the gaps that block real-world deployment of the auth flow.

**Scope:**
- **Email verification**: `email_verified=false` on signup; sign a short-lived JWT verification link, expose `GET /api/v1/email/verify?token=...`. Block login (or downgrade scopes) on unverified accounts per tenant policy.
- **Password reset**: `POST /api/v1/password/reset/request` (always returns 204 to avoid enumeration), token-link to a `/password/reset` page, `POST /api/v1/password/reset/confirm`. Invalidate all sessions and refresh tokens on success.
- **Refresh token rotation with family detection**: every `refresh_token` use mints a new one and revokes the prior. If a previously-rotated token is replayed, revoke the entire `family_id` and audit-log a token-theft event. Flesh out the existing `RefreshToken` entity (already has `family_id`, `parent_token_id`).
- **Token revocation**: implement `POST /oauth/revoke` per RFC 7009. Implement `POST /oauth/introspect` per RFC 7662 (cached in Redis with 60s TTL, invalidated on revocation).
- **End-session / RP-initiated logout**: `GET /oidc/end_session` per OIDC spec — accepts `id_token_hint`, `post_logout_redirect_uri`, `state`. Destroys session, optionally redirects.
- **Email delivery**: integrate a transactional provider (Resend or SES). Abstract behind a `MailerService` so tests can stub it.

**Acceptance:**
- A leaked refresh token replayed once invalidates the whole family and pages oncall (audit + log).
- Logging out via `end_session` clears the session in Redis and the cookie in the browser.
- A reset-password run nukes existing sessions across all of a user's devices.

**Critical files:** new `src/modules/email/`, new `src/modules/password-reset/`, `src/modules/oidc/oidc.service.ts` (rotation), new `src/modules/oidc/controllers/revoke.controller.ts`, new `src/modules/oidc/controllers/end-session.controller.ts`.

---

## Milestone 5 — Multi-Tenant Management APIs (Week 5)

**Goal:** Make the IdP usable by an admin without hitting the database directly.

**Scope:**
- `POST/GET/PATCH/DELETE /api/v1/tenants` (super-admin only).
- `POST/GET/PATCH/DELETE /api/v1/users` (tenant-scoped): includes attributes JSONB, MFA reset, account lock/unlock.
- `POST/GET /api/v1/orgs`, `/api/v1/groups`, `/api/v1/groups/:id/members`. Wire up `UserGroupMembership` entity.
- `GET/DELETE /api/v1/users/:id/sessions` — list and revoke active sessions (read from Redis, support per-user session indexing via a Redis SET `idp:user-sessions:{userId}`).
- `GET/DELETE /api/v1/users/:id/grants` — list and revoke OAuth consents.
- DTOs validated with class-validator; swagger annotations on all endpoints; OpenAPI spec exported as a build artifact for client SDK generation.

**Acceptance:**
- Postman/Insomnia collection runs end-to-end against a fresh tenant.
- A tenant admin can fully provision an account and trigger a forced MFA re-enrollment.

**Critical files:** new `src/modules/tenant/`, expand `src/modules/user/`, new `src/modules/orgs/`, new `src/modules/groups/`.

---

## Milestone 6 — Adaptive Auth & Policy Hooks (Week 6)

**Goal:** Make tenant-level security knobs configurable instead of hard-coded.

**Scope:**
- **Password policy**: per-tenant min-length, char-class requirements, history depth, max age. Enforced on signup/reset.
- **Session policy**: per-tenant idle timeout, absolute timeout, concurrent-session cap. Concurrent caps require the per-user session index from M5.
- **Conditional access (basic v1)**: a `Policy` evaluator that takes `{ipAddress, country, userAgent, mfaEnrolled, lastAuthAge}` and returns `{allow|deny|require_mfa|require_step_up}`. Three built-in conditions for v1: country allow/block list, require-MFA-from-new-device, deny-after-N-failed. Stored in `policies` JSONB.
- **Step-up auth**: clients can pass `acr_values=urn:...:step_up` on `/oidc/authorize` to force a fresh MFA prompt regardless of session age.
- **Webhooks**: per-tenant outbound webhooks for `user.created`, `auth.failed`, `token.revoked`, `policy.denied`. HMAC-signed, retried with exponential backoff.

**Acceptance:**
- A tenant configured with "require MFA from new countries" forces MFA on the second login from a different geo.
- A test webhook receiver captures `auth.failed` within ~1s of the event.

**Critical files:** new `src/modules/policy/`, new `src/modules/webhooks/`, `src/modules/oidc/oidc.service.ts` (policy evaluation hook).

---

## Milestone 7 — Hardening: Tests, Secrets, Observability, CI/CD (Week 7)

**Goal:** Make the system inspectable, automatable, and shippable.

**Scope:**
- **Test coverage**:
  - e2e suite hits a real Postgres + Redis (testcontainers). Cover: PKCE flow, refresh rotation, token theft detection, MFA enrollment, password reset, tenant isolation cross-leak, rate-limit lockout.
  - Contract tests against the OpenAPI spec.
  - Coverage gate ≥70% in CI.
- **Secrets**: move `JWT_PRIVATE_KEY`, `COOKIE_SECRET`, `TENANT_ENCRYPTION_KEY`, `REDIS_PASSWORD`, DB creds out of env into a vault (AWS Secrets Manager, Vault, or sealed-secrets for K8s). Add a `SecretsProvider` abstraction and inject via ConfigModule's `validationSchema`.
- **Observability**:
  - `/health` (liveness) and `/ready` (DB+Redis ping) endpoints.
  - OpenTelemetry tracing on all requests (auto-instrumented via `@opentelemetry/instrumentation-nestjs-core`).
  - Prometheus metrics: request count by route, latency p50/p95/p99, auth success/failure, token issuance, cache hit rate, DB pool utilization. Expose at `/metrics`.
  - Log aggregation: ship pino JSON logs to Loki/Cloudwatch.
- **CI/CD**:
  - GitHub Actions: lint, type-check, unit tests, e2e (testcontainers), migration dry-run, container build.
  - Tagged builds push images to a registry. Staging deploy runs migrations before app rollout.
  - Pre-commit hook: `lint-staged` + `prettier`.

**Acceptance:**
- A red e2e blocks merge to main.
- Grafana dashboard renders auth-success-rate, latency, and error-rate panels with real traffic.
- Rotating any secret in the vault propagates to running pods within 60s.

**Critical files:** `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `test/e2e/*`, `src/common/health/`, `src/common/observability/`, `Dockerfile` (multi-arch + non-root).

---

## Milestone 8 — Pre-Launch: Security Review, Load Test, Runbooks (Week 8)

**Goal:** Earn confidence to flip the switch.

**Scope:**
- **Security review** (internal first, external pen test scheduled): OWASP ASVS L2 checklist, dependency audit (`npm audit` + Snyk), secret scanner (gitleaks), container scan (Trivy). Fix all H/Cs before launch.
- **Threat modeling deliverable**: short STRIDE write-up per major flow (login, token, admin) committed to `__planning/threat_model.md`.
- **Load test**: k6 or Artillery. Targets per the architecture doc: 10k auth req/s and 5k token req/s per instance with p99 <300ms. Identify bottlenecks; tune Postgres pool, Redis connection count, JWT signing path (consider key caching).
- **DR drill**: snapshot Postgres, fail over to a fresh region, restore Redis from AOF/snapshot, verify auth still works. Document RTO/RPO actuals.
- **Runbooks**: oncall playbooks for: token-theft incident, key compromise, DB failover, Redis outage, mass account lockout, token signing failure.
- **Production launch checklist**: TLS certs, HSTS, CSP, secure cookies (`Secure`, `HttpOnly`, `SameSite`), CORS allowlist, customer-facing status page, support escalation, GDPR data-subject endpoints (`/api/v1/users/:id/export`, `/api/v1/users/:id/delete`).
- **Soft launch**: one internal tenant for one week before opening signups.

**Acceptance:**
- Pen test report has zero unresolved Highs/Criticals.
- Load test sustains target throughput for 30min with p99 within budget.
- Failover drill executed within RTO=15min, RPO=5min.

**Critical files:** `__planning/threat_model.md`, `__planning/runbooks/*.md`, `loadtest/`, `.github/workflows/security-scan.yml`.

---

## Cross-Cutting Concerns (continuous, every milestone)

- **Migrations:** every schema change ships as a migration committed in the same PR.
- **Backwards compatibility:** the OIDC contract (`/oidc/*` endpoints, claim names, scopes) is frozen at M1. Internal admin APIs are pre-1.0 and may break.
- **Documentation:** Swagger generated; README updated with each milestone's user-facing changes; `__planning/architecture-decisions/` for ADRs on non-obvious calls (refresh-rotation strategy, encryption key hierarchy, tenant resolution order).
- **Dependency hygiene:** Renovate or Dependabot. No deferred upgrades past one minor.

## Out of Scope for v1 (post-launch backlog)

- SAML 2.0 IdP and federation (M9+)
- SCIM 2.0 provisioning (M9+)
- WebAuthn / passkeys (M10)
- Social/external IdP federation (Google, GitHub, Azure AD)
- Multi-region active-active deployment
- Per-tenant custom domains and branding UI
- Self-service signup with billing integration

## Risk Register

| Risk | Mitigation | Owner |
|------|------------|-------|
| Migration from `synchronize: true` corrupts dev data | Baseline migration generated against a clean DB; provide one-time "reset & seed" script | M1 |
| MFA enrollment break-glass: lost recovery codes | Tenant-admin "force MFA reset" endpoint with audit trail | M3 |
| Refresh-token family detection produces false positives under clock skew or retries | Allow a 30s grace window for the same parent_token_id; log instead of revoke during the window | M4 |
| Pen test surfaces structural issue late | Pre-pen-test internal review at end of M6, not M8 | M6 |
| Load-test reveals JWT signing as bottleneck | Pre-emptively benchmark RS256 throughput in M2; pre-allocate signing keys; consider EdDSA | M2/M8 |
| Two-month timeline slips on M5 (large surface area) | Cut webhooks (M6) and Org/Group APIs (M5) to post-launch if behind by end of M5 | weekly review |

## Weekly Cadence

- **Monday:** plan the week's milestone, threat-model the flows, open tracking issue.
- **Wednesday:** mid-week review — unblock, redirect if needed.
- **Friday:** demo + retro. Tag a release `v0.{milestone}.0` with notes.
