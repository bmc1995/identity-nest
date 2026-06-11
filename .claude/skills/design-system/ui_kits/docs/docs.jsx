/* ID Nest — Developer docs. Three-pane docs layout with live nav,
   language tabs, callouts, and the warm code blocks. */

const { Button, Badge, Tabs, CodeBlock } = window.IDNestDesignSystem_c7f3f6;

const DIc = {
  search:(p)=><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="8" cy="8" r="5"/><path d="M11.6 11.6L15.5 15.5"/></svg>,
  book:(p)=><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 4.5C7.5 3.2 5 3 3 3.3v10C5 13 7.5 13.2 9 14.5M9 4.5c1.5-1.3 4-1.5 6-1.2v10c-2-.3-4.5-.1-6 1.2M9 4.5v10"/></svg>,
  bolt:(p)=><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 2L4 10h5l-1 6 6-8H9l1-6Z"/></svg>,
  key:(p)=><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="6" cy="12" r="3"/><path d="M8 10l6-6M12 4l2 2M10 6l2 2"/></svg>,
  code:(p)=><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 5L2.5 9 6 13M12 5l3.5 4L12 13"/></svg>,
  info:(p)=><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="9" cy="9" r="7"/><path d="M9 8v5M9 5.5h.01"/></svg>,
  arrow:(p)=><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 8h9M8.5 4l4 4-4 4"/></svg>,
};

const NAV = [
  { group:'Getting started', icon:'bolt', items:[
    { id:'intro', label:'Introduction' },
    { id:'quickstart', label:'Quickstart' },
    { id:'sdks', label:'SDKs' },
  ]},
  { group:'Authentication', icon:'key', items:[
    { id:'universal', label:'Universal Login' },
    { id:'social', label:'Social connections' },
    { id:'mfa', label:'Multi-factor auth' },
  ]},
  { group:'API reference', icon:'code', items:[
    { id:'authorize', label:'GET /authorize' },
    { id:'token', label:'POST /token' },
    { id:'userinfo', label:'GET /userinfo' },
  ]},
];

