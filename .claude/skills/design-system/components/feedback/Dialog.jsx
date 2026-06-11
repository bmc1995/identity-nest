import React from 'react';

const CSS = `
.idn-dialog__scrim{
  position:fixed; inset:0; background:var(--overlay-scrim); backdrop-filter:blur(3px);
  display:grid; place-items:center; padding:24px; z-index:1000; opacity:1;
}
.idn-dialog{
  width:100%; max-width:480px; background:var(--surface-1); color:var(--text-body);
  border:1px solid var(--border-default); border-radius:var(--radius-xl);
  box-shadow:var(--shadow-xl); overflow:hidden; opacity:1;
}
@media (prefers-reduced-motion: no-preference){
  .idn-dialog__scrim{ animation:idn-dlg-fade var(--dur-base) var(--ease-standard); }
  .idn-dialog{ animation:idn-dlg-rise var(--dur-base) var(--ease-out); }
}
.idn-dialog--sm{ max-width:380px; } .idn-dialog--lg{ max-width:620px; }
.idn-dialog__head{ display:flex; align-items:flex-start; gap:14px; padding:22px 22px 0; }
.idn-dialog__icon{ flex:none; width:38px; height:38px; border-radius:var(--radius-md); display:grid; place-items:center; background:var(--accent-soft); color:var(--accent); }
.idn-dialog__icon--danger{ background:var(--danger-soft); color:var(--danger); }
.idn-dialog__titles{ flex:1; display:flex; flex-direction:column; gap:4px; }
.idn-dialog__title{ font-family:var(--font-display); font-weight:var(--fw-bold); font-size:var(--fs-h3); color:var(--text-strong); letter-spacing:var(--ls-tight); }
.idn-dialog__desc{ font-size:var(--fs-body-sm); color:var(--text-muted); line-height:1.5; }
.idn-dialog__x{ flex:none; width:30px; height:30px; border-radius:var(--radius-sm); border:0; background:transparent; color:var(--text-faint); cursor:pointer; display:grid; place-items:center; transition:background var(--dur-fast); }
.idn-dialog__x:hover{ background:var(--surface-2); color:var(--text-body); }
.idn-dialog__body{ padding:16px 22px 4px; font-size:var(--fs-body-sm); }
.idn-dialog__foot{ display:flex; justify-content:flex-end; gap:10px; padding:18px 22px 22px; }
@keyframes idn-dlg-fade{ from{ opacity:0; } }
@keyframes idn-dlg-rise{ from{ opacity:0; transform:translateY(8px) scale(.98); } }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-dialog-css')) {
  const s = document.createElement('style'); s.id = 'idn-dialog-css'; s.textContent = CSS; document.head.appendChild(s);
}

const XIcon = () => <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>;

export function Dialog({ open = true, onClose, title, description, icon, tone = 'accent', size = 'md', footer, children }) {
  if (!open) return null;
  return (
    <div className="idn-dialog__scrim" onClick={onClose}>
      <div className={['idn-dialog', size !== 'md' && `idn-dialog--${size}`].filter(Boolean).join(' ')} role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className="idn-dialog__head">
          {icon && <div className={['idn-dialog__icon', tone === 'danger' && 'idn-dialog__icon--danger'].filter(Boolean).join(' ')}>{icon}</div>}
          <div className="idn-dialog__titles">
            {title && <div className="idn-dialog__title">{title}</div>}
            {description && <div className="idn-dialog__desc">{description}</div>}
          </div>
          {onClose && <button className="idn-dialog__x" onClick={onClose} aria-label="Close"><XIcon /></button>}
        </div>
        {children && <div className="idn-dialog__body">{children}</div>}
        {footer && <div className="idn-dialog__foot">{footer}</div>}
      </div>
    </div>
  );
}
// build-touch: 1781050250575
