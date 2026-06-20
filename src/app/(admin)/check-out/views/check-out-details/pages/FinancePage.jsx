const pageText = '#526b89';
const bodyText = '#303746';

const chargesRows = [
  ['1', 'Outstanding Rent', 'May 2025 (29 Days)', '1250 OMR', '15 OMR', '535 OMR', 'Paid'],
  ['2', 'Utility Charges', 'Electricity, Gas , Water', '524 OMR', '15 OMR', '253 OMR', 'Pending'],
  ['3', 'Repair & Damage', 'Inspection Based Repair', '342 OMR', '15 OMR', '453 OMR', 'Pending'],
  ['4', 'Late Checkout Penalty', 'Overstay charges', '254 OMR', '15 OMR', '857 OMR', 'Pending'],
  ['5', 'Cleaning Charges', 'Deep Cleaning', '245 OMR', '15 OMR', '253 OMR', 'Paid'],
  ['6', 'Repair & Damage', 'Inspection Based Repair', '354 OMR', '15 OMR', '654 OMR', 'Pending'],
  ['7', 'Utility Charges', 'Electricity, Gas , Water', '250 OMR', '15 OMR', '523 OMR', 'Paid'],
  ['8', 'Outstanding Rent', 'May 2025 (29 Days)', '1250 OMR', '15 OMR', '453 OMR', 'Paid'],
];

const deductionItems = [
  ['Utility Charges', '82.00%', '#5cc481'],
  ['Repair & Damage', '42.00%', '#5c45df'],
  ['Cleaning Charges', '12.00%', '#f49345'],
  ['Other', '06.00%', '#edf049'],
];

const settlementRows = [
  ['Security Deposit', '1250 OMR', false],
  ['Total Deductions', '1200 OMR', false],
  ['Total Paid', '2000 OMR', false],
  ['Refund Amount', '300 OMR', true],
  ['Settlement Status', 'Pending', false],
];

const paymentRows = [
  ['1', '29 May 2026', 'Credit Card', 'TXD123456', 'Bilal Ahmed', '535 OMR', 'Success'],
  ['2', '28 May 2026', 'UPI', 'TXD123456', 'Bilal Ahmed', '253 OMR', 'Success'],
  ['3', '27 May 2026', 'Bank Transfer', 'TXD123456', 'Bilal Ahmed', '453 OMR', 'Success'],
  ['4', '26 May 2026', 'UPI', 'TXD123456', 'Bilal Ahmed', '857 OMR', 'Success'],
  ['5', '25 May 2026', 'Credit Card', 'TXD123456', 'Bilal Ahmed', '253 OMR', 'Success'],
];

const cardStyle = {
  border: '1px solid #cfd7df',
  borderRadius: 8,
  overflow: 'hidden',
};

const titleStyle = {
  background: '#fbfcfd',
  color: pageText,
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
  padding: '20px 30px',
};

