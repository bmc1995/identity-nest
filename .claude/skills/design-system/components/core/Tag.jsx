import React from 'react';

const CSS = `
.idn-tag{
  display:inline-flex; align-items:center; gap:7px; height:26px; padding:0 6px 0 11px;
  border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border-default);
  font-family:var(--font-mono); font-size:var(--fs-caption); color:var(--text-body); white-space:nowrap;
}
.idn-tag--plain{ padding:0 11px; }
.idn-tag__x{
  display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px;
  border-radius:var(--radius-xs); color:var(--text-faint); cursor:pointer; border:0; background:transparent;
  transition:background var(--dur-fast), color var(--dur-fast);
}
.idn-tag__x:hover{ background:var(--surface-3); color:var(--text-strong); }
.idn-tag__x svg{ width:11px; height:11px; }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-tag-css')) {
  const s = document.createElement('style'); s.id = 'idn-tag-css'; s.textContent = CSS; document.head.appendChild(s);
}

const X = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M3 3l6 6M9 3l-6 6" />
  </svg>
);

export function Tag({ onRemove, className = '', children, ...rest }) {
  const cls = ['idn-tag', !onRemove && 'idn-tag--plain', className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      <span>{children}</span>
      {onRemove && (
        <button className="idn-tag__x" aria-label="Remove" onClick={onRemove}><X /></button>
      )}
    </span>
  );
}
