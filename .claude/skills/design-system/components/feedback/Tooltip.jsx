import React from 'react';

const CSS = `
.idn-tip{ position:relative; display:inline-flex; }
.idn-tip__pop{
  position:absolute; z-index:1200; left:50%; transform:translateX(-50%);
  bottom:calc(100% + 8px); padding:6px 9px; border-radius:var(--radius-sm);
  background:var(--surface-inset); color:var(--text-strong);
  border:1px solid var(--border-strong); box-shadow:var(--shadow-md);
  font-family:var(--font-text); font-size:var(--fs-caption); line-height:1.3; white-space:nowrap;
  opacity:0; pointer-events:none; transition:opacity var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-out);
}
.idn-tip__pop--mono{ font-family:var(--font-mono); font-size:var(--fs-micro); }
.idn-tip:hover .idn-tip__pop, .idn-tip:focus-within .idn-tip__pop{ opacity:1; transform:translateX(-50%) translateY(-2px); }
.idn-tip__pop::after{ content:""; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:5px solid transparent; border-top-color:var(--surface-inset); }
.idn-tip--bottom .idn-tip__pop{ bottom:auto; top:calc(100% + 8px); }
.idn-tip--bottom .idn-tip__pop::after{ top:auto; bottom:100%; border-top-color:transparent; border-bottom-color:var(--surface-inset); }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-tip-css')) {
  const s = document.createElement('style'); s.id = 'idn-tip-css'; s.textContent = CSS; document.head.appendChild(s);
}

export function Tooltip({ label, placement = 'top', mono = false, children }) {
  return (
    <span className={['idn-tip', placement === 'bottom' && 'idn-tip--bottom'].filter(Boolean).join(' ')} tabIndex={0}>
      {children}
      <span className={['idn-tip__pop', mono && 'idn-tip__pop--mono'].filter(Boolean).join(' ')} role="tooltip">{label}</span>
    </span>
  );
}
// build-touch: 1781050250986
