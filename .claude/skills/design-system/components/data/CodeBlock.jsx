import React from 'react';

const CSS = `
.idn-code{
  border:1px solid var(--border-default); border-radius:var(--radius-lg); overflow:hidden;
  background:var(--syntax-bg); font-family:var(--font-mono); box-shadow:var(--shadow-sm);
}
.idn-code__bar{
  display:flex; align-items:center; gap:10px; padding:9px 12px;
  background:var(--surface-2); border-bottom:1px solid var(--border-subtle);
}
.idn-code__dots{ display:flex; gap:6px; }
.idn-code__dots i{ width:10px; height:10px; border-radius:50%; display:block; }
.idn-code__title{ font-size:var(--fs-micro); letter-spacing:.04em; color:var(--text-muted); }
.idn-code__lang{ margin-left:auto; font-size:var(--fs-micro); letter-spacing:.08em; text-transform:uppercase; color:var(--text-faint); }
.idn-code__copy{
  appearance:none; border:1px solid var(--border-default); background:var(--surface-3);
  color:var(--text-muted); border-radius:var(--radius-sm); padding:4px 9px; font-family:var(--font-mono);
  font-size:var(--fs-micro); cursor:pointer; display:inline-flex; align-items:center; gap:5px;
  transition:color var(--dur-fast), border-color var(--dur-fast), background var(--dur-fast);
}
.idn-code__copy:hover{ color:var(--text-strong); border-color:var(--border-strong); }
.idn-code__copy svg{ width:12px; height:12px; }
.idn-code__pre{ margin:0; padding:14px 16px; overflow-x:auto; font-size:var(--fs-body-sm); line-height:1.65; color:var(--syntax-text); }
.idn-code__pre code{ font-family:inherit; }
.idn-code--terminal{ background:var(--surface-inset); }
.idn-code--terminal .idn-code__pre{ color:var(--text-body); }
.idn-code__prompt{ color:var(--accent); user-select:none; }
.idn-code__ok{ color:var(--success); }
/* token tints */
.tk{ color:var(--syntax-keyword); } .ts{ color:var(--syntax-string); } .tn{ color:var(--syntax-number); }
.tc{ color:var(--syntax-comment); font-style:italic; } .tf{ color:var(--syntax-func); } .tp{ color:var(--syntax-punct); }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-code-css')) {
  const s = document.createElement('style'); s.id = 'idn-code-css'; s.textContent = CSS; document.head.appendChild(s);
}

const CopyIcon = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="5" width="8" height="8" rx="2" /><path d="M3 11V4a1 1 0 011-1h7" strokeLinecap="round" /></svg>;
const CheckIcon = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg>;

export function CodeBlock({ title, language, terminal = false, showDots = true, code, children, className = '' }) {
  const [copied, setCopied] = React.useState(false);
  const raw = code != null ? code : (typeof children === 'string' ? children : '');
  const copy = () => {
    try { navigator.clipboard.writeText(raw); } catch (e) {}
    setCopied(true); setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className={['idn-code', terminal && 'idn-code--terminal', className].filter(Boolean).join(' ')}>
      <div className="idn-code__bar">
        {showDots && <span className="idn-code__dots"><i style={{ background: '#E5533D' }} /><i style={{ background: '#E8A33C' }} /><i style={{ background: '#3DBF8B' }} /></span>}
        {title && <span className="idn-code__title">{title}</span>}
        {language && <span className="idn-code__lang">{language}</span>}
        <button className="idn-code__copy" onClick={copy} style={language ? { marginLeft: 12 } : { marginLeft: 'auto' }}>
          {copied ? <CheckIcon /> : <CopyIcon />}{copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="idn-code__pre"><code>{children != null ? children : code}</code></pre>
    </div>
  );
}
// build-touch: 1781050251396
