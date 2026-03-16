import { useState, useEffect, useRef } from 'react';
import { masterAPI, billsAPI } from '../services/api';
import { C, theme } from '../utils/theme';
import { Btn } from '../components/common/UI';

const PAYMENT_MODES = ['Cash', 'Card', 'GooglePay', 'Paytm', 'UPI', 'Credit'];

function calcBill(items, discount = 0, reduction = 0) {
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const gross = subtotal + cgst + sgst - discount - reduction;
  const roundOff = Math.round(gross) - gross;
  const net = Math.round(gross + roundOff);
  return { subtotal, cgst, sgst, discount, reduction, roundOff, net };
}

export default function BillingPage() {
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [tables, setTables] = useState([]);
  const [runningBills, setRunningBills] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Active bill state
  const [activeBillIdx, setActiveBillIdx] = useState(0);
  const [bills, setBills] = useState([
    { id: 1, label: 'Bill 1', table: '', waiter: '', items: [], discount: 0, reduction: 0, paymentMode: 'Cash', savedId: null },
    { id: 2, label: 'Bill 2', table: '', waiter: '', items: [], discount: 0, reduction: 0, paymentMode: 'Cash', savedId: null },
    { id: 3, label: 'Bill 3', table: '', waiter: '', items: [], discount: 0, reduction: 0, paymentMode: 'Cash', savedId: null },
  ]);
  const [showDiscount, setShowDiscount] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const codeRef = useRef(null);

  const bill = bills[activeBillIdx];
  const totals = calcBill(bill.items, bill.discount, bill.reduction);

  const toast = (msg, ms = 2500) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), ms); };

  useEffect(() => {
    Promise.all([masterAPI.getProducts(), masterAPI.getGroups(), masterAPI.getTables()])
      .then(([p, g, t]) => {
        setProducts(p.data);
        setGroups([{ name: 'ALL' }, ...g.data]);
        setTables(t.data);
      });
    loadRunningBills();
  }, []);

  const loadRunningBills = async () => {
    try {
      const res = await billsAPI.getAll({ status: 'kot_saved' });
      setRunningBills(res.data);
    } catch {}
  };

  const updateBill = (field, value) => {
    setBills(prev => prev.map((b, i) => i === activeBillIdx ? { ...b, [field]: value } : b));
  };

  const addItem = (product) => {
    setBills(prev => prev.map((b, i) => {
      if (i !== activeBillIdx) return b;
      const exists = b.items.findIndex(it => it.productCode === product.code);
      let items;
      if (exists >= 0) {
        items = b.items.map((it, idx) => idx === exists ? { ...it, qty: it.qty + 1, amount: (it.qty + 1) * it.rate } : it);
      } else {
        items = [...b.items, { productCode: product.code, productName: product.name, rate: product.rate, qty: 1, amount: product.rate, group: product.groupName }];
      }
      return { ...b, items };
    }));
  };

  const updateQty = (code, delta) => {
    setBills(prev => prev.map((b, i) => {
      if (i !== activeBillIdx) return b;
      const items = b.items.map(it => {
        if (it.productCode !== code) return it;
        const newQty = it.qty + delta;
        return newQty <= 0 ? null : { ...it, qty: newQty, amount: newQty * it.rate };
      }).filter(Boolean);
      return { ...b, items };
    }));
  };

  const handleCodeEnter = (e) => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      const prod = products.find(p => p.code === val || p.name.toLowerCase() === val.toLowerCase());
      if (prod) { addItem(prod); e.target.value = ''; }
      else toast(`Product "${val}" not found`);
    }
  };

  const handleKOTSave = async () => {
    if (!bill.items.length) return toast('Add items first');
    setLoading(true);
    try {
      const data = { ...totals, table: bill.table, waiter: bill.waiter, items: bill.items, paymentMode: bill.paymentMode, status: 'kot_saved' };
      if (bill.savedId) {
        await billsAPI.update(bill.savedId, data);
        toast('✅ KOT Updated');
      } else {
        const res = await billsAPI.create(data);
        updateBill('savedId', res.data._id);
        toast('✅ KOT Saved — ' + res.data.kotNo);
      }
      loadRunningBills();
    } catch (err) { toast('❌ ' + (err.response?.data?.message || 'Error')); }
    finally { setLoading(false); }
  };

  const handleFinalBill = async () => {
    if (!bill.items.length) return toast('Add items first');
    setLoading(true);
    try {
      const data = { ...totals, table: bill.table, waiter: bill.waiter, items: bill.items, paymentMode: bill.paymentMode, status: 'billed' };
      if (bill.savedId) await billsAPI.update(bill.savedId, data);
      else await billsAPI.create(data);
      toast('✅ Bill Saved');
      // Clear active bill
      setBills(prev => prev.map((b, i) => i === activeBillIdx ? { ...b, items: [], table: '', waiter: '', discount: 0, reduction: 0, savedId: null } : b));
      loadRunningBills();
    } catch (err) { toast('❌ ' + (err.response?.data?.message || 'Error')); }
    finally { setLoading(false); }
  };

  const filteredProducts = products.filter(p => {
    const matchGroup = selectedGroup === 'ALL' || p.groupName === selectedGroup;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.includes(search);
    return matchGroup && matchSearch;
  });

  return (
    <div style={{ display: 'flex', height: '100%', background: C.bg, overflow: 'hidden', position: 'relative' }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', background: C.text, color: '#fff', padding: '9px 20px', borderRadius: theme.radius.full, fontSize: theme.fontSize.sm, fontWeight: 700, zIndex: 999, boxShadow: theme.shadow.lg, pointerEvents: 'none' }}>
          {toastMsg}
        </div>
      )}

      {/* LEFT: Bill Panel */}
      <div style={{ width: '52%', display: 'flex', flexDirection: 'column', borderRight: `1px solid ${C.border}`, background: C.surface }}>
        {/* Bill Tabs */}
        <div style={{ display: 'flex', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}` }}>
          {bills.map((b, i) => (
            <button key={b.id} onClick={() => setActiveBillIdx(i)} style={{
              flex: 1, padding: '9px 4px', border: 'none', cursor: 'pointer', fontSize: theme.fontSize.xs, fontWeight: 700,
              background: activeBillIdx === i ? C.primary : 'transparent',
              color: activeBillIdx === i ? '#fff' : C.textMuted,
              borderBottom: activeBillIdx === i ? `2px solid ${C.primaryDark}` : '2px solid transparent',
              transition: 'all 0.15s',
            }}>
              {b.label}{b.table ? ` · ${b.table}` : ''}<br />
              <span style={{ fontWeight: 400, fontSize: 10 }}>₹{calcBill(b.items, b.discount, b.reduction).net}</span>
            </button>
          ))}
        </div>

        {/* Bill Header Controls */}
        <div style={{ display: 'flex', gap: 8, padding: '8px 10px', borderBottom: `1px solid ${C.border}`, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: theme.fontSize.xs, color: C.textMuted, fontWeight: 600 }}>TABLE</span>
            <select value={bill.table} onChange={e => updateBill('table', e.target.value)}
              style={{ padding: '4px 8px', fontSize: theme.fontSize.sm, border: `1.5px solid ${bill.table ? C.primary : C.border}`, borderRadius: theme.radius.md, background: bill.table ? C.primaryBg : C.surface, color: bill.table ? C.primary : C.text, fontWeight: 700, outline: 'none', cursor: 'pointer' }}>
              <option value=''>-- Table</option>
              {tables.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: theme.fontSize.xs, color: C.textMuted, fontWeight: 600 }}>WAITER</span>
            <input value={bill.waiter} onChange={e => updateBill('waiter', e.target.value.toUpperCase())} placeholder='Waiter name'
              style={{ padding: '4px 8px', fontSize: theme.fontSize.sm, border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, outline: 'none', width: 100, color: C.text }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto' }}>
            <span style={{ fontSize: theme.fontSize.xs, color: C.textMuted, fontWeight: 600 }}>CODE</span>
            <input ref={codeRef} placeholder='Scan/type code + Enter' onKeyDown={handleCodeEnter}
              style={{ padding: '4px 8px', fontSize: theme.fontSize.sm, border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, outline: 'none', width: 160, color: C.text }}
              onFocus={e => (e.target.style.borderColor = C.primary)}
              onBlur={e => (e.target.style.borderColor = C.border)} />
          </div>
        </div>

        {/* Bill Items Table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: theme.fontSize.sm }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr style={{ background: C.surfaceAlt, borderBottom: `2px solid ${C.border}` }}>
                {['#', 'Name', 'Rate', 'Qty', 'Amount', ''].map((h, j) => (
                  <th key={j} style={{ padding: '7px 8px', textAlign: j >= 2 ? 'center' : 'left', fontSize: theme.fontSize.xs, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.surface : C.surfaceAlt }}>
                  <td style={{ padding: '7px 8px', color: C.textLight, fontSize: 11, width: 24 }}>{i + 1}</td>
                  <td style={{ padding: '7px 8px', color: C.text, fontWeight: 600 }}>{item.productName}</td>
                  <td style={{ padding: '7px 8px', color: C.textMuted, textAlign: 'center' }}>₹{item.rate}</td>
                  <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <button onClick={() => updateQty(item.productCode, -1)} style={{ width: 22, height: 22, border: `1px solid ${C.border}`, borderRadius: theme.radius.sm, cursor: 'pointer', background: C.surface, color: C.text, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700, color: C.text }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.productCode, 1)} style={{ width: 22, height: 22, border: `1px solid ${C.primary}`, borderRadius: theme.radius.sm, cursor: 'pointer', background: C.primaryBg, color: C.primary, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                  </td>
                  <td style={{ padding: '7px 8px', textAlign: 'center', fontWeight: 700, color: C.success }}>₹{item.amount.toFixed(2)}</td>
                  <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                    <button onClick={() => updateQty(item.productCode, -item.qty)} style={{ background: 'none', border: 'none', color: C.danger, cursor: 'pointer', fontSize: 15, padding: 2 }}>🗑</button>
                  </td>
                </tr>
              ))}
              {!bill.items.length && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: C.textLight, fontSize: theme.fontSize.sm }}>
                  Add items from the product grid →
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Discount/Reduction Row */}
        {showDiscount && (
          <div style={{ display: 'flex', gap: 8, padding: '8px 10px', borderTop: `1px solid ${C.border}`, background: C.warningBg }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, color: C.warning, fontWeight: 700 }}>DISCOUNT (₹)</label>
              <input type='number' min='0' value={bill.discount} onChange={e => updateBill('discount', parseFloat(e.target.value) || 0)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '5px 8px', border: `1.5px solid ${C.warning}`, borderRadius: theme.radius.md, fontSize: theme.fontSize.sm, outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, color: C.danger, fontWeight: 700 }}>REDUCTION (₹)</label>
              <input type='number' min='0' value={bill.reduction} onChange={e => updateBill('reduction', parseFloat(e.target.value) || 0)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '5px 8px', border: `1.5px solid ${C.danger}`, borderRadius: theme.radius.md, fontSize: theme.fontSize.sm, outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, color: C.textMuted, fontWeight: 700 }}>PAYMENT MODE</label>
              <select value={bill.paymentMode} onChange={e => updateBill('paymentMode', e.target.value)}
                style={{ width: '100%', padding: '5px 8px', border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, fontSize: theme.fontSize.sm, outline: 'none' }}>
                {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Totals + Actions */}
        <div style={{ borderTop: `2px solid ${C.border}`, background: C.surface }}>
          {/* Totals Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', padding: '8px 10px', gap: 4, borderBottom: `1px solid ${C.border}` }}>
            {[
              ['Amount', totals.subtotal.toFixed(2), C.text],
              ['CGST', totals.cgst.toFixed(2), C.textMuted],
              ['SGST', totals.sgst.toFixed(2), C.textMuted],
              ['Discount', totals.discount.toFixed(2), C.warning],
              ['Round Off', totals.roundOff.toFixed(2), C.textLight],
              ['NET AMOUNT', `₹${totals.net}`, C.primary],
            ].map(([l, v, c]) => (
              <div key={l} style={{ textAlign: 'center', background: l === 'NET AMOUNT' ? C.primaryBg : C.surfaceAlt, borderRadius: theme.radius.md, padding: '5px 4px', border: l === 'NET AMOUNT' ? `1.5px solid ${C.primary}` : `1px solid ${C.border}` }}>
                <div style={{ fontSize: 9, color: C.textLight, fontWeight: 600, textTransform: 'uppercase' }}>{l}</div>
                <div style={{ fontSize: l === 'NET AMOUNT' ? 14 : 12, fontWeight: 800, color: c }}>{v}</div>
              </div>
            ))}
          </div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 6, padding: '8px 10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Btn label='F8 - Discount' variant='ghost' size='sm' onClick={() => setShowDiscount(v => !v)} />
            <Btn label='F11 - KOT Save' variant='warning' size='sm' onClick={handleKOTSave} disabled={loading} />
            <Btn label='F5 - Final Bill' variant='success' size='sm' onClick={handleFinalBill} disabled={loading} />
            <Btn label='Clear' variant='outlineDanger' size='sm' onClick={() => { setBills(prev => prev.map((b, i) => i === activeBillIdx ? { ...b, items: [], discount: 0, reduction: 0 } : b)); }} />
          </div>
        </div>
      </div>

      {/* CENTER: Product Grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${C.border}`, background: C.bg, overflow: 'hidden' }}>
        {/* Search + Group Filter */}
        <div style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder='🔍 Search product by name or code...'
            style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', fontSize: theme.fontSize.sm, border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, outline: 'none', marginBottom: 7, color: C.text }}
            onFocus={e => (e.target.style.borderColor = C.primary)}
            onBlur={e => (e.target.style.borderColor = C.border)} />
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {groups.map(g => (
              <button key={g.name} onClick={() => setSelectedGroup(g.name)} style={{
                padding: '4px 10px', borderRadius: theme.radius.full, border: `1.5px solid ${selectedGroup === g.name ? C.primary : C.border}`,
                background: selectedGroup === g.name ? C.primary : C.surface,
                color: selectedGroup === g.name ? '#fff' : C.textMuted,
                cursor: 'pointer', fontSize: theme.fontSize.xs, fontWeight: 700, transition: 'all 0.1s',
              }}>{g.name}</button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 7, alignContent: 'start' }}>
          {filteredProducts.map(p => {
            const inBill = bill.items.find(it => it.productCode === p.code);
            return (
              <button key={p._id} onClick={() => addItem(p)} style={{
                background: inBill ? C.primaryBg : C.surface, border: `1.5px solid ${inBill ? C.primary : C.border}`,
                borderRadius: theme.radius.lg, padding: '10px 8px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.12s', boxShadow: inBill ? `0 0 0 2px ${C.primaryBg}` : theme.shadow.sm,
                borderTop: `3px solid ${p.departmentName?.includes('NON VEG') ? C.danger : C.secondary}`,
              }}
                onMouseOver={e => (e.currentTarget.style.borderColor = C.primary)}
                onMouseOut={e => (e.currentTarget.style.borderColor = inBill ? C.primary : C.border)}>
                <div style={{ fontSize: 10, color: C.textLight, marginBottom: 2 }}>{p.code}</div>
                <div style={{ fontSize: theme.fontSize.xs, color: C.text, fontWeight: 700, lineHeight: 1.3, marginBottom: 5, minHeight: 28 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: C.primary, fontWeight: 800 }}>₹{p.rate}</span>
                  {inBill && <span style={{ fontSize: 10, background: C.primary, color: '#fff', borderRadius: theme.radius.full, padding: '1px 6px', fontWeight: 700 }}>×{inBill.qty}</span>}
                </div>
              </button>
            );
          })}
          {!filteredProducts.length && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 32, color: C.textLight }}>No products found</div>}
        </div>
      </div>

      {/* RIGHT: Running Bills */}
      <div style={{ width: 200, display: 'flex', flexDirection: 'column', background: C.surface }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, fontSize: theme.fontSize.xs, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
          Running Bills ({runningBills.length})
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 6 }}>
          {runningBills.map(rb => (
            <div key={rb._id} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: theme.radius.lg, padding: '10px 10px', marginBottom: 6, borderLeft: `3px solid ${C.primary}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: theme.fontSize.sm, fontWeight: 700, color: C.primary }}>{rb.table || 'No Table'}</span>
                <span style={{ fontSize: 10, color: C.textLight }}>{rb.kotNo}</span>
              </div>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>{rb.waiter || 'No waiter'} · {rb.items?.length || 0} items</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.success }}>₹{rb.netAmount}</div>
            </div>
          ))}
          {!runningBills.length && <div style={{ textAlign: 'center', padding: 20, color: C.textLight, fontSize: theme.fontSize.xs }}>No running bills</div>}
        </div>

        {/* Bill Summary */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '8px 10px', background: C.surfaceAlt }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>Current Bill Summary</div>
          {[
            ['Items', bill.items.length],
            ['Qty', bill.items.reduce((s, i) => s + i.qty, 0)],
            ['Subtotal', `₹${totals.subtotal.toFixed(2)}`],
            ['Tax', `₹${(totals.cgst + totals.sgst).toFixed(2)}`],
            ['Net', `₹${totals.net}`],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: theme.fontSize.xs, marginBottom: 3, color: l === 'Net' ? C.primary : C.text, fontWeight: l === 'Net' ? 800 : 400 }}>
              <span style={{ color: C.textMuted }}>{l}</span><span>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
