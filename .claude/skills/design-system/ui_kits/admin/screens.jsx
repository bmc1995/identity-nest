/* ID Nest Console — screens: Overview, Users, Applications, App detail drawer. */

const { Button, IconButton, Badge, Tag, Avatar, Card, Switch, Input, Select, Tabs, CodeBlock, Dialog, Toast, ToastRail } = window.ADM;
const AIc = window.AIc, AppShell = window.AppShell;

/* ── data ─────────────────────────────────────── */
const USERS = [
  { name:'Dana Reyes', email:'dana@acme.com', conn:'google', status:'active', role:'Admin', last:'2m ago', a:true },
  { name:'Mara Lin', email:'mara@acme.com', conn:'github', status:'active', role:'Developer', last:'1h ago' },
  { name:'Theo Park', email:'theo@northwind.io', conn:'password', status:'invited', role:'Member', last:'—' },
  { name:'Iris Okonkwo', email:'iris@acme.com', conn:'google', status:'active', role:'Developer', last:'3h ago' },
  { name:'Sam Whitfield', email:'sam@verdant.co', conn:'password', status:'suspended', role:'Member', last:'12d ago' },
  { name:'Priya Nair', email:'priya@acme.com', conn:'github', status:'active', role:'Admin', last:'yesterday' },
  { name:'Leo Marsh', email:'leo@loophole.dev', conn:'google', status:'active', role:'Member', last:'5h ago' },
];
const STATUS_TONE = { active:'success', invited:'info', suspended:'danger' };
const CONN_LABEL = { google:'Google', github:'GitHub', password:'Email' };

const APPS = [
  { name:'Acme Web', short:'AW', color:'#D9572E', type:'SPA', id:'nest_a91f3c7e', mau:'18.2k' },
  { name:'Acme Mobile', short:'AM', color:'#3DBF8B', type:'Native', id:'nest_5b2da910', mau:'9.6k' },
  { name:'Internal Tools', short:'IT', color:'#E8923C', type:'Regular Web', id:'nest_77c0fe21', mau:'412' },
  { name:'Billing API', short:'BA', color:'#7FB5A6', type:'M2M', id:'nest_c4419b0d', mau:'—' },
  { name:'Docs Portal', short:'DP', color:'#6E9CD6', type:'SPA', id:'nest_e10a7755', mau:'3.1k' },
  { name:'Status Page', short:'SP', color:'#C9402C', type:'Regular Web', id:'nest_2f8b41aa', mau:'880' },
];
const TYPE_TONE = { 'SPA':'accent', 'Native':'success', 'Regular Web':'info', 'M2M':'neutral' };

const ConnIcon = ({ c }) => c === 'google' ? <AIc.google /> : c === 'github' ? <AIc.github /> : <AIc.key />;

