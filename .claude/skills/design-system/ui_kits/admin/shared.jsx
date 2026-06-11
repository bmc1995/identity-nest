/* ID Nest Console (admin) — shared shell, icons, styles.
   Exports AppShell + icons to window. */

const A = window.IDNestDesignSystem_c7f3f6;

const AIc = {
  overview: (p) => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.5"/><rect x="11" y="2.5" width="6.5" height="6.5" rx="1.5"/><rect x="2.5" y="11" width="6.5" height="6.5" rx="1.5"/><rect x="11" y="11" width="6.5" height="6.5" rx="1.5"/></svg>,
  users: (p) => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="7.5" cy="6.5" r="2.8"/><path d="M2.5 16.5a5 5 0 0 1 10 0"/><path d="M13.5 4.2a2.8 2.8 0 0 1 0 5.1M17.5 16.5a5 5 0 0 0-2.8-4.5"/></svg>,
  apps: (p) => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 2.5l6.5 3.6v7.8L10 17.5 3.5 13.9V6.1L10 2.5Z"/><path d="M3.7 6.2L10 9.8l6.3-3.6M10 9.8v7.5"/></svg>,
  policies: (p) => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 2.5l6 2.4v4.3c0 3.7-2.5 6.9-6 8.3-3.5-1.4-6-4.6-6-8.3V4.9l6-2.4Z"/><path d="M7.5 10l1.8 1.8L13 8"/></svg>,
  connections: (p) => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 12l4-4M6.5 9.5L5 11a3 3 0 0 0 4.2 4.2l1.5-1.5M13.5 10.5L15 9a3 3 0 0 0-4.2-4.2L9.3 6.3"/></svg>,
  logs: (p) => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 4.5h12M4 8h12M4 11.5h8M4 15h6"/></svg>,
  settings: (p) => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="10" cy="10" r="2.6"/><path d="M10 1.8v2.1M10 16.1v2.1M3.2 3.2l1.5 1.5M15.3 15.3l1.5 1.5M1.8 10h2.1M16.1 10h2.1M3.2 16.8l1.5-1.5M15.3 4.7l1.5-1.5"/></svg>,
  search: (p) => <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="8" cy="8" r="5"/><path d="M11.6 11.6L15.5 15.5"/></svg>,
  bell: (p) => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 2.5a5 5 0 0 0-5 5c0 5-2 6-2 6h14s-2-1-2-6a5 5 0 0 0-5-5ZM8.5 16.5a1.7 1.7 0 0 0 3 0"/></svg>,
  plus: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M8 3v10M3 8h10"/></svg>,
  chevDown: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 6.5L8 10l4-3.5"/></svg>,
  chevRight: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6.5 4L10 8l-3.5 4"/></svg>,
  dots: (p) => <svg viewBox="0 0 16 16" fill="currentColor" {...p}><circle cx="8" cy="3.5" r="1.4"/><circle cx="8" cy="8" r="1.4"/><circle cx="8" cy="12.5" r="1.4"/></svg>,
  copy: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="5.5" y="5.5" width="8" height="8" rx="2"/><path d="M3 10.5V4a1.5 1.5 0 0 1 1.5-1.5H11"/></svg>,
  ext: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 3.5h3.5V7M12.5 3.5L7 9M11 9.5v2A1.5 1.5 0 0 1 9.5 13h-5A1.5 1.5 0 0 1 3 11.5v-5A1.5 1.5 0 0 1 4.5 5h2"/></svg>,
  key: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="5.5" cy="10.5" r="2.8"/><path d="M7.5 8.5l5-5M11 5l1.5 1.5M9.5 6.5L11 8"/></svg>,
  trend: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 11l3.5-3.5 2.5 2.5L14 4"/><path d="M10 4h4v4"/></svg>,
  filter: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2.5 4h11M4.5 8h7M6.5 12h3"/></svg>,
  logout: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 13.5H3.5A1.5 1.5 0 0 1 2 12V4a1.5 1.5 0 0 1 1.5-1.5H6M10.5 11l3-3-3-3M13.5 8H6"/></svg>,
  google: (p) => <svg viewBox="0 0 18 18" {...p}><path fill="#EA4335" d="M9 7.4v3.3h4.6A4 4 0 0 1 9 13.5 4.5 4.5 0 1 1 12 5.6l2.4-2.3A8 8 0 1 0 17 9c0-.5 0-.9-.1-1.6Z"/></svg>,
  github: (p) => <svg viewBox="0 0 18 18" fill="currentColor" {...p}><path d="M9 1.5a7.5 7.5 0 0 0-2.4 14.6c.4 0 .5-.2.5-.4v-1.3c-2 .4-2.5-.9-2.5-.9-.4-.9-.9-1.1-.9-1.1-.7-.5 0-.5 0-.5.7 0 1.1.8 1.1.8.7 1.1 1.8.8 2.2.6 0-.5.3-.8.5-1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.5.8-2 0-.2-.4-1 .1-2 0 0 .6-.2 2 .8a7 7 0 0 1 3.6 0c1.4-1 2-.8 2-.8.5 1 .1 1.8.1 2 .5.5.8 1.2.8 2 0 2.8-1.7 3.4-3.3 3.6.3.2.5.7.5 1.4v2c0 .2.1.5.5.4A7.5 7.5 0 0 0 9 1.5Z"/></svg>,
};

