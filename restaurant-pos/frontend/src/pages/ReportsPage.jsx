import { useState } from 'react';
import { reportsAPI } from '../services/api';
import { C, theme } from '../utils/theme';
import { Btn, Card, StatCard, Badge, Spinner } from '../components/common/UI';

const today = () => new Date().toISOString().slice(0, 10);

const REPORT_TYPES = [
  { key: 'bill-wise',     label: 'Bill Wise Sales' },
  { key: 'item-wise',     label: 'Item Wise Sales' },
  { key: 'salesman-wise', label: 'Salesman Wise Sales' },
  { key: 'group-wise',    label: 'Group Wise Sales' },
  { key: 'cashier-wise',  label: 'Cashier Wise Sales' },
  { key: 'time-wise',     label: 'Time Wise Sales' },
  { key: 'tax-report',    label: 'Sales Tax Report' },
];

const COLUMNS = {
  'bill-wise':     [{ key: 'billNo', label: 'Bill No', accent: true }, { key: 'kotNo', label: 'KOT' }, { key: 'table', label: 'Table' }, { key: 'waiter', label: 'Waiter' }, { key: 'paymentMode', label: 'Mode' }, { key: 'netAmount', label: 'Net Amount', right: true, bold: true }],
  'item-wise':     [{ key: 'name', label: 'Product Name', accent: true }, { key: 'qty', label: 'Qty', right: true }, { key: 'rate', label: 'Rate', right: true }, { key: 'amount', label: 'Amount', right: true, bold: true }],
  'salesman-wise': [{ key: 'name', label: 'Salesman', accent: true }, { key: 'bills', label: 'Bills', right: true }, { key: 'amount', label: 'Amount', right: true, bold: true }],
  'group-wise':    [{ key: 'group', label: 'Group', accent: true }, { key: 'qty', label: 'Qty', right: true }, { key: 'amount', label: 'Amount', right: true, bold: true }],
  'cashier-wise':  [{ key: 'cashier', label: 'Cashier', accent: true }, { key: 'bills', label: 'Bills', right: true }, { key: 'amount', label: 'Amount', right: true, bold: true }],
  'time-wise':     [{ key: 'time', label: 'Time Slot', accent: true }, { key: 'bills', label: 'Bills', right: true }, { key: 'amount', label: 'Amount', right: true, bold: true }],
  'tax-report':    [],
};

const APIS = {
  'bill-wise': (p) => reportsAPI.billWise(p),
  'item-wise': (p) => reportsAPI.itemWise(p),
  'salesman-wise': (p) => reportsAPI.salesmanWise(p),
  'group-wise': (p) => reportsAPI.groupWise(p),
  'cashier-wise': (p) => reportsAPI.cashierWise(p),
  'time-wise': (p) => reportsAPI.timeWise(p),
  'tax-report': (p) => reportsAPI.taxReport(p),
};

