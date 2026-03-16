import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { C, theme } from '../utils/theme';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(name, password);
      navigate('/billing');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ width: 380, background: C.surface, borderRadius: theme.radius.xl, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: C.primary, padding: '28px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🍽️</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>RestoPOS</div>
          <div style={{ fontSize: theme.fontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>Restaurant Point of Sale</div>
        </div>

        {/* Form */}
        <div style={{ padding: '28px 32px' }}>
          <div style={{ fontSize: theme.fontSize.md, fontWeight: 700, color: C.text, marginBottom: 20 }}>Sign in to continue</div>
          {error && (
            <div style={{ background: C.dangerBg, border: `1px solid ${C.danger}`, borderRadius: theme.radius.md, padding: '9px 12px', marginBottom: 14, fontSize: theme.fontSize.sm, color: C.danger, fontWeight: 600 }}>
              ⚠ {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 700, color: C.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</label>
              <input value={name} onChange={e => setName(e.target.value.toUpperCase())} placeholder='ADMIN' required autoFocus
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: theme.fontSize.base, border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, outline: 'none', color: C.text }}
                onFocus={e => (e.target.style.borderColor = C.primary)}
                onBlur={e => (e.target.style.borderColor = C.border)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 700, color: C.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='••••••••' required
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: theme.fontSize.base, border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, outline: 'none', color: C.text }}
                onFocus={e => (e.target.style.borderColor = C.primary)}
                onBlur={e => (e.target.style.borderColor = C.border)} />
            </div>
            <button type='submit' disabled={loading}
              style={{ width: '100%', padding: '11px', background: loading ? C.primaryLight : C.primary, color: '#fff', border: 'none', borderRadius: theme.radius.md, fontSize: theme.fontSize.md, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <div style={{ marginTop: 16, fontSize: theme.fontSize.xs, color: C.textLight, textAlign: 'center' }}>
            Default: ADMIN / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
