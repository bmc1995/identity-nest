/* @ds-bundle: {"format":3,"namespace":"IDNestDesignSystem_c7f3f6","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"CodeBlock","sourcePath":"components/data/CodeBlock.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"ToastRail","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"7af60873fa2f","components/core/Badge.jsx":"16a1e945db39","components/core/Button.jsx":"92fb7e3c7d54","components/core/Card.jsx":"848ebdcff3c5","components/core/IconButton.jsx":"3ab50dd2dd0a","components/core/Tag.jsx":"9b36ce30aea6","components/data/CodeBlock.jsx":"19aacc723fc2","components/feedback/Dialog.jsx":"103a573cc293","components/feedback/Toast.jsx":"177144a4dfed","components/feedback/Tooltip.jsx":"c38dadb2b6c2","components/forms/Checkbox.jsx":"8c2747e81f8c","components/forms/Input.jsx":"43c463102513","components/forms/Select.jsx":"b49d9d0b371e","components/forms/Switch.jsx":"4425c1c60763","components/navigation/Tabs.jsx":"d769a95cc52c","explorations/design-canvas.jsx":"bd8746af6e58","ui_kits/admin/screens.jsx":"5db283b5bdde","ui_kits/admin/shared.jsx":"e0c4f7ae350a","ui_kits/docs/docs.jsx":"15cef82a8564","ui_kits/login/login.jsx":"490a90ab5398","ui_kits/marketing/Sections.jsx":"bd3d6be574a7","ui_kits/marketing/shared.jsx":"3740706a6d22"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.IDNestDesignSystem_c7f3f6 = window.IDNestDesignSystem_c7f3f6 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'idn-avatar-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const PALETTE = ['var(--accent)', 'var(--accent-2)', 'var(--info)', 'var(--success)', 'var(--raw-clay-600)'];
function hueFor(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = h * 31 + str.charCodeAt(i) >>> 0;
  return PALETTE[h % PALETTE.length];
}
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}
function Avatar({
  name = '',
  src,
  size = 'md',
  round = false,
  status,
  className = '',
  ...rest
}) {
  const cls = ['idn-avatar', size !== 'md' && `idn-avatar--${size}`, round && 'idn-avatar--round', className].filter(Boolean).join(' ');
  const statusColor = {
    online: 'var(--success)',
    away: 'var(--warning)',
    offline: 'var(--text-faint)'
  }[status];
  const node = /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: !src ? {
      background: hueFor(name)
    } : undefined
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : initials(name));
  if (!status) return node;
  return /*#__PURE__*/React.createElement("span", {
    className: "idn-avatar-wrap"
  }, node, /*#__PURE__*/React.createElement("span", {
    className: "idn-avatar__status",
    style: {
      background: statusColor
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.idn-badge{
  display:inline-flex; align-items:center; gap:6px; height:22px; padding:0 9px;
  border-radius:var(--radius-pill); font-family:var(--font-mono); font-size:var(--fs-micro);
  font-weight:var(--fw-medium); letter-spacing:.01em; white-space:nowrap; line-height:1;
  border:1px solid transparent;
}
.idn-badge__dot{ width:6px; height:6px; border-radius:50%; background:currentColor; }
.idn-badge--neutral{ background:var(--surface-3); color:var(--text-body); border-color:var(--border-subtle); }
.idn-badge--accent{ background:var(--accent-soft); color:var(--accent); }
.idn-badge--success{ background:var(--success-soft); color:var(--success); }
.idn-badge--warning{ background:var(--warning-soft); color:var(--warning); }
.idn-badge--danger{ background:var(--danger-soft); color:var(--danger); }
.idn-badge--info{ background:var(--info-soft); color:var(--info); }
.idn-badge--solid{ border:0; }
.idn-badge--solid.idn-badge--accent{ background:var(--accent); color:var(--text-on-accent); }
.idn-badge--solid.idn-badge--success{ background:var(--success); color:#10261d; }
.idn-badge--solid.idn-badge--danger{ background:var(--danger); color:#fff; }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-badge-css')) {
  const s = document.createElement('style');
  s.id = 'idn-badge-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Badge({
  tone = 'neutral',
  solid = false,
  dot = false,
  className = '',
  children,
  ...rest
}) {
  const cls = ['idn-badge', `idn-badge--${tone}`, solid && 'idn-badge--solid', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "idn-badge__dot",
    "aria-hidden": "true"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.idn-btn{
  --_h: var(--control-md);
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  height:var(--_h); padding:0 18px; border-radius:var(--radius-md);
  font-family:var(--font-text); font-size:var(--fs-body-sm); font-weight:var(--fw-semibold);
  letter-spacing:0; line-height:1; white-space:nowrap; cursor:pointer; user-select:none;
  border:1px solid transparent; background:transparent; color:var(--text-strong);
  transition:background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard),
             color var(--dur-fast) var(--ease-standard), transform var(--dur-instant) var(--ease-standard),
             box-shadow var(--dur-fast) var(--ease-standard);
  text-decoration:none;
}
.idn-btn:focus-visible{ outline:none; box-shadow:var(--ring-focus); }
.idn-btn:active{ transform:translateY(1px); }
.idn-btn[disabled],.idn-btn[aria-disabled="true"]{ opacity:.5; pointer-events:none; }
.idn-btn--sm{ --_h:var(--control-sm); padding:0 13px; font-size:var(--fs-caption); }
.idn-btn--lg{ --_h:var(--control-lg); padding:0 24px; font-size:var(--fs-body); }
.idn-btn--full{ width:100%; }

.idn-btn--primary{ background:var(--accent); color:var(--text-on-accent); box-shadow:var(--glow-accent); }
.idn-btn--primary:hover{ background:var(--accent-hover); }
.idn-btn--primary:active{ background:var(--accent-press); }

.idn-btn--secondary{ background:var(--surface-2); color:var(--text-strong); border-color:var(--border-default); }
.idn-btn--secondary:hover{ background:var(--surface-3); border-color:var(--border-strong); }

.idn-btn--ghost{ background:transparent; color:var(--text-body); }
.idn-btn--ghost:hover{ background:var(--surface-2); color:var(--text-strong); }

.idn-btn--danger{ background:var(--danger); color:#fff; }
.idn-btn--danger:hover{ filter:brightness(1.08); }

.idn-btn--mono{ font-family:var(--font-mono); font-weight:var(--fw-medium); letter-spacing:-.01em; }
.idn-btn__spin{ width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:idn-btn-spin .6s linear infinite; }
@keyframes idn-btn-spin{ to{ transform:rotate(360deg);} }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-btn-css')) {
  const s = document.createElement('style');
  s.id = 'idn-btn-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Button({
  variant = 'primary',
  size = 'md',
  mono = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  as = 'button',
  href,
  className = '',
  children,
  ...rest
}) {
  const cls = ['idn-btn', `idn-btn--${variant}`, size !== 'md' && `idn-btn--${size}`, mono && 'idn-btn--mono', fullWidth && 'idn-btn--full', className].filter(Boolean).join(' ');
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, loading && /*#__PURE__*/React.createElement("span", {
    className: "idn-btn__spin",
    "aria-hidden": "true"
  }), !loading && iconLeft, children && /*#__PURE__*/React.createElement("span", null, children), !loading && iconRight);
  if (as === 'a') {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href,
      "aria-disabled": disabled || loading || undefined
    }, rest), content);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    disabled: disabled || loading
  }, rest), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.idn-card{
  background:var(--surface-1); border:1px solid var(--border-default);
  border-radius:var(--radius-xl); overflow:hidden;
  transition:border-color var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard),
             transform var(--dur-base) var(--ease-standard);
}
.idn-card--pad{ padding:var(--space-5); }
.idn-card--shadow{ box-shadow:var(--shadow-md); }
.idn-card--interactive{ cursor:pointer; }
.idn-card--interactive:hover{ border-color:var(--border-strong); box-shadow:var(--shadow-lg); transform:translateY(-2px); }
.idn-card--accent{ border-color:var(--accent); box-shadow:0 0 0 1px var(--accent-soft); }
.idn-card__head{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:var(--space-4) var(--space-5); border-bottom:1px solid var(--border-subtle); }
.idn-card__title{ font-family:var(--font-display); font-weight:var(--fw-semibold); font-size:var(--fs-h4); color:var(--text-strong); }
.idn-card__body{ padding:var(--space-5); }
.idn-card__foot{ padding:var(--space-4) var(--space-5); border-top:1px solid var(--border-subtle);
  display:flex; align-items:center; justify-content:flex-end; gap:var(--space-3); background:var(--bg-sunken); }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-card-css')) {
  const s = document.createElement('style');
  s.id = 'idn-card-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Card({
  title,
  actions,
  footer,
  padded,
  shadow = false,
  interactive = false,
  accent = false,
  className = '',
  children,
  ...rest
}) {
  const hasChrome = title != null || actions != null || footer != null;
  const cls = ['idn-card', !hasChrome && padded !== false && 'idn-card--pad', shadow && 'idn-card--shadow', interactive && 'idn-card--interactive', accent && 'idn-card--accent', className].filter(Boolean).join(' ');
  if (!hasChrome) return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), children);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), (title != null || actions != null) && /*#__PURE__*/React.createElement("div", {
    className: "idn-card__head"
  }, typeof title === 'string' ? /*#__PURE__*/React.createElement("span", {
    className: "idn-card__title"
  }, title) : title, actions), /*#__PURE__*/React.createElement("div", {
    className: "idn-card__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "idn-card__foot"
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.idn-iconbtn{
  display:inline-flex; align-items:center; justify-content:center;
  width:var(--control-md); height:var(--control-md); border-radius:var(--radius-md);
  border:1px solid transparent; background:transparent; color:var(--text-muted);
  cursor:pointer; transition:background var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard);
}
.idn-iconbtn:hover{ background:var(--surface-2); color:var(--text-strong); }
.idn-iconbtn:focus-visible{ outline:none; box-shadow:var(--ring-focus); }
.idn-iconbtn:active{ transform:translateY(1px); }
.idn-iconbtn[disabled]{ opacity:.45; pointer-events:none; }
.idn-iconbtn--sm{ width:var(--control-sm); height:var(--control-sm); border-radius:var(--radius-sm); }
.idn-iconbtn--lg{ width:var(--control-lg); height:var(--control-lg); }
.idn-iconbtn--solid{ background:var(--surface-2); border-color:var(--border-default); color:var(--text-strong); }
.idn-iconbtn--solid:hover{ background:var(--surface-3); }
.idn-iconbtn--accent{ background:var(--accent-soft); color:var(--accent); }
.idn-iconbtn--accent:hover{ background:var(--accent); color:var(--text-on-accent); }
.idn-iconbtn svg{ width:18px; height:18px; display:block; }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-iconbtn-css')) {
  const s = document.createElement('style');
  s.id = 'idn-iconbtn-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function IconButton({
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
  children,
  ...rest
}) {
  const cls = ['idn-iconbtn', variant !== 'ghost' && `idn-iconbtn--${variant}`, size !== 'md' && `idn-iconbtn--${size}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    "aria-label": label,
    title: label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.idn-tag{
  display:inline-flex; align-items:center; gap:7px; height:26px; padding:0 6px 0 11px;
  border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border-default);
  font-family:var(--font-mono); font-size:var(--fs-caption); color:var(--text-body); white-space:nowrap;
}
.idn-tag--plain{ padding:0 11px; }
.idn-tag__x{
  display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px;
  border-radius:var(--radius-xs); color:var(--text-faint); cursor:pointer; border:0; background:transparent;
  transition:background var(--dur-fast), color var(--dur-fast);
}
.idn-tag__x:hover{ background:var(--surface-3); color:var(--text-strong); }
.idn-tag__x svg{ width:11px; height:11px; }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-tag-css')) {
  const s = document.createElement('style');
  s.id = 'idn-tag-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const X = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 12 12",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.6",
  strokeLinecap: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 3l6 6M9 3l-6 6"
}));
function Tag({
  onRemove,
  className = '',
  children,
  ...rest
}) {
  const cls = ['idn-tag', !onRemove && 'idn-tag--plain', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("span", null, children), onRemove && /*#__PURE__*/React.createElement("button", {
    className: "idn-tag__x",
    "aria-label": "Remove",
    onClick: onRemove
  }, /*#__PURE__*/React.createElement(X, null)));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/CodeBlock.jsx
try { (() => {
const CSS = `
.idn-code{
  border:1px solid var(--border-default); border-radius:var(--radius-lg); overflow:hidden;
  background:var(--syntax-bg); font-family:var(--font-mono); box-shadow:var(--shadow-sm);
}
.idn-code__bar{
  display:flex; align-items:center; gap:10px; padding:9px 12px;
  background:var(--surface-2); border-bottom:1px solid var(--border-subtle);
}
.idn-code__dots{ display:flex; gap:6px; }
.idn-code__dots i{ width:10px; height:10px; border-radius:50%; display:block; }
.idn-code__title{ font-size:var(--fs-micro); letter-spacing:.04em; color:var(--text-muted); }
.idn-code__lang{ margin-left:auto; font-size:var(--fs-micro); letter-spacing:.08em; text-transform:uppercase; color:var(--text-faint); }
.idn-code__copy{
  appearance:none; border:1px solid var(--border-default); background:var(--surface-3);
  color:var(--text-muted); border-radius:var(--radius-sm); padding:4px 9px; font-family:var(--font-mono);
  font-size:var(--fs-micro); cursor:pointer; display:inline-flex; align-items:center; gap:5px;
  transition:color var(--dur-fast), border-color var(--dur-fast), background var(--dur-fast);
}
.idn-code__copy:hover{ color:var(--text-strong); border-color:var(--border-strong); }
.idn-code__copy svg{ width:12px; height:12px; }
.idn-code__pre{ margin:0; padding:14px 16px; overflow-x:auto; font-size:var(--fs-body-sm); line-height:1.65; color:var(--syntax-text); }
.idn-code__pre code{ font-family:inherit; }
.idn-code--terminal{ background:var(--surface-inset); }
.idn-code--terminal .idn-code__pre{ color:var(--text-body); }
.idn-code__prompt{ color:var(--accent); user-select:none; }
.idn-code__ok{ color:var(--success); }
/* token tints */
.tk{ color:var(--syntax-keyword); } .ts{ color:var(--syntax-string); } .tn{ color:var(--syntax-number); }
.tc{ color:var(--syntax-comment); font-style:italic; } .tf{ color:var(--syntax-func); } .tp{ color:var(--syntax-punct); }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-code-css')) {
  const s = document.createElement('style');
  s.id = 'idn-code-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const CopyIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5"
}, /*#__PURE__*/React.createElement("rect", {
  x: "5",
  y: "5",
  width: "8",
  height: "8",
  rx: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M3 11V4a1 1 0 011-1h7",
  strokeLinecap: "round"
}));
const CheckIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.7",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3.5 8.5l3 3 6-7"
}));
function CodeBlock({
  title,
  language,
  terminal = false,
  showDots = true,
  code,
  children,
  className = ''
}) {
  const [copied, setCopied] = React.useState(false);
  const raw = code != null ? code : typeof children === 'string' ? children : '';
  const copy = () => {
    try {
      navigator.clipboard.writeText(raw);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: ['idn-code', terminal && 'idn-code--terminal', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "idn-code__bar"
  }, showDots && /*#__PURE__*/React.createElement("span", {
    className: "idn-code__dots"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: '#E5533D'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      background: '#E8A33C'
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      background: '#3DBF8B'
    }
  })), title && /*#__PURE__*/React.createElement("span", {
    className: "idn-code__title"
  }, title), language && /*#__PURE__*/React.createElement("span", {
    className: "idn-code__lang"
  }, language), /*#__PURE__*/React.createElement("button", {
    className: "idn-code__copy",
    onClick: copy,
    style: language ? {
      marginLeft: 12
    } : {
      marginLeft: 'auto'
    }
  }, copied ? /*#__PURE__*/React.createElement(CheckIcon, null) : /*#__PURE__*/React.createElement(CopyIcon, null), copied ? 'Copied' : 'Copy')), /*#__PURE__*/React.createElement("pre", {
    className: "idn-code__pre"
  }, /*#__PURE__*/React.createElement("code", null, children != null ? children : code)));
}
// build-touch: 1781050251396
Object.assign(__ds_scope, { CodeBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/CodeBlock.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'idn-dialog-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const XIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 16 16",
  width: "15",
  height: "15",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.6",
  strokeLinecap: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M4 4l8 8M12 4l-8 8"
}));
function Dialog({
  open = true,
  onClose,
  title,
  description,
  icon,
  tone = 'accent',
  size = 'md',
  footer,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "idn-dialog__scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: ['idn-dialog', size !== 'md' && `idn-dialog--${size}`].filter(Boolean).join(' '),
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "idn-dialog__head"
  }, icon && /*#__PURE__*/React.createElement("div", {
    className: ['idn-dialog__icon', tone === 'danger' && 'idn-dialog__icon--danger'].filter(Boolean).join(' ')
  }, icon), /*#__PURE__*/React.createElement("div", {
    className: "idn-dialog__titles"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "idn-dialog__title"
  }, title), description && /*#__PURE__*/React.createElement("div", {
    className: "idn-dialog__desc"
  }, description)), onClose && /*#__PURE__*/React.createElement("button", {
    className: "idn-dialog__x",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(XIcon, null))), children && /*#__PURE__*/React.createElement("div", {
    className: "idn-dialog__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "idn-dialog__foot"
  }, footer)));
}
// build-touch: 1781050250575
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'idn-toast-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const ICONS = {
  success: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 10.5l3.5 3.5L16 5.5"
  })),
  danger: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 6v5M10 14h.01"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "10",
    r: "7.5"
  })),
  warning: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 3l8 14H2L10 3zM10 8v4M10 15h.01"
  })),
  info: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "10",
    r: "7.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 9v5M10 6.5h.01"
  }))
};
const XIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  width: "13",
  height: "13",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3.5 3.5l7 7M10.5 3.5l-7 7"
}));
function Toast({
  tone = 'info',
  title,
  children,
  onClose,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ['idn-toast', `idn-toast--${tone}`, className].filter(Boolean).join(' '),
    role: "status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "idn-toast__icon"
  }, ICONS[tone]), /*#__PURE__*/React.createElement("div", {
    className: "idn-toast__body"
  }, title && /*#__PURE__*/React.createElement("span", {
    className: "idn-toast__title"
  }, title), children && /*#__PURE__*/React.createElement("span", {
    className: "idn-toast__msg"
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    className: "idn-toast__x",
    onClick: onClose,
    "aria-label": "Dismiss"
  }, /*#__PURE__*/React.createElement(XIcon, null)));
}
function ToastRail({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "idn-toast__rail"
  }, children);
}
// build-touch: 1781050250786
Object.assign(__ds_scope, { Toast, ToastRail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'idn-tip-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Tooltip({
  label,
  placement = 'top',
  mono = false,
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: ['idn-tip', placement === 'bottom' && 'idn-tip--bottom'].filter(Boolean).join(' '),
    tabIndex: 0
  }, children, /*#__PURE__*/React.createElement("span", {
    className: ['idn-tip__pop', mono && 'idn-tip__pop--mono'].filter(Boolean).join(' '),
    role: "tooltip"
  }, label));
}
// build-touch: 1781050250986
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.idn-check{ display:inline-flex; align-items:flex-start; gap:10px; cursor:pointer; user-select:none; font-family:var(--font-text); }
.idn-check[data-disabled="true"]{ opacity:.5; cursor:not-allowed; }
.idn-check__box{
  flex:none; width:18px; height:18px; margin-top:1px; border-radius:5px;
  background:var(--surface-inset); border:1px solid var(--border-strong);
  display:grid; place-items:center; color:var(--text-on-accent);
  transition:background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard);
}
.idn-check__box svg{ width:12px; height:12px; opacity:0; transform:scale(.6); transition:opacity var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-out); }
.idn-check input{ position:absolute; opacity:0; width:0; height:0; }
.idn-check input:focus-visible + .idn-check__box{ box-shadow:var(--ring-focus); }
.idn-check input:checked + .idn-check__box{ background:var(--accent); border-color:var(--accent); }
.idn-check input:checked + .idn-check__box svg{ opacity:1; transform:scale(1); }
.idn-check input:indeterminate + .idn-check__box{ background:var(--accent); border-color:var(--accent); }
.idn-check input:indeterminate + .idn-check__box svg{ opacity:1; transform:scale(1); }
.idn-check__text{ display:flex; flex-direction:column; gap:2px; }
.idn-check__label{ font-size:var(--fs-body-sm); color:var(--text-body); line-height:1.3; }
.idn-check__desc{ font-size:var(--fs-caption); color:var(--text-faint); }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-check-css')) {
  const s = document.createElement('style');
  s.id = 'idn-check-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Checkbox({
  label,
  description,
  checked,
  indeterminate,
  disabled,
  className = '',
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return /*#__PURE__*/React.createElement("label", {
    className: ['idn-check', className].filter(Boolean).join(' '),
    "data-disabled": disabled || undefined
  }, /*#__PURE__*/React.createElement("input", _extends({
    ref: ref,
    type: "checkbox",
    checked: checked,
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "idn-check__box"
  }, indeterminate ? /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6h7"
  })) : /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.3l2.3 2.3L9.6 3.5"
  }))), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "idn-check__text"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "idn-check__label"
  }, label), description && /*#__PURE__*/React.createElement("span", {
    className: "idn-check__desc"
  }, description)));
}
// build-touch: 1781050250065
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.idn-field{ display:flex; flex-direction:column; gap:6px; }
.idn-field__label{ font-family:var(--font-text); font-size:var(--fs-body-sm); font-weight:var(--fw-medium); color:var(--text-body); }
.idn-field__label .req{ color:var(--accent); margin-left:3px; }
.idn-field__hint{ font-size:var(--fs-caption); color:var(--text-faint); }
.idn-field__err{ font-size:var(--fs-caption); color:var(--danger); display:flex; align-items:center; gap:5px; }
.idn-inputwrap{ position:relative; display:flex; align-items:center; }
.idn-input{
  width:100%; height:var(--control-md); padding:0 13px; border-radius:var(--radius-md);
  background:var(--surface-inset); color:var(--text-strong); border:1px solid var(--border-default);
  font-family:var(--font-text); font-size:var(--fs-body); line-height:1; outline:none;
  transition:border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard);
}
.idn-input::placeholder{ color:var(--text-faint); }
.idn-input:hover{ border-color:var(--border-strong); }
.idn-input:focus{ border-color:var(--border-focus); box-shadow:var(--ring-focus); }
.idn-input[disabled]{ opacity:.5; cursor:not-allowed; }
.idn-input--mono{ font-family:var(--font-mono); font-size:var(--fs-body-sm); }
.idn-input--sm{ height:var(--control-sm); font-size:var(--fs-body-sm); }
.idn-input--lg{ height:var(--control-lg); font-size:var(--fs-body-lg); }
.idn-input--haspre{ padding-left:38px; }
.idn-input--hassuf{ padding-right:38px; }
.idn-input--err{ border-color:var(--danger); }
.idn-input--err:focus{ box-shadow:var(--ring-danger); }
.idn-input__affix{ position:absolute; display:flex; align-items:center; justify-content:center; color:var(--text-faint); pointer-events:none; }
.idn-input__affix svg{ width:16px; height:16px; }
.idn-input__affix--pre{ left:12px; }
.idn-input__affix--suf{ right:12px; }
textarea.idn-input{ height:auto; min-height:84px; padding:10px 13px; line-height:1.5; resize:vertical; }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-input-css')) {
  const s = document.createElement('style');
  s.id = 'idn-input-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Input({
  label,
  hint,
  error,
  required,
  prefix,
  suffix,
  size = 'md',
  mono = false,
  multiline = false,
  id,
  className = '',
  ...rest
}) {
  const fid = id || (label ? 'idn-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const inputCls = ['idn-input', mono && 'idn-input--mono', size !== 'md' && `idn-input--${size}`, prefix && 'idn-input--haspre', suffix && 'idn-input--hassuf', error && 'idn-input--err', className].filter(Boolean).join(' ');
  const control = multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    id: fid,
    className: inputCls
  }, rest)) : /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: inputCls
  }, rest));
  return /*#__PURE__*/React.createElement("div", {
    className: "idn-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "idn-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "idn-inputwrap"
  }, prefix && /*#__PURE__*/React.createElement("span", {
    className: "idn-input__affix idn-input__affix--pre"
  }, prefix), control, suffix && /*#__PURE__*/React.createElement("span", {
    className: "idn-input__affix idn-input__affix--suf"
  }, suffix)), error ? /*#__PURE__*/React.createElement("span", {
    className: "idn-field__err"
  }, error) : hint && /*#__PURE__*/React.createElement("span", {
    className: "idn-field__hint"
  }, hint));
}
// build-touch: 1781050249683
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.idn-selectwrap{ position:relative; display:flex; align-items:center; }
.idn-select{
  width:100%; height:var(--control-md); padding:0 38px 0 13px; border-radius:var(--radius-md);
  background:var(--surface-inset); color:var(--text-strong); border:1px solid var(--border-default);
  font-family:var(--font-text); font-size:var(--fs-body); line-height:1; outline:none; cursor:pointer;
  appearance:none; -webkit-appearance:none;
  transition:border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard);
}
.idn-select:hover{ border-color:var(--border-strong); }
.idn-select:focus{ border-color:var(--border-focus); box-shadow:var(--ring-focus); }
.idn-select[disabled]{ opacity:.5; cursor:not-allowed; }
.idn-select--sm{ height:var(--control-sm); font-size:var(--fs-body-sm); }
.idn-select--err{ border-color:var(--danger); }
.idn-select__chev{ position:absolute; right:13px; pointer-events:none; color:var(--text-faint); display:flex; }
.idn-select__chev svg{ width:14px; height:14px; }
.idn-select option{ background:var(--surface-2); color:var(--text-strong); }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-select-css')) {
  const s = document.createElement('style');
  s.id = 'idn-select-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const Chevron = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.6",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3.5 5.5L7 9l3.5-3.5"
}));
function Select({
  label,
  hint,
  error,
  required,
  size = 'md',
  options,
  placeholder,
  id,
  className = '',
  children,
  ...rest
}) {
  const fid = id || (label ? 'idn-sel-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const cls = ['idn-select', size !== 'md' && `idn-select--${size}`, error && 'idn-select--err', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: "idn-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "idn-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "idn-selectwrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    className: cls
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options ? options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  }) : children), /*#__PURE__*/React.createElement("span", {
    className: "idn-select__chev"
  }, /*#__PURE__*/React.createElement(Chevron, null))), error ? /*#__PURE__*/React.createElement("span", {
    className: "idn-field__err"
  }, error) : hint && /*#__PURE__*/React.createElement("span", {
    className: "idn-field__hint"
  }, hint));
}
// build-touch: 1781050249862
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.idn-switch{ display:inline-flex; align-items:center; gap:10px; cursor:pointer; user-select:none; font-family:var(--font-text); }
.idn-switch[data-disabled="true"]{ opacity:.5; cursor:not-allowed; }
.idn-switch input{ position:absolute; opacity:0; width:0; height:0; }
.idn-switch__track{
  position:relative; flex:none; width:38px; height:22px; border-radius:var(--radius-pill);
  background:var(--surface-3); border:1px solid var(--border-strong);
  transition:background var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard);
}
.idn-switch__thumb{
  position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%;
  background:var(--text-body); box-shadow:var(--shadow-xs);
  transition:transform var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-standard);
}
.idn-switch input:focus-visible + .idn-switch__track{ box-shadow:var(--ring-focus); }
.idn-switch input:checked + .idn-switch__track{ background:var(--accent); border-color:var(--accent); }
.idn-switch input:checked + .idn-switch__track .idn-switch__thumb{ transform:translateX(16px); background:var(--text-on-accent); }
.idn-switch--sm .idn-switch__track{ width:32px; height:18px; }
.idn-switch--sm .idn-switch__thumb{ width:13px; height:13px; }
.idn-switch--sm input:checked + .idn-switch__track .idn-switch__thumb{ transform:translateX(14px); }
.idn-switch__label{ font-size:var(--fs-body-sm); color:var(--text-body); }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-switch-css')) {
  const s = document.createElement('style');
  s.id = 'idn-switch-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Switch({
  label,
  size = 'md',
  disabled,
  className = '',
  ...rest
}) {
  const cls = ['idn-switch', size === 'sm' && 'idn-switch--sm', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("label", {
    className: cls,
    "data-disabled": disabled || undefined
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "idn-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "idn-switch__thumb"
  })), label && /*#__PURE__*/React.createElement("span", {
    className: "idn-switch__label"
  }, label));
}
// build-touch: 1781050250371
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
const CSS = `
.idn-tabs{ display:flex; gap:2px; border-bottom:1px solid var(--border-default); }
.idn-tab{
  position:relative; appearance:none; border:0; background:transparent; cursor:pointer;
  font-family:var(--font-text); font-size:var(--fs-body-sm); font-weight:var(--fw-medium);
  color:var(--text-muted); padding:10px 14px; border-radius:var(--radius-sm) var(--radius-sm) 0 0;
  transition:color var(--dur-fast) var(--ease-standard), background var(--dur-fast) var(--ease-standard);
  display:inline-flex; align-items:center; gap:7px;
}
.idn-tab:hover{ color:var(--text-body); background:var(--surface-2); }
.idn-tab[aria-selected="true"]{ color:var(--text-strong); }
.idn-tab__underline{ position:absolute; left:8px; right:8px; bottom:-1px; height:2px; border-radius:2px; background:var(--accent); transform:scaleX(0); transition:transform var(--dur-base) var(--ease-out); }
.idn-tab[aria-selected="true"] .idn-tab__underline{ transform:scaleX(1); }
.idn-tab__count{ font-family:var(--font-mono); font-size:var(--fs-micro); padding:1px 6px; border-radius:var(--radius-pill); background:var(--surface-3); color:var(--text-muted); }
.idn-tab[aria-selected="true"] .idn-tab__count{ background:var(--accent-soft); color:var(--accent); }
.idn-tabs--pill{ border:0; gap:4px; background:var(--surface-inset); padding:4px; border-radius:var(--radius-lg); display:inline-flex; }
.idn-tabs--pill .idn-tab{ border-radius:var(--radius-md); padding:7px 13px; }
.idn-tabs--pill .idn-tab[aria-selected="true"]{ background:var(--surface-2); }
.idn-tabs--pill .idn-tab__underline{ display:none; }
`;
if (typeof document !== 'undefined' && !document.getElementById('idn-tabs-css')) {
  const s = document.createElement('style');
  s.id = 'idn-tabs-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Tabs({
  tabs,
  value,
  onChange,
  variant = 'underline',
  className = ''
}) {
  const [internal, setInternal] = React.useState(value ?? (tabs[0] && (tabs[0].id ?? tabs[0])));
  const active = value !== undefined ? value : internal;
  const select = id => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: ['idn-tabs', variant === 'pill' && 'idn-tabs--pill', className].filter(Boolean).join(' '),
    role: "tablist"
  }, tabs.map(t => {
    const id = t.id ?? t;
    const label = t.label ?? t;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      className: "idn-tab",
      role: "tab",
      "aria-selected": active === id,
      onClick: () => select(id)
    }, t.icon, /*#__PURE__*/React.createElement("span", null, label), t.count != null && /*#__PURE__*/React.createElement("span", {
      className: "idn-tab__count"
    }, t.count), /*#__PURE__*/React.createElement("span", {
      className: "idn-tab__underline"
    }));
  }));
}
// build-touch: 1781050251192
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// explorations/design-canvas.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Exports (to window): DesignCanvas, DCSection, DCArtboard, DCPostIt.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>
//
// Artboards are static design frames, not scroll regions — never use
// height: 100% + overflow: auto/scroll on inner elements; size each artboard
// to fit its content (explicit pixel height, or let it grow).
/* END USAGE */

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// Recursively unwrap React.Fragment so <>…</> grouping doesn't hide
// DCSection/DCArtboard children from the type-based walks below.
function dcFlatten(children) {
  const out = [];
  React.Children.forEach(children, c => {
    if (c && c.type === React.Fragment) out.push(...dcFlatten(c.props.children));else out.push(c);
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Fragments are flattened; wrapping in other
  // elements still opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  dcFlatten(children).forEach(sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    dcFlatten(sec.props.children).forEach(ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // --dc-inv-zoom consumers (.dc-sectionhead's CSS zoom, each section's
      // marginBottom) reflow on every scale change, vertically shifting the
      // world layout — so a world point mathematically pinned under the cursor
      // drifts as you zoom (content creeps up on zoom-in, down on zoom-out).
      // Anchor the DOM element under the cursor instead: record its screen Y,
      // apply the transform + --dc-inv-zoom, then cancel whatever vertical
      // drift the reflow introduced so it stays put on screen.
      let marker = null,
        markerY0 = 0;
      if (k !== 1) {
        const hit = document.elementFromPoint(cx, cy);
        marker = hit && hit.closest ? hit.closest('[data-dc-slot],[data-dc-section]') : null;
        if (marker) markerY0 = marker.getBoundingClientRect().top;
      }
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
      if (marker) {
        // A pure zoom around (cx, cy) maps screen Y → cy + (Y - cy) * k. Any
        // departure after the --dc-inv-zoom reflow is the layout drift.
        const drift = marker.getBoundingClientRect().top - (cy + (markerY0 - cy) * k);
        if (Math.abs(drift) > 0.1) {
          t.y -= drift;
          apply();
        }
      }
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(dcFlatten(children));
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    "data-omelette-chrome": "",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/design-canvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/screens.jsx
try { (() => {
/* ID Nest Console — screens: Overview, Users, Applications, App detail drawer. */

const {
  Button,
  IconButton,
  Badge,
  Tag,
  Avatar,
  Card,
  Switch,
  Input,
  Select,
  Tabs,
  CodeBlock,
  Dialog,
  Toast,
  ToastRail
} = window.ADM;
const AIc = window.AIc,
  AppShell = window.AppShell;

/* ── data ─────────────────────────────────────── */
const USERS = [{
  name: 'Dana Reyes',
  email: 'dana@acme.com',
  conn: 'google',
  status: 'active',
  role: 'Admin',
  last: '2m ago',
  a: true
}, {
  name: 'Mara Lin',
  email: 'mara@acme.com',
  conn: 'github',
  status: 'active',
  role: 'Developer',
  last: '1h ago'
}, {
  name: 'Theo Park',
  email: 'theo@northwind.io',
  conn: 'password',
  status: 'invited',
  role: 'Member',
  last: '—'
}, {
  name: 'Iris Okonkwo',
  email: 'iris@acme.com',
  conn: 'google',
  status: 'active',
  role: 'Developer',
  last: '3h ago'
}, {
  name: 'Sam Whitfield',
  email: 'sam@verdant.co',
  conn: 'password',
  status: 'suspended',
  role: 'Member',
  last: '12d ago'
}, {
  name: 'Priya Nair',
  email: 'priya@acme.com',
  conn: 'github',
  status: 'active',
  role: 'Admin',
  last: 'yesterday'
}, {
  name: 'Leo Marsh',
  email: 'leo@loophole.dev',
  conn: 'google',
  status: 'active',
  role: 'Member',
  last: '5h ago'
}];
const STATUS_TONE = {
  active: 'success',
  invited: 'info',
  suspended: 'danger'
};
const CONN_LABEL = {
  google: 'Google',
  github: 'GitHub',
  password: 'Email'
};
const APPS = [{
  name: 'Acme Web',
  short: 'AW',
  color: '#D9572E',
  type: 'SPA',
  id: 'nest_a91f3c7e',
  mau: '18.2k'
}, {
  name: 'Acme Mobile',
  short: 'AM',
  color: '#3DBF8B',
  type: 'Native',
  id: 'nest_5b2da910',
  mau: '9.6k'
}, {
  name: 'Internal Tools',
  short: 'IT',
  color: '#E8923C',
  type: 'Regular Web',
  id: 'nest_77c0fe21',
  mau: '412'
}, {
  name: 'Billing API',
  short: 'BA',
  color: '#7FB5A6',
  type: 'M2M',
  id: 'nest_c4419b0d',
  mau: '—'
}, {
  name: 'Docs Portal',
  short: 'DP',
  color: '#6E9CD6',
  type: 'SPA',
  id: 'nest_e10a7755',
  mau: '3.1k'
}, {
  name: 'Status Page',
  short: 'SP',
  color: '#C9402C',
  type: 'Regular Web',
  id: 'nest_2f8b41aa',
  mau: '880'
}];
const TYPE_TONE = {
  'SPA': 'accent',
  'Native': 'success',
  'Regular Web': 'info',
  'M2M': 'neutral'
};
const ConnIcon = ({
  c
}) => c === 'google' ? /*#__PURE__*/React.createElement(AIc.google, null) : c === 'github' ? /*#__PURE__*/React.createElement(AIc.github, null) : /*#__PURE__*/React.createElement(AIc.key, null);

/* ── Sparkline ────────────────────────────────── */
function Sparkline({
  data,
  up,
  w = 58,
  h = 22
}) {
  const min = Math.min(...data),
    max = Math.max(...data),
    span = max - min || 1;
  const pts = data.map((d, i) => [i / (data.length - 1) * w, h - 3 - (d - min) / span * (h - 6)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L ${w} ${h} L 0 ${h} Z`;
  const col = up ? 'var(--success)' : 'var(--danger)';
  const gid = 'sg' + Math.round(data[0] * data.length);
  return /*#__PURE__*/React.createElement("svg", {
    className: "adm-stat__spark",
    width: w,
    height: h,
    viewBox: `0 0 ${w} ${h}`,
    fill: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: gid,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: col,
    stopOpacity: "0.22"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: col,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: `url(#${gid})`
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    stroke: col,
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: pts[pts.length - 1][0],
    cy: pts[pts.length - 1][1],
    r: "2",
    fill: col
  }));
}

/* ── Sign-ins bar chart ───────────────────────── */
function SignInChart() {
  const bars = [4.2, 5.5, 4.8, 6.3, 7.0, 5.8, 6.6, 7.4, 6.9, 8.1, 7.7, 9.0];
  const labels = ['25', '26', '27', '28', '29', '30', '31', '01', '02', '03', '04', '05'];
  const max = 10;
  const peak = bars.indexOf(Math.max(...bars));
  const gridVals = [10, 7.5, 5, 2.5, 0];
  const [hover, setHover] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "adm-chart"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-chart__plot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-chart__grid"
  }, gridVals.map(v => /*#__PURE__*/React.createElement("div", {
    key: v,
    className: "adm-chart__gline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-chart__gval"
  }, v ? v + 'k' : '0')))), /*#__PURE__*/React.createElement("div", {
    className: "adm-bars"
  }, bars.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "adm-bars__col",
    "data-peak": i === peak,
    "data-hover": hover === i,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(h => h === i ? null : h)
  }, hover === i && /*#__PURE__*/React.createElement("span", {
    className: "adm-bars__tip"
  }, b.toFixed(1), "k sign-ins"), /*#__PURE__*/React.createElement("div", {
    className: "adm-bars__track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-bars__bar",
    style: {
      height: `${b / max * 100}%`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "adm-bars__lbl"
  }, labels[i]))))));
}

