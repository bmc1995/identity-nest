import React from 'react';

const CSS = `
.idn-field{ display:flex; flex-direction:column; gap:6px; }
.idn-field__label{ font-family:var(--font-text); font-size:var(--fs-body-sm); font-weight:var(--fw-medium); color:var(--text-body); }
.idn-field__label .req{ color:var(--accent); margin-left:3px; }
.idn-field__hint{ font-size:var(--fs-caption); color:var(--text-faint); }
.idn-field__err{ font-size:var(--fs-caption); color:var(--danger); display:flex; align-items:center; gap:5px; }
.idn-inputwrap{ position:relative; display:flex; align-items:center; }
.idn-input{
  width:100%; height:var(--control-md); padding:0 13px; border-radius:var(--radius-md);
  background:var(--surface-inset); color:var(--text-strong); border:1px solid var(--border-default);
  font-family:var(--font-text); font-size:var(--fs-body); line-height:1; outline:none;
  transition:border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard);
}
.idn-input::placeholder{ color:var(--text-faint); }
.idn-input:hover{ border-color:var(--border-strong); }
.idn-input:focus{ border-color:var(--border-focus); box-shadow:var(--ring-focus); }
.idn-input[disabled]{ opacity:.5; cursor:not-allowed; }
.idn-input--mono{ font-family:var(--font-mono); font-size:var(--fs-body-sm); }
.idn-input--sm{ height:var(--control-sm); font-size:var(--fs-body-sm); }
.idn-input--lg{ height:var(--control-lg); font-size:var(--fs-body-lg); }
.idn-input--haspre{ padding-left:38px; }
.idn-input--hassuf{ padding-right:38px; }
.idn-input--err{ border-color:var(--danger); }
.idn-input--err:focus{ box-shadow:var(--ring-danger); }
.idn-input__affix{ position:absolute; display:flex; align-items:center; justify-content:center; color:var(--text-faint); pointer-events:none; }
.idn-input__affix svg{ width:16px; height:16px; }
.idn-input__affix--pre{ left:12px; }
.idn-input__affix--suf{ right:12px; }
textarea.idn-input{ height:auto; min-height:84px; padding:10px 13px; line-height:1.5; resize:vertical; }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-input-css')) {
  const s = document.createElement('style'); s.id = 'idn-input-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Input({
  label, hint, error, required, prefix, suffix, size = 'md', mono = false,
  multiline = false, id, className = '', ...rest
}) {
  const fid = id || (label ? 'idn-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const inputCls = [
    'idn-input', mono && 'idn-input--mono', size !== 'md' && `idn-input--${size}`,
    prefix && 'idn-input--haspre', suffix && 'idn-input--hassuf', error && 'idn-input--err', className,
  ].filter(Boolean).join(' ');

  const control = multiline
    ? <textarea id={fid} className={inputCls} {...rest} />
    : <input id={fid} className={inputCls} {...rest} />;

  return (
    <div className="idn-field">
      {label && <label className="idn-field__label" htmlFor={fid}>{label}{required && <span className="req">*</span>}</label>}
      <div className="idn-inputwrap">
        {prefix && <span className="idn-input__affix idn-input__affix--pre">{prefix}</span>}
        {control}
        {suffix && <span className="idn-input__affix idn-input__affix--suf">{suffix}</span>}
      </div>
      {error ? <span className="idn-field__err">{error}</span> : hint && <span className="idn-field__hint">{hint}</span>}
    </div>
  );
}
// build-touch: 1781050249683
