import React from 'react';

const CSS = `
.idn-check{ display:inline-flex; align-items:flex-start; gap:10px; cursor:pointer; user-select:none; font-family:var(--font-text); }
.idn-check[data-disabled="true"]{ opacity:.5; cursor:not-allowed; }
.idn-check__box{
  flex:none; width:18px; height:18px; margin-top:1px; border-radius:5px;
  background:var(--surface-inset); border:1px solid var(--border-strong);
  display:grid; place-items:center; color:var(--text-on-accent);
  transition:background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard);
}
.idn-check__box svg{ width:12px; height:12px; opacity:0; transform:scale(.6); transition:opacity var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-out); }
.idn-check input{ position:absolute; opacity:0; width:0; height:0; }
.idn-check input:focus-visible + .idn-check__box{ box-shadow:var(--ring-focus); }
.idn-check input:checked + .idn-check__box{ background:var(--accent); border-color:var(--accent); }
.idn-check input:checked + .idn-check__box svg{ opacity:1; transform:scale(1); }
.idn-check input:indeterminate + .idn-check__box{ background:var(--accent); border-color:var(--accent); }
.idn-check input:indeterminate + .idn-check__box svg{ opacity:1; transform:scale(1); }
.idn-check__text{ display:flex; flex-direction:column; gap:2px; }
.idn-check__label{ font-size:var(--fs-body-sm); color:var(--text-body); line-height:1.3; }
.idn-check__desc{ font-size:var(--fs-caption); color:var(--text-faint); }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-check-css')) {
  const s = document.createElement('style'); s.id = 'idn-check-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Checkbox({ label, description, checked, indeterminate, disabled, className = '', ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return (
    <label className={['idn-check', className].filter(Boolean).join(' ')} data-disabled={disabled || undefined}>
      <input ref={ref} type="checkbox" checked={checked} disabled={disabled} {...rest} />
      <span className="idn-check__box">
        {indeterminate
          ? <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M2.5 6h7" /></svg>
          : <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.3l2.3 2.3L9.6 3.5" /></svg>}
      </span>
      {(label || description) && (
        <span className="idn-check__text">
          {label && <span className="idn-check__label">{label}</span>}
          {description && <span className="idn-check__desc">{description}</span>}
        </span>
      )}
    </label>
  );
}
// build-touch: 1781050250065
