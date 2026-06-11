Text input with built-in label / hint / error / affixes. The workhorse form control.

```jsx
<Input label="Email" type="email" placeholder="you@company.com" required />
<Input label="Client ID" mono prefix={<KeyIcon/>} value="nest_a91f…" readOnly />
<Input label="Redirect URI" error="Must be https://" defaultValue="http://x" />
<Input label="Notes" multiline hint="Optional" />
```

Use `mono` for IDs/secrets/URIs, `prefix`/`suffix` for icons, `multiline` for a textarea. Sizes sm/md/lg.
