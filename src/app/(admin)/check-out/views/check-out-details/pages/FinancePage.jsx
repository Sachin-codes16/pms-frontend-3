import { fmtDate, val } from '@/utils/checkInFormat';

const pageText = '#526b89';
const bodyText  = '#303746';

const cardStyle  = { border: '1px solid #cfd7df', borderRadius: 8, overflow: 'hidden' };
const titleStyle = { background: '#fbfcfd', color: pageText, fontSize: 16, fontWeight: 700, margin: 0, padding: '20px 30px' };

const cellStyle = { color: pageText, fontSize: 15, padding: '14px 14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const headStyle = { color: pageText, fontSize: 15, fontWeight: 700, padding: '16px 14px', textAlign: 'left', whiteSpace: 'nowrap' };

const STAT_ICONS_BG  = ['#eee7ff','#e9f8ef','#fff0e8','#e8fbfb'];
const STAT_COLORS    = ['#6747ff','#47c878','#ff8d3c','#36c8cf'];
const DONUT_COLORS   = ['#5cc481','#5c45df','#f49345','#edf049'];

const fmt = (v) => (v === null || v === undefined || v === '') ? '—' : v;

const StatCard = ({ label, value, color, bg }) => (
  <div style={{
    alignItems: 'center', background: '#fff', borderRadius: 5,
    boxShadow: '0 8px 18px rgba(15,23,42,0.08)', display: 'flex',
    justifyContent: 'space-between', minHeight: 98, padding: '20px',
  }}>
    <div>
      <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>{label}</p>
      <strong style={{ color: bodyText, fontSize: 26 }}>{value}</strong>
    </div>
    <span style={{ background: bg, borderRadius: 5, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 56, width: 56, fontSize: 22, fontWeight: 700 }}>
      OMR
    </span>
  </div>
);

const FinancePage = ({ record }) => {
  const fd      = record?.financeDetails ?? {};
  const cards   = fd.summaryCards ?? {};
  const charges = fd.chargesAndDeductions ?? [];
  const settle  = fd.settlementSummary ?? {};
  const overview = fd.financeOverview ?? {};
  const payments = fd.payments ?? fd.paymentTransactions ?? [];
  const notes   = record?.remarksNotes ?? '';

  const statCards = [
    { label: 'Total Charges',       value: cards.totalCharges      != null ? `OMR ${cards.totalCharges}` : '—' },
    { label: 'Total Payments',      value: cards.totalPayments     != null ? `OMR ${cards.totalPayments}` : '—' },
    { label: 'Pending Settlements', value: cards.pendingSettlements != null ? `OMR ${cards.pendingSettlements}` : '—' },
    { label: 'Refund Amount',       value: cards.refundAmount      != null ? `OMR ${cards.refundAmount}` : '—' },
  ];

  // Compute donut from charges
  const total = charges.reduce((s, c) => s + (parseFloat(c.total ?? c.amount ?? 0)), 0);
  const gradient = total > 0
    ? (() => {
        let cursor = 0;
        return 'conic-gradient(' + charges.slice(0, 4).map((c, i) => {
          const pct = Math.round((parseFloat(c.total ?? c.amount ?? 0) / total) * 100);
          const seg = `${DONUT_COLORS[i]} ${cursor}% ${cursor + pct}%`;
          cursor += pct;
          return seg;
        }).join(', ') + ')';
      })()
    : 'conic-gradient(#d8d8d8 0 100%)';

  const settlementRows = [
    ['Security Deposit', settle.securityDeposit != null ? `${settle.securityDeposit} OMR` : '—'],
    ['Total Deductions', settle.totalDeductions != null ? `${settle.totalDeductions} OMR` : '—'],
    ['Total Paid',       settle.totalPaid       != null ? `${settle.totalPaid} OMR` : '—'],
  ];
  const settlementHighlighted = [
    ['Refund Amount',    settle.refundAmount    != null ? `${settle.refundAmount} OMR` : '—', true],
    ['Settlement Status', val(settle.settlementStatus), false],
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Stat cards */}
      <div style={{ background: '#edf2f8', borderRadius: 8, marginBottom: 24, padding: '26px 25px' }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))' }}>
          {statCards.map((s, i) => (
            <StatCard key={s.label} label={s.label} value={s.value} color={STAT_COLORS[i]} bg={STAT_ICONS_BG[i]} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(650px, 1.7fr) minmax(430px, 1fr)' }}>

        {/* Left column */}
        <div>
          {/* Charges & Deductions table */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Charges &amp; Deductions</h5>
              <input placeholder="Search" style={{
                border: 0, borderRadius: 4, boxShadow: '0 8px 18px rgba(15,23,42,0.06)',
                color: pageText, height: 39, marginRight: 14, outline: 0, padding: '0 15px', width: 280,
              }} />
            </div>
            <div style={{ padding: '18px 16px 16px' }}>
              <div style={{ border: '1px solid #eef1f4', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%' }}>
                  <colgroup>
                    <col style={{ width: '5%' }} /><col style={{ width: '18%' }} /><col style={{ width: '22%' }} />
                    <col style={{ width: '12%' }} /><col style={{ width: '9%' }} /><col style={{ width: '11%' }} />
                    <col style={{ width: '11%' }} /><col style={{ width: '9%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#fbfcfd' }}>
                      {['#','Charge Type','Description','Amount','Tax','Total','Status','Actions'].map((h) => (
                        <th key={h} style={headStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {charges.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ ...cellStyle, textAlign: 'center', padding: '24px' }}>
                          No charges recorded.
                        </td>
                      </tr>
                    ) : charges.map((row, idx) => (
                      <tr key={row.id ?? idx}>
                        <td style={cellStyle}>{idx + 1}</td>
                        <td style={cellStyle}>{val(row.chargeType ?? row.charge_type)}</td>
                        <td style={cellStyle}>{val(row.description)}</td>
                        <td style={cellStyle}>{row.amount != null ? `${row.amount} OMR` : '—'}</td>
                        <td style={cellStyle}>{row.tax != null ? `${row.tax} OMR` : '—'}</td>
                        <td style={cellStyle}>{row.total != null ? `${row.total} OMR` : '—'}</td>
                        <td style={cellStyle}>{val(row.status)}</td>
                        <td style={{ padding: '9px 12px' }}>
                          <button type="button" style={{ background: 'transparent', border: 0, color: pageText, padding: 0, textDecoration: 'underline', fontSize: 14 }}>
                            view
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payments & Transactions table */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Payments &amp; Transactions</h5>
            <div style={{ padding: '18px 16px 14px' }}>
              <div style={{ border: '1px solid #eef1f4', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%' }}>
                  <colgroup>
                    <col style={{ width: '5%' }} /><col style={{ width: '15%' }} /><col style={{ width: '16%' }} />
                    <col style={{ width: '14%' }} /><col style={{ width: '15%' }} /><col style={{ width: '12%' }} />
                    <col style={{ width: '11%' }} /><col style={{ width: '12%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#fbfcfd' }}>
                      {['#','Payment Date','Payment Method','Transaction ID','Paid By','Amount','Status','Invoice'].map((h) => (
                        <th key={h} style={headStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ ...cellStyle, textAlign: 'center', padding: '24px' }}>
                          No payment transactions recorded.
                        </td>
                      </tr>
                    ) : payments.map((row, idx) => (
                      <tr key={row.id ?? idx}>
                        <td style={cellStyle}>{idx + 1}</td>
                        <td style={cellStyle}>{fmtDate(row.paymentDate)}</td>
                        <td style={cellStyle}>{val(row.paymentMethod)}</td>
                        <td style={cellStyle}>{val(row.transactionId)}</td>
                        <td style={cellStyle}>{val(row.paidBy)}</td>
                        <td style={cellStyle}>{row.amount != null ? `${row.amount} OMR` : '—'}</td>
                        <td style={cellStyle}>{val(row.status)}</td>
                        <td style={{ padding: '9px 12px' }}>
                          <button type="button" style={{ background: 'transparent', border: 0, color: pageText, padding: 0, textDecoration: 'underline', fontSize: 14 }}>
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Deduction Breakdown donut */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Deduction Breakdown</h5>
            <div className="d-flex align-items-center justify-content-center gap-5" style={{ padding: '26px 34px 38px' }}>
              <div style={{ background: gradient, borderRadius: '50%', flex: '0 0 auto', height: 198, position: 'relative', width: 198 }}>
                <span style={{ background: '#fff', borderRadius: '50%', height: 114, left: 42, position: 'absolute', top: 42, width: 114 }} />
              </div>
              <div style={{ minWidth: 240 }}>
                {charges.length === 0 ? (
                  <p style={{ color: pageText, fontSize: 15 }}>No deduction data.</p>
                ) : charges.slice(0, 4).map((c, i) => {
                  const label = val(c.chargeType ?? c.charge_type);
                  const pct   = total > 0 ? `${Math.round((parseFloat(c.total ?? c.amount ?? 0) / total) * 100)}%` : '0%';
                  return (
                    <div key={label} className="d-flex align-items-center justify-content-between gap-4 mb-4">
                      <span className="d-inline-flex align-items-center gap-3" style={{ color: '#7c8ca1', fontSize: 16, fontWeight: 700 }}>
                        <span style={{ background: DONUT_COLORS[i], borderRadius: '50%', display: 'inline-block', height: 15, width: 15 }} />
                        {label}
                      </span>
                      <span style={{ color: bodyText, fontSize: 16 }}>{pct}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Settlement Summary */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Settlement Summary</h5>
            <div style={{ padding: '26px 24px 18px' }}>
              <div style={{ borderBottom: '1px solid #e6e8eb', margin: '0 0 16px', padding: '0 38px 12px' }}>
                {settlementRows.map(([label, value]) => (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '210px 20px 1fr', minHeight: 35 }}>
                    <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                    <span style={{ color: pageText, fontSize: 16 }}>:</span>
                    <span style={{ color: pageText, fontSize: 16 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '0 38px' }}>
                {settlementHighlighted.map(([label, value, highlight]) => (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '210px 20px 1fr', minHeight: 35 }}>
                    <span style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>{label}</span>
                    <span style={{ color: pageText, fontSize: 16 }}>:</span>
                    <span style={{ color: highlight ? '#02a64f' : pageText, fontSize: 16, fontWeight: highlight ? 700 : 400 }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes / Comments */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Notes / Comments</h5>
            <div style={{ padding: '22px 12px 10px' }}>
              <div style={{ background: '#fff6f6', border: '1px solid #f1d8d8', borderRadius: 8, color: pageText, padding: '14px 16px' }}>
                <h6 style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Notes</h6>
                <div style={{ background: '#fff', borderRadius: 8, color: '#666', fontSize: 15, padding: '22px 20px' }}>
                  {notes || 'No notes added.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
