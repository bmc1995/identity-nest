# API Testing Guide — Postman / Bruno / Insomnia

This guide replaces the old in-repo test SPA. It walks through exercising
every endpoint of the Identity Nest IdP from a desktop API client.

> **TL;DR** — boot the stack, hit the OpenAPI spec at
> `https://localhost:3000/api/docs/openapi.json`, import it into your client,
> and use the seeded `test-client` / `dashboard-spa` clients, signing in as
> `test@example.com` / `password` (the login form takes the **email**, not the
> username).

---

## 1. Prerequisites

### 1.1 Run the stack

```bash
cp .env.example .env          # first time only
docker compose up -d db redis # start Postgres + Redis
npm install
npm run start:dev             # boots on https://localhost:3000
```

The Nest server seeds three OAuth clients and three user accounts on
startup whenever `NODE_ENV !== production` (see
[src/modules/store/seed.service.ts](../src/modules/store/seed.service.ts)).

> **HTTPS with a self-signed certificate.** The server boots over **HTTPS**
> (the dev cert/key in `src/common/https/`), so every URL below is
> `https://localhost:3000`. Because the certificate is self-signed you must
> tell each tool to trust it:
>
> - **Browser:** accept the certificate warning the first time you open an
>   interaction/authorize URL.
> - **Postman:** *Settings ▸ General ▸ SSL certificate verification* → **off**.
> - **Insomnia:** *Preferences ▸ General ▸ Validate certificates* → **off**.
> - **Bruno:** *Preferences ▸ General* → disable **SSL/TLS Certificate Verification**.
> - **curl:** add `-k` (e.g. `curl -k https://localhost:3000/.well-known/openid-configuration`).
>
> For a trusted certificate, terminate TLS behind a reverse proxy and point
> `OIDC_ISSUER` at the public origin.

### 1.2 Pick a client

Tested with:

