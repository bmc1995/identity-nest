import React from 'react';

const CSS = `
.idn-switch{ display:inline-flex; align-items:center; gap:10px; cursor:pointer; user-select:none; font-family:var(--font-text); }
.idn-switch[data-disabled="true"]{ opacity:.5; cursor:not-allowed; }
.idn-switch input{ position:absolute; opacity:0; width:0; height:0; }
.idn-switch__track{
  position:relative; flex:none; width:38px; height:22px; border-radius:var(--radius-pill);
  background:var(--surface-3); border:1px solid var(--border-strong);
  transition:background var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard);
}
.idn-switch__thumb{
  position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%;
  background:var(--text-body); box-shadow:var(--shadow-xs);
  transition:transform var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-standard);
}
.idn-switch input:focus-visible + .idn-switch__track{ box-shadow:var(--ring-focus); }
.idn-switch input:checked + .idn-switch__track{ background:var(--accent); border-color:var(--accent); }
.idn-switch input:checked + .idn-switch__track .idn-switch__thumb{ transform:translateX(16px); background:var(--text-on-accent); }
.idn-switch--sm .idn-switch__track{ width:32px; height:18px; }
.idn-switch--sm .idn-switch__thumb{ width:13px; height:13px; }
.idn-switch--sm input:checked + .idn-switch__track .idn-switch__thumb{ transform:translateX(14px); }
.idn-switch__label{ font-size:var(--fs-body-sm); color:var(--text-body); }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-switch-css')) {
  const s = document.createElement('style'); s.id = 'idn-switch-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Switch({ label, size = 'md', disabled, className = '', ...rest }) {
  const cls = ['idn-switch', size === 'sm' && 'idn-switch--sm', className].filter(Boolean).join(' ');
  return (
    <label className={cls} data-disabled={disabled || undefined}>
      <input type="checkbox" role="switch" disabled={disabled} {...rest} />
      <span className="idn-switch__track"><span className="idn-switch__thumb" /></span>
      {label && <span className="idn-switch__label">{label}</span>}
    </label>
  );
}
// build-touch: 1781050250371
