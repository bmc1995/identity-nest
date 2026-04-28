import { Injectable } from '@nestjs/common';

@Injectable()
export class InteractionViewService {
  renderLogin(uid: string, clientId: string, error?: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign In</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 2rem; width: 100%; max-width: 400px; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .subtitle { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .error { background: #fee; color: #c00; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; font-size: 0.9rem; }
    label { display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.9rem; }
    input[type="text"], input[type="password"] { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; margin-bottom: 1rem; }
    button { width: 100%; padding: 0.75rem; background: #111; color: #fff; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    button:hover { background: #333; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Sign In</h1>
    <p class="subtitle">Application <strong>${this.escape(clientId)}</strong> is requesting access</p>
    ${error ? `<div class="error">${this.escape(error)}</div>` : ''}
    <form method="POST" action="/interaction/${this.escape(uid)}/login">
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

  renderConsent(uid: string, clientId: string, scopes: string[]): string {
    const scopeList = scopes
      .map((s) => `<li>${this.escape(this.scopeDescription(s))}</li>`)
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Authorize</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 2rem; width: 100%; max-width: 400px; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .subtitle { color: #666; margin-bottom: 1rem; font-size: 0.9rem; }
    ul { margin: 0 0 1.5rem 1.5rem; }
    li { margin-bottom: 0.25rem; }
    .actions { display: flex; gap: 0.75rem; }
    button { flex: 1; padding: 0.75rem; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    .approve { background: #111; color: #fff; }
    .approve:hover { background: #333; }
    .deny { background: #eee; color: #333; }
    .deny:hover { background: #ddd; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Authorize</h1>
    <p class="subtitle"><strong>${this.escape(clientId)}</strong> is requesting the following permissions:</p>
    <ul>${scopeList}</ul>
    <div class="actions">
      <form method="POST" action="/interaction/${this.escape(uid)}/consent" style="flex:1">
        <input type="hidden" name="approved" value="true">
        <button type="submit" class="approve">Allow</button>
      </form>
      <form method="POST" action="/interaction/${this.escape(uid)}/consent" style="flex:1">
        <input type="hidden" name="approved" value="false">
        <button type="submit" class="deny">Deny</button>
      </form>
    </div>
  </div>
</body>
</html>`;
  }

  private scopeDescription(scope: string): string {
    const descriptions: Record<string, string> = {
      openid: 'Verify your identity',
      profile: 'Access your profile information (name, picture)',
      email: 'Access your email address',
      offline_access: 'Maintain access when you are not present',
    };
    return descriptions[scope] ?? scope;
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
