import property2 from '@/assets/images/properties/p-2.jpg';
import property3 from '@/assets/images/properties/p-3.jpg';
import property4 from '@/assets/images/properties/p-4.jpg';
import property5 from '@/assets/images/properties/p-5.jpg';
import property6 from '@/assets/images/properties/p-6.jpg';
import property7 from '@/assets/images/properties/p-7.jpg';
import avatar from '@/assets/images/users/avatar-1.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const pageText = '#526b89';

const inspectionRows = [
  ['Walls & Ceilings', 8, 6, 1, 1, 'Good'],
  ['Door & Windows', 6, 5, 2, 1, 'Good'],
  ['Electrical Fittings', 10, 6, 0, 2, 'Issues'],
  ['Plumbing', 8, 7, 2, 2, 'Good'],
  ['Kitchen', 6, 5, 0, 0, 'Issues'],
  ['Bathrooms', 6, 4, 1, 1, 'Good'],
  ['Furniture & Fixtures', 2, 2, 1, 2, 'Good'],
  ['Others', 2, 2, 2, 0, 'Good'],
];

const overviewItems = [
  ['Inspection Type', 'Move-Out Inspection'],
  ['Inspection Date', '29 May 2026'],
  ['Inspector', 'Ramesh Kumar'],
  ['Inspection Duration', '01:45 Hrs'],
  ['Overall Status', 'Good'],
  ['Final Settlement Due', '30 May 2026'],
];

const issueCategories = [
  ['Electrical Fittings', 2, '#f26c22', 76],
  ['Kitchen', 1, '#bd63ad', 88],
  ['Walls & Ceilings', 3, '#a8c414', 50],
  ['Bathrooms', 1, '#f25d78', 70],
  ['Hall', 1, '#4ea7c7', 94],
  ['Overall', 1, '#545579', 53],
];

const photos = [avatar, property2, property3, property4, property5, property6, property7];

const recentIssues = [
  ['Loose Switch Board', 'Electrical Fittings', 'High', property4],
  ['Kitchen Cabinet Door Hinge Loose', 'Electrical Fittings', 'Medium', property3],
  ['Ceiling Paint Patch Required', 'Electrical Fittings', 'Low', property2],
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

const linkButtonStyle = {
  background: 'transparent',
  border: 0,
  color: '#1f7ee8',
  fontSize: 16,
};

const InspectionPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(650px, 1.7fr) minmax(430px, 1fr)' }}>
        <div>
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Inspections Checklist</h5>
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
                  width: 325,
                }}
              />
            </div>

            <div style={{ padding: '34px 16px 16px' }}>
              <div style={{ border: '1px solid #eef1f4', borderRadius: 8, overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', minWidth: 860, width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#fbfcfd' }}>
                      {['Category', 'Total Items', 'Good', 'Issues', 'N/A', 'Status', 'Actions'].map((head) => (
                        <th
                          key={head}
                          style={{ color: pageText, fontSize: 16, fontWeight: 700, padding: '20px 24px', textAlign: 'left' }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionRows.map(([category, total, good, issues, na, status]) => (
                      <tr key={category}>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>
                          <IconifyIcon
                            icon="ri:checkbox-circle-line"
                            width={16}
                            height={16}
                            style={{ color: '#2f7ee6', marginRight: 12 }}
                          />
                          {category}
                        </td>
                        {[total, good, issues, na, status].map((value, index) => (
                          <td key={`${category}-${index}`} style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>
                            {value}
                          </td>
                        ))}
                        <td style={{ padding: '16px 24px' }}>
                          <button
                            type="button"
                            style={{ background: 'transparent', border: 0, color: pageText, padding: 0, textDecoration: 'underline' }}
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

          <div style={cardStyle}>
            <h5 style={titleStyle}>Inspection Photos</h5>
            <div style={{ padding: '26px 30px 24px' }}>
              <div className="d-flex gap-3 mb-3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
                {photos.map((photo) => (
                  <img
                    key={photo}
                    alt="Inspection"
                    src={photo}
                    style={{ borderRadius: 8, flex: '0 0 auto', height: 78, objectFit: 'cover', width: 110 }}
                  />
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                  Recent Issues
                </h6>
                <button type="button" style={linkButtonStyle}>
                  View All
                </button>
              </div>

              {recentIssues.map(([title, category, priority, image]) => (
                <div key={title} className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <img alt={title} src={image} style={{ height: 32, objectFit: 'cover', width: 32 }} />
                    <div>
                      <p className="mb-1" style={{ color: pageText, fontSize: 15 }}>
                        {title}
                      </p>
                      <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>
                        {category}
                      </p>
                    </div>
                  </div>
                  <span style={{ color: pageText, fontSize: 16 }}>{priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Inspection Overview</h5>
              <button type="button" style={{ ...linkButtonStyle, paddingRight: 26 }}>
                View All
              </button>
            </div>
            <div style={{ padding: '26px 72px 28px' }}>
              {overviewItems.map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '200px 20px 1fr', minHeight: 45 }}>
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 16 }}>:</span>
                  <span style={{ color: pageText, fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Inspection Notes</h5>
            <div style={{ color: pageText, fontSize: 15, lineHeight: 1.45, padding: '20px 38px 24px' }}>
              <p className="mb-3">
                Property is in good overall condition with well-maintained interiors and no visible major defects noted during
                inspection.
              </p>
              <h6 style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Next Step</h6>
              <p className="mb-3" style={{ paddingLeft: 10 }}>
                &bull;&nbsp; Proceed with routine maintenance and periodic inspections to preserve property condition.
              </p>
              <p className="mb-4" style={{ paddingLeft: 10 }}>
                &bull;&nbsp; No immediate repairs required; property is suitable for final check-out settlement.
              </p>
              <div className="d-flex align-items-end justify-content-between gap-3">
                <div>
                  <p className="mb-2">Added By</p>
                  <p className="mb-0">Ramesh Kumar</p>
                </div>
                <span>25 May 2026, 11:16 AM</span>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Top Issues Categories</h5>
              <button type="button" style={{ ...linkButtonStyle, paddingRight: 26 }}>
                View All
              </button>
            </div>
            <div style={{ padding: '18px 58px 32px' }}>
              {issueCategories.map(([label, value, color, width]) => (
                <div
                  key={label}
                  style={{ alignItems: 'center', display: 'grid', gap: 18, gridTemplateColumns: '140px 1fr 24px', minHeight: 45 }}
                >
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ background: '#d7d7d7', borderRadius: 999, display: 'block', height: 7, overflow: 'hidden' }}>
                    <span style={{ background: color, borderRadius: 999, display: 'block', height: '100%', width: `${width}%` }} />
                  </span>
                  <span style={{ color: pageText, fontSize: 16, textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;
