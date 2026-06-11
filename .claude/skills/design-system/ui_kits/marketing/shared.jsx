/* Shared chrome + helpers for the ID Nest marketing site.
   Exports to window for cross-file <script type="text/babel"> sharing. */

const { Button, Badge, CodeBlock, Tabs, Card, Avatar } = window.IDNestDesignSystem_c7f3f6;

const MARK = "../../assets/idnest-mark.svg";

/* ── Inline icons (stroke, 1.6, matches brand line work) ───────── */
const Ic = {
  shield: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg>,
  bolt: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z"/></svg>,
  key: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l2 2M14 9l2 2"/></svg>,
  users: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2A3.2 3.2 0 0 1 16 12M18 19a5.5 5.5 0 0 0-3-4.9"/></svg>,
  globe: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 5.7 3.5 9S14.5 18.5 12 21M12 3C9.5 5.5 8.5 8.7 8.5 12s1 6.5 3.5 9"/></svg>,
  layers: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l9 5-9 5-9-5 9-5Z"/><path d="M3 13l9 5 9-5"/></svg>,
  fingerprint: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M5 11a7 7 0 0 1 14 0M8 21c-.6-1.5-1-3.2-1-5a5 5 0 0 1 10 0c0 .8 0 1.6-.2 2.4M12 11v5c0 1.4.2 2.8.6 4M9.5 20.5A14 14 0 0 1 9 16"/></svg>,
  arrow: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 8h9M8.5 4l4 4-4 4"/></svg>,
  check: (p) => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 8.5l3.2 3.2L13 5"/></svg>,
  github: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.4 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 3.9-1.3 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2Z"/></svg>,
};

