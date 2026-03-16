import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../services/api';
import { C, theme } from '../utils/theme';
import { Input, Select, Checkbox, Card, Badge, Btn } from '../components/common/UI';
import MasterList from '../components/master/MasterList';

const MENU_ITEMS = [
  'Title---->File', 'Title----->Master', 'Title----->Sales', 'Title----->Accounts',
  'Title----->Report', 'Title---->Tools', 'Title----->Utilites',
  'File----->User Rights', 'File----->Log Off', 'File----->Exit',
  'Master---->Company Info', 'Master----->Group Info', 'Master----->Department Info',
  'Master----->Branch Info', 'Master----->Customer Info', 'Master----->Supplier Info',
  'Master----->Captain Info', 'Master----->Cashier Info', 'Master----->Salesman Info',
  'Master----->Product Info', 'Master----->Godown Product Info', 'Master----->Table Info',
  'Sales----->Billing', 'Report----->Sales Report', 'Report----->Stock Report',
];

const BILL_OPTIONS = [
  { key: 'allowDuplicateBill', label: 'Allow Duplicate Bill' },
  { key: 'allowLastBill',      label: 'Allow Last Bill Print' },
  { key: 'allowBillCancel',    label: 'Allow Bill Cancel' },
  { key: 'allowEditBill',      label: 'Allow Edit Bill' },
  { key: 'allowBillDiscount',  label: 'Allow Bill Discount' },
  { key: 'allowReduction',     label: 'Allow Reduction' },
];

const emptyUser = { name: '', password: '', role: 'cashier', permissions: {}, menuAccess: [] };

export default function UsersPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyUser);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState('rights');
  const [toast, setToast] = useState('');
  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await usersAPI.getAll(); setItems(r.data); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const select = (item) => { setSelected(item); setForm({ ...item, password: '' }); };
  const newUser = () => { setSelected(null); setForm(emptyUser); };

  const toggleMenu = (item) => {
    setForm(p => {
      const ma = p.menuAccess || [];
      return { ...p, menuAccess: ma.includes(item) ? ma.filter(m => m !== item) : [...ma, item] };
    });
  };

  const togglePerm = (key) => {
    setForm(p => ({ ...p, permissions: { ...(p.permissions || {}), [key]: !(p.permissions?.[key]) } }));
  };

  const save = async () => {
    if (!form.name) return notify('Name is required');
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (selected?._id) { await usersAPI.update(selected._id, payload); notify('✅ Updated'); }
      else {
        if (!form.password) return notify('Password required for new user');
        const r = await usersAPI.create(form);
        setSelected(r.data);
        notify('✅ User Created');
      }
      load();
    } catch (e) { notify('❌ ' + (e.response?.data?.message || 'Error')); }
  };

  const del = async () => {
    if (!selected?._id || !window.confirm(`Delete user ${selected.name}?`)) return;
    try { await usersAPI.delete(selected._id); setSelected(null); setForm(emptyUser); load(); notify('Deleted'); }
    catch { notify('❌ Error'); }
  };

  return (
    <MasterList items={items} selected={selected} onSelect={select} onNew={newUser} onSave={save} onDelete={del} loading={loading} title='Users'>
      {toast && <div style={{ background: C.successBg, border: `1px solid ${C.success}`, color: C.success, borderRadius: theme.radius.md, padding: '7px 12px', marginBottom: 12, fontWeight: 700, fontSize: theme.fontSize.sm }}>{toast}</div>}

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: `1px solid ${C.border}` }}>
        {['rights', 'options'].map(t => (
          <button key={t} onClick={() => setSubTab(t)} style={{
            padding: '8px 16px', border: 'none', cursor: 'pointer', fontSize: theme.fontSize.sm, fontWeight: 700,
            background: 'transparent', textTransform: 'capitalize',
            color: subTab === t ? C.primary : C.textMuted,
            borderBottom: subTab === t ? `2.5px solid ${C.primary}` : '2.5px solid transparent',
          }}>{t === 'rights' ? 'User Rights' : 'Bill Options'}</button>
        ))}
      </div>

      {subTab === 'rights' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 800 }}>
          <Card title='User Details'>
            <Input label='Username' value={form.name} onChange={v => setForm(p => ({ ...p, name: v.toUpperCase() }))} required />
            <Input label={selected?._id ? 'New Password (leave blank to keep)' : 'Password'} type='password' value={form.password || ''} onChange={v => setForm(p => ({ ...p, password: v }))} required={!selected?._id} />
            <Select label='Role' value={form.role} onChange={v => setForm(p => ({ ...p, role: v }))} options={['admin', 'cashier', 'waiter'].map(r => ({ value: r, label: r.charAt(0).toUpperCase() + r.slice(1) }))} />
            {selected && (
              <div style={{ marginTop: 8, padding: '8px 12px', background: C.surfaceAlt, borderRadius: theme.radius.md, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: C.primary }}>
                  {form.name?.[0] || '?'}
                </div>
                <div>
                  <div style={{ fontSize: theme.fontSize.sm, fontWeight: 700, color: C.text }}>{form.name}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                    <Badge label={form.role} color={form.role === 'admin' ? 'danger' : form.role === 'cashier' ? 'primary' : 'success'} />
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card title='Menu Access Permissions'>
            <div style={{ maxHeight: 320, overflowY: 'auto', borderRadius: theme.radius.md, border: `1px solid ${C.border}` }}>
              {MENU_ITEMS.map(item => (
                <div key={item} onClick={() => toggleMenu(item)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', cursor: 'pointer',
                  borderBottom: `1px solid ${C.border}`,
                  background: form.menuAccess?.includes(item) ? C.primaryBg : 'transparent',
                  transition: 'background 0.1s',
                }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${form.menuAccess?.includes(item) ? C.primary : C.border}`, background: form.menuAccess?.includes(item) ? C.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }}>
                    {form.menuAccess?.includes(item) ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: theme.fontSize.xs, color: form.menuAccess?.includes(item) ? C.primary : C.text, fontWeight: form.menuAccess?.includes(item) ? 700 : 400 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
              <Btn label='Select All' variant='outline' size='sm' onClick={() => setForm(p => ({ ...p, menuAccess: [...MENU_ITEMS] }))} />
              <Btn label='Clear All' variant='ghost' size='sm' onClick={() => setForm(p => ({ ...p, menuAccess: [] }))} />
            </div>
          </Card>
        </div>
      )}

      {subTab === 'options' && (
        <Card title='Bill Permissions' style={{ maxWidth: 480 }}>
          <div style={{ fontSize: theme.fontSize.xs, color: C.textMuted, marginBottom: 12 }}>
            Enable the actions this user can perform on bills.
          </div>
          {BILL_OPTIONS.map(opt => (
            <div key={opt.key} onClick={() => togglePerm(opt.key)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px',
              cursor: 'pointer', borderBottom: `1px solid ${C.border}`, borderRadius: theme.radius.md, marginBottom: 4,
              background: form.permissions?.[opt.key] ? C.successBg : C.surfaceAlt,
              border: `1px solid ${form.permissions?.[opt.key] ? C.success : C.border}`,
              transition: 'all 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{form.permissions?.[opt.key] ? '✅' : '⬜'}</span>
                <span style={{ fontSize: theme.fontSize.sm, fontWeight: 600, color: form.permissions?.[opt.key] ? C.success : C.text }}>{opt.label}</span>
              </div>
              <Badge label={form.permissions?.[opt.key] ? 'Allowed' : 'Denied'} color={form.permissions?.[opt.key] ? 'success' : 'muted'} />
            </div>
          ))}
        </Card>
      )}
    </MasterList>
  );
}
