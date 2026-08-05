import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';
import { fmtDate, val } from '@/utils/checkInFormat';
import { resolvePhotoSrc } from '@/utils/imageStorage';

const pageText = '#526b89';
const bodyText  = '#303746';

const cardStyle       = { border: '1px solid #cfd7df', borderRadius: 8, overflow: 'hidden' };
const titleStyle      = { color: pageText, fontSize: 16, fontWeight: 700, margin: 0, padding: '22px 30px' };
const headerTitleStyle = { ...titleStyle, background: '#fbfcfd' };
const actionButtonStyle = { background: '#f4f7fa', borderRadius: 5, color: pageText, height: 27, width: 27 };

const STAT_FIELDS = [
  { key: 'totalDocuments',    label: 'Total Documents',    icon: 'solar:calendar-date-bold-duotone', color: '#6747ff', bg: '#eee7ff' },
  { key: 'uploadedDocuments', label: 'Uploaded Documents', icon: 'solar:gallery-check-bold-duotone', color: '#47c878', bg: '#e9f8ef' },
  { key: 'expiringSoon',      label: 'Expiring Soon',      icon: 'solar:user-plus-bold-duotone',     color: '#ff8d3c', bg: '#fff0e8' },
  { key: 'missingDocuments',  label: 'Missing Documents',  icon: 'solar:chart-2-bold-duotone',       color: '#36c8cf', bg: '#e8fbfb' },
];

const DONUT_SEGMENTS = [
  { label: 'Documents', pct: 82, color: '#47c878' },
  { label: 'Images',    pct: 42, color: '#6747ff' },
  { label: 'Videos',    pct: 12, color: '#ff8d3c' },
  { label: 'Others',    pct: 6,  color: '#e7e83d' },
];

const StatCard = ({ label, value, icon, color, bg }) => (
  <div style={{ alignItems: 'center', background: '#fff', borderRadius: 5, boxShadow: '0 8px 18px rgba(15,23,42,0.08)', display: 'flex', justifyContent: 'space-between', minHeight: 98, padding: '20px' }}>
    <div>
      <span style={{ color: pageText, fontSize: 15 }}>{label}</span>
      <br />
      <strong style={{ color: bodyText, fontSize: 26 }}>{value}</strong>
    </div>
    <span className="d-inline-flex align-items-center justify-content-center" style={{ background: bg, borderRadius: 5, color, height: 56, width: 56 }}>
      <IconifyIcon icon={icon} width={32} height={32} />
    </span>
  </div>
);

