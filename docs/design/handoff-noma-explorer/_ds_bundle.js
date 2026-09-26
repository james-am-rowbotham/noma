/* @ds-bundle: {"format":4,"namespace":"NomaDesignSystem_02438c","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Checkbox","sourcePath":"components/core/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Radio","sourcePath":"components/core/Radio.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"EvidenceTag","sourcePath":"components/noma/EvidenceTag.jsx"},{"name":"QueryBar","sourcePath":"components/noma/QueryBar.jsx"},{"name":"ScenarioCard","sourcePath":"components/noma/ScenarioCard.jsx"},{"name":"TimeStrip","sourcePath":"components/noma/TimeStrip.jsx"},{"name":"Badge","sourcePath":"components/surfaces/Badge.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Dialog","sourcePath":"components/surfaces/Dialog.jsx"},{"name":"Panel","sourcePath":"components/surfaces/Panel.jsx"},{"name":"Toast","sourcePath":"components/surfaces/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/surfaces/Tooltip.jsx"}],"sourceHashes":{"components/core/Button.jsx":"3fc9f8467ac3","components/core/Checkbox.jsx":"16320ae2a4e1","components/core/IconButton.jsx":"3e608906cae0","components/core/Input.jsx":"42151812c404","components/core/Radio.jsx":"e19fe26e7fe0","components/core/Select.jsx":"a140b3525f49","components/core/Switch.jsx":"618a7428394d","components/core/Tabs.jsx":"3959e6bfa20c","components/noma/EvidenceTag.jsx":"80a98e2e03e6","components/noma/QueryBar.jsx":"f02bb4e5ae09","components/noma/ScenarioCard.jsx":"8a2733141b4a","components/noma/TimeStrip.jsx":"6a41909f433a","components/surfaces/Badge.jsx":"67601fe66daa","components/surfaces/Card.jsx":"4783d33998d2","components/surfaces/Dialog.jsx":"c5e5d6fa6969","components/surfaces/Panel.jsx":"6c37a1c8da1c","components/surfaces/Toast.jsx":"a13a9c34508b","components/surfaces/Tooltip.jsx":"cec273ba2c86","design_handoff_noma_explorer/prototype/chat.jsx":"51d4008ff076","design_handoff_noma_explorer/prototype/data.js":"2ce05897f2da","design_handoff_noma_explorer/prototype/detail-view.jsx":"3434c5fb129a","design_handoff_noma_explorer/prototype/image-slot.js":"fff26d081c8d","design_handoff_noma_explorer/prototype/streams.jsx":"23f461952fc5","design_handoff_noma_explorer/prototype/world-view.jsx":"e893f21fca39","ui_kits/noma/AnswerPanel.jsx":"f7095f8723c8","ui_kits/noma/DetailView.jsx":"3434c5fb129a","ui_kits/noma/Investigation.jsx":"79873a3a2001","ui_kits/noma/MapCanvas.jsx":"ab24bf2486d7","ui_kits/noma/Streams.jsx":"23f461952fc5","ui_kits/noma/WorldView.jsx":"e893f21fca39","ui_kits/noma/data.js":"86777a604fc6","ui_kits/noma/image-slot.js":"fff26d081c8d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NomaDesignSystem_02438c = window.NomaDesignSystem_02438c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  style,
  ...rest
}) {
  const pad = size === 'sm' ? '5px 12px' : size === 'lg' ? '10px 20px' : '7px 16px';
  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    fontSize: size === 'sm' ? 13 : 15,
    padding: pad,
    borderRadius: 'var(--radius-2)',
    border: '1px solid transparent',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--dur-fast),border-color var(--dur-fast)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    lineHeight: 1.2
  };
  const v = {
    primary: {
      background: 'var(--accent)',
      color: '#fff'
    },
    secondary: {
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      borderColor: 'var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)'
    },
    dark: {
      background: 'var(--ink-1)',
      color: 'var(--paper-1)'
    }
  }[variant] || {};
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    style: {
      ...base,
      ...v,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: 'var(--text-body)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 'var(--radius-1)',
      border: '1px solid ' + (checked ? 'var(--accent)' : 'var(--border-strong)'),
      background: checked ? 'var(--accent)' : 'var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 11,
      lineHeight: 1,
      transition: 'background var(--dur-fast)'
    }
  }, checked ? '✓' : ''), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  label,
  active,
  disabled,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    disabled: disabled,
    style: {
      width: 32,
      height: 32,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-2)',
      border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border-default)'),
      background: active ? 'var(--accent-soft)' : 'var(--surface-card)',
      color: active ? 'var(--accent-ink)' : 'var(--text-muted)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur-fast)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  mono,
  style,
  inputStyle,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 13,
      color: 'var(--text-muted)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 4,
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '7px 10px',
      fontSize: 15,
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      color: 'var(--text-body)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-2)',
      outline: 'none',
      ...inputStyle
    }
  }, rest)), hint && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Radio.jsx
try { (() => {
function Radio({
  label,
  checked,
  onChange,
  name,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: 'var(--text-body)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      border: checked ? '5px solid var(--accent)' : '1px solid var(--border-strong)',
      background: 'var(--surface-card)',
      boxSizing: 'border-box',
      transition: 'border var(--dur-fast)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    checked: !!checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Radio.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  options = [],
  style,
  selectStyle,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 13,
      color: 'var(--text-muted)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 4,
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("select", _extends({
    style: {
      width: '100%',
      padding: '7px 8px',
      fontSize: 15,
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-body)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-2)',
      outline: 'none',
      ...selectStyle
    }
  }, rest), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  onChange,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: 'var(--text-body)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 18,
      borderRadius: 999,
      background: checked ? 'var(--accent)' : 'var(--line-2)',
      position: 'relative',
      transition: 'background var(--dur-fast)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 16 : 2,
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: '#fff',
      transition: 'left var(--dur-fast)'
    }
  })), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 2,
      borderBottom: '1px solid var(--border-default)',
      ...style
    }
  }, tabs.map(t => {
    const a = t === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      role: "tab",
      "aria-selected": a,
      onClick: () => onChange && onChange(t),
      style: {
        padding: '8px 12px',
        fontSize: 14,
        fontFamily: 'var(--font-sans)',
        fontWeight: a ? 600 : 400,
        color: a ? 'var(--text-body)' : 'var(--text-muted)',
        background: 'none',
        border: 'none',
        borderBottom: a ? '2px solid var(--accent)' : '2px solid transparent',
        marginBottom: -1,
        cursor: 'pointer'
      }
    }, t);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/noma/EvidenceTag.jsx
try { (() => {
const COLORS = {
  observed: 'var(--ev-observed)',
  historical: 'var(--ev-historical)',
  retrieved: 'var(--ev-retrieved)',
  calculated: 'var(--ev-calculated)',
  modelled: 'var(--ev-modelled)',
  simulated: 'var(--ev-simulated)',
  inferred: 'var(--ev-inferred)',
  forecast: 'var(--ev-forecast)'
};
function EvidenceTag({
  kind = 'observed',
  onInspect,
  dark,
  style
}) {
  const c = COLORS[kind] || COLORS.observed;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onInspect,
    title: onInspect ? 'Inspect evidence' : undefined,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: dark ? 'var(--map-ink-2)' : 'var(--text-muted)',
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: onInspect ? 'pointer' : 'default',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: c
    }
  }), kind);
}
Object.assign(__ds_scope, { EvidenceTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/noma/EvidenceTag.jsx", error: String((e && e.message) || e) }); }

// components/noma/QueryBar.jsx
try { (() => {
function QueryBar({
  placeholder = "Ask about this place…",
  suggestions = [],
  examples = [],
  onAsk,
  embedded,
  leading,
  trailing,
  placement = 'above',
  style
}) {
  const [v, set] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const [ix, setIx] = React.useState(0);
  React.useEffect(() => {
    if (!examples.length || v) return;
    const t = setInterval(() => setIx(i => (i + 1) % examples.length), 3800);
    return () => clearInterval(t);
  }, [examples.length, v]);
  const ex = examples.length ? examples[ix % examples.length] : null;
  const submit = q => {
    if (onAsk && q.trim()) onAsk(q.trim());
    set('');
  };
  const showSugg = focus && !v && suggestions.length > 0;
  return /*#__PURE__*/React.createElement("div", {
    className: embedded ? undefined : 'nm-glass',
    style: {
      position: 'relative',
      width: '100%',
      ...style
    }
  }, showSugg && /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      ...(placement === 'below' ? {
        top: 'calc(100% + 8px)'
      } : {
        bottom: 'calc(100% + 8px)'
      }),
      borderRadius: 'var(--glass-radius)',
      padding: 6,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.08em',
      color: 'var(--text-faint)',
      padding: '4px 10px 6px'
    }
  }, "TRY ASKING"), suggestions.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onMouseDown: e => {
      e.preventDefault();
      submit(s);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      fontSize: 14,
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-body)',
      background: 'none',
      border: 'none',
      borderRadius: 'var(--radius-2)',
      padding: '6px 10px',
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--glass-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'none'
  }, s))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      submit(v);
    },
    className: embedded ? undefined : 'nm-glass-surface',
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      borderRadius: 'var(--radius-pill)',
      padding: embedded ? '2px 2px 2px 6px' : '6px 8px 6px 18px'
    }
  }, leading, /*#__PURE__*/React.createElement("input", {
    value: v,
    onChange: e => set(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    onKeyDown: e => {
      if (e.key === 'Tab' && !v && ex) {
        e.preventDefault();
        set(ex);
      }
    },
    placeholder: ex ? 'Try: ' + ex + '   ⇥' : placeholder,
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'none',
      fontSize: 15,
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-body)'
    }
  }), trailing, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    "aria-label": "Ask",
    style: {
      width: 32,
      height: 32,
      flex: 'none',
      borderRadius: '50%',
      border: 'none',
      background: 'var(--ink-1)',
      color: 'var(--paper-1)',
      cursor: 'pointer',
      fontSize: 15,
      lineHeight: 1
    }
  }, "\u2191")));
}
Object.assign(__ds_scope, { QueryBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/noma/QueryBar.jsx", error: String((e && e.message) || e) }); }

// components/noma/ScenarioCard.jsx
try { (() => {
function ScenarioCard({
  question,
  params = [],
  running,
  onRun,
  onAdvanced,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    style: {
      borderRadius: 'var(--glass-radius)',
      padding: 16,
      width: 280,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 12
    }
  }, question), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px 16px',
      marginBottom: 14
    }
  }, params.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.08em',
      color: 'var(--text-faint)',
      textTransform: 'uppercase'
    }
  }, p.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      marginTop: 2
    }
  }, p.value)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onRun,
    disabled: running,
    style: {
      flex: 1,
      padding: '8px 0',
      fontSize: 14,
      fontWeight: 500,
      fontFamily: 'var(--font-sans)',
      color: '#fff',
      background: 'var(--accent)',
      border: 'none',
      borderRadius: 'var(--radius-2)',
      cursor: 'pointer',
      opacity: running ? 0.6 : 1
    }
  }, running ? 'Running…' : 'Run simulation'), onAdvanced && /*#__PURE__*/React.createElement("button", {
    onClick: onAdvanced,
    style: {
      fontSize: 13,
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-muted)',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  }, "Advanced")));
}
Object.assign(__ds_scope, { ScenarioCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/noma/ScenarioCard.jsx", error: String((e && e.message) || e) }); }

// components/noma/TimeStrip.jsx
try { (() => {
function TimeStrip({
  range = '7d',
  ranges = ['24h', '7d', '30d', '1y', 'Historical'],
  onChange,
  marks = [],
  now = 'Now',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      borderRadius: 'var(--radius-pill)',
      padding: '6px 14px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.08em',
      color: 'var(--text-faint)'
    }
  }, "TIME"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2
    }
  }, ranges.map(r => {
    const a = r === range;
    return /*#__PURE__*/React.createElement("button", {
      key: r,
      onClick: () => onChange && onChange(r),
      style: {
        fontSize: 13,
        fontFamily: 'var(--font-sans)',
        fontWeight: a ? 600 : 400,
        color: a ? 'var(--text-body)' : 'var(--text-muted)',
        background: a ? 'var(--surface-inset)' : 'none',
        border: 'none',
        borderRadius: 'var(--radius-pill)',
        padding: '4px 10px',
        cursor: 'pointer'
      }
    }, r);
  })), marks.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 3
    }
  }, marks.map((m, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    title: m.label,
    style: {
      width: m.major ? 7 : 5,
      height: m.major ? 7 : 5,
      borderRadius: '50%',
      background: m.major ? 'var(--accent)' : 'var(--line-2)'
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, now));
}
Object.assign(__ds_scope, { TimeStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/noma/TimeStrip.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Badge.jsx
try { (() => {
function Badge({
  tone = 'neutral',
  children,
  style
}) {
  const c = {
    neutral: 'var(--text-muted)',
    ok: 'var(--ok)',
    caution: 'var(--caution)',
    alert: 'var(--alert)',
    accent: 'var(--accent-ink)'
  }[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: c,
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-pill)',
      padding: '3px 10px',
      background: 'var(--surface-card)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: c
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Badge.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  title,
  label,
  floating,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: floating ? 'nm-glass nm-glass-surface' : undefined,
    style: {
      ...(floating ? {
        borderRadius: 'var(--glass-radius)'
      } : {
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-2)'
      }),
      padding: 16,
      ...style
    }
  }, rest), label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.08em',
      color: 'var(--text-faint)',
      textTransform: 'uppercase',
      marginBottom: 6
    }
  }, label), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 8
    }
  }, title), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  onClose,
  children,
  footer,
  width = 440
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(28,27,24,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    role: "dialog",
    style: {
      width,
      maxWidth: '90vw',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-3)',
      boxShadow: 'var(--shadow-3)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 600
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: 18,
      color: 'var(--text-faint)',
      lineHeight: 1
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 16
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Panel.jsx
try { (() => {
function Panel({
  title,
  meta,
  defaultOpen = true,
  open,
  onToggle,
  collapsible = true,
  glass = true,
  children,
  style,
  bodyStyle
}) {
  const [o, setO] = React.useState(defaultOpen);
  const isOpen = open !== undefined ? open : o;
  const toggle = () => {
    if (!collapsible) return;
    onToggle ? onToggle(!isOpen) : setO(!isOpen);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: glass ? 'nm-glass nm-glass-surface' : undefined,
    style: {
      borderRadius: 'var(--glass-radius)',
      overflow: 'hidden',
      flex: 'none',
      ...(glass ? {} : {
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)'
      }),
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: toggle,
    "aria-expanded": isOpen,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      padding: '10px 14px',
      background: 'none',
      border: 'none',
      cursor: collapsible ? 'pointer' : 'default',
      color: 'inherit',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.06em',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap'
    }
  }, meta), collapsible && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--text-faint)',
      transform: isOpen ? 'none' : 'rotate(-90deg)',
      transition: 'transform var(--dur-fast)'
    }
  }, "\u25BE")), isOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px 14px',
      ...bodyStyle
    }
  }, children));
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Panel.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Toast.jsx
try { (() => {
function Toast({
  children,
  tone = 'neutral',
  style
}) {
  const bar = {
    neutral: 'var(--line-2)',
    ok: 'var(--ok)',
    caution: 'var(--caution)',
    alert: 'var(--alert)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--ink-1)',
      color: 'var(--paper-1)',
      borderRadius: 'var(--radius-2)',
      boxShadow: 'var(--shadow-3)',
      padding: '10px 14px',
      fontSize: 14,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      alignSelf: 'stretch',
      borderRadius: 2,
      background: bar
    }
  }), children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Toast.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Tooltip.jsx
try { (() => {
function Tooltip({
  text,
  children,
  style
}) {
  const [show, set] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block',
      ...style
    },
    onMouseEnter: () => set(true),
    onMouseLeave: () => set(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 6px)',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--ink-1)',
      color: 'var(--paper-1)',
      fontSize: 12,
      padding: '4px 8px',
      borderRadius: 'var(--radius-1)',
      whiteSpace: 'nowrap',
      zIndex: 50
    }
  }, text));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Tooltip.jsx", error: String((e && e.message) || e) }); }

// design_handoff_noma_explorer/prototype/chat.jsx
try { (() => {
const {
  EvidenceTag: IEvidence,
  Button: IButton
} = window.NomaDesignSystem_02438c;
const WORLD_EXTRA = {
  'Along the Mid-Atlantic Ridge': {
    points: ['Iceland hosts four of the nine, and all recent eruptions.', 'The Azores sit near the triple junction with the Eurasian and African plates.', 'The southern ridge volcanoes are remote and largely unmonitored.'],
    sources: [{
      n: 'Global Volcanism Program, Smithsonian',
      k: 'retrieved'
    }, {
      n: 'Icelandic Met Office — seismic & GNSS',
      k: 'observed'
    }, {
      n: 'IVAR, University of the Azores',
      k: 'retrieved'
    }]
  },
  'Most active volcanoes': {
    points: ['Etna — tremor and SO₂ both at 12-month highs.', 'Kīlauea — episode 31 of summit fountaining.', 'Merapi — dome growth with pyroclastic flows.'],
    sources: [{
      n: 'INGV Osservatorio Etneo',
      k: 'observed'
    }, {
      n: 'USGS Hawaiian Volcano Observatory',
      k: 'observed'
    }, {
      n: 'PVMBG / BPPTKG Indonesia',
      k: 'observed'
    }, {
      n: 'Noma activity index (7-day composite)',
      k: 'calculated'
    }]
  },
  'Erupting now': {
    sources: [{
      n: 'Smithsonian / USGS Weekly Volcanic Activity Report',
      k: 'retrieved'
    }, {
      n: 'VAAC Toulouse, Tokyo, Washington',
      k: 'observed'
    }]
  },
  'Significant earthquakes': {
    sources: [{
      n: 'USGS ComCat',
      k: 'observed'
    }, {
      n: 'GFZ GEOFON',
      k: 'observed'
    }]
  },
  'Notable right now': {
    sources: [{
      n: 'Smithsonian / USGS Weekly Volcanic Activity Report',
      k: 'retrieved'
    }, {
      n: 'USGS ComCat',
      k: 'observed'
    }]
  }
};
const DETAIL_EXTRA = {
  'Ash is drifting east-southeast': {
    points: ['Ash likely over Catania from about 12:00 UTC.', 'Catania airport: moderate risk of disruption this afternoon.', 'Uncertainty grows after 4 hours as winds back to the southwest.'],
    sources: [{
      n: 'ECMWF wind forecast, 06 UTC run',
      k: 'forecast'
    }, {
      n: 'FALL3D ash dispersion v8.2',
      k: 'modelled'
    }, {
      n: 'VAAC Toulouse advisory 0612',
      k: 'observed'
    }]
  },
  '38 earthquakes in the last 24 hours': {
    points: ['Depths cluster at 1–4 km, shallower than last month.', 'No events deeper than 10 km, so no sign of deep recharge.'],
    sources: [{
      n: 'INGV-OE seismic network (18 of 21 stations)',
      k: 'observed'
    }]
  },
  'Three towns lie within 15 km of the active vent': {
    sources: [{
      n: 'ISTAT population 2024',
      k: 'retrieved'
    }, {
      n: 'Copernicus CORINE land cover',
      k: 'retrieved'
    }]
  },
  'Lava would most likely flow southeast': {
    sources: [{
      n: 'MAGFLOW lava-flow model, INGV',
      k: 'modelled'
    }, {
      n: 'TINITALY 10 m DEM',
      k: 'retrieved'
    }]
  },
  'Jumped to the December 2025 lava fountain': {
    sources: [{
      n: 'INGV-OE bulletins, Dec 2025',
      k: 'historical'
    }]
  }
};
const {
  QueryBar: AQueryBar
} = window.NomaDesignSystem_02438c;
const chatLink = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  color: 'var(--text-muted)',
  whiteSpace: 'nowrap'
};
function Message({
  m,
  cur,
  onRestore
}) {
  const [more, setMore] = React.useState(false);
  const src = m.answer.sources || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'flex-end',
      maxWidth: '80%',
      background: 'var(--glass-bubble)',
      borderRadius: '16px 16px 4px 16px',
      padding: '7px 12px',
      fontSize: 14
    }
  }, m.q), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '92%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      lineHeight: 1.35
    }
  }, m.answer.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      lineHeight: 1.5,
      marginTop: 2
    }
  }, m.answer.body), more && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, (m.answer.points || []).map(p => /*#__PURE__*/React.createElement("div", {
    key: p,
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "\u2014 ", p)), src.map((s, j) => /*#__PURE__*/React.createElement("div", {
    key: j,
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, s.n), /*#__PURE__*/React.createElement(IEvidence, {
    kind: s.k
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(IEvidence, {
    kind: m.answer.ev
  }), src.length > 0 && /*#__PURE__*/React.createElement("button", {
    style: chatLink,
    onClick: () => setMore(!more)
  }, src.length, " source", src.length > 1 ? 's' : '', " ", more ? '▴' : '▾'), cur ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: '#5FA36F'
    }
  }, "\u25CF On map") : /*#__PURE__*/React.createElement("button", {
    style: chatLink,
    onClick: () => onRestore(m)
  }, "Show on map"))));
}
function ChatDock({
  thread,
  ctx,
  currentId,
  open,
  setOpen,
  onAsk,
  placeholder,
  suggestions,
  onRestore,
  onNew,
  onToast,
  insets,
  onHeight
}) {
  const bodyRef = React.useRef(null);
  const boxRef = React.useRef(null);
  React.useEffect(() => {
    if (!boxRef.current || !onHeight) return;
    const ro = new ResizeObserver(() => onHeight(boxRef.current.offsetHeight));
    ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, []);
  const n = thread.length;
  const expanded = open && n > 0;
  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [n, expanded]);
  const reopen = n > 0 && !expanded ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(true),
    title: "Show conversation",
    style: {
      ...chatLink,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      height: 28,
      padding: '0 10px',
      borderRadius: 999,
      border: '1px solid var(--line-1)',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-body)'
    }
  }, n, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9
    }
  }, "\u25B2")) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: insets.left,
      right: insets.right,
      bottom: 16,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 30,
      pointerEvents: 'none',
      transition: 'left var(--dur-med), right var(--dur-med)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: boxRef,
    className: "nm-glass nm-glass-surface",
    style: {
      pointerEvents: 'auto',
      width: '100%',
      maxWidth: 620,
      borderRadius: expanded ? 'var(--glass-radius)' : 28,
      display: 'flex',
      flexDirection: 'column',
      background: expanded ? 'var(--glass-bg-strong)' : 'var(--glass-bg)'
    }
  }, expanded && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 14px 8px',
      borderBottom: '1px solid var(--line-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-faint)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, ctx.join(' · ')), /*#__PURE__*/React.createElement("button", {
    style: chatLink,
    onClick: () => onToast('Link copied — opens at the same map state')
  }, "Share"), /*#__PURE__*/React.createElement("button", {
    style: chatLink,
    onClick: onNew
  }, "New"), /*#__PURE__*/React.createElement("button", {
    style: chatLink,
    onClick: () => setOpen(false),
    title: "Hide conversation"
  }, "Hide \u25BE")), /*#__PURE__*/React.createElement("div", {
    ref: bodyRef,
    style: {
      overflow: 'auto',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      maxHeight: 'min(420px, calc(100vh - 220px))'
    }
  }, thread.map(m => /*#__PURE__*/React.createElement(Message, {
    key: m.id,
    m: m,
    cur: m.id === currentId,
    onRestore: onRestore
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 6,
      borderTop: expanded ? '1px solid var(--line-1)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(AQueryBar, {
    embedded: true,
    placeholder: placeholder,
    examples: suggestions,
    onAsk: q => {
      onAsk(q);
      setOpen(true);
    },
    trailing: reopen
  }))));
}
function AskMenu({
  menu,
  onAsk,
  onClose
}) {
  React.useEffect(() => {
    if (!menu) return;
    const k = e => {
      if (e.key === 'Escape') onClose();
    };
    const c = () => onClose();
    window.addEventListener('keydown', k);
    const id = setTimeout(() => window.addEventListener('pointerdown', c), 0);
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', k);
      window.removeEventListener('pointerdown', c);
    };
  }, [menu]);
  if (!menu) return null;
  const W = 280,
    left = Math.max(16, Math.min(window.innerWidth - W - 16, menu.x + 12)),
    top = Math.max(16, Math.min(window.innerHeight - 60 - menu.qs.length * 36, menu.y + 12));
  return /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    onPointerDown: e => e.stopPropagation(),
    style: {
      position: 'fixed',
      left,
      top,
      width: W,
      borderRadius: 'var(--glass-radius)',
      padding: 6,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)',
      padding: '4px 10px 6px'
    }
  }, "Ask about ", menu.title), menu.qs.map(q => /*#__PURE__*/React.createElement("button", {
    key: q,
    onClick: () => {
      onAsk(q);
      onClose();
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-body)',
      background: 'none',
      border: 'none',
      borderRadius: 'var(--radius-2)',
      padding: '7px 10px',
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--glass-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'none'
  }, q)));
}
Object.assign(window, {
  AskMenu,
  ChatDock,
  WORLD_EXTRA,
  DETAIL_EXTRA
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_noma_explorer/prototype/chat.jsx", error: String((e && e.message) || e) }); }

// design_handoff_noma_explorer/prototype/data.js
try { (() => {
// Sample data for the prototype — illustrative values, not live observations.
window.NOMA_DATA = {
  events: [{
    id: 'etna',
    featured: true,
    activity: 92,
    tags: ['europe'],
    kind: 'volcano',
    name: 'Etna',
    region: 'Sicily, Italy',
    lat: 37.751,
    lon: 14.994,
    elev: '3357 m',
    status: 'Erupting',
    tone: 'alert',
    headline: 'Strombolian activity at the southeast crater',
    summary: 'Ash emission and lava fountaining since Tuesday. Tremor amplitude is high and rising.',
    stream: {
      label: 'Volcanic tremor',
      unit: 'µm/s',
      base: 4.2,
      amp: 1.6
    },
    img: '../assets/imagery/terrain-reference.png',
    wind: {
      dir: 280,
      speed: 34,
      label: 'W 34 kt at 5 km'
    },
    weather: {
      temp: '14 °C',
      cloud: 'Scattered',
      vis: '18 km'
    },
    places: [{
      name: 'Catania',
      type: 'city',
      pop: '300k',
      dist: '28 km',
      bear: 'SE',
      x: 84,
      y: 78
    }, {
      name: 'Zafferana Etnea',
      type: 'town',
      pop: '9k',
      dist: '11 km',
      bear: 'E',
      x: 74,
      y: 46
    }, {
      name: 'Nicolosi',
      type: 'town',
      pop: '7k',
      dist: '14 km',
      bear: 'S',
      x: 44,
      y: 82
    }, {
      name: 'Bronte',
      type: 'town',
      pop: '19k',
      dist: '15 km',
      bear: 'W',
      x: 10,
      y: 52
    }, {
      name: 'Catania airport',
      type: 'airport',
      dist: '35 km',
      bear: 'SSE',
      x: 64,
      y: 92
    }],
    forests: [{
      name: 'Etna Park woodland',
      x: 18,
      y: 66,
      w: 30,
      h: 22
    }, {
      name: 'Pineta di Linguaglossa',
      x: 62,
      y: 10,
      w: 26,
      h: 18
    }],
    streams: [{
      k: 'tremor',
      label: 'Volcanic tremor',
      unit: 'µm/s',
      val: '5.8',
      trend: 'rising',
      ev: 'observed',
      base: 4.2,
      amp: 1.6
    }, {
      k: 'so2',
      label: 'SO₂ flux',
      unit: 't/day',
      val: '9 400',
      trend: 'rising',
      ev: 'observed',
      base: 7,
      amp: 2
    }, {
      k: 'def',
      label: 'Summit uplift',
      unit: 'cm / 30 d',
      val: '3.2',
      trend: 'steady',
      ev: 'retrieved',
      base: 3,
      amp: 0.4
    }, {
      k: 'thermal',
      label: 'Thermal anomaly',
      unit: 'MW',
      val: '412',
      trend: 'rising',
      ev: 'retrieved',
      base: 3.5,
      amp: 1.2
    }],
    models: [{
      name: 'Ash dispersion',
      state: 'Running',
      detail: 'Updated 06:30 UTC · next 07:30'
    }, {
      name: 'Lava flow paths',
      state: 'Running',
      detail: 'SE flank, 3 scenarios'
    }, {
      name: 'Eruption forecast',
      state: 'Ready',
      detail: '72 h window'
    }],
    history: [{
      t: 0.08,
      label: 'Paroxysm · Feb 2025',
      major: true
    }, {
      t: 0.3,
      label: 'Seismic swarm · May 2025'
    }, {
      t: 0.52,
      label: 'Lava fountain · Dec 2025',
      major: true
    }, {
      t: 0.74,
      label: 'Swarm · Jun 2026'
    }, {
      t: 0.95,
      label: 'Current episode',
      major: true
    }]
  }, {
    id: 'kilauea',
    featured: true,
    activity: 81,
    tags: ['hotspot'],
    kind: 'volcano',
    name: 'Kīlauea',
    region: 'Hawaiʻi, USA',
    lat: 19.421,
    lon: -155.287,
    elev: '1247 m',
    status: 'Episodic fountaining',
    tone: 'caution',
    headline: 'Episode 31 of summit fountaining',
    summary: 'Fountains in Halemaʻumaʻu reached 300 m overnight. Activity is confined to the summit caldera.',
    stream: {
      label: 'Tilt',
      unit: 'µrad',
      base: 3,
      amp: 1.4
    }
  }, {
    id: 'sakurajima',
    featured: true,
    activity: 77,
    tags: ['ring'],
    kind: 'volcano',
    name: 'Sakurajima',
    region: 'Kagoshima, Japan',
    lat: 31.585,
    lon: 130.657,
    elev: '1117 m',
    status: 'Explosive',
    tone: 'caution',
    headline: 'Four explosions in 24 hours',
    summary: 'Plume heights up to 3.4 km above the crater. Ashfall forecast for Kagoshima city.',
    stream: {
      label: 'Explosion count',
      unit: '/ day',
      base: 2.5,
      amp: 1.5
    }
  }, {
    id: 'reykjanes',
    featured: true,
    activity: 64,
    tags: ['mar'],
    kind: 'volcano',
    name: 'Sundhnúkur',
    region: 'Reykjanes, Iceland',
    lat: 63.88,
    lon: -22.42,
    elev: '—',
    status: 'Magma accumulating',
    tone: 'caution',
    headline: 'Uplift continues beneath Svartsengi',
    summary: 'Magma volume approaching levels that preceded previous fissure eruptions.',
    stream: {
      label: 'Uplift',
      unit: 'mm/day',
      base: 3,
      amp: 0.5
    }
  }, {
    id: 'kamchatka',
    featured: true,
    activity: 70,
    tags: ['ring'],
    kind: 'earthquake',
    name: 'M 6.1 earthquake',
    region: 'Off Kamchatka, Russia',
    lat: 52.9,
    lon: 160.1,
    elev: 'Depth 38 km',
    status: '2 h ago',
    tone: 'neutral',
    headline: 'Aftershock sequence underway',
    summary: 'Twelve aftershocks above M 4. No tsunami threat was issued.',
    stream: {
      label: 'Aftershocks',
      unit: 'M',
      base: 3,
      amp: 1.8
    }
  }, {
    id: 'merapi',
    kind: 'volcano',
    name: 'Merapi',
    region: 'Java, Indonesia',
    lat: -7.54,
    lon: 110.446,
    elev: '2930 m',
    status: 'Lava dome growth',
    tone: 'caution',
    activity: 79,
    tags: ['ring'],
    headline: 'Pyroclastic flows down the southwest flank',
    summary: 'Dome collapse sent flows 1.8 km from the summit. Alert level remains III.',
    stream: {
      label: 'Rockfall events',
      unit: '/ day',
      base: 3,
      amp: 1.2
    }
  }, {
    id: 'stromboli',
    kind: 'volcano',
    name: 'Stromboli',
    region: 'Aeolian Islands, Italy',
    lat: 38.789,
    lon: 15.213,
    elev: '924 m',
    status: 'Persistent explosions',
    tone: 'caution',
    activity: 74,
    tags: ['europe'],
    headline: 'Explosions every 10–15 minutes',
    summary: 'Typical Strombolian activity from the northeast crater area.',
    stream: {
      label: 'Explosion rate',
      unit: '/ h',
      base: 4,
      amp: 1
    }
  }, {
    id: 'fuego',
    kind: 'volcano',
    name: 'Fuego',
    region: 'Guatemala',
    lat: 14.473,
    lon: -90.88,
    elev: '3763 m',
    status: 'Strombolian activity',
    tone: 'caution',
    activity: 71,
    tags: ['ring'],
    headline: 'Ash plumes to 4.8 km',
    summary: 'Frequent explosions with ash drifting west. Avalanches in Ceniza ravine.',
    stream: {
      label: 'Explosion rate',
      unit: '/ h',
      base: 3,
      amp: 1.3
    }
  }, {
    id: 'popocatepetl',
    kind: 'volcano',
    name: 'Popocatépetl',
    region: 'Puebla, Mexico',
    lat: 19.023,
    lon: -98.622,
    elev: '5426 m',
    status: 'Ash emissions',
    tone: 'caution',
    activity: 68,
    tags: ['ring'],
    headline: 'Low-intensity ash exhalations',
    summary: 'Continuous degassing with occasional ash. Traffic light yellow phase 2.',
    stream: {
      label: 'Exhalations',
      unit: '/ day',
      base: 3,
      amp: 1
    }
  }, {
    id: 'hekla',
    kind: 'volcano',
    name: 'Hekla',
    region: 'Iceland',
    lat: 63.98,
    lon: -19.70,
    elev: '1491 m',
    status: 'Inflating',
    tone: 'quiet',
    activity: 22,
    tags: ['mar'],
    headline: 'Slow inflation continues',
    summary: 'The volcano is above its pre-2000 eruption inflation level. No unrest signals.',
    stream: {
      label: 'Uplift',
      unit: 'mm/yr',
      base: 2,
      amp: 0.3
    }
  }, {
    id: 'grimsvotn',
    kind: 'volcano',
    name: 'Grímsvötn',
    region: 'Vatnajökull, Iceland',
    lat: 64.42,
    lon: -17.33,
    elev: '1725 m',
    status: 'Monitoring',
    tone: 'quiet',
    activity: 30,
    tags: ['mar'],
    headline: 'Subglacial lake level rising',
    summary: 'Geothermal melting beneath the ice cap. A jökulhlaup is possible within months.',
    stream: {
      label: 'Lake level',
      unit: 'm',
      base: 3,
      amp: 0.4
    }
  }, {
    id: 'beerenberg',
    kind: 'volcano',
    name: 'Beerenberg',
    region: 'Jan Mayen, Norway',
    lat: 71.08,
    lon: -8.16,
    elev: '2277 m',
    status: 'Dormant',
    tone: 'quiet',
    activity: 5,
    tags: ['mar'],
    headline: 'Last erupted in 1985',
    summary: 'The northernmost active subaerial volcano on Earth.',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 1,
      amp: 0.4
    }
  }, {
    id: 'setecidades',
    kind: 'volcano',
    name: 'Sete Cidades',
    region: 'São Miguel, Azores',
    lat: 37.87,
    lon: -25.78,
    elev: '856 m',
    status: 'Monitoring',
    tone: 'quiet',
    activity: 12,
    tags: ['mar'],
    headline: 'Background seismicity',
    summary: 'A caldera volcano near the triple junction of the Mid-Atlantic Ridge.',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 1.5,
      amp: 0.5
    }
  }, {
    id: 'faial',
    kind: 'volcano',
    name: 'Faial',
    region: 'Azores, Portugal',
    lat: 38.6,
    lon: -28.73,
    elev: '1043 m',
    status: 'Dormant',
    tone: 'quiet',
    activity: 8,
    tags: ['mar'],
    headline: 'Capelinhos eruption, 1957–58',
    summary: 'A surtseyan eruption extended the island by 2.4 km².',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 1,
      amp: 0.4
    }
  }, {
    id: 'ascension',
    kind: 'volcano',
    name: 'Ascension',
    region: 'South Atlantic',
    lat: -7.95,
    lon: -14.37,
    elev: '859 m',
    status: 'Dormant',
    tone: 'quiet',
    activity: 3,
    tags: ['mar'],
    headline: 'No historical eruptions',
    summary: 'A young volcanic island 90 km west of the ridge axis.',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 0.8,
      amp: 0.3
    }
  }, {
    id: 'tristan',
    kind: 'volcano',
    name: 'Tristan da Cunha',
    region: 'South Atlantic',
    lat: -37.09,
    lon: -12.28,
    elev: '2062 m',
    status: 'Dormant',
    tone: 'quiet',
    activity: 6,
    tags: ['mar'],
    headline: 'Last erupted in 1961',
    summary: 'The eruption forced evacuation of the whole island.',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 0.8,
      amp: 0.3
    }
  }, {
    id: 'bouvet',
    kind: 'volcano',
    name: 'Bouvet',
    region: 'South Atlantic',
    lat: -54.42,
    lon: 3.35,
    elev: '780 m',
    status: 'Dormant',
    tone: 'quiet',
    activity: 2,
    tags: ['mar'],
    headline: 'Ice-covered shield volcano',
    summary: 'One of the most remote islands on Earth, near the southern end of the ridge.',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 0.6,
      amp: 0.3
    }
  }],
  ridge: [[-19, -54.5], [-13, -47], [-14, -35], [-12, -25], [-14, -10], [-15, -3], [-26, 1], [-36, 7], [-45, 14], [-46, 23], [-44, 30], [-37, 35], [-29, 39], [-28, 45], [-30, 52], [-33, 57], [-27, 61], [-21, 63.8], [-18, 66.5], [-8, 71.5]],
  quakes: [[-72.5, -33.2, 4.8], [141.9, 38.3, 5.2], [-118.4, 35.6, 3.9], [27.1, 38.4, 4.4], [95.9, 3.3, 5.0], [-97.6, 15.9, 4.6], [121.6, 23.9, 4.1], [-155.3, 19.4, 3.1], [160.1, 52.9, 6.1], [159.4, 53.4, 4.7], [172.8, -43.5, 4.0], [-17.9, 28.6, 3.3]]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_noma_explorer/prototype/data.js", error: String((e && e.message) || e) }); }