/* ── Overview ─────────────────────────────────── */
function Overview({
  onOpen
}) {
  const stats = [{
    label: 'Active users',
    period: '30 days',
    val: '31,204',
    delta: '+12.4%',
    good: true,
    dir: 'up',
    spark: [20, 22, 21, 24, 26, 25, 28, 27, 29, 31]
  }, {
    label: 'Sign-ins today',
    period: 'vs. yesterday',
    val: '8,917',
    delta: '+3.1%',
    good: true,
    dir: 'up',
    spark: [6, 7, 6.5, 7.5, 7, 8, 8.5, 8, 8.7, 8.9]
  }, {
    label: 'Applications',
    period: 'active',
    val: '6',
    delta: '+1',
    good: true,
    dir: 'up',
    spark: [3, 3, 4, 4, 4, 5, 5, 5, 6, 6]
  }, {
    label: 'Failed logins',
    period: '24 hours',
    val: '42',
    delta: '-18%',
    good: true,
    dir: 'down',
    spark: [78, 70, 66, 60, 58, 52, 50, 48, 45, 42]
  }];
  const acts = [{
    who: 'Mara Lin',
    what: 'created application',
    obj: 'Docs Portal',
    time: '2m'
  }, {
    who: 'Dana Reyes',
    what: 'updated policy',
    obj: 'MFA required',
    time: '18m'
  }, {
    who: 'system',
    what: 'rotated signing key',
    obj: 'kid_8f2a',
    time: '1h'
  }, {
    who: 'Theo Park',
    what: 'was invited to',
    obj: 'Acme Inc',
    time: '3h'
  }, {
    who: 'Priya Nair',
    what: 'revoked token for',
    obj: 'Billing API',
    time: '5h'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "adm-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-pagehead"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-pagehead__t"
  }, /*#__PURE__*/React.createElement("h1", null, "Overview"), /*#__PURE__*/React.createElement("p", null, "What\u2019s happening across the Acme tenant.")), /*#__PURE__*/React.createElement("div", {
    className: "adm-pagehead__actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(AIc.ext, null)
  }, "View docs"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(AIc.plus, null),
    onClick: () => onOpen({
      invite: true
    })
  }, "Invite user"))), /*#__PURE__*/React.createElement("div", {
    className: "adm-stats"
  }, stats.map((s, si) => {
    const I = [AIc.users, AIc.trend, AIc.apps, AIc.policies][si];
    return /*#__PURE__*/React.createElement("div", {
      key: s.label,
      className: "adm-stat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "adm-stat__top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "adm-stat__label"
    }, s.label), /*#__PURE__*/React.createElement("span", {
      className: "adm-stat__ic"
    }, /*#__PURE__*/React.createElement(I, null))), /*#__PURE__*/React.createElement("div", {
      className: "adm-stat__val"
    }, s.val), /*#__PURE__*/React.createElement("div", {
      className: "adm-stat__row"
    }, /*#__PURE__*/React.createElement("span", {
      className: `adm-stat__delta adm-stat__delta--${s.good ? 'up' : 'down'}`
    }, /*#__PURE__*/React.createElement(AIc.trend, {
      style: {
        transform: s.dir === 'up' ? 'none' : 'scaleY(-1)'
      }
    }), s.delta), /*#__PURE__*/React.createElement(Sparkline, {
      data: s.spark,
      up: s.good
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "adm-grid2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-panel__head"
  }, /*#__PURE__*/React.createElement("h3", null, "Sign-ins"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-stat__period"
  }, "29,481 total"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "Last 12 days"))), /*#__PURE__*/React.createElement(SignInChart, null)), /*#__PURE__*/React.createElement("div", {
    className: "adm-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-panel__head"
  }, /*#__PURE__*/React.createElement("h3", null, "Recent activity")), /*#__PURE__*/React.createElement("div", null, acts.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "adm-act"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: a.who === 'system' ? 'ID Nest' : a.who,
    size: "sm",
    round: a.who === 'system'
  }), /*#__PURE__*/React.createElement("div", {
    className: "adm-act__txt"
  }, /*#__PURE__*/React.createElement("b", null, a.who), " ", a.what, " ", /*#__PURE__*/React.createElement("b", null, a.obj)), /*#__PURE__*/React.createElement("span", {
    className: "adm-act__time"
  }, a.time)))), /*#__PURE__*/React.createElement("div", {
    className: "adm-panel__foot"
  }, /*#__PURE__*/React.createElement("button", null, "View all activity ", /*#__PURE__*/React.createElement(AIc.chevRight, null))))));
}

