import { C, theme } from '../../utils/theme';

// ── Button ──────────────────────────────────────────────────────────────────
export function Btn({ label, onClick, variant = 'primary', size = 'md', icon, disabled, type = 'button', fullWidth }) {
  const variants = {
    primary:   { bg: C.primary,   color: '#fff', border: C.primary,   hover: C.primaryDark },
    secondary: { bg: C.secondary, color: '#fff', border: C.secondary, hover: '#00695C' },
    danger:    { bg: C.danger,    color: '#fff', border: C.danger,    hover: '#B71C1C' },
    outline:   { bg: 'transparent', color: C.primary,   border: C.primary,   hover: C.primaryBg },
    outlineDanger: { bg: 'transparent', color: C.danger, border: C.danger, hover: C.dangerBg },
    ghost:     { bg: 'transparent', color: C.textMuted, border: C.border, hover: C.surfaceAlt },
    success:   { bg: C.success,   color: '#fff', border: C.success,   hover: '#1B5E20' },
    warning:   { bg: C.warning,   color: '#fff', border: C.warning,   hover: '#BF360C' },
  };
  const v = variants[variant] || variants.primary;
  const sizes = { sm: '5px 10px', md: '7px 14px', lg: '10px 20px' };
  const fontSizes = { sm: theme.fontSize.xs, md: theme.fontSize.sm, lg: theme.fontSize.base };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, justifyContent: 'center',
        padding: sizes[size], fontSize: fontSizes[size], fontWeight: 600, borderRadius: theme.radius.md,
        background: v.bg, color: v.color, border: `1.5px solid ${v.border}`,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1,
        width: fullWidth ? '100%' : undefined, whiteSpace: 'nowrap',
        transition: 'all 0.15s',
      }}
      onMouseOver={e => !disabled && (e.currentTarget.style.background = v.hover)}
      onMouseOut={e => !disabled && (e.currentTarget.style.background = v.bg)}
    >
      {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
      {label}
    </button>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, type = 'text', placeholder, readOnly, required, autoFocus, onKeyDown }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 600, color: C.textMuted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
      <input
        type={type} value={value ?? ''} placeholder={placeholder} readOnly={readOnly} required={required} autoFocus={autoFocus} onKeyDown={onKeyDown}
        onChange={e => onChange && onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '7px 10px',
          fontSize: theme.fontSize.base, color: C.text, background: readOnly ? C.surfaceAlt : C.surface,
          border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => !readOnly && (e.target.style.borderColor = C.primary)}
        onBlur={e => (e.target.style.borderColor = C.border)}
      />
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, value, onChange, options = [], required }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 600, color: C.textMuted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
      <select
        value={value ?? ''} onChange={e => onChange && onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '7px 10px',
          fontSize: theme.fontSize.base, color: C.text, background: C.surface,
          border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, outline: 'none',
          cursor: 'pointer',
        }}
        onFocus={e => (e.target.style.borderColor = C.primary)}
        onBlur={e => (e.target.style.borderColor = C.border)}
      >
        <option value=''>— Select —</option>
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  );
}

// ── Checkbox ─────────────────────────────────────────────────────────────────
export function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: theme.fontSize.sm, color: checked ? C.primary : C.text, marginBottom: 6 }}>
      <input type='checkbox' checked={!!checked} onChange={e => onChange && onChange(e.target.checked)}
        style={{ width: 15, height: 15, accentColor: C.primary, cursor: 'pointer' }} />
      {label}
    </label>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, title, actions, noPad, style: extraStyle }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: theme.radius.lg, boxShadow: theme.shadow.sm, overflow: 'hidden', ...extraStyle }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${C.border}`, background: C.surfaceAlt }}>
          <span style={{ fontSize: theme.fontSize.md, fontWeight: 700, color: C.text }}>{title}</span>
          {actions && <div style={{ display: 'flex', gap: 6 }}>{actions}</div>}
        </div>
      )}
      <div style={noPad ? undefined : { padding: 16 }}>{children}</div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ label, color = 'primary' }) {
  const map = {
    primary: [C.primaryBg, C.primary],
    success: [C.successBg, C.success],
    danger: [C.dangerBg, C.danger],
    warning: [C.warningBg, C.warning],
    muted: [C.surfaceAlt, C.textMuted],
  };
  const [bg, text] = map[color] || map.primary;
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: theme.radius.full, fontSize: theme.fontSize.xs, fontWeight: 700, background: bg, color: text }}>
      {label}
    </span>
  );
}

// ── Table ──────────────────────────────────────────────────────────────────
export function Table({ columns, data, onRowClick, loading, emptyMsg = 'No data found' }) {
  if (loading) return <div style={{ textAlign: 'center', padding: 32, color: C.textLight }}>Loading...</div>;
  if (!data?.length) return <div style={{ textAlign: 'center', padding: 32, color: C.textLight }}>{emptyMsg}</div>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: theme.fontSize.sm }}>
        <thead>
          <tr style={{ background: C.surfaceAlt, borderBottom: `2px solid ${C.border}` }}>
            {columns.map(col => (
              <th key={col.key} style={{ padding: '9px 12px', textAlign: col.right ? 'right' : 'left', fontWeight: 700, color: C.textMuted, fontSize: theme.fontSize.xs, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row._id || i}
              onClick={() => onRowClick && onRowClick(row)}
              style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.surface : C.surfaceAlt, cursor: onRowClick ? 'pointer' : undefined, transition: 'background 0.1s' }}
              onMouseOver={e => onRowClick && (e.currentTarget.style.background = C.primaryBg)}
              onMouseOut={e => (e.currentTarget.style.background = i % 2 === 0 ? C.surface : C.surfaceAlt)}
            >
              {columns.map(col => (
                <td key={col.key} style={{ padding: '8px 12px', textAlign: col.right ? 'right' : 'left', color: col.accent ? C.primary : C.text, fontWeight: col.bold ? 700 : 400 }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, borderRadius: theme.radius.xl, width, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: theme.shadow.lg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: C.surface, zIndex: 1 }}>
          <span style={{ fontSize: theme.fontSize.lg, fontWeight: 700, color: C.text }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: C.textMuted, padding: 4, borderRadius: theme.radius.md }}>✕</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

// ── Section Title ─────────────────────────────────────────────────────────
export function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: theme.fontSize.lg, fontWeight: 700, color: C.text, margin: '0 0 16px', paddingBottom: 10, borderBottom: `2px solid ${C.primaryBg}` }}>
      {children}
    </h2>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color = C.primary, bg = C.primaryBg }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: theme.radius.lg, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: theme.shadow.sm }}>
      <div style={{ width: 44, height: 44, borderRadius: theme.radius.lg, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: theme.fontSize.xs, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: theme.fontSize.xl, fontWeight: 800, color }}>{value}</div>
      </div>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Search Input ──────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: C.textLight, fontSize: 13 }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px 7px 28px', fontSize: theme.fontSize.sm, color: C.text, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, outline: 'none' }}
        onFocus={e => (e.target.style.borderColor = C.primary)}
        onBlur={e => (e.target.style.borderColor = C.border)}
      />
    </div>
  );
}