const DOCS_CSS = `
.dx{ display:grid; grid-template-columns:248px 1fr; min-height:100vh; background:var(--bg-base); color:var(--text-body); }
.dx-top{ grid-column:1 / -1; height:58px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:20px; padding:0 22px; position:sticky; top:0; background:color-mix(in srgb, var(--bg-base) 85%, transparent); backdrop-filter:blur(12px); z-index:30; }
.dx-brand{ display:flex; align-items:center; gap:9px; font-family:var(--font-display); font-weight:700; font-size:16px; color:var(--text-strong); letter-spacing:-.02em; white-space:nowrap; }
.dx-brand img{ width:24px; height:24px; flex:none; }
.dx-brand .docs{ font-family:var(--font-mono); font-weight:500; font-size:12px; color:var(--text-faint); padding-left:9px; margin-left:3px; border-left:1px solid var(--border-default); }
.dx-search{ display:flex; align-items:center; gap:8px; height:34px; padding:0 11px; border-radius:var(--radius-md); background:var(--surface-inset); border:1px solid var(--border-default); width:260px; color:var(--text-faint); font-size:13px; white-space:nowrap; }
.dx-search kbd{ margin-left:auto; font-family:var(--font-mono); font-size:10px; padding:2px 5px; border-radius:4px; background:var(--surface-3); color:var(--text-faint); }
.dx-search svg{ width:15px; height:15px; flex:none; }
.dx-top__right{ margin-left:auto; display:flex; align-items:center; gap:10px; }
.dx-ver{ font-family:var(--font-mono); font-size:11px; color:var(--text-muted); padding:4px 9px; border:1px solid var(--border-default); border-radius:var(--radius-pill); }

/* Left nav */
.dx-side{ border-right:1px solid var(--border-subtle); padding:24px 14px; position:sticky; top:58px; height:calc(100vh - 58px); overflow-y:auto; }
.dx-navgroup{ margin-bottom:22px; }
.dx-navgroup__h{ display:flex; align-items:center; gap:8px; font-family:var(--font-mono); font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--text-faint); padding:0 10px 8px; }
.dx-navgroup__h svg{ width:14px; height:14px; }
.dx-navitem{ display:block; width:100%; text-align:left; border:0; background:transparent; cursor:pointer; font-family:var(--font-text); font-size:13.5px; color:var(--text-muted); padding:7px 10px; border-radius:var(--radius-sm); transition:color .14s, background .14s; }
.dx-navitem:hover{ color:var(--text-strong); background:var(--surface-2); }
.dx-navitem[data-active="true"]{ color:var(--accent); background:var(--accent-soft); font-weight:500; }

/* Article */
.dx-main{ min-width:0; display:grid; grid-template-columns:1fr 200px; }
.dx-article{ padding:40px 48px; max-width:760px; }
.dx-eyebrow{ font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); }
.dx-article h1{ font-family:var(--font-display); font-weight:700; font-size:36px; letter-spacing:-.03em; color:var(--text-strong); margin:12px 0 0; line-height:1.1; }
.dx-lead{ font-size:17px; color:var(--text-muted); line-height:1.6; margin:16px 0 0; }
.dx-article h2{ font-family:var(--font-display); font-weight:700; font-size:22px; letter-spacing:-.02em; color:var(--text-strong); margin:40px 0 0; scroll-margin-top:70px; }
.dx-article p{ font-size:15px; line-height:1.7; color:var(--text-body); margin:14px 0 0; }
.dx-article p code, .dx-article li code{ font-family:var(--font-mono); font-size:13px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:5px; padding:1px 6px; color:var(--accent-2); }
.dx-article ul{ margin:14px 0 0; padding-left:20px; }
.dx-article li{ font-size:15px; line-height:1.7; color:var(--text-body); margin:5px 0; }
.dx-cb{ margin-top:20px; }
.dx-tabs{ margin-top:24px; }
.dx-callout{ display:flex; gap:12px; padding:14px 16px; margin-top:24px; border-radius:var(--radius-lg); background:var(--info-soft); border:1px solid color-mix(in srgb, var(--info) 30%, transparent); }
.dx-callout__ic{ flex:none; color:var(--info); margin-top:1px; }
.dx-callout__t{ font-size:13.5px; line-height:1.55; color:var(--text-body); }
.dx-callout__t b{ color:var(--text-strong); }
.dx-next{ display:flex; gap:14px; margin-top:40px; padding-top:24px; border-top:1px solid var(--border-subtle); }
.dx-nextcard{ flex:1; border:1px solid var(--border-default); border-radius:var(--radius-lg); padding:16px; cursor:pointer; transition:border-color .15s; }
.dx-nextcard:hover{ border-color:var(--border-strong); }
.dx-nextcard__k{ font-size:11px; color:var(--text-faint); font-family:var(--font-mono); letter-spacing:.06em; text-transform:uppercase; }
.dx-nextcard__t{ display:flex; align-items:center; justify-content:space-between; font-family:var(--font-display); font-weight:600; font-size:15px; color:var(--text-strong); margin-top:5px; }
.dx-nextcard__t svg{ width:15px; height:15px; color:var(--accent); }
.dx-endpoint{ display:flex; align-items:center; gap:10px; margin-top:20px; padding:11px 14px; background:var(--surface-inset); border:1px solid var(--border-default); border-radius:var(--radius-md); font-family:var(--font-mono); font-size:13px; }
.dx-method{ font-weight:700; color:var(--success); }

/* Right TOC */
.dx-toc{ padding:40px 20px; position:sticky; top:58px; height:calc(100vh - 58px); border-left:1px solid var(--border-subtle); }
.dx-toc__h{ font-family:var(--font-mono); font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--text-faint); margin-bottom:12px; }
.dx-toc a{ display:block; font-size:12.5px; color:var(--text-muted); padding:5px 0; cursor:pointer; border-left:2px solid transparent; padding-left:12px; margin-left:-2px; }
.dx-toc a:hover{ color:var(--text-strong); }
.dx-toc a[data-active="true"]{ color:var(--accent); border-left-color:var(--accent); }

@media (max-width:1080px){ .dx-main{ grid-template-columns:1fr; } .dx-toc{ display:none; } }
@media (max-width:760px){ .dx{ grid-template-columns:1fr; } .dx-side{ display:none; } .dx-article{ padding:28px 22px; } }
`;
if (!document.getElementById('dx-css')) { const s=document.createElement('style'); s.id='dx-css'; s.textContent=DOCS_CSS; document.head.appendChild(s); }