/* ── Users ────────────────────────────────────── */
function Users({
  onOpen
}) {
  const [q, setQ] = React.useState('');
  const rows = USERS.filter(u => (u.name + u.email).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    className: "adm-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-pagehead"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Users"), /*#__PURE__*/React.createElement("p", null, "2,438 people across 4 connections.")), /*#__PURE__*/React.createElement("div", {
    className: "adm-pagehead__actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(AIc.filter, null)
  }, "Filter"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(AIc.plus, null),
    onClick: () => onOpen({
      invite: true
    })
  }, "Invite user"))), /*#__PURE__*/React.createElement("div", {
    className: "adm-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-panel__head"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300
    }
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    placeholder: "Search by name or email\u2026",
    value: q,
    onChange: e => setQ(e.target.value),
    prefix: /*#__PURE__*/React.createElement(AIc.search, null)
  })), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, rows.length, " shown")), /*#__PURE__*/React.createElement("table", {
    className: "adm-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "User"), /*#__PURE__*/React.createElement("th", null, "Connection"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Role"), /*#__PURE__*/React.createElement("th", null, "Last login"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(u => /*#__PURE__*/React.createElement("tr", {
    key: u.email,
    onClick: () => onOpen({
      user: u
    })
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "adm-uname"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: u.name,
    size: "sm",
    status: u.status === 'active' ? 'online' : undefined
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "adm-uname__n"
  }, u.name), /*#__PURE__*/React.createElement("div", {
    className: "adm-uname__e"
  }, u.email)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "adm-conn"
  }, /*#__PURE__*/React.createElement(ConnIcon, {
    c: u.conn
  }), CONN_LABEL[u.conn])), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    tone: STATUS_TONE[u.status],
    dot: true
  }, u.status)), /*#__PURE__*/React.createElement("td", null, u.role), /*#__PURE__*/React.createElement("td", {
    className: "adm-mono"
  }, u.last), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-rowarrow"
  }, /*#__PURE__*/React.createElement(AIc.chevRight, null)))))))));
}

