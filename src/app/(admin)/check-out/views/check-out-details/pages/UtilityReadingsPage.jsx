import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { resolvePhotoSrc } from '@/utils/imageStorage';
import { fmtDateTime, val } from '@/utils/checkInFormat';

const pageText = '#526b89';

const cardStyle     = { border: '1px solid #cfd7df', borderRadius: 8, overflow: 'hidden' };
const titleStyle    = { background: '#fbfcfd', color: pageText, fontSize: 16, fontWeight: 700, margin: 0, padding: '20px 30px' };
const linkButtonStyle = { background: 'transparent', border: 0, color: '#1f7ee8', fontSize: 16 };

const BAR_COLORS = ['#f26c22','#bd63ad','#a8c414','#f25d78','#4ea7c7','#545579','#2fc89e','#e94f37'];

const fmt = (v) => (v === null || v === undefined || v === '') ? '—' : v;

const UtilityReadingsPage = ({ record }) => {
  const ur        = record?.utilityReadings ?? {};
  const overview  = ur.utilitiesOverview ?? {};
  const readings  = ur.readingsList ?? [];
  const barData   = ur.readingOverview ?? [];
  const photos    = ur.meterPhotos ?? [];
  const recentIssues = ur.recentIssues ?? [];
  const notes     = ur.notes ?? record?.remarksNotes ?? '';

  const overviewRows = [
    ['Total Balance',       overview.totalBalance   != null ? `${overview.totalBalance} OMR`   : '—'],
    ['Total Payable',       overview.totalPayable   != null ? `${overview.totalPayable} OMR`   : '—'],
    ['Total Utilities',     fmt(overview.totalUtilities)],
    ['Total Units',         fmt(overview.totalUnits)],
    ['Total Current Charge',overview.totalCurrentCharge != null ? `${overview.totalCurrentCharge} OMR` : '—'],
    ['Not Applicable',      fmt(overview.notApplicable)],
  ];

  const maxCharge = Math.max(...barData.map(r => r.charges ?? r[1] ?? 0), 1);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(650px, 1.7fr) minmax(430px, 1fr)' }}>

        {/* Left column */}
        <div>
          {/* Readings table */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Check-Out Utilities Readings</h5>
              <input placeholder="Search" style={{
                border: 0, borderRadius: 4, boxShadow: '0 8px 18px rgba(15,23,42,0.06)',
                color: pageText, height: 39, marginRight: 14, outline: 0, padding: '0 15px', width: 280,
              }} />
            </div>
            <div style={{ padding: '18px 16px 16px' }}>
              <div style={{ border: '1px solid #eef1f4', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%' }}>
                  <colgroup>
                    <col style={{ width: '13%' }} /><col style={{ width: '11%' }} /><col style={{ width: '12%' }} />
                    <col style={{ width: '13%' }} /><col style={{ width: '12%' }} /><col style={{ width: '7%' }} />
                    <col style={{ width: '11%' }} /><col style={{ width: '10%' }} /><col style={{ width: '8%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#fbfcfd' }}>
                      {['Utility','Meter No','Check-In Readings','Check-Out Readings','Consumption','Unit','Charges','Status','Actions'].map((h) => (
                        <th key={h} style={{ color: pageText, fontSize: 13, fontWeight: 700, padding: '12px 10px', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {readings.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ color: pageText, fontSize: 14, padding: '24px', textAlign: 'center' }}>
                          No utility readings recorded.
                        </td>
                      </tr>
                    ) : readings.map((row, idx) => (
                      <tr key={row.checkOutUtilityReadingId ?? idx}>
                        <td style={{ color: pageText, fontSize: 13, padding: '9px 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <IconifyIcon icon="ri:checkbox-circle-line" width={14} height={14} style={{ color: '#2f7ee6', marginRight: 6 }} />
                          {val(row.utility)}
                        </td>
                        <td style={{ color: pageText, fontSize: 13, padding: '9px 10px' }}>{fmt(row.meterNo)}</td>
                        <td style={{ color: pageText, fontSize: 13, padding: '9px 10px' }}>
                          {row.checkInReading == null
                            ? <span style={{ color: '#8a96a8', fontStyle: 'italic' }}>No prior check-in reading</span>
                            : row.checkInReading}
                        </td>
                        <td style={{ color: pageText, fontSize: 13, padding: '9px 10px' }}>{fmt(row.readingValue)}</td>
                        <td style={{ color: pageText, fontSize: 13, padding: '9px 10px' }}>{fmt(row.consumption)}</td>
                        <td style={{ color: pageText, fontSize: 13, padding: '9px 10px' }}>{fmt(row.unit)}</td>
                        <td style={{ color: pageText, fontSize: 13, padding: '9px 10px' }}>
                          {row.charges != null ? `${row.charges} OMR` : '—'}
                        </td>
                        <td style={{ color: pageText, fontSize: 13, padding: '9px 10px' }}>{fmt(row.status)}</td>
                        <td style={{ padding: '9px 10px' }}>
                          <button type="button" style={{ background: 'transparent', border: 0, color: pageText, padding: 0, textDecoration: 'underline', fontSize: 13 }}>
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

          {/* Meter & Bill Photos + Recent Issues */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Meter &amp; Bill Photos</h5>
            <div style={{ padding: '26px 30px 50px' }}>
              {photos.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>No meter photos uploaded.</p>
              ) : (
                readings
                  .filter((r) => photos.some((p) => String(p.linkedTo) === String(r.checkOutUtilityReadingId)))
                  .map((r) => (
                    <div key={r.checkOutUtilityReadingId} className="mb-3">
                      <p className="mb-2" style={{ color: pageText, fontSize: 14, fontWeight: 600 }}>{val(r.utility)}</p>
                      <div className="d-flex gap-3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
                        {photos
                          .filter((p) => String(p.linkedTo) === String(r.checkOutUtilityReadingId))
                          .map((p) => (
                            <img key={p.documentId} alt={`${r.utility} meter`} src={resolvePhotoSrc(p.file)}
                              style={{ borderRadius: 8, flex: '0 0 auto', height: 78, objectFit: 'cover', width: 110 }} />
                          ))}
                      </div>
                    </div>
                  ))
              )}

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>Recent Issues</h6>
                <button type="button" style={linkButtonStyle}>View All</button>
              </div>

              {recentIssues.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>No recent issues recorded.</p>
              ) : recentIssues.map((issue, i) => (
                <div key={issue.checkOutUtilityReadingId ?? i} className="d-flex align-items-center justify-content-between" style={{ padding: '22px 0', borderTop: '1px solid #eef1f4' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ background: '#eef2f7', borderRadius: 8, height: 52, width: 52 }} />
                    <div>
                      <p className="mb-1" style={{ color: pageText, fontSize: 15, fontWeight: 600 }}>{val(issue.utility)} — {val(issue.meterNo)}</p>
                      <p className="mb-0" style={{ color: pageText, fontSize: 14 }}>{val(issue.remarks)}</p>
                    </div>
                  </div>
                  <span style={{ color: pageText, fontSize: 14 }}>{fmtDateTime(issue.reportedOn)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Utilities Overview */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Utilities Overview</h5>
              <button type="button" style={{ ...linkButtonStyle, paddingRight: 26 }}>View All</button>
            </div>
            <div style={{ padding: '26px 70px 28px' }}>
              {overviewRows.map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '210px 20px 1fr', minHeight: 45 }}>
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 16 }}>:</span>
                  <span style={{ color: pageText, fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Check-Out Reading Overview bar chart */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Check-Out Reading Overview</h5>
              <button type="button" style={{ ...linkButtonStyle, paddingRight: 26 }}>View All</button>
            </div>
            <div style={{ padding: '18px 58px 32px' }}>
              {barData.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>No reading data available.</p>
              ) : barData.map((row, i) => {
                const label  = val(row.utility ?? row[0]);
                const amount = row.charges ?? row[1] ?? 0;
                const color  = BAR_COLORS[i % BAR_COLORS.length];
                const width  = Math.round((amount / maxCharge) * 100);
                return (
                  <div key={label} style={{ alignItems: 'center', display: 'grid', gap: 18, gridTemplateColumns: '140px 1fr 70px', minHeight: 45 }}>
                    <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                    <span style={{ background: '#d7d7d7', borderRadius: 999, display: 'block', height: 7, overflow: 'hidden' }}>
                      <span style={{ background: color, borderRadius: 999, display: 'block', height: '100%', width: `${width}%` }} />
                    </span>
                    <span style={{ color: pageText, fontSize: 15, textAlign: 'right' }}>{amount} OMR</span>
                  </div>
                );
              })}
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

export default UtilityReadingsPage;
