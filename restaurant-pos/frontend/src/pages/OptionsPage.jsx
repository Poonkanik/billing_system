import { useState } from 'react';
import { C, theme } from '../utils/theme';
import { Input, Select, Checkbox, Card } from '../components/common/UI';

const TABS = ['1. Common', '2. Common', '3. Common', '4. Printing', '5. Sales Printer', '6. Printer Setup'];

export default function OptionsPage() {
  const [tab, setTab] = useState('1. Common');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <div style={{ display: 'flex', background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '0 16px', overflowX: 'auto', gap: 2 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '11px 14px', border: 'none', cursor: 'pointer', fontSize: theme.fontSize.xs, fontWeight: 700,
            background: 'transparent', whiteSpace: 'nowrap', color: tab === t ? C.primary : C.textMuted,
            borderBottom: tab === t ? `2.5px solid ${C.primary}` : '2.5px solid transparent', transition: 'all 0.15s',
          }}>{t}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {tab === '1. Common' && <Common1 />}
        {tab === '2. Common' && <Common2 />}
        {tab === '3. Common' && <Common3 />}
        {tab === '4. Printing' && <Printing />}
        {tab === '5. Sales Printer' && <SalesPrinterSetup />}
        {tab === '6. Printer Setup' && <PrinterSetup />}
      </div>
    </div>
  );
}