const ADM_CSS = `
.adm{ display:grid; grid-template-columns:var(--sidebar-w) 1fr; min-height:100vh; background:var(--bg-base); color:var(--text-body); }
/* Sidebar */
.adm-side{ background:var(--bg-sunken); border-right:1px solid var(--border-subtle); display:flex; flex-direction:column; padding:16px 12px; gap:4px; position:sticky; top:0; height:100vh; }
.adm-side__brand{ display:flex; align-items:center; gap:10px; padding:6px 8px 14px; font-family:var(--font-display); font-weight:700; font-size:17px; color:var(--text-strong); letter-spacing:-.02em; white-space:nowrap; }
.adm-side__brand img{ width:26px; height:26px; flex:none; }
.adm-tenant{ display:flex; align-items:center; gap:9px; padding:9px 10px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--surface-1); cursor:pointer; margin-bottom:10px; transition:border-color .14s; }
.adm-tenant:hover{ border-color:var(--border-strong); }
.adm-tenant__logo{ width:24px; height:24px; border-radius:6px; background:var(--accent-soft); color:var(--accent); display:grid; place-items:center; font-family:var(--font-display); font-weight:700; font-size:13px; flex:none; }
.adm-tenant__name{ font-size:13px; font-weight:600; color:var(--text-strong); line-height:1.1; }
.adm-tenant__env{ font-family:var(--font-mono); font-size:10px; color:var(--text-faint); letter-spacing:.04em; }
.adm-tenant svg{ margin-left:auto; color:var(--text-faint); width:14px; height:14px; }
.adm-navlabel{ font-family:var(--font-mono); font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-faint); padding:12px 10px 6px; }
.adm-nav{ position:relative; display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:var(--radius-md); font-size:var(--fs-body-sm); font-weight:500; color:var(--text-muted); cursor:pointer; border:0; background:transparent; width:100%; text-align:left; transition:color .14s, background .14s; }
.adm-nav svg{ width:18px; height:18px; flex:none; transition:color .14s; }
.adm-nav:hover{ color:var(--text-strong); background:var(--surface-2); }
.adm-nav[data-active="true"]{ color:var(--text-strong); background:var(--accent-soft); }
.adm-nav[data-active="true"] svg{ color:var(--accent); }
.adm-nav[data-active="true"]::before{ content:""; position:absolute; left:-12px; top:50%; transform:translateY(-50%); width:3px; height:18px; border-radius:0 3px 3px 0; background:var(--accent); }
.adm-nav__badge{ margin-left:auto; font-family:var(--font-mono); font-size:10px; font-variant-numeric:tabular-nums; padding:1px 6px; border-radius:var(--radius-pill); background:var(--surface-3); color:var(--text-muted); }
.adm-nav[data-active="true"] .adm-nav__badge{ background:color-mix(in srgb, var(--accent) 20%, transparent); color:var(--accent); }
.adm-side__foot{ margin-top:auto; }
.adm-user{ display:flex; align-items:center; gap:10px; padding:8px; border-radius:var(--radius-md); cursor:pointer; transition:background .14s; }
.adm-user:hover{ background:var(--surface-2); }
.adm-user__name{ font-size:12.5px; font-weight:600; color:var(--text-strong); line-height:1.1; }
.adm-user__mail{ font-size:11px; color:var(--text-faint); }
.adm-user svg{ margin-left:auto; color:var(--text-faint); width:15px; height:15px; }

/* Main */
.adm-main{ display:flex; flex-direction:column; min-width:0; }
.adm-top{ height:60px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:16px; padding:0 28px; position:sticky; top:0; background:color-mix(in srgb, var(--bg-base) 82%, transparent); backdrop-filter:blur(12px); z-index:20; }
.adm-crumb{ display:flex; align-items:center; gap:8px; font-size:13.5px; color:var(--text-faint); min-width:0; }
.adm-crumb__home{ display:flex; align-items:center; gap:7px; color:var(--text-muted); }
.adm-crumb__home img{ width:18px; height:18px; flex:none; }
.adm-crumb svg{ width:13px; height:13px; flex:none; opacity:.7; }
.adm-crumb b{ color:var(--text-strong); font-weight:600; }
.adm-search{ display:flex; align-items:center; gap:9px; height:36px; padding:0 12px; border-radius:var(--radius-md); background:var(--surface-inset); border:1px solid var(--border-default); width:260px; color:var(--text-faint); transition:border-color .14s, box-shadow .14s; }
.adm-search:focus-within{ border-color:var(--border-focus); box-shadow:var(--ring-focus); }
.adm-search input{ border:0; background:transparent; outline:none; color:var(--text-body); font-family:var(--font-text); font-size:13px; width:100%; }
.adm-search svg{ width:16px; height:16px; flex:none; }
.adm-search kbd{ font-family:var(--font-mono); font-size:10px; padding:2px 5px; border-radius:4px; background:var(--surface-3); color:var(--text-faint); border:1px solid var(--border-subtle); }
.adm-top__right{ margin-left:auto; display:flex; align-items:center; gap:8px; }
.adm-top__sep{ width:1px; height:22px; background:var(--border-subtle); margin:0 2px; }
.adm-iconbtn{ width:36px; height:36px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--surface-1); color:var(--text-muted); display:grid; place-items:center; cursor:pointer; position:relative; transition:border-color .14s, color .14s; }
.adm-iconbtn:hover{ color:var(--text-strong); border-color:var(--border-strong); }
.adm-iconbtn__dot{ position:absolute; top:8px; right:9px; width:7px; height:7px; border-radius:50%; background:var(--accent); border:2px solid var(--bg-base); }

.adm-content{ padding:28px; max-width:1180px; width:100%; }
.adm-pagehead{ display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:24px; flex-wrap:wrap; }
.adm-pagehead__t{ min-width:0; }
.adm-pagehead h1{ font-family:var(--font-display); font-weight:700; font-size:26px; letter-spacing:-.02em; color:var(--text-strong); margin:0; }
.adm-pagehead p{ color:var(--text-muted); font-size:13.5px; margin:5px 0 0; max-width:60ch; }
.adm-pagehead__actions{ display:flex; gap:10px; flex:none; }

/* Stat cards */
.adm-stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
.adm-stat{ background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:16px 18px; transition:border-color .16s, transform .16s; }
.adm-stat:hover{ border-color:var(--border-default); transform:translateY(-2px); }
.adm-stat__top{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.adm-stat__label{ font-size:12.5px; color:var(--text-muted); white-space:nowrap; }
.adm-stat__ic{ width:28px; height:28px; border-radius:8px; display:grid; place-items:center; background:var(--surface-3); color:var(--text-muted); flex:none; }
.adm-stat__ic svg{ width:15px; height:15px; }
.adm-stat__val{ font-family:var(--font-display); font-weight:700; font-size:30px; color:var(--text-strong); letter-spacing:-.02em; margin-top:12px; line-height:1; font-variant-numeric:tabular-nums; }
.adm-stat__row{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:12px; }
.adm-stat__delta{ font-family:var(--font-mono); font-size:11px; font-variant-numeric:tabular-nums; display:inline-flex; align-items:center; gap:3px; padding:2px 7px 2px 5px; border-radius:var(--radius-pill); }
.adm-stat__delta svg{ width:12px; height:12px; flex:none; }
.adm-stat__delta--up{ color:var(--success); background:var(--success-soft); }
.adm-stat__delta--down{ color:var(--danger); background:var(--danger-soft); }
.adm-stat__spark{ flex:none; }
.adm-stat__period{ font-family:var(--font-mono); font-size:10px; color:var(--text-faint); letter-spacing:.02em; }

/* Panels */
.adm-panel{ background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); overflow:hidden; }
.adm-panel__head{ display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid var(--border-subtle); }
.adm-panel__head h3{ font-family:var(--font-display); font-size:15px; color:var(--text-strong); margin:0; white-space:nowrap; }
.adm-grid2{ display:grid; grid-template-columns:1.5fr 1fr; gap:16px; }

/* Bars chart */
.adm-chart{ position:relative; padding:20px 18px 14px; }
.adm-chart__plot{ position:relative; height:160px; }
.adm-chart__grid{ position:absolute; inset:0 0 18px 0; display:flex; flex-direction:column; justify-content:space-between; pointer-events:none; }
.adm-chart__gline{ position:relative; height:1px; background:var(--border-subtle); }
.adm-chart__gval{ position:absolute; left:0; top:-7px; font-family:var(--font-mono); font-size:9px; color:var(--text-faint); background:var(--surface-1); padding-right:6px; }
.adm-bars{ position:absolute; inset:0; display:flex; align-items:flex-end; gap:8px; padding-left:30px; }
.adm-bars__col{ flex:1; height:100%; display:flex; flex-direction:column; justify-content:flex-end; gap:6px; align-items:center; cursor:default; position:relative; }
.adm-bars__track{ width:100%; flex:1; display:flex; align-items:flex-end; justify-content:center; }
.adm-bars__bar{ width:100%; max-width:26px; border-radius:5px 5px 2px 2px; background:linear-gradient(180deg, color-mix(in srgb, var(--accent) 72%, var(--surface-3)), var(--accent-press)); transition:filter .14s, background .14s; }
.adm-bars__col[data-peak="true"] .adm-bars__bar{ background:linear-gradient(180deg, var(--accent-hover), var(--accent)); box-shadow:0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent); }
.adm-bars__col[data-hover="true"] .adm-bars__bar{ filter:brightness(1.18); }
.adm-bars__lbl{ font-family:var(--font-mono); font-size:9.5px; color:var(--text-faint); }
.adm-bars__col[data-peak="true"] .adm-bars__lbl{ color:var(--accent); }
.adm-bars__tip{ position:absolute; bottom:calc(100% + 6px); left:50%; transform:translateX(-50%); background:var(--surface-3); border:1px solid var(--border-default); color:var(--text-strong); font-family:var(--font-mono); font-size:10.5px; font-variant-numeric:tabular-nums; padding:3px 7px; border-radius:6px; white-space:nowrap; pointer-events:none; box-shadow:var(--shadow-md); z-index:2; }
.adm-bars__col:hover .adm-bars__tip{ opacity:1; }


/* Activity */
.adm-act{ display:flex; align-items:center; gap:12px; padding:11px 18px; border-bottom:1px solid var(--border-subtle); transition:background .12s; }
.adm-act:hover{ background:var(--surface-2); }
.adm-act:last-child{ border-bottom:0; }
.adm-act__txt{ flex:1; font-size:13px; color:var(--text-body); line-height:1.4; }
.adm-act__txt b{ color:var(--text-strong); font-weight:600; }
.adm-act__time{ font-family:var(--font-mono); font-size:11px; color:var(--text-faint); font-variant-numeric:tabular-nums; flex:none; }
.adm-panel__foot{ display:flex; align-items:center; justify-content:center; padding:11px; border-top:1px solid var(--border-subtle); }
.adm-panel__foot button{ border:0; background:transparent; color:var(--accent); font-family:var(--font-text); font-size:12.5px; font-weight:500; cursor:pointer; display:inline-flex; align-items:center; gap:5px; padding:4px 8px; border-radius:var(--radius-sm); transition:background .12s; }
.adm-panel__foot button:hover{ background:var(--accent-soft); }
.adm-panel__foot svg{ width:13px; height:13px; }

/* Table */
.adm-table{ width:100%; border-collapse:collapse; }
.adm-table th{ text-align:left; font-family:var(--font-mono); font-size:10.5px; letter-spacing:.08em; text-transform:uppercase; color:var(--text-faint); font-weight:500; padding:11px 18px; border-bottom:1px solid var(--border-subtle); white-space:nowrap; }
.adm-table td{ padding:12px 18px; border-bottom:1px solid var(--border-subtle); font-size:13px; vertical-align:middle; }
.adm-table tr:last-child td{ border-bottom:0; }
.adm-table tbody tr{ cursor:pointer; transition:background .12s; }
.adm-table tbody tr:hover{ background:var(--surface-2); }
.adm-table tbody tr:hover .adm-rowarrow{ opacity:1; transform:translateX(0); }
.adm-rowarrow{ opacity:0; transform:translateX(-4px); transition:opacity .14s, transform .14s; color:var(--text-faint); display:inline-flex; }
.adm-rowarrow svg{ width:14px; height:14px; }
.adm-uname{ display:flex; align-items:center; gap:11px; }
.adm-uname > div{ min-width:0; }
.adm-uname__n{ font-weight:600; color:var(--text-strong); line-height:1.2; white-space:nowrap; }
.adm-uname__e{ font-size:11.5px; color:var(--text-faint); white-space:nowrap; }
.adm-conn{ display:inline-flex; align-items:center; gap:6px; font-size:12px; color:var(--text-muted); }
.adm-conn svg{ width:15px; height:15px; }
.adm-mono{ font-family:var(--font-mono); font-size:12px; color:var(--text-muted); font-variant-numeric:tabular-nums; }

/* App cards */
.adm-apps{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.adm-app{ background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:18px; cursor:pointer; transition:border-color .16s, transform .16s; display:flex; flex-direction:column; gap:12px; }
.adm-app:hover{ border-color:var(--border-strong); transform:translateY(-2px); }
.adm-app__top{ display:flex; align-items:center; gap:11px; }
.adm-app__meta{ min-width:0; }
.adm-app__badge{ display:flex; }
.adm-app__logo{ width:40px; height:40px; border-radius:var(--radius-md); display:grid; place-items:center; font-family:var(--font-display); font-weight:700; font-size:16px; flex:none; }
.adm-app__name{ font-family:var(--font-display); font-weight:600; font-size:15px; color:var(--text-strong); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.adm-app__id{ font-family:var(--font-mono); font-size:11px; color:var(--text-faint); margin-top:2px; white-space:nowrap; font-variant-numeric:tabular-nums; }
.adm-app__foot{ display:flex; align-items:center; justify-content:space-between; padding-top:12px; border-top:1px solid var(--border-subtle); }
.adm-app__stat{ font-size:11.5px; color:var(--text-muted); } .adm-app__stat b{ color:var(--text-strong); font-family:var(--font-display); font-variant-numeric:tabular-nums; }
.adm-app__id{ font-variant-numeric:tabular-nums; }

/* Detail drawer */
.adm-drawer__scrim{ position:fixed; inset:0; background:var(--overlay-scrim); z-index:900; opacity:1; }
.adm-drawer{ position:fixed; top:0; right:0; bottom:0; width:440px; max-width:92vw; background:var(--surface-1); border-left:1px solid var(--border-default); box-shadow:var(--shadow-xl); z-index:901; display:flex; flex-direction:column; opacity:1; }
@media (prefers-reduced-motion: no-preference){
  .adm-drawer__scrim{ animation:idn-dlg-fade .2s ease; }
  .adm-drawer{ animation:adm-slide .26s cubic-bezier(.16,1,.3,1); }
}
@keyframes adm-slide{ from{ transform:translateX(28px); opacity:.4; } }
.adm-drawer__head{ padding:22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:flex-start; gap:14px; }
.adm-drawer__body{ padding:22px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:20px; }
.adm-field{ display:flex; flex-direction:column; gap:6px; }
.adm-field__k{ font-family:var(--font-mono); font-size:10.5px; letter-spacing:.06em; text-transform:uppercase; color:var(--text-faint); }
.adm-credrow{ display:flex; align-items:center; gap:8px; background:var(--surface-inset); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:9px 11px; }
.adm-credrow code{ font-family:var(--font-mono); font-size:12px; color:var(--text-body); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.adm-credrow button{ border:0; background:transparent; color:var(--text-faint); cursor:pointer; padding:3px; border-radius:4px; display:grid; place-items:center; }
.adm-credrow button:hover{ color:var(--text-strong); background:var(--surface-3); }
.adm-toggle-row{ display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border-subtle); }
.adm-toggle-row:last-child{ border-bottom:0; }
.adm-toggle-row__t{ font-size:13px; color:var(--text-strong); font-weight:500; }
.adm-toggle-row__d{ font-size:11.5px; color:var(--text-faint); margin-top:2px; max-width:30ch; }
.adm-tags{ display:flex; flex-wrap:wrap; gap:7px; }

@media (max-width:1080px){ .adm-stats{ grid-template-columns:repeat(2,1fr); } .adm-apps{ grid-template-columns:repeat(2,1fr); } .adm-grid2{ grid-template-columns:1fr; } }
@media (max-width:720px){ .adm{ grid-template-columns:1fr; } .adm-side{ display:none; } }
`;
{ let _s=document.getElementById('adm-css'); if(!_s){ _s=document.createElement('style'); _s.id='adm-css'; document.head.appendChild(_s); } _s.textContent=ADM_CSS; }

