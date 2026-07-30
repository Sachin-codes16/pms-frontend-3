import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { resolvePhotoSrc } from '@/utils/imageStorage';
import { fmtDate, fmtDateTime, val } from '@/utils/checkInFormat';

const pageText = '#526b89';

const cardStyle = { border: '1px solid #cfd7df', borderRadius: 8, overflow: 'hidden' };

const titleStyle = {
  background: '#fbfcfd', color: pageText, fontSize: 16,
  fontWeight: 700, margin: 0, padding: '20px 30px',
};

const linkButtonStyle = { background: 'transparent', border: 0, color: '#1f7ee8', fontSize: 16 };

const STAT_ICONS = [
  'solar:calendar-date-bold-duotone',
  'solar:gallery-check-bold-duotone',
  'solar:user-plus-bold-duotone',
  'solar:chart-2-bold-duotone',
];
const STAT_COLORS = ['#6747ff', '#47c878', '#ff8d3c', '#36c8cf'];
const STAT_BGS    = ['#eee7ff', '#e9f8ef', '#fff0e8', '#e8fbfb'];

const BAR_COLORS = ['#f26c22', '#bd63ad', '#a8c414', '#f25d78', '#4ea7c7', '#545579', '#2fc89e', '#e94f37'];

const StatCard = ({ label, value, icon, color, bg }) => (
  <div style={{
    alignItems: 'center', background: '#fff', borderRadius: 5,
    boxShadow: '0 8px 18px rgba(15,23,42,0.08)', display: 'flex',
    justifyContent: 'space-between', minHeight: 98, padding: '20px',
  }}>
    <div>
      <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>{label}</p>
      <strong style={{ color: '#303746', fontSize: 22 }}>{value || '—'}</strong>
    </div>
    <span className="d-inline-flex align-items-center justify-content-center"
      style={{ background: bg, borderRadius: 5, color, height: 56, width: 56 }}>
      <IconifyIcon icon={icon} width={32} height={32} />
    </span>
  </div>
);

