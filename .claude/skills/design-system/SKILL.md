---
name: idnest-design
description: Use this skill to generate well-branded interfaces and assets for ID Nest, either for production or throwaway prototypes/mocks/etc. ID Nest is a warm, dark-first, developer-first OIDC/OAuth identity provider (a friendly alternative to Okta/Auth0). Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Fast orientation
- **Brand in one line:** warm, dark-first, Swiss-precise, dev-forward identity provider. The friendly alternative to enterprise IdPs. Metaphor: a fingerprint nested inside an egg — the identity, kept safe in its nest.
- **Foundations:** link `styles.css` for all tokens. Clay accent `--accent #D9572E` on deep espresso `--bg-base #14100d`; cream text. Display = Space Grotesk, text = Hanken Grotesk, mono = JetBrains Mono (used liberally). Dark is `:root`; `[data-theme="light"]` for light.
- **Components:** load `_ds_bundle.js`, then `const { Button, Input, ... } = window.IDNestDesignSystem_c7f3f6`. Full list + props in `readme.md` and each `components/**/<Name>.prompt.md`.
- **Whole screens:** the four kits under `ui_kits/` (marketing, admin console, hosted login, docs) are copy-ready recreations — start from the nearest one.
- **Icons:** custom inline SVG, 1.6 stroke, round caps, `currentColor`. Copy from a kit's icon object. No emoji.
- **Voice:** calm, plain, second-person, sentence case, occasional dry wit. Lead with code. See the Content fundamentals section of `readme.md`.

## Rules of thumb
- Never hardcode hex — use the CSS variables.
- Reach for mono type and a real code/terminal block when the context is developer-facing; it's core to the brand.
- Warmth comes from color + type + copy, not emoji or illustration.
- Motion is calm: no bounce; hover lightens, press nudges down 1px.