function MultiSelect({ items, selected, onToggle, title }) {
  return (
    <Card title={title}>
      <div style={{ maxHeight: 280, overflowY: 'auto', border: `1px solid ${C.border}`, borderRadius: theme.radius.md }}>
        {items.map(item => (
          <div key={item} onClick={() => onToggle(item)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', cursor: 'pointer',
            borderBottom: `1px solid ${C.border}`, background: selected.includes(item) ? C.primaryBg : 'transparent',
            transition: 'background 0.1s',
          }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${selected.includes(item) ? C.primary : C.border}`, background: selected.includes(item) ? C.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', flexShrink: 0 }}>
              {selected.includes(item) ? '✓' : ''}
            </div>
            <span style={{ fontSize: theme.fontSize.xs, color: selected.includes(item) ? C.primary : C.text }}>{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Common1() {
  const billOpts = ['Show Customer', 'Show DeliverDate', 'Show Delivertime', 'Show Advance', 'Show SnoColumn', 'Show CharCodeColumn', 'Show StockColumn', 'Show RateColumn', 'Show PcsColumn', 'Show ProductDiscountColumn', 'Show TaxAmount', 'Show VatAmount', 'Show DiscountAmount', 'Show RoundOffAmount', 'Allow Entry Cancel'];
  const cashTypes = ['Cash', 'Card', 'CREDIT', 'GooglePay', 'Paytm', 'Phonepe', 'Upi', 'AmazonPay', 'Complementary', 'Customer', 'Freecharge', 'Wallet'];
  const [selBill, setSelBill] = useState(['Show RateColumn']);
  const [selCash, setSelCash] = useState(['Cash', 'Card', 'GooglePay', 'Upi']);
  const toggle = (arr, setArr, v) => setArr(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 800 }}>
      <MultiSelect title='Cash / Payment Types' items={cashTypes} selected={selCash} onToggle={v => toggle(selCash, setSelCash, v)} />
      <MultiSelect title='Billing Screen Display Options' items={billOpts} selected={selBill} onToggle={v => toggle(selBill, setSelBill, v)} />
    </div>
  );
}

function Common2() {
  const [s, setS] = useState({ gridFont: '10', productWidth: '200', modeType: 'TABLE WISE', frameHeight: '300', salesmanAmount: '100', salesmanPercentage: '2', kotNo: 'START DAILY ONE', billNo: 'START DAILY ONE', billType: 'NORMAL' });
  const set = (k, v) => setS(p => ({ ...p, [k]: v }));

  const roundOff = [{ from: 1, to: 49, paisa: 0 }, { from: 50, to: 99, paisa: 100 }];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, maxWidth: 900 }}>
      <Card title='Grid & Display'>
        <Input label='Grid Font Size' value={s.gridFont} onChange={v => set('gridFont', v)} />
        <Input label='Product Width' value={s.productWidth} onChange={v => set('productWidth', v)} />
        <Input label='Frame Height' value={s.frameHeight} onChange={v => set('frameHeight', v)} />
        <Select label='Mode Type' value={s.modeType} onChange={v => set('modeType', v)} options={['TABLE WISE', 'COUNTER', 'PARCEL']} />
        <Input label='Salesman Amount' value={s.salesmanAmount} onChange={v => set('salesmanAmount', v)} />
        <Input label='Salesman %' value={s.salesmanPercentage} onChange={v => set('salesmanPercentage', v)} />
      </Card>
      <Card title='Bill Numbering'>
        <Select label='KOT Number' value={s.kotNo} onChange={v => set('kotNo', v)} options={['START DAILY ONE', 'CONTINUE', 'MANUAL']} />
        <Select label='Bill Number' value={s.billNo} onChange={v => set('billNo', v)} options={['START DAILY ONE', 'CONTINUE', 'MANUAL']} />
        <Select label='Bill Type' value={s.billType} onChange={v => set('billType', v)} options={['NORMAL', 'ABC ModeWise', 'CashierWise', 'UserWise']} />
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: theme.fontSize.xs, fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Round Off Rules</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: theme.fontSize.xs }}>
            <thead><tr style={{ background: C.surfaceAlt }}>
              {['From', 'To', 'Paisa'].map(h => <th key={h} style={{ padding: '5px 8px', textAlign: 'center', color: C.textMuted, fontWeight: 700 }}>{h}</th>)}
            </tr></thead>
            <tbody>{roundOff.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? C.surface : C.surfaceAlt, borderBottom: `1px solid ${C.border}` }}>
                {[r.from, r.to, r.paisa].map((v, j) => <td key={j} style={{ padding: '5px 8px', textAlign: 'center', color: C.text }}>{v}</td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      <Card title='Commission'>
        {['Salesman_Amount_Wise', 'Salesman_Mode_Wise', 'Salesman_Item_Wise', 'Salesman_Wise', 'Captain_Amount_Wise', 'Captain_Mode_Wise', 'Captain_Item_Wise'].map(c => (
          <div key={c} style={{ padding: '5px 8px', fontSize: theme.fontSize.xs, color: C.text, borderBottom: `1px solid ${C.border}` }}>{c}</div>
        ))}
      </Card>
    </div>
  );
}

function Common3() {
  const [s, setS] = useState({ gateway: '', apiKey: '', templateId: '', senderName: '' });
  return (
    <Card title='SMS Settings' style={{ maxWidth: 480 }}>
      <Input label='SMS Gateway URL' value={s.gateway} onChange={v => setS(p => ({ ...p, gateway: v }))} />
      <Input label='API Key' value={s.apiKey} onChange={v => setS(p => ({ ...p, apiKey: v }))} />
      <Input label='Template ID' value={s.templateId} onChange={v => setS(p => ({ ...p, templateId: v }))} />
      <Input label='Sender Name' value={s.senderName} onChange={v => setS(p => ({ ...p, senderName: v }))} />
      <Checkbox label='Send Bill SMS to Customer' checked={false} onChange={() => {}} />
      <Checkbox label='Send KOT SMS to Kitchen' checked={false} onChange={() => {}} />
    </Card>
  );
}

function Printing() {
  const TEMPLATES = ['CITIZEN_WINDOWS_NAME_RATE_QTY_AMOUNT', 'CITIZEN_SNO_NAME_QTY_KOT', 'CITIZEN_ORDER_NAME_RATE_QTY', 'EPSON_STANDARD_80MM'];
  const PRINTERS = ['CITIZEN', 'EPSON', 'STAR', 'Generic Network'];
  const [s, setS] = useState({ salesDosPrinter: 'CITIZEN', salesDosSetting: TEMPLATES[0], salesWinPrinter: 'CITIZEN', salesWinSetting: TEMPLATES[0], kotDosPrinter: 'CITIZEN', kotDosSetting: TEMPLATES[1], kotWinPrinter: 'CITIZEN', kotWinSetting: TEMPLATES[1] });
  const [flags, setFlags] = useState({ logoPrinting: false, cashBarcode: false, cashDrawer: true, printProductDiscount: false, printTaxBelow: false });

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['DOS Test Print', 'Windows Test Print', 'Sales Last DOS Print', 'Sales Last Windows Print', 'KOT Last DOS Print', 'KOT Last Windows Print'].map(b => (
          <button key={b} style={{ padding: '7px 14px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: theme.radius.md, fontSize: theme.fontSize.xs, fontWeight: 600, cursor: 'pointer', color: C.text }}>{b}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title='Sales Printer Settings'>
          <Select label='Sales DOS Printer' value={s.salesDosPrinter} onChange={v => setS(p => ({ ...p, salesDosPrinter: v }))} options={PRINTERS} />
          <Select label='Sales DOS Template' value={s.salesDosSetting} onChange={v => setS(p => ({ ...p, salesDosSetting: v }))} options={TEMPLATES} />
          <Select label='Sales Windows Printer' value={s.salesWinPrinter} onChange={v => setS(p => ({ ...p, salesWinPrinter: v }))} options={PRINTERS} />
          <Select label='Sales Windows Template' value={s.salesWinSetting} onChange={v => setS(p => ({ ...p, salesWinSetting: v }))} options={TEMPLATES} />
        </Card>
        <Card title='KOT Printer Settings'>
          <Select label='KOT DOS Printer' value={s.kotDosPrinter} onChange={v => setS(p => ({ ...p, kotDosPrinter: v }))} options={PRINTERS} />
          <Select label='KOT DOS Template' value={s.kotDosSetting} onChange={v => setS(p => ({ ...p, kotDosSetting: v }))} options={TEMPLATES} />
          <Select label='KOT Windows Printer' value={s.kotWinPrinter} onChange={v => setS(p => ({ ...p, kotWinPrinter: v }))} options={PRINTERS} />
          <Select label='KOT Windows Template' value={s.kotWinSetting} onChange={v => setS(p => ({ ...p, kotWinSetting: v }))} options={TEMPLATES} />
        </Card>
        <Card title='Print Flags'>
          {Object.entries(flags).map(([k, v]) => <Checkbox key={k} label={k.replace(/([A-Z])/g, ' $1').trim()} checked={v} onChange={nv => setFlags(p => ({ ...p, [k]: nv }))} />)}
        </Card>
        <Card title='Logo / Images'>
          {['Header Image Path', 'Footer Image Path'].map(l => (
            <div key={l} style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: theme.fontSize.xs, fontWeight: 700, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>{l}</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input style={{ flex: 1, padding: '7px 10px', border: `1.5px solid ${C.border}`, borderRadius: theme.radius.md, fontSize: theme.fontSize.sm, outline: 'none', color: C.text }} />
                <button style={{ padding: '7px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: theme.radius.md, cursor: 'pointer', fontSize: 13 }}>📂</button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function SalesPrinterSetup() {
  const FIELDS = [
    { name: 'UnderLine', size: 'BOLD-8', align: 'LEFT', length: 39 },
    { name: 'CompanyName', size: 'BOLD-10', align: 'CENTER', length: 30 },
    { name: 'Address1', size: 'BOLD-10', align: 'CENTER', length: 39 },
    { name: 'BillNo', text: 'Bill No :', size: 'BOLD-10', align: 'LEFT', length: 15 },
    { name: 'Date', text: 'Date :', size: 'BOLD-8', align: 'LEFT', length: 22 },
    { name: 'Time', text: 'Time :', size: 'BOLD-8', align: 'RIGHT', length: 16 },
    { name: 'SalesMan', text: 'Waiter :', size: 'BOLD-8', align: 'LEFT', length: 22 },
    { name: 'Table', text: 'Table :', size: 'BOLD-8', align: 'LEFT', length: 16 },
    { name: 'ItemName', size: 'BOLD-8', align: 'LEFT', length: 20 },
    { name: 'Rate', size: 'BOLD-8', align: 'RIGHT', length: 8 },
    { name: 'Qty', size: 'BOLD-8', align: 'RIGHT', length: 6 },
    { name: 'Amount', size: 'BOLD-8', align: 'RIGHT', length: 10 },
  ];
  const [sel, setSel] = useState(FIELDS[0]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 900 }}>
      <Card title='Bill Template Fields' noPad>
        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, background: C.surfaceAlt, fontFamily: 'monospace', fontSize: 11 }}>
          CITIZEN_WINDOWS_NAME_RATE_QTY_AMOUNT_NSS_HOTEL
          <div style={{ marginTop: 6, color: C.textMuted }}>
            {'─'.repeat(38)}<br />
            {'Name'.padEnd(20)}{'Rate'.padStart(8)}{'Qty'.padStart(5)}{'Amt'.padStart(10)}<br />
            {'─'.repeat(38)}
          </div>
        </div>
        <div style={{ overflowY: 'auto', maxHeight: 360 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead><tr style={{ background: C.surfaceAlt }}>
              {['Name', 'Text', 'Size', 'Align', 'Len'].map(h => <th key={h} style={{ padding: '5px 8px', color: C.textMuted, fontWeight: 700, fontSize: 10, textAlign: 'left' }}>{h}</th>)}
            </tr></thead>
            <tbody>{FIELDS.map((f, i) => (
              <tr key={f.name} onClick={() => setSel(f)} style={{ borderBottom: `1px solid ${C.border}`, cursor: 'pointer', background: sel.name === f.name ? C.primaryBg : i % 2 === 0 ? C.surface : C.surfaceAlt }}>
                <td style={{ padding: '5px 8px', color: sel.name === f.name ? C.primary : C.text, fontWeight: 600 }}>{f.name}</td>
                <td style={{ padding: '5px 8px', color: C.textMuted }}>{f.text || ''}</td>
                <td style={{ padding: '5px 8px', color: C.primary }}>{f.size}</td>
                <td style={{ padding: '5px 8px', color: C.text }}>{f.align}</td>
                <td style={{ padding: '5px 8px', color: C.text }}>{f.length}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      <Card title={`Edit Field: ${sel.name}`}>
        <Input label='Label Text' value={sel.text || ''} onChange={() => {}} />
        <Select label='Size' value={sel.size} onChange={() => {}} options={['BOLD-7', 'BOLD-8', 'BOLD-9', 'BOLD-10', 'BOLD-12']} />
        <Select label='Align' value={sel.align} onChange={() => {}} options={['LEFT', 'CENTER', 'RIGHT']} />
        <Input label='Column Length' type='number' value={sel.length} onChange={() => {}} />
        <Checkbox label='Next Line' checked={false} onChange={() => {}} />
        <Checkbox label='Discontinue' checked={false} onChange={() => {}} />
        <Checkbox label='Print' checked={true} onChange={() => {}} />
      </Card>
    </div>
  );
}

function PrinterSetup() {
  function Block({ title }) {
    const [s, setS] = useState({ type: 'DOS', dos: 'AnyDesk Printer', win: 'AnyDesk Printer', count: '0', gap: '0', autoCutter: false, askPrint: false });
    const P = ['AnyDesk Printer', 'CITIZEN', 'EPSON', 'STAR'];
    return (
      <Card title={title}>
        <Select label='Printer Type' value={s.type} onChange={v => setS(p => ({ ...p, type: v }))} options={['DOS', 'Windows', 'Network']} />
        <Select label='DOS Printer Name' value={s.dos} onChange={v => setS(p => ({ ...p, dos: v }))} options={P} />
        <Select label='Windows Printer Name' value={s.win} onChange={v => setS(p => ({ ...p, win: v }))} options={P} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Input label='No. of Prints' type='number' value={s.count} onChange={v => setS(p => ({ ...p, count: v }))} />
          <Input label='Gap Lines' type='number' value={s.gap} onChange={v => setS(p => ({ ...p, gap: v }))} />
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Checkbox label='Auto Cutter' checked={s.autoCutter} onChange={v => setS(p => ({ ...p, autoCutter: v }))} />
          <Checkbox label='Ask Print' checked={s.askPrint} onChange={v => setS(p => ({ ...p, askPrint: v }))} />
        </div>
      </Card>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 800 }}>
      <Block title='Sales Printer' />
      <Block title='KOT Printer' />
    </div>
  );
}
