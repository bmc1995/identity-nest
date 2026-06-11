Modal dialog with scrim, optional tinted icon, and footer actions.

```jsx
<Dialog open={open} onClose={close} tone="danger" icon={<TrashIcon/>}
  title="Revoke application?" description="Acme Web will lose access immediately."
  footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button variant="danger">Revoke</Button></>}>
  This cannot be undone.
</Dialog>
```

Sizes sm/md/lg. tone="danger" for destructive flows.
