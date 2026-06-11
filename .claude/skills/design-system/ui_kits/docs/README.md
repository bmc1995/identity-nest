# Developer docs — UI kit

The **idnest.app/docs** surface. A three-pane documentation layout: section nav (left), article (center), "on this page" TOC (right). Dev-forward: warm code blocks lead, prose supports.

## Run
Open `index.html`. Loads the design system, then `docs.jsx`.

## Layout (`DocsApp`)
- **Top bar** — brand + "Docs" tag, doc search, version pill, Console / Sign-up actions.
- **Left nav** — grouped sections (Getting started / Authentication / API reference); clicking switches the article.
- **Article** — `Quickstart` (install → configure → trigger login, with a Node/React/Python language switcher and an info callout) and three API-reference pages (`GET /authorize`, `POST /token`, `GET /userinfo`) with request/response code.
- **Right TOC** — per-article anchors.

## Composes
`Button`, `Badge`, `Tabs`, `CodeBlock`. Inline `code` spans, callouts, endpoint chips, and "next" cards are prose styles defined in the kit (`dx-*`).

## Notes
Prose is representative of how ID Nest docs read — honest, second-person, short. Syntax highlighting uses the `CodeBlock` token classes.
