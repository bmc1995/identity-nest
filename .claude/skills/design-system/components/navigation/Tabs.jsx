import React from 'react';

const CSS = `
.idn-tabs{ display:flex; gap:2px; border-bottom:1px solid var(--border-default); }
.idn-tab{
  position:relative; appearance:none; border:0; background:transparent; cursor:pointer;
  font-family:var(--font-text); font-size:var(--fs-body-sm); font-weight:var(--fw-medium);
  color:var(--text-muted); padding:10px 14px; border-radius:var(--radius-sm) var(--radius-sm) 0 0;
  transition:color var(--dur-fast) var(--ease-standard), background var(--dur-fast) var(--ease-standard);
  display:inline-flex; align-items:center; gap:7px;
}
.idn-tab:hover{ color:var(--text-body); background:var(--surface-2); }
.idn-tab[aria-selected="true"]{ color:var(--text-strong); }
.idn-tab__underline{ position:absolute; left:8px; right:8px; bottom:-1px; height:2px; border-radius:2px; background:var(--accent); transform:scaleX(0); transition:transform var(--dur-base) var(--ease-out); }
.idn-tab[aria-selected="true"] .idn-tab__underline{ transform:scaleX(1); }
.idn-tab__count{ font-family:var(--font-mono); font-size:var(--fs-micro); padding:1px 6px; border-radius:var(--radius-pill); background:var(--surface-3); color:var(--text-muted); }
.idn-tab[aria-selected="true"] .idn-tab__count{ background:var(--accent-soft); color:var(--accent); }
.idn-tabs--pill{ border:0; gap:4px; background:var(--surface-inset); padding:4px; border-radius:var(--radius-lg); display:inline-flex; }
.idn-tabs--pill .idn-tab{ border-radius:var(--radius-md); padding:7px 13px; }
.idn-tabs--pill .idn-tab[aria-selected="true"]{ background:var(--surface-2); }
.idn-tabs--pill .idn-tab__underline{ display:none; }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-tabs-css')) {
  const s = document.createElement('style'); s.id = 'idn-tabs-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Tabs({ tabs, value, onChange, variant = 'underline', className = '' }) {
  const [internal, setInternal] = React.useState(value ?? (tabs[0] && (tabs[0].id ?? tabs[0])));
  const active = value !== undefined ? value : internal;
  const select = (id) => { if (value === undefined) setInternal(id); onChange && onChange(id); };
  return (
    <div className={['idn-tabs', variant === 'pill' && 'idn-tabs--pill', className].filter(Boolean).join(' ')} role="tablist">
      {tabs.map(t => {
        const id = t.id ?? t; const label = t.label ?? t;
        return (
          <button key={id} className="idn-tab" role="tab" aria-selected={active === id} onClick={() => select(id)}>
            {t.icon}
            <span>{label}</span>
            {t.count != null && <span className="idn-tab__count">{t.count}</span>}
            <span className="idn-tab__underline" />
          </button>
        );
      })}
    </div>
  );
}
// build-touch: 1781050251192
