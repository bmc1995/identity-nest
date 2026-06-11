import React from 'react';

const CSS = `
.idn-badge{
  display:inline-flex; align-items:center; gap:6px; height:22px; padding:0 9px;
  border-radius:var(--radius-pill); font-family:var(--font-mono); font-size:var(--fs-micro);
  font-weight:var(--fw-medium); letter-spacing:.01em; white-space:nowrap; line-height:1;
  border:1px solid transparent;
}
.idn-badge__dot{ width:6px; height:6px; border-radius:50%; background:currentColor; }
.idn-badge--neutral{ background:var(--surface-3); color:var(--text-body); border-color:var(--border-subtle); }
.idn-badge--accent{ background:var(--accent-soft); color:var(--accent); }
.idn-badge--success{ background:var(--success-soft); color:var(--success); }
.idn-badge--warning{ background:var(--warning-soft); color:var(--warning); }
.idn-badge--danger{ background:var(--danger-soft); color:var(--danger); }
.idn-badge--info{ background:var(--info-soft); color:var(--info); }
.idn-badge--solid{ border:0; }
.idn-badge--solid.idn-badge--accent{ background:var(--accent); color:var(--text-on-accent); }
.idn-badge--solid.idn-badge--success{ background:var(--success); color:#10261d; }
.idn-badge--solid.idn-badge--danger{ background:var(--danger); color:#fff; }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-badge-css')) {
  const s = document.createElement('style'); s.id = 'idn-badge-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Badge({ tone = 'neutral', solid = false, dot = false, className = '', children, ...rest }) {
  const cls = ['idn-badge', `idn-badge--${tone}`, solid && 'idn-badge--solid', className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {dot && <span className="idn-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