const QS_SNIPPETS = {
  Node:<code><span className="tc">{"// pages/api/auth.ts"}</span>{"\n"}<span className="tk">import</span>{" { IDNest } "}<span className="tk">from</span> <span className="ts">"@idnest/sdk"</span>{"\n\n"}<span className="tk">export const</span>{" nest = "}<span className="tf">IDNest</span>{"({\n"}{"  domain: "}<span className="ts">"acme.idnest.app"</span>{",\n"}{"  clientId: "}<span className="tn">process.env.IDNEST_CLIENT_ID</span>{",\n"}{"})"}</code>,
  React:<code><span className="tk">import</span>{" { IDNestProvider, useUser } "}<span className="tk">from</span> <span className="ts">"@idnest/react"</span>{"\n\n"}<span className="tk">function</span> <span className="tf">App</span>{"() {\n"}{"  "}<span className="tk">const</span>{" { user } = "}<span className="tf">useUser</span>{"()\n"}{"  "}<span className="tk">return</span>{" <"}<span className="tf">h1</span>{">Hi {user?.name}</"}<span className="tf">h1</span>{">\n}"}</code>,
  Python:<code><span className="tk">from</span>{" idnest "}<span className="tk">import</span>{" IDNest\n\n"}{"nest = "}<span className="tf">IDNest</span>{"(\n"}{"    domain="}<span className="ts">"acme.idnest.app"</span>{",\n"}{"    client_id=os.environ["}<span className="ts">"IDNEST_CLIENT_ID"</span>{"],\n)"}</code>,
};

