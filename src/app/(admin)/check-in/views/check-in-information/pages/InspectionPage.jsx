import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useState } from 'react';
import { resolvePhotoSrc } from '@/utils/imageStorage';
import { fmtDate, val } from '@/utils/checkInFormat';

const pageText = '#526b89';
const bodyText = '#303746';

const cardStyle = {
  border: '1px solid #cfd7df',
  borderRadius: 8,
  overflow: 'hidden',
};

const STAT_FIELDS = [
  { key: 'totalItems',      label: 'Total Items',     icon: 'solar:calendar-date-bold-duotone', color: '#6747ff', bg: '#eee7ff' },
  { key: 'checked',         label: 'Checked',         icon: 'solar:gallery-check-bold-duotone', color: '#47c878', bg: '#e9f8ef', pctKey: 'checkedPercentage' },
  { key: 'good',            label: 'Good',            icon: 'solar:user-plus-bold-duotone',     color: '#ff8d3c', bg: '#fff0e8' },
  { key: 'issuesFound',     label: 'Issues Found',    icon: 'solar:chart-2-bold-duotone',       color: '#36c8cf', bg: '#e8fbfb' },
  { key: 'notApplicable',   label: 'Not Applicable',  icon: 'solar:chart-bold-duotone',         color: '#dc3a3a', bg: '#fdeced' },
];

