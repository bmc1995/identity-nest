import React from 'react';

const CSS = `
.idn-selectwrap{ position:relative; display:flex; align-items:center; }
.idn-select{
  width:100%; height:var(--control-md); padding:0 38px 0 13px; border-radius:var(--radius-md);
  background:var(--surface-inset); color:var(--text-strong); border:1px solid var(--border-default);
  font-family:var(--font-text); font-size:var(--fs-body); line-height:1; outline:none; cursor:pointer;
  appearance:none; -webkit-appearance:none;
  transition:border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard);
}
.idn-select:hover{ border-color:var(--border-strong); }
.idn-select:focus{ border-color:var(--border-focus); box-shadow:var(--ring-focus); }
.idn-select[disabled]{ opacity:.5; cursor:not-allowed; }
.idn-select--sm{ height:var(--control-sm); font-size:var(--fs-body-sm); }
.idn-select--err{ border-color:var(--danger); }
.idn-select__chev{ position:absolute; right:13px; pointer-events:none; color:var(--text-faint); display:flex; }
.idn-select__chev svg{ width:14px; height:14px; }
.idn-select option{ background:var(--surface-2); color:var(--text-strong); }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-select-css')) {
  const s = document.createElement('style'); s.id = 'idn-select-css'; s.textContent = CSS; document.head.appendChild(s);
}

const Chevron = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 5.5L7 9l3.5-3.5" /></svg>
);

export function Select({
  label, hint, error, required, size = 'md', options, placeholder, id, className = '', children, ...rest
}) {
  const fid = id || (label ? 'idn-sel-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const cls = ['idn-select', size !== 'md' && `idn-select--${size}`, error && 'idn-select--err', className].filter(Boolean).join(' ');
  return (
    <div className="idn-field">
      {label && <label className="idn-field__label" htmlFor={fid}>{label}{required && <span className="req">*</span>}</label>}
      <div className="idn-selectwrap">
        <select id={fid} className={cls} {...rest}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options ? options.map(o => {
            const v = typeof o === 'string' ? o : o.value;
            const l = typeof o === 'string' ? o : o.label;
            return <option key={v} value={v}>{l}</option>;
          }) : children}
        </select>
        <span className="idn-select__chev"><Chevron /></span>
      </div>
      {error ? <span className="idn-field__err">{error}</span> : hint && <span className="idn-field__hint">{hint}</span>}
    </div>
  );
}
// build-touch: 1781050249862