// design_handoff_noma_explorer/prototype/detail-view.jsx
try { (() => {
const {
  QueryBar: DQueryBar,
  EvidenceTag: DEvidence,
  Badge: DBadge,
  Button: DButton,
  Card: DCard,
  Switch,
  Panel: DPanel
} = window.NomaDesignSystem_02438c;
const VENT = {
  x: 49,
  y: 28
};
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const tDate = t => {
  const d = new Date(2025, 9, 1);
  d.setDate(d.getDate() + Math.round(t * 359));
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
const defaults = e => ({
  wind: {
    dir: 270,
    speed: 22,
    label: 'W 22 kt at 5 km'
  },
  weather: {
    temp: '—',
    cloud: '—',
    vis: '—'
  },
  places: [],
  forests: [],
  streams: [{
    k: 'main',
    label: e.stream.label,
    unit: e.stream.unit,
    val: '—',
    trend: 'rising',
    ev: 'observed',
    base: e.stream.base,
    amp: e.stream.amp
  }],
  models: [{
    name: 'Ash dispersion',
    state: 'Ready',
    detail: 'On request'
  }],
  history: [{
    t: 0.5,
    label: 'Previous episode',
    major: true
  }, {
    t: 0.95,
    label: 'Current episode',
    major: true
  }]
});
function detailAnswer(q, d) {
  const l = q.toLowerCase();
  const full = d.places.length > 0;
  const st = d.streams.find(s => l.includes(s.label.toLowerCase()));
  if (st && /over the last year|history|record/.test(l)) return {
    a: {
      title: st.label + ': 12-month record',
      body: 'The current value is the highest since the December 2025 lava fountain. Drag the timeline to compare episodes.',
      ev: 'historical'
    },
    set: {
      timeOpen: true
    }
  };
  if (st && /why/.test(l)) return {
    a: {
      title: st.label + ' is ' + st.trend + ' with the current episode',
      body: 'Rising ' + st.label.toLowerCase() + ' usually tracks magma moving into the shallow conduit. It rose the same way for 9 days before the last lava fountain.',
      ev: 'inferred'
    },
    set: {}
  };
  const pl = d.places.find(p => l.includes(p.name.toLowerCase()));
  if (pl && /reach|exposed|ash|risk/.test(l)) return {
    a: {
      title: pl.bear.includes('S') || pl.bear.includes('E') ? pl.name + ' is downwind today' : pl.name + ' is upwind today',
      body: pl.bear.includes('S') || pl.bear.includes('E') ? 'Light ashfall is likely in ' + pl.name + ' (' + pl.dist + ' ' + pl.bear + ') from late morning. Accumulation should stay below 1 mm.' : 'Current winds carry ash away from ' + pl.name + '. Exposure is low unless winds turn easterly.',
      ev: 'forecast'
    },
    set: {
      plume: true,
      places: true
    }
  };
  if (/at risk/.test(l) && /forest|woodland|pineta|park/.test(l)) return {
    a: {
      title: 'Low risk to woodland this week',
      body: 'Modelled lava paths stay inside the Valle del Bove, away from forested flanks. Ashfall on the eastern pine stands is light.',
      ev: 'modelled'
    },
    set: {
      lava: true,
      places: true
    }
  };
  if (/plume|wind|ash|smoke/.test(l)) return {
    a: {
      title: full ? 'Ash is drifting east-southeast' : 'Ash would drift downwind',
      body: full ? `Winds of ${d.wind.label} carry the plume toward the Ionian coast. The shaded footprint shows where ash is likely to fall in the next 6 hours; it fades where the forecast is less certain.` : `Winds of ${d.wind.label} would carry ash away from ${d.name}. The footprint fades where the forecast is less certain.`,
      ev: 'forecast'
    },
    set: {
      plume: true
    }
  };
  if (!full) return {
    a: {
      title: 'Not available yet for ' + d.name,
      body: 'Detailed local data for this system is not in the prototype. Etna has the full sample dataset.',
      ev: 'inferred'
    },
    set: {}
  };
  if (/earthquake|quake|seism/.test(l)) return {
    a: {
      title: '38 earthquakes in the last 24 hours',
      body: 'Most are shallow, 1–4 km beneath the summit craters. The largest was M 2.9 at 04:12 UTC.',
      ev: 'observed'
    },
    set: {
      quakes: true
    }
  };
  if (/city|cities|town|near|who|people|forest/.test(l)) return {
    a: {
      title: 'Three towns lie within 15 km of the active vent',
      body: 'Zafferana Etnea, Nicolosi and Bronte. Catania (300k) is 28 km southeast, downwind today. Woodland covers much of the lower north and southwest flanks.',
      ev: 'retrieved'
    },
    set: {
      places: true
    }
  };
  if (/lava|flow/.test(l)) return {
    a: {
      title: 'Lava would most likely flow southeast',
      body: 'Three modelled paths follow the Valle del Bove. None reach inhabited areas within 72 hours at current effusion rates.',
      ev: 'modelled'
    },
    set: {
      lava: true
    }
  };
  if (/before|history|last year|past|changed/.test(l)) return {
    a: {
      title: 'Jumped to the December 2025 lava fountain',
      body: 'Tremor rose for 9 days before that episode, a pattern similar to this week.',
      ev: 'historical'
    },
    set: {
      t: 0.52,
      timeOpen: true
    }
  };
  return {
    a: {
      title: d.headline,
      body: d.summary,
      ev: 'observed'
    },
    set: {}
  };
}
function DetailView({
  event,
  onBack,
  onAnswer,
  drawerOpen,
  registerAsk,
  initState,
  onContext,
  dockH = 56
}) {
  const d = {
    ...defaults(event),
    ...event
  };
  const [o, setO] = React.useState({
    plume: false,
    quakes: false,
    places: true,
    lava: false,
    t: 1,
    timeOpen: true,
    ...(initState || {})
  });
  const [answer, setAnswer] = React.useState(null);
  const [menu, setMenu] = React.useState(null);
  const openMenu = (e, title, qs) => {
    e.stopPropagation();
    setMenu({
      x: e.clientX,
      y: e.clientY,
      title,
      qs
    });
  };
  const [vw, setVw] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const r = () => setVw(window.innerWidth);
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const RW = vw >= 1100 ? 340 : 300;
  const live = o.t > 0.97;
  const set = p => setO(s => ({
    ...s,
    ...p
  }));
  const ask = q => {
    const r = detailAnswer(q, d);
    setAnswer({
      q,
      ...r.a
    });
    set(r.set);
    const ns = {
      ...o,
      ...r.set
    };
    const tl = ns.t > 0.97 ? 'Now' : tDate(ns.t);
    onAnswer && onAnswer({
      q,
      view: 'detail',
      eventId: event.id,
      state: ns,
      ctx: d.name + ' · ' + tl,
      answer: {
        ...r.a,
        ...(DETAIL_EXTRA[r.a.title] || {
          sources: [{
            n: 'Noma synthesis of current observations',
            k: 'inferred'
          }]
        })
      }
    });
  };
  React.useEffect(() => {
    onContext && onContext([d.name, live ? 'Now' : tDate(o.t), ...(o.plume ? ['Ash forecast'] : []), ...(o.quakes ? ['Earthquakes'] : []), ...(o.lava ? ['Lava paths'] : []), ...(o.places && d.places.length ? ['Towns'] : [])]);
  }, [o.t, o.plume, o.quakes, o.lava, o.places]);
  const windRot = (d.wind.dir + 180) % 360 - 90;
  React.useEffect(() => {
    registerAsk && registerAsk({
      ask,
      insets: vw >= 1100 ? {
        left: RW + 32,
        right: RW + 32
      } : {
        left: 16,
        right: 16
      },
      placeholder: `Ask about ${d.name}…`,
      suggestions: sugg
    });
  });
  const sugg = d.places.length ? ['Where is the plume going?', 'Who lives nearby?', 'Show me the earthquakes', 'Where would lava flow?', 'What happened before the last eruption?'] : ['Where is the plume going?', `Why is ${d.streams[0].label.toLowerCase()} rising?`];
  return /*#__PURE__*/React.createElement("div", {
    className: "nm-fadein",
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--map-ground)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: 'terrain-' + event.id,
    shape: "rect",
    src: event.img || '',
    placeholder: 'Drop a terrain render of ' + event.name
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(180deg,rgba(15,19,23,0.4),transparent 16%,transparent 78%,rgba(15,19,23,0.5))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }
  }, live && [0, 1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "nm-puff",
    style: {
      left: VENT.x + '%',
      top: VENT.y + '%',
      animationDelay: i * 1.1 + 's',
      '--wx': Math.cos(windRot * Math.PI / 180) * 180 + 'px',
      '--wy': Math.sin(windRot * Math.PI / 180) * 60 - 90 + 'px'
    }
  })), Array.from({
    length: 14
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      left: 8 + i % 7 * 11 + '%',
      top: 9 + Math.floor(i / 7) * 9 + '%',
      color: 'rgba(233,237,241,0.35)',
      fontSize: 13,
      transform: `rotate(${windRot}deg)`
    }
  }, "\u2192")), o.plume && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: VENT.x + '%',
      top: VENT.y + '%',
      width: '46vw',
      height: '20vw',
      marginTop: '-10vw',
      transformOrigin: '0 50%',
      transform: `rotate(${windRot + 14}deg)`,
      background: 'radial-gradient(80% 55% at 4% 50%, rgba(233,237,241,0.55), rgba(233,237,241,0.25) 45%, rgba(233,237,241,0.07) 72%, transparent 86%)',
      borderRadius: '50%'
    }
  }), o.lava && /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    }
  }, ['M49,28 C52,40 58,52 63,70', 'M49,28 C47,42 44,58 40,76', 'M49,28 C56,36 64,44 71,55'].map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: p,
    fill: "none",
    stroke: "#E0442F",
    strokeWidth: i === 0 ? 2.5 : 1.5,
    strokeDasharray: "4 3",
    vectorEffect: "non-scaling-stroke",
    opacity: i === 0 ? 0.95 : 0.6
  }))), o.quakes && [[47, 31, 2.9], [50, 33, 1.8], [48, 35, 2.2], [52, 30, 1.2], [46, 29, 1.5], [51, 36, 2.4], [49, 32, 1.1], [53, 34, 1.6]].map(([x, y, m], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      left: x + '%',
      top: y + '%',
      width: m * 8,
      height: m * 8,
      margin: -m * 4,
      borderRadius: '50%',
      border: '1.5px solid #E9EDF1',
      background: 'rgba(233,237,241,0.2)'
    }
  })), o.places && d.forests.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.name,
    onClick: e => openMenu(e, f.name, [`Is ${f.name} at risk?`, 'Where would lava flow?']),
    style: {
      pointerEvents: 'auto',
      cursor: 'pointer',
      position: 'absolute',
      left: f.x + '%',
      top: f.y + '%',
      width: f.w + '%',
      height: f.h + '%',
      borderRadius: '40%',
      border: '1px dashed rgba(143,190,128,0.8)',
      background: 'rgba(62,124,79,0.22)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      position: 'absolute',
      left: 10,
      top: 8,
      color: '#CFE3C4'
    }
  }, f.name))), o.places && d.places.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    onClick: e => openMenu(e, p.name, [`Will ash reach ${p.name}?`, `How exposed is ${p.name}?`, 'Who lives nearby?']),
    style: {
      position: 'absolute',
      left: p.x + '%',
      top: p.y + '%',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      transform: 'translate(-5px,-5px)',
      pointerEvents: 'auto',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: p.type === 'city' ? 2 : '50%',
      background: '#F6F4EF',
      border: '2px solid #161B20'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "nm-glass nm-glass-surface",
    style: {
      padding: '3px 8px',
      borderRadius: 'var(--radius-1)',
      fontSize: 13,
      whiteSpace: 'nowrap'
    }
  }, p.name, /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-muted)',
      marginLeft: 8
    }
  }, p.dist, " ", p.bear, p.pop ? ' · ' + p.pop : '')))), /*#__PURE__*/React.createElement("div", {
    onClick: e => openMenu(e, 'the active vent', d.places.length ? ['Where is the plume going?', 'Where would lava flow?', 'Show me the earthquakes'] : ['Where is the plume going?', `Why is ${d.streams[0].label.toLowerCase()} rising?`]),
    style: {
      position: 'absolute',
      left: VENT.x + '%',
      top: VENT.y + '%',
      transform: 'translate(-50%,-6px)',
      padding: '8px 10px',
      pointerEvents: 'auto',
      cursor: 'pointer',
      ...labelStyle,
      color: '#E9EDF1',
      textShadow: '0 1px 3px #000'
    }
  }, "\u25B2 Active vent")), /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      borderRadius: 'var(--radius-pill)',
      padding: '6px 16px 6px 6px',
      maxWidth: `calc(100% - ${RW + 48}px)`,
      overflow: 'hidden',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement(DButton, {
    size: "sm",
    variant: "secondary",
    onClick: onBack,
    style: {
      borderRadius: 999,
      whiteSpace: 'nowrap',
      flex: 'none'
    }
  }, "\u2190 Earth"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 17,
      whiteSpace: 'nowrap'
    }
  }, d.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      minWidth: 0
    }
  }, d.region), /*#__PURE__*/React.createElement(ThemeToggle, null), /*#__PURE__*/React.createElement(DBadge, {
    tone: live ? d.tone === 'neutral' || d.tone === 'quiet' ? 'neutral' : d.tone : 'neutral',
    style: {
      whiteSpace: 'nowrap'
    }
  }, live ? d.status : 'Historical')), /*#__PURE__*/React.createElement(RightColumn, {
    d: d,
    live: live,
    o: o,
    set: set,
    RW: RW,
    B: vw >= 1100 ? 16 : dockH + 26,
    openMenu: openMenu
  }), /*#__PURE__*/React.createElement(AskMenu, {
    menu: menu,
    onAsk: ask,
    onClose: () => setMenu(null)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      right: 16,
      bottom: vw >= 1100 ? 16 : dockH + 26,
      width: RW,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(ModelsPanel, {
    d: d,
    o: o,
    set: set
  }), /*#__PURE__*/React.createElement(TimePanel, {
    o: o,
    set: set,
    d: d,
    live: live
  })));
}
function TimePanel({
  o,
  set,
  d,
  live
}) {
  return /*#__PURE__*/React.createElement(DPanel, {
    title: "Time",
    meta: live ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#5FA36F'
      }
    }, "\u25CF Now") : tDate(o.t),
    open: o.timeOpen,
    onToggle: v => set({
      timeOpen: v
    })
  }, /*#__PURE__*/React.createElement(Timeline, {
    t: o.t,
    setT: t => set({
      t
    }),
    marks: d.history
  }), !live && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(DButton, {
    size: "sm",
    variant: "secondary",
    onClick: () => set({
      t: 1
    })
  }, "Return to now")));
}
function ModelsPanel({
  d,
  o,
  set
}) {
  return /*#__PURE__*/React.createElement(DPanel, {
    title: "Models & overlays",
    meta: d.models.filter(m => m.state === 'Running').length + ' running'
  }, d.models.map((m, i) => {
    const key = m.name === 'Ash dispersion' ? 'plume' : m.name === 'Lava flow paths' ? 'lava' : null;
    return /*#__PURE__*/React.createElement("div", {
      key: m.name,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
        borderTop: i ? '1px solid var(--line-1)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-faint)'
      }
    }, m.state, " \xB7 ", m.detail)), key && /*#__PURE__*/React.createElement(Switch, {
      checked: o[key],
      onChange: e => set({
        [key]: e.target.checked
      })
    }));
  }), d.places.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 0',
      borderTop: '1px solid var(--line-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 14
    }
  }, "Towns & forests"), /*#__PURE__*/React.createElement(Switch, {
    checked: o.places,
    onChange: e => set({
      places: e.target.checked
    })
  })));
}
function RightColumn({
  d,
  live,
  o,
  set,
  RW,
  B,
  openMenu
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 72,
      left: 16,
      bottom: B,
      width: RW,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(DPanel, {
    title: "Data streams",
    meta: live ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#5FA36F'
      }
    }, "\u25CF Live") : 'Paused'
  }, d.streams.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.k,
    onClick: e => openMenu(e, s.label.toLowerCase(), [`Why is ${s.label.toLowerCase()} ${s.trend}?`, `Show ${s.label.toLowerCase()} over the last year`]),
    title: "Ask about this",
    style: {
      marginTop: i ? 12 : 2,
      cursor: 'pointer',
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      marginLeft: 8
    }
  }, s.val, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      fontSize: 11
    }
  }, s.unit))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Spark, {
    base: s.base,
    amp: s.amp,
    w: RW - 30,
    h: 24,
    paused: !live,
    dark: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(DEvidence, {
    kind: live ? s.ev : 'historical'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)'
    }
  }, s.trend))))), /*#__PURE__*/React.createElement(DPanel, {
    title: "Local conditions",
    meta: d.wind.label.split(' at')[0]
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px 16px'
    }
  }, [['Wind', d.wind.label], ['Temperature', d.weather.temp], ['Cloud', d.weather.cloud], ['Visibility', d.weather.vis]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)'
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      marginTop: 2
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(DEvidence, {
    kind: "forecast"
  }))));
}
function Timeline({
  t,
  setT,
  marks
}) {
  const ref = React.useRef(null);
  const drag = e => {
    const r = ref.current.getBoundingClientRect();
    setT(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
  };
  const down = e => {
    drag(e);
    const mv = ev => drag(ev);
    const up = () => {
      window.removeEventListener('pointermove', mv);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
  };
  const live = t > 0.97;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '2px 4px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onPointerDown: down,
    style: {
      flex: 1,
      height: 40,
      position: 'relative',
      cursor: 'ew-resize',
      touchAction: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 14,
      height: 2,
      background: 'var(--line-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      width: t * 100 + '%',
      top: 14,
      height: 2,
      background: 'var(--ink-3)'
    }
  }), MONTHS.map((m, i) => i % 2 === 0 && /*#__PURE__*/React.createElement("span", {
    key: m + i,
    style: {
      position: 'absolute',
      left: i / 12 * 100 + '%',
      top: 24,
      ...labelStyle,
      color: 'var(--text-faint)'
    }
  }, m)), marks.map(m => /*#__PURE__*/React.createElement("span", {
    key: m.label,
    title: m.label,
    onPointerDown: e => {
      e.stopPropagation();
      setT(m.t);
    },
    style: {
      position: 'absolute',
      left: m.t * 100 + '%',
      top: 15,
      width: m.major ? 10 : 7,
      height: m.major ? 10 : 7,
      transform: 'translate(-50%,-50%)',
      borderRadius: '50%',
      background: m.major ? '#E0442F' : 'var(--ink-3)',
      border: '2px solid #1D242B',
      cursor: 'pointer'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: t * 100 + '%',
      top: 2,
      bottom: 16,
      width: 2,
      marginLeft: -1,
      background: 'var(--ink-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -2,
      left: -5,
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: 'var(--ink-1)'
    }
  }))));
}
Object.assign(window, {
  DetailView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_noma_explorer/prototype/detail-view.jsx", error: String((e && e.message) || e) }); }

// design_handoff_noma_explorer/prototype/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_noma_explorer/prototype/image-slot.js", error: String((e && e.message) || e) }); }

// design_handoff_noma_explorer/prototype/streams.jsx
try { (() => {
function useLiveSeries(base, amp, n = 48, paused) {
  const gen = i => base + amp * (Math.sin(i / 4) * 0.5 + Math.sin(i / 1.7) * 0.3 + (Math.random() - 0.5) * 0.6);
  const [s, set] = React.useState(() => Array.from({
    length: n
  }, (_, i) => gen(i)));
  const iRef = React.useRef(n);
  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      iRef.current++;
      set(v => [...v.slice(1), gen(iRef.current)]);
    }, 900);
    return () => clearInterval(t);
  }, [base, amp, paused]);
  return s;
}
function Spark({
  base,
  amp,
  w = 220,
  h = 36,
  dark,
  paused,
  color
}) {
  const s = useLiveSeries(base, amp, 48, paused);
  const min = Math.min(...s),
    max = Math.max(...s),
    r = max - min || 1;
  const pts = s.map((v, i) => (i / (s.length - 1) * w).toFixed(1) + ',' + (h - 2 - (v - min) / r * (h - 4)).toFixed(1)).join(' ');
  const last = s[s.length - 1],
    ly = h - 2 - (last - min) / r * (h - 4);
  const c = color || (dark ? 'var(--map-ink)' : 'var(--ink-1)');
  return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "0",
    x2: w,
    y1: h - 1,
    y2: h - 1,
    stroke: dark ? 'var(--map-line)' : 'var(--line-1)'
  }), /*#__PURE__*/React.createElement("polyline", {
    points: pts,
    fill: "none",
    stroke: c,
    strokeWidth: "1.25",
    strokeLinejoin: "round"
  }), !paused && /*#__PURE__*/React.createElement("circle", {
    cx: w,
    cy: ly,
    r: "2.5",
    fill: c
  }));
}
const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase'
};
function ThemeToggle() {
  const [t, setT] = React.useState(document.documentElement.dataset.theme || 'dark');
  const flip = () => {
    const n = t === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = n;
    localStorage.setItem('noma-theme', n);
    setT(n);
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: flip,
    title: t === 'dark' ? 'Light theme' : 'Dark theme',
    "aria-label": "Toggle theme",
    style: {
      width: 26,
      height: 26,
      flex: 'none',
      borderRadius: '50%',
      border: '1px solid var(--line-1)',
      background: 'var(--glass-hover)',
      color: 'var(--text-body)',
      cursor: 'pointer',
      fontSize: 13,
      lineHeight: 1,
      padding: 0
    }
  }, t === 'dark' ? '☀' : '☾');
}
Object.assign(window, {
  Spark,
  useLiveSeries,
  labelStyle,
  ThemeToggle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_noma_explorer/prototype/streams.jsx", error: String((e && e.message) || e) }); }

// design_handoff_noma_explorer/prototype/world-view.jsx
try { (() => {
const {
  QueryBar,
  EvidenceTag,
  Badge,
  Button,
  Card,
  IconButton,
  Panel
} = window.NomaDesignSystem_02438c;
const toneColor = {
  alert: '#E0442F',
  caution: '#D9A02A',
  neutral: 'var(--map-mark)',
  ok: '#5FA36F',
  quiet: '#7D8893'
};
const glassPill = {
  borderRadius: 'var(--radius-pill)'
};
function parseWorld(q, E) {
  const l = q.toLowerCase();
  const V = E.filter(e => e.kind === 'volcano');
  const hit = E.find(e => l.includes(e.name.toLowerCase()));
  if (hit && /like|similar/.test(l)) {
    const it = [hit, ...E.filter(e => e !== hit && e.kind === hit.kind && e.tags.some(t => hit.tags.includes(t)))];
    return {
      label: 'Similar to ' + hit.name,
      items: it,
      summary: it.length > 1 ? it.length - 1 + ' systems share ' + hit.name + "'s tectonic setting. " + it.slice(1, 3).map(e => e.name).join(' and ') + ' are the most active of them.' : 'No close analogues in the current feed.',
      ev: 'retrieved'
    };
  }
  if (hit && /last year|compare/.test(l)) return {
    label: hit.name + ' vs last year',
    items: [hit],
    summary: hit.name + ' is more active than at this time last year, when it was in a quiet phase between episodes.',
    ev: 'historical'
  };
  if (hit) return {
    label: hit.name,
    title: hit.headline,
    items: [hit],
    summary: hit.summary,
    ev: 'observed'
  };
  if (/atlantic|ridge|rift/.test(l)) {
    const ids = E.filter(e => e.tags.includes('mar'));
    const act = ids.filter(e => e.activity > 50);
    return {
      label: 'Along the Mid-Atlantic Ridge',
      items: ids,
      ridge: true,
      summary: `${ids.length} volcanoes lie on or near the ridge. ${act.length === 1 ? 'Only ' + act[0].name + ', on Reykjanes, is' : act.length + ' are'} currently active; the Icelandic systems are the most closely monitored.`,
      ev: 'retrieved'
    };
  }
  if (/most active|active|busiest/.test(l)) {
    const it = [...V].sort((a, b) => b.activity - a.activity).slice(0, 6);
    return {
      label: 'Most active volcanoes',
      items: it,
      summary: `${it.slice(0, 3).map(e => e.name).join(', ')} lead a combined ranking of seismicity, gas and thermal output over the past 7 days.`,
      ev: 'calculated'
    };
  }
  if (/ring of fire|pacific/.test(l)) {
    const it = E.filter(e => e.tags.includes('ring'));
    return {
      label: 'Pacific Ring of Fire',
      items: it,
      summary: `${it.length} notable systems along the Pacific margin this week.`,
      ev: 'observed'
    };
  }
  if (/erupt/.test(l)) {
    const it = E.filter(e => /Erupt|fountain|Strombolian|explos/i.test(e.status));
    return {
      label: 'Erupting now',
      items: it,
      summary: `${it.length} volcanoes are erupting or in explosive episodes. Etna is the most intense.`,
      ev: 'observed'
    };
  }
  if (/earthquake|quake/.test(l)) {
    return {
      label: 'Significant earthquakes',
      items: E.filter(e => e.kind === 'earthquake'),
      quakes: true,
      summary: 'Largest this week: M 6.1 off Kamchatka, with twelve aftershocks above M 4.',
      ev: 'observed'
    };
  }
  return {
    label: 'Notable right now',
    items: E.filter(e => e.featured),
    summary: 'Etna is erupting. Kīlauea and Sakurajima are in ongoing episodes, uplift continues on Reykjanes, and an aftershock sequence is underway off Kamchatka.',
    ev: 'observed'
  };
}
function WorldView({
  onOpen,
  onAnswer,
  restore,
  drawerOpen,
  registerAsk,
  onContext,
  dockH = 96
}) {
  const D = window.NOMA_DATA;
  const [size, setSize] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  const [land, setLand] = React.useState(null);
  const [sel, setSel] = React.useState(0);
  const [auto, setAuto] = React.useState(true);
  const [filter, setFilter] = React.useState(null);
  const [zoom, setZoom] = React.useState(null);
  React.useEffect(() => {
    const r = () => setSize({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  React.useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(r => r.json()).then(t => setLand(topojson.feature(t, t.objects.countries)));
  }, []);
  const items = filter ? filter.items : D.events.filter(e => e.featured);
  React.useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setSel(s => (s + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [auto, items]);
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'Escape') clear();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  const L = 16;
  const R = 16;
  const B = dockH + 24;
  const proj = React.useMemo(() => d3.geoNaturalEarth1().fitExtent([[L, 72], [size.w - 24, size.h - 40]], {
    type: 'Sphere'
  }), [size, L]);
  const path = d3.geoPath(proj);
  const grat = React.useMemo(() => d3.geoGraticule10(), []);
  // fit filtered set
  const fit = React.useMemo(() => {
    if (!filter || !filter.items.length) return {
      k: 1,
      tx: 0,
      ty: 0
    };
    const pts = filter.items.map(e => proj([e.lon, e.lat]));
    const xs = pts.map(p => p[0]),
      ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs),
      x1 = Math.max(...xs),
      y0 = Math.min(...ys),
      y1 = Math.max(...ys);
    const aw = size.w - L - R - 20,
      ah = Math.max(120, size.h - 90 - B);
    const k = Math.max(0.5, Math.min(3.2, aw / (x1 - x0 + 120), ah / (y1 - y0 + 120)));
    const cx = L + 10 + aw / 2,
      cy = 90 + ah / 2;
    return {
      k,
      tx: cx - (x0 + x1) / 2 * k,
      ty: cy - (y0 + y1) / 2 * k
    };
  }, [filter, proj, size, L, R, B]);
  const ev = items[Math.min(sel, items.length - 1)];
  const labelled = React.useMemo(() => {
    const s = new Set();
    if (!filter || filter.items.length > 10) return s;
    const k = zoom ? 1 : fit.k;
    const placed = [];
    const order = [...filter.items].sort((a, b) => ev && a.id === ev.id ? -1 : ev && b.id === ev.id ? 1 : b.activity - a.activity);
    for (const e of order) {
      const [x, y] = proj([e.lon, e.lat]);
      const X = x * k,
        Y = y * k;
      if (placed.every(([px, py]) => Math.abs(px - X) > 90 || Math.abs(py - Y) > 16)) {
        placed.push([X, Y]);
        s.add(e.id);
      }
    }
    return s;
  }, [filter, fit, proj, ev, zoom]);
  const go = i => {
    setAuto(false);
    setSel(i);
  };
  const clear = () => {
    setFilter(null);
    setSel(0);
  };
  const open = e => {
    const [x, y] = proj([e.lon, e.lat]);
    const k = 7;
    setAuto(false);
    setZoom(`translate(${size.w / 2 - x * k}px,${size.h / 2 - y * k}px) scale(${k})`);
    setTimeout(() => onOpen(e), 750);
  };
  const ask = q => {
    setAuto(false);
    setSel(0);
    const f = {
      q,
      ...parseWorld(q, D.events)
    };
    setFilter(f);
    onAnswer && onAnswer({
      q,
      view: 'world',
      state: {
        q
      },
      ctx: 'Earth · Now',
      answer: {
        title: f.title || f.label,
        body: f.summary,
        ev: f.ev,
        ...(WORLD_EXTRA[f.label] || {})
      }
    });
  };
  React.useEffect(() => {
    if (!restore || restore.view !== 'world') return;
    if (restore.state && restore.state.q) setFilter({
      q: restore.state.q,
      ...parseWorld(restore.state.q, D.events)
    });else setFilter(null);
    setSel(0);
  }, [restore && restore.nonce]);
  React.useEffect(() => {
    onContext && onContext(['Earth', 'Now', ...(filter ? [filter.label] : [])]);
  }, [filter]);
  React.useEffect(() => {
    registerAsk && registerAsk({
      ask,
      insets: {
        left: L,
        right: 16
      },
      placeholder: 'Ask about the planet…',
      suggestions: ['Show me the most active volcanoes right now', 'Show me all volcanoes along the Mid-Atlantic Ridge', 'Which volcanoes are erupting?', 'Largest earthquakes this week', 'Show the Pacific Ring of Fire']
    });
  });
  const gT = zoom || `translate(${fit.tx}px,${fit.ty}px) scale(${fit.k})`;
  const inv = 1 / (zoom ? 1 : fit.k);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--map-page)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size.w,
    height: size.h,
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("g", {
    style: {
      transform: gT,
      transformOrigin: '0 0',
      transition: 'transform 800ms var(--ease-out), opacity 800ms',
      opacity: zoom ? 0.2 : 1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: path({
      type: 'Sphere'
    }),
    fill: "var(--map-ground)",
    stroke: "var(--map-line)",
    onClick: clear
  }), /*#__PURE__*/React.createElement("path", {
    d: path(grat),
    fill: "none",
    stroke: "var(--map-grat)",
    style: {
      pointerEvents: 'none'
    }
  }), land && /*#__PURE__*/React.createElement("path", {
    d: path(land),
    fill: "var(--map-ground-2)",
    stroke: "var(--map-land-stroke)",
    strokeWidth: 0.6 * inv,
    onClick: clear
  }), filter && filter.ridge && /*#__PURE__*/React.createElement("path", {
    d: path({
      type: 'LineString',
      coordinates: D.ridge
    }),
    fill: "none",
    stroke: "rgba(var(--overlay-rgb),0.45)",
    strokeWidth: 1.5 * inv,
    strokeDasharray: `${5 * inv} ${4 * inv}`,
    style: {
      pointerEvents: 'none'
    }
  }), D.quakes.map(([lon, lat, m], i) => {
    const [x, y] = proj([lon, lat]);
    return /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: x,
      cy: y,
      r: m * 0.9 * inv,
      fill: filter && filter.quakes ? 'rgba(var(--overlay-rgb),0.5)' : 'rgba(var(--overlay-rgb),0.2)',
      style: {
        pointerEvents: 'none'
      }
    });
  }), D.events.map(e => {
    const [x, y] = proj([e.lon, e.lat]);
    const on = ev && e.id === ev.id;
    const inSet = items.includes(e);
    const c = toneColor[e.tone];
    const op = filter ? inSet ? 1 : 0.12 : e.featured ? 1 : 0.45;
    return /*#__PURE__*/React.createElement("g", {
      key: e.id,
      style: {
        cursor: 'pointer',
        opacity: op,
        transition: 'opacity 300ms',
        transform: `translate(${x}px,${y}px) scale(${inv})`,
        transformOrigin: '0 0'
      },
      onClick: () => open(e),
      onMouseEnter: () => {
        const i = items.indexOf(e);
        if (i >= 0) go(i);
      }
    }, /*#__PURE__*/React.createElement("circle", {
      r: "14",
      fill: "transparent"
    }), on && /*#__PURE__*/React.createElement("circle", {
      r: "6",
      fill: "none",
      stroke: c,
      strokeWidth: "1.5",
      className: "nm-pulse"
    }), e.kind === 'volcano' ? /*#__PURE__*/React.createElement("path", {
      d: e.featured || inSet ? 'M0,-6 L6,4 L-6,4 Z' : 'M0,-4 L4,3 L-4,3 Z',
      fill: c,
      stroke: "var(--map-page)",
      strokeWidth: "1"
    }) : /*#__PURE__*/React.createElement("circle", {
      r: "4.5",
      fill: c,
      stroke: "var(--map-page)"
    }), !on && labelled.has(e.id) && /*#__PURE__*/React.createElement("text", {
      x: "10",
      y: "4",
      fill: on ? 'var(--map-ink)' : 'var(--map-ink-2)',
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        letterSpacing: '0.06em',
        pointerEvents: 'none'
      }
    }, e.name.toUpperCase()));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      opacity: zoom ? 0 : 1,
      transition: 'opacity 400ms'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    style: {
      ...glassPill,
      position: 'absolute',
      top: 16,
      left: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 16px',
      pointerEvents: 'auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 17,
      letterSpacing: '-0.02em'
    }
  }, "noma"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "Earth"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)'
    }
  }, "Now \xB7 06:41 UTC"), /*#__PURE__*/React.createElement(ThemeToggle, null)), filter && /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    style: {
      ...glassPill,
      position: 'absolute',
      top: 16,
      left: `calc(${L}px + (100% - ${L + 16}px) / 2)`,
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 6px 6px 16px',
      pointerEvents: 'auto',
      maxWidth: `calc(100% - ${L + 32}px)`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)'
    }
  }, "Filter"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, filter.label), /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-muted)'
    }
  }, filter.items.length), /*#__PURE__*/React.createElement("button", {
    onClick: clear,
    "aria-label": "Clear filter",
    title: "Clear filter (Esc)",
    style: {
      width: 26,
      height: 26,
      borderRadius: '50%',
      border: 'none',
      background: 'var(--glass-hover)',
      color: 'var(--text-body)',
      cursor: 'pointer',
      fontSize: 14,
      lineHeight: 1
    }
  }, "\xD7")), ev && !zoom && /*#__PURE__*/React.createElement(Spotlight, {
    onAsk: ask,
    ev: ev,
    n: items.length,
    sel: Math.min(sel, items.length - 1),
    auto: auto,
    setAuto: setAuto,
    go: go,
    open: open,
    x: proj([ev.lon, ev.lat])[0] * fit.k + fit.tx,
    y: proj([ev.lon, ev.lat])[1] * fit.k + fit.ty,
    W: size.w,
    H: size.h,
    B: B,
    pts: items.filter(e => e !== ev).map(e => {
      const p = proj([e.lon, e.lat]);
      return [p[0] * fit.k + fit.tx, p[1] * fit.k + fit.ty];
    })
  })));
}
function Spotlight({
  ev,
  n,
  sel,
  auto,
  setAuto,
  go,
  open,
  onAsk,
  x,
  y,
  W,
  H,
  B,
  pts = []
}) {
  const CW = 290,
    LBL = 110,
    G = 22;
  const room = H - B - 16 - 72;
  const showImg = ev.img && room >= 276,
    showStream = room >= 212;
  const CH = (showImg ? 64 : 0) + (showStream ? 150 : 104) + 62;
  // score candidate rects by how many other markers (+ their right-hand labels) they cover; pick the least-covering, nearest one
  const minTop = 72,
    maxTop = Math.max(minTop, H - B - CH - 16);
  const clampT = t => Math.max(minTop, Math.min(maxTop, t)),
    clampL = l => Math.max(16, Math.min(W - 16 - CW, l));
  const cands = [];
  for (const L0 of [x + G, x - G - CW, x - CW / 2]) for (const T0 of [y - 44, y - CH - G, y + G, minTop, maxTop]) cands.push([clampL(L0), clampT(T0)]);
  const hits = (l, t) => pts.filter(([px, py]) => px + LBL > l - 6 && px - 8 < l + CW + 6 && py + 8 > t - 6 && py - 8 < t + CH + 6).length;
  const selfHit = (l, t) => x + 8 > l && x - 8 < l + CW && y + 8 > t && y - 8 < t + CH;
  let best = null;
  for (const [l, t] of cands) {
    if (selfHit(l, t)) continue;
    const s = hits(l, t) * 10000 + Math.hypot(l + CW / 2 - x, t + CH / 2 - y);
    if (!best || s < best[2]) best = [l, t, s];
  }
  const left = best ? best[0] : clampL(x + G),
    top = best ? best[1] : clampT(y - 44);
  const ex = Math.max(left, Math.min(left + CW, x)),
    ey = Math.max(top, Math.min(top + CH, y));
  const lead = Math.hypot(ex - x, ey - y) > G + 4;
  const pg = {
    width: 24,
    height: 24,
    border: 'none',
    borderRadius: '50%',
    background: 'var(--glass-hover)',
    color: 'var(--text-body)',
    cursor: 'pointer',
    fontSize: 13,
    lineHeight: 1,
    padding: 0
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, lead && /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: x,
    y1: y,
    x2: ex,
    y2: ey,
    stroke: "rgba(var(--overlay-rgb),0.45)",
    strokeWidth: "1",
    strokeDasharray: "2 3"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    style: {
      position: 'absolute',
      left,
      top,
      width: CW,
      borderRadius: 'var(--glass-radius)',
      overflow: 'hidden',
      pointerEvents: 'auto',
      transition: 'left 600ms var(--ease-out), top 600ms var(--ease-out)'
    }
  }, showImg && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 64
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    key: ev.id,
    id: 'spot-' + ev.id,
    shape: "rect",
    src: ev.img,
    placeholder: ""
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: toneColor[ev.tone],
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      flex: 1,
      minWidth: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, ev.name), /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)',
      whiteSpace: 'nowrap'
    }
  }, ev.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 4,
      lineHeight: 1.4
    }
  }, ev.headline), showStream && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Spark, {
    key: ev.id,
    base: ev.stream.base,
    amp: ev.stream.amp,
    w: CW - 28,
    h: 22,
    dark: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      ...labelStyle,
      color: 'var(--text-faint)',
      marginTop: 3
    }
  }, /*#__PURE__*/React.createElement("span", null, ev.stream.label, " \xB7 live"), /*#__PURE__*/React.createElement("span", null, ev.stream.unit))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: pg,
    "aria-label": "Previous",
    onClick: () => go((sel - 1 + n) % n)
  }, "\u2039"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      minWidth: 34,
      textAlign: 'center'
    }
  }, sel + 1, " / ", n), /*#__PURE__*/React.createElement("button", {
    style: pg,
    "aria-label": "Next",
    onClick: () => go((sel + 1) % n)
  }, "\u203A"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...pg,
      fontSize: 8
    },
    "aria-label": auto ? 'Pause' : 'Play',
    onClick: () => setAuto(!auto)
  }, auto ? '❚❚' : '▶'), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "dark",
    onClick: () => open(ev)
  }, "Explore \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 8,
      borderTop: '1px solid var(--line-1)',
      paddingTop: 6
    }
  }, [ev.kind === 'volcano' ? `Why is ${ev.name} ${ev.status.toLowerCase()}?` : `What caused the ${ev.name}?`, `Show volcanoes like ${ev.name}`].map(q => /*#__PURE__*/React.createElement("button", {
    key: q,
    onClick: () => onAsk(q),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 'none',
      padding: '4px 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--text-body)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-muted)'
  }, "\u21B3 ", q))))));
}
Object.assign(window, {
  WorldView,
  toneColor
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_noma_explorer/prototype/world-view.jsx", error: String((e && e.message) || e) }); }

// ui_kits/noma/AnswerPanel.jsx
try { (() => {
const {
  QueryBar,
  EvidenceTag,
  TimeStrip,
  ScenarioCard,
  Card,
  Button,
  Tabs
} = window.NomaDesignSystem_02438c;
function AnswerPanel({
  state,
  dispatch
}) {
  const [tab, setTab] = React.useState('Evidence');
  if (state.view === 'synthesis') return /*#__PURE__*/React.createElement(Card, {
    floating: true,
    label: "Mount Etna \xB7 Now",
    title: "Activity is elevated",
    style: {
      width: 300
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      lineHeight: 1.5
    }
  }, "142 earthquakes this week beneath the summit, most between 2 and 5 km depth. Tremor amplitude has been rising since Tuesday, and 3.2 cm of uplift was measured at the summit station."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(EvidenceTag, {
    kind: "observed",
    onInspect: () => dispatch({
      type: 'inspect'
    })
  }), /*#__PURE__*/React.createElement(EvidenceTag, {
    kind: "inferred"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    onClick: () => dispatch({
      type: 'ask',
      q: 'Show me the earthquakes'
    })
  }, "Show me the earthquakes"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    onClick: () => dispatch({
      type: 'ask',
      q: 'Why?'
    })
  }, "Why?")));
  if (state.view === 'quakes') return /*#__PURE__*/React.createElement(Card, {
    floating: true,
    label: "Earthquakes \xB7 7 days",
    title: state.minMag > 0 ? '6 events · M ' + state.minMag + '.0+' : '10 events shown',
    style: {
      width: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "Clustered beneath the summit at 2\u20137 km depth. Click an event on the map."), state.selQuake && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: '8px 10px',
      background: 'var(--surface-inset)',
      borderRadius: 'var(--radius-2)',
      fontFamily: 'var(--font-mono)',
      fontSize: 12
    }
  }, "M ", state.selQuake.mag, " \xB7 ", state.selQuake.depth, " km \xB7 ", state.selQuake.t), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(EvidenceTag, {
    kind: "observed",
    onInspect: () => dispatch({
      type: 'inspect'
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 12,
      flexWrap: 'wrap'
    }
  }, state.minMag === 0 && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    onClick: () => dispatch({
      type: 'ask',
      q: 'Only magnitude 2 and above'
    })
  }, "Only M 2+"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    onClick: () => dispatch({
      type: 'ask',
      q: 'Show me deformation'
    })
  }, "Deformation")));
  if (state.view === 'deformation') return /*#__PURE__*/React.createElement(Card, {
    floating: true,
    label: "Deformation \xB7 InSAR",
    title: "3.2 cm uplift at the summit",
    style: {
      width: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "The blue field shows ground displacement over 30 days; intensity fades with confidence."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(EvidenceTag, {
    kind: "retrieved",
    onInspect: () => dispatch({
      type: 'inspect'
    })
  }), /*#__PURE__*/React.createElement(EvidenceTag, {
    kind: "calculated"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    onClick: () => dispatch({
      type: 'ask',
      q: 'What if the plume reaches 8 km?'
    })
  }, "What if the plume reaches 8 km?")));
  if (state.view === 'scenario') return /*#__PURE__*/React.createElement(ScenarioCard, {
    question: "What if the plume reaches 8 km?",
    params: [{
      label: 'Column',
      value: '8 km'
    }, {
      label: 'Wind',
      value: 'Current'
    }, {
      label: 'Duration',
      value: '6 h'
    }, {
      label: 'Model',
      value: 'FALL3D'
    }],
    running: state.running,
    onRun: () => dispatch({
      type: 'run'
    }),
    onAdvanced: () => {}
  });
  if (state.view === 'plume') return /*#__PURE__*/React.createElement(Card, {
    floating: true,
    label: "Simulation \xB7 FALL3D",
    title: "Ash drifts southeast",
    style: {
      width: 290
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "With current winds, an 8 km column carries ash toward the Ionian coast within 6 hours. Opacity shows deposition probability."), /*#__PURE__*/React.createElement(Tabs, {
    tabs: ['Result', 'Assumptions'],
    value: tab,
    onChange: setTab,
    style: {
      marginTop: 10
    }
  }), tab === 'Assumptions' && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      marginTop: 8,
      color: 'var(--text-muted)'
    }
  }, "WIND 280\xB0/34 kt \xB7 GRID 1 km \xB7 V 8.2.1"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(EvidenceTag, {
    kind: "simulated",
    onInspect: () => dispatch({
      type: 'inspect'
    })
  }), /*#__PURE__*/React.createElement(EvidenceTag, {
    kind: "forecast"
  })));
  return null;
}
Object.assign(window, {
  AnswerPanel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/noma/AnswerPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/noma/DetailView.jsx
try { (() => {
const {
  QueryBar: DQueryBar,
  EvidenceTag: DEvidence,
  Badge: DBadge,
  Button: DButton,
  Card: DCard,
  Switch,
  Panel: DPanel
} = window.NomaDesignSystem_02438c;
const VENT = {
  x: 49,
  y: 28
};
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const tDate = t => {
  const d = new Date(2025, 9, 1);
  d.setDate(d.getDate() + Math.round(t * 359));
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
const defaults = e => ({
  wind: {
    dir: 270,
    speed: 22,
    label: 'W 22 kt at 5 km'
  },
  weather: {
    temp: '—',
    cloud: '—',
    vis: '—'
  },
  places: [],
  forests: [],
  streams: [{
    k: 'main',
    label: e.stream.label,
    unit: e.stream.unit,
    val: '—',
    trend: 'rising',
    ev: 'observed',
    base: e.stream.base,
    amp: e.stream.amp
  }],
  models: [{
    name: 'Ash dispersion',
    state: 'Ready',
    detail: 'On request'
  }],
  history: [{
    t: 0.5,
    label: 'Previous episode',
    major: true
  }, {
    t: 0.95,
    label: 'Current episode',
    major: true
  }]
});
function detailAnswer(q, d) {
  const l = q.toLowerCase();
  const full = d.places.length > 0;
  const st = d.streams.find(s => l.includes(s.label.toLowerCase()));
  if (st && /over the last year|history|record/.test(l)) return {
    a: {
      title: st.label + ': 12-month record',
      body: 'The current value is the highest since the December 2025 lava fountain. Drag the timeline to compare episodes.',
      ev: 'historical'
    },
    set: {
      timeOpen: true
    }
  };
  if (st && /why/.test(l)) return {
    a: {
      title: st.label + ' is ' + st.trend + ' with the current episode',
      body: 'Rising ' + st.label.toLowerCase() + ' usually tracks magma moving into the shallow conduit. It rose the same way for 9 days before the last lava fountain.',
      ev: 'inferred'
    },
    set: {}
  };
  const pl = d.places.find(p => l.includes(p.name.toLowerCase()));
  if (pl && /reach|exposed|ash|risk/.test(l)) return {
    a: {
      title: pl.bear.includes('S') || pl.bear.includes('E') ? pl.name + ' is downwind today' : pl.name + ' is upwind today',
      body: pl.bear.includes('S') || pl.bear.includes('E') ? 'Light ashfall is likely in ' + pl.name + ' (' + pl.dist + ' ' + pl.bear + ') from late morning. Accumulation should stay below 1 mm.' : 'Current winds carry ash away from ' + pl.name + '. Exposure is low unless winds turn easterly.',
      ev: 'forecast'
    },
    set: {
      plume: true,
      places: true
    }
  };
  if (/at risk/.test(l) && /forest|woodland|pineta|park/.test(l)) return {
    a: {
      title: 'Low risk to woodland this week',
      body: 'Modelled lava paths stay inside the Valle del Bove, away from forested flanks. Ashfall on the eastern pine stands is light.',
      ev: 'modelled'
    },
    set: {
      lava: true,
      places: true
    }
  };
  if (/plume|wind|ash|smoke/.test(l)) return {
    a: {
      title: full ? 'Ash is drifting east-southeast' : 'Ash would drift downwind',
      body: full ? `Winds of ${d.wind.label} carry the plume toward the Ionian coast. The shaded footprint shows where ash is likely to fall in the next 6 hours; it fades where the forecast is less certain.` : `Winds of ${d.wind.label} would carry ash away from ${d.name}. The footprint fades where the forecast is less certain.`,
      ev: 'forecast'
    },
    set: {
      plume: true
    }
  };
  if (!full) return {
    a: {
      title: 'Not available yet for ' + d.name,
      body: 'Detailed local data for this system is not in the prototype. Etna has the full sample dataset.',
      ev: 'inferred'
    },
    set: {}
  };
  if (/earthquake|quake|seism/.test(l)) return {
    a: {
      title: '38 earthquakes in the last 24 hours',
      body: 'Most are shallow, 1–4 km beneath the summit craters. The largest was M 2.9 at 04:12 UTC.',
      ev: 'observed'
    },
    set: {
      quakes: true
    }
  };
  if (/city|cities|town|near|who|people|forest/.test(l)) return {
    a: {
      title: 'Three towns lie within 15 km of the active vent',
      body: 'Zafferana Etnea, Nicolosi and Bronte. Catania (300k) is 28 km southeast, downwind today. Woodland covers much of the lower north and southwest flanks.',
      ev: 'retrieved'
    },
    set: {
      places: true
    }
  };
  if (/lava|flow/.test(l)) return {
    a: {
      title: 'Lava would most likely flow southeast',
      body: 'Three modelled paths follow the Valle del Bove. None reach inhabited areas within 72 hours at current effusion rates.',
      ev: 'modelled'
    },
    set: {
      lava: true
    }
  };
  if (/before|history|last year|past|changed/.test(l)) return {
    a: {
      title: 'Jumped to the December 2025 lava fountain',
      body: 'Tremor rose for 9 days before that episode, a pattern similar to this week.',
      ev: 'historical'
    },
    set: {
      t: 0.52,
      timeOpen: true
    }
  };
  return {
    a: {
      title: d.headline,
      body: d.summary,
      ev: 'observed'
    },
    set: {}
  };
}
function DetailView({
  event,
  onBack,
  onAnswer,
  drawerOpen,
  registerAsk,
  initState,
  onContext,
  dockH = 56
}) {
  const d = {
    ...defaults(event),
    ...event
  };
  const [o, setO] = React.useState({
    plume: false,
    quakes: false,
    places: true,
    lava: false,
    t: 1,
    timeOpen: true,
    ...(initState || {})
  });
  const [answer, setAnswer] = React.useState(null);
  const [menu, setMenu] = React.useState(null);
  const openMenu = (e, title, qs) => {
    e.stopPropagation();
    setMenu({
      x: e.clientX,
      y: e.clientY,
      title,
      qs
    });
  };
  const [vw, setVw] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const r = () => setVw(window.innerWidth);
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const RW = vw >= 1100 ? 340 : 300;
  const live = o.t > 0.97;
  const set = p => setO(s => ({
    ...s,
    ...p
  }));
  const ask = q => {
    const r = detailAnswer(q, d);
    setAnswer({
      q,
      ...r.a
    });
    set(r.set);
    const ns = {
      ...o,
      ...r.set
    };
    const tl = ns.t > 0.97 ? 'Now' : tDate(ns.t);
    onAnswer && onAnswer({
      q,
      view: 'detail',
      eventId: event.id,
      state: ns,
      ctx: d.name + ' · ' + tl,
      answer: {
        ...r.a,
        ...(DETAIL_EXTRA[r.a.title] || {
          sources: [{
            n: 'Noma synthesis of current observations',
            k: 'inferred'
          }]
        })
      }
    });
  };
  React.useEffect(() => {
    onContext && onContext([d.name, live ? 'Now' : tDate(o.t), ...(o.plume ? ['Ash forecast'] : []), ...(o.quakes ? ['Earthquakes'] : []), ...(o.lava ? ['Lava paths'] : []), ...(o.places && d.places.length ? ['Towns'] : [])]);
  }, [o.t, o.plume, o.quakes, o.lava, o.places]);
  const windRot = (d.wind.dir + 180) % 360 - 90;
  React.useEffect(() => {
    registerAsk && registerAsk({
      ask,
      insets: vw >= 1100 ? {
        left: RW + 32,
        right: RW + 32
      } : {
        left: 16,
        right: 16
      },
      placeholder: `Ask about ${d.name}…`,
      suggestions: sugg
    });
  });
  const sugg = d.places.length ? ['Where is the plume going?', 'Who lives nearby?', 'Show me the earthquakes', 'Where would lava flow?', 'What happened before the last eruption?'] : ['Where is the plume going?', `Why is ${d.streams[0].label.toLowerCase()} rising?`];
  return /*#__PURE__*/React.createElement("div", {
    className: "nm-fadein",
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--map-ground)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: 'terrain-' + event.id,
    shape: "rect",
    src: event.img || '',
    placeholder: 'Drop a terrain render of ' + event.name
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(180deg,rgba(15,19,23,0.4),transparent 16%,transparent 78%,rgba(15,19,23,0.5))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }
  }, live && [0, 1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "nm-puff",
    style: {
      left: VENT.x + '%',
      top: VENT.y + '%',
      animationDelay: i * 1.1 + 's',
      '--wx': Math.cos(windRot * Math.PI / 180) * 180 + 'px',
      '--wy': Math.sin(windRot * Math.PI / 180) * 60 - 90 + 'px'
    }
  })), Array.from({
    length: 14
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      left: 8 + i % 7 * 11 + '%',
      top: 9 + Math.floor(i / 7) * 9 + '%',
      color: 'rgba(233,237,241,0.35)',
      fontSize: 13,
      transform: `rotate(${windRot}deg)`
    }
  }, "\u2192")), o.plume && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: VENT.x + '%',
      top: VENT.y + '%',
      width: '46vw',
      height: '20vw',
      marginTop: '-10vw',
      transformOrigin: '0 50%',
      transform: `rotate(${windRot + 14}deg)`,
      background: 'radial-gradient(80% 55% at 4% 50%, rgba(233,237,241,0.55), rgba(233,237,241,0.25) 45%, rgba(233,237,241,0.07) 72%, transparent 86%)',
      borderRadius: '50%'
    }
  }), o.lava && /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    }
  }, ['M49,28 C52,40 58,52 63,70', 'M49,28 C47,42 44,58 40,76', 'M49,28 C56,36 64,44 71,55'].map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: p,
    fill: "none",
    stroke: "#E0442F",
    strokeWidth: i === 0 ? 2.5 : 1.5,
    strokeDasharray: "4 3",
    vectorEffect: "non-scaling-stroke",
    opacity: i === 0 ? 0.95 : 0.6
  }))), o.quakes && [[47, 31, 2.9], [50, 33, 1.8], [48, 35, 2.2], [52, 30, 1.2], [46, 29, 1.5], [51, 36, 2.4], [49, 32, 1.1], [53, 34, 1.6]].map(([x, y, m], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      left: x + '%',
      top: y + '%',
      width: m * 8,
      height: m * 8,
      margin: -m * 4,
      borderRadius: '50%',
      border: '1.5px solid #E9EDF1',
      background: 'rgba(233,237,241,0.2)'
    }
  })), o.places && d.forests.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.name,
    onClick: e => openMenu(e, f.name, [`Is ${f.name} at risk?`, 'Where would lava flow?']),
    style: {
      pointerEvents: 'auto',
      cursor: 'pointer',
      position: 'absolute',
      left: f.x + '%',
      top: f.y + '%',
      width: f.w + '%',
      height: f.h + '%',
      borderRadius: '40%',
      border: '1px dashed rgba(143,190,128,0.8)',
      background: 'rgba(62,124,79,0.22)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      position: 'absolute',
      left: 10,
      top: 8,
      color: '#CFE3C4'
    }
  }, f.name))), o.places && d.places.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    onClick: e => openMenu(e, p.name, [`Will ash reach ${p.name}?`, `How exposed is ${p.name}?`, 'Who lives nearby?']),
    style: {
      position: 'absolute',
      left: p.x + '%',
      top: p.y + '%',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      transform: 'translate(-5px,-5px)',
      pointerEvents: 'auto',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: p.type === 'city' ? 2 : '50%',
      background: '#F6F4EF',
      border: '2px solid #161B20'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "nm-glass nm-glass-surface",
    style: {
      padding: '3px 8px',
      borderRadius: 'var(--radius-1)',
      fontSize: 13,
      whiteSpace: 'nowrap'
    }
  }, p.name, /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-muted)',
      marginLeft: 8
    }
  }, p.dist, " ", p.bear, p.pop ? ' · ' + p.pop : '')))), /*#__PURE__*/React.createElement("div", {
    onClick: e => openMenu(e, 'the active vent', d.places.length ? ['Where is the plume going?', 'Where would lava flow?', 'Show me the earthquakes'] : ['Where is the plume going?', `Why is ${d.streams[0].label.toLowerCase()} rising?`]),
    style: {
      position: 'absolute',
      left: VENT.x + '%',
      top: VENT.y + '%',
      transform: 'translate(-50%,-6px)',
      padding: '8px 10px',
      pointerEvents: 'auto',
      cursor: 'pointer',
      ...labelStyle,
      color: '#E9EDF1',
      textShadow: '0 1px 3px #000'
    }
  }, "\u25B2 Active vent")), /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      borderRadius: 'var(--radius-pill)',
      padding: '6px 16px 6px 6px',
      maxWidth: `calc(100% - ${RW + 48}px)`,
      overflow: 'hidden',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement(DButton, {
    size: "sm",
    variant: "secondary",
    onClick: onBack,
    style: {
      borderRadius: 999,
      whiteSpace: 'nowrap',
      flex: 'none'
    }
  }, "\u2190 Earth"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 17,
      whiteSpace: 'nowrap'
    }
  }, d.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      minWidth: 0
    }
  }, d.region), /*#__PURE__*/React.createElement(ThemeToggle, null), /*#__PURE__*/React.createElement(DBadge, {
    tone: live ? d.tone === 'neutral' || d.tone === 'quiet' ? 'neutral' : d.tone : 'neutral',
    style: {
      whiteSpace: 'nowrap'
    }
  }, live ? d.status : 'Historical')), /*#__PURE__*/React.createElement(RightColumn, {
    d: d,
    live: live,
    o: o,
    set: set,
    RW: RW,
    B: vw >= 1100 ? 16 : dockH + 26,
    openMenu: openMenu
  }), /*#__PURE__*/React.createElement(AskMenu, {
    menu: menu,
    onAsk: ask,
    onClose: () => setMenu(null)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      right: 16,
      bottom: vw >= 1100 ? 16 : dockH + 26,
      width: RW,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(ModelsPanel, {
    d: d,
    o: o,
    set: set
  }), /*#__PURE__*/React.createElement(TimePanel, {
    o: o,
    set: set,
    d: d,
    live: live
  })));
}
function TimePanel({
  o,
  set,
  d,
  live
}) {
  return /*#__PURE__*/React.createElement(DPanel, {
    title: "Time",
    meta: live ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#5FA36F'
      }
    }, "\u25CF Now") : tDate(o.t),
    open: o.timeOpen,
    onToggle: v => set({
      timeOpen: v
    })
  }, /*#__PURE__*/React.createElement(Timeline, {
    t: o.t,
    setT: t => set({
      t
    }),
    marks: d.history
  }), !live && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(DButton, {
    size: "sm",
    variant: "secondary",
    onClick: () => set({
      t: 1
    })
  }, "Return to now")));
}
function ModelsPanel({
  d,
  o,
  set
}) {
  return /*#__PURE__*/React.createElement(DPanel, {
    title: "Models & overlays",
    meta: d.models.filter(m => m.state === 'Running').length + ' running'
  }, d.models.map((m, i) => {
    const key = m.name === 'Ash dispersion' ? 'plume' : m.name === 'Lava flow paths' ? 'lava' : null;
    return /*#__PURE__*/React.createElement("div", {
      key: m.name,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
        borderTop: i ? '1px solid var(--line-1)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-faint)'
      }
    }, m.state, " \xB7 ", m.detail)), key && /*#__PURE__*/React.createElement(Switch, {
      checked: o[key],
      onChange: e => set({
        [key]: e.target.checked
      })
    }));
  }), d.places.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 0',
      borderTop: '1px solid var(--line-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 14
    }
  }, "Towns & forests"), /*#__PURE__*/React.createElement(Switch, {
    checked: o.places,
    onChange: e => set({
      places: e.target.checked
    })
  })));
}
function RightColumn({
  d,
  live,
  o,
  set,
  RW,
  B,
  openMenu
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 72,
      left: 16,
      bottom: B,
      width: RW,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(DPanel, {
    title: "Data streams",
    meta: live ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#5FA36F'
      }
    }, "\u25CF Live") : 'Paused'
  }, d.streams.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.k,
    onClick: e => openMenu(e, s.label.toLowerCase(), [`Why is ${s.label.toLowerCase()} ${s.trend}?`, `Show ${s.label.toLowerCase()} over the last year`]),
    title: "Ask about this",
    style: {
      marginTop: i ? 12 : 2,
      cursor: 'pointer',
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      marginLeft: 8
    }
  }, s.val, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      fontSize: 11
    }
  }, s.unit))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Spark, {
    base: s.base,
    amp: s.amp,
    w: RW - 30,
    h: 24,
    paused: !live,
    dark: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(DEvidence, {
    kind: live ? s.ev : 'historical'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)'
    }
  }, s.trend))))), /*#__PURE__*/React.createElement(DPanel, {
    title: "Local conditions",
    meta: d.wind.label.split(' at')[0]
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px 16px'
    }
  }, [['Wind', d.wind.label], ['Temperature', d.weather.temp], ['Cloud', d.weather.cloud], ['Visibility', d.weather.vis]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)'
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      marginTop: 2
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(DEvidence, {
    kind: "forecast"
  }))));
}
function Timeline({
  t,
  setT,
  marks
}) {
  const ref = React.useRef(null);
  const drag = e => {
    const r = ref.current.getBoundingClientRect();
    setT(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
  };
  const down = e => {
    drag(e);
    const mv = ev => drag(ev);
    const up = () => {
      window.removeEventListener('pointermove', mv);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
  };
  const live = t > 0.97;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '2px 4px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onPointerDown: down,
    style: {
      flex: 1,
      height: 40,
      position: 'relative',
      cursor: 'ew-resize',
      touchAction: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 14,
      height: 2,
      background: 'var(--line-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      width: t * 100 + '%',
      top: 14,
      height: 2,
      background: 'var(--ink-3)'
    }
  }), MONTHS.map((m, i) => i % 2 === 0 && /*#__PURE__*/React.createElement("span", {
    key: m + i,
    style: {
      position: 'absolute',
      left: i / 12 * 100 + '%',
      top: 24,
      ...labelStyle,
      color: 'var(--text-faint)'
    }
  }, m)), marks.map(m => /*#__PURE__*/React.createElement("span", {
    key: m.label,
    title: m.label,
    onPointerDown: e => {
      e.stopPropagation();
      setT(m.t);
    },
    style: {
      position: 'absolute',
      left: m.t * 100 + '%',
      top: 15,
      width: m.major ? 10 : 7,
      height: m.major ? 10 : 7,
      transform: 'translate(-50%,-50%)',
      borderRadius: '50%',
      background: m.major ? '#E0442F' : 'var(--ink-3)',
      border: '2px solid #1D242B',
      cursor: 'pointer'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: t * 100 + '%',
      top: 2,
      bottom: 16,
      width: 2,
      marginLeft: -1,
      background: 'var(--ink-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -2,
      left: -5,
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: 'var(--ink-1)'
    }
  }))));
}
Object.assign(window, {
  DetailView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/noma/DetailView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/noma/Investigation.jsx
try { (() => {
const {
  EvidenceTag: IEvidence,
  Button: IButton
} = window.NomaDesignSystem_02438c;
const WORLD_EXTRA = {
  'Along the Mid-Atlantic Ridge': {
    points: ['Iceland hosts four of the nine, and all recent eruptions.', 'The Azores sit near the triple junction with the Eurasian and African plates.', 'The southern ridge volcanoes are remote and largely unmonitored.'],
    sources: [{
      n: 'Global Volcanism Program, Smithsonian',
      k: 'retrieved'
    }, {
      n: 'Icelandic Met Office — seismic & GNSS',
      k: 'observed'
    }, {
      n: 'IVAR, University of the Azores',
      k: 'retrieved'
    }]
  },
  'Most active volcanoes': {
    points: ['Etna — tremor and SO₂ both at 12-month highs.', 'Kīlauea — episode 31 of summit fountaining.', 'Merapi — dome growth with pyroclastic flows.'],
    sources: [{
      n: 'INGV Osservatorio Etneo',
      k: 'observed'
    }, {
      n: 'USGS Hawaiian Volcano Observatory',
      k: 'observed'
    }, {
      n: 'PVMBG / BPPTKG Indonesia',
      k: 'observed'
    }, {
      n: 'Noma activity index (7-day composite)',
      k: 'calculated'
    }]
  },
  'Erupting now': {
    sources: [{
      n: 'Smithsonian / USGS Weekly Volcanic Activity Report',
      k: 'retrieved'
    }, {
      n: 'VAAC Toulouse, Tokyo, Washington',
      k: 'observed'
    }]
  },
  'Significant earthquakes': {
    sources: [{
      n: 'USGS ComCat',
      k: 'observed'
    }, {
      n: 'GFZ GEOFON',
      k: 'observed'
    }]
  },
  'Notable right now': {
    sources: [{
      n: 'Smithsonian / USGS Weekly Volcanic Activity Report',
      k: 'retrieved'
    }, {
      n: 'USGS ComCat',
      k: 'observed'
    }]
  }
};
const DETAIL_EXTRA = {
  'Ash is drifting east-southeast': {
    points: ['Ash likely over Catania from about 12:00 UTC.', 'Catania airport: moderate risk of disruption this afternoon.', 'Uncertainty grows after 4 hours as winds back to the southwest.'],
    sources: [{
      n: 'ECMWF wind forecast, 06 UTC run',
      k: 'forecast'
    }, {
      n: 'FALL3D ash dispersion v8.2',
      k: 'modelled'
    }, {
      n: 'VAAC Toulouse advisory 0612',
      k: 'observed'
    }]
  },
  '38 earthquakes in the last 24 hours': {
    points: ['Depths cluster at 1–4 km, shallower than last month.', 'No events deeper than 10 km, so no sign of deep recharge.'],
    sources: [{
      n: 'INGV-OE seismic network (18 of 21 stations)',
      k: 'observed'
    }]
  },
  'Three towns lie within 15 km of the active vent': {
    sources: [{
      n: 'ISTAT population 2024',
      k: 'retrieved'
    }, {
      n: 'Copernicus CORINE land cover',
      k: 'retrieved'
    }]
  },
  'Lava would most likely flow southeast': {
    sources: [{
      n: 'MAGFLOW lava-flow model, INGV',
      k: 'modelled'
    }, {
      n: 'TINITALY 10 m DEM',
      k: 'retrieved'
    }]
  },
  'Jumped to the December 2025 lava fountain': {
    sources: [{
      n: 'INGV-OE bulletins, Dec 2025',
      k: 'historical'
    }]
  }
};
const {
  QueryBar: AQueryBar
} = window.NomaDesignSystem_02438c;
const chatLink = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  color: 'var(--text-muted)',
  whiteSpace: 'nowrap'
};
function Message({
  m,
  cur,
  onRestore
}) {
  const [more, setMore] = React.useState(false);
  const src = m.answer.sources || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'flex-end',
      maxWidth: '80%',
      background: 'var(--glass-bubble)',
      borderRadius: '16px 16px 4px 16px',
      padding: '7px 12px',
      fontSize: 14
    }
  }, m.q), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '92%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      lineHeight: 1.35
    }
  }, m.answer.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      lineHeight: 1.5,
      marginTop: 2
    }
  }, m.answer.body), more && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, (m.answer.points || []).map(p => /*#__PURE__*/React.createElement("div", {
    key: p,
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "\u2014 ", p)), src.map((s, j) => /*#__PURE__*/React.createElement("div", {
    key: j,
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, s.n), /*#__PURE__*/React.createElement(IEvidence, {
    kind: s.k
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(IEvidence, {
    kind: m.answer.ev
  }), src.length > 0 && /*#__PURE__*/React.createElement("button", {
    style: chatLink,
    onClick: () => setMore(!more)
  }, src.length, " source", src.length > 1 ? 's' : '', " ", more ? '▴' : '▾'), cur ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: '#5FA36F'
    }
  }, "\u25CF On map") : /*#__PURE__*/React.createElement("button", {
    style: chatLink,
    onClick: () => onRestore(m)
  }, "Show on map"))));
}
function ChatDock({
  thread,
  ctx,
  currentId,
  open,
  setOpen,
  onAsk,
  placeholder,
  suggestions,
  onRestore,
  onNew,
  onToast,
  insets,
  onHeight,
  history = [],
  onLoad
}) {
  const [hist, setHist] = React.useState(false);
  React.useEffect(() => {
    if (!hist) return;
    const c = () => setHist(false);
    const k = e => {
      if (e.key === 'Escape') setHist(false);
    };
    const id = setTimeout(() => window.addEventListener('pointerdown', c), 0);
    window.addEventListener('keydown', k);
    return () => {
      clearTimeout(id);
      window.removeEventListener('pointerdown', c);
      window.removeEventListener('keydown', k);
    };
  }, [hist]);
  const bodyRef = React.useRef(null);
  const boxRef = React.useRef(null);
  React.useEffect(() => {
    if (!boxRef.current || !onHeight) return;
    const ro = new ResizeObserver(() => onHeight(boxRef.current.offsetHeight));
    ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, []);
  const n = thread.length;
  const expanded = open && n > 0;
  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [n, expanded]);
  const histBtn = /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setHist(!hist),
    title: "Previous chats",
    "aria-label": "Previous chats",
    style: {
      width: 28,
      height: 28,
      flex: 'none',
      borderRadius: '50%',
      border: '1px solid var(--line-1)',
      background: hist ? 'var(--glass-hover)' : 'transparent',
      color: 'var(--text-body)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2.5,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 1.5,
      background: 'currentColor'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 1.5,
      background: 'currentColor'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 1.5,
      background: 'currentColor',
      alignSelf: 'center',
      marginRight: 4
    }
  }));
  const reopen = n > 0 && !expanded ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(true),
    title: "Show conversation",
    style: {
      ...chatLink,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      height: 28,
      padding: '0 10px',
      borderRadius: 999,
      border: '1px solid var(--line-1)',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-body)'
    }
  }, n, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9
    }
  }, "\u25B2")) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: insets.left,
      right: insets.right,
      bottom: 16,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 30,
      pointerEvents: 'none',
      transition: 'left var(--dur-med), right var(--dur-med)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: boxRef,
    className: "nm-glass nm-glass-surface",
    style: {
      position: 'relative',
      pointerEvents: 'auto',
      width: '100%',
      maxWidth: 620,
      borderRadius: expanded ? 'var(--glass-radius)' : 28,
      display: 'flex',
      flexDirection: 'column',
      background: expanded ? 'var(--glass-bg-strong)' : 'var(--glass-bg)'
    }
  }, expanded && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 14px 8px',
      borderBottom: '1px solid var(--line-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-faint)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, ctx.join(' · ')), /*#__PURE__*/React.createElement("button", {
    style: chatLink,
    onClick: () => onToast('Link copied — opens at the same map state')
  }, "Share"), /*#__PURE__*/React.createElement("button", {
    style: chatLink,
    onClick: onNew
  }, "New"), /*#__PURE__*/React.createElement("button", {
    style: chatLink,
    onClick: () => setOpen(false),
    title: "Hide conversation"
  }, "Hide \u25BE")), /*#__PURE__*/React.createElement("div", {
    ref: bodyRef,
    style: {
      overflow: 'auto',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      maxHeight: 'min(420px, calc(100vh - 220px))'
    }
  }, thread.map(m => /*#__PURE__*/React.createElement(Message, {
    key: m.id,
    m: m,
    cur: m.id === currentId,
    onRestore: onRestore
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 6,
      borderTop: expanded ? '1px solid var(--line-1)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(AQueryBar, {
    embedded: true,
    placeholder: placeholder,
    examples: suggestions,
    onAsk: q => {
      onAsk(q);
      setOpen(true);
    },
    trailing: /*#__PURE__*/React.createElement(React.Fragment, null, reopen, histBtn)
  })), hist && /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    onPointerDown: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      right: 0,
      bottom: 'calc(100% + 8px)',
      width: 320,
      maxWidth: '100%',
      borderRadius: 'var(--glass-radius)',
      padding: 6,
      background: 'var(--glass-bg-strong)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '4px 10px 6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)',
      flex: 1
    }
  }, "Previous chats"), /*#__PURE__*/React.createElement("button", {
    style: chatLink,
    onClick: () => {
      onNew();
      setHist(false);
    }
  }, "New chat")), n > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '7px 10px',
      borderRadius: 'var(--radius-2)',
      background: 'var(--glass-hover)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, thread[0].q), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-faint)',
      marginTop: 2
    }
  }, "Current \xB7 ", n, " question", n > 1 ? 's' : '')), history.map(h => /*#__PURE__*/React.createElement("button", {
    key: h.id,
    onClick: () => {
      onLoad(h);
      setHist(false);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      background: 'none',
      border: 'none',
      borderRadius: 'var(--radius-2)',
      padding: '7px 10px',
      cursor: 'pointer',
      color: 'var(--text-body)',
      fontFamily: 'var(--font-sans)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--glass-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'none'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, h.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-faint)',
      marginTop: 2
    }
  }, h.place, " \xB7 ", h.thread.length, " question", h.thread.length > 1 ? 's' : '', " \xB7 ", h.date))), history.length === 0 && n === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      padding: '6px 10px 8px'
    }
  }, "No previous chats yet."))));
}
function AskMenu({
  menu,
  onAsk,
  onClose
}) {
  React.useEffect(() => {
    if (!menu) return;
    const k = e => {
      if (e.key === 'Escape') onClose();
    };
    const c = () => onClose();
    window.addEventListener('keydown', k);
    const id = setTimeout(() => window.addEventListener('pointerdown', c), 0);
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', k);
      window.removeEventListener('pointerdown', c);
    };
  }, [menu]);
  if (!menu) return null;
  const W = 280,
    left = Math.max(16, Math.min(window.innerWidth - W - 16, menu.x + 12)),
    top = Math.max(16, Math.min(window.innerHeight - 60 - menu.qs.length * 36, menu.y + 12));
  return /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    onPointerDown: e => e.stopPropagation(),
    style: {
      position: 'fixed',
      left,
      top,
      width: W,
      borderRadius: 'var(--glass-radius)',
      padding: 6,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)',
      padding: '4px 10px 6px'
    }
  }, "Ask about ", menu.title), menu.qs.map(q => /*#__PURE__*/React.createElement("button", {
    key: q,
    onClick: () => {
      onAsk(q);
      onClose();
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-body)',
      background: 'none',
      border: 'none',
      borderRadius: 'var(--radius-2)',
      padding: '7px 10px',
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--glass-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'none'
  }, q)));
}
Object.assign(window, {
  AskMenu,
  ChatDock,
  WORLD_EXTRA,
  DETAIL_EXTRA
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/noma/Investigation.jsx", error: String((e && e.message) || e) }); }

// ui_kits/noma/MapCanvas.jsx
try { (() => {
const mapStyles = {};
function MapCanvas({
  showQuakes,
  minMag = 0,
  showDeformation,
  showPlume,
  selected,
  onSelect
}) {
  const quakes = [{
    x: 47,
    y: 44,
    mag: 3.2,
    depth: 4.1,
    t: '06:41 UTC'
  }, {
    x: 49,
    y: 41,
    mag: 2.1,
    depth: 3.0,
    t: '05:12 UTC'
  }, {
    x: 51,
    y: 46,
    mag: 1.4,
    depth: 2.2,
    t: '04:58 UTC'
  }, {
    x: 45,
    y: 48,
    mag: 2.8,
    depth: 5.6,
    t: '03:20 UTC'
  }, {
    x: 53,
    y: 43,
    mag: 1.1,
    depth: 1.8,
    t: '02:44 UTC'
  }, {
    x: 48,
    y: 50,
    mag: 1.9,
    depth: 6.4,
    t: '01:31 UTC'
  }, {
    x: 44,
    y: 41,
    mag: 2.4,
    depth: 4.8,
    t: '00:07 UTC'
  }, {
    x: 52,
    y: 49,
    mag: 1.6,
    depth: 3.5,
    t: '23:50 UTC'
  }, {
    x: 50,
    y: 38,
    mag: 2.0,
    depth: 2.9,
    t: '22:18 UTC'
  }, {
    x: 46,
    y: 52,
    mag: 1.2,
    depth: 7.1,
    t: '21:03 UTC'
  }];
  const ring = (s, o) => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      position: 'absolute',
      left: '50%',
      top: '45%',
      width: s,
      height: s * 0.82,
      transform: 'translate(-50%,-50%)',
      border: '1px solid rgba(154,166,177,' + o + ')',
      borderRadius: '46% 54% 50% 50%/52% 48% 55% 45%'
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--map-ground)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(60% 55% at 50% 45%, var(--map-ground-2), var(--map-ground) 75%)'
    }
  }), [560, 470, 390, 315, 245, 180, 120, 70].map((s, i) => ring(s, 0.10 + i * 0.022)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '18%',
      background: 'linear-gradient(90deg,transparent,rgba(43,52,61,0.9))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '11%',
      background: '#101418'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '10%',
      top: '20%',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.12em',
      color: 'rgba(154,166,177,0.5)'
    }
  }, "IONIAN SEA"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 14,
      bottom: 12,
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.08em',
      color: 'rgba(154,166,177,0.55)'
    }
  }, "37.751\xB0 N\xA0\xA014.994\xB0 E\xA0\xA0\xB7\xA0\xA01 : 250 000"), showDeformation && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '45%',
      width: 190,
      height: 150,
      transform: 'translate(-46%,-54%)',
      background: 'radial-gradient(closest-side, rgba(58,110,165,0.42), rgba(58,110,165,0.14) 65%, transparent)',
      borderRadius: '50%',
      transition: 'opacity 400ms'
    }
  }), showPlume && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '45%',
      width: 520,
      height: 230,
      transformOrigin: '0 50%',
      transform: 'rotate(24deg)',
      background: 'radial-gradient(85% 60% at 6% 50%, rgba(168,163,152,0.5), rgba(168,163,152,0.22) 45%, rgba(168,163,152,0.08) 72%, transparent 85%)',
      borderRadius: '50%',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '45%',
      transform: 'translate(-50%,-50%)',
      textAlign: 'center',
      color: 'var(--map-ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1
    }
  }, "\u25B2"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.1em',
      marginTop: 4,
      color: 'var(--map-ink-2)'
    }
  }, "ETNA\xA03357 m")), showQuakes && quakes.filter(q => q.mag >= minMag).map((q, i) => {
    const r = 5 + q.mag * 3.4;
    const sel = selected === i;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => onSelect && onSelect(i, q),
      title: 'M ' + q.mag,
      style: {
        position: 'absolute',
        left: q.x + '%',
        top: q.y + '%',
        width: r * 2,
        height: r * 2,
        marginLeft: -r,
        marginTop: -r,
        borderRadius: '50%',
        background: 'rgba(168,163,152,' + (0.22 + q.mag * 0.08) + ')',
        border: sel ? '1.5px solid var(--map-ink)' : '1px solid rgba(200,196,186,0.9)',
        cursor: 'pointer',
        padding: 0,
        transition: 'border 120ms'
      }
    });
  }));
}
Object.assign(window, {
  MapCanvas
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/noma/MapCanvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/noma/Streams.jsx
try { (() => {
function useLiveSeries(base, amp, n = 48, paused) {
  const gen = i => base + amp * (Math.sin(i / 4) * 0.5 + Math.sin(i / 1.7) * 0.3 + (Math.random() - 0.5) * 0.6);
  const [s, set] = React.useState(() => Array.from({
    length: n
  }, (_, i) => gen(i)));
  const iRef = React.useRef(n);
  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      iRef.current++;
      set(v => [...v.slice(1), gen(iRef.current)]);
    }, 900);
    return () => clearInterval(t);
  }, [base, amp, paused]);
  return s;
}
function Spark({
  base,
  amp,
  w = 220,
  h = 36,
  dark,
  paused,
  color
}) {
  const s = useLiveSeries(base, amp, 48, paused);
  const min = Math.min(...s),
    max = Math.max(...s),
    r = max - min || 1;
  const pts = s.map((v, i) => (i / (s.length - 1) * w).toFixed(1) + ',' + (h - 2 - (v - min) / r * (h - 4)).toFixed(1)).join(' ');
  const last = s[s.length - 1],
    ly = h - 2 - (last - min) / r * (h - 4);
  const c = color || (dark ? 'var(--map-ink)' : 'var(--ink-1)');
  return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "0",
    x2: w,
    y1: h - 1,
    y2: h - 1,
    stroke: dark ? 'var(--map-line)' : 'var(--line-1)'
  }), /*#__PURE__*/React.createElement("polyline", {
    points: pts,
    fill: "none",
    stroke: c,
    strokeWidth: "1.25",
    strokeLinejoin: "round"
  }), !paused && /*#__PURE__*/React.createElement("circle", {
    cx: w,
    cy: ly,
    r: "2.5",
    fill: c
  }));
}
const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase'
};
function ThemeToggle() {
  const [t, setT] = React.useState(document.documentElement.dataset.theme || 'dark');
  const flip = () => {
    const n = t === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = n;
    localStorage.setItem('noma-theme', n);
    setT(n);
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: flip,
    title: t === 'dark' ? 'Light theme' : 'Dark theme',
    "aria-label": "Toggle theme",
    style: {
      width: 26,
      height: 26,
      flex: 'none',
      borderRadius: '50%',
      border: '1px solid var(--line-1)',
      background: 'var(--glass-hover)',
      color: 'var(--text-body)',
      cursor: 'pointer',
      fontSize: 13,
      lineHeight: 1,
      padding: 0
    }
  }, t === 'dark' ? '☀' : '☾');
}
Object.assign(window, {
  Spark,
  useLiveSeries,
  labelStyle,
  ThemeToggle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/noma/Streams.jsx", error: String((e && e.message) || e) }); }

// ui_kits/noma/WorldView.jsx
try { (() => {
const {
  QueryBar,
  EvidenceTag,
  Badge,
  Button,
  Card,
  IconButton,
  Panel
} = window.NomaDesignSystem_02438c;
const toneColor = {
  alert: '#E0442F',
  caution: '#D9A02A',
  neutral: 'var(--map-mark)',
  ok: '#5FA36F',
  quiet: '#7D8893'
};
const glassPill = {
  borderRadius: 'var(--radius-pill)'
};
function parseWorld(q, E) {
  const l = q.toLowerCase();
  const V = E.filter(e => e.kind === 'volcano');
  const hit = E.find(e => l.includes(e.name.toLowerCase()));
  if (hit && /like|similar/.test(l)) {
    const it = [hit, ...E.filter(e => e !== hit && e.kind === hit.kind && e.tags.some(t => hit.tags.includes(t)))];
    return {
      label: 'Similar to ' + hit.name,
      items: it,
      summary: it.length > 1 ? it.length - 1 + ' systems share ' + hit.name + "'s tectonic setting. " + it.slice(1, 3).map(e => e.name).join(' and ') + ' are the most active of them.' : 'No close analogues in the current feed.',
      ev: 'retrieved'
    };
  }
  if (hit && /last year|compare/.test(l)) return {
    label: hit.name + ' vs last year',
    items: [hit],
    summary: hit.name + ' is more active than at this time last year, when it was in a quiet phase between episodes.',
    ev: 'historical'
  };
  if (hit) return {
    label: hit.name,
    title: hit.headline,
    items: [hit],
    summary: hit.summary,
    ev: 'observed'
  };
  if (/atlantic|ridge|rift/.test(l)) {
    const ids = E.filter(e => e.tags.includes('mar'));
    const act = ids.filter(e => e.activity > 50);
    return {
      label: 'Along the Mid-Atlantic Ridge',
      items: ids,
      ridge: true,
      summary: `${ids.length} volcanoes lie on or near the ridge. ${act.length === 1 ? 'Only ' + act[0].name + ', on Reykjanes, is' : act.length + ' are'} currently active; the Icelandic systems are the most closely monitored.`,
      ev: 'retrieved'
    };
  }
  if (/most active|active|busiest/.test(l)) {
    const it = [...V].sort((a, b) => b.activity - a.activity).slice(0, 6);
    return {
      label: 'Most active volcanoes',
      items: it,
      summary: `${it.slice(0, 3).map(e => e.name).join(', ')} lead a combined ranking of seismicity, gas and thermal output over the past 7 days.`,
      ev: 'calculated'
    };
  }
  if (/ring of fire|pacific/.test(l)) {
    const it = E.filter(e => e.tags.includes('ring'));
    return {
      label: 'Pacific Ring of Fire',
      items: it,
      summary: `${it.length} notable systems along the Pacific margin this week.`,
      ev: 'observed'
    };
  }
  if (/erupt/.test(l)) {
    const it = E.filter(e => /Erupt|fountain|Strombolian|explos/i.test(e.status));
    return {
      label: 'Erupting now',
      items: it,
      summary: `${it.length} volcanoes are erupting or in explosive episodes. Etna is the most intense.`,
      ev: 'observed'
    };
  }
  if (/earthquake|quake/.test(l)) {
    return {
      label: 'Significant earthquakes',
      items: E.filter(e => e.kind === 'earthquake'),
      quakes: true,
      summary: 'Largest this week: M 6.1 off Kamchatka, with twelve aftershocks above M 4.',
      ev: 'observed'
    };
  }
  return {
    label: 'Notable right now',
    items: E.filter(e => e.featured),
    summary: 'Etna is erupting. Kīlauea and Sakurajima are in ongoing episodes, uplift continues on Reykjanes, and an aftershock sequence is underway off Kamchatka.',
    ev: 'observed'
  };
}
function WorldView({
  onOpen,
  onAnswer,
  restore,
  drawerOpen,
  registerAsk,
  onContext,
  dockH = 96
}) {
  const D = window.NOMA_DATA;
  const [size, setSize] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  const [land, setLand] = React.useState(null);
  const [sel, setSel] = React.useState(0);
  const [auto, setAuto] = React.useState(true);
  const [filter, setFilter] = React.useState(null);
  const [zoom, setZoom] = React.useState(null);
  React.useEffect(() => {
    const r = () => setSize({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  React.useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(r => r.json()).then(t => setLand(topojson.feature(t, t.objects.countries)));
  }, []);
  const items = filter ? filter.items : D.events.filter(e => e.featured);
  React.useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setSel(s => (s + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [auto, items]);
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'Escape') clear();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  const L = 16;
  const R = 16;
  const B = dockH + 24;
  const proj = React.useMemo(() => d3.geoNaturalEarth1().fitExtent([[L, 72], [size.w - 24, size.h - 40]], {
    type: 'Sphere'
  }), [size, L]);
  const path = d3.geoPath(proj);
  const grat = React.useMemo(() => d3.geoGraticule10(), []);
  // fit filtered set
  const fit = React.useMemo(() => {
    if (!filter || !filter.items.length) return {
      k: 1,
      tx: 0,
      ty: 0
    };
    const pts = filter.items.map(e => proj([e.lon, e.lat]));
    const xs = pts.map(p => p[0]),
      ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs),
      x1 = Math.max(...xs),
      y0 = Math.min(...ys),
      y1 = Math.max(...ys);
    const aw = size.w - L - R - 20,
      ah = Math.max(120, size.h - 90 - B);
    const k = Math.max(0.5, Math.min(3.2, aw / (x1 - x0 + 120), ah / (y1 - y0 + 120)));
    const cx = L + 10 + aw / 2,
      cy = 90 + ah / 2;
    return {
      k,
      tx: cx - (x0 + x1) / 2 * k,
      ty: cy - (y0 + y1) / 2 * k
    };
  }, [filter, proj, size, L, R, B]);
  const ev = items[Math.min(sel, items.length - 1)];
  const labelled = React.useMemo(() => {
    const s = new Set();
    if (!filter || filter.items.length > 10) return s;
    const k = zoom ? 1 : fit.k;
    const placed = [];
    const order = [...filter.items].sort((a, b) => ev && a.id === ev.id ? -1 : ev && b.id === ev.id ? 1 : b.activity - a.activity);
    for (const e of order) {
      const [x, y] = proj([e.lon, e.lat]);
      const X = x * k,
        Y = y * k;
      if (placed.every(([px, py]) => Math.abs(px - X) > 90 || Math.abs(py - Y) > 16)) {
        placed.push([X, Y]);
        s.add(e.id);
      }
    }
    return s;
  }, [filter, fit, proj, ev, zoom]);
  const go = i => {
    setAuto(false);
    setSel(i);
  };
  const clear = () => {
    setFilter(null);
    setSel(0);
  };
  const open = e => {
    const [x, y] = proj([e.lon, e.lat]);
    const k = 7;
    setAuto(false);
    setZoom(`translate(${size.w / 2 - x * k}px,${size.h / 2 - y * k}px) scale(${k})`);
    setTimeout(() => onOpen(e), 750);
  };
  const ask = q => {
    setAuto(false);
    setSel(0);
    const f = {
      q,
      ...parseWorld(q, D.events)
    };
    setFilter(f);
    onAnswer && onAnswer({
      q,
      view: 'world',
      state: {
        q
      },
      ctx: 'Earth · Now',
      answer: {
        title: f.title || f.label,
        body: f.summary,
        ev: f.ev,
        ...(WORLD_EXTRA[f.label] || {})
      }
    });
  };
  React.useEffect(() => {
    if (!restore || restore.view !== 'world') return;
    if (restore.state && restore.state.q) setFilter({
      q: restore.state.q,
      ...parseWorld(restore.state.q, D.events)
    });else setFilter(null);
    setSel(0);
  }, [restore && restore.nonce]);
  React.useEffect(() => {
    onContext && onContext(['Earth', 'Now', ...(filter ? [filter.label] : [])]);
  }, [filter]);
  React.useEffect(() => {
    registerAsk && registerAsk({
      ask,
      insets: {
        left: L,
        right: 16
      },
      placeholder: 'Ask about the planet…',
      suggestions: ['Show me the most active volcanoes right now', 'Show me all volcanoes along the Mid-Atlantic Ridge', 'Which volcanoes are erupting?', 'Largest earthquakes this week', 'Show the Pacific Ring of Fire']
    });
  });
  const gT = zoom || `translate(${fit.tx}px,${fit.ty}px) scale(${fit.k})`;
  const inv = 1 / (zoom ? 1 : fit.k);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--map-page)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size.w,
    height: size.h,
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("g", {
    style: {
      transform: gT,
      transformOrigin: '0 0',
      transition: 'transform 800ms var(--ease-out), opacity 800ms',
      opacity: zoom ? 0.2 : 1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: path({
      type: 'Sphere'
    }),
    fill: "var(--map-ground)",
    stroke: "var(--map-line)",
    onClick: clear
  }), /*#__PURE__*/React.createElement("path", {
    d: path(grat),
    fill: "none",
    stroke: "var(--map-grat)",
    style: {
      pointerEvents: 'none'
    }
  }), land && /*#__PURE__*/React.createElement("path", {
    d: path(land),
    fill: "var(--map-ground-2)",
    stroke: "var(--map-land-stroke)",
    strokeWidth: 0.6 * inv,
    onClick: clear
  }), filter && filter.ridge && /*#__PURE__*/React.createElement("path", {
    d: path({
      type: 'LineString',
      coordinates: D.ridge
    }),
    fill: "none",
    stroke: "rgba(var(--overlay-rgb),0.45)",
    strokeWidth: 1.5 * inv,
    strokeDasharray: `${5 * inv} ${4 * inv}`,
    style: {
      pointerEvents: 'none'
    }
  }), D.quakes.map(([lon, lat, m], i) => {
    const [x, y] = proj([lon, lat]);
    return /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: x,
      cy: y,
      r: m * 0.9 * inv,
      fill: filter && filter.quakes ? 'rgba(var(--overlay-rgb),0.5)' : 'rgba(var(--overlay-rgb),0.2)',
      style: {
        pointerEvents: 'none'
      }
    });
  }), D.events.map(e => {
    const [x, y] = proj([e.lon, e.lat]);
    const on = ev && e.id === ev.id;
    const inSet = items.includes(e);
    const c = toneColor[e.tone];
    const op = filter ? inSet ? 1 : 0.12 : e.featured ? 1 : 0.45;
    return /*#__PURE__*/React.createElement("g", {
      key: e.id,
      style: {
        cursor: 'pointer',
        opacity: op,
        transition: 'opacity 300ms',
        transform: `translate(${x}px,${y}px) scale(${inv})`,
        transformOrigin: '0 0'
      },
      onClick: () => open(e),
      onMouseEnter: () => {
        const i = items.indexOf(e);
        if (i >= 0) go(i);
      }
    }, /*#__PURE__*/React.createElement("circle", {
      r: "14",
      fill: "transparent"
    }), on && /*#__PURE__*/React.createElement("circle", {
      r: "6",
      fill: "none",
      stroke: c,
      strokeWidth: "1.5",
      className: "nm-pulse"
    }), e.kind === 'volcano' ? /*#__PURE__*/React.createElement("path", {
      d: e.featured || inSet ? 'M0,-6 L6,4 L-6,4 Z' : 'M0,-4 L4,3 L-4,3 Z',
      fill: c,
      stroke: "var(--map-page)",
      strokeWidth: "1"
    }) : /*#__PURE__*/React.createElement("circle", {
      r: "4.5",
      fill: c,
      stroke: "var(--map-page)"
    }), !on && labelled.has(e.id) && /*#__PURE__*/React.createElement("text", {
      x: "10",
      y: "4",
      fill: on ? 'var(--map-ink)' : 'var(--map-ink-2)',
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        letterSpacing: '0.06em',
        pointerEvents: 'none'
      }
    }, e.name.toUpperCase()));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      opacity: zoom ? 0 : 1,
      transition: 'opacity 400ms'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    style: {
      ...glassPill,
      position: 'absolute',
      top: 16,
      left: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 16px',
      pointerEvents: 'auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 17,
      letterSpacing: '-0.02em'
    }
  }, "noma"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "Earth"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)'
    }
  }, "Now \xB7 06:41 UTC"), /*#__PURE__*/React.createElement(ThemeToggle, null)), filter && /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    style: {
      ...glassPill,
      position: 'absolute',
      top: 16,
      left: `calc(${L}px + (100% - ${L + 16}px) / 2)`,
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 6px 6px 16px',
      pointerEvents: 'auto',
      maxWidth: `calc(100% - ${L + 32}px)`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)'
    }
  }, "Filter"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, filter.label), /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-muted)'
    }
  }, filter.items.length), /*#__PURE__*/React.createElement("button", {
    onClick: clear,
    "aria-label": "Clear filter",
    title: "Clear filter (Esc)",
    style: {
      width: 26,
      height: 26,
      borderRadius: '50%',
      border: 'none',
      background: 'var(--glass-hover)',
      color: 'var(--text-body)',
      cursor: 'pointer',
      fontSize: 14,
      lineHeight: 1
    }
  }, "\xD7")), ev && !zoom && /*#__PURE__*/React.createElement(Spotlight, {
    onAsk: ask,
    ev: ev,
    n: items.length,
    sel: Math.min(sel, items.length - 1),
    auto: auto,
    setAuto: setAuto,
    go: go,
    open: open,
    x: proj([ev.lon, ev.lat])[0] * fit.k + fit.tx,
    y: proj([ev.lon, ev.lat])[1] * fit.k + fit.ty,
    W: size.w,
    H: size.h,
    B: B,
    pts: items.filter(e => e !== ev).map(e => {
      const p = proj([e.lon, e.lat]);
      return [p[0] * fit.k + fit.tx, p[1] * fit.k + fit.ty];
    })
  })));
}
function Spotlight({
  ev,
  n,
  sel,
  auto,
  setAuto,
  go,
  open,
  onAsk,
  x,
  y,
  W,
  H,
  B,
  pts = []
}) {
  const CW = 290,
    LBL = 110,
    G = 22;
  const room = H - B - 16 - 72;
  const showImg = ev.img && room >= 276,
    showStream = room >= 212;
  const CH = (showImg ? 64 : 0) + (showStream ? 150 : 104) + 62;
  // score candidate rects by how many other markers (+ their right-hand labels) they cover; pick the least-covering, nearest one
  const minTop = 72,
    maxTop = Math.max(minTop, H - B - CH - 16);
  const clampT = t => Math.max(minTop, Math.min(maxTop, t)),
    clampL = l => Math.max(16, Math.min(W - 16 - CW, l));
  const cands = [];
  for (const L0 of [x + G, x - G - CW, x - CW / 2]) for (const T0 of [y - 44, y - CH - G, y + G, minTop, maxTop]) cands.push([clampL(L0), clampT(T0)]);
  const hits = (l, t) => pts.filter(([px, py]) => px + LBL > l - 6 && px - 8 < l + CW + 6 && py + 8 > t - 6 && py - 8 < t + CH + 6).length;
  const selfHit = (l, t) => x + 8 > l && x - 8 < l + CW && y + 8 > t && y - 8 < t + CH;
  let best = null;
  for (const [l, t] of cands) {
    if (selfHit(l, t)) continue;
    const s = hits(l, t) * 10000 + Math.hypot(l + CW / 2 - x, t + CH / 2 - y);
    if (!best || s < best[2]) best = [l, t, s];
  }
  const left = best ? best[0] : clampL(x + G),
    top = best ? best[1] : clampT(y - 44);
  const ex = Math.max(left, Math.min(left + CW, x)),
    ey = Math.max(top, Math.min(top + CH, y));
  const lead = Math.hypot(ex - x, ey - y) > G + 4;
  const pg = {
    width: 24,
    height: 24,
    border: 'none',
    borderRadius: '50%',
    background: 'var(--glass-hover)',
    color: 'var(--text-body)',
    cursor: 'pointer',
    fontSize: 13,
    lineHeight: 1,
    padding: 0
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, lead && /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: x,
    y1: y,
    x2: ex,
    y2: ey,
    stroke: "rgba(var(--overlay-rgb),0.45)",
    strokeWidth: "1",
    strokeDasharray: "2 3"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nm-glass nm-glass-surface",
    style: {
      position: 'absolute',
      left,
      top,
      width: CW,
      borderRadius: 'var(--glass-radius)',
      overflow: 'hidden',
      pointerEvents: 'auto',
      transition: 'left 600ms var(--ease-out), top 600ms var(--ease-out)'
    }
  }, showImg && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 64
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    key: ev.id,
    id: 'spot-' + ev.id,
    shape: "rect",
    src: ev.img,
    placeholder: ""
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: toneColor[ev.tone],
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      flex: 1,
      minWidth: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, ev.name), /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle,
      color: 'var(--text-faint)',
      whiteSpace: 'nowrap'
    }
  }, ev.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 4,
      lineHeight: 1.4
    }
  }, ev.headline), showStream && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Spark, {
    key: ev.id,
    base: ev.stream.base,
    amp: ev.stream.amp,
    w: CW - 28,
    h: 22,
    dark: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      ...labelStyle,
      color: 'var(--text-faint)',
      marginTop: 3
    }
  }, /*#__PURE__*/React.createElement("span", null, ev.stream.label, " \xB7 live"), /*#__PURE__*/React.createElement("span", null, ev.stream.unit))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: pg,
    "aria-label": "Previous",
    onClick: () => go((sel - 1 + n) % n)
  }, "\u2039"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      minWidth: 34,
      textAlign: 'center'
    }
  }, sel + 1, " / ", n), /*#__PURE__*/React.createElement("button", {
    style: pg,
    "aria-label": "Next",
    onClick: () => go((sel + 1) % n)
  }, "\u203A"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...pg,
      fontSize: 8
    },
    "aria-label": auto ? 'Pause' : 'Play',
    onClick: () => setAuto(!auto)
  }, auto ? '❚❚' : '▶'), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "dark",
    onClick: () => open(ev)
  }, "Explore \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 8,
      borderTop: '1px solid var(--line-1)',
      paddingTop: 6
    }
  }, [ev.kind === 'volcano' ? `Why is ${ev.name} ${ev.status.toLowerCase()}?` : `What caused the ${ev.name}?`, `Show volcanoes like ${ev.name}`].map(q => /*#__PURE__*/React.createElement("button", {
    key: q,
    onClick: () => onAsk(q),
    style: {
      textAlign: 'left',
      background: 'none',
      border: 'none',
      padding: '4px 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--text-body)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-muted)'
  }, "\u21B3 ", q))))));
}
Object.assign(window, {
  WorldView,
  toneColor
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/noma/WorldView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/noma/data.js
try { (() => {
// Sample data for the prototype — illustrative values, not live observations.
window.NOMA_DATA = {
  events: [{
    id: 'etna',
    featured: true,
    activity: 92,
    tags: ['europe'],
    kind: 'volcano',
    name: 'Etna',
    region: 'Sicily, Italy',
    lat: 37.751,
    lon: 14.994,
    elev: '3357 m',
    status: 'Erupting',
    tone: 'alert',
    headline: 'Strombolian activity at the southeast crater',
    summary: 'Ash emission and lava fountaining since Tuesday. Tremor amplitude is high and rising.',
    stream: {
      label: 'Volcanic tremor',
      unit: 'µm/s',
      base: 4.2,
      amp: 1.6
    },
    img: '../../assets/imagery/terrain-reference.png',
    wind: {
      dir: 280,
      speed: 34,
      label: 'W 34 kt at 5 km'
    },
    weather: {
      temp: '14 °C',
      cloud: 'Scattered',
      vis: '18 km'
    },
    places: [{
      name: 'Catania',
      type: 'city',
      pop: '300k',
      dist: '28 km',
      bear: 'SE',
      x: 84,
      y: 78
    }, {
      name: 'Zafferana Etnea',
      type: 'town',
      pop: '9k',
      dist: '11 km',
      bear: 'E',
      x: 74,
      y: 46
    }, {
      name: 'Nicolosi',
      type: 'town',
      pop: '7k',
      dist: '14 km',
      bear: 'S',
      x: 44,
      y: 82
    }, {
      name: 'Bronte',
      type: 'town',
      pop: '19k',
      dist: '15 km',
      bear: 'W',
      x: 10,
      y: 52
    }, {
      name: 'Catania airport',
      type: 'airport',
      dist: '35 km',
      bear: 'SSE',
      x: 64,
      y: 92
    }],
    forests: [{
      name: 'Etna Park woodland',
      x: 18,
      y: 66,
      w: 30,
      h: 22
    }, {
      name: 'Pineta di Linguaglossa',
      x: 62,
      y: 10,
      w: 26,
      h: 18
    }],
    streams: [{
      k: 'tremor',
      label: 'Volcanic tremor',
      unit: 'µm/s',
      val: '5.8',
      trend: 'rising',
      ev: 'observed',
      base: 4.2,
      amp: 1.6
    }, {
      k: 'so2',
      label: 'SO₂ flux',
      unit: 't/day',
      val: '9 400',
      trend: 'rising',
      ev: 'observed',
      base: 7,
      amp: 2
    }, {
      k: 'def',
      label: 'Summit uplift',
      unit: 'cm / 30 d',
      val: '3.2',
      trend: 'steady',
      ev: 'retrieved',
      base: 3,
      amp: 0.4
    }, {
      k: 'thermal',
      label: 'Thermal anomaly',
      unit: 'MW',
      val: '412',
      trend: 'rising',
      ev: 'retrieved',
      base: 3.5,
      amp: 1.2
    }],
    models: [{
      name: 'Ash dispersion',
      state: 'Running',
      detail: 'Updated 06:30 UTC · next 07:30'
    }, {
      name: 'Lava flow paths',
      state: 'Running',
      detail: 'SE flank, 3 scenarios'
    }, {
      name: 'Eruption forecast',
      state: 'Ready',
      detail: '72 h window'
    }],
    history: [{
      t: 0.08,
      label: 'Paroxysm · Feb 2025',
      major: true
    }, {
      t: 0.3,
      label: 'Seismic swarm · May 2025'
    }, {
      t: 0.52,
      label: 'Lava fountain · Dec 2025',
      major: true
    }, {
      t: 0.74,
      label: 'Swarm · Jun 2026'
    }, {
      t: 0.95,
      label: 'Current episode',
      major: true
    }]
  }, {
    id: 'kilauea',
    featured: true,
    activity: 81,
    tags: ['hotspot'],
    kind: 'volcano',
    name: 'Kīlauea',
    region: 'Hawaiʻi, USA',
    lat: 19.421,
    lon: -155.287,
    elev: '1247 m',
    status: 'Episodic fountaining',
    tone: 'caution',
    headline: 'Episode 31 of summit fountaining',
    summary: 'Fountains in Halemaʻumaʻu reached 300 m overnight. Activity is confined to the summit caldera.',
    stream: {
      label: 'Tilt',
      unit: 'µrad',
      base: 3,
      amp: 1.4
    }
  }, {
    id: 'sakurajima',
    featured: true,
    activity: 77,
    tags: ['ring'],
    kind: 'volcano',
    name: 'Sakurajima',
    region: 'Kagoshima, Japan',
    lat: 31.585,
    lon: 130.657,
    elev: '1117 m',
    status: 'Explosive',
    tone: 'caution',
    headline: 'Four explosions in 24 hours',
    summary: 'Plume heights up to 3.4 km above the crater. Ashfall forecast for Kagoshima city.',
    stream: {
      label: 'Explosion count',
      unit: '/ day',
      base: 2.5,
      amp: 1.5
    }
  }, {
    id: 'reykjanes',
    featured: true,
    activity: 64,
    tags: ['mar'],
    kind: 'volcano',
    name: 'Sundhnúkur',
    region: 'Reykjanes, Iceland',
    lat: 63.88,
    lon: -22.42,
    elev: '—',
    status: 'Magma accumulating',
    tone: 'caution',
    headline: 'Uplift continues beneath Svartsengi',
    summary: 'Magma volume approaching levels that preceded previous fissure eruptions.',
    stream: {
      label: 'Uplift',
      unit: 'mm/day',
      base: 3,
      amp: 0.5
    }
  }, {
    id: 'kamchatka',
    featured: true,
    activity: 70,
    tags: ['ring'],
    kind: 'earthquake',
    name: 'M 6.1 earthquake',
    region: 'Off Kamchatka, Russia',
    lat: 52.9,
    lon: 160.1,
    elev: 'Depth 38 km',
    status: '2 h ago',
    tone: 'neutral',
    headline: 'Aftershock sequence underway',
    summary: 'Twelve aftershocks above M 4. No tsunami threat was issued.',
    stream: {
      label: 'Aftershocks',
      unit: 'M',
      base: 3,
      amp: 1.8
    }
  }, {
    id: 'merapi',
    kind: 'volcano',
    name: 'Merapi',
    region: 'Java, Indonesia',
    lat: -7.54,
    lon: 110.446,
    elev: '2930 m',
    status: 'Lava dome growth',
    tone: 'caution',
    activity: 79,
    tags: ['ring'],
    headline: 'Pyroclastic flows down the southwest flank',
    summary: 'Dome collapse sent flows 1.8 km from the summit. Alert level remains III.',
    stream: {
      label: 'Rockfall events',
      unit: '/ day',
      base: 3,
      amp: 1.2
    }
  }, {
    id: 'stromboli',
    kind: 'volcano',
    name: 'Stromboli',
    region: 'Aeolian Islands, Italy',
    lat: 38.789,
    lon: 15.213,
    elev: '924 m',
    status: 'Persistent explosions',
    tone: 'caution',
    activity: 74,
    tags: ['europe'],
    headline: 'Explosions every 10–15 minutes',
    summary: 'Typical Strombolian activity from the northeast crater area.',
    stream: {
      label: 'Explosion rate',
      unit: '/ h',
      base: 4,
      amp: 1
    }
  }, {
    id: 'fuego',
    kind: 'volcano',
    name: 'Fuego',
    region: 'Guatemala',
    lat: 14.473,
    lon: -90.88,
    elev: '3763 m',
    status: 'Strombolian activity',
    tone: 'caution',
    activity: 71,
    tags: ['ring'],
    headline: 'Ash plumes to 4.8 km',
    summary: 'Frequent explosions with ash drifting west. Avalanches in Ceniza ravine.',
    stream: {
      label: 'Explosion rate',
      unit: '/ h',
      base: 3,
      amp: 1.3
    }
  }, {
    id: 'popocatepetl',
    kind: 'volcano',
    name: 'Popocatépetl',
    region: 'Puebla, Mexico',
    lat: 19.023,
    lon: -98.622,
    elev: '5426 m',
    status: 'Ash emissions',
    tone: 'caution',
    activity: 68,
    tags: ['ring'],
    headline: 'Low-intensity ash exhalations',
    summary: 'Continuous degassing with occasional ash. Traffic light yellow phase 2.',
    stream: {
      label: 'Exhalations',
      unit: '/ day',
      base: 3,
      amp: 1
    }
  }, {
    id: 'hekla',
    kind: 'volcano',
    name: 'Hekla',
    region: 'Iceland',
    lat: 63.98,
    lon: -19.70,
    elev: '1491 m',
    status: 'Inflating',
    tone: 'quiet',
    activity: 22,
    tags: ['mar'],
    headline: 'Slow inflation continues',
    summary: 'The volcano is above its pre-2000 eruption inflation level. No unrest signals.',
    stream: {
      label: 'Uplift',
      unit: 'mm/yr',
      base: 2,
      amp: 0.3
    }
  }, {
    id: 'grimsvotn',
    kind: 'volcano',
    name: 'Grímsvötn',
    region: 'Vatnajökull, Iceland',
    lat: 64.42,
    lon: -17.33,
    elev: '1725 m',
    status: 'Monitoring',
    tone: 'quiet',
    activity: 30,
    tags: ['mar'],
    headline: 'Subglacial lake level rising',
    summary: 'Geothermal melting beneath the ice cap. A jökulhlaup is possible within months.',
    stream: {
      label: 'Lake level',
      unit: 'm',
      base: 3,
      amp: 0.4
    }
  }, {
    id: 'beerenberg',
    kind: 'volcano',
    name: 'Beerenberg',
    region: 'Jan Mayen, Norway',
    lat: 71.08,
    lon: -8.16,
    elev: '2277 m',
    status: 'Dormant',
    tone: 'quiet',
    activity: 5,
    tags: ['mar'],
    headline: 'Last erupted in 1985',
    summary: 'The northernmost active subaerial volcano on Earth.',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 1,
      amp: 0.4
    }
  }, {
    id: 'setecidades',
    kind: 'volcano',
    name: 'Sete Cidades',
    region: 'São Miguel, Azores',
    lat: 37.87,
    lon: -25.78,
    elev: '856 m',
    status: 'Monitoring',
    tone: 'quiet',
    activity: 12,
    tags: ['mar'],
    headline: 'Background seismicity',
    summary: 'A caldera volcano near the triple junction of the Mid-Atlantic Ridge.',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 1.5,
      amp: 0.5
    }
  }, {
    id: 'faial',
    kind: 'volcano',
    name: 'Faial',
    region: 'Azores, Portugal',
    lat: 38.6,
    lon: -28.73,
    elev: '1043 m',
    status: 'Dormant',
    tone: 'quiet',
    activity: 8,
    tags: ['mar'],
    headline: 'Capelinhos eruption, 1957–58',
    summary: 'A surtseyan eruption extended the island by 2.4 km².',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 1,
      amp: 0.4
    }
  }, {
    id: 'ascension',
    kind: 'volcano',
    name: 'Ascension',
    region: 'South Atlantic',
    lat: -7.95,
    lon: -14.37,
    elev: '859 m',
    status: 'Dormant',
    tone: 'quiet',
    activity: 3,
    tags: ['mar'],
    headline: 'No historical eruptions',
    summary: 'A young volcanic island 90 km west of the ridge axis.',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 0.8,
      amp: 0.3
    }
  }, {
    id: 'tristan',
    kind: 'volcano',
    name: 'Tristan da Cunha',
    region: 'South Atlantic',
    lat: -37.09,
    lon: -12.28,
    elev: '2062 m',
    status: 'Dormant',
    tone: 'quiet',
    activity: 6,
    tags: ['mar'],
    headline: 'Last erupted in 1961',
    summary: 'The eruption forced evacuation of the whole island.',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 0.8,
      amp: 0.3
    }
  }, {
    id: 'bouvet',
    kind: 'volcano',
    name: 'Bouvet',
    region: 'South Atlantic',
    lat: -54.42,
    lon: 3.35,
    elev: '780 m',
    status: 'Dormant',
    tone: 'quiet',
    activity: 2,
    tags: ['mar'],
    headline: 'Ice-covered shield volcano',
    summary: 'One of the most remote islands on Earth, near the southern end of the ridge.',
    stream: {
      label: 'Seismicity',
      unit: '/ wk',
      base: 0.6,
      amp: 0.3
    }
  }],
  ridge: [[-19, -54.5], [-13, -47], [-14, -35], [-12, -25], [-14, -10], [-15, -3], [-26, 1], [-36, 7], [-45, 14], [-46, 23], [-44, 30], [-37, 35], [-29, 39], [-28, 45], [-30, 52], [-33, 57], [-27, 61], [-21, 63.8], [-18, 66.5], [-8, 71.5]],
  quakes: [[-72.5, -33.2, 4.8], [141.9, 38.3, 5.2], [-118.4, 35.6, 3.9], [27.1, 38.4, 4.4], [95.9, 3.3, 5.0], [-97.6, 15.9, 4.6], [121.6, 23.9, 4.1], [-155.3, 19.4, 3.1], [160.1, 52.9, 6.1], [159.4, 53.4, 4.7], [172.8, -43.5, 4.0], [-17.9, 28.6, 3.3]]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/noma/data.js", error: String((e && e.message) || e) }); }

// ui_kits/noma/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/noma/image-slot.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.EvidenceTag = __ds_scope.EvidenceTag;

__ds_ns.QueryBar = __ds_scope.QueryBar;

__ds_ns.ScenarioCard = __ds_scope.ScenarioCard;

__ds_ns.TimeStrip = __ds_scope.TimeStrip;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

})();
