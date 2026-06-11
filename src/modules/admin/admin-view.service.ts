import { Injectable } from '@nestjs/common';

/**
 * Renders the server-side HTML pages for the admin portal.
 *
 * Follows the same dependency-free inline-HTML approach as
 * {@link InteractionViewService}: each page is a self-contained document with
 * its styles, the inline brand mark, and (for the portal) a small vanilla-JS
 * controller — no build step, no client bundle. The portal page is a static
 * shell whose embedded script talks to the JSON management APIs
 * (`/api/v1/clients`, `/api/v1/users`) with the admin session cookie; all
 * API-sourced values are rendered through `textContent` so they are never
 * interpreted as HTML.
 *
 * The visual language is the ID Nest design system — warm, dark-first,
 * Swiss-precise. Brand tokens are declared once in {@link AdminViewService.head}
 * (deep espresso surfaces, clay accent, the Space Grotesk / Hanken Grotesk /
 * JetBrains Mono families) and every rule below references them rather than
 * hardcoding hex.
 */
@Injectable()
export class AdminViewService {
  renderLogin(error?: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#14100d">
  <title>Sign in · ID Nest</title>
  ${this.head()}
  <style>
    body{ display:grid; place-items:center; min-height:100vh; padding:24px;
      background: radial-gradient(120% 80% at 50% -10%, rgba(217,87,46,.20), transparent 60%), var(--bg-base); }
    .auth{ width:100%; max-width:400px; background:var(--surface-1); border:1px solid var(--border-default); border-radius:var(--radius-2xl); box-shadow:var(--shadow-lg); padding:32px 32px 28px; }
    .auth__brand{ display:flex; justify-content:center; margin-bottom:18px; }
    .auth__brand .idn-mark{ width:52px; height:52px; }
    .auth__eyebrow{ text-align:center; font-family:var(--font-mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-faint); margin-bottom:10px; }
    .auth h1{ text-align:center; font-family:var(--font-display); font-weight:700; font-size:24px; letter-spacing:-.02em; color:var(--text-strong); }
    .auth__sub{ text-align:center; color:var(--text-muted); font-size:13.5px; margin:6px 0 22px; }
    .auth label{ display:block; font-family:var(--font-text); font-size:12px; font-weight:600; color:var(--text-muted); margin-bottom:6px; }
    .auth input{ width:100%; font-family:var(--font-text); font-size:14px; color:var(--text-strong); background:var(--surface-inset); border:1px solid var(--border-default); border-radius:var(--radius-md); height:var(--control-lg); padding:0 14px; margin-bottom:16px; outline:none; transition:border-color .14s, box-shadow .14s; }
    .auth input:focus{ border-color:var(--border-focus); box-shadow:var(--ring-focus); }
    .auth button{ width:100%; height:var(--control-lg); background:var(--accent); color:var(--text-on-accent); border:0; border-radius:var(--radius-md); font-family:var(--font-text); font-size:15px; font-weight:600; cursor:pointer; box-shadow:var(--glow-accent); transition:background .14s, transform .08s; margin-top:4px; }
    .auth button:hover{ background:var(--accent-hover); }
    .auth button:active{ transform:translateY(1px); background:var(--accent-press); }
    .auth__error{ display:flex; gap:9px; background:var(--danger-soft); color:var(--danger); border:1px solid color-mix(in srgb, var(--danger) 30%, transparent); border-radius:var(--radius-md); padding:10px 12px; font-size:12.5px; line-height:1.45; margin-bottom:18px; }
    .auth__foot{ text-align:center; font-family:var(--font-mono); font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--text-faint); margin-top:22px; }
  </style>
</head>
<body>
  <main class="auth">
    <div class="auth__brand">${this.mark()}</div>
    <div class="auth__eyebrow">ID Nest · admin console</div>
    <h1>Sign in</h1>
    <p class="auth__sub">Use an administrator account to continue.</p>
    ${error ? `<div class="auth__error">${this.escape(error)}</div>` : ''}
    <form method="POST" action="/admin/login">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required autofocus autocomplete="username">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required autocomplete="current-password">
      <button type="submit">Sign in</button>
    </form>
    <div class="auth__foot">secured by ID Nest</div>
  </main>
</body>
</html>`;
  }

  renderPortal(adminEmail: string): string {
    const initial = (adminEmail.trim().charAt(0) || 'A').toUpperCase();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#14100d">
  <title>Console · ID Nest</title>
  ${this.head()}
  <style>
    .adm{ display:grid; grid-template-columns:var(--sidebar-w) 1fr; min-height:100vh; background:var(--bg-base); color:var(--text-body); }

    /* Sidebar */
    .adm-side{ background:var(--bg-sunken); border-right:1px solid var(--border-subtle); display:flex; flex-direction:column; padding:16px 12px; gap:4px; position:sticky; top:0; height:100vh; }
    .adm-side__brand{ display:flex; align-items:center; gap:10px; padding:6px 8px 14px; font-family:var(--font-display); font-weight:700; font-size:17px; color:var(--text-strong); letter-spacing:-.02em; }
    .adm-side__brand .idn-mark{ width:26px; height:26px; flex:none; }
    .adm-navlabel{ font-family:var(--font-mono); font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-faint); padding:12px 10px 6px; }
    .adm-nav{ position:relative; display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:var(--radius-md); font-family:var(--font-text); font-size:13.5px; font-weight:500; color:var(--text-muted); cursor:pointer; border:0; background:transparent; width:100%; text-align:left; transition:color .14s, background .14s; }
    .adm-nav svg{ width:18px; height:18px; flex:none; transition:color .14s; }
    .adm-nav:hover{ color:var(--text-strong); background:var(--surface-2); }
    .adm-nav[aria-current="page"]{ color:var(--text-strong); background:var(--accent-soft); }
    .adm-nav[aria-current="page"] svg{ color:var(--accent); }
    .adm-nav[aria-current="page"]::before{ content:""; position:absolute; left:-12px; top:50%; transform:translateY(-50%); width:3px; height:18px; border-radius:0 3px 3px 0; background:var(--accent); }
    .adm-side__foot{ margin-top:auto; padding-top:12px; }
    .adm-user{ display:flex; align-items:center; gap:10px; padding:8px; border-radius:var(--radius-md); }
    .adm-user__avatar{ width:30px; height:30px; border-radius:8px; background:var(--accent-soft); color:var(--accent); display:grid; place-items:center; font-family:var(--font-display); font-weight:700; font-size:13px; flex:none; }
    .adm-user__meta{ min-width:0; flex:1; }
    .adm-user__name{ font-size:12.5px; font-weight:600; color:var(--text-strong); line-height:1.1; }
    .adm-user__mail{ font-size:11px; color:var(--text-faint); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .adm-user form{ margin:0; flex:none; }
    .adm-user__out{ border:0; background:transparent; color:var(--text-faint); cursor:pointer; padding:5px; border-radius:6px; display:grid; place-items:center; transition:color .14s, background .14s; }
    .adm-user__out:hover{ color:var(--accent); background:var(--surface-2); }
    .adm-user__out svg{ width:16px; height:16px; }

    /* Main */
    .adm-main{ display:flex; flex-direction:column; min-width:0; }
    .adm-top{ height:60px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:16px; padding:0 28px; position:sticky; top:0; background:color-mix(in srgb, var(--bg-base) 82%, transparent); backdrop-filter:blur(12px); z-index:20; }
    .adm-crumb{ display:flex; align-items:center; gap:8px; font-size:13.5px; color:var(--text-faint); min-width:0; }
    .adm-crumb__home{ display:flex; align-items:center; gap:7px; color:var(--text-muted); }
    .adm-crumb__home .idn-mark{ width:18px; height:18px; flex:none; }
    .adm-crumb .chev{ width:13px; height:13px; flex:none; opacity:.7; }
    .adm-crumb b{ color:var(--text-strong); font-weight:600; }

    .adm-content{ padding:28px; max-width:1180px; width:100%; }
    .adm-pagehead{ display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:22px; flex-wrap:wrap; }
    .adm-pagehead__t{ min-width:0; }
    .adm-eyebrow{ font-family:var(--font-mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-faint); margin-bottom:8px; }
    .adm-pagehead h1{ font-family:var(--font-display); font-weight:700; font-size:26px; letter-spacing:-.02em; color:var(--text-strong); margin:0; }
    .adm-pagehead p{ color:var(--text-muted); font-size:13.5px; margin:5px 0 0; max-width:60ch; }

    /* Primary action */
    .primary{ display:inline-flex; align-items:center; gap:7px; height:var(--control-md); padding:0 16px; background:var(--accent); color:var(--text-on-accent); border:0; border-radius:var(--radius-md); font-family:var(--font-text); font-size:13.5px; font-weight:600; cursor:pointer; box-shadow:var(--glow-accent); transition:background .14s, transform .08s; }
    .primary:hover{ background:var(--accent-hover); }
    .primary:active{ transform:translateY(1px); background:var(--accent-press); }
    .primary svg{ width:15px; height:15px; flex:none; }

    /* Panel + table */
    .adm-panel{ background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); overflow:hidden; }
    .adm-tablewrap{ overflow-x:auto; }
    table{ width:100%; border-collapse:collapse; }
    th{ text-align:left; font-family:var(--font-mono); font-size:10.5px; letter-spacing:.08em; text-transform:uppercase; color:var(--text-faint); font-weight:500; padding:11px 18px; border-bottom:1px solid var(--border-subtle); white-space:nowrap; }
    td{ padding:12px 18px; border-bottom:1px solid var(--border-subtle); font-size:13px; color:var(--text-body); vertical-align:middle; }
    tbody tr:last-child td{ border-bottom:0; }
    tbody tr{ transition:background .12s; }
    tbody tr:hover{ background:var(--surface-2); }
    td:first-child{ color:var(--text-strong); font-weight:600; white-space:nowrap; }
    td:last-child{ text-align:right; }
    td code{ font-family:var(--font-mono); font-size:12px; color:var(--text-body); background:var(--surface-inset); border:1px solid var(--border-subtle); border-radius:6px; padding:2px 7px; font-variant-numeric:tabular-nums; }
    .muted{ color:var(--text-faint); font-size:11.5px; font-weight:400; margin-top:3px; }

    /* Status badges */
    .badge{ display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:11px; line-height:1; padding:4px 9px; border-radius:var(--radius-pill); border:1px solid transparent; white-space:nowrap; }
    .badge::before{ content:""; width:6px; height:6px; border-radius:50%; background:currentColor; flex:none; }
    .badge.active{ color:var(--success); background:var(--success-soft); border-color:color-mix(in srgb, var(--success) 30%, transparent); }
    .badge.disabled,.badge.suspended{ color:var(--warning); background:var(--warning-soft); border-color:color-mix(in srgb, var(--warning) 30%, transparent); }
    .badge.locked,.badge.deprovisioned{ color:var(--danger); background:var(--danger-soft); border-color:color-mix(in srgb, var(--danger) 30%, transparent); }
    .badge.invited,.badge.pending{ color:var(--info); background:var(--info-soft); border-color:color-mix(in srgb, var(--info) 30%, transparent); }

    /* Row actions */
    .actions{ display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; }
    .actions button{ font-family:var(--font-text); background:var(--surface-2); border:1px solid var(--border-default); color:var(--text-body); border-radius:var(--radius-sm); padding:5px 10px; font-size:12px; cursor:pointer; white-space:nowrap; transition:border-color .14s, color .14s, background .14s; }
    .actions button:hover{ border-color:var(--border-strong); color:var(--text-strong); background:var(--surface-3); }
    .actions button.danger{ color:var(--danger); border-color:color-mix(in srgb, var(--danger) 28%, transparent); }
    .actions button.danger:hover{ color:var(--text-strong); background:var(--danger); border-color:var(--danger); }

    .empty{ padding:28px; text-align:center; color:var(--text-faint); font-size:13px; }

    /* Dialogs */
    dialog{ border:0; border-radius:var(--radius-xl); background:var(--surface-1); color:var(--text-body); box-shadow:var(--shadow-lg); padding:24px; width:100%; max-width:460px; }
    dialog::backdrop{ background:var(--overlay-scrim); backdrop-filter:blur(3px); }
    dialog h3{ font-family:var(--font-display); font-weight:700; font-size:17px; color:var(--text-strong); letter-spacing:-.01em; margin-bottom:16px; }
    dialog label{ display:block; font-family:var(--font-text); font-size:12px; font-weight:600; color:var(--text-muted); margin-bottom:6px; }
    dialog input[type="text"], dialog input[type="email"], dialog input[type="password"],
    dialog textarea, dialog select{ width:100%; font-family:var(--font-text); font-size:14px; color:var(--text-strong); background:var(--surface-inset); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:10px 12px; margin-bottom:14px; outline:none; transition:border-color .14s, box-shadow .14s; }
    dialog textarea{ resize:vertical; min-height:76px; font-family:var(--font-mono); font-size:12.5px; line-height:1.5; }
    dialog input:focus, dialog textarea:focus, dialog select:focus{ border-color:var(--border-focus); box-shadow:var(--ring-focus); }
    dialog select{ appearance:none; cursor:pointer; padding-right:34px;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23a99e8f' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6.5L8 10l4-3.5'/%3E%3C/svg%3E");
      background-repeat:no-repeat; background-position:right 12px center; }
    .check{ display:flex; align-items:center; gap:9px; margin-bottom:14px; }
    .check input{ width:16px; height:16px; accent-color:var(--accent); cursor:pointer; margin:0; }
    .check label{ margin:0; font-weight:500; color:var(--text-body); font-size:13px; cursor:pointer; }
    .dialog-actions{ display:flex; gap:10px; justify-content:flex-end; margin-top:8px; }
    .cancel{ height:var(--control-md); padding:0 16px; background:transparent; color:var(--text-muted); border:1px solid var(--border-default); border-radius:var(--radius-md); font-family:var(--font-text); font-size:13.5px; font-weight:500; cursor:pointer; transition:border-color .14s, color .14s; }
    .cancel:hover{ color:var(--text-strong); border-color:var(--border-strong); }
    .secret-box{ font-family:var(--font-mono); font-size:12.5px; color:var(--text-strong); background:var(--surface-inset); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:10px 12px; word-break:break-all; margin-bottom:14px; }
    .notice{ display:flex; gap:9px; background:var(--warning-soft); color:var(--warning); border:1px solid color-mix(in srgb, var(--warning) 28%, transparent); border-radius:var(--radius-md); padding:10px 12px; font-size:12.5px; line-height:1.45; margin-bottom:16px; }

    /* Toast */
    #toast{ position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(8px); background:var(--surface-3); color:var(--text-strong); border:1px solid var(--border-strong); padding:11px 16px; border-radius:var(--radius-md); font-size:13px; box-shadow:var(--shadow-lg); opacity:0; pointer-events:none; transition:opacity .2s, transform .2s; max-width:90vw; z-index:1000; }
    #toast.show{ opacity:1; transform:translateX(-50%) translateY(0); }
    #toast.error{ border-color:color-mix(in srgb, var(--danger) 45%, transparent); }

    @media (max-width:880px){ .adm{ grid-template-columns:1fr; } .adm-side{ position:static; height:auto; } .adm-content{ padding:20px; } .adm-top{ padding:0 20px; } }
    @media (prefers-reduced-motion: reduce){ *{ animation-duration:.001ms !important; transition-duration:.001ms !important; } }
  </style>
</head>
<body>
  <div class="adm">
    <aside class="adm-side">
      <div class="adm-side__brand">${this.mark()} ID Nest</div>
      <div class="adm-navlabel">Manage</div>
      <button type="button" id="tab-clients" class="adm-nav" aria-current="page">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2.5l6.5 3.6v7.8L10 17.5 3.5 13.9V6.1L10 2.5Z"/><path d="M3.7 6.2L10 9.8l6.3-3.6M10 9.8v7.5"/></svg>
        <span>Client applications</span>
      </button>
      <button type="button" id="tab-users" class="adm-nav" aria-current="false">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="6.5" r="2.8"/><path d="M2.5 16.5a5 5 0 0 1 10 0"/><path d="M13.5 4.2a2.8 2.8 0 0 1 0 5.1M17.5 16.5a5 5 0 0 0-2.8-4.5"/></svg>
        <span>Users</span>
      </button>
      <div class="adm-side__foot">
        <div class="adm-user">
          <span class="adm-user__avatar">${this.escape(initial)}</span>
          <div class="adm-user__meta">
            <div class="adm-user__name">Signed in</div>
            <div class="adm-user__mail">${this.escape(adminEmail)}</div>
          </div>
          <form method="POST" action="/admin/logout">
            <button type="submit" class="adm-user__out" title="Sign out" aria-label="Sign out">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.5H3.5A1.5 1.5 0 0 1 2 12V4a1.5 1.5 0 0 1 1.5-1.5H6M10.5 11l3-3-3-3M13.5 8H6"/></svg>
            </button>
          </form>
        </div>
      </div>
    </aside>

    <div class="adm-main">
      <header class="adm-top">
        <nav class="adm-crumb">
          <span class="adm-crumb__home">${this.mark()} Admin</span>
          <svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 4L10 8l-3.5 4"/></svg>
          <b id="crumb">Client applications</b>
        </nav>
      </header>

      <div class="adm-content">
        <section id="clients-panel">
          <div class="adm-pagehead">
            <div class="adm-pagehead__t">
              <div class="adm-eyebrow">OAuth clients</div>
              <h1>Client applications</h1>
              <p>Register the apps that authenticate through ID Nest and manage their credentials.</p>
            </div>
            <button type="button" class="primary" id="new-client">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>
              New client
            </button>
          </div>
          <div class="adm-panel">
            <div class="adm-tablewrap">
              <table>
                <thead><tr><th>Name</th><th>Client ID</th><th>Type</th><th>Auth</th><th>Status</th><th>Created</th><th></th></tr></thead>
                <tbody id="clients-body"></tbody>
              </table>
            </div>
            <div class="empty" id="clients-empty" hidden>No clients registered yet.</div>
          </div>
        </section>

        <section id="users-panel" hidden>
          <div class="adm-pagehead">
            <div class="adm-pagehead__t">
              <div class="adm-eyebrow">Directory</div>
              <h1>Users</h1>
              <p>The people who can sign in to your tenant. Invite, edit, and manage their access.</p>
            </div>
            <button type="button" class="primary" id="new-user">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>
              New user
            </button>
          </div>
          <div class="adm-panel">
            <div class="adm-tablewrap">
              <table>
                <thead><tr><th>Email</th><th>Name</th><th>Status</th><th>Verified</th><th>MFA</th><th>Last login</th><th></th></tr></thead>
                <tbody id="users-body"></tbody>
              </table>
            </div>
            <div class="empty" id="users-empty" hidden>No users yet.</div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <dialog id="client-dialog">
    <h3 id="client-dialog-title">New client</h3>
    <form id="client-form">
      <input type="hidden" name="id">
      <label for="cf-name">Name</label>
      <input type="text" id="cf-name" name="name" required maxlength="255">
      <label for="cf-type">Type</label>
      <select id="cf-type" name="type">
        <option value="web">web — server-side app (confidential)</option>
        <option value="spa">spa — browser app (public, PKCE)</option>
        <option value="native">native — mobile/desktop app (public, PKCE)</option>
        <option value="service">service — machine-to-machine</option>
      </select>
      <label for="cf-redirects">Redirect URIs (one per line)</label>
      <textarea id="cf-redirects" name="redirectUris" required placeholder="https://app.example.com/callback"></textarea>
      <label for="cf-description">Description (optional)</label>
      <textarea id="cf-description" name="description" maxlength="1024"></textarea>
      <div class="dialog-actions">
        <button type="button" class="cancel" data-close="client-dialog">Cancel</button>
        <button type="submit" class="primary" id="client-submit">Create client</button>
      </div>
    </form>
  </dialog>

  <dialog id="user-dialog">
    <h3 id="user-dialog-title">New user</h3>
    <form id="user-form">
      <input type="hidden" name="id">
      <label for="uf-email">Email</label>
      <input type="email" id="uf-email" name="email" required maxlength="255">
      <label for="uf-password" id="uf-password-label">Password</label>
      <input type="password" id="uf-password" name="password" minlength="8" maxlength="128" autocomplete="new-password">
      <label for="uf-given">Given name (optional)</label>
      <input type="text" id="uf-given" name="givenName" maxlength="255">
      <label for="uf-family">Family name (optional)</label>
      <input type="text" id="uf-family" name="familyName" maxlength="255">
      <label for="uf-nickname">Nickname (optional)</label>
      <input type="text" id="uf-nickname" name="nickname" maxlength="255">
      <div id="uf-status-wrap" hidden>
        <label for="uf-status">Status</label>
        <select id="uf-status" name="status">
          <option value="active">active</option>
          <option value="suspended">suspended</option>
          <option value="locked">locked</option>
          <option value="deprovisioned">deprovisioned</option>
        </select>
      </div>
      <div class="check">
        <input type="checkbox" id="uf-verified" name="emailVerified">
        <label for="uf-verified">Email verified</label>
      </div>
      <div class="dialog-actions">
        <button type="button" class="cancel" data-close="user-dialog">Cancel</button>
        <button type="submit" class="primary" id="user-submit">Create user</button>
      </div>
    </form>
  </dialog>

  <dialog id="secret-dialog">
    <h3>Client credentials</h3>
    <div class="notice">Store the secret now — it is shown only once and cannot be retrieved later.</div>
    <label>Client ID</label>
    <div class="secret-box" id="secret-client-id"></div>
    <label>Client secret</label>
    <div class="secret-box" id="secret-value"></div>
    <div class="dialog-actions">
      <button type="button" class="cancel" id="secret-copy">Copy secret</button>
      <button type="button" class="primary" data-close="secret-dialog">Done</button>
    </div>
  </dialog>

  <div id="toast"></div>

  <script>
  (function () {
    'use strict';

    function $(id) { return document.getElementById(id); }

    function el(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined && text !== null) node.textContent = text;
      return node;
    }

    var toastTimer = null;
    function toast(message, isError) {
      var node = $('toast');
      node.textContent = message;
      node.className = isError ? 'show error' : 'show';
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { node.className = ''; }, 4000);
    }

    function api(path, options) {
      options = options || {};
      options.credentials = 'same-origin';
      if (options.body !== undefined) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(options.body);
      }
      return fetch(path, options).then(function (res) {
        if (res.status === 401) {
          window.location.href = '/admin/login';
          throw new Error('Session expired');
        }
        if (res.status === 204) return null;
        return res.json().then(function (data) {
          if (!res.ok) {
            var msg = data && (data.error_description || data.message || data.error);
            if (Array.isArray(msg)) msg = msg.join('; ');
            throw new Error(msg || 'Request failed (' + res.status + ')');
          }
          return data;
        });
      });
    }

    function fmtDate(value) {
      return value ? new Date(value).toLocaleDateString() : '—';
    }

    function actionButton(label, handler, danger) {
      var btn = el('button', danger ? 'danger' : '', label);
      btn.type = 'button';
      btn.addEventListener('click', handler);
      return btn;
    }

    function openDialog(id) { $(id).showModal(); }
    function closeDialog(id) { $(id).close(); }
    document.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { closeDialog(btn.getAttribute('data-close')); });
    });

    // ---- Section nav -------------------------------------------------------
    var usersLoaded = false;
    function switchTab(tab) {
      var clients = tab === 'clients';
      $('clients-panel').hidden = !clients;
      $('users-panel').hidden = clients;
      $('tab-clients').setAttribute('aria-current', clients ? 'page' : 'false');
      $('tab-users').setAttribute('aria-current', clients ? 'false' : 'page');
      var crumb = $('crumb');
      if (crumb) crumb.textContent = clients ? 'Client applications' : 'Users';
      if (!clients && !usersLoaded) { usersLoaded = true; loadUsers(); }
    }
    $('tab-clients').addEventListener('click', function () { switchTab('clients'); });
    $('tab-users').addEventListener('click', function () { switchTab('users'); });

    // ---- Clients -----------------------------------------------------------
    function loadClients() {
      api('/api/v1/clients').then(renderClients).catch(function (err) { toast(err.message, true); });
    }

    function renderClients(clients) {
      var body = $('clients-body');
      body.textContent = '';
      $('clients-empty').hidden = clients.length > 0;
      clients.forEach(function (client) {
        var row = el('tr');

        var nameCell = el('td', '', client.name);
        if (client.description) nameCell.appendChild(el('div', 'muted', client.description));
        row.appendChild(nameCell);

        var idCell = el('td');
        idCell.appendChild(el('code', '', client.clientId));
        row.appendChild(idCell);

        row.appendChild(el('td', '', client.type));

        var authCell = el('td', '', client.tokenEndpointAuthMethod);
        if (client.requirePkce) authCell.appendChild(el('div', 'muted', 'PKCE required'));
        row.appendChild(authCell);

        var statusCell = el('td');
        statusCell.appendChild(el('span', 'badge ' + client.status, client.status));
        row.appendChild(statusCell);

        row.appendChild(el('td', '', fmtDate(client.createdAt)));

        var actions = el('td');
        var wrap = el('div', 'actions');
        wrap.appendChild(actionButton('Edit', function () { showClientDialog(client); }));
        if (client.hasSecret) {
          wrap.appendChild(actionButton('Rotate secret', function () { rotateSecret(client); }));
        }
        var disabled = client.status === 'disabled';
        wrap.appendChild(actionButton(disabled ? 'Enable' : 'Disable', function () {
          api('/api/v1/clients/' + client.id, { method: 'PATCH', body: { status: disabled ? 'active' : 'disabled' } })
            .then(function () { toast(disabled ? 'Client enabled' : 'Client disabled'); loadClients(); })
            .catch(function (err) { toast(err.message, true); });
        }));
        wrap.appendChild(actionButton('Delete', function () {
          if (!window.confirm('Permanently delete "' + client.name + '"? Its grants and tokens are removed too.')) return;
          api('/api/v1/clients/' + client.id, { method: 'DELETE' })
            .then(function () { toast('Client deleted'); loadClients(); })
            .catch(function (err) { toast(err.message, true); });
        }, true));
        actions.appendChild(wrap);
        row.appendChild(actions);

        body.appendChild(row);
      });
    }

    function showClientDialog(client) {
      var form = $('client-form');
      form.reset();
      form.elements.id.value = client ? client.id : '';
      $('client-dialog-title').textContent = client ? 'Edit client' : 'New client';
      $('client-submit').textContent = client ? 'Save changes' : 'Create client';
      $('cf-type').disabled = !!client;
      if (client) {
        form.elements.name.value = client.name;
        form.elements.type.value = client.type;
        form.elements.redirectUris.value = client.redirectUris.join('\\n');
        form.elements.description.value = client.description || '';
      }
      openDialog('client-dialog');
    }

    $('new-client').addEventListener('click', function () { showClientDialog(null); });

    $('client-form').addEventListener('submit', function (event) {
      event.preventDefault();
      var form = event.target;
      var id = form.elements.id.value;
      var redirectUris = form.elements.redirectUris.value
        .split('\\n').map(function (s) { return s.trim(); }).filter(Boolean);
      var payload = { name: form.elements.name.value.trim(), redirectUris: redirectUris };
      var description = form.elements.description.value.trim();
      if (description) payload.description = description;
      if (!id) payload.type = form.elements.type.value;
      var request = id
        ? api('/api/v1/clients/' + id, { method: 'PATCH', body: payload })
        : api('/api/v1/clients', { method: 'POST', body: payload });
      request.then(function (client) {
        closeDialog('client-dialog');
        toast(id ? 'Client updated' : 'Client created');
        loadClients();
        if (!id && client.clientSecret) showSecret(client.clientId, client.clientSecret);
      }).catch(function (err) { toast(err.message, true); });
    });

    function rotateSecret(client) {
      if (!window.confirm('Rotate the secret for "' + client.name + '"? The current secret stops working immediately.')) return;
      api('/api/v1/clients/' + client.id + '/rotate-secret', { method: 'POST' })
        .then(function (result) { showSecret(result.clientId, result.clientSecret); })
        .catch(function (err) { toast(err.message, true); });
    }

    function showSecret(clientId, secret) {
      $('secret-client-id').textContent = clientId;
      $('secret-value').textContent = secret;
      openDialog('secret-dialog');
    }

    $('secret-copy').addEventListener('click', function () {
      navigator.clipboard.writeText($('secret-value').textContent)
        .then(function () { toast('Secret copied to clipboard'); })
        .catch(function () { toast('Copy failed — select and copy manually', true); });
    });

    // ---- Users -------------------------------------------------------------
    function loadUsers() {
      api('/api/v1/users').then(renderUsers).catch(function (err) { toast(err.message, true); });
    }

    function renderUsers(users) {
      var body = $('users-body');
      body.textContent = '';
      $('users-empty').hidden = users.length > 0;
      users.forEach(function (user) {
        var row = el('tr');

        row.appendChild(el('td', '', user.email));

        var fullName = [user.givenName, user.familyName].filter(Boolean).join(' ');
        var nameCell = el('td', '', fullName || '—');
        if (user.nickname) nameCell.appendChild(el('div', 'muted', user.nickname));
        row.appendChild(nameCell);

        var statusCell = el('td');
        statusCell.appendChild(el('span', 'badge ' + user.status, user.status));
        row.appendChild(statusCell);

        row.appendChild(el('td', '', user.emailVerified ? 'Yes' : 'No'));
        row.appendChild(el('td', '', user.mfaEnabled ? 'Yes' : 'No'));
        row.appendChild(el('td', '', fmtDate(user.lastLogin)));

        var actions = el('td');
        var wrap = el('div', 'actions');
        wrap.appendChild(actionButton('Edit', function () { showUserDialog(user); }));
        wrap.appendChild(actionButton('Delete', function () {
          if (!window.confirm('Delete "' + user.email + '"? The account is deactivated and removed from all lists.')) return;
          api('/api/v1/users/' + user.id, { method: 'DELETE' })
            .then(function () { toast('User deleted'); loadUsers(); })
            .catch(function (err) { toast(err.message, true); });
        }, true));
        actions.appendChild(wrap);
        row.appendChild(actions);

        body.appendChild(row);
      });
    }

    function showUserDialog(user) {
      var form = $('user-form');
      form.reset();
      form.elements.id.value = user ? user.id : '';
      $('user-dialog-title').textContent = user ? 'Edit user' : 'New user';
      $('user-submit').textContent = user ? 'Save changes' : 'Create user';
      $('uf-status-wrap').hidden = !user;
      $('uf-password').required = !user;
      $('uf-password-label').textContent = user ? 'New password (leave blank to keep current)' : 'Password';
      if (user) {
        form.elements.email.value = user.email;
        form.elements.givenName.value = user.givenName || '';
        form.elements.familyName.value = user.familyName || '';
        form.elements.nickname.value = user.nickname || '';
        form.elements.status.value = user.status;
        form.elements.emailVerified.checked = user.emailVerified;
      }
      openDialog('user-dialog');
    }

    $('new-user').addEventListener('click', function () { showUserDialog(null); });

    $('user-form').addEventListener('submit', function (event) {
      event.preventDefault();
      var form = event.target;
      var id = form.elements.id.value;
      var payload = {
        email: form.elements.email.value.trim(),
        emailVerified: form.elements.emailVerified.checked,
      };
      var password = form.elements.password.value;
      if (password) payload.password = password;
      ['givenName', 'familyName', 'nickname'].forEach(function (field) {
        var value = form.elements[field].value.trim();
        if (value) payload[field] = value;
      });
      if (id) payload.status = form.elements.status.value;
      var request = id
        ? api('/api/v1/users/' + id, { method: 'PATCH', body: payload })
        : api('/api/v1/users', { method: 'POST', body: payload });
      request.then(function () {
        closeDialog('user-dialog');
        toast(id ? 'User updated' : 'User created');
        loadUsers();
      }).catch(function (err) { toast(err.message, true); });
    });

    // ---- Init --------------------------------------------------------------
    loadClients();
  })();
  </script>
</body>
</html>`;
  }

  /**
   * Shared document head: brand webfonts, the ID Nest design tokens (the single
   * source of truth for color, type, radius, and elevation on these pages), and
   * a minimal reset. Every page rule references these variables instead of
   * hardcoding hex.
   */
  private head(): string {
    return `<style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

    :root{
      --font-display:'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
      --font-text:'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif;
      --font-mono:'JetBrains Mono', ui-monospace, 'SFMono-Regular', monospace;

      --bg-base:#14100d; --bg-sunken:#100b09;
      --surface-1:#1c1611; --surface-2:#241b15; --surface-3:#33271e; --surface-inset:#0d0907;
      --overlay-scrim:rgba(16,11,9,.66);

      --text-strong:#FBF6EE; --text-body:#EFE7DC; --text-muted:#a99e8f; --text-faint:#8a715d; --text-on-accent:#2B1810;

      --border-subtle:rgba(239,231,220,.08); --border-default:rgba(239,231,220,.13); --border-strong:rgba(239,231,220,.22); --border-focus:#E5703F;

      --accent:#D9572E; --accent-hover:#E5703F; --accent-press:#C7491F; --accent-soft:rgba(217,87,46,.14); --accent-ring:rgba(217,87,46,.32);

      --success:#3DBF8B; --success-soft:rgba(61,191,139,.14);
      --warning:#E8A33C; --warning-soft:rgba(232,163,60,.15);
      --danger:#E5533D; --danger-soft:rgba(229,83,61,.14);
      --info:#7FB5A6; --info-soft:rgba(127,181,166,.14);

      --radius-xs:4px; --radius-sm:6px; --radius-md:8px; --radius-lg:12px; --radius-xl:16px; --radius-2xl:22px; --radius-pill:999px;
      --control-sm:32px; --control-md:40px; --control-lg:48px; --sidebar-w:260px;

      --shadow-md:0 8px 24px rgba(0,0,0,.38); --shadow-lg:0 18px 48px rgba(0,0,0,.48);
      --glow-accent:0 6px 22px rgba(217,87,46,.34);
      --ring-focus:0 0 0 3px var(--accent-ring);
    }

    *,*::before,*::after{ box-sizing:border-box; }
    html,body{ margin:0; padding:0; }
    body{ font-family:var(--font-text); background:var(--bg-base); color:var(--text-body); -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }
  </style>`;
  }

  /**
   * The ID Nest mark — a clay fingerprint nested inside a cream egg — inlined as
   * SVG so the pages stay self-contained (no static asset to host). The literal
   * hex here is brand artwork, not UI chrome.
   */
  private mark(): string {
    return `<svg class="idn-mark" viewBox="0 0 64 64" role="img" aria-label="ID Nest"><path d="M32 6.5C43.5 6.5 51 19.5 51 34.5C51 47.5 42.8 56 32 56C21.2 56 13 47.5 13 34.5C13 19.5 20.5 6.5 32 6.5Z" fill="#F4E3D0"/><g fill="none" stroke="#D9572E" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 38.5c-1-9.5 4.6-15 10-15s11 5.5 10 15"/><path d="M26 40c-.8-6.5 2.6-10.5 6-10.5s6.8 4 6 10.5"/><path d="M30 41c-.5-3.8 .8-6 2-6s2.5 2.2 2 6"/></g><circle cx="32" cy="35.6" r="1.5" fill="#D9572E"/></svg>`;
  }

  private escape(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
