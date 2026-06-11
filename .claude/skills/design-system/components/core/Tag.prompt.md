Removable chip in mono — multi-value inputs like scopes, redirect URIs, allowed origins.

```jsx
<Tag onRemove={() => remove(uri)}>https://app.acme.com/callback</Tag>
<Tag>openid</Tag>
```

Omit `onRemove` for a static (read-only) tag.
