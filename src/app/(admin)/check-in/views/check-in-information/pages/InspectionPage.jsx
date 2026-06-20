import property2 from '@/assets/images/properties/p-2.jpg';
import property3 from '@/assets/images/properties/p-3.jpg';
import property4 from '@/assets/images/properties/p-4.jpg';
import property5 from '@/assets/images/properties/p-5.jpg';
import property6 from '@/assets/images/properties/p-6.jpg';
import property7 from '@/assets/images/properties/p-7.jpg';
import avatar from '@/assets/images/users/avatar-1.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const pageText = '#526b89';
const bodyText = '#303746';

const stats = [
  { label: 'Total Items', value: '48', icon: 'solar:calendar-date-bold-duotone', color: '#6747ff', bg: '#eee7ff' },
  { label: 'Checked', value: '42', badge: '+44%', icon: 'solar:gallery-check-bold-duotone', color: '#47c878', bg: '#e9f8ef' },
  { label: 'Good', value: '34', icon: 'solar:user-plus-bold-duotone', color: '#ff8d3c', bg: '#fff0e8' },
  { label: 'Issues Found', value: '8', icon: 'solar:chart-2-bold-duotone', color: '#36c8cf', bg: '#e8fbfb' },
  { label: 'Not Applicable', value: '6', icon: 'solar:chart-bold-duotone', color: '#dc3a3a', bg: '#fdeced' },
];

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
  ['Inspection Type', 'Move-In Inspection'],
  ['Inspection Date', '29 May 2026'],
  ['Inspector', 'Ramesh Kumar'],
  ['Inspection Duration', '01:45 Hrs'],
  ['Overall Status', 'Good'],
  ['Next Inspection Due', '28 May 2026'],
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
  color: pageText,
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
  padding: '22px 30px',
};

const StatCard = ({ stat }) => (
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
        <span style={{ color: pageText, fontSize: 15 }}>{stat.label}</span>
        {stat.badge && (
          <span
            style={{
              background: '#d6f6df',
              borderRadius: 4,
              color: '#48bd70',
              fontSize: 12,
              fontWeight: 700,
              padding: '2px 7px',
            }}
          >
            {stat.badge}
          </span>
        )}
      </div>
      <strong style={{ color: bodyText, fontSize: 26 }}>{stat.value}</strong>
    </div>
    <span
      className="d-inline-flex align-items-center justify-content-center"
      style={{ background: stat.bg, borderRadius: 5, color: stat.color, height: 56, width: 56 }}
    >
      <IconifyIcon icon={stat.icon} width={32} height={32} />
    </span>
  </div>
);

const InspectionPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#edf2f8', borderRadius: 8, marginBottom: 24, padding: '26px 25px' }}>
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(5, minmax(190px, 1fr))' }}>
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(620px, 1.7fr) minmax(390px, 1fr)' }}>
        <div>
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>Inspections Lists</h5>
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

            <div style={{ padding: '34px 18px 16px' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr style={{ background: '#fbfcfd', borderRadius: 8 }}>
                    {['Category', 'Total Items', 'Good', 'Issues', 'N/A', 'Status', 'Actions'].map((head) => (
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
                  {inspectionRows.map(([category, total, good, issues, na, status]) => (
                    <tr key={category}>
                      <td style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>
                        <IconifyIcon icon="ri:checkbox-circle-line" width={16} height={16} style={{ color: '#2f7ee6', marginRight: 12 }} />
                        {category}
                      </td>
                      {[total, good, issues, na, status].map((value, index) => (
                        <td key={`${category}-${index}`} style={{ color: pageText, fontSize: 15, padding: '16px 24px' }}>
                          {value}
                        </td>
                      ))}
                      <td style={{ padding: '16px 24px' }}>
                        <button type="button" style={{ background: 'transparent', border: 0, color: pageText, textDecoration: 'underline' }}>
                          view
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Inspection Photos</h5>
            <div style={{ padding: '0 26px 24px' }}>
              <div className="d-flex gap-3 mb-3">
                {photos.map((photo) => (
                  <img key={photo} alt="Inspection" src={photo} style={{ borderRadius: 8, height: 78, objectFit: 'cover', width: 110 }} />
                ))}
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                  Recent Issues
                </h6>
                <button type="button" style={{ background: 'transparent', border: 0, color: '#1f7ee8', fontSize: 16 }}>
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
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>Inspection Overview</h5>
              <button type="button" style={{ background: 'transparent', border: 0, color: '#1f7ee8', fontSize: 16, paddingRight: 26 }}>
                View All
              </button>
            </div>
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
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>Top Issues Categories</h5>
              <button type="button" style={{ background: 'transparent', border: 0, color: '#1f7ee8', fontSize: 16, paddingRight: 26 }}>
                View All
              </button>
            </div>
            <div style={{ padding: '18px 58px 32px' }}>
              {issueCategories.map(([label, value, color, width]) => (
                <div key={label} style={{ alignItems: 'center', display: 'grid', gap: 18, gridTemplateColumns: '140px 1fr 24px', minHeight: 45 }}>
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