| Client                        | Native callback URL                                                     |
| ----------------------------- | ----------------------------------------------------------------------- |
| **Postman** (desktop)         | `https://oauth.pstmn.io/v1/callback`                                    |
| **Bruno** (desktop, ≥ 1.30)   | `http://localhost:8080/callback` (any localhost URL Bruno opens for you)|
| **Insomnia** (desktop)        | `http://localhost:8080/callback` (Insomnia's local listener)            |

The seed registers both `https://oauth.pstmn.io/v1/callback` and
`http://localhost:8080/callback` on `test-client` and `dashboard-spa`, so
all three tools work out of the box.

> If you change tool / callback URL, register a new client (see § 6) or
> add the URI to a seeded client by editing `seed.service.ts` and
> restarting.

---

## 2. Seeded test data

| Username (nickname) | Password    | Email                  | Email verified | Role  |
| ------------------- | ----------- | ---------------------- | -------------- | ----- |
| `testuser`          | `password`  | `test@example.com`     | yes            | user  |
| `admin`             | `admin123`  | `admin@example.com`    | yes            | admin |
| `jane.doe`          | `password`  | `jane.doe@example.com` | no             | user  |

> **Sign in with the email**, not the username — the interaction login form
> validates the field as an email address (the "Username" above is the user's
> nickname, surfaced as `preferred_username`, and is not accepted at login).

Admin status is controlled by the `ADMIN_EMAILS` env var (comma-separated,
case-insensitive list of **emails**, defaults to `admin@example.com`). Only
admins can hit `/api/v1/clients/*`.

| Client ID        | Type   | Auth method            | Secret        | PKCE     |
| ---------------- | ------ | ---------------------- | ------------- | -------- |
| `test-client`    | web    | `client_secret_basic`  | `test-secret` | required |
| `dashboard-spa`  | spa    | `none` (public)        | —             | required |
| `mobile-app`     | native | `none` (public)        | —             | required |

`testuser` is **pre-authorized** for `dashboard-spa` (scopes
`openid profile email`), so the consent screen is skipped — useful for
fast loops.

---

## 3. Endpoint reference

Base URL: `https://localhost:3000`

### 3.1 Discovery & keys (no auth)

| Method | Path                                  | Purpose                                              |
| ------ | ------------------------------------- | ---------------------------------------------------- |
| GET    | `/.well-known/openid-configuration`   | OIDC discovery document                              |
| GET    | `/oidc/jwks.json`                     | JSON Web Key Set for verifying ID/access tokens      |
| GET    | `/`                                   | "Hello World" health probe                           |

### 3.2 OAuth 2.0 / OIDC core

| Method | Path              | Purpose                                            |
| ------ | ----------------- | -------------------------------------------------- |
| GET    | `/oidc/authorize` | Authorization endpoint (browser)                   |
| POST   | `/oidc/token`     | Token endpoint (code / refresh)                    |
| GET    | `/oidc/userinfo`  | UserInfo endpoint (requires Bearer access token)   |

### 3.3 IdP-rendered interaction surface

These pages are visited via redirects from `/oidc/authorize`. The
desktop OAuth helpers in Postman/Bruno/Insomnia open them in a browser
window automatically, so you usually don't call them by hand.

| Method | Path                          | Purpose                              |
| ------ | ----------------------------- | ------------------------------------ |
| GET    | `/interaction/:uid`           | Login or consent HTML page           |
| POST   | `/interaction/:uid/login`     | Submit login form                    |
| POST   | `/interaction/:uid/consent`   | Submit consent form (`approved=true|false`) |
| GET    | `/interaction/:uid/abort`     | Abort an interaction                 |

### 3.4 Admin (requires session cookie + admin account)

| Method | Path                                  | Purpose                                 |
| ------ | ------------------------------------- | --------------------------------------- |
| POST   | `/api/v1/clients`                     | Register a new client                   |
| GET    | `/api/v1/clients`                     | List clients                            |
| GET    | `/api/v1/clients/:id`                 | Get one client (UUID)                   |
| POST   | `/api/v1/clients/:id/rotate-secret`   | Rotate a confidential client's secret   |

The full Swagger spec is hosted at
[`https://localhost:3000/api/docs`](https://localhost:3000/api/docs) with
the JSON document at
[`https://localhost:3000/api/docs/openapi.json`](https://localhost:3000/api/docs/openapi.json).
**All three tools support importing OpenAPI 3.x — that is the fastest
way to scaffold the request collection.**

---

## 4. Postman

### 4.1 Import the spec

`File ▸ Import ▸ Link` → `https://localhost:3000/api/docs/openapi.json` →
**Import**. You'll get a `Identity Nest API` collection.

### 4.2 Configure an OAuth 2.0 authorization helper

1. Click the imported collection → **Authorization** tab.
2. **Type:** `OAuth 2.0`.
3. **Add auth data to:** *Request Headers* (so child requests inherit it).
4. Hit **Get New Access Token** with these settings:

   | Field                    | Value                                                              |
   | ------------------------ | ------------------------------------------------------------------ |
   | Token Name               | `idp-test`                                                         |
   | Grant Type               | `Authorization Code (With PKCE)`                                   |
   | Callback URL             | `https://oauth.pstmn.io/v1/callback` (✅ *Authorize using browser*)|
   | Auth URL                 | `https://localhost:3000/oidc/authorize`                             |
   | Access Token URL         | `https://localhost:3000/oidc/token`                                 |
   | Client ID                | `test-client` *(or `dashboard-spa` for a public client)*           |
   | Client Secret            | `test-secret` *(leave blank for `dashboard-spa`)*                  |
   | Code Challenge Method    | `SHA-256`                                                          |
   | Code Verifier            | *(leave blank — Postman generates it)*                             |
   | Scope                    | `openid profile email`                                             |
   | State                    | *(leave blank — Postman generates it)*                             |
   | Client Authentication    | `Send as Basic Auth header` for confidential, `In request body` if you prefer the alternative form |

5. Click **Get New Access Token**. Postman opens a browser, hits the
   IdP's interaction page, and you sign in as `test@example.com` /
   `password`. Approve consent → Postman captures the code, exchanges
   it, and stores the token bundle.
6. **Use Token** to attach `Authorization: Bearer …` to subsequent
   requests.

### 4.3 Verify the token

Send `GET {{baseUrl}}/oidc/userinfo`. You should see:

```json
{
  "sub": "<account-uuid>",
  "preferred_username": "testuser",
  "email": "test@example.com",
  "email_verified": true
}
```

### 4.4 Refresh the access token

In the same OAuth dialog, expand **Available Tokens** and choose
**Refresh** — Postman POSTs to `/oidc/token` with
`grant_type=refresh_token`. The refresh token rotates on every use (the
old one is invalidated on the next refresh attempt).

### 4.5 Public client (dashboard-spa)

`dashboard-spa` is a public client (`token_endpoint_auth_method=none`).
In Postman:

- **Client ID:** `dashboard-spa`
- **Client Secret:** *(leave blank)*
- **Client Authentication:** `Send client credentials in body` *(needed
  so Postman omits the Basic header — the IdP rejects empty Basic
  credentials)*
- Everything else as above.

`testuser` already has a pre-seeded grant for this client → consent is
auto-skipped.

### 4.6 Admin endpoints

Admin endpoints are guarded by a session cookie issued during the OIDC
interaction login (it's set on the **third-party browser**, not in
Postman). The simplest path:

1. Open `https://localhost:3000/oidc/authorize?response_type=code&client_id=test-client&redirect_uri=https://oauth.pstmn.io/v1/callback&scope=openid&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256`
   in a browser, sign in as **`admin@example.com` / `admin123`**, approve consent.
2. Copy the `idp_session` cookie from the browser's DevTools (Application →
   Cookies → `localhost`).
3. In Postman, on the request, **Cookies → Add cookie** for
   `localhost`:
   ```
   idp_session=<paste signed value here>; Path=/; HttpOnly
   ```
4. Send `POST {{baseUrl}}/api/v1/clients` with body:

```json
{
  "name": "Manual Test App",
  "type": "web",
  "redirectUris": ["https://oauth.pstmn.io/v1/callback"]
}
```

Response (`201 Created`) returns the new `clientId` plus a one-time
`clientSecret`. Save it — it will not be shown again.

### 4.7 Save as a Postman environment

Create an environment with:

| Variable     | Value                              |
| ------------ | ---------------------------------- |
| `baseUrl`    | `https://localhost:3000`            |
| `clientId`   | `test-client`                      |
| `clientSecret` | `test-secret`                    |
| `email`      | `test@example.com`                 |
| `password`   | `password`                         |

Then your imported requests resolve `{{baseUrl}}/oidc/token` etc.
without hard-coding hosts.

---

## 5. Bruno

Bruno stores collections as files on disk, so it pairs well with this
repo. You can either import the OpenAPI spec or hand-author requests.

### 5.1 Import the OpenAPI spec

`Collection ▸ Import Collection ▸ OpenAPI 3 Spec` →
`https://localhost:3000/api/docs/openapi.json`.

### 5.2 Auth setup

On the imported collection, **Auth ▸ OAuth 2.0** → fill in:

| Field                        | Value                                                       |
| ---------------------------- | ----------------------------------------------------------- |
| Grant Type                   | `Authorization Code`                                        |
| Callback URL                 | `http://localhost:8080/callback`                            |
| Authorization URL            | `https://localhost:3000/oidc/authorize`                      |
| Access Token URL             | `https://localhost:3000/oidc/token`                          |
| Client ID                    | `test-client`                                               |
| Client Secret                | `test-secret`                                               |
| Scope                        | `openid profile email`                                      |
| State                        | *(auto)*                                                    |
| PKCE                         | ✅ Enabled (S256)                                           |
| Credentials Placement        | `As Authorization Header` (or `As URL Encoded Form Data`)   |
| Token placement              | `Headers`                                                   |
| Token header prefix          | `Bearer`                                                    |

Click **Get Access Token**. Bruno spawns a localhost listener, opens the
browser, and rounds-trips the code for you.

### 5.3 Sample request file

If you'd rather hand-write a request, drop this `.bru` file into your
collection and tweak as needed:

```bru
meta {
  name: UserInfo
  type: http
  seq: 1
}

get {
  url: {{baseUrl}}/oidc/userinfo
  body: none
  auth: oauth2
}

headers {
  Accept: application/json
}
```

Set `baseUrl` in the Bruno environment to `https://localhost:3000`.

### 5.4 Public-client tweak

For `dashboard-spa`, leave **Client Secret** blank and set
**Credentials Placement** to `As URL Encoded Form Data` so Bruno sends
`client_id` in the body and skips the empty Basic header.

---

## 6. Insomnia

### 6.1 Import the OpenAPI spec

`Application ▸ Import ▸ URL` →
`https://localhost:3000/api/docs/openapi.json` → **Import as Request
Collection**.

### 6.2 OAuth 2.0 helper

Open any request → **Auth ▸ OAuth 2.0**. Fill in:

| Field                        | Value                                                  |
| ---------------------------- | ------------------------------------------------------ |
| Grant Type                   | `Authorization Code`                                   |
| Authorization URL            | `https://localhost:3000/oidc/authorize`                 |
| Access Token URL             | `https://localhost:3000/oidc/token`                     |
| Client ID                    | `test-client`                                          |
| Client Secret                | `test-secret`                                          |
| Redirect URL                 | `http://localhost:8080/callback` *(or paste Insomnia's*|
|                              | *suggested URL into the seeded client list)*           |
| Scope                        | `openid profile email`                                 |
| State                        | *(auto)*                                               |
| Use PKCE                     | ✅ (Code Challenge Method `SHA-256`)                   |
| Credentials                  | `Basic Auth Header` (or `As Body Fields`)              |

Click **Fetch Tokens**. Insomnia opens the browser, drives the
interaction, and stores `access_token`, `id_token`, and
`refresh_token`. The OAuth helper auto-injects `Authorization: Bearer …`
on every subsequent request that uses the same auth profile.

### 6.3 Manual flow (no OAuth helper)

If you want to verify the underlying HTTP exchange, run two requests
directly:

**Request A — Token exchange (after manually obtaining a code in the browser):**

```
POST {{baseUrl}}/oidc/token
Content-Type: application/x-www-form-urlencoded
Authorization: Basic <base64(test-client:test-secret)>

grant_type=authorization_code
&code=<paste code from redirect URL>
&redirect_uri=http://localhost:8080/callback
&code_verifier=<your verifier>
```

**Request B — Refresh:**

```
POST {{baseUrl}}/oidc/token
Content-Type: application/x-www-form-urlencoded
Authorization: Basic <base64(test-client:test-secret)>

grant_type=refresh_token
&refresh_token=<from prior response>
```

(For public clients, drop the Basic header and put `client_id=…` in the
body instead.)

---

## 7. Manual flow walkthrough (any tool)

Useful for debugging. The full sequence is:

```
┌──────────┐   1. GET /oidc/authorize?…&code_challenge=…&code_challenge_method=S256
│          │  ────────────────────────────────────────────────────────────────────▶
│ Browser  │   2. 303 → /interaction/<uid>     (login form)
│ (or tool │   3. POST /interaction/<uid>/login   email=test@example.com&password=password
│  helper) │   4. 303 → /interaction/<uid>     (consent form, skipped if pre-granted)
│          │   5. POST /interaction/<uid>/consent  approved=true
│          │   6. 303 → <redirect_uri>?code=<code>&state=<state>
└────┬─────┘
     │
     ▼
┌──────────┐   7. POST /oidc/token  grant_type=authorization_code
│   Tool   │      &code=<code>&code_verifier=<verifier>&redirect_uri=…
│          │  ◀──── { access_token, id_token, refresh_token, ... }
└──────────┘
     │
     ▼ 8. GET /oidc/userinfo  Authorization: Bearer <access_token>
        ◀──── { sub, preferred_username, email, email_verified }
```

### 7.1 Generating PKCE values by hand

If you can't use the tool's built-in PKCE generator, run this in any
shell with Python 3:

```bash
python3 -c "
import os, hashlib, base64
v = base64.urlsafe_b64encode(os.urandom(32)).rstrip(b'=').decode()
c = base64.urlsafe_b64encode(hashlib.sha256(v.encode()).digest()).rstrip(b'=').decode()
print('verifier =', v)
print('challenge =', c)
"
```

Use the `verifier` in the `code_verifier` body parameter at step 7, and
`challenge` in `code_challenge` at step 1 with
`code_challenge_method=S256`.

### 7.2 Pre-built request set

| # | Request                    | Body / Query                                                                                                                                                    |
| - | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | `GET /oidc/authorize`      | `response_type=code&client_id=test-client&redirect_uri=https://oauth.pstmn.io/v1/callback&scope=openid+profile+email&state=xyz&code_challenge=…&code_challenge_method=S256` |
| 2 | (browser) `/interaction/:uid` login submit | `email=test@example.com&password=password`                                                                                                       |
| 3 | (browser) `/interaction/:uid` consent submit | `approved=true`                                                                                                                                |
| 4 | `POST /oidc/token`         | `grant_type=authorization_code&code=<code>&redirect_uri=https://oauth.pstmn.io/v1/callback&code_verifier=<verifier>` (+ Basic auth for confidential clients)    |
| 5 | `GET /oidc/userinfo`       | header `Authorization: Bearer <access_token>`                                                                                                                   |
| 6 | `POST /oidc/token` refresh | `grant_type=refresh_token&refresh_token=<rt>` (+ Basic auth)                                                                                                    |

---

## 8. Admin: register a new client end-to-end

```
POST /api/v1/clients
Cookie: idp_session=<from /oidc/authorize browser flow as `admin`>
Content-Type: application/json
```

```json
{
  "name": "Acme Dashboard",
  "description": "Postman-driven smoke test",
  "type": "spa",
  "redirectUris": [
    "https://oauth.pstmn.io/v1/callback",
    "http://localhost:8080/callback"
  ]
}
```

Response (`201`):

```json
{
  "id": "…uuid…",
  "clientId": "…opaque…",
  "clientSecret": null,
  "name": "Acme Dashboard",
  "type": "spa",
  "tokenEndpointAuthMethod": "none",
  "requirePkce": true,
  "redirectUris": [ … ],
  "grantTypes": ["authorization_code"],
  "responseTypes": ["code"],
  "status": "active",
  "createdAt": "…",
  "updatedAt": "…"
}
```

Other admin operations:

| Operation                 | Request                                              |
| ------------------------- | ---------------------------------------------------- |
| List clients              | `GET /api/v1/clients`                                |
| Inspect a client          | `GET /api/v1/clients/:id`                            |
| Rotate confidential secret| `POST /api/v1/clients/:id/rotate-secret`             |

---

## 9. Common pitfalls

- **`invalid_request: Redirect URI not registered for this client`** —
  Add your tool's callback URL to the seed (or register a fresh client
  via § 8).
- **`invalid_grant: PKCE verification failed`** — Tool didn't carry the
  verifier from `/authorize` to `/token`. Make sure PKCE is enabled in
  the OAuth helper, or generate values by hand (§ 7.1) and reuse them
  in both steps.
- **`invalid_client`** at `/token` for a public client — your tool sent
  an empty Basic header. Switch the OAuth helper to "send credentials
  in body".
- **`401` from `/api/v1/clients`** — no session cookie or it's expired.
  Re-run the OIDC interaction login as `admin` and refresh the cookie.
- **`403 admin_required`** — you authenticated as a non-admin. Change
  user, or add the email to `ADMIN_EMAILS`.
- **`PORT 3000 / 5432 / 6379` already in use** — stop the conflicting
  service or change the port mapping in `docker-compose.yml`.

---

## 10. Reset between runs

```bash
docker compose down -v   # drops Postgres + Redis state, re-seeds on next boot
npm run start:dev
```

Authorization codes, sessions, and interactions live in Redis and have
short TTLs — they expire on their own within minutes if you'd rather
not nuke the DB.
