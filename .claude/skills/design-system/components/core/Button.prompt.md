Action trigger — use for any primary or secondary action; primary is the single most important action on a view.

```jsx
<Button variant="primary" onClick={save}>Save changes</Button>
<Button variant="secondary" iconLeft={<PlusIcon/>}>Add application</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button variant="primary" mono iconLeft={<TerminalIcon/>}>$ npm i idnest</Button>
<Button variant="danger" loading>Deleting…</Button>
```

Variants: `primary` (clay, glow — one per view), `secondary` (raised surface), `ghost` (text-only), `danger`.
Sizes: `sm` 32 · `md` 40 · `lg` 48. Use `mono` for CLI/install CTAs, `fullWidth` in forms & dialogs, `as="a"` for links.
