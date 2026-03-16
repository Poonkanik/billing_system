import { useState, useEffect, useCallback } from 'react';
import { masterAPI } from '../services/api';
import { C, theme } from '../utils/theme';
import { Input, Select, Checkbox, Card } from '../components/common/UI';
import MasterList from '../components/master/MasterList';

const TABS = ['Company', 'Groups', 'Departments', 'Products', 'Tables', 'Customers'];

export default function MasterPage() {
  const [tab, setTab] = useState('Company');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      {/* Tab Bar */}
      <div style={{ display: 'flex', background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '0 16px', gap: 2 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '11px 16px', border: 'none', cursor: 'pointer', fontSize: theme.fontSize.sm, fontWeight: 700,
            background: 'transparent', color: tab === t ? C.primary : C.textMuted,
            borderBottom: tab === t ? `2.5px solid ${C.primary}` : '2.5px solid transparent',
            transition: 'all 0.15s',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'Company' && <CompanyTab />}
        {tab === 'Groups' && <GroupsTab />}
        {tab === 'Departments' && <DepartmentsTab />}
        {tab === 'Products' && <ProductsTab />}
        {tab === 'Tables' && <TablesTab />}
        {tab === 'Customers' && <CustomersTab />}
      </div>
    </div>
  );
}

// ─────────────────────── COMPANY ───────────────────────────
function CompanyTab() {
  const [form, setForm] = useState({ name: '', address1: '', address2: '', address3: '', address4: '', address5: '', phone: '', mobile: '', email: '', web: '', langName: '', langAddr1: '', langAddr2: '', langAddr3: '', langAddr4: '', langAddr5: '', gstNo: '' });
  const [toast, setToast] = useState('');
  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    masterAPI.getCompany().then(res => { if (res.data?._id) setForm(res.data); }).catch(() => {});
  }, []);

  const save = async () => {
    try { await masterAPI.updateCompany(form); notify('✅ Company saved'); }
    catch (e) { notify('❌ ' + (e.response?.data?.message || 'Error')); }
  };

  return (
    <div style={{ padding: 20, overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {toast && <div style={{ background: C.successBg, border: `1px solid ${C.success}`, color: C.success, borderRadius: theme.radius.md, padding: '8px 12px', marginBottom: 12, fontWeight: 700, fontSize: theme.fontSize.sm }}>{toast}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 900 }}>
        <Card title='Basic Information'>
          <Input label='Company Name' value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} required />
          <Input label='Address 1' value={form.address1} onChange={v => setForm(p => ({ ...p, address1: v }))} />
          <Input label='Address 2' value={form.address2} onChange={v => setForm(p => ({ ...p, address2: v }))} />
          <Input label='Address 3' value={form.address3} onChange={v => setForm(p => ({ ...p, address3: v }))} />
          <Input label='Address 4' value={form.address4} onChange={v => setForm(p => ({ ...p, address4: v }))} />
          <Input label='GST Number' value={form.gstNo} onChange={v => setForm(p => ({ ...p, gstNo: v }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Input label='Phone' value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
            <Input label='Mobile' value={form.mobile} onChange={v => setForm(p => ({ ...p, mobile: v }))} />
            <Input label='Email' value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
            <Input label='Website' value={form.web} onChange={v => setForm(p => ({ ...p, web: v }))} />
          </div>
        </Card>
        <div>
          <Card title='Language / Display Name' style={{ marginBottom: 16 }}>
            <Input label='Display Name' value={form.langName} onChange={v => setForm(p => ({ ...p, langName: v }))} />
            <Input label='Address 1' value={form.langAddr1} onChange={v => setForm(p => ({ ...p, langAddr1: v }))} />
            <Input label='Address 2' value={form.langAddr2} onChange={v => setForm(p => ({ ...p, langAddr2: v }))} />
            <Input label='Address 3' value={form.langAddr3} onChange={v => setForm(p => ({ ...p, langAddr3: v }))} />
            <Input label='Address 4' value={form.langAddr4} onChange={v => setForm(p => ({ ...p, langAddr4: v }))} />
          </Card>
          {/* Preview */}
          <Card title='Bill Header Preview'>
            <div style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'monospace', background: C.surfaceAlt, borderRadius: theme.radius.md }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{form.langName || form.name || 'Company Name'}</div>
              {form.langAddr1 && <div style={{ fontSize: 12, color: C.textMuted }}>{form.langAddr1}</div>}
              {form.langAddr2 && <div style={{ fontSize: 12, color: C.textMuted }}>{form.langAddr2}</div>}
              {form.langAddr3 && <div style={{ fontSize: 12, color: C.textMuted }}>{form.langAddr3}</div>}
              {form.gstNo && <div style={{ fontSize: 11, color: C.textMuted }}>GST: {form.gstNo}</div>}
            </div>
          </Card>
        </div>
      </div>
      <div style={{ marginTop: 16, maxWidth: 900 }}>
        <button onClick={save} style={{ padding: '9px 24px', background: C.primary, color: '#fff', border: 'none', borderRadius: theme.radius.md, fontSize: theme.fontSize.sm, fontWeight: 700, cursor: 'pointer' }}>
          💾 Save Company Info
        </button>
      </div>
    </div>
  );
}

// ─────────────────────── GROUPS ───────────────────────────
const emptyGroup = { name: '', languageName: '', hotKey: false, allowDiscount: false };

function GroupsTab() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyGroup);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await masterAPI.getGroups(); setItems(r.data); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const select = (item) => { setSelected(item); setForm(item); };
  const newItem = () => { setSelected(null); setForm(emptyGroup); };

  const save = async () => {
    try {
      if (selected?._id) { const r = await masterAPI.updateGroup(selected._id, form); setSelected(r.data); notify('✅ Updated'); }
      else { const r = await masterAPI.createGroup(form); setSelected(r.data); notify('✅ Created'); }
      load();
    } catch (e) { notify('❌ ' + (e.response?.data?.message || 'Error')); }
  };

  const del = async () => {
    if (!selected?._id || !window.confirm('Delete this group?')) return;
    try { await masterAPI.deleteGroup(selected._id); setSelected(null); setForm(emptyGroup); load(); notify('Deleted'); }
    catch (e) { notify('❌ Error'); }
  };

  return (
    <MasterList items={items} selected={selected} onSelect={select} onNew={newItem} onSave={save} onDelete={del} loading={loading} title='Groups'>
      {toast && <div style={{ background: C.successBg, border: `1px solid ${C.success}`, color: C.success, borderRadius: theme.radius.md, padding: '7px 12px', marginBottom: 12, fontWeight: 700, fontSize: theme.fontSize.sm }}>{toast}</div>}
      <Card title={selected?._id ? `Edit: ${selected.name}` : 'New Group'}>
        <Input label='Group Name' value={form.name} onChange={v => setForm(p => ({ ...p, name: v.toUpperCase() }))} required />
        <Input label='Language Name' value={form.languageName} onChange={v => setForm(p => ({ ...p, languageName: v }))} />
        <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
          <Checkbox label='Hot Key' checked={form.hotKey} onChange={v => setForm(p => ({ ...p, hotKey: v }))} />
          <Checkbox label='Allow Discount' checked={form.allowDiscount} onChange={v => setForm(p => ({ ...p, allowDiscount: v }))} />
        </div>
      </Card>
      <PrinterSubForm form={form.printer || {}} onChange={v => setForm(p => ({ ...p, printer: v }))} />
    </MasterList>
  );
}