const InspectionPage = ({ record }) => {
  const insp     = record?.inspection ?? {};
  const overview = insp.inspectionOverview ?? {};
  const list     = insp.inspectionsList ?? [];
  const photos   = insp.inspectionPhotos ?? [];
  const issues   = insp.recentIssues ?? [];
  const topCats  = insp.topIssuesCategories ?? [];
  const notes    = insp.inspectionNotes ?? '';

  const statCards = [
    { label: 'Inspection Date',   value: fmtDate(overview.inspectionDate) },
    { label: 'Inspector',         value: val(overview.inspector) },
    { label: 'Overall Condition', value: val(overview.overallStatus) },
    { label: 'Inspection Status', value: val(record?.overview?.summaryCards?.inspectionStatus ?? record?.managerApproval) },
  ];

  const overviewRows = [
    ['Inspection Type',    val(record?.inspectionRequired === 'Yes' ? 'Move-Out Inspection' : 'Not Required')],
    ['Inspection Date',    fmtDate(overview.inspectionDate)],
    ['Inspector',          val(overview.inspector)],
    ['Inspection Duration',val(overview.inspectionDuration)],
    ['Technician Type',    val(record?.technicianType)],
    ['Overall Status',     val(overview.overallStatus)],
    ['Next Inspection Due',fmtDate(overview.nextInspectionDue)],
  ];

  // Compute max count for bar width
  const maxCat = Math.max(...topCats.map((c) => c.count ?? c[1] ?? 0), 1);

  return (
    <div style={{ padding: 24 }}>
      {/* Stat cards */}
      <div style={{ background: '#edf2f8', borderRadius: 8, marginBottom: 24, padding: '26px 25px' }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))' }}>
          {statCards.map((s, i) => (
            <StatCard key={s.label} label={s.label} value={s.value}
              icon={STAT_ICONS[i]} color={STAT_COLORS[i]} bg={STAT_BGS[i]} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(650px, 1.7fr) minmax(430px, 1fr)' }}>
        <div>
          {/* Inspections Checklist */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Inspections Checklist</h5>
              <input placeholder="Search" style={{
                border: 0, borderRadius: 4, boxShadow: '0 8px 18px rgba(15,23,42,0.06)',
                color: pageText, height: 39, marginRight: 14, outline: 0, padding: '0 15px', width: 325,
              }} />
            </div>
            <div style={{ padding: '34px 16px 16px' }}>
              <div style={{ border: '1px solid #eef1f4', borderRadius: 8, overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', minWidth: 860, width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#fbfcfd' }}>
                      {['Category', 'Total Items', 'Good', 'Issues', 'N/A', 'Status', 'Actions'].map((h) => (
                        <th key={h} style={{ color: pageText, fontSize: 16, fontWeight: 700, padding: '20px 24px', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {list.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ color: pageText, fontSize: 15, padding: '24px', textAlign: 'center' }}>
                          No inspection checklist items recorded.
                        </td>
                      </tr>
                    ) : list.map((row) => {
                      const category = row.category ?? row.categoryName ?? '—';
                      return (
                        <tr key={category}>
                          <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>
                            <IconifyIcon icon="ri:checkbox-circle-line" width={16} height={16}
                              style={{ color: '#2f7ee6', marginRight: 12 }} />
                            {category}
                          </td>
                          <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>{row.totalItems ?? '—'}</td>
                          <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>{row.good ?? '—'}</td>
                          <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>{row.issuesFound ?? row.issues ?? '—'}</td>
                          <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>{row.notApplicable ?? row.na ?? '—'}</td>
                          <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>{val(row.status)}</td>
                          <td style={{ padding: '16px 24px' }}>
                            <button type="button" style={{ background: 'transparent', border: 0, color: pageText, padding: 0, textDecoration: 'underline' }}>
                              view
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Inspection Photos + Recent Issues */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Inspection Photos</h5>
            <div style={{ padding: '26px 30px 24px' }}>
              {photos.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>No inspection photos uploaded.</p>
              ) : (
                <div className="d-flex gap-3 mb-3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
                  {photos.map((photo, i) => (
                    <img key={i} alt="Inspection" src={resolvePhotoSrc(photo?.photo ?? photo)}
                      style={{ borderRadius: 8, flex: '0 0 auto', height: 78, objectFit: 'cover', width: 110 }} />
                  ))}
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>Recent Issues</h6>
                <button type="button" style={linkButtonStyle}>View All</button>
              </div>

              {issues.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>No recent issues recorded.</p>
              ) : issues.map((issue, i) => {
                const title    = issue.title ?? issue.itemName ?? '—';
                const category = issue.category ?? '—';
                const priority = issue.severity ?? issue.priority ?? '—';
                const photo    = issue.photo;
                return (
                  <div key={i} className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {photo ? (
                        <img alt={title} src={resolvePhotoSrc(photo)} style={{ height: 32, objectFit: 'cover', width: 32 }} />
                      ) : (
                        <div style={{ background: '#eef2f7', borderRadius: 4, height: 32, width: 32 }} />
                      )}
                      <div>
                        <p className="mb-1" style={{ color: pageText, fontSize: 15 }}>{title}</p>
                        <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>{category}</p>
                      </div>
                    </div>
                    <span style={{ color: pageText, fontSize: 16 }}>{priority}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          {/* Inspection Overview */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Inspection Overview</h5>
              <button type="button" style={{ ...linkButtonStyle, paddingRight: 26 }}>View All</button>
            </div>
            <div style={{ padding: '26px 72px 28px' }}>
              {overviewRows.map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '200px 20px 1fr', minHeight: 45 }}>
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 16 }}>:</span>
                  <span style={{ color: pageText, fontSize: 16 }}>{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inspection Notes */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Inspection Notes</h5>
            <div style={{ color: pageText, fontSize: 15, lineHeight: 1.45, padding: '20px 38px 24px' }}>
              {notes ? (
                <p className="mb-0">{notes}</p>
              ) : (
                <p className="mb-0" style={{ color: '#8a96a8' }}>No inspection notes added.</p>
              )}
            </div>
          </div>

          {/* Top Issues Categories */}
          <div style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Top Issues Categories</h5>
              <button type="button" style={{ ...linkButtonStyle, paddingRight: 26 }}>View All</button>
            </div>
            <div style={{ padding: '18px 58px 32px' }}>
              {topCats.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>No issue categories recorded.</p>
              ) : topCats.map((cat, i) => {
                const label = cat.category ?? cat[0] ?? '—';
                const count = cat.count ?? cat[1] ?? 0;
                const color = BAR_COLORS[i % BAR_COLORS.length];
                const width = Math.round((count / maxCat) * 100);
                return (
                  <div key={label} style={{ alignItems: 'center', display: 'grid', gap: 18, gridTemplateColumns: '140px 1fr 24px', minHeight: 45 }}>
                    <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                    <span style={{ background: '#d7d7d7', borderRadius: 999, display: 'block', height: 7, overflow: 'hidden' }}>
                      <span style={{ background: color, borderRadius: 999, display: 'block', height: '100%', width: `${width}%` }} />
                    </span>
                    <span style={{ color: pageText, fontSize: 16, textAlign: 'right' }}>{count}</span>
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

export default InspectionPage;