function Article({ id }) {
  if (id === 'quickstart' || id === 'intro' || !['authorize','token','userinfo'].includes(id)) {
    const [lang, setLang] = React.useState('Node');
    return (
      <article className="dx-article">
        <span className="dx-eyebrow">Getting started</span>
        <h1>Quickstart</h1>
        <p className="dx-lead">Add ID Nest to your app and authenticate your first user in under five minutes. Pick your stack and copy the snippet—no boilerplate, no ceremony.</p>

        <h2 id="install">Install the SDK</h2>
        <p>Grab the package for your framework. Everything is typed and tree-shakeable.</p>
        <div className="dx-cb">
          <CodeBlock terminal title="terminal">
            <code><span className="idn-code__prompt">$ </span>npm install @idnest/sdk{"\n"}<span className="tc">added 1 package in 0.8s</span></code>
          </CodeBlock>
        </div>

        <h2 id="configure">Configure your client</h2>
        <p>Create a client with your tenant <code>domain</code> and <code>clientId</code>. You’ll find both in the <b style={{color:'var(--text-strong)'}}>Console → Applications</b> view.</p>
        <div className="dx-tabs">
          <Tabs variant="pill" tabs={['Node','React','Python']} value={lang} onChange={setLang} />
          <div style={{ marginTop:10 }}>
            <CodeBlock title={lang==='Python'?'auth.py':'auth.ts'} language={lang}>{QS_SNIPPETS[lang]}</CodeBlock>
          </div>
        </div>

        <div className="dx-callout">
          <span className="dx-callout__ic"><DIc.info /></span>
          <span className="dx-callout__t"><b>Keep secrets server-side.</b> For SPAs and native apps, use PKCE—never ship a client secret to the browser. ID Nest enables PKCE by default for public clients.</span>
        </div>

        <h2 id="login">Trigger a login</h2>
        <p>Redirect the user to the hosted Universal Login. After they authenticate, they’ll return to your <code>redirect_uri</code> with an authorization code.</p>
        <div className="dx-cb">
          <CodeBlock title="login.ts" language="ts">
            <code><span className="tk">await</span>{" nest."}<span className="tf">login</span>{"({\n"}{"  scope: "}<span className="ts">"openid profile email"</span>{",\n"}{"  redirectUri: "}<span className="ts">"https://acme.com/callback"</span>{",\n"}{"})"}</code>
          </CodeBlock>
        </div>

        <div className="dx-next">
          <div className="dx-nextcard"><div className="dx-nextcard__k">Next</div><div className="dx-nextcard__t">Social connections <DIc.arrow /></div></div>
          <div className="dx-nextcard"><div className="dx-nextcard__k">Reference</div><div className="dx-nextcard__t">POST /token <DIc.arrow /></div></div>
        </div>
      </article>
    );
  }
  // API reference page
  const meta = {
    authorize:{ method:'GET', path:'/authorize', desc:'Start an authorization flow. Redirects the user to Universal Login.' },
    token:{ method:'POST', path:'/oauth/token', desc:'Exchange an authorization code (or refresh token) for tokens.' },
    userinfo:{ method:'GET', path:'/userinfo', desc:'Return claims about the authenticated user for a valid access token.' },
  }[id];
  return (
    <article className="dx-article">
      <span className="dx-eyebrow">API reference</span>
      <h1>{meta.path}</h1>
      <p className="dx-lead">{meta.desc}</p>
      <div className="dx-endpoint"><span className="dx-method">{meta.method}</span><span style={{color:'var(--text-muted)'}}>https://acme.idnest.app{meta.path}</span></div>
      <h2 id="request">Example request</h2>
      <div className="dx-cb">
        <CodeBlock terminal title="curl">
          <code><span className="idn-code__prompt">$ </span>curl -X {meta.method} https://acme.idnest.app{meta.path} \\{"\n"}{"  -H "}<span className="ts">"Authorization: Bearer $ACCESS_TOKEN"</span></code>
        </CodeBlock>
      </div>
      <h2 id="response">Response</h2>
      <div className="dx-cb">
        <CodeBlock title="200 OK" language="json">
          <code>{"{\n"}{"  "}<span className="tk">"sub"</span>{": "}<span className="ts">"usr_a91f3c7e"</span>{",\n"}{"  "}<span className="tk">"email"</span>{": "}<span className="ts">"dana@acme.com"</span>{",\n"}{"  "}<span className="tk">"email_verified"</span>{": "}<span className="tn">true</span>{",\n"}{"  "}<span className="tk">"name"</span>{": "}<span className="ts">"Dana Reyes"</span>{"\n}"}</code>
        </CodeBlock>
      </div>
    </article>
  );
}

function DocsApp() {
  const [active, setActive] = React.useState('quickstart');
  const toc = ['authorize','token','userinfo'].includes(active)
    ? [['request','Example request'],['response','Response']]
    : [['install','Install the SDK'],['configure','Configure your client'],['login','Trigger a login']];
  return (
    <div className="dx">
      <header className="dx-top">
        <div className="dx-brand"><img src="../../assets/idnest-mark.svg" alt="" /> ID Nest <span className="docs">Docs</span></div>
        <div className="dx-search"><DIc.search /> Search docs… <kbd>/</kbd></div>
        <div className="dx-top__right">
          <span className="dx-ver">v2.4</span>
          <Button variant="secondary" size="sm">Console</Button>
          <Button variant="primary" size="sm">Sign up</Button>
        </div>
      </header>
      <aside className="dx-side">
        {NAV.map(g => {
          const I = DIc[g.icon];
          return (
            <div key={g.group} className="dx-navgroup">
              <div className="dx-navgroup__h"><I /> {g.group}</div>
              {g.items.map(it => (
                <button key={it.id} className="dx-navitem" data-active={active===it.id} onClick={()=>setActive(it.id)}>{it.label}</button>
              ))}
            </div>
          );
        })}
      </aside>
      <div className="dx-main">
        <Article id={active} key={active} />
        <aside className="dx-toc">
          <div className="dx-toc__h">On this page</div>
          {toc.map((t,i)=><a key={t[0]} data-active={i===0}>{t[1]}</a>)}
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { DocsApp });
