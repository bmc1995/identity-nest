import React from 'react';

const CSS = `
.idn-iconbtn{
  display:inline-flex; align-items:center; justify-content:center;
  width:var(--control-md); height:var(--control-md); border-radius:var(--radius-md);
  border:1px solid transparent; background:transparent; color:var(--text-muted);
  cursor:pointer; transition:background var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard);
}
.idn-iconbtn:hover{ background:var(--surface-2); color:var(--text-strong); }
.idn-iconbtn:focus-visible{ outline:none; box-shadow:var(--ring-focus); }
.idn-iconbtn:active{ transform:translateY(1px); }
.idn-iconbtn[disabled]{ opacity:.45; pointer-events:none; }
.idn-iconbtn--sm{ width:var(--control-sm); height:var(--control-sm); border-radius:var(--radius-sm); }
.idn-iconbtn--lg{ width:var(--control-lg); height:var(--control-lg); }
.idn-iconbtn--solid{ background:var(--surface-2); border-color:var(--border-default); color:var(--text-strong); }
.idn-iconbtn--solid:hover{ background:var(--surface-3); }
.idn-iconbtn--accent{ background:var(--accent-soft); color:var(--accent); }
.idn-iconbtn--accent:hover{ background:var(--accent); color:var(--text-on-accent); }
.idn-iconbtn svg{ width:18px; height:18px; display:block; }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-iconbtn-css')) {
  const s = document.createElement('style'); s.id = 'idn-iconbtn-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function IconButton({ variant = 'ghost', size = 'md', label, className = '', children, ...rest }) {
  const cls = [
    'idn-iconbtn',
    variant !== 'ghost' && `idn-iconbtn--${variant}`,
    size !== 'md' && `idn-iconbtn--${size}`,
    className,
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}