// ─────────────────────── DEPARTMENTS ───────────────────────────
const emptyDept = { name: '', languageName: '', hotKey: false };

function DepartmentsTab() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyDept);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await masterAPI.getDepartments(); setItems(r.data); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    try {
      if (selected?._id) { await masterAPI.updateDepartment(selected._id, form); notify('✅ Updated'); }
      else { const r = await masterAPI.createDepartment(form); setSelected(r.data); notify('✅ Created'); }
      load();
    } catch (e) { notify('❌ ' + (e.response?.data?.message || 'Error')); }
  };

  const del = async () => {
    if (!selected?._id || !window.confirm('Delete?')) return;
    try { await masterAPI.deleteDepartment(selected._id); setSelected(null); setForm(emptyDept); load(); } catch {}
  };

  return (
    <MasterList items={items} selected={selected} onSelect={i => { setSelected(i); setForm(i); }} onNew={() => { setSelected(null); setForm(emptyDept); }} onSave={save} onDelete={del} loading={loading} title='Departments'>
      {toast && <div style={{ background: C.successBg, border: `1px solid ${C.success}`, color: C.success, borderRadius: theme.radius.md, padding: '7px 12px', marginBottom: 12, fontWeight: 700, fontSize: theme.fontSize.sm }}>{toast}</div>}
      <Card title={selected?._id ? `Edit: ${selected.name}` : 'New Department'}>
        <Input label='Department Name' value={form.name} onChange={v => setForm(p => ({ ...p, name: v.toUpperCase() }))} required />
        <Input label='Language Name' value={form.languageName} onChange={v => setForm(p => ({ ...p, languageName: v }))} />
        <Checkbox label='Hot Key' checked={form.hotKey} onChange={v => setForm(p => ({ ...p, hotKey: v }))} />
      </Card>
      <PrinterSubForm form={form.printer || {}} onChange={v => setForm(p => ({ ...p, printer: v }))} />
    </MasterList>
  );
}