/* ── Applications ─────────────────────────────── */
function Applications({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "adm-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-pagehead"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Applications"), /*#__PURE__*/React.createElement("p", null, "OAuth clients connected to this tenant.")), /*#__PURE__*/React.createElement("div", {
    className: "adm-pagehead__actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(AIc.plus, null),
    onClick: () => onOpen({
      newApp: true
    })
  }, "New application"))), /*#__PURE__*/React.createElement("div", {
    className: "adm-apps"
  }, APPS.map(app => /*#__PURE__*/React.createElement("div", {
    key: app.id,
    className: "adm-app",
    onClick: () => onOpen({
      app
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-app__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-app__logo",
    style: {
      background: `color-mix(in srgb, ${app.color} 18%, transparent)`,
      color: app.color
    }
  }, app.short), /*#__PURE__*/React.createElement("div", {
    className: "adm-app__meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-app__name"
  }, app.name), /*#__PURE__*/React.createElement("div", {
    className: "adm-app__id"
  }, app.id))), /*#__PURE__*/React.createElement("div", {
    className: "adm-app__badge"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: TYPE_TONE[app.type]
  }, app.type)), /*#__PURE__*/React.createElement("div", {
    className: "adm-app__foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-app__stat"
  }, /*#__PURE__*/React.createElement("b", null, app.mau), " MAU"), /*#__PURE__*/React.createElement("span", {
    className: "adm-conn",
    style: {
      fontSize: 11
    }
  }, "Manage ", /*#__PURE__*/React.createElement(AIc.chevRight, {
    style: {
      width: 13,
      height: 13
    }
  })))))));
}

/* ── User drawer ──────────────────────────────── */
function UserDrawer({
  user,
  onClose,
  toast
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "adm-drawer__scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "adm-drawer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-drawer__head"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: user.name,
    size: "lg",
    status: user.status === 'active' ? 'online' : undefined
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18,
      color: 'var(--text-strong)'
    }
  }, user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, user.email), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: STATUS_TONE[user.status],
    dot: true
  }, user.status), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, user.role))), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    label: "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16",
    width: "15",
    height: "15",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 4l8 8M12 4l-8 8"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "adm-drawer__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-field__k"
  }, "User ID"), /*#__PURE__*/React.createElement("div", {
    className: "adm-credrow"
  }, /*#__PURE__*/React.createElement("code", null, "usr_a91f3c7e88d20b14"), /*#__PURE__*/React.createElement("button", {
    onClick: () => toast('Copied user ID')
  }, /*#__PURE__*/React.createElement(AIc.copy, null)))), /*#__PURE__*/React.createElement("div", {
    className: "adm-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-field__k"
  }, "Connection"), /*#__PURE__*/React.createElement("span", {
    className: "adm-conn"
  }, /*#__PURE__*/React.createElement(ConnIcon, {
    c: user.conn
  }), CONN_LABEL[user.conn])), /*#__PURE__*/React.createElement("div", {
    className: "adm-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-field__k"
  }, "Roles"), /*#__PURE__*/React.createElement("div", {
    className: "adm-tags"
  }, /*#__PURE__*/React.createElement(Tag, {
    onRemove: () => {}
  }, user.role), /*#__PURE__*/React.createElement(Tag, {
    onRemove: () => {}
  }, "billing:read"), /*#__PURE__*/React.createElement(Tag, null, "+ add"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adm-field__k",
    style: {
      display: 'block',
      marginBottom: 6
    }
  }, "Security"), /*#__PURE__*/React.createElement("div", {
    className: "adm-toggle-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "adm-toggle-row__t"
  }, "Multi-factor auth"), /*#__PURE__*/React.createElement("div", {
    className: "adm-toggle-row__d"
  }, "Require a second factor at sign-in.")), /*#__PURE__*/React.createElement(Switch, {
    defaultChecked: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "adm-toggle-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "adm-toggle-row__t"
  }, "Block sign-ins"), /*#__PURE__*/React.createElement("div", {
    className: "adm-toggle-row__d"
  }, "Temporarily suspend this account.")), /*#__PURE__*/React.createElement(Switch, {
    defaultChecked: user.status === 'suspended'
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: () => toast('Reset link sent')
  }, "Send reset link"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    onClick: () => toast('User removed', 'danger')
  }, "Remove"))));
}