const cellStyle = {
  color: pageText,
  fontSize: 15,
  padding: '14px 14px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const headStyle = {
  color: pageText,
  fontSize: 15,
  fontWeight: 700,
  padding: '16px 14px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const FinancePage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(650px, 1.7fr) minmax(430px, 1fr)' }}>

        {/* ── Left Column ── */}
        <div>
          {/* Charges & Deductions Table */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Charges &amp; Deductions</h5>
              <input
                placeholder="Search"
                style={{
                  border: 0,
                  borderRadius: 4,
                  boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)',
                  color: pageText,
                  height: 39,
                  marginRight: 14,
                  outline: 0,
                  padding: '0 15px',
                  width: 280,
                }}
              />
            </div>

            <div style={{ padding: '18px 16px 16px' }}>
              <div style={{ border: '1px solid #eef1f4', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%' }}>
                  <colgroup>
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '9%' }} />
                    <col style={{ width: '11%' }} />
                    <col style={{ width: '11%' }} />
                    <col style={{ width: '9%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#fbfcfd' }}>
                      {['#', 'Charge Type', 'Description', 'Amount', 'Tax', 'Total', 'Status', 'Actions'].map((head) => (
                        <th key={head} style={headStyle}>{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chargesRows.map((row) => (
                      <tr key={`${row[0]}-${row[1]}`}>
                        {row.map((value) => (
                          <td key={`${row[0]}-${value}`} style={cellStyle}>{value}</td>
                        ))}
                        <td style={{ padding: '9px 12px' }}>
                          <button
                            type="button"
                            style={{ background: 'transparent', border: 0, color: pageText, padding: 0, textDecoration: 'underline', fontSize: 14 }}
                          >
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

          {/* Payments & Transactions Table */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Payments &amp; Transactions</h5>
            <div style={{ padding: '18px 16px 14px' }}>
              <div style={{ border: '1px solid #eef1f4', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%' }}>
                  <colgroup>
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '11%' }} />
                    <col style={{ width: '12%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#fbfcfd' }}>
                      {['#', 'Payment Date', 'Payment Method', 'Transaction ID', 'Paid By', 'Amount', 'Status', 'Invoice'].map((head) => (
                        <th key={head} style={headStyle}>{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paymentRows.map((row) => (
                      <tr key={`${row[0]}-${row[1]}`}>
                        {row.map((value) => (
                          <td key={`${row[0]}-${value}`} style={cellStyle}>{value}</td>
                        ))}
                        <td style={{ padding: '9px 12px' }}>
                          <button
                            type="button"
                            style={{ background: 'transparent', border: 0, color: pageText, padding: 0, textDecoration: 'underline', fontSize: 14 }}
                          >
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

        {/* ── Right Column ── */}
        <div>
          {/* Deduction Breakdown */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Deduction Breakdown</h5>
            <div className="d-flex align-items-center justify-content-center gap-5" style={{ padding: '26px 34px 38px' }}>
              <div
                style={{
                  background: 'conic-gradient(#5cc481 0 58%, #5c45df 58% 82%, #f49345 82% 95%, #edf049 95% 100%)',
                  borderRadius: '50%',
                  flex: '0 0 auto',
                  height: 198,
                  position: 'relative',
                  width: 198,
                }}
              >
                <span
                  style={{
                    background: '#fff',
                    borderRadius: '50%',
                    height: 114,
                    left: 42,
                    position: 'absolute',
                    top: 42,
                    width: 114,
                  }}
                />
              </div>
              <div style={{ minWidth: 240 }}>
                {deductionItems.map(([label, value, color]) => (
                  <div key={label} className="d-flex align-items-center justify-content-between gap-4 mb-4">
                    <span className="d-inline-flex align-items-center gap-3" style={{ color: '#7c8ca1', fontSize: 16, fontWeight: 700 }}>
                      <span style={{ background: color, borderRadius: '50%', display: 'inline-block', height: 15, width: 15 }} />
                      {label}
                    </span>
                    <span style={{ color: bodyText, fontSize: 16 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settlement Summary */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Settlement Summary</h5>
            <div style={{ padding: '26px 24px 18px' }}>
              <div style={{ borderBottom: '1px solid #e6e8eb', margin: '0 0 16px', padding: '0 38px 12px' }}>
                {settlementRows.slice(0, 3).map(([label, value]) => (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '210px 20px 1fr', minHeight: 35 }}>
                    <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                    <span style={{ color: pageText, fontSize: 16 }}>:</span>
                    <span style={{ color: pageText, fontSize: 16 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '0 38px' }}>
                {settlementRows.slice(3).map(([label, value, highlight]) => (
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
              <div
                style={{
                  background: '#fff6f6',
                  border: '1px solid #f1d8d8',
                  borderRadius: 8,
                  color: pageText,
                  padding: '14px 16px',
                }}
              >
                <h6 style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Notes</h6>
                <div style={{ background: '#fff', borderRadius: 8, color: '#666', fontSize: 15, padding: '22px 20px' }}>
                  All Utilities Readings are captured Successfully. No Issues Are Found.
                </div>
              </div>

              <div className="d-flex align-items-end justify-content-between gap-3" style={{ color: '#555', fontSize: 14, padding: '14px 22px 0' }}>
                <div>
                  <p className="mb-1">Added By</p>
                  <p className="mb-0">Ramesh Kumar</p>
                </div>
                <span>29 May 2025, 11:15 AM</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinancePage;