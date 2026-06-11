/* ID Nest marketing — page sections. Composes DS components + shared chrome. */

const { Button, Badge, CodeBlock, Tabs } = window.mktUI;
const Ic = window.Ic, MARK = window.MARK;

function Nav() {
  return (
    <nav className="mkt-nav">
      <div className="mkt-wrap mkt-nav__in">
        <a className="mkt-brand" href="#"><img src={MARK} alt="" /> ID Nest</a>
        <div className="mkt-nav__links">
          <a href="#features">Product</a>
          <a href="#developers">Developers</a>
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
          <a href="#">Company</a>
        </div>
        <div className="mkt-nav__right">
          <Button variant="ghost" size="sm">Sign in</Button>
          <Button variant="primary" size="sm" iconRight={<Ic.arrow />}>Start free</Button>
        </div>
      </div>
    </nav>
  );
}

const HERO_SNIPPETS = {
  Node: (
    <code>
<span className="tc">{"// Add ID Nest in three lines"}</span>{"\n"}
<span className="tk">import</span>{" { IDNest } "}<span className="tk">from</span> <span className="ts">"@idnest/sdk"</span>{"\n\n"}
<span className="tk">const</span>{" nest = "}<span className="tf">IDNest</span>{"({ domain: "}<span className="ts">"acme.idnest.app"</span>{" })\n\n"}
<span className="tk">await</span>{" nest."}<span className="tf">login</span>{"({ scope: "}<span className="ts">"openid profile"</span>{" })"}
    </code>
  ),
  cURL: (
    <code>
<span className="tc">{"# Exchange the code for tokens"}</span>{"\n"}
<span className="tk">curl</span>{" -X POST https://acme.idnest.app/oauth/token \\\n"}
{"  -d grant_type="}<span className="ts">authorization_code</span>{" \\\n"}
{"  -d code="}<span className="tn">$CODE</span>{" \\\n"}
{"  -d client_id="}<span className="tn">$CLIENT_ID</span>
    </code>
  ),
  Python: (
    <code>
<span className="tk">from</span>{" idnest "}<span className="tk">import</span>{" IDNest\n\n"}
{"nest = "}<span className="tf">IDNest</span>{"(domain="}<span className="ts">"acme.idnest.app"</span>{")\n"}
{"user = nest."}<span className="tf">verify</span>{"(request.cookies["}<span className="ts">"session"</span>{"])\n\n"}
<span className="tk">print</span>{"(user.email)  "}<span className="tc"># dana@acme.com</span>
    </code>
  ),
};

function Hero() {
  const [lang, setLang] = React.useState('Node');
  return (
    <header className="mkt-hero">
      <div className="mkt-glow" />
      <div className="mkt-wrap mkt-hero__grid">
        <div>
          <span className="mkt-eyebrow"><Ic.fingerprint style={{ width: 14, height: 14 }} /> OIDC · OAuth 2.1 · SAML</span>
          <h1>Identity that gets<br /><em>out of your way.</em></h1>
          <p className="mkt-hero__sub">
            Drop-in authentication for the apps you actually ship. Standards-based,
            developer-first, and warm enough to put your name on. The friendly alternative to enterprise IdPs.
          </p>
          <div className="mkt-hero__cta">
            <Button variant="primary" size="lg" iconRight={<Ic.arrow />}>Start building free</Button>
            <Button variant="secondary" size="lg" mono iconLeft={<Ic.github />}>star on github</Button>
          </div>
          <div className="mkt-hero__meta">
            <span><Ic.check /> No credit card</span>
            <span><Ic.check /> 10k MAU free</span>
            <span><Ic.check /> SOC 2 Type II</span>
          </div>
        </div>
        <div>
          <div style={{ marginBottom: 10 }}>
            <Tabs variant="pill" tabs={['Node', 'cURL', 'Python']} value={lang} onChange={setLang} />
          </div>
          <CodeBlock title={lang === 'cURL' ? 'token-exchange.sh' : `quickstart.${lang === 'Python' ? 'py' : 'ts'}`} language={lang}>
            {HERO_SNIPPETS[lang]}
          </CodeBlock>
        </div>
      </div>
    </header>
  );
}

function Trust() {
  const logos = ['Northwind', 'Verdant', 'Loophole', 'Atlas Pay', 'Cabin', 'Mercato'];
  return (
    <section className="mkt-trust">
      <div className="mkt-wrap mkt-trust__row">
        <span className="mkt-trust__label">Trusted by teams at</span>
        {logos.map(l => <span key={l} className="mkt-logo">{l}</span>)}
      </div>
    </section>
  );
}

const FEATURES = [
  { ic: 'bolt', t: 'Live in an afternoon', d: 'Universal Login, SDKs for every stack, and copy-paste snippets. Most teams ship auth the same day they sign up.' },
  { ic: 'shield', t: 'Secure by default', d: 'PKCE, rotating refresh tokens, and short-lived JWTs out of the box. We pass the audit so you don’t sweat it.' },
  { ic: 'key', t: 'Every standard you need', d: 'OIDC, OAuth 2.1, SAML, and SCIM. Social, passkeys, magic links, and enterprise SSO from one tenant.' },
  { ic: 'users', t: 'Org-aware from day one', d: 'Multi-tenant orgs, roles, and fine-grained permissions modeled natively—not bolted on after the fact.' },
  { ic: 'globe', t: 'Global, low-latency', d: 'Token verification at the edge in 14 regions. p99 under 40ms wherever your users sign in.' },
  { ic: 'layers', t: 'Yours to brand', d: 'Theme the hosted login to match your product. Your colors, your domain, your logo—not ours.' },
];

