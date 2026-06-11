/* ID Nest — Hosted login (Universal Login). Brandable auth flow:
   sign in → MFA → consent → success. Single self-contained kit. */

const { Button, Input, Checkbox, Badge, Avatar } = window.IDNestDesignSystem_c7f3f6;

const LIc = {
  google: (p)=><svg viewBox="0 0 18 18" {...p}><path fill="#EA4335" d="M9 7.4v3.3h4.6A4 4 0 0 1 9 13.5 4.5 4.5 0 1 1 12 5.6l2.4-2.3A8 8 0 1 0 17 9c0-.5 0-.9-.1-1.6Z"/><path fill="#34A853" d="M9 17a8 8 0 0 0 5.5-2.1l-2.6-2A4.6 4.6 0 0 1 9 13.5Z" opacity=".9"/></svg>,
  github: (p)=><svg viewBox="0 0 18 18" fill="currentColor" {...p}><path d="M9 1.5a7.5 7.5 0 0 0-2.4 14.6c.4 0 .5-.2.5-.4v-1.3c-2 .4-2.5-.9-2.5-.9-.4-.9-.9-1.1-.9-1.1-.7-.5 0-.5 0-.5.7 0 1.1.8 1.1.8.7 1.1 1.8.8 2.2.6 0-.5.3-.8.5-1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.5.8-2 0-.2-.4-1 .1-2 0 0 .6-.2 2 .8a7 7 0 0 1 3.6 0c1.4-1 2-.8 2-.8.5 1 .1 1.8.1 2 .5.5.8 1.2.8 2 0 2.8-1.7 3.4-3.3 3.6.3.2.5.7.5 1.4v2c0 .2.1.5.5.4A7.5 7.5 0 0 0 9 1.5Z"/></svg>,
  mail: (p)=><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2.5" y="3.5" width="13" height="11" rx="2"/><path d="M3 5l6 4.5L15 5"/></svg>,
  lock: (p)=><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3.5" y="8" width="11" height="7.5" rx="2"/><path d="M6 8V6a3 3 0 0 1 6 0v2"/></svg>,
  shield: (p)=><svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 2.5l6.5 2.6v4.6c0 4-2.7 7.4-6.5 9-3.8-1.6-6.5-5-6.5-9V5.1L11 2.5Z"/><path d="M8 11l2 2 4-4.2"/></svg>,
  check: (p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.5l4.5 4.5L19 7"/></svg>,
  back: (p)=><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9.5 3.5L5 8l4.5 4.5"/></svg>,
  user: (p)=><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="6" r="3"/><path d="M3.5 15.5a5.5 5.5 0 0 1 11 0"/></svg>,
};

const LOGIN_CSS = `
.lg{ min-height:100vh; display:grid; place-items:center; padding:32px 20px; position:relative; overflow:hidden;
  background:radial-gradient(900px 500px at 50% -10%, rgba(217,87,46,.16), transparent 60%), var(--bg-sunken); }
.lg__noise{ position:absolute; inset:0; opacity:.5; pointer-events:none;
  background-image:radial-gradient(rgba(244,227,208,.025) 1px, transparent 1px); background-size:4px 4px; }
.lg-card{ width:100%; max-width:404px; background:var(--surface-1); border:1px solid var(--border-default);
  border-radius:var(--radius-2xl); box-shadow:var(--shadow-xl); padding:34px 32px; position:relative; z-index:1; }
.lg-tenant{ display:flex; flex-direction:column; align-items:center; gap:14px; margin-bottom:24px; }
.lg-tenant__logo{ width:52px; height:52px; border-radius:var(--radius-lg); background:linear-gradient(160deg, var(--accent), var(--accent-press));
  display:grid; place-items:center; font-family:var(--font-display); font-weight:700; font-size:24px; color:#fff; box-shadow:var(--glow-accent); }
.lg-tenant__title{ font-family:var(--font-display); font-weight:700; font-size:21px; color:var(--text-strong); letter-spacing:-.02em; text-align:center; }
.lg-tenant__sub{ font-size:13px; color:var(--text-muted); text-align:center; margin-top:2px; }
.lg-social{ display:flex; flex-direction:column; gap:10px; margin-bottom:18px; }
.lg-sso{ display:flex; align-items:center; justify-content:center; gap:10px; height:44px; border-radius:var(--radius-md);
  background:var(--surface-2); border:1px solid var(--border-default); color:var(--text-strong); font-family:var(--font-text);
  font-size:14px; font-weight:600; cursor:pointer; white-space:nowrap; transition:background .14s, border-color .14s; }
.lg-sso:hover{ background:var(--surface-3); border-color:var(--border-strong); }
.lg-sso svg{ width:18px; height:18px; }
.lg-or{ display:flex; align-items:center; gap:12px; margin:18px 0; color:var(--text-faint); font-size:11px;
  font-family:var(--font-mono); letter-spacing:.1em; text-transform:uppercase; }
.lg-or::before,.lg-or::after{ content:""; flex:1; height:1px; background:var(--border-subtle); }
.lg-form{ display:flex; flex-direction:column; gap:14px; }
.lg-row{ display:flex; align-items:center; justify-content:space-between; }
.lg-link{ font-size:12.5px; color:var(--accent); cursor:pointer; font-weight:500; }
.lg-link:hover{ color:var(--accent-hover); }
.lg-foot{ text-align:center; margin-top:22px; font-size:12.5px; color:var(--text-muted); }
.lg-secured{ display:flex; align-items:center; justify-content:center; gap:7px; margin-top:22px;
  font-size:11.5px; color:var(--text-faint); }
.lg-secured img{ width:15px; height:15px; opacity:.8; }
.lg-secured b{ color:var(--text-muted); font-weight:600; }
.lg-back{ display:inline-flex; align-items:center; gap:6px; font-size:12.5px; color:var(--text-muted); cursor:pointer;
  background:none; border:0; padding:0; margin-bottom:18px; font-family:var(--font-text); }
.lg-back:hover{ color:var(--text-strong); }

/* OTP */
.lg-otp{ display:flex; gap:9px; justify-content:center; margin:6px 0 4px; }
.lg-otp input{ width:46px; height:54px; text-align:center; font-family:var(--font-mono); font-size:22px; font-weight:600;
  color:var(--text-strong); background:var(--surface-inset); border:1px solid var(--border-default); border-radius:var(--radius-md); outline:none;
  transition:border-color .14s, box-shadow .14s; }
.lg-otp input:focus{ border-color:var(--border-focus); box-shadow:var(--ring-focus); }

/* Consent */
.lg-consent__app{ display:flex; align-items:center; justify-content:center; gap:14px; margin-bottom:18px; }
.lg-consent__io{ display:flex; align-items:center; gap:6px; color:var(--text-faint); }
.lg-consent__dot{ width:5px; height:5px; border-radius:50%; background:var(--text-faint); }
.lg-scopes{ list-style:none; padding:0; margin:18px 0; display:flex; flex-direction:column; gap:2px; }
.lg-scope{ display:flex; align-items:flex-start; gap:11px; padding:11px 12px; border-radius:var(--radius-md); }
.lg-scope:hover{ background:var(--surface-2); }
.lg-scope__ic{ flex:none; width:30px; height:30px; border-radius:8px; background:var(--accent-soft); color:var(--accent); display:grid; place-items:center; }
.lg-scope__ic svg{ width:16px; height:16px; }
.lg-scope__t{ font-size:13.5px; color:var(--text-strong); font-weight:500; }
.lg-scope__d{ font-size:12px; color:var(--text-faint); margin-top:1px; }

/* Success */
.lg-success{ text-align:center; padding:8px 0; }
.lg-success__ring{ width:72px; height:72px; border-radius:50%; background:var(--success-soft); color:var(--success);
  display:grid; place-items:center; margin:0 auto 18px; animation:lg-pop .4s cubic-bezier(.16,1,.3,1); }
.lg-success__ring svg{ width:34px; height:34px; }
@keyframes lg-pop{ from{ transform:scale(.6); opacity:0; } }
.lg-card{ opacity:1; }
@media (prefers-reduced-motion: no-preference){
  .lg-fade{ animation:lg-fade .3s ease both; }
}
@keyframes lg-fade{ from{ transform:translateY(8px); } to{ transform:translateY(0); } }
`;
if (!document.getElementById('lg-css')) { const s=document.createElement('style'); s.id='lg-css'; s.textContent=LOGIN_CSS; document.head.appendChild(s); }

function Otp() {
  const refs = React.useRef([]);
  const [vals, setVals] = React.useState(['','','','','','']);
  const set = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...vals]; next[i] = v; setVals(next);
    if (v && i < 5) refs.current[i+1] && refs.current[i+1].focus();
  };
  const key = (i, e) => { if (e.key === 'Backspace' && !vals[i] && i>0) refs.current[i-1].focus(); };
  return (
    <div className="lg-otp">
      {vals.map((v,i)=>(
        <input key={i} ref={el=>refs.current[i]=el} value={v} inputMode="numeric" maxLength={1}
          onChange={e=>set(i,e.target.value)} onKeyDown={e=>key(i,e)} autoFocus={i===0} />
      ))}
    </div>
  );
}

