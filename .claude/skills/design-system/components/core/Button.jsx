import React from 'react';

const CSS = `
.idn-btn{
  --_h: var(--control-md);
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  height:var(--_h); padding:0 18px; border-radius:var(--radius-md);
  font-family:var(--font-text); font-size:var(--fs-body-sm); font-weight:var(--fw-semibold);
  letter-spacing:0; line-height:1; white-space:nowrap; cursor:pointer; user-select:none;
  border:1px solid transparent; background:transparent; color:var(--text-strong);
  transition:background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard),
             color var(--dur-fast) var(--ease-standard), transform var(--dur-instant) var(--ease-standard),
             box-shadow var(--dur-fast) var(--ease-standard);
  text-decoration:none;
}
.idn-btn:focus-visible{ outline:none; box-shadow:var(--ring-focus); }
.idn-btn:active{ transform:translateY(1px); }
.idn-btn[disabled],.idn-btn[aria-disabled="true"]{ opacity:.5; pointer-events:none; }
.idn-btn--sm{ --_h:var(--control-sm); padding:0 13px; font-size:var(--fs-caption); }
.idn-btn--lg{ --_h:var(--control-lg); padding:0 24px; font-size:var(--fs-body); }
.idn-btn--full{ width:100%; }

.idn-btn--primary{ background:var(--accent); color:var(--text-on-accent); box-shadow:var(--glow-accent); }
.idn-btn--primary:hover{ background:var(--accent-hover); }
.idn-btn--primary:active{ background:var(--accent-press); }

.idn-btn--secondary{ background:var(--surface-2); color:var(--text-strong); border-color:var(--border-default); }
.idn-btn--secondary:hover{ background:var(--surface-3); border-color:var(--border-strong); }

.idn-btn--ghost{ background:transparent; color:var(--text-body); }
.idn-btn--ghost:hover{ background:var(--surface-2); color:var(--text-strong); }

.idn-btn--danger{ background:var(--danger); color:#fff; }
.idn-btn--danger:hover{ filter:brightness(1.08); }

.idn-btn--mono{ font-family:var(--font-mono); font-weight:var(--fw-medium); letter-spacing:-.01em; }
.idn-btn__spin{ width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:idn-btn-spin .6s linear infinite; }
@keyframes idn-btn-spin{ to{ transform:rotate(360deg);} }
`;

if (typeof document !== 'undefined' && !document.getElementById('idn-btn-css')) {
  const s = document.createElement('style'); s.id = 'idn-btn-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Button({
  variant = 'primary', size = 'md', mono = false, fullWidth = false,
  iconLeft, iconRight, loading = false, disabled = false,
  as = 'button', href, className = '', children, ...rest
}) {
  const cls = [
    'idn-btn', `idn-btn--${variant}`,
    size !== 'md' && `idn-btn--${size}`,
    mono && 'idn-btn--mono',
    fullWidth && 'idn-btn--full',
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {loading && <span className="idn-btn__spin" aria-hidden="true" />}
      {!loading && iconLeft}
      {children && <span>{children}</span>}
      {!loading && iconRight}
    </>
  );

  if (as === 'a') {
    return (
      <a className={cls} href={href} aria-disabled={disabled || loading || undefined} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
}