/* ── Sparkline ────────────────────────────────── */
function Sparkline({ data, up, w=58, h=22 }) {
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((d,i) => [ (i/(data.length-1))*w, h - 3 - ((d-min)/span)*(h-6) ]);
  const line = pts.map((p,i)=> (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area = line + ` L ${w} ${h} L 0 ${h} Z`;
  const col = up ? 'var(--success)' : 'var(--danger)';
  const gid = 'sg'+Math.round(data[0]*data.length);
  return (
    <svg className="adm-stat__spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={col} stopOpacity="0.22"/><stop offset="1" stopColor={col} stopOpacity="0"/>
      </linearGradient></defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2" fill={col} />
    </svg>
  );
}

/* ── Sign-ins bar chart ───────────────────────── */
function SignInChart() {
  const bars = [4.2,5.5,4.8,6.3,7.0,5.8,6.6,7.4,6.9,8.1,7.7,9.0];
  const labels = ['25','26','27','28','29','30','31','01','02','03','04','05'];
  const max = 10;
  const peak = bars.indexOf(Math.max(...bars));
  const gridVals = [10,7.5,5,2.5,0];
  const [hover, setHover] = React.useState(null);
  return (
    <div className="adm-chart">
      <div className="adm-chart__plot">
        <div className="adm-chart__grid">
          {gridVals.map(v => (
            <div key={v} className="adm-chart__gline"><span className="adm-chart__gval">{v ? v+'k' : '0'}</span></div>
          ))}
        </div>
        <div className="adm-bars">
          {bars.map((b,i) => (
            <div key={i} className="adm-bars__col" data-peak={i===peak} data-hover={hover===i}
                 onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(h=>h===i?null:h)}>
              {hover===i && <span className="adm-bars__tip">{b.toFixed(1)}k sign-ins</span>}
              <div className="adm-bars__track"><div className="adm-bars__bar" style={{ height:`${(b/max)*100}%` }} /></div>
              <span className="adm-bars__lbl">{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Overview ─────────────────────────────────── */
function Overview({ onOpen }) {
  const stats = [
    { label:'Active users', period:'30 days', val:'31,204', delta:'+12.4%', good:true, dir:'up', spark:[20,22,21,24,26,25,28,27,29,31] },
    { label:'Sign-ins today', period:'vs. yesterday', val:'8,917', delta:'+3.1%', good:true, dir:'up', spark:[6,7,6.5,7.5,7,8,8.5,8,8.7,8.9] },
    { label:'Applications', period:'active', val:'6', delta:'+1', good:true, dir:'up', spark:[3,3,4,4,4,5,5,5,6,6] },
    { label:'Failed logins', period:'24 hours', val:'42', delta:'-18%', good:true, dir:'down', spark:[78,70,66,60,58,52,50,48,45,42] },
  ];
  const acts = [
    { who:'Mara Lin', what:'created application', obj:'Docs Portal', time:'2m' },
    { who:'Dana Reyes', what:'updated policy', obj:'MFA required', time:'18m' },
    { who:'system', what:'rotated signing key', obj:'kid_8f2a', time:'1h' },
    { who:'Theo Park', what:'was invited to', obj:'Acme Inc', time:'3h' },
    { who:'Priya Nair', what:'revoked token for', obj:'Billing API', time:'5h' },
  ];
  return (
    <div className="adm-content">
      <div className="adm-pagehead">
        <div className="adm-pagehead__t"><h1>Overview</h1><p>What’s happening across the Acme tenant.</p></div>
        <div className="adm-pagehead__actions">
          <Button variant="secondary" size="sm" iconLeft={<AIc.ext />}>View docs</Button>
          <Button variant="primary" size="sm" iconLeft={<AIc.plus />} onClick={()=>onOpen({ invite:true })}>Invite user</Button>
        </div>
      </div>
      <div className="adm-stats">
        {stats.map((s,si) => {
          const I = [AIc.users, AIc.trend, AIc.apps, AIc.policies][si];
          return (
            <div key={s.label} className="adm-stat">
              <div className="adm-stat__top">
                <span className="adm-stat__label">{s.label}</span>
                <span className="adm-stat__ic"><I /></span>
              </div>
              <div className="adm-stat__val">{s.val}</div>
              <div className="adm-stat__row">
                <span className={`adm-stat__delta adm-stat__delta--${s.good ? 'up' : 'down'}`}><AIc.trend style={{transform: s.dir==='up'?'none':'scaleY(-1)'}} />{s.delta}</span>
                <Sparkline data={s.spark} up={s.good} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="adm-grid2">
        <div className="adm-panel">
          <div className="adm-panel__head">
            <h3>Sign-ins</h3>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span className="adm-stat__period">29,481 total</span>
              <Badge tone="neutral">Last 12 days</Badge>
            </div>
          </div>
          <SignInChart />
        </div>
        <div className="adm-panel">
          <div className="adm-panel__head"><h3>Recent activity</h3></div>
          <div>
            {acts.map((a,i) => (
              <div key={i} className="adm-act">
                <Avatar name={a.who === 'system' ? 'ID Nest' : a.who} size="sm" round={a.who==='system'} />
                <div className="adm-act__txt"><b>{a.who}</b> {a.what} <b>{a.obj}</b></div>
                <span className="adm-act__time">{a.time}</span>
              </div>
            ))}
          </div>
          <div className="adm-panel__foot"><button>View all activity <AIc.chevRight /></button></div>
        </div>
      </div>
    </div>
  );
}

/* ── Users ────────────────────────────────────── */
function Users({ onOpen }) {
  const [q, setQ] = React.useState('');
  const rows = USERS.filter(u => (u.name + u.email).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="adm-content">
      <div className="adm-pagehead">
        <div><h1>Users</h1><p>2,438 people across 4 connections.</p></div>
        <div className="adm-pagehead__actions">
          <Button variant="secondary" size="sm" iconLeft={<AIc.filter />}>Filter</Button>
          <Button variant="primary" size="sm" iconLeft={<AIc.plus />} onClick={() => onOpen({ invite:true })}>Invite user</Button>
        </div>
      </div>
      <div className="adm-panel">
        <div className="adm-panel__head">
          <div style={{ width:300 }}><Input size="sm" placeholder="Search by name or email…" value={q} onChange={e=>setQ(e.target.value)} prefix={<AIc.search />} /></div>
          <Badge tone="neutral">{rows.length} shown</Badge>
        </div>
        <table className="adm-table">
          <thead><tr><th>User</th><th>Connection</th><th>Status</th><th>Role</th><th>Last login</th><th></th></tr></thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.email} onClick={() => onOpen({ user:u })}>
                <td>
                  <div className="adm-uname">
                    <Avatar name={u.name} size="sm" status={u.status==='active' ? 'online' : undefined} />
                    <div><div className="adm-uname__n">{u.name}</div><div className="adm-uname__e">{u.email}</div></div>
                  </div>
                </td>
                <td><span className="adm-conn"><ConnIcon c={u.conn} />{CONN_LABEL[u.conn]}</span></td>
                <td><Badge tone={STATUS_TONE[u.status]} dot>{u.status}</Badge></td>
                <td>{u.role}</td>
                <td className="adm-mono">{u.last}</td>
                <td style={{ textAlign:'right' }}><span className="adm-rowarrow"><AIc.chevRight /></span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Applications ─────────────────────────────── */
function Applications({ onOpen }) {
  return (
    <div className="adm-content">
      <div className="adm-pagehead">
        <div><h1>Applications</h1><p>OAuth clients connected to this tenant.</p></div>
        <div className="adm-pagehead__actions">
          <Button variant="primary" size="sm" iconLeft={<AIc.plus />} onClick={() => onOpen({ newApp:true })}>New application</Button>
        </div>
      </div>
      <div className="adm-apps">
        {APPS.map(app => (
          <div key={app.id} className="adm-app" onClick={() => onOpen({ app })}>
            <div className="adm-app__top">
              <span className="adm-app__logo" style={{ background:`color-mix(in srgb, ${app.color} 18%, transparent)`, color:app.color }}>{app.short}</span>
              <div className="adm-app__meta"><div className="adm-app__name">{app.name}</div><div className="adm-app__id">{app.id}</div></div>
            </div>
            <div className="adm-app__badge"><Badge tone={TYPE_TONE[app.type]}>{app.type}</Badge></div>
            <div className="adm-app__foot">
              <span className="adm-app__stat"><b>{app.mau}</b> MAU</span>
              <span className="adm-conn" style={{ fontSize:11 }}>Manage <AIc.chevRight style={{width:13,height:13}} /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── User drawer ──────────────────────────────── */
function UserDrawer({ user, onClose, toast }) {
  return (
    <>
      <div className="adm-drawer__scrim" onClick={onClose} />
      <aside className="adm-drawer">
        <div className="adm-drawer__head">
          <Avatar name={user.name} size="lg" status={user.status==='active'?'online':undefined} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:'var(--text-strong)' }}>{user.name}</div>
            <div style={{ fontSize:12.5, color:'var(--text-muted)' }}>{user.email}</div>
            <div style={{ marginTop:8, display:'flex', gap:7 }}>
              <Badge tone={STATUS_TONE[user.status]} dot>{user.status}</Badge>
              <Badge tone="neutral">{user.role}</Badge>
            </div>
          </div>
          <IconButton variant="ghost" label="Close" onClick={onClose}><svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg></IconButton>
        </div>
        <div className="adm-drawer__body">
          <div className="adm-field">
            <span className="adm-field__k">User ID</span>
            <div className="adm-credrow"><code>usr_a91f3c7e88d20b14</code><button onClick={()=>toast('Copied user ID')}><AIc.copy /></button></div>
          </div>
          <div className="adm-field">
            <span className="adm-field__k">Connection</span>
            <span className="adm-conn"><ConnIcon c={user.conn} />{CONN_LABEL[user.conn]}</span>
          </div>
          <div className="adm-field">
            <span className="adm-field__k">Roles</span>
            <div className="adm-tags"><Tag onRemove={()=>{}}>{user.role}</Tag><Tag onRemove={()=>{}}>billing:read</Tag><Tag>+ add</Tag></div>
          </div>
          <div>
            <span className="adm-field__k" style={{ display:'block', marginBottom:6 }}>Security</span>
            <div className="adm-toggle-row">
              <div><div className="adm-toggle-row__t">Multi-factor auth</div><div className="adm-toggle-row__d">Require a second factor at sign-in.</div></div>
              <Switch defaultChecked />
            </div>
            <div className="adm-toggle-row">
              <div><div className="adm-toggle-row__t">Block sign-ins</div><div className="adm-toggle-row__d">Temporarily suspend this account.</div></div>
              <Switch defaultChecked={user.status==='suspended'} />
            </div>
          </div>
        </div>
        <div style={{ padding:'18px 22px', borderTop:'1px solid var(--border-subtle)', display:'flex', gap:10 }}>
          <Button variant="secondary" fullWidth onClick={()=>toast('Reset link sent')}>Send reset link</Button>
          <Button variant="danger" onClick={()=>toast('User removed', 'danger')}>Remove</Button>
        </div>
      </aside>
    </>
  );
}

/* ── App detail drawer ────────────────────────── */
function AppDrawer({ app, onClose, toast }) {
  const [tab, setTab] = React.useState('settings');
  return (
    <>
      <div className="adm-drawer__scrim" onClick={onClose} />
      <aside className="adm-drawer" style={{ width:480 }}>
        <div className="adm-drawer__head">
          <span className="adm-app__logo" style={{ width:44, height:44, background:`color-mix(in srgb, ${app.color} 18%, transparent)`, color:app.color }}>{app.short}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:'var(--text-strong)' }}>{app.name}</div>
            <div style={{ marginTop:6 }}><Badge tone={TYPE_TONE[app.type]}>{app.type}</Badge></div>
          </div>
          <IconButton variant="ghost" label="Close" onClick={onClose}><svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg></IconButton>
        </div>
        <div style={{ padding:'0 22px', borderBottom:'1px solid var(--border-subtle)' }}>
          <Tabs tabs={[{id:'settings',label:'Settings'},{id:'creds',label:'Credentials'},{id:'quickstart',label:'Quickstart'}]} value={tab} onChange={setTab} />
        </div>
        <div className="adm-drawer__body">
          {tab === 'settings' && <>
            <Input label="Application name" defaultValue={app.name} />
            <div className="adm-field">
              <span className="adm-field__k">Allowed callback URLs</span>
              <div className="adm-tags"><Tag onRemove={()=>{}}>https://acme.com/callback</Tag><Tag onRemove={()=>{}}>http://localhost:3000/cb</Tag></div>
            </div>
            <Select label="Token endpoint auth" options={['None (PKCE)','Client secret (Basic)','Client secret (POST)']} defaultValue="None (PKCE)" />
            <div>
              <span className="adm-field__k" style={{ display:'block', marginBottom:6 }}>Grants</span>
              <div className="adm-toggle-row"><div><div className="adm-toggle-row__t">Authorization code</div></div><Switch defaultChecked /></div>
              <div className="adm-toggle-row"><div><div className="adm-toggle-row__t">Refresh token rotation</div><div className="adm-toggle-row__d">Issue a new refresh token on every use.</div></div><Switch defaultChecked /></div>
            </div>
          </>}
          {tab === 'creds' && <>
            <div className="adm-field"><span className="adm-field__k">Client ID</span><div className="adm-credrow"><code>{app.id}</code><button onClick={()=>toast('Copied client ID')}><AIc.copy /></button></div></div>
            <div className="adm-field"><span className="adm-field__k">Client secret</span><div className="adm-credrow"><code>{"•".repeat(28)}</code><button onClick={()=>toast('Copied client secret')}><AIc.copy /></button></div></div>
            <div className="adm-field"><span className="adm-field__k">Domain</span><div className="adm-credrow"><code>acme.idnest.app</code><button onClick={()=>toast('Copied domain')}><AIc.copy /></button></div></div>
            <Button variant="secondary" iconLeft={<AIc.key />} onClick={()=>toast('Secret rotated','warning')}>Rotate secret</Button>
          </>}
          {tab === 'quickstart' && (
            <CodeBlock title="app.ts" language="ts">
              <code>
<span className="tk">import</span>{" { IDNest } "}<span className="tk">from</span> <span className="ts">"@idnest/sdk"</span>{"\n\n"}
<span className="tk">const</span>{" nest = "}<span className="tf">IDNest</span>{"({\n"}
{"  domain: "}<span className="ts">"acme.idnest.app"</span>{",\n"}
{"  clientId: "}<span className="ts">"{app.id}"</span>{",\n"}
{"})\n\n"}
<span className="tk">await</span>{" nest."}<span className="tf">login</span>{"({ scope: "}<span className="ts">"openid profile"</span>{" })"}
              </code>
            </CodeBlock>
          )}
        </div>
        <div style={{ padding:'18px 22px', borderTop:'1px solid var(--border-subtle)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={()=>{ toast('Changes saved'); onClose(); }}>Save changes</Button>
        </div>
      </aside>
    </>
  );
}

/* ── Controller ───────────────────────────────── */
function ConsoleApp() {
  const [active, setActive] = React.useState('overview');
  const [drawer, setDrawer] = React.useState(null);
  const [invite, setInvite] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);
  const toast = (title, tone='success') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, title, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
  };
  const open = (d) => { if (d.invite || d.newApp) setInvite(d); else setDrawer(d); };

  const screen = {
    overview: <Overview onOpen={open} />,
    users: <Users onOpen={open} />,
    apps: <Applications onOpen={open} />,
    policies: <Placeholder title="Policies" sub="Define MFA, password, and session rules." />,
    connections: <Placeholder title="Connections" sub="Social, enterprise, and database connections." />,
    logs: <Placeholder title="Logs" sub="Every authentication event, streamable." />,
    settings: <Placeholder title="Settings" sub="Tenant configuration and branding." />,
  }[active];

  return (
    <AppShell active={active} onNav={(id)=>{ setActive(id); setDrawer(null); }}>
      {screen}
      {drawer && drawer.user && <UserDrawer user={drawer.user} onClose={()=>setDrawer(null)} toast={toast} />}
      {drawer && drawer.app && <AppDrawer app={drawer.app} onClose={()=>setDrawer(null)} toast={toast} />}
      {invite && (
        <Dialog open onClose={()=>setInvite(false)}
          icon={invite.newApp ? <AIc.apps /> : <AIc.users />}
          title={invite.newApp ? 'New application' : 'Invite a user'}
          description={invite.newApp ? 'Register an OAuth client for this tenant.' : 'They’ll get an email to set up their account.'}
          footer={<><Button variant="ghost" onClick={()=>setInvite(false)}>Cancel</Button><Button variant="primary" onClick={()=>{ setInvite(false); toast(invite.newApp?'Application created':'Invitation sent'); }}>{invite.newApp?'Create':'Send invite'}</Button></>}>
          {invite.newApp
            ? <div style={{display:'flex',flexDirection:'column',gap:14}}><Input label="Name" placeholder="My App" /><Select label="Application type" options={['Single-Page App','Native','Regular Web App','Machine to Machine']} /></div>
            : <div style={{display:'flex',flexDirection:'column',gap:14}}><Input label="Email" type="email" placeholder="teammate@acme.com" prefix={<AIc.users />} /><Select label="Role" options={['Member','Developer','Admin']} /></div>}
        </Dialog>
      )}
      <ToastRail>{toasts.map(t => <Toast key={t.id} tone={t.tone} title={t.title} onClose={()=>setToasts(x=>x.filter(z=>z.id!==t.id))} />)}</ToastRail>
    </AppShell>
  );
}

function Placeholder({ title, sub }) {
  return (
    <div className="adm-content">
      <div className="adm-pagehead"><div><h1>{title}</h1><p>{sub}</p></div></div>
      <div className="adm-panel" style={{ padding:'64px 24px', textAlign:'center', color:'var(--text-faint)' }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:12, letterSpacing:'.1em', textTransform:'uppercase' }}>Section preview</div>
        <p style={{ marginTop:8, fontSize:13.5 }}>This area follows the same shell, table, and panel patterns shown in Overview, Users &amp; Applications.</p>
      </div>
    </div>
  );
}

Object.assign(window, { ConsoleApp });
