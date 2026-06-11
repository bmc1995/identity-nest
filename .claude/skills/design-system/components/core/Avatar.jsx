import React from 'react';

const CSS = `
.idn-avatar{
  display:inline-flex; align-items:center; justify-content:center; flex:0 0 auto;
  width:36px; height:36px; border-radius:var(--radius-md); overflow:hidden;
  font-family:var(--font-display); font-weight:var(--fw-semibold); font-size:14px;
  color:var(--text-on-accent); background:var(--accent); letter-spacing:0; user-select:none;
}
.idn-avatar img{ width:100%; height:100%; object-fit:cover; }
.idn-avatar--xs{ width:24px; height:24px; border-radius:var(--radius-sm); font-size:10px; }
.idn-avatar--sm{ width:28px; height:28px; font-size:12px; }
.idn-avatar--lg{ width:48px; height:48px; border-radius:var(--radius-lg); font-size:18px; }
.idn-avatar--round{ border-radius:var(--radius-pill); }
.idn-avatar__status{
  position:absolute; right:-1px; bottom:-1px; width:10px; height:10px; border-radius:50%;
  border:2px solid var(--surface-1);
}
.idn-avatar-wrap{ position:relative; display:inline-flex; }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-avatar-css')) {
  const s = document.createElement('style'); s.id = 'idn-avatar-css'; s.textContent = CSS; document.head.appendChild(s);
}

const PALETTE = ['var(--accent)', 'var(--accent-2)', 'var(--info)', 'var(--success)', 'var(--raw-clay-600)'];
function hueFor(str = '') {
  let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}

export function Avatar({ name = '', src, size = 'md', round = false, status, className = '', ...rest }) {
  const cls = ['idn-avatar', size !== 'md' && `idn-avatar--${size}`, round && 'idn-avatar--round', className].filter(Boolean).join(' ');
  const statusColor = { online: 'var(--success)', away: 'var(--warning)', offline: 'var(--text-faint)' }[status];
  const node = (
    <span className={cls} style={!src ? { background: hueFor(name) } : undefined} {...rest}>
      {src ? <img src={src} alt={name} /> : initials(name)}
    </span>
  );
  if (!status) return node;
  return (
    <span className="idn-avatar-wrap">
      {node}
      <span className="idn-avatar__status" style={{ background: statusColor }} />
    </span>
  );
}
