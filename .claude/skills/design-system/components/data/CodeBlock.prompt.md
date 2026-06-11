Code or terminal block with window chrome, language tag and copy button — the signature dev surface.

```jsx
<CodeBlock title="install.sh" language="bash" code="npm install @idnest/sdk" />

<CodeBlock title="auth.ts" language="ts">
  <span className="tk">import</span> {'{ IDNest }'} <span className="tk">from</span> <span className="ts">"@idnest/sdk"</span>;
</CodeBlock>

<CodeBlock terminal code="$ idnest login --tenant acme" />
```

Highlight with token classes on `<span>`: `tk` keyword, `ts` string, `tn` number, `tc` comment, `tf` function, `tp` punctuation.
