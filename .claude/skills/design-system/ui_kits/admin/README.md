# Console (admin) — UI kit

The **ID Nest Console**: where customers manage users, applications, and policies for their tenant. The product's logged-in home. Sidebar shell + data-dense panels, tables, and slide-in drawers.

## Run
Open `index.html`. Loads the design system, then `shared.jsx` and `screens.jsx`.

## Files
- **shared.jsx** — `AppShell` (sidebar nav + tenant switcher + top bar with command search), the `AIc` icon set, and all `adm-*` chrome styles. Exports `AppShell`, `AIc`, `ADM`.
- **screens.jsx** — the screens and controller:
  - `Overview` — stat cards, a sign-ins bar chart, recent-activity feed.
  - `Users` — searchable table with avatars, connection icons, status badges; rows open `UserDrawer`.
  - `Applications` — OAuth client cards; cards open `AppDrawer` (tabbed: Settings / Credentials / Quickstart).
  - `ConsoleApp` — top-level state: active section, drawer, invite/new-app `Dialog`, and a `ToastRail`.
  - `Placeholder` — Policies / Connections / Logs / Settings reuse the shell + panel patterns.

## Interactions
Sidebar switches sections · Users search filters live · click a user → drawer with MFA/suspend switches · click an app → tabbed drawer with copyable credentials · "Invite user" / "New application" open dialogs · saves fire toasts.

## Composes
`Button`, `IconButton`, `Badge`, `Tag`, `Avatar`, `Card`, `Switch`, `Input`, `Select`, `Tabs`, `CodeBlock`, `Dialog`, `Toast` / `ToastRail`.
