Horizontal tab bar with an animated underline (or pill) style and optional count pills.

```jsx
<Tabs tabs={[{id:'apps',label:'Applications',count:12},{id:'users',label:'Users',count:248},{id:'logs',label:'Logs'}]}
      value={tab} onChange={setTab} />
<Tabs variant="pill" tabs={['Overview','Settings']} />
```