function Features() {
  return (
    <section className="mkt-section" id="features">
      <div className="mkt-wrap">
        <span className="mkt-eyebrow">Why ID Nest</span>
        <h2 className="mkt-h2">A full identity platform,<br />without the enterprise tax.</h2>
        <p className="mkt-lead">Everything you need to authenticate, authorize, and manage users—wrapped in an API you’ll actually enjoy.</p>
        <div className="mkt-feat">
          {FEATURES.map(f => {
            const I = Ic[f.ic];
            return (
              <article key={f.t} className="mkt-fcard">
                <div className="mkt-fcard__ic"><I /></div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Integrate() {
  return (
    <section className="mkt-section" id="developers" style={{ background: 'var(--bg-sunken)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="mkt-wrap mkt-split">
        <div>
          <span className="mkt-eyebrow">Built for developers</span>
          <h2 className="mkt-h2">Auth you can read<br />in one sitting.</h2>
          <p className="mkt-lead" style={{ marginTop: 14 }}>Honest docs, predictable APIs, and SDKs that feel native to your framework. No magic, no lock-in.</p>
          <ul className="mkt-checklist">
            <li><span className="ck"><Ic.check /></span><div><b>Typed SDKs</b> for Node, React, Python, Go, and Rust—generated from one spec.</div></li>
            <li><span className="ck"><Ic.check /></span><div><b>Local-first dev</b> with a real test tenant and seedable users.</div></li>
            <li><span className="ck"><Ic.check /></span><div><b>Webhooks &amp; logs</b> you can actually grep. Stream every auth event.</div></li>
          </ul>
          <div style={{ marginTop: 28 }}>
            <Button variant="secondary" iconRight={<Ic.arrow />}>Read the docs</Button>
          </div>
        </div>
        <div>
          <CodeBlock terminal title="~/acme-app" showDots>
            <code>
<span className="idn-code__prompt">$ </span>npm i @idnest/sdk{"\n"}
<span className="tc">added 1 package in 0.8s</span>{"\n\n"}
<span className="idn-code__prompt">$ </span>idnest dev --tenant acme{"\n"}
<span className="idn-code__ok">{"✔"}</span> tenant acme.idnest.app ready{"\n"}
<span className="idn-code__ok">{"✔"}</span> 3 test users seeded{"\n"}
<span className="idn-code__ok">{"✔"}</span> listening on :4000  <span className="tc">→ try /login</span>{"\n\n"}
<span className="idn-code__prompt">$ </span>curl localhost:4000/userinfo{"\n"}
{"{ "}<span className="tk">"sub"</span>{": "}<span className="ts">"usr_a91f"</span>{", "}<span className="tk">"email"</span>{": "}<span className="ts">"dana@acme.com"</span>{" }"}
            </code>
          </CodeBlock>
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="mkt-section">
      <div className="mkt-wrap">
        <div className="mkt-cta">
          <div className="mkt-glow" style={{ left: '50%', top: '-260px', right: 'auto', transform: 'translateX(-50%)' }} />
          <span className="mkt-eyebrow" style={{ position: 'relative' }}>Ready when you are</span>
          <h2 style={{ marginTop: 14, position: 'relative' }}>Give your users a warm welcome.</h2>
          <p style={{ position: 'relative' }}>Free up to 10,000 monthly active users. Upgrade only when you grow.</p>
          <div className="mkt-cta__row" style={{ position: 'relative' }}>
            <Button variant="primary" size="lg" iconRight={<Ic.arrow />}>Create free account</Button>
            <Button variant="ghost" size="lg">Talk to us</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { h: 'Product', items: ['Universal Login', 'Authorization', 'Organizations', 'Passkeys', 'Pricing'] },
    { h: 'Developers', items: ['Documentation', 'API Reference', 'SDKs', 'Changelog', 'Status'] },
    { h: 'Company', items: ['About', 'Blog', 'Careers', 'Security', 'Contact'] },
  ];
  return (
    <footer className="mkt-footer">
      <div className="mkt-wrap">
        <div className="mkt-footer__grid">
          <div>
            <a className="mkt-brand" href="#" style={{ fontSize: 18 }}><img src={MARK} alt="" style={{ width: 26, height: 26 }} /> ID Nest</a>
            <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginTop: 14, maxWidth: '30ch', lineHeight: 1.55 }}>
              Identity infrastructure for builders. Standards-based auth that feels like home.
            </p>
          </div>
          {cols.map(c => (
            <div key={c.h}>
              <h4>{c.h}</h4>
              <ul>{c.items.map(i => <li key={i}><a href="#">{i}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mkt-footer__bottom">
          <span>{"\u00A9"} 2026 ID Nest, Inc. \u00b7 SOC 2 Type II \u00b7 GDPR</span>
          <div className="mkt-footer__social">
            <a href="#" aria-label="GitHub"><Ic.github /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MarketingPage() {
  return (
    <div className="mkt">
      <Nav />
      <Hero />
      <Trust />
      <Features />
      <Integrate />
      <CtaBand />
      <Footer />
    </div>
  );
}

Object.assign(window, { MarketingPage });