const StatCard = ({ label, value, icon, color, bg, pct }) => (
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
        {pct != null && (
          <span style={{ background: '#e6f9ef', borderRadius: 4, color: '#1a9e5c', fontSize: 12, fontWeight: 600, padding: '2px 7px' }}>
            {pct}%
          </span>
        )}
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

const STATUS_COLOR = {
  Good:   { color: '#1a9e5c', bg: '#e6f9ef' },
  Issues: { color: '#d9534f', bg: '#fdeced' },
  'N/A':  { color: '#8a8a8a', bg: '#f2f2f2' },
};

const StatusBadge = ({ status }) => {
  const s = val(status);
  const style = STATUS_COLOR[s] ?? { color: pageText, bg: '#f2f4f7' };
  return (
    <span style={{ background: style.bg, borderRadius: 4, color: style.color, fontSize: 13, fontWeight: 600, padding: '3px 10px' }}>
      {s}
    </span>
  );
};

const PRIORITY_COLOR = {
  High:   { color: '#d9534f', bg: '#fdeced' },
  Medium: { color: '#e09a28', bg: '#fff8e6' },
  Low:    { color: '#1a9e5c', bg: '#e6f9ef' },
};

const PriorityBadge = ({ priority }) => {
  const p = val(priority);
  const style = PRIORITY_COLOR[p] ?? { color: pageText, bg: '#f2f4f7' };
  return (
    <span style={{ background: style.bg, borderRadius: 4, color: style.color, fontSize: 13, fontWeight: 600, padding: '3px 10px' }}>
      {p}
    </span>
  );
};

const InspectionPage = ({ record }) => {
  const [search, setSearch] = useState('');

  const inspection          = record?.inspection ?? {};
  const summary             = inspection.summary ?? {};
  const inspectionsList     = inspection.inspectionsList ?? [];
  const overview            = inspection.inspectionOverview ?? {};
  const topIssuesCategories = inspection.topIssuesCategories ?? [];
  const photos              = inspection.inspectionPhotos ?? [];
  const recentIssues        = inspection.recentIssues ?? [];

  const filteredList = search.trim()
    ? inspectionsList.filter((item) =>
        (item.category ?? item.name ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : inspectionsList;

  const overviewItems = [
    ['Inspection Type',     val(overview.inspectionType)],
    ['Inspection Date',     fmtDate(overview.inspectionDate)],
    ['Inspector',           val(overview.inspector)],
    ['Inspection Duration', val(overview.inspectionDuration)],
    ['Overall Status',      val(overview.overallStatus)],
    ['Next Inspection Due', fmtDate(overview.nextInspectionDue)],
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#edf2f8', borderRadius: 8, marginBottom: 24, padding: '26px 25px' }}>
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(5, minmax(190px, 1fr))' }}>
          {STAT_FIELDS.map(({ key, pctKey, ...rest }) => (
            <StatCard
              key={key}
              {...rest}
              value={summary[key] ?? 0}
              pct={pctKey != null ? (summary[pctKey] ?? null) : null}
            />
          ))}
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(620px, 1.7fr) minmax(390px, 1fr)' }}>

        {/* LEFT */}
        <div>
          {/* Inspections List */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ padding: '18px 24px' }}>
              <h5 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>Inspections Lists</h5>
              <div style={{ position: 'relative' }}>
                <IconifyIcon
                  icon="ri:search-line"
                  width={16} height={16}
                  style={{ color: '#9aa5b4', left: 10, position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    background: '#f5f7fa',
                    border: '1px solid #dde3ea',
                    borderRadius: 6,
                    color: bodyText,
                    fontSize: 14,
                    outline: 'none',
                    padding: '7px 12px 7px 32px',
                    width: 180,
                  }}
                />
              </div>
            </div>

            {filteredList.length > 0 ? (
              <div style={{ overflowX: 'auto', padding: '0 0 16px' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#fbfcfd' }}>
                      {['Category', 'Total Items', 'Good', 'Issues', 'N/A', 'Status', 'Actions'].map((head) => (
                        <th
                          key={head}
                          style={{ color: pageText, fontSize: 15, fontWeight: 700, padding: '14px 20px', textAlign: head === 'Actions' ? 'center' : 'left' }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((item, index) => (
                      <tr key={item.id ?? item.category ?? index} style={{ borderTop: '1px solid #f0f2f5' }}>
                        <td style={{ color: pageText, fontSize: 15, padding: '14px 20px' }}>
                          <span className="d-inline-flex align-items-center gap-2">
                            <IconifyIcon icon="ri:checkbox-circle-line" width={16} height={16} style={{ color: '#2f7ee6' }} />
                            {val(item.category ?? item.name)}
                          </span>
                        </td>
                        <td style={{ color: pageText, fontSize: 15, padding: '14px 20px' }}>{val(item.totalItems)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '14px 20px' }}>{val(item.good)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '14px 20px' }}>{val(item.issues)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '14px 20px' }}>{val(item.notApplicable)}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <StatusBadge status={item.status} />
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                          <span style={{ color: '#2f7ee6', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>view</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: pageText, fontSize: 15, padding: '0 24px 24px' }}>
                {search ? 'No results match your search' : 'No inspection items recorded'}
              </p>
            )}
          </div>

          {/* Inspection Photos + Recent Issues */}
          <div style={cardStyle}>
            <div style={{ padding: '22px 24px 0' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>Inspection Photos</h5>
                <span style={{ color: '#2f7ee6', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>View All</span>
              </div>
              {photos.length > 0 ? (
                <div className="d-flex gap-3 mb-4">
                  {photos.map((photo, i) => (
                    <img
                      key={photo ?? i}
                      alt="Inspection"
                      src={resolvePhotoSrc(photo)}
                      style={{ borderRadius: 8, height: 78, objectFit: 'cover', width: 110 }}
                    />
                  ))}
                </div>
              ) : (
                <p style={{ color: pageText, fontSize: 15, marginBottom: 16 }}>No photos uploaded</p>
              )}
            </div>

            <div style={{ padding: '0 24px 24px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="mb-0" style={{ color: pageText, fontSize: 15, fontWeight: 700 }}>Recent Issues</h6>
                <span style={{ color: '#2f7ee6', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>View All</span>
              </div>
              {recentIssues.length > 0 ? (
                recentIssues.map((issue, index) => (
                  <div key={issue.checkInInspectionItemId ?? issue.id ?? index} className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {issue.photo ? (
                        <img alt={issue.itemName ?? issue.title} src={resolvePhotoSrc(issue.photo)} style={{ borderRadius: 4, height: 40, objectFit: 'cover', width: 40 }} />
                      ) : (
                        <span
                          className="d-inline-flex align-items-center justify-content-center"
                          style={{ background: '#edf2f8', borderRadius: 4, height: 40, width: 40 }}
                        >
                          <IconifyIcon icon="ri:image-line" width={18} height={18} style={{ color: pageText }} />
                        </span>
                      )}
                      <div>
                        <p className="mb-1" style={{ color: bodyText, fontSize: 14, fontWeight: 500 }}>
                          {val(issue.itemName ?? issue.title)}
                        </p>
                        <p className="mb-0" style={{ color: pageText, fontSize: 13 }}>
                          {val(issue.category)}
                        </p>
                      </div>
                    </div>
                    <PriorityBadge priority={issue.severity ?? issue.priority} />
                  </div>
                ))
              ) : (
                <p style={{ color: pageText, fontSize: 15 }}>No recent issues</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {/* Inspection Overview */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ padding: '22px 28px 14px' }}>
              <h5 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>Inspection Overview</h5>
            </div>
            <div style={{ padding: '0 28px 24px' }}>
              {overviewItems.map(([label, value]) => (
                <div key={label} style={{ alignItems: 'start', display: 'grid', gridTemplateColumns: '1fr 16px 1fr', minHeight: 42 }}>
                  <span style={{ color: pageText, fontSize: 15 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 15 }}>:</span>
                  <span style={{ color: bodyText, fontSize: 15, fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Issues Categories */}
          <div style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ padding: '22px 28px 14px' }}>
              <h5 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>Top Issues Categories</h5>
              <span style={{ color: '#2f7ee6', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>View All</span>
            </div>
            {topIssuesCategories.length > 0 ? (
              <div style={{ padding: '4px 28px 28px' }}>
                {(() => {
                  const BAR_COLORS = ['#f97316','#ec4899','#84cc16','#f43f5e','#06b6d4','#6366f1','#8b5cf6'];
                  const maxCount = Math.max(...topIssuesCategories.map((i) => i.issueCount ?? i.count ?? 0), 1);
                  return topIssuesCategories.map((item, index) => {
                    const count = item.issueCount ?? item.count ?? 0;
                    const pct   = Math.round((count / maxCount) * 100);
                    const color = item.color ?? BAR_COLORS[index % BAR_COLORS.length];
                    return (
                      <div
                        key={item.category ?? index}
                        style={{ alignItems: 'center', display: 'grid', gap: 14, gridTemplateColumns: '130px 1fr 24px', minHeight: 42 }}
                      >
                        <span style={{ color: pageText, fontSize: 15 }}>{val(item.category)}</span>
                        <span style={{ background: '#e5e9f0', borderRadius: 999, display: 'block', height: 7, overflow: 'hidden' }}>
                          <span style={{ background: color, borderRadius: 999, display: 'block', height: '100%', width: `${pct}%` }} />
                        </span>
                        <span style={{ color: bodyText, fontSize: 15, fontWeight: 600, textAlign: 'right' }}>{count}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <p style={{ color: pageText, fontSize: 15, padding: '0 28px 24px' }}>No issue categories recorded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;
