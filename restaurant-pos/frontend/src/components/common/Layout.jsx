import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C, theme } from '../../utils/theme';

const NAV_ITEMS = [
  { path: '/billing',    icon: '🧾', label: 'Billing' },
  { path: '/master',     icon: '📋', label: 'Master' },
  { path: '/reports',   icon: '📊', label: 'Reports' },
  { path: '/options',   icon: '⚙️', label: 'Options' },
  { path: '/users',     icon: '👥', label: 'Users' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 60 : 200, flexShrink: 0, background: C.sidebar, display: 'flex', flexDirection: 'column',
        transition: 'width 0.2s ease', overflow: 'hidden', boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '16px 0' : '16px 14px', borderBottom: `1px solid rgba(255,255,255,0.08)`, display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : undefined }}>
          <div style={{ width: 32, height: 32, borderRadius: theme.radius.md, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🍽️</div>
          {!collapsed && <div>
            <div style={{ fontSize: theme.fontSize.sm, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>RestoPOS</div>
            <div style={{ fontSize: theme.fontSize.xs, color: C.sidebarText }}>v1.0</div>
          </div>}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.path} to={item.path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '11px 0' : '11px 14px',
                justifyContent: collapsed ? 'center' : undefined, textDecoration: 'none',
                background: isActive ? C.sidebarActive : 'transparent',
                color: isActive ? '#fff' : C.sidebarText,
                borderLeft: isActive ? `3px solid #64B5F6` : '3px solid transparent',
                transition: 'all 0.15s', borderRadius: '0 6px 6px 0', margin: '1px 0',
                fontSize: theme.fontSize.sm, fontWeight: isActive ? 700 : 500,
              })}
            >
              <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: collapsed ? '12px 0' : '12px 14px', borderTop: `1px solid rgba(255,255,255,0.08)` }}>
          {!collapsed && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: theme.fontSize.xs, color: C.sidebarText, marginBottom: 2 }}>Logged in as</div>
              <div style={{ fontSize: theme.fontSize.sm, fontWeight: 700, color: '#fff' }}>{user?.name}</div>
              <div style={{ fontSize: theme.fontSize.xs, color: '#64B5F6', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          )}
          <button onClick={() => logout(navigate('/'))}
            style={{ width: '100%', padding: collapsed ? '8px 0' : '7px 10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: theme.radius.md, color: C.sidebarText, cursor: 'pointer', fontSize: theme.fontSize.xs, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : undefined, gap: 6 }}>
            <span>🚪</span>{!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <header style={{ height: 48, background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0, boxShadow: theme.shadow.sm }}>
          <button onClick={() => setCollapsed(v => !v)}
            style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: theme.radius.md, width: 30, height: 30, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted }}>
            {collapsed ? '▶' : '◀'}
          </button>
          <div style={{ fontSize: theme.fontSize.md, fontWeight: 800, color: C.primary, letterSpacing: '-0.3px' }}>RAJA SHRI ANBU BHAVAN</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: theme.fontSize.xs, color: C.textMuted }}>📅 {dateStr}</span>
            <span style={{ fontSize: theme.fontSize.xs, color: C.textMuted }}>🕐 {timeStr}</span>
            <span style={{ fontSize: theme.fontSize.xs, color: C.textMuted }}>👤 {user?.name}</span>
            <span style={{ fontSize: theme.fontSize.xs, padding: '3px 8px', background: C.successBg, color: C.success, borderRadius: theme.radius.full, fontWeight: 700 }}>● ONLINE</span>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