const NAV_MAIN = [
  { id:'overview', label:'Overview', icon:'overview' },
  { id:'users', label:'Users', icon:'users', badge:'2.4k' },
  { id:'apps', label:'Applications', icon:'apps', badge:'6' },
  { id:'policies', label:'Policies', icon:'policies' },
  { id:'connections', label:'Connections', icon:'connections' },
  { id:'logs', label:'Logs', icon:'logs' },
];
const NAV_LABEL = { overview:'Overview', users:'Users', apps:'Applications', policies:'Policies', connections:'Connections', logs:'Logs', settings:'Settings' };

function AppShell({ active, onNav, children }) {
  const { Avatar } = A;
  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-side__brand"><img src="../../assets/idnest-mark.svg" alt="" /> ID Nest</div>
        <div className="adm-tenant">
          <span className="adm-tenant__logo">A</span>
          <div>
            <div className="adm-tenant__name">Acme Inc</div>
            <div className="adm-tenant__env">production</div>
          </div>
          <AIc.chevDown />
        </div>
        <div className="adm-navlabel">Manage</div>
        {NAV_MAIN.map(n => {
          const I = AIc[n.icon];
          return (
            <button key={n.id} className="adm-nav" data-active={active === n.id} onClick={() => onNav(n.id)}>
              <I /><span>{n.label}</span>{n.badge && <span className="adm-nav__badge">{n.badge}</span>}
            </button>
          );
        })}
        <div className="adm-navlabel">Workspace</div>
        <button className="adm-nav" data-active={active === 'settings'} onClick={() => onNav('settings')}><AIc.settings /><span>Settings</span></button>
        <div className="adm-side__foot">
          <div className="adm-user">
            <Avatar name="Dana Reyes" size="sm" status="online" />
            <div>
              <div className="adm-user__name">Dana Reyes</div>
              <div className="adm-user__mail">dana@acme.com</div>
            </div>
            <AIc.logout />
          </div>
        </div>
      </aside>
      <div className="adm-main">
        <header className="adm-top">
          <nav className="adm-crumb">
            <span className="adm-crumb__home"><img src="../../assets/idnest-mark.svg" alt="" /> Acme</span>
            <AIc.chevRight />
            <b>{NAV_LABEL[active] || 'Overview'}</b>
          </nav>
          <div className="adm-top__right">
            <div className="adm-search">
              <AIc.search />
              <input placeholder="Search…" />
              <kbd>⌘K</kbd>
            </div>
            <div className="adm-top__sep" />
            <button className="adm-iconbtn"><AIc.bell /><span className="adm-iconbtn__dot" /></button>
            <button className="adm-iconbtn"><AIc.ext /></button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { AIc, AppShell, ADM: A });