// ─────────────────────── PRODUCTS ───────────────────────────
const emptyProduct = { code: '', name: '', rate: 0, cgst: 0, sgst: 0, cess: 0, groupName: '', departmentName: '', unitName: 'PCS', flags: { active: true, hotKey: true, allowGst: false, maintainStock: false, fastMoving: false, barItem: false } };

function ProductsTab() {
  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [depts, setDepts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, g, d] = await Promise.all([masterAPI.getProducts(), masterAPI.getGroups(), masterAPI.getDepartments()]);
      setItems(p.data); setGroups(g.data); setDepts(d.data);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const setFlag = (k, v) => setForm(p => ({ ...p, flags: { ...p.flags, [k]: v } }));

  const save = async () => {
    try {
      if (selected?._id) { await masterAPI.updateProduct(selected._id, form); notify('✅ Updated'); }
      else { const r = await masterAPI.createProduct(form); setSelected(r.data); notify('✅ Created'); }
      load();
    } catch (e) { notify('❌ ' + (e.response?.data?.message || 'Error')); }
  };

  const del = async () => {
    if (!selected?._id || !window.confirm('Delete?')) return;
    try { await masterAPI.deleteProduct(selected._id); setSelected(null); setForm(emptyProduct); load(); } catch {}
  };

  return (
    <MasterList items={items} selected={selected} onSelect={i => { setSelected(i); setForm(i); }} onNew={() => { setSelected(null); setForm(emptyProduct); }} onSave={save} onDelete={del} loading={loading} title='Products'>
      {toast && <div style={{ background: C.successBg, border: `1px solid ${C.success}`, color: C.success, borderRadius: theme.radius.md, padding: '7px 12px', marginBottom: 12, fontWeight: 700, fontSize: theme.fontSize.sm }}>{toast}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 800 }}>
        <Card title='Product Details'>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Input label='Code' value={form.code} onChange={v => setForm(p => ({ ...p, code: v }))} required />
            <Input label='Unit Name' value={form.unitName} onChange={v => setForm(p => ({ ...p, unitName: v }))} />
          </div>
          <Input label='Product Name' value={form.name} onChange={v => setForm(p => ({ ...p, name: v.toUpperCase() }))} required />
          <Input label='Rate (₹)' type='number' value={form.rate} onChange={v => setForm(p => ({ ...p, rate: parseFloat(v) || 0 }))} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <Input label='CGST %' type='number' value={form.cgst} onChange={v => setForm(p => ({ ...p, cgst: parseFloat(v) || 0 }))} />
            <Input label='SGST %' type='number' value={form.sgst} onChange={v => setForm(p => ({ ...p, sgst: parseFloat(v) || 0 }))} />
            <Input label='CESS %' type='number' value={form.cess} onChange={v => setForm(p => ({ ...p, cess: parseFloat(v) || 0 }))} />
          </div>
          <Select label='Group' value={form.groupName} onChange={v => setForm(p => ({ ...p, groupName: v }))} options={groups.map(g => ({ value: g.name, label: g.name }))} />
          <Select label='Department' value={form.departmentName} onChange={v => setForm(p => ({ ...p, departmentName: v }))} options={depts.map(d => ({ value: d.name, label: d.name }))} />
        </Card>
        <Card title='Flags & Options'>
          {[['active', 'Active'], ['hotKey', 'Hot Key'], ['allowGst', 'Allow GST'], ['maintainStock', 'Maintain Stock'], ['barItem', 'Bar Item'], ['fastMoving', 'Fast Moving']].map(([k, l]) => (
            <Checkbox key={k} label={l} checked={form.flags?.[k] || false} onChange={v => setFlag(k, v)} />
          ))}
          {selected && (
            <div style={{ marginTop: 12, padding: 10, background: C.surfaceAlt, borderRadius: theme.radius.md }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4, fontWeight: 700 }}>PRODUCT PREVIEW</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{form.name}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>₹{form.rate}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{form.groupName} · {form.departmentName}</div>
            </div>
          )}
        </Card>
      </div>
    </MasterList>
  );
}

// ─────────────────────── TABLES ───────────────────────────
const emptyTable = { name: '', capacity: 4 };