/* ── App detail drawer ────────────────────────── */
function AppDrawer({
  app,
  onClose,
  toast
}) {
  const [tab, setTab] = React.useState('settings');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "adm-drawer__scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "adm-drawer",
    style: {
      width: 480
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-drawer__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-app__logo",
    style: {
      width: 44,
      height: 44,
      background: `color-mix(in srgb, ${app.color} 18%, transparent)`,
      color: app.color
    }
  }, app.short), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18,
      color: 'var(--text-strong)'
    }
  }, app.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: TYPE_TONE[app.type]
  }, app.type))), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    label: "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16",
    width: "15",
    height: "15",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 4l8 8M12 4l-8 8"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 22px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    tabs: [{
      id: 'settings',
      label: 'Settings'
    }, {
      id: 'creds',
      label: 'Credentials'
    }, {
      id: 'quickstart',
      label: 'Quickstart'
    }],
    value: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("div", {
    className: "adm-drawer__body"
  }, tab === 'settings' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Input, {
    label: "Application name",
    defaultValue: app.name
  }), /*#__PURE__*/React.createElement("div", {
    className: "adm-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-field__k"
  }, "Allowed callback URLs"), /*#__PURE__*/React.createElement("div", {
    className: "adm-tags"
  }, /*#__PURE__*/React.createElement(Tag, {
    onRemove: () => {}
  }, "https://acme.com/callback"), /*#__PURE__*/React.createElement(Tag, {
    onRemove: () => {}
  }, "http://localhost:3000/cb"))), /*#__PURE__*/React.createElement(Select, {
    label: "Token endpoint auth",
    options: ['None (PKCE)', 'Client secret (Basic)', 'Client secret (POST)'],
    defaultValue: "None (PKCE)"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adm-field__k",
    style: {
      display: 'block',
      marginBottom: 6
    }
  }, "Grants"), /*#__PURE__*/React.createElement("div", {
    className: "adm-toggle-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "adm-toggle-row__t"
  }, "Authorization code")), /*#__PURE__*/React.createElement(Switch, {
    defaultChecked: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "adm-toggle-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "adm-toggle-row__t"
  }, "Refresh token rotation"), /*#__PURE__*/React.createElement("div", {
    className: "adm-toggle-row__d"
  }, "Issue a new refresh token on every use.")), /*#__PURE__*/React.createElement(Switch, {
    defaultChecked: true
  })))), tab === 'creds' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "adm-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-field__k"
  }, "Client ID"), /*#__PURE__*/React.createElement("div", {
    className: "adm-credrow"
  }, /*#__PURE__*/React.createElement("code", null, app.id), /*#__PURE__*/React.createElement("button", {
    onClick: () => toast('Copied client ID')
  }, /*#__PURE__*/React.createElement(AIc.copy, null)))), /*#__PURE__*/React.createElement("div", {
    className: "adm-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-field__k"
  }, "Client secret"), /*#__PURE__*/React.createElement("div", {
    className: "adm-credrow"
  }, /*#__PURE__*/React.createElement("code", null, "•".repeat(28)), /*#__PURE__*/React.createElement("button", {
    onClick: () => toast('Copied client secret')
  }, /*#__PURE__*/React.createElement(AIc.copy, null)))), /*#__PURE__*/React.createElement("div", {
    className: "adm-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-field__k"
  }, "Domain"), /*#__PURE__*/React.createElement("div", {
    className: "adm-credrow"
  }, /*#__PURE__*/React.createElement("code", null, "acme.idnest.app"), /*#__PURE__*/React.createElement("button", {
    onClick: () => toast('Copied domain')
  }, /*#__PURE__*/React.createElement(AIc.copy, null)))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(AIc.key, null),
    onClick: () => toast('Secret rotated', 'warning')
  }, "Rotate secret")), tab === 'quickstart' && /*#__PURE__*/React.createElement(CodeBlock, {
    title: "app.ts",
    language: "ts"
  }, /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "import"), " { IDNest } ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "from"), " ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"@idnest/sdk\""), "\n\n", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "const"), " nest = ", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "IDNest"), "({\n", "  domain: ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"acme.idnest.app\""), ",\n", "  clientId: ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"", app.id, "\""), ",\n", "})\n\n", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "await"), " nest.", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "login"), "({ scope: ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"openid profile\""), " })"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => {
      toast('Changes saved');
      onClose();
    }
  }, "Save changes"))));
}

