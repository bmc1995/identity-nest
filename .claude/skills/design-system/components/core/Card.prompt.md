Surface container for grouping content — settings panels, list items, dashboards.

```jsx
<Card padded>Plain content with padding.</Card>

<Card title="Token lifetime" actions={<IconButton label="Edit"><PencilIcon/></IconButton>}
      footer={<Button size="sm">Save</Button>}>
  Access tokens expire after 1 hour by default.
</Card>

<Card interactive accent>Recommended plan</Card>
```

`interactive` adds hover lift, `accent` adds a clay border for the recommended option, `shadow` for floating cards.
