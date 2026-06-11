import React from 'react';

const CSS = `
.idn-card{
  background:var(--surface-1); border:1px solid var(--border-default);
  border-radius:var(--radius-xl); overflow:hidden;
  transition:border-color var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard),
             transform var(--dur-base) var(--ease-standard);
}
.idn-card--pad{ padding:var(--space-5); }
.idn-card--shadow{ box-shadow:var(--shadow-md); }
.idn-card--interactive{ cursor:pointer; }
.idn-card--interactive:hover{ border-color:var(--border-strong); box-shadow:var(--shadow-lg); transform:translateY(-2px); }
.idn-card--accent{ border-color:var(--accent); box-shadow:0 0 0 1px var(--accent-soft); }
.idn-card__head{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:var(--space-4) var(--space-5); border-bottom:1px solid var(--border-subtle); }
.idn-card__title{ font-family:var(--font-display); font-weight:var(--fw-semibold); font-size:var(--fs-h4); color:var(--text-strong); }
.idn-card__body{ padding:var(--space-5); }
.idn-card__foot{ padding:var(--space-4) var(--space-5); border-top:1px solid var(--border-subtle);
  display:flex; align-items:center; justify-content:flex-end; gap:var(--space-3); background:var(--bg-sunken); }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-card-css')) {
  const s = document.createElement('style'); s.id = 'idn-card-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Card({
  title, actions, footer, padded, shadow = false, interactive = false, accent = false,
  className = '', children, ...rest
}) {
  const hasChrome = title != null || actions != null || footer != null;
  const cls = [
    'idn-card',
    !hasChrome && padded !== false && 'idn-card--pad',
    shadow && 'idn-card--shadow',
    interactive && 'idn-card--interactive',
    accent && 'idn-card--accent',
    className,
  ].filter(Boolean).join(' ');

  if (!hasChrome) return <div className={cls} {...rest}>{children}</div>;

  return (
    <div className={cls} {...rest}>
      {(title != null || actions != null) && (
        <div className="idn-card__head">
          {typeof title === 'string' ? <span className="idn-card__title">{title}</span> : title}
          {actions}
        </div>
      )}
      <div className="idn-card__body">{children}</div>
      {footer && <div className="idn-card__foot">{footer}</div>}
    </div>
  );
}