export default function ReportsPage() {
  const [reportType, setReportType] = useState('bill-wise');
  const [fromDate, setFromDate] = useState(today());
  const [toDate, setToDate] = useState(today());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runReport = async () => {
    setLoading(true); setError(''); setData(null);
    try {
      const res = await APIS[reportType]({ from: fromDate, to: toDate });
      setData(res.data);
    } catch (e) { setError(e.response?.data?.message || 'Failed to load report'); }
    finally { setLoading(false); }
  };

  const total = Array.isArray(data)
    ? data.reduce((s, r) => s + (r.amount || r.netAmount || 0), 0)
    : 0;

  const cols = COLUMNS[reportType] || [];

  const fmtAmount = (v) => typeof v === 'number' ? `₹${v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : v;

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', background: C.bg }}>
      {/* Filter Panel */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '12px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 220px' }}>
            <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 700, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Report Type</label>
            <select value={reportType} onChange={e => { setReportType(e.target.value); setData(null); }}
              style={{ width: '100%', padding: '8px 10px', fontSize: theme.fontSize.sm, border: `1.5px solid ${C.primary}`, borderRadius: theme.radius.md, background: C.primaryBg, color: C.primary, fontWeight: 700, outline: 'none', cursor: 'pointer' }}>
              {REPORT_TYPES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 700, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>From Date</label>
            <input type='date' value={fromDate} onChange={e => setFromDate(e.target.value)}
              style={{ padding: '8px 10px', fontSize: theme.fontSize.sm, border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, outline: 'none', color: C.text }}
              onFocus={e => (e.target.style.borderColor = C.primary)} onBlur={e => (e.target.style.borderColor = C.border)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 700, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>To Date</label>
            <input type='date' value={toDate} onChange={e => setToDate(e.target.value)}
              style={{ padding: '8px 10px', fontSize: theme.fontSize.sm, border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, outline: 'none', color: C.text }}
              onFocus={e => (e.target.style.borderColor = C.primary)} onBlur={e => (e.target.style.borderColor = C.border)} />
          </div>
          <Btn label='View Report' icon='📊' variant='primary' onClick={runReport} disabled={loading} />
          <Btn label='Print' icon='🖨️' variant='ghost' onClick={() => window.print()} disabled={!data} />
        </div>
      </div>

      {/* Results Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {!data && !loading && !error && (
          <div style={{ textAlign: 'center', padding: 60, color: C.textLight }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: theme.fontSize.md, fontWeight: 600 }}>Select a report type and click View Report</div>
          </div>
        )}
        {loading && <Spinner />}
        {error && <div style={{ background: C.dangerBg, border: `1px solid ${C.danger}`, color: C.danger, borderRadius: theme.radius.md, padding: '12px 16px', fontWeight: 700 }}>❌ {error}</div>}

        {/* Tax Report Special */}
        {data && reportType === 'tax-report' && !Array.isArray(data) && (
          <div>
            <div style={{ fontSize: theme.fontSize.lg, fontWeight: 700, color: C.text, marginBottom: 16 }}>Sales Tax Report — {fromDate} to {toDate}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, maxWidth: 700 }}>
              <StatCard label='Total Bills' value={data.bills || 0} icon='🧾' color={C.primary} bg={C.primaryBg} />
              <StatCard label='Sub Total' value={`₹${(data.subtotal || 0).toFixed(2)}`} icon='💰' color={C.text} bg={C.surfaceAlt} />
              <StatCard label='CGST' value={`₹${(data.cgst || 0).toFixed(2)}`} icon='📋' color={C.warning} bg={C.warningBg} />
              <StatCard label='SGST' value={`₹${(data.sgst || 0).toFixed(2)}`} icon='📋' color={C.warning} bg={C.warningBg} />
              <StatCard label='Net Amount' value={`₹${(data.net || 0).toFixed(2)}`} icon='✅' color={C.success} bg={C.successBg} />
            </div>
          </div>
        )}

        {/* Tabular Report */}
        {data && Array.isArray(data) && (
          <Card noPad>
            {/* Report Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${C.border}`, background: C.surfaceAlt }}>
              <div>
                <span style={{ fontSize: theme.fontSize.md, fontWeight: 700, color: C.text }}>{REPORT_TYPES.find(r => r.key === reportType)?.label}</span>
                <span style={{ fontSize: theme.fontSize.xs, color: C.textMuted, marginLeft: 12 }}>{fromDate} — {toDate}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ fontSize: theme.fontSize.xs, color: C.textMuted }}>Records: <strong>{data.length}</strong></div>
                <div style={{ padding: '4px 12px', background: C.successBg, border: `1px solid ${C.success}`, borderRadius: theme.radius.full, fontSize: theme.fontSize.sm, fontWeight: 800, color: C.success }}>
                  Total: {fmtAmount(total)}
                </div>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: theme.fontSize.sm }}>
                <thead>
                  <tr style={{ background: C.surfaceAlt, borderBottom: `2px solid ${C.border}` }}>
                    <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: theme.fontSize.xs, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>#</th>
                    {cols.map(col => (
                      <th key={col.key} style={{ padding: '9px 12px', textAlign: col.right ? 'right' : 'left', fontSize: theme.fontSize.xs, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.surface : C.surfaceAlt }}>
                      <td style={{ padding: '8px 12px', color: C.textLight, fontSize: 11 }}>{i + 1}</td>
                      {cols.map(col => (
                        <td key={col.key} style={{ padding: '8px 12px', textAlign: col.right ? 'right' : 'left', color: col.accent ? C.primary : col.bold ? C.success : C.text, fontWeight: col.bold ? 700 : 400 }}>
                          {(col.key === 'amount' || col.key === 'netAmount') && typeof row[col.key] === 'number' ? fmtAmount(row[col.key]) : row[col.key] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: C.primaryBg, borderTop: `2px solid ${C.primary}` }}>
                    <td colSpan={cols.length} style={{ padding: '10px 12px', textAlign: 'right', fontSize: theme.fontSize.md, fontWeight: 800, color: C.primary }}>
                      Grand Total: {fmtAmount(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {!data.length && <div style={{ textAlign: 'center', padding: 32, color: C.textLight }}>No data for selected period</div>}
          </Card>
        )}
      </div>
    </div>
  );
}