/* ── Controller ───────────────────────────────── */
function ConsoleApp() {
  const [active, setActive] = React.useState('overview');
  const [drawer, setDrawer] = React.useState(null);
  const [invite, setInvite] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);
  const toast = (title, tone = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, {
      id,
      title,
      tone
    }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
  };
  const open = d => {
    if (d.invite || d.newApp) setInvite(d);else setDrawer(d);
  };
  const screen = {
    overview: /*#__PURE__*/React.createElement(Overview, {
      onOpen: open
    }),
    users: /*#__PURE__*/React.createElement(Users, {
      onOpen: open
    }),
    apps: /*#__PURE__*/React.createElement(Applications, {
      onOpen: open
    }),
    policies: /*#__PURE__*/React.createElement(Placeholder, {
      title: "Policies",
      sub: "Define MFA, password, and session rules."
    }),
    connections: /*#__PURE__*/React.createElement(Placeholder, {
      title: "Connections",
      sub: "Social, enterprise, and database connections."
    }),
    logs: /*#__PURE__*/React.createElement(Placeholder, {
      title: "Logs",
      sub: "Every authentication event, streamable."
    }),
    settings: /*#__PURE__*/React.createElement(Placeholder, {
      title: "Settings",
      sub: "Tenant configuration and branding."
    })
  }[active];
  return /*#__PURE__*/React.createElement(AppShell, {
    active: active,
    onNav: id => {
      setActive(id);
      setDrawer(null);
    }
  }, screen, drawer && drawer.user && /*#__PURE__*/React.createElement(UserDrawer, {
    user: drawer.user,
    onClose: () => setDrawer(null),
    toast: toast
  }), drawer && drawer.app && /*#__PURE__*/React.createElement(AppDrawer, {
    app: drawer.app,
    onClose: () => setDrawer(null),
    toast: toast
  }), invite && /*#__PURE__*/React.createElement(Dialog, {
    open: true,
    onClose: () => setInvite(false),
    icon: invite.newApp ? /*#__PURE__*/React.createElement(AIc.apps, null) : /*#__PURE__*/React.createElement(AIc.users, null),
    title: invite.newApp ? 'New application' : 'Invite a user',
    description: invite.newApp ? 'Register an OAuth client for this tenant.' : 'They’ll get an email to set up their account.',
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setInvite(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => {
        setInvite(false);
        toast(invite.newApp ? 'Application created' : 'Invitation sent');
      }
    }, invite.newApp ? 'Create' : 'Send invite'))
  }, invite.newApp ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Name",
    placeholder: "My App"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Application type",
    options: ['Single-Page App', 'Native', 'Regular Web App', 'Machine to Machine']
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "teammate@acme.com",
    prefix: /*#__PURE__*/React.createElement(AIc.users, null)
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Role",
    options: ['Member', 'Developer', 'Admin']
  }))), /*#__PURE__*/React.createElement(ToastRail, null, toasts.map(t => /*#__PURE__*/React.createElement(Toast, {
    key: t.id,
    tone: t.tone,
    title: t.title,
    onClose: () => setToasts(x => x.filter(z => z.id !== t.id))
  }))));
}
function Placeholder({
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "adm-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-pagehead"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, title), /*#__PURE__*/React.createElement("p", null, sub))), /*#__PURE__*/React.createElement("div", {
    className: "adm-panel",
    style: {
      padding: '64px 24px',
      textAlign: 'center',
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '.1em',
      textTransform: 'uppercase'
    }
  }, "Section preview"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 8,
      fontSize: 13.5
    }
  }, "This area follows the same shell, table, and panel patterns shown in Overview, Users & Applications.")));
}
Object.assign(window, {
  ConsoleApp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/shared.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ID Nest Console (admin) — shared shell, icons, styles.
   Exports AppShell + icons to window. */

const A = window.IDNestDesignSystem_c7f3f6;
const AIc = {
  overview: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("rect", {
    x: "2.5",
    y: "2.5",
    width: "6.5",
    height: "6.5",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "11",
    y: "2.5",
    width: "6.5",
    height: "6.5",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2.5",
    y: "11",
    width: "6.5",
    height: "6.5",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "11",
    y: "11",
    width: "6.5",
    height: "6.5",
    rx: "1.5"
  })),
  users: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "7.5",
    cy: "6.5",
    r: "2.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2.5 16.5a5 5 0 0 1 10 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.5 4.2a2.8 2.8 0 0 1 0 5.1M17.5 16.5a5 5 0 0 0-2.8-4.5"
  })),
  apps: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M10 2.5l6.5 3.6v7.8L10 17.5 3.5 13.9V6.1L10 2.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.7 6.2L10 9.8l6.3-3.6M10 9.8v7.5"
  })),
  policies: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M10 2.5l6 2.4v4.3c0 3.7-2.5 6.9-6 8.3-3.5-1.4-6-4.6-6-8.3V4.9l6-2.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.5 10l1.8 1.8L13 8"
  })),
  connections: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M8 12l4-4M6.5 9.5L5 11a3 3 0 0 0 4.2 4.2l1.5-1.5M13.5 10.5L15 9a3 3 0 0 0-4.2-4.2L9.3 6.3"
  })),
  logs: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M4 4.5h12M4 8h12M4 11.5h8M4 15h6"
  })),
  settings: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "10",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 1.8v2.1M10 16.1v2.1M3.2 3.2l1.5 1.5M15.3 15.3l1.5 1.5M1.8 10h2.1M16.1 10h2.1M3.2 16.8l1.5-1.5M15.3 4.7l1.5-1.5"
  })),
  search: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.6 11.6L15.5 15.5"
  })),
  bell: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M10 2.5a5 5 0 0 0-5 5c0 5-2 6-2 6h14s-2-1-2-6a5 5 0 0 0-5-5ZM8.5 16.5a1.7 1.7 0 0 0 3 0"
  })),
  plus: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M8 3v10M3 8h10"
  })),
  chevDown: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M4 6.5L8 10l4-3.5"
  })),
  chevRight: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M6.5 4L10 8l-3.5 4"
  })),
  dots: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "currentColor"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "3.5",
    r: "1.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "1.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "12.5",
    r: "1.4"
  })),
  copy: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("rect", {
    x: "5.5",
    y: "5.5",
    width: "8",
    height: "8",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 10.5V4a1.5 1.5 0 0 1 1.5-1.5H11"
  })),
  ext: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M9 3.5h3.5V7M12.5 3.5L7 9M11 9.5v2A1.5 1.5 0 0 1 9.5 13h-5A1.5 1.5 0 0 1 3 11.5v-5A1.5 1.5 0 0 1 4.5 5h2"
  })),
  key: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "5.5",
    cy: "10.5",
    r: "2.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.5 8.5l5-5M11 5l1.5 1.5M9.5 6.5L11 8"
  })),
  trend: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M2 11l3.5-3.5 2.5 2.5L14 4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 4h4v4"
  })),
  filter: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M2.5 4h11M4.5 8h7M6.5 12h3"
  })),
  logout: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M6 13.5H3.5A1.5 1.5 0 0 1 2 12V4a1.5 1.5 0 0 1 1.5-1.5H6M10.5 11l3-3-3-3M13.5 8H6"
  })),
  google: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18"
  }, p), /*#__PURE__*/React.createElement("path", {
    fill: "#EA4335",
    d: "M9 7.4v3.3h4.6A4 4 0 0 1 9 13.5 4.5 4.5 0 1 1 12 5.6l2.4-2.3A8 8 0 1 0 17 9c0-.5 0-.9-.1-1.6Z"
  })),
  github: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "currentColor"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M9 1.5a7.5 7.5 0 0 0-2.4 14.6c.4 0 .5-.2.5-.4v-1.3c-2 .4-2.5-.9-2.5-.9-.4-.9-.9-1.1-.9-1.1-.7-.5 0-.5 0-.5.7 0 1.1.8 1.1.8.7 1.1 1.8.8 2.2.6 0-.5.3-.8.5-1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.5.8-2 0-.2-.4-1 .1-2 0 0 .6-.2 2 .8a7 7 0 0 1 3.6 0c1.4-1 2-.8 2-.8.5 1 .1 1.8.1 2 .5.5.8 1.2.8 2 0 2.8-1.7 3.4-3.3 3.6.3.2.5.7.5 1.4v2c0 .2.1.5.5.4A7.5 7.5 0 0 0 9 1.5Z"
  }))
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
{
  let _s = document.getElementById('adm-css');
  if (!_s) {
    _s = document.createElement('style');
    _s.id = 'adm-css';
    document.head.appendChild(_s);
  }
  _s.textContent = ADM_CSS;
}
const NAV_MAIN = [{
  id: 'overview',
  label: 'Overview',
  icon: 'overview'
}, {
  id: 'users',
  label: 'Users',
  icon: 'users',
  badge: '2.4k'
}, {
  id: 'apps',
  label: 'Applications',
  icon: 'apps',
  badge: '6'
}, {
  id: 'policies',
  label: 'Policies',
  icon: 'policies'
}, {
  id: 'connections',
  label: 'Connections',
  icon: 'connections'
}, {
  id: 'logs',
  label: 'Logs',
  icon: 'logs'
}];
const NAV_LABEL = {
  overview: 'Overview',
  users: 'Users',
  apps: 'Applications',
  policies: 'Policies',
  connections: 'Connections',
  logs: 'Logs',
  settings: 'Settings'
};
function AppShell({
  active,
  onNav,
  children
}) {
  const {
    Avatar
  } = A;
  return /*#__PURE__*/React.createElement("div", {
    className: "adm"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "adm-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-side__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/idnest-mark.svg",
    alt: ""
  }), " ID Nest"), /*#__PURE__*/React.createElement("div", {
    className: "adm-tenant"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-tenant__logo"
  }, "A"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "adm-tenant__name"
  }, "Acme Inc"), /*#__PURE__*/React.createElement("div", {
    className: "adm-tenant__env"
  }, "production")), /*#__PURE__*/React.createElement(AIc.chevDown, null)), /*#__PURE__*/React.createElement("div", {
    className: "adm-navlabel"
  }, "Manage"), NAV_MAIN.map(n => {
    const I = AIc[n.icon];
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      className: "adm-nav",
      "data-active": active === n.id,
      onClick: () => onNav(n.id)
    }, /*#__PURE__*/React.createElement(I, null), /*#__PURE__*/React.createElement("span", null, n.label), n.badge && /*#__PURE__*/React.createElement("span", {
      className: "adm-nav__badge"
    }, n.badge));
  }), /*#__PURE__*/React.createElement("div", {
    className: "adm-navlabel"
  }, "Workspace"), /*#__PURE__*/React.createElement("button", {
    className: "adm-nav",
    "data-active": active === 'settings',
    onClick: () => onNav('settings')
  }, /*#__PURE__*/React.createElement(AIc.settings, null), /*#__PURE__*/React.createElement("span", null, "Settings")), /*#__PURE__*/React.createElement("div", {
    className: "adm-side__foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-user"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Dana Reyes",
    size: "sm",
    status: "online"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "adm-user__name"
  }, "Dana Reyes"), /*#__PURE__*/React.createElement("div", {
    className: "adm-user__mail"
  }, "dana@acme.com")), /*#__PURE__*/React.createElement(AIc.logout, null)))), /*#__PURE__*/React.createElement("div", {
    className: "adm-main"
  }, /*#__PURE__*/React.createElement("header", {
    className: "adm-top"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "adm-crumb"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adm-crumb__home"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/idnest-mark.svg",
    alt: ""
  }), " Acme"), /*#__PURE__*/React.createElement(AIc.chevRight, null), /*#__PURE__*/React.createElement("b", null, NAV_LABEL[active] || 'Overview')), /*#__PURE__*/React.createElement("div", {
    className: "adm-top__right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adm-search"
  }, /*#__PURE__*/React.createElement(AIc.search, null), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search\u2026"
  }), /*#__PURE__*/React.createElement("kbd", null, "\u2318K")), /*#__PURE__*/React.createElement("div", {
    className: "adm-top__sep"
  }), /*#__PURE__*/React.createElement("button", {
    className: "adm-iconbtn"
  }, /*#__PURE__*/React.createElement(AIc.bell, null), /*#__PURE__*/React.createElement("span", {
    className: "adm-iconbtn__dot"
  })), /*#__PURE__*/React.createElement("button", {
    className: "adm-iconbtn"
  }, /*#__PURE__*/React.createElement(AIc.ext, null)))), children));
}
Object.assign(window, {
  AIc,
  AppShell,
  ADM: A
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/shared.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs/docs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ID Nest — Developer docs. Three-pane docs layout with live nav,
   language tabs, callouts, and the warm code blocks. */

const {
  Button,
  Badge,
  Tabs,
  CodeBlock
} = window.IDNestDesignSystem_c7f3f6;
const DIc = {
  search: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.6 11.6L15.5 15.5"
  })),
  book: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M9 4.5C7.5 3.2 5 3 3 3.3v10C5 13 7.5 13.2 9 14.5M9 4.5c1.5-1.3 4-1.5 6-1.2v10c-2-.3-4.5-.1-6 1.2M9 4.5v10"
  })),
  bolt: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M10 2L4 10h5l-1 6 6-8H9l1-6Z"
  })),
  key: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 10l6-6M12 4l2 2M10 6l2 2"
  })),
  code: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M6 5L2.5 9 6 13M12 5l3.5 4L12 13"
  })),
  info: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "9",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 8v5M9 5.5h.01"
  })),
  arrow: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M3 8h9M8.5 4l4 4-4 4"
  }))
};
const NAV = [{
  group: 'Getting started',
  icon: 'bolt',
  items: [{
    id: 'intro',
    label: 'Introduction'
  }, {
    id: 'quickstart',
    label: 'Quickstart'
  }, {
    id: 'sdks',
    label: 'SDKs'
  }]
}, {
  group: 'Authentication',
  icon: 'key',
  items: [{
    id: 'universal',
    label: 'Universal Login'
  }, {
    id: 'social',
    label: 'Social connections'
  }, {
    id: 'mfa',
    label: 'Multi-factor auth'
  }]
}, {
  group: 'API reference',
  icon: 'code',
  items: [{
    id: 'authorize',
    label: 'GET /authorize'
  }, {
    id: 'token',
    label: 'POST /token'
  }, {
    id: 'userinfo',
    label: 'GET /userinfo'
  }]
}];
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
if (!document.getElementById('dx-css')) {
  const s = document.createElement('style');
  s.id = 'dx-css';
  s.textContent = DOCS_CSS;
  document.head.appendChild(s);
}
const QS_SNIPPETS = {
  Node: /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
    className: "tc"
  }, "// pages/api/auth.ts"), "\n", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "import"), " { IDNest } ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "from"), " ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"@idnest/sdk\""), "\n\n", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "export const"), " nest = ", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "IDNest"), "({\n", "  domain: ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"acme.idnest.app\""), ",\n", "  clientId: ", /*#__PURE__*/React.createElement("span", {
    className: "tn"
  }, "process.env.IDNEST_CLIENT_ID"), ",\n", "})"),
  React: /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "import"), " { IDNestProvider, useUser } ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "from"), " ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"@idnest/react\""), "\n\n", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "function"), " ", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "App"), "() {\n", "  ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "const"), " { user } = ", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "useUser"), "()\n", "  ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "return"), " <", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "h1"), ">Hi {user?.name}</", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "h1"), ">\n}"),
  Python: /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "from"), " idnest ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "import"), " IDNest\n\n", "nest = ", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "IDNest"), "(\n", "    domain=", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"acme.idnest.app\""), ",\n", "    client_id=os.environ[", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"IDNEST_CLIENT_ID\""), "],\n)")
};
function Article({
  id
}) {
  if (id === 'quickstart' || id === 'intro' || !['authorize', 'token', 'userinfo'].includes(id)) {
    const [lang, setLang] = React.useState('Node');
    return /*#__PURE__*/React.createElement("article", {
      className: "dx-article"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dx-eyebrow"
    }, "Getting started"), /*#__PURE__*/React.createElement("h1", null, "Quickstart"), /*#__PURE__*/React.createElement("p", {
      className: "dx-lead"
    }, "Add ID Nest to your app and authenticate your first user in under five minutes. Pick your stack and copy the snippet\u2014no boilerplate, no ceremony."), /*#__PURE__*/React.createElement("h2", {
      id: "install"
    }, "Install the SDK"), /*#__PURE__*/React.createElement("p", null, "Grab the package for your framework. Everything is typed and tree-shakeable."), /*#__PURE__*/React.createElement("div", {
      className: "dx-cb"
    }, /*#__PURE__*/React.createElement(CodeBlock, {
      terminal: true,
      title: "terminal"
    }, /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
      className: "idn-code__prompt"
    }, "$ "), "npm install @idnest/sdk", "\n", /*#__PURE__*/React.createElement("span", {
      className: "tc"
    }, "added 1 package in 0.8s")))), /*#__PURE__*/React.createElement("h2", {
      id: "configure"
    }, "Configure your client"), /*#__PURE__*/React.createElement("p", null, "Create a client with your tenant ", /*#__PURE__*/React.createElement("code", null, "domain"), " and ", /*#__PURE__*/React.createElement("code", null, "clientId"), ". You\u2019ll find both in the ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--text-strong)'
      }
    }, "Console \u2192 Applications"), " view."), /*#__PURE__*/React.createElement("div", {
      className: "dx-tabs"
    }, /*#__PURE__*/React.createElement(Tabs, {
      variant: "pill",
      tabs: ['Node', 'React', 'Python'],
      value: lang,
      onChange: setLang
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement(CodeBlock, {
      title: lang === 'Python' ? 'auth.py' : 'auth.ts',
      language: lang
    }, QS_SNIPPETS[lang]))), /*#__PURE__*/React.createElement("div", {
      className: "dx-callout"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dx-callout__ic"
    }, /*#__PURE__*/React.createElement(DIc.info, null)), /*#__PURE__*/React.createElement("span", {
      className: "dx-callout__t"
    }, /*#__PURE__*/React.createElement("b", null, "Keep secrets server-side."), " For SPAs and native apps, use PKCE\u2014never ship a client secret to the browser. ID Nest enables PKCE by default for public clients.")), /*#__PURE__*/React.createElement("h2", {
      id: "login"
    }, "Trigger a login"), /*#__PURE__*/React.createElement("p", null, "Redirect the user to the hosted Universal Login. After they authenticate, they\u2019ll return to your ", /*#__PURE__*/React.createElement("code", null, "redirect_uri"), " with an authorization code."), /*#__PURE__*/React.createElement("div", {
      className: "dx-cb"
    }, /*#__PURE__*/React.createElement(CodeBlock, {
      title: "login.ts",
      language: "ts"
    }, /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
      className: "tk"
    }, "await"), " nest.", /*#__PURE__*/React.createElement("span", {
      className: "tf"
    }, "login"), "({\n", "  scope: ", /*#__PURE__*/React.createElement("span", {
      className: "ts"
    }, "\"openid profile email\""), ",\n", "  redirectUri: ", /*#__PURE__*/React.createElement("span", {
      className: "ts"
    }, "\"https://acme.com/callback\""), ",\n", "})"))), /*#__PURE__*/React.createElement("div", {
      className: "dx-next"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dx-nextcard"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dx-nextcard__k"
    }, "Next"), /*#__PURE__*/React.createElement("div", {
      className: "dx-nextcard__t"
    }, "Social connections ", /*#__PURE__*/React.createElement(DIc.arrow, null))), /*#__PURE__*/React.createElement("div", {
      className: "dx-nextcard"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dx-nextcard__k"
    }, "Reference"), /*#__PURE__*/React.createElement("div", {
      className: "dx-nextcard__t"
    }, "POST /token ", /*#__PURE__*/React.createElement(DIc.arrow, null)))));
  }
  // API reference page
  const meta = {
    authorize: {
      method: 'GET',
      path: '/authorize',
      desc: 'Start an authorization flow. Redirects the user to Universal Login.'
    },
    token: {
      method: 'POST',
      path: '/oauth/token',
      desc: 'Exchange an authorization code (or refresh token) for tokens.'
    },
    userinfo: {
      method: 'GET',
      path: '/userinfo',
      desc: 'Return claims about the authenticated user for a valid access token.'
    }
  }[id];
  return /*#__PURE__*/React.createElement("article", {
    className: "dx-article"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dx-eyebrow"
  }, "API reference"), /*#__PURE__*/React.createElement("h1", null, meta.path), /*#__PURE__*/React.createElement("p", {
    className: "dx-lead"
  }, meta.desc), /*#__PURE__*/React.createElement("div", {
    className: "dx-endpoint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dx-method"
  }, meta.method), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "https://acme.idnest.app", meta.path)), /*#__PURE__*/React.createElement("h2", {
    id: "request"
  }, "Example request"), /*#__PURE__*/React.createElement("div", {
    className: "dx-cb"
  }, /*#__PURE__*/React.createElement(CodeBlock, {
    terminal: true,
    title: "curl"
  }, /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
    className: "idn-code__prompt"
  }, "$ "), "curl -X ", meta.method, " https://acme.idnest.app", meta.path, " \\\\", "\n", "  -H ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"Authorization: Bearer $ACCESS_TOKEN\"")))), /*#__PURE__*/React.createElement("h2", {
    id: "response"
  }, "Response"), /*#__PURE__*/React.createElement("div", {
    className: "dx-cb"
  }, /*#__PURE__*/React.createElement(CodeBlock, {
    title: "200 OK",
    language: "json"
  }, /*#__PURE__*/React.createElement("code", null, "{\n", "  ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "\"sub\""), ": ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"usr_a91f3c7e\""), ",\n", "  ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "\"email\""), ": ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"dana@acme.com\""), ",\n", "  ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "\"email_verified\""), ": ", /*#__PURE__*/React.createElement("span", {
    className: "tn"
  }, "true"), ",\n", "  ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "\"name\""), ": ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"Dana Reyes\""), "\n}"))));
}
function DocsApp() {
  const [active, setActive] = React.useState('quickstart');
  const toc = ['authorize', 'token', 'userinfo'].includes(active) ? [['request', 'Example request'], ['response', 'Response']] : [['install', 'Install the SDK'], ['configure', 'Configure your client'], ['login', 'Trigger a login']];
  return /*#__PURE__*/React.createElement("div", {
    className: "dx"
  }, /*#__PURE__*/React.createElement("header", {
    className: "dx-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dx-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/idnest-mark.svg",
    alt: ""
  }), " ID Nest ", /*#__PURE__*/React.createElement("span", {
    className: "docs"
  }, "Docs")), /*#__PURE__*/React.createElement("div", {
    className: "dx-search"
  }, /*#__PURE__*/React.createElement(DIc.search, null), " Search docs\u2026 ", /*#__PURE__*/React.createElement("kbd", null, "/")), /*#__PURE__*/React.createElement("div", {
    className: "dx-top__right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dx-ver"
  }, "v2.4"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "Console"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Sign up"))), /*#__PURE__*/React.createElement("aside", {
    className: "dx-side"
  }, NAV.map(g => {
    const I = DIc[g.icon];
    return /*#__PURE__*/React.createElement("div", {
      key: g.group,
      className: "dx-navgroup"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dx-navgroup__h"
    }, /*#__PURE__*/React.createElement(I, null), " ", g.group), g.items.map(it => /*#__PURE__*/React.createElement("button", {
      key: it.id,
      className: "dx-navitem",
      "data-active": active === it.id,
      onClick: () => setActive(it.id)
    }, it.label)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "dx-main"
  }, /*#__PURE__*/React.createElement(Article, {
    id: active,
    key: active
  }), /*#__PURE__*/React.createElement("aside", {
    className: "dx-toc"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dx-toc__h"
  }, "On this page"), toc.map((t, i) => /*#__PURE__*/React.createElement("a", {
    key: t[0],
    "data-active": i === 0
  }, t[1])))));
}
Object.assign(window, {
  DocsApp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs/docs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/login/login.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ID Nest — Hosted login (Universal Login). Brandable auth flow:
   sign in → MFA → consent → success. Single self-contained kit. */

const {
  Button,
  Input,
  Checkbox,
  Badge,
  Avatar
} = window.IDNestDesignSystem_c7f3f6;
const LIc = {
  google: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18"
  }, p), /*#__PURE__*/React.createElement("path", {
    fill: "#EA4335",
    d: "M9 7.4v3.3h4.6A4 4 0 0 1 9 13.5 4.5 4.5 0 1 1 12 5.6l2.4-2.3A8 8 0 1 0 17 9c0-.5 0-.9-.1-1.6Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#34A853",
    d: "M9 17a8 8 0 0 0 5.5-2.1l-2.6-2A4.6 4.6 0 0 1 9 13.5Z",
    opacity: ".9"
  })),
  github: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "currentColor"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M9 1.5a7.5 7.5 0 0 0-2.4 14.6c.4 0 .5-.2.5-.4v-1.3c-2 .4-2.5-.9-2.5-.9-.4-.9-.9-1.1-.9-1.1-.7-.5 0-.5 0-.5.7 0 1.1.8 1.1.8.7 1.1 1.8.8 2.2.6 0-.5.3-.8.5-1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.5.8-2 0-.2-.4-1 .1-2 0 0 .6-.2 2 .8a7 7 0 0 1 3.6 0c1.4-1 2-.8 2-.8.5 1 .1 1.8.1 2 .5.5.8 1.2.8 2 0 2.8-1.7 3.4-3.3 3.6.3.2.5.7.5 1.4v2c0 .2.1.5.5.4A7.5 7.5 0 0 0 9 1.5Z"
  })),
  mail: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("rect", {
    x: "2.5",
    y: "3.5",
    width: "13",
    height: "11",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 5l6 4.5L15 5"
  })),
  lock: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("rect", {
    x: "3.5",
    y: "8",
    width: "11",
    height: "7.5",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 8V6a3 3 0 0 1 6 0v2"
  })),
  shield: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M11 2.5l6.5 2.6v4.6c0 4-2.7 7.4-6.5 9-3.8-1.6-6.5-5-6.5-9V5.1L11 2.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11l2 2 4-4.2"
  })),
  check: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M5 12.5l4.5 4.5L19 7"
  })),
  back: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M9.5 3.5L5 8l4.5 4.5"
  })),
  user: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "6",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 15.5a5.5 5.5 0 0 1 11 0"
  }))
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
if (!document.getElementById('lg-css')) {
  const s = document.createElement('style');
  s.id = 'lg-css';
  s.textContent = LOGIN_CSS;
  document.head.appendChild(s);
}
function Otp() {
  const refs = React.useRef([]);
  const [vals, setVals] = React.useState(['', '', '', '', '', '']);
  const set = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...vals];
    next[i] = v;
    setVals(next);
    if (v && i < 5) refs.current[i + 1] && refs.current[i + 1].focus();
  };
  const key = (i, e) => {
    if (e.key === 'Backspace' && !vals[i] && i > 0) refs.current[i - 1].focus();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "lg-otp"
  }, vals.map((v, i) => /*#__PURE__*/React.createElement("input", {
    key: i,
    ref: el => refs.current[i] = el,
    value: v,
    inputMode: "numeric",
    maxLength: 1,
    onChange: e => set(i, e.target.value),
    onKeyDown: e => key(i, e),
    autoFocus: i === 0
  })));
}
function Secured() {
  return /*#__PURE__*/React.createElement("div", {
    className: "lg-secured"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/idnest-mark.svg",
    alt: ""
  }), " Secured by ", /*#__PURE__*/React.createElement("b", null, "ID Nest"));
}
function HostedLogin() {
  const [step, setStep] = React.useState('signin');
  const [email, setEmail] = React.useState('dana@acme.com');
  return /*#__PURE__*/React.createElement("div", {
    className: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg__noise"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lg-card lg-fade",
    key: step
  }, step === 'signin' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant__logo"
  }, "A"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant__title"
  }, "Welcome to Acme"), /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant__sub"
  }, "Sign in to continue to your dashboard"))), /*#__PURE__*/React.createElement("div", {
    className: "lg-social"
  }, /*#__PURE__*/React.createElement("button", {
    className: "lg-sso",
    onClick: () => setStep('mfa')
  }, /*#__PURE__*/React.createElement(LIc.google, null), " Continue with Google"), /*#__PURE__*/React.createElement("button", {
    className: "lg-sso",
    onClick: () => setStep('mfa')
  }, /*#__PURE__*/React.createElement(LIc.github, null), " Continue with GitHub")), /*#__PURE__*/React.createElement("div", {
    className: "lg-or"
  }, "or"), /*#__PURE__*/React.createElement("div", {
    className: "lg-form"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    prefix: /*#__PURE__*/React.createElement(LIc.mail, null),
    placeholder: "you@company.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    prefix: /*#__PURE__*/React.createElement(LIc.lock, null),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    defaultValue: "supersecret"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lg-row"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Remember me",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "lg-link"
  }, "Forgot password?")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: () => setStep('mfa')
  }, "Sign in")), /*#__PURE__*/React.createElement("div", {
    className: "lg-foot"
  }, "New to Acme? ", /*#__PURE__*/React.createElement("span", {
    className: "lg-link"
  }, "Create an account")), /*#__PURE__*/React.createElement(Secured, null)), step === 'mfa' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "lg-back",
    onClick: () => setStep('signin')
  }, /*#__PURE__*/React.createElement(LIc.back, null), " Back"), /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant__logo",
    style: {
      background: 'var(--accent-soft)',
      color: 'var(--accent)',
      boxShadow: 'none'
    }
  }, /*#__PURE__*/React.createElement(LIc.shield, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant__title"
  }, "Verify it\u2019s you"), /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant__sub"
  }, "Enter the 6-digit code from your authenticator"))), /*#__PURE__*/React.createElement(Otp, null), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      margin: '14px 0 18px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "lg-link"
  }, "Resend code")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: () => setStep('consent')
  }, "Verify"), /*#__PURE__*/React.createElement(Secured, null)), step === 'consent' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "lg-consent__app"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Acme Inc",
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lg-consent__io"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lg-consent__dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lg-consent__dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lg-consent__dot"
  })), /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant__logo",
    style: {
      width: 46,
      height: 46,
      fontSize: 20
    }
  }, "N")), /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant__title",
    style: {
      marginBottom: 4
    }
  }, "Northwind wants access"), /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant__sub",
    style: {
      marginBottom: 0
    }
  }, "to your Acme account ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-body)'
    }
  }, "dana@acme.com")), /*#__PURE__*/React.createElement("ul", {
    className: "lg-scopes"
  }, /*#__PURE__*/React.createElement("li", {
    className: "lg-scope"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lg-scope__ic"
  }, /*#__PURE__*/React.createElement(LIc.user, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lg-scope__t"
  }, "View your profile"), /*#__PURE__*/React.createElement("div", {
    className: "lg-scope__d"
  }, "Name, avatar, and email address"))), /*#__PURE__*/React.createElement("li", {
    className: "lg-scope"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lg-scope__ic"
  }, /*#__PURE__*/React.createElement(LIc.mail, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lg-scope__t"
  }, "Read your team membership"), /*#__PURE__*/React.createElement("div", {
    className: "lg-scope__d"
  }, "Organizations and roles you belong to"))), /*#__PURE__*/React.createElement("li", {
    className: "lg-scope"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lg-scope__ic"
  }, /*#__PURE__*/React.createElement(LIc.shield, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lg-scope__t"
  }, "Offline access"), /*#__PURE__*/React.createElement("div", {
    className: "lg-scope__d"
  }, "Stay signed in via refresh tokens")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: () => setStep('signin')
  }, "Deny"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: () => setStep('done')
  }, "Allow access")), /*#__PURE__*/React.createElement(Secured, null)), step === 'done' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "lg-success"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg-success__ring"
  }, /*#__PURE__*/React.createElement(LIc.check, null)), /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant__title"
  }, "You\u2019re all set"), /*#__PURE__*/React.createElement("div", {
    className: "lg-tenant__sub",
    style: {
      marginTop: 6,
      marginBottom: 22
    }
  }, "Redirecting you back to Northwind\u2026"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setStep('signin')
  }, "Restart demo")), /*#__PURE__*/React.createElement(Secured, null))));
}
Object.assign(window, {
  HostedLogin
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/login/login.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Sections.jsx
try { (() => {
/* ID Nest marketing — page sections. Composes DS components + shared chrome. */

const {
  Button,
  Badge,
  CodeBlock,
  Tabs
} = window.mktUI;
const Ic = window.Ic,
  MARK = window.MARK;
function Nav() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "mkt-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-wrap mkt-nav__in"
  }, /*#__PURE__*/React.createElement("a", {
    className: "mkt-brand",
    href: "#"
  }, /*#__PURE__*/React.createElement("img", {
    src: MARK,
    alt: ""
  }), " ID Nest"), /*#__PURE__*/React.createElement("div", {
    className: "mkt-nav__links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#features"
  }, "Product"), /*#__PURE__*/React.createElement("a", {
    href: "#developers"
  }, "Developers"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Pricing"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Docs"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Company")), /*#__PURE__*/React.createElement("div", {
    className: "mkt-nav__right"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    iconRight: /*#__PURE__*/React.createElement(Ic.arrow, null)
  }, "Start free"))));
}
const HERO_SNIPPETS = {
  Node: /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
    className: "tc"
  }, "// Add ID Nest in three lines"), "\n", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "import"), " { IDNest } ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "from"), " ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"@idnest/sdk\""), "\n\n", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "const"), " nest = ", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "IDNest"), "({ domain: ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"acme.idnest.app\""), " })\n\n", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "await"), " nest.", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "login"), "({ scope: ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"openid profile\""), " })"),
  cURL: /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
    className: "tc"
  }, "# Exchange the code for tokens"), "\n", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "curl"), " -X POST https://acme.idnest.app/oauth/token \\\n", "  -d grant_type=", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "authorization_code"), " \\\n", "  -d code=", /*#__PURE__*/React.createElement("span", {
    className: "tn"
  }, "$CODE"), " \\\n", "  -d client_id=", /*#__PURE__*/React.createElement("span", {
    className: "tn"
  }, "$CLIENT_ID")),
  Python: /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "from"), " idnest ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "import"), " IDNest\n\n", "nest = ", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "IDNest"), "(domain=", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"acme.idnest.app\""), ")\n", "user = nest.", /*#__PURE__*/React.createElement("span", {
    className: "tf"
  }, "verify"), "(request.cookies[", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"session\""), "])\n\n", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "print"), "(user.email)  ", /*#__PURE__*/React.createElement("span", {
    className: "tc"
  }, "# dana@acme.com"))
};
function Hero() {
  const [lang, setLang] = React.useState('Node');
  return /*#__PURE__*/React.createElement("header", {
    className: "mkt-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-glow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mkt-wrap mkt-hero__grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "mkt-eyebrow"
  }, /*#__PURE__*/React.createElement(Ic.fingerprint, {
    style: {
      width: 14,
      height: 14
    }
  }), " OIDC \xB7 OAuth 2.1 \xB7 SAML"), /*#__PURE__*/React.createElement("h1", null, "Identity that gets", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "out of your way.")), /*#__PURE__*/React.createElement("p", {
    className: "mkt-hero__sub"
  }, "Drop-in authentication for the apps you actually ship. Standards-based, developer-first, and warm enough to put your name on. The friendly alternative to enterprise IdPs."), /*#__PURE__*/React.createElement("div", {
    className: "mkt-hero__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Ic.arrow, null)
  }, "Start building free"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    mono: true,
    iconLeft: /*#__PURE__*/React.createElement(Ic.github, null)
  }, "star on github")), /*#__PURE__*/React.createElement("div", {
    className: "mkt-hero__meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Ic.check, null), " No credit card"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Ic.check, null), " 10k MAU free"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Ic.check, null), " SOC 2 Type II"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    variant: "pill",
    tabs: ['Node', 'cURL', 'Python'],
    value: lang,
    onChange: setLang
  })), /*#__PURE__*/React.createElement(CodeBlock, {
    title: lang === 'cURL' ? 'token-exchange.sh' : `quickstart.${lang === 'Python' ? 'py' : 'ts'}`,
    language: lang
  }, HERO_SNIPPETS[lang]))));
}
function Trust() {
  const logos = ['Northwind', 'Verdant', 'Loophole', 'Atlas Pay', 'Cabin', 'Mercato'];
  return /*#__PURE__*/React.createElement("section", {
    className: "mkt-trust"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-wrap mkt-trust__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mkt-trust__label"
  }, "Trusted by teams at"), logos.map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    className: "mkt-logo"
  }, l))));
}
const FEATURES = [{
  ic: 'bolt',
  t: 'Live in an afternoon',
  d: 'Universal Login, SDKs for every stack, and copy-paste snippets. Most teams ship auth the same day they sign up.'
}, {
  ic: 'shield',
  t: 'Secure by default',
  d: 'PKCE, rotating refresh tokens, and short-lived JWTs out of the box. We pass the audit so you don’t sweat it.'
}, {
  ic: 'key',
  t: 'Every standard you need',
  d: 'OIDC, OAuth 2.1, SAML, and SCIM. Social, passkeys, magic links, and enterprise SSO from one tenant.'
}, {
  ic: 'users',
  t: 'Org-aware from day one',
  d: 'Multi-tenant orgs, roles, and fine-grained permissions modeled natively—not bolted on after the fact.'
}, {
  ic: 'globe',
  t: 'Global, low-latency',
  d: 'Token verification at the edge in 14 regions. p99 under 40ms wherever your users sign in.'
}, {
  ic: 'layers',
  t: 'Yours to brand',
  d: 'Theme the hosted login to match your product. Your colors, your domain, your logo—not ours.'
}];
function Features() {
  return /*#__PURE__*/React.createElement("section", {
    className: "mkt-section",
    id: "features"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mkt-eyebrow"
  }, "Why ID Nest"), /*#__PURE__*/React.createElement("h2", {
    className: "mkt-h2"
  }, "A full identity platform,", /*#__PURE__*/React.createElement("br", null), "without the enterprise tax."), /*#__PURE__*/React.createElement("p", {
    className: "mkt-lead"
  }, "Everything you need to authenticate, authorize, and manage users\u2014wrapped in an API you\u2019ll actually enjoy."), /*#__PURE__*/React.createElement("div", {
    className: "mkt-feat"
  }, FEATURES.map(f => {
    const I = Ic[f.ic];
    return /*#__PURE__*/React.createElement("article", {
      key: f.t,
      className: "mkt-fcard"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mkt-fcard__ic"
    }, /*#__PURE__*/React.createElement(I, null)), /*#__PURE__*/React.createElement("h3", null, f.t), /*#__PURE__*/React.createElement("p", null, f.d));
  }))));
}
function Integrate() {
  return /*#__PURE__*/React.createElement("section", {
    className: "mkt-section",
    id: "developers",
    style: {
      background: 'var(--bg-sunken)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-wrap mkt-split"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "mkt-eyebrow"
  }, "Built for developers"), /*#__PURE__*/React.createElement("h2", {
    className: "mkt-h2"
  }, "Auth you can read", /*#__PURE__*/React.createElement("br", null), "in one sitting."), /*#__PURE__*/React.createElement("p", {
    className: "mkt-lead",
    style: {
      marginTop: 14
    }
  }, "Honest docs, predictable APIs, and SDKs that feel native to your framework. No magic, no lock-in."), /*#__PURE__*/React.createElement("ul", {
    className: "mkt-checklist"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "ck"
  }, /*#__PURE__*/React.createElement(Ic.check, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Typed SDKs"), " for Node, React, Python, Go, and Rust\u2014generated from one spec.")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "ck"
  }, /*#__PURE__*/React.createElement(Ic.check, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Local-first dev"), " with a real test tenant and seedable users.")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "ck"
  }, /*#__PURE__*/React.createElement(Ic.check, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Webhooks & logs"), " you can actually grep. Stream every auth event."))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconRight: /*#__PURE__*/React.createElement(Ic.arrow, null)
  }, "Read the docs"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CodeBlock, {
    terminal: true,
    title: "~/acme-app",
    showDots: true
  }, /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("span", {
    className: "idn-code__prompt"
  }, "$ "), "npm i @idnest/sdk", "\n", /*#__PURE__*/React.createElement("span", {
    className: "tc"
  }, "added 1 package in 0.8s"), "\n\n", /*#__PURE__*/React.createElement("span", {
    className: "idn-code__prompt"
  }, "$ "), "idnest dev --tenant acme", "\n", /*#__PURE__*/React.createElement("span", {
    className: "idn-code__ok"
  }, "✔"), " tenant acme.idnest.app ready", "\n", /*#__PURE__*/React.createElement("span", {
    className: "idn-code__ok"
  }, "✔"), " 3 test users seeded", "\n", /*#__PURE__*/React.createElement("span", {
    className: "idn-code__ok"
  }, "✔"), " listening on :4000  ", /*#__PURE__*/React.createElement("span", {
    className: "tc"
  }, "\u2192 try /login"), "\n\n", /*#__PURE__*/React.createElement("span", {
    className: "idn-code__prompt"
  }, "$ "), "curl localhost:4000/userinfo", "\n", "{ ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "\"sub\""), ": ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"usr_a91f\""), ", ", /*#__PURE__*/React.createElement("span", {
    className: "tk"
  }, "\"email\""), ": ", /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, "\"dana@acme.com\""), " }")))));
}
function CtaBand() {
  return /*#__PURE__*/React.createElement("section", {
    className: "mkt-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-glow",
    style: {
      left: '50%',
      top: '-260px',
      right: 'auto',
      transform: 'translateX(-50%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mkt-eyebrow",
    style: {
      position: 'relative'
    }
  }, "Ready when you are"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 14,
      position: 'relative'
    }
  }, "Give your users a warm welcome."), /*#__PURE__*/React.createElement("p", {
    style: {
      position: 'relative'
    }
  }, "Free up to 10,000 monthly active users. Upgrade only when you grow."), /*#__PURE__*/React.createElement("div", {
    className: "mkt-cta__row",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Ic.arrow, null)
  }, "Create free account"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg"
  }, "Talk to us")))));
}
function Footer() {
  const cols = [{
    h: 'Product',
    items: ['Universal Login', 'Authorization', 'Organizations', 'Passkeys', 'Pricing']
  }, {
    h: 'Developers',
    items: ['Documentation', 'API Reference', 'SDKs', 'Changelog', 'Status']
  }, {
    h: 'Company',
    items: ['About', 'Blog', 'Careers', 'Security', 'Contact']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    className: "mkt-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkt-footer__grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    className: "mkt-brand",
    href: "#",
    style: {
      fontSize: 18
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: MARK,
    alt: "",
    style: {
      width: 26,
      height: 26
    }
  }), " ID Nest"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-faint)',
      fontSize: 13.5,
      marginTop: 14,
      maxWidth: '30ch',
      lineHeight: 1.55
    }
  }, "Identity infrastructure for builders. Standards-based auth that feels like home.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("h4", null, c.h), /*#__PURE__*/React.createElement("ul", null, c.items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, i))))))), /*#__PURE__*/React.createElement("div", {
    className: "mkt-footer__bottom"
  }, /*#__PURE__*/React.createElement("span", null, "\u00A9", " 2026 ID Nest, Inc. \\u00b7 SOC 2 Type II \\u00b7 GDPR"), /*#__PURE__*/React.createElement("div", {
    className: "mkt-footer__social"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "GitHub"
  }, /*#__PURE__*/React.createElement(Ic.github, null))))));
}
function MarketingPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mkt"
  }, /*#__PURE__*/React.createElement(Nav, null), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Trust, null), /*#__PURE__*/React.createElement(Features, null), /*#__PURE__*/React.createElement(Integrate, null), /*#__PURE__*/React.createElement(CtaBand, null), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  MarketingPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/shared.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Shared chrome + helpers for the ID Nest marketing site.
   Exports to window for cross-file <script type="text/babel"> sharing. */

