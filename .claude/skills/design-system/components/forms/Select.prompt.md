Dropdown select, visually matched to Input. Pass `options` or `<option>` children.

```jsx
<Select label="Grant type" options={['authorization_code','client_credentials','refresh_token']} />
<Select label="Region" placeholder="Choose…" options={[{value:'us',label:'US East'},{value:'eu',label:'EU West'}]} />
```

Sizes sm/md. Supports label, hint, error, required like Input.
