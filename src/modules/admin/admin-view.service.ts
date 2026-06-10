import { Injectable } from '@nestjs/common';

/**
 * Renders the server-side HTML pages for the admin portal.
 *
 * Follows the same dependency-free inline-HTML approach as
 * {@link InteractionViewService}. The portal page is a static shell whose
 * embedded script talks to the JSON management APIs (`/api/v1/clients`,
 * `/api/v1/users`) with the admin session cookie; all API-sourced values are
 * rendered through `textContent` so they are never interpreted as HTML.
 */
@Injectable()
export class AdminViewService {
  renderLogin(error?: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Sign In</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 2rem; width: 100%; max-width: 400px; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .subtitle { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .error { background: #fee; color: #c00; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; font-size: 0.9rem; }
    label { display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.9rem; }
    input[type="email"], input[type="password"] { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; margin-bottom: 1rem; }
    button { width: 100%; padding: 0.75rem; background: #111; color: #fff; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    button:hover { background: #333; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Identity Nest Admin</h1>
    <p class="subtitle">Sign in with an administrator account</p>
    ${error ? `<div class="error">${this.escape(error)}</div>` : ''}
    <form method="POST" action="/admin/login">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required autofocus>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required>
      <button type="submit">Sign In</button>
    </form>
  </div>
</body>
</html>`;
  }

  renderPortal(adminEmail: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Identity Nest Admin</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #111; min-height: 100vh; }
    header { background: #111; color: #fff; display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.5rem; }
    header .brand { font-weight: 600; }
    header .spacer { flex: 1; }
    header .who { font-size: 0.85rem; color: #bbb; }
    header form { margin: 0; }
    header button { background: transparent; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 0.35rem 0.75rem; font-size: 0.85rem; cursor: pointer; }
    header button:hover { border-color: #fff; }
    main { max-width: 1100px; margin: 1.5rem auto; padding: 0 1rem; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .tabs button { padding: 0.5rem 1.25rem; border: 1px solid #ddd; border-radius: 6px; background: #fff; font-size: 0.95rem; cursor: pointer; }
    .tabs button.active { background: #111; color: #fff; border-color: #111; }
    section { background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); padding: 1.25rem; }
    .panel-head { display: flex; align-items: center; margin-bottom: 1rem; }
    .panel-head h2 { font-size: 1.15rem; flex: 1; }
    .primary { background: #111; color: #fff; border: none; border-radius: 4px; padding: 0.5rem 1rem; font-size: 0.9rem; cursor: pointer; }
    .primary:hover { background: #333; }
    table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    th { text-align: left; color: #666; font-weight: 500; padding: 0.5rem 0.6rem; border-bottom: 2px solid #eee; white-space: nowrap; }
    td { padding: 0.55rem 0.6rem; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
    td code { background: #f4f4f4; padding: 0.1rem 0.3rem; border-radius: 3px; font-size: 0.8rem; }
    .muted { color: #888; font-size: 0.8rem; }
    .badge { display: inline-block; padding: 0.1rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 500; }
    .badge.active { background: #e6f6ea; color: #137333; }
    .badge.disabled, .badge.suspended { background: #fef3e2; color: #a05a00; }
    .badge.locked, .badge.deprovisioned { background: #fdeaea; color: #b3261e; }
    .actions { display: flex; gap: 0.35rem; flex-wrap: wrap; }
    .actions button { background: #fff; border: 1px solid #ccc; border-radius: 4px; padding: 0.25rem 0.6rem; font-size: 0.78rem; cursor: pointer; white-space: nowrap; }
    .actions button:hover { border-color: #111; }
    .actions button.danger { color: #b3261e; border-color: #e5b4b0; }
    .actions button.danger:hover { border-color: #b3261e; }
    .empty { padding: 1.5rem; text-align: center; color: #888; }
    dialog { border: none; border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,0.25); padding: 1.5rem; width: 100%; max-width: 440px; }
    dialog::backdrop { background: rgba(0,0,0,0.35); }
    dialog h3 { margin-bottom: 1rem; font-size: 1.1rem; }
    dialog label { display: block; margin-bottom: 0.2rem; font-weight: 500; font-size: 0.85rem; }
    dialog input[type="text"], dialog input[type="email"], dialog input[type="password"],
    dialog textarea, dialog select { width: 100%; padding: 0.45rem; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem; margin-bottom: 0.8rem; font-family: inherit; }
    dialog textarea { resize: vertical; min-height: 4rem; }
    .check { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.8rem; font-size: 0.9rem; }
    .check input { margin: 0; }
    .check label { margin: 0; font-weight: 400; }
    .dialog-actions { display: flex; gap: 0.6rem; justify-content: flex-end; margin-top: 0.5rem; }
    .dialog-actions .cancel { background: #eee; color: #333; border: none; border-radius: 4px; padding: 0.5rem 1rem; font-size: 0.9rem; cursor: pointer; }
    .secret-box { background: #f4f4f4; border-radius: 4px; padding: 0.6rem; font-family: monospace; font-size: 0.85rem; word-break: break-all; margin-bottom: 0.8rem; }
    .notice { background: #fef3e2; color: #a05a00; border-radius: 4px; padding: 0.6rem; font-size: 0.85rem; margin-bottom: 0.8rem; }
    #toast { position: fixed; bottom: 1.25rem; left: 50%; transform: translateX(-50%); background: #111; color: #fff; padding: 0.6rem 1.2rem; border-radius: 6px; font-size: 0.9rem; opacity: 0; pointer-events: none; transition: opacity 0.2s; max-width: 90vw; }
    #toast.show { opacity: 1; }
    #toast.error { background: #b3261e; }
  </style>
</head>
<body>
  <header>
    <span class="brand">Identity Nest Admin</span>
    <span class="spacer"></span>
    <span class="who">${this.escape(adminEmail)}</span>
    <form method="POST" action="/admin/logout"><button type="submit">Sign out</button></form>
  </header>
  <main>
    <nav class="tabs">
      <button type="button" id="tab-clients" class="active">Clients</button>
      <button type="button" id="tab-users">Users</button>
    </nav>

    <section id="clients-panel">
      <div class="panel-head">
        <h2>Client applications</h2>
        <button type="button" class="primary" id="new-client">New client</button>
      </div>
      <table>
        <thead><tr><th>Name</th><th>Client ID</th><th>Type</th><th>Auth</th><th>Status</th><th>Created</th><th></th></tr></thead>
        <tbody id="clients-body"></tbody>
      </table>
      <div class="empty" id="clients-empty" hidden>No clients registered yet.</div>
    </section>

    <section id="users-panel" hidden>
      <div class="panel-head">
        <h2>Users</h2>
        <button type="button" class="primary" id="new-user">New user</button>
      </div>
      <table>
        <thead><tr><th>Email</th><th>Name</th><th>Status</th><th>Verified</th><th>MFA</th><th>Last login</th><th></th></tr></thead>
        <tbody id="users-body"></tbody>
      </table>
      <div class="empty" id="users-empty" hidden>No users yet.</div>
    </section>
  </main>

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

    // ---- Tabs --------------------------------------------------------------
    var usersLoaded = false;
    function switchTab(tab) {
      var clients = tab === 'clients';
      $('clients-panel').hidden = !clients;
      $('users-panel').hidden = clients;
      $('tab-clients').className = clients ? 'active' : '';
      $('tab-users').className = clients ? '' : 'active';
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

  private escape(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