function Secured() {
  return <div className="lg-secured"><img src="../../assets/idnest-mark.svg" alt="" /> Secured by <b>ID Nest</b></div>;
}

function HostedLogin() {
  const [step, setStep] = React.useState('signin');
  const [email, setEmail] = React.useState('dana@acme.com');

  return (
    <div className="lg">
      <div className="lg__noise" />
      <div className="lg-card lg-fade" key={step}>

        {step === 'signin' && <>
          <div className="lg-tenant">
            <div className="lg-tenant__logo">A</div>
            <div>
              <div className="lg-tenant__title">Welcome to Acme</div>
              <div className="lg-tenant__sub">Sign in to continue to your dashboard</div>
            </div>
          </div>
          <div className="lg-social">
            <button className="lg-sso" onClick={()=>setStep('mfa')}><LIc.google /> Continue with Google</button>
            <button className="lg-sso" onClick={()=>setStep('mfa')}><LIc.github /> Continue with GitHub</button>
          </div>
          <div className="lg-or">or</div>
          <div className="lg-form">
            <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} prefix={<LIc.mail />} placeholder="you@company.com" />
            <Input label="Password" type="password" prefix={<LIc.lock />} placeholder="••••••••••" defaultValue="supersecret" />
            <div className="lg-row">
              <Checkbox label="Remember me" defaultChecked />
              <span className="lg-link">Forgot password?</span>
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={()=>setStep('mfa')}>Sign in</Button>
          </div>
          <div className="lg-foot">New to Acme? <span className="lg-link">Create an account</span></div>
          <Secured />
        </>}

        {step === 'mfa' && <>
          <button className="lg-back" onClick={()=>setStep('signin')}><LIc.back /> Back</button>
          <div className="lg-tenant">
            <div className="lg-tenant__logo" style={{ background:'var(--accent-soft)', color:'var(--accent)', boxShadow:'none' }}><LIc.shield /></div>
            <div>
              <div className="lg-tenant__title">Verify it’s you</div>
              <div className="lg-tenant__sub">Enter the 6-digit code from your authenticator</div>
            </div>
          </div>
          <Otp />
          <div style={{ textAlign:'center', margin:'14px 0 18px' }}><span className="lg-link">Resend code</span></div>
          <Button variant="primary" size="lg" fullWidth onClick={()=>setStep('consent')}>Verify</Button>
          <Secured />
        </>}

        {step === 'consent' && <>
          <div className="lg-consent__app">
            <Avatar name="Acme Inc" size="lg" />
            <div className="lg-consent__io"><span className="lg-consent__dot" /><span className="lg-consent__dot" /><span className="lg-consent__dot" /></div>
            <div className="lg-tenant__logo" style={{ width:46, height:46, fontSize:20 }}>N</div>
          </div>
          <div className="lg-tenant__title" style={{ marginBottom:4 }}>Northwind wants access</div>
          <div className="lg-tenant__sub" style={{ marginBottom:0 }}>to your Acme account <b style={{color:'var(--text-body)'}}>dana@acme.com</b></div>
          <ul className="lg-scopes">
            <li className="lg-scope"><span className="lg-scope__ic"><LIc.user /></span><div><div className="lg-scope__t">View your profile</div><div className="lg-scope__d">Name, avatar, and email address</div></div></li>
            <li className="lg-scope"><span className="lg-scope__ic"><LIc.mail /></span><div><div className="lg-scope__t">Read your team membership</div><div className="lg-scope__d">Organizations and roles you belong to</div></div></li>
            <li className="lg-scope"><span className="lg-scope__ic"><LIc.shield /></span><div><div className="lg-scope__t">Offline access</div><div className="lg-scope__d">Stay signed in via refresh tokens</div></div></li>
          </ul>
          <div style={{ display:'flex', gap:10 }}>
            <Button variant="secondary" fullWidth onClick={()=>setStep('signin')}>Deny</Button>
            <Button variant="primary" fullWidth onClick={()=>setStep('done')}>Allow access</Button>
          </div>
          <Secured />
        </>}

        {step === 'done' && <>
          <div className="lg-success">
            <div className="lg-success__ring"><LIc.check /></div>
            <div className="lg-tenant__title">You’re all set</div>
            <div className="lg-tenant__sub" style={{ marginTop:6, marginBottom:22 }}>Redirecting you back to Northwind…</div>
            <Button variant="ghost" size="sm" onClick={()=>setStep('signin')}>Restart demo</Button>
          </div>
          <Secured />
        </>}

      </div>
    </div>
  );
}

Object.assign(window, { HostedLogin });