function TablesTab() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyTable);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await masterAPI.getTables(); setItems(r.data); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    try {
      if (selected?._id) { await masterAPI.updateTable(selected._id, form); notify('✅ Updated'); }
      else { const r = await masterAPI.createTable(form); setSelected(r.data); notify('✅ Created'); }
      load();
    } catch (e) { notify('❌ Error'); }
  };

  const del = async () => {
    if (!selected?._id || !window.confirm('Delete?')) return;
    try { await masterAPI.deleteTable(selected._id); setSelected(null); setForm(emptyTable); load(); } catch {}
  };

  return (
    <MasterList items={items} selected={selected} onSelect={i => { setSelected(i); setForm(i); }} onNew={() => { setSelected(null); setForm(emptyTable); }} onSave={save} onDelete={del} loading={loading} title='Tables'>
      {toast && <div style={{ background: C.successBg, border: `1px solid ${C.success}`, color: C.success, borderRadius: theme.radius.md, padding: '7px 12px', marginBottom: 12, fontWeight: 700, fontSize: theme.fontSize.sm }}>{toast}</div>}
      <Card title={selected?._id ? `Edit: ${selected.name}` : 'New Table'} style={{ maxWidth: 420 }}>
        <Input label='Table Name' value={form.name} onChange={v => setForm(p => ({ ...p, name: v.toUpperCase() }))} required />
        <Input label='Capacity (Persons)' type='number' value={form.capacity} onChange={v => setForm(p => ({ ...p, capacity: parseInt(v) || 0 }))} />
        <Select label='Status' value={form.status || 'available'} onChange={v => setForm(p => ({ ...p, status: v }))}
          options={['available', 'occupied', 'reserved'].map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
      </Card>
    </MasterList>
  );
}

// ─────────────────────── CUSTOMERS ───────────────────────────
const emptyCustomer = { name: '', phone: '', mobile: '', address: '', email: '' };

function CustomersTab() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyCustomer);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await masterAPI.getCustomers(); setItems(r.data); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    try {
      if (selected?._id) { await masterAPI.updateCustomer(selected._id, form); notify('✅ Updated'); }
      else { const r = await masterAPI.createCustomer(form); setSelected(r.data); notify('✅ Created'); }
      load();
    } catch (e) { notify('❌ Error'); }
  };

  const del = async () => {
    if (!selected?._id || !window.confirm('Delete?')) return;
    try { await masterAPI.deleteCustomer(selected._id); setSelected(null); setForm(emptyCustomer); load(); } catch {}
  };

  return (
    <MasterList items={items} selected={selected} onSelect={i => { setSelected(i); setForm(i); }} onNew={() => { setSelected(null); setForm(emptyCustomer); }} onSave={save} onDelete={del} loading={loading} title='Customers'>
      {toast && <div style={{ background: C.successBg, border: `1px solid ${C.success}`, color: C.success, borderRadius: theme.radius.md, padding: '7px 12px', marginBottom: 12, fontWeight: 700, fontSize: theme.fontSize.sm }}>{toast}</div>}
      <Card title={selected?._id ? `Edit: ${selected.name}` : 'New Customer'} style={{ maxWidth: 480 }}>
        <Input label='Customer Name' value={form.name} onChange={v => setForm(p => ({ ...p, name: v.toUpperCase() }))} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Input label='Phone' value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
          <Input label='Mobile' value={form.mobile} onChange={v => setForm(p => ({ ...p, mobile: v }))} />
        </div>
        <Input label='Email' value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
        <Input label='Address' value={form.address} onChange={v => setForm(p => ({ ...p, address: v }))} />
      </Card>
    </MasterList>
  );
}

// ─────────────────────── Shared Printer Sub Form ───────────────────────────
function PrinterSubForm({ form, onChange }) {
  const set = (k, v) => onChange({ ...form, [k]: v });
  const PRINTERS = ['', 'CITIZEN', 'EPSON', 'STAR', 'Generic'];
  return (
    <Card title='Printer Override (Optional)' style={{ marginTop: 12, maxWidth: 420 }}>
      <Select label='Printer Type' value={form.printerType || ''} onChange={v => set('printerType', v)} options={['DOS', 'Windows', 'Network']} />
      <Select label='DOS Printer Name' value={form.dosPrinterName || ''} onChange={v => set('dosPrinterName', v)} options={PRINTERS.slice(1)} />
      <Select label='Windows Printer Name' value={form.windowsPrinterName || ''} onChange={v => set('windowsPrinterName', v)} options={PRINTERS.slice(1)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Input label='No. of Prints' type='number' value={form.numberOfPrint || 0} onChange={v => set('numberOfPrint', parseInt(v) || 0)} />
        <Input label='Gap Lines' type='number' value={form.gapLine || 0} onChange={v => set('gapLine', parseInt(v) || 0)} />
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        <Checkbox label='Auto Cutter' checked={form.autoCutter || false} onChange={v => set('autoCutter', v)} />
        <Checkbox label='Ask Print' checked={form.askPrint || false} onChange={v => set('askPrint', v)} />
      </div>
    </Card>
  );
}