/* Marketing-only chrome styles */
const MKT_CSS = `
.mkt{ background:var(--bg-base); color:var(--text-body); min-height:100%; }
.mkt-wrap{ max-width:1120px; margin:0 auto; padding:0 28px; }
.mkt a{ color:inherit; }

/* Nav */
.mkt-nav{ position:sticky; top:0; z-index:30; backdrop-filter:blur(14px);
  background:color-mix(in srgb, var(--bg-base) 78%, transparent); border-bottom:1px solid var(--border-subtle); }
.mkt-nav__in{ height:64px; display:flex; align-items:center; gap:28px; }
.mkt-brand{ display:flex; align-items:center; gap:10px; font-family:var(--font-display); font-weight:700;
  font-size:19px; color:var(--text-strong); letter-spacing:-.02em; white-space:nowrap; }
.mkt-brand img{ width:28px; height:28px; flex:none; }
.mkt-nav__links{ display:flex; gap:4px; margin-left:8px; }
.mkt-nav__links a{ padding:8px 12px; border-radius:var(--radius-sm); font-size:var(--fs-body-sm); font-weight:500;
  color:var(--text-muted); transition:color .14s, background .14s; }
.mkt-nav__links a:hover{ color:var(--text-strong); background:var(--surface-2); }
.mkt-nav__right{ margin-left:auto; display:flex; align-items:center; gap:10px; }

/* Section scaffolding */
.mkt-section{ padding:96px 0; }
.mkt-eyebrow{ font-family:var(--font-mono); font-size:var(--fs-micro); letter-spacing:.16em; text-transform:uppercase;
  color:var(--accent); display:inline-flex; align-items:center; gap:8px; }
.mkt-h2{ font-family:var(--font-display); font-weight:700; font-size:40px; letter-spacing:-.03em; line-height:1.08;
  color:var(--text-strong); margin:16px 0 0; }
.mkt-lead{ font-size:var(--fs-body-lg); color:var(--text-muted); margin-top:14px; max-width:54ch; line-height:1.6; }

/* Hero */
.mkt-hero{ position:relative; padding:84px 0 72px; overflow:hidden; }
.mkt-hero__grid{ display:grid; grid-template-columns:1.05fr .95fr; gap:48px; align-items:center; }
.mkt-hero h1{ font-family:var(--font-display); font-weight:700; font-size:60px; line-height:1.02; letter-spacing:-.035em;
  color:var(--text-strong); margin:20px 0 0; }
.mkt-hero h1 em{ font-style:normal; color:var(--accent); }
.mkt-hero__sub{ font-size:19px; color:var(--text-muted); margin-top:20px; max-width:46ch; line-height:1.55; }
.mkt-hero__cta{ display:flex; gap:12px; margin-top:30px; flex-wrap:wrap; }
.mkt-hero__meta{ display:flex; gap:20px; margin-top:26px; flex-wrap:wrap; }
.mkt-hero__meta span{ display:inline-flex; align-items:center; gap:7px; font-size:13px; color:var(--text-faint); }
.mkt-hero__meta svg{ width:15px; height:15px; color:var(--success); }
.mkt-glow{ position:absolute; width:620px; height:620px; right:-160px; top:-220px; border-radius:50%;
  background:radial-gradient(circle, rgba(217,87,46,.20), transparent 62%); filter:blur(20px); pointer-events:none; }

/* Trust strip */
.mkt-trust{ border-top:1px solid var(--border-subtle); border-bottom:1px solid var(--border-subtle); padding:26px 0; }
.mkt-trust__row{ display:flex; align-items:center; gap:38px; flex-wrap:wrap; justify-content:center; opacity:.62; }
.mkt-trust__label{ font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-faint); }
.mkt-logo{ font-family:var(--font-display); font-weight:700; font-size:18px; letter-spacing:-.01em; color:var(--text-muted); }

/* Feature grid */
.mkt-feat{ display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-top:48px; }
.mkt-fcard{ background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-xl);
  padding:24px; transition:border-color .18s, transform .18s; }
.mkt-fcard:hover{ border-color:var(--border-strong); transform:translateY(-3px); }
.mkt-fcard__ic{ width:42px; height:42px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center;
  background:var(--accent-soft); color:var(--accent); margin-bottom:16px; }
.mkt-fcard__ic svg{ width:21px; height:21px; }
.mkt-fcard h3{ font-family:var(--font-display); font-size:18px; color:var(--text-strong); margin:0 0 7px; }
.mkt-fcard p{ font-size:var(--fs-body-sm); color:var(--text-muted); line-height:1.55; margin:0; }

/* Integrate split */
.mkt-split{ display:grid; grid-template-columns:1fr 1.1fr; gap:56px; align-items:center; }
.mkt-checklist{ list-style:none; padding:0; margin:26px 0 0; display:flex; flex-direction:column; gap:14px; }
.mkt-checklist li{ display:flex; gap:11px; font-size:var(--fs-body); color:var(--text-body); }
.mkt-checklist li b{ color:var(--text-strong); font-weight:600; }
.mkt-checklist .ck{ flex:none; width:20px; height:20px; border-radius:50%; background:var(--success-soft); color:var(--success);
  display:flex; align-items:center; justify-content:center; margin-top:1px; }
.mkt-checklist .ck svg{ width:12px; height:12px; }

/* CTA band */
.mkt-cta{ background:linear-gradient(180deg, var(--surface-1), var(--bg-sunken)); border:1px solid var(--border-default);
  border-radius:var(--radius-2xl); padding:56px; text-align:center; position:relative; overflow:hidden; }
.mkt-cta h2{ font-family:var(--font-display); font-weight:700; font-size:38px; letter-spacing:-.03em; color:var(--text-strong); margin:0; }
.mkt-cta p{ color:var(--text-muted); font-size:var(--fs-body-lg); margin:14px 0 28px; }
.mkt-cta__row{ display:flex; gap:12px; justify-content:center; }

/* Footer */
.mkt-footer{ border-top:1px solid var(--border-subtle); padding:56px 0 40px; }
.mkt-footer__grid{ display:grid; grid-template-columns:1.6fr 1fr 1fr 1fr; gap:32px; }
.mkt-footer h4{ font-family:var(--font-mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--text-faint); margin:0 0 14px; }
.mkt-footer ul{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
.mkt-footer ul a{ font-size:var(--fs-body-sm); color:var(--text-muted); }
.mkt-footer ul a:hover{ color:var(--text-strong); }
.mkt-footer__bottom{ display:flex; align-items:center; justify-content:space-between; margin-top:44px;
  padding-top:24px; border-top:1px solid var(--border-subtle); font-size:13px; color:var(--text-faint); }
.mkt-footer__social{ display:flex; gap:14px; }
.mkt-footer__social a svg{ width:18px; height:18px; color:var(--text-muted); }
.mkt-footer__social a:hover svg{ color:var(--text-strong); }

@media (max-width:880px){
  .mkt-hero__grid,.mkt-split{ grid-template-columns:1fr; }
  .mkt-feat{ grid-template-columns:1fr; }
  .mkt-footer__grid{ grid-template-columns:1fr 1fr; }
  .mkt-nav__links{ display:none; }
  .mkt-hero h1{ font-size:44px; }
}
`;
if (!document.getElementById('mkt-css')) {
  const s = document.createElement('style'); s.id = 'mkt-css'; s.textContent = MKT_CSS; document.head.appendChild(s);
}

Object.assign(window, { Ic, MARK, mktUI: { Button, Badge, CodeBlock, Tabs, Card, Avatar } });
