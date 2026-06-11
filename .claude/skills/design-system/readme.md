# ID Nest — Design System

**ID Nest** is an OIDC / OAuth 2.1 identity provider (an IdP) — a developer-first competitor to Okta and Auth0. The positioning: *the warm, human alternative to enterprise identity.* Standards-based auth that small and mid-size teams can actually enjoy shipping. The brand metaphor is a **nest** — a safe, warm place that holds something precious (your users' identity). The logo is a **fingerprint nested inside an egg**: the egg is the protected nest, the fingerprint is the identity it keeps safe.

> Built from scratch in this project — there was no prior codebase, Figma, or brand. The identity below was explored across three directions (`explorations/identity-directions.html`) and direction **B · Keystone** was selected, then warmed up.

This is a self-contained design system: tokens, fonts, brand assets, reusable React components, foundation specimen cards, and four product UI kits. An automated compiler bundles the components into `_ds_bundle.js` (namespace **`window.IDNestDesignSystem_c7f3f6`**) and indexes the CSS from `styles.css`.

---

## Content fundamentals — how ID Nest writes

The voice is **calm, plain, second-person, and quietly confident, with occasional dry wit.** Security you don't have to think about. We never sound corporate, never hype.

- **Person & tone.** Talk to the reader as *you*; refer to the product as *we / ID Nest*. Confident but never loud. We're the friend who already set up your auth, not a vendor.
- **Casing.** Sentence case everywhere — headings, buttons, nav. Lowercase is used deliberately in mono accents and code-flavored CTAs (`$ npm i idnest`, `// auth for builders`). Never Title Case Marketing Headlines. Never ALL CAPS except mono eyebrows/labels with wide tracking.
- **Sentence length.** Short. One idea per sentence. Cut adjectives. Prefer verbs.
- **What we say vs. don't:**
  - ✅ "Auth that feels like home." / "Ship login before lunch." / "Identity that gets out of your way."
  - ❌ "Enterprise-grade synergistic IAM solutions." / "Accelerate your identity journey today!" / "Unlock seamless frictionless experiences."
- **Numbers & claims** are concrete and modest: "10k MAU free", "p99 under 40ms", "live in an afternoon". No vague superlatives.
- **Emoji:** none in product or marketing. The brand's warmth comes from color, type, and copy — not emoji.
- **Code is a first-class citizen.** Show real snippets, real terminals, real JSON. Engineers trust code more than adjectives — so we lead with it.
- **Microcopy** is helpful and human: "They'll get an email to set up their account." not "An invitation will be dispatched to the specified recipient."

---

## Visual foundations

**Overall vibe:** warm, dark-first, Swiss-precise, dev-forward. Imagine a well-lit terminal in a room with wooden furniture. Earthy, not corporate; technical, not cold.

### Color
- **Dark is the default canvas.** Backgrounds are a deep warm **espresso** ramp (`--bg-base #14100d`, `--bg-sunken #100b09`), not pure black and never blue-black. Everything is tuned warm.
- **Primary accent is clay/terracotta** (`--accent #D9572E`) — used for primary actions, focus, active nav, links, and sparing glow. Secondary warm is **amber** (`--raw-amber-400 #F2A65A`).
- **Text is cream**, not white (`--text-strong #FBF6EE`, `--text-body #EFE7DC`), stepping down to warm muted browns.
- **Semantic hues are warm-tuned**: green `#3DBF8B`, red `#E5533D`, yellow `#E8A33C`, info teal `#7FB5A6`. No stock blue/green.
- A **light theme** exists (`[data-theme="light"]`) — cream paper, espresso ink — but the brand leads in dark.
- **Avoid:** bluish-purple gradients, neon, cold grays, pure `#000`/`#FFF`.

### Type
- **Display — Space Grotesk** (700). Headlines, numerals, stat values. Tight tracking (`-0.02` to `-0.035em`). Slightly mechanical → reads "engineered".
- **Text/UI — Hanken Grotesk** (400–800). Body, labels, buttons. Humanist, friendly, disappears at small sizes.
- **Mono — JetBrains Mono** (400–700). Code, terminals, IDs, secrets, eyebrows, metadata, timestamps. Used liberally — it's a core brand device.
- **Mono eyebrows** (`.idn-eyebrow`): uppercase, `0.14em` tracking, micro size — recurring section label motif.

### Space, radius, shadow
- **4px base unit.** Generous section padding (96px marketing, 24–28px app).
- **Radii are gently rounded:** controls `8px` (`--radius-md`), cards `12px`, panels/dialogs `16–22px`. Pill only for switches/tags/badges. Never fully sharp, never bubbly.
- **Shadows are warm-black and restrained** — depth comes from hairline borders (`--border-subtle` at ~8% cream) plus subtle shadow, not heavy drop shadows. The one indulgence is **`--glow-accent`** — a soft clay glow reserved for primary CTAs and live states.
- **Cards:** `--surface-1` fill, 1px subtle border, small radius, minimal shadow. Hover lifts 2–3px and brightens the border. An `accent` card variant adds a left clay border.

### Backgrounds & texture
- Flat warm espresso surfaces. Occasional **radial clay glow** behind heroes and login (`radial-gradient(..., rgba(217,87,46,.16-.20), transparent)`). A faint **dot-grid noise** texture on the hosted-login backdrop. No photography, no illustration scenes, no busy patterns.

### Motion
- **Calm and confident. No bounce.** Standard ease `cubic-bezier(.2,0,0,1)`; entrance ease-out `cubic-bezier(.16,1,.3,1)`. Durations 80–360ms (most interactions 140–220ms).
- **Hover** = lighter surface / brighter border / accent-hover (a *lighter* clay `#E5703F`). **Press** = `translateY(1px)` and accent-press (a *darker* clay `#C7491F`). Drawers slide ~28px; dialogs rise 8px + fade. Reduced-motion is respected globally.

### Borders, transparency, blur
- Hairline cream borders at 8/13/22% opacity (`--border-subtle/default/strong`). Sticky bars use `backdrop-filter: blur()` over a `color-mix` translucent base. Scrims are warm (`rgba(16,11,9,.66)`) with a light blur.

### Layout rules
- Sticky translucent top bars; sticky sidebars in app/docs. Max content widths: marketing `1120px`, app `1180px`, prose `720px`. Sidebar `260px`.

---

## Iconography

- **Custom inline SVG icon set**, drawn to a consistent spec: **1.5–1.6 stroke, round caps & joins, ~18–20px** on a square viewbox, `currentColor`. The look matches the logo's line work (the fingerprint ridges).le). They live inline in each kit's `shared.jsx`/`*.jsx` as small components (`Ic`, `AIc`, `LIc`, `DIc`) — copy the ones you need.
- **Brand-color SVGs** are used for third-party logos only (Google's multicolor `G`, GitHub's mark) on social-login buttons.
- **No icon font, no emoji, no unicode-as-icon.** If you need an icon not in the set, draw it to the same spec (1.6 stroke, round, currentColor) or pull the closest **Lucide** glyph (same stroke family) — and note the substitution.
- The **logo mark** (`assets/idnest-mark.svg`) doubles as the "Secured by ID Nest" trust glyph.

### Assets (`assets/`)
- `idnest-mark.svg` — fingerprint-egg mark (cream egg, clay fingerprint ridges), for dark backgrounds.
- `idnest-mark-light.svg` — mark for light backgrounds.
- `idnest-mark-mono.svg` — single-color mark.
- `idnest-lockup.svg` / `idnest-lockup-light.svg` — mark + "ID Nest" wordmark (Space Grotesk 700).
- `idnest-appicon.svg` — rounded-square app icon (clay field).

---

## Index / manifest

### Root
- **`styles.css`** — the single entry point consumers link. Imports-only; pulls in all token + base CSS.
- **`readme.md`** — this file.
- **`SKILL.md`** — Agent-Skill front matter so this system works as a downloadable Claude skill.
- `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json` — **generated by the compiler, do not edit.**

### `tokens/`
`fonts.css` (Google Fonts wiring) · `colors.css` (raw palette + dark/light semantic aliases) · `typography.css` (families, scale, weights, tracking) · `spacing.css` (4px scale, radii, control sizes, layout) · `elevation.css` (shadows, rings, glow, motion).

### `components/` — React primitives (namespace `window.IDNestDesignSystem_c7f3f6`)
- **core/** — `Button`, `IconButton`, `Badge`, `Tag`, `Avatar`, `Card`
- **forms/** — `Input`, `Select`, `Checkbox`, `Switch`
- **feedback/** — `Dialog`, `Toast` + `ToastRail`, `Tooltip`
- **navigation/** — `Tabs`
- **data/** — `CodeBlock`

Each component dir has `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, and one `@dsCard` HTML preview.

### `guidelines/` — foundation specimen cards (the Design System tab)
Type (display / headings / body / mono / weights), Colors (primary / surfaces / neutral / cream / semantic / syntax), Spacing (scale / radius / elevation / motion), Brand (logo / lockup / voice). `_card.css` is shared card chrome.

### `ui_kits/` — full product recreations
- **marketing/** — homepage (`idnest.app`).
- **admin/** — the Console (manage users / apps / policies).
- **login/** — hosted Universal Login flow (sign in → MFA → consent → success).
- **docs/** — developer documentation.

### `explorations/`
`identity-directions.html` — the original 3-way identity exploration (Roost / Keystone / Perch). Kept for reference; not part of the shipped system.

---

## Using a component

```jsx
// In any @dsCard / kit HTML, after loading _ds_bundle.js:
const { Button, Input, CodeBlock } = window.IDNestDesignSystem_c7f3f6;
<Button variant="primary" iconRight={<Arrow/>}>Start free</Button>
```

Style anything custom with the CSS variables (`var(--accent)`, `var(--surface-1)`, `var(--font-mono)`) — never hardcode hex. Dark is `:root`; wrap a subtree in `[data-theme="light"]` for light.