const DonutChart = () => {
  const total = DONUT_SEGMENTS.reduce((s, sg) => s + sg.pct, 0);
  const radius = 70, center = 90, sw = 28;
  let cum = 0;
  const arcs = DONUT_SEGMENTS.map((sg) => {
    const s = (cum / total) * 2 * Math.PI - Math.PI / 2;
    cum += sg.pct;
    const e = (cum / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = center + radius * Math.cos(s), y1 = center + radius * Math.sin(s);
    const x2 = center + radius * Math.cos(e), y2 = center + radius * Math.sin(e);
    return { ...sg, d: `M ${x1} ${y1} A ${radius} ${radius} 0 ${e - s > Math.PI ? 1 : 0} 1 ${x2} ${y2}` };
  });
  return (
    <div className="d-flex align-items-center" style={{ gap: 20, padding: '10px 28px 24px' }}>
      <svg width={180} height={180} viewBox="0 0 180 180">
        {arcs.map((arc) => <path key={arc.label} d={arc.d} fill="none" stroke={arc.color} strokeWidth={sw} />)}
        <circle cx={center} cy={center} r={radius - sw / 2} fill="white" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {DONUT_SEGMENTS.map((sg) => (
          <div key={sg.label} className="d-flex align-items-center" style={{ gap: 12 }}>
            <span style={{ background: sg.color, borderRadius: '50%', display: 'inline-block', height: 14, width: 14 }} />
            <span style={{ color: '#8a9bad', fontSize: 15, fontWeight: 700, width: 92 }}>{sg.label}</span>
            <span style={{ color: bodyText, fontSize: 15, minWidth: 58, textAlign: 'right' }}>{sg.pct}.00%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DocumentsPage = ({ record }) => {
  const dt       = record?.documentsTab ?? {};
  const summary  = dt.summary ?? {};
  const allDocs  = dt.allDocuments ?? [];
  const expiring = dt.expiringSoon ?? [];
  const missing  = dt.missingDocuments ?? [];
  const docSum   = dt.documentsSummary ?? {};
  const recent   = dt.recentUploads ?? [];
  const notes    = dt.notes ?? '';

  // Build documents summary rows from API object or missing list
  const summaryRows = Object.keys(docSum).length > 0
    ? Object.entries(docSum)
    : [['Total Documents', String(summary.totalDocuments ?? 0)]];

  return (
    <div style={{ padding: 24 }}>
      {/* Stat cards */}
      <div style={{ background: '#edf2f8', borderRadius: 8, marginBottom: 24, padding: '26px 25px' }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))' }}>
          {STAT_FIELDS.map((f) => (
            <StatCard key={f.key} label={f.label} value={summary[f.key] ?? 0} icon={f.icon} color={f.color} bg={f.bg} />
          ))}
        </div>
      </div>

      <div style={{ alignItems: 'start', display: 'grid', gap: 24, gridTemplateColumns: 'minmax(650px, 1.7fr) minmax(390px, 1fr)' }}>
        <div>
          {/* All Documents table */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>All Documents ({allDocs.length})</h5>
              <input placeholder="Search" style={{ border: 0, borderRadius: 4, boxShadow: '0 8px 18px rgba(15,23,42,0.06)', color: pageText, height: 39, marginRight: 14, outline: 0, padding: '0 15px', width: 325 }} />
            </div>
            <div style={{ padding: '14px 18px 16px' }}>
              <table style={{ border: '1px solid #edf0f3', borderCollapse: 'separate', borderRadius: 8, borderSpacing: 0, overflow: 'hidden', width: '100%' }}>
                <thead>
                  <tr style={{ background: '#fbfcfd' }}>
                    {['#','Document Name','Category','Linked To','Uploaded By','Uploaded On','Actions'].map((h) => (
                      <th key={h} style={{ color: pageText, fontSize: 16, fontWeight: 700, padding: '20px 26px', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allDocs.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ color: pageText, fontSize: 15, padding: '24px 26px', textAlign: 'center' }}>
                        No documents uploaded yet.
                      </td>
                    </tr>
                  ) : allDocs.map((doc, idx) => (
                    <tr key={doc.documentId ?? doc.id ?? idx}>
                      <td style={{ color: pageText, fontSize: 15, padding: '14px 26px' }}>{idx + 1}</td>
                      <td style={{ color: pageText, fontSize: 15, padding: '14px 26px' }}>{doc.documentName ?? doc.name ?? '—'}</td>
                      <td style={{ color: pageText, fontSize: 15, padding: '14px 26px' }}>{doc.documentType ?? doc.category ?? '—'}</td>
                      <td style={{ color: pageText, fontSize: 15, padding: '14px 26px' }}>{doc.linkedTo ?? '—'}</td>
                      <td style={{ color: pageText, fontSize: 15, padding: '14px 26px' }}>{doc.uploadedBy ?? '—'}</td>
                      <td style={{ color: pageText, fontSize: 15, padding: '14px 26px' }}>{fmtDate(doc.uploadedOn) || '—'}</td>
                      <td style={{ padding: '14px 26px', whiteSpace: 'nowrap' }}>
                        <Button variant="link" as="a" href={resolvePhotoSrc(doc.file) || '#'} target="_blank" className="p-0 me-2" style={actionButtonStyle}>
                          <IconifyIcon icon="solar:eye-broken" width={16} height={16} />
                        </Button>
                        <Button variant="link" as="a" href={resolvePhotoSrc(doc.file) || '#'} download className="p-0" style={actionButtonStyle}>
                          <IconifyIcon icon="ri:download-line" width={16} height={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes / Comments */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={headerTitleStyle}>Notes / Comments</h5>
            <div style={{ padding: '18px 18px 20px' }}>
              <div style={{ background: '#fff7f7', border: '1px solid #f0cfd0', borderRadius: 8, padding: '16px 18px' }}>
                <p style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Notes</p>
                <div style={{ background: '#fff', borderRadius: 8, color: '#666', fontSize: 15, padding: '16px 22px' }}>
                  {notes || 'No notes added.'}
                </div>
              </div>
            </div>
          </div>

          {/* Expiring Soon */}
          <div style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Expiring Soon</h5>
              <button type="button" style={{ background: 'transparent', border: 0, color: '#1f7ee8', fontSize: 16, paddingRight: 26 }}>View All</button>
            </div>
            <div style={{ padding: '22px 42px 18px' }}>
              {expiring.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>Nothing expiring soon.</p>
              ) : expiring.map((item, i) => {
                const title   = val(item.title ?? item.documentType);
                const linkedTo = val(item.linkedTo ?? item.property);
                const expiry  = val(item.expiry ?? item.expiryText ?? item.daysLeft);
                return (
                  <div key={i} className="d-flex align-items-center justify-content-between gap-3 mb-4">
                    <div className="d-flex align-items-center gap-4">
                      <span className="d-inline-flex align-items-center justify-content-center"
                        style={{ background: '#f2c155', borderRadius: '50%', color: '#fff', fontWeight: 800, height: 22, width: 22 }}>
                        !
                      </span>
                      <div>
                        <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>{title}</p>
                        <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>{linkedTo}</p>
                      </div>
                    </div>
                    <span style={{ color: '#bd2d3a', fontSize: 15 }}>{expiry}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Missing Documents */}
          <div className="mt-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Missing Documents</h5>
            </div>
            <div style={{ padding: '22px 42px 18px' }}>
              {missing.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>No documents missing.</p>
              ) : missing.map((item, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between gap-3 mb-4">
                  <div className="d-flex align-items-center gap-4">
                    <span className="d-inline-flex align-items-center justify-content-center"
                      style={{ background: '#e35d5d', borderRadius: '50%', color: '#fff', fontWeight: 800, height: 22, width: 22 }}>
                      !
                    </span>
                    <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>{val(item.documentType)}</p>
                  </div>
                  <span style={{ color: pageText, fontSize: 15 }}>{val(item.tenant)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* Storage Overview (visual — no API data) */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={headerTitleStyle}>Storage Overview</h5>
            <DonutChart />
            <div style={{ color: '#8a9bad', fontSize: 14, fontWeight: 700, padding: '0 30px 26px' }}>
              Total Storage: <strong style={{ color: pageText, marginLeft: 18 }}>—</strong>
            </div>
          </div>

          {/* Documents Summary */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={headerTitleStyle}>Documents Summary</h5>
            <div style={{ padding: '16px 70px 24px' }}>
              {summaryRows.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>No summary data.</p>
              ) : summaryRows.map(([label, value]) => (
                <div key={label} className="d-flex justify-content-between" style={{ color: pageText, fontSize: 15, padding: '9px 0' }}>
                  <span>{label}</span>
                  <span className="d-flex" style={{ gap: 32 }}>
                    <span>:</span>
                    <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'right' }}>{value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Uploads */}
          <div style={cardStyle}>
            <h5 style={headerTitleStyle}>Recent Uploads</h5>
            <div style={{ padding: '12px 24px' }}>
              {recent.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15, padding: '10px 0' }}>No recent uploads.</p>
              ) : recent.map((doc, i) => {
                const name = val(doc.documentName ?? doc.name);
                const date = doc.uploadedOn ? `Uploaded on ${fmtDate(doc.uploadedOn)}` : '';
                return (
                  <div key={i} className="d-flex align-items-center" style={{ gap: 18, padding: '10px 0' }}>
                    <div className="d-inline-flex align-items-center justify-content-center"
                      style={{ background: '#fff', border: '1px solid #edf0f3', borderRadius: 6, color: '#f05445', fontSize: 9, fontWeight: 800, height: 50, minWidth: 50 }}>
                      PDF
                    </div>
                    <div>
                      <p className="mb-1" style={{ color: bodyText, fontSize: 15, fontWeight: 700 }}>{name}</p>
                      <p className="mb-0" style={{ color: bodyText, fontSize: 13 }}>{date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
