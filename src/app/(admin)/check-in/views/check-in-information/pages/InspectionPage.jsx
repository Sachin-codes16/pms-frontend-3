import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { resolvePhotoSrc } from '@/utils/imageStorage';
import { fmtDate, val } from '@/utils/checkInFormat';

const pageText = '#526b89';
const bodyText = '#303746';

const cardStyle = {
  border: '1px solid #cfd7df',
  borderRadius: 8,
  overflow: 'hidden',
};

const titleStyle = {
  color: pageText,
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
  padding: '22px 30px',
};

const emptyTextStyle = { color: pageText, fontSize: 15, padding: '0 30px 24px' };

const STAT_FIELDS = [
  { key: 'totalItems', label: 'Total Items', icon: 'solar:calendar-date-bold-duotone', color: '#6747ff', bg: '#eee7ff' },
  { key: 'checked', label: 'Checked', icon: 'solar:gallery-check-bold-duotone', color: '#47c878', bg: '#e9f8ef' },
  { key: 'good', label: 'Good', icon: 'solar:user-plus-bold-duotone', color: '#ff8d3c', bg: '#fff0e8' },
  { key: 'issuesFound', label: 'Issues Found', icon: 'solar:chart-2-bold-duotone', color: '#36c8cf', bg: '#e8fbfb' },
  { key: 'notApplicable', label: 'Not Applicable', icon: 'solar:chart-bold-duotone', color: '#dc3a3a', bg: '#fdeced' },
];

const StatCard = ({ label, value, icon, color, bg }) => (
  <div
    style={{
      alignItems: 'center',
      background: '#fff',
      borderRadius: 5,
      boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      minHeight: 98,
      padding: '20px 20px',
    }}
  >
    <div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <span style={{ color: pageText, fontSize: 15 }}>{label}</span>
      </div>
      <strong style={{ color: bodyText, fontSize: 26 }}>{value}</strong>
    </div>
    <span
      className="d-inline-flex align-items-center justify-content-center"
      style={{ background: bg, borderRadius: 5, color, height: 56, width: 56 }}
    >
      <IconifyIcon icon={icon} width={32} height={32} />
    </span>
  </div>
);

const InspectionPage = ({ record }) => {
  const inspection = record?.inspection ?? {};
  const summary = inspection.summary ?? {};
  const inspectionsList = inspection.inspectionsList ?? [];
  const overview = inspection.inspectionOverview ?? {};
  const topIssuesCategories = inspection.topIssuesCategories ?? [];
  const photos = inspection.inspectionPhotos ?? [];
  const recentIssues = inspection.recentIssues ?? [];

  const overviewItems = [
    ['Inspection Type', val(overview.inspectionType)],
    ['Inspection Date', fmtDate(overview.inspectionDate)],
    ['Inspector', val(overview.inspector)],
    ['Inspection Duration', val(overview.inspectionDuration)],
    ['Overall Status', val(overview.overallStatus)],
    ['Next Inspection Due', fmtDate(overview.nextInspectionDue)],
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#edf2f8', borderRadius: 8, marginBottom: 24, padding: '26px 25px' }}>
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(5, minmax(190px, 1fr))' }}>
          {STAT_FIELDS.map((stat) => (
            <StatCard key={stat.key} {...stat} value={summary[stat.key] ?? 0} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(620px, 1.7fr) minmax(390px, 1fr)' }}>
        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Inspections Lists</h5>

            {inspectionsList.length > 0 ? (
              <div style={{ padding: '34px 18px 16px' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#fbfcfd', borderRadius: 8 }}>
                      {['Category', 'Total Items', 'Good', 'Issues', 'N/A', 'Status'].map((head) => (
                        <th
                          key={head}
                          style={{ color: pageText, fontSize: 16, fontWeight: 700, padding: '20px 24px' }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionsList.map((item, index) => (
                      <tr key={item.id ?? item.category ?? index}>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>
                          <IconifyIcon icon="ri:checkbox-circle-line" width={16} height={16} style={{ color: '#2f7ee6', marginRight: 12 }} />
                          {val(item.category ?? item.name)}
                        </td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>{val(item.totalItems)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>{val(item.good)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>{val(item.issues)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>{val(item.notApplicable)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>{val(item.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={emptyTextStyle}>No inspection items recorded</p>
            )}
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Inspection Photos</h5>
            <div style={{ padding: '0 26px 24px' }}>
              {photos.length > 0 ? (
                <div className="d-flex gap-3 mb-3">
                  {photos.map((photo) => (
                    <img key={photo} alt="Inspection" src={resolvePhotoSrc(photo)} style={{ borderRadius: 8, height: 78, objectFit: 'cover', width: 110 }} />
                  ))}
                </div>
              ) : (
                <p style={{ color: pageText, fontSize: 15 }}>No photos uploaded</p>
              )}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                  Recent Issues
                </h6>
              </div>
              {recentIssues.length > 0 ? (
                recentIssues.map((issue, index) => (
                  <div key={issue.id ?? index} className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {issue.photo && (
                        <img alt={issue.title} src={resolvePhotoSrc(issue.photo)} style={{ height: 32, objectFit: 'cover', width: 32 }} />
                      )}
                      <div>
                        <p className="mb-1" style={{ color: pageText, fontSize: 15 }}>
                          {val(issue.title)}
                        </p>
                        <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>
                          {val(issue.category)}
                        </p>
                      </div>
                    </div>
                    <span style={{ color: pageText, fontSize: 16 }}>{val(issue.priority)}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: pageText, fontSize: 15 }}>No recent issues</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Inspection Overview</h5>
            <div style={{ padding: '5px 72px 28px' }}>
              {overviewItems.map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '200px 20px 1fr', minHeight: 45 }}>
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 16 }}>:</span>
                  <span style={{ color: pageText, fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Top Issues Categories</h5>
            {topIssuesCategories.length > 0 ? (
              <div style={{ padding: '18px 58px 32px' }}>
                {topIssuesCategories.map((item, index) => (
                  <div key={item.category ?? index} style={{ alignItems: 'center', display: 'grid', gap: 18, gridTemplateColumns: '140px 1fr 24px', minHeight: 45 }}>
                    <span style={{ color: pageText, fontSize: 16 }}>{val(item.category)}</span>
                    <span style={{ background: '#d7d7d7', borderRadius: 999, display: 'block', height: 7, overflow: 'hidden' }}>
                      <span style={{ background: item.color ?? '#545579', borderRadius: 999, display: 'block', height: '100%', width: `${item.percentage ?? 0}%` }} />
                    </span>
                    <span style={{ color: pageText, fontSize: 16, textAlign: 'right' }}>{val(item.count)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={emptyTextStyle}>No issue categories recorded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;
