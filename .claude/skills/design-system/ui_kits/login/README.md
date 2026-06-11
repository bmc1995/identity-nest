# Hosted login (Universal Login) — UI kit

The **brandable sign-in experience** ID Nest hosts on behalf of each customer. This is the surface end-users actually see. Shown here themed for the fictional tenant "Acme", with the "Secured by ID Nest" footer that every hosted page carries.

## Run
Open `index.html`. Loads the design system, then `login.jsx`.

## Flow (`HostedLogin`)
A single centered card on a warm, glowing backdrop, stepping through:
1. **signin** — social buttons (Google / GitHub), email + password, remember-me, forgot link.
2. **mfa** — 6-digit one-time-code with auto-advancing inputs (`Otp`).
3. **consent** — OAuth authorize screen: requesting app → tenant, with a scope list and Allow / Deny.
4. **done** — success state, "redirecting back" + restart.

Every step is reachable by clicking through; "Restart demo" returns to the top.

## Composes
`Button`, `Input`, `Checkbox`, `Avatar`, `Badge`. The OTP grid is bespoke to the kit.

## Branding
The tenant logo, name, and accent are the only things a customer changes — structure and the ID Nest footer stay fixed. Swap `lg-tenant__logo` content/colors to re-theme.
