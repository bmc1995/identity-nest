/**
 * Check an email against the `ADMIN_EMAILS` env allowlist (comma-separated;
 * defaults to `admin@example.com`). Shared by {@link AdminGuard} and the
 * admin portal login flow so both enforce the same admin set.
 *
 * FOR DEMO/TESTING PURPOSES ONLY. In production, you should implement a
 * more robust RBAC system rather than relying on env vars and emails.
 */
export function isAdminEmail(email: string): boolean {
  const raw = process.env.ADMIN_EMAILS ?? 'admin@example.com';
  const admins = raw
    .split(',')
    .map((u) => u.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}
