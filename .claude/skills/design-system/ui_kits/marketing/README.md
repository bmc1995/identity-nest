# Marketing site — UI kit

A full homepage for **idnest.app**: the public, top-of-funnel surface. Dark, warm, dev-forward. Sells ID Nest as the friendly, standards-based alternative to enterprise IdPs.

## Run
Open `index.html`. Loads `../../styles.css` + `../../_ds_bundle.js`, then `shared.jsx` and `Sections.jsx`.

## Files
- **shared.jsx** — page chrome CSS (`mkt-*`), inline stroke icons (`Ic`), and the logo path. Exports `Ic`, `MARK`, `mktUI` to `window`.
- **Sections.jsx** — `Nav`, `Hero` (with a live language switcher: Node / cURL / Python), `Trust`, `Features`, `Integrate` (terminal demo), `CtaBand`, `Footer`. Composes into `MarketingPage`.
- **index.html** — mounts `MarketingPage`.

## Composes
`Button`, `Badge`, `CodeBlock`, `Tabs` from the design system. The hero/integration code samples use the syntax token classes (`.tk .ts .tn .tc .tf`) shipped with `CodeBlock`.

## Notes
This is a recreation of the brand's intended marketing surface, not production code — copy is representative. The hero language tabs and the terminal block are the interactive moments.
