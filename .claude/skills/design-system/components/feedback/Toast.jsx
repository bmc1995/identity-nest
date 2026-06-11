import React from 'react';

const CSS = `
.idn-toast{
  display:flex; align-items:flex-start; gap:11px; width:min(360px, 90vw);
  padding:13px 14px; border-radius:var(--radius-lg);
  background:var(--surface-2); border:1px solid var(--border-default);
  box-shadow:var(--shadow-lg); color:var(--text-body); opacity:1;
}
@media (prefers-reduced-motion: no-preference){
  .idn-toast{ animation:idn-toast-in var(--dur-base) var(--ease-out); }
}
.idn-toast__icon{ flex:none; width:20px; height:20px; display:grid; place-items:center; margin-top:1px; }
.idn-toast--success .idn-toast__icon{ color:var(--success); }
.idn-toast--danger .idn-toast__icon{ color:var(--danger); }
.idn-toast--warning .idn-toast__icon{ color:var(--warning); }
.idn-toast--info .idn-toast__icon{ color:var(--info); }
.idn-toast__body{ flex:1; display:flex; flex-direction:column; gap:2px; }
.idn-toast__title{ font-size:var(--fs-body-sm); font-weight:var(--fw-semibold); color:var(--text-strong); }
.idn-toast__msg{ font-size:var(--fs-caption); color:var(--text-muted); line-height:1.45; }
.idn-toast__x{ flex:none; width:22px; height:22px; border:0; background:transparent; color:var(--text-faint); cursor:pointer; border-radius:var(--radius-sm); display:grid; place-items:center; }
.idn-toast__x:hover{ background:var(--surface-3); color:var(--text-body); }
.idn-toast__rail{ position:fixed; bottom:20px; right:20px; display:flex; flex-direction:column; gap:10px; z-index:1100; }
@keyframes idn-toast-in{ from{ opacity:0; transform:translateY(8px); } }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-toast-css')) {
  const s = document.createElement('style'); s.id = 'idn-toast-css'; s.textContent = CSS; document.head.appendChild(s);
}

const ICONS = {
  success: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5l3.5 3.5L16 5.5" /></svg>,
  danger: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M10 6v5M10 14h.01" /><circle cx="10" cy="10" r="7.5" /></svg>,
  warning: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3l8 14H2L10 3zM10 8v4M10 15h.01" /></svg>,
  info: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="10" cy="10" r="7.5" /><path d="M10 9v5M10 6.5h.01" /></svg>,
};
const XIcon = () => <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" /></svg>;

export function Toast({ tone = 'info', title, children, onClose, className = '' }) {
  return (
    <div className={['idn-toast', `idn-toast--${tone}`, className].filter(Boolean).join(' ')} role="status">
      <span className="idn-toast__icon">{ICONS[tone]}</span>
      <div className="idn-toast__body">
        {title && <span className="idn-toast__title">{title}</span>}
        {children && <span className="idn-toast__msg">{children}</span>}
      </div>
      {onClose && <button className="idn-toast__x" onClick={onClose} aria-label="Dismiss"><XIcon /></button>}
    </div>
  );
}

export function ToastRail({ children }) {
  return <div className="idn-toast__rail">{children}</div>;
}
// build-touch: 1781050250786