const {
  Button,
  Badge,
  CodeBlock,
  Tabs,
  Card,
  Avatar
} = window.IDNestDesignSystem_c7f3f6;
const MARK = "../../assets/idnest-mark.svg";

/* ── Inline icons (stroke, 1.6, matches brand line work) ───────── */
const Ic = {
  shield: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6l7-3Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 12l2 2 4-4"
  })),
  bolt: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M13 2L4 14h7l-1 8 9-12h-7l1-8Z"
  })),
  key: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "15",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 12l9-9M17 6l2 2M14 9l2 2"
  })),
  users: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "8",
    r: "3.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 19a5.5 5.5 0 0 1 11 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 6.2A3.2 3.2 0 0 1 16 12M18 19a5.5 5.5 0 0 0-3-4.9"
  })),
  globe: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, p), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 12h18M12 3c2.5 2.5 3.5 5.7 3.5 9S14.5 18.5 12 21M12 3C9.5 5.5 8.5 8.7 8.5 12s1 6.5 3.5 9"
  })),
  layers: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 3l9 5-9 5-9-5 9-5Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 13l9 5 9-5"
  })),
  fingerprint: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M5 11a7 7 0 0 1 14 0M8 21c-.6-1.5-1-3.2-1-5a5 5 0 0 1 10 0c0 .8 0 1.6-.2 2.4M12 11v5c0 1.4.2 2.8.6 4M9.5 20.5A14 14 0 0 1 9 16"
  })),
  arrow: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M3 8h9M8.5 4l4 4-4 4"
  })),
  check: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M3 8.5l3.2 3.2L13 5"
  })),
  github: p => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.4 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 3.9-1.3 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2Z"
  }))
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
  const s = document.createElement('style');
  s.id = 'mkt-css';
  s.textContent = MKT_CSS;
  document.head.appendChild(s);
}
Object.assign(window, {
  Ic,
  MARK,
  mktUI: {
    Button,
    Badge,
    CodeBlock,
    Tabs,
    Card,
    Avatar
  }
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/shared.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.CodeBlock = __ds_scope.CodeBlock;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.ToastRail = __ds_scope.ToastRail;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
