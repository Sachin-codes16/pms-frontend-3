import IconifyIcon from '@/components/wrappers/IconifyIcon';

const pageText = '#526b89';
const bodyText = '#303746';

const stats = [
  { label: 'Total Utilities', value: '5', icon: 'solar:calendar-date-bold-duotone', color: '#6747ff', bg: '#eee7ff' },
  { label: 'Total Units', value: '8', badge: '+44%', icon: 'solar:gallery-check-bold-duotone', color: '#47c878', bg: '#e9f8ef' },
  { label: 'Total Current Change', value: '534 OMR', icon: 'solar:user-plus-bold-duotone', color: '#ff8d3c', bg: '#fff0e8' },
  { label: 'Adjustment', value: '100 OMR', icon: 'solar:chart-2-bold-duotone', color: '#36c8cf', bg: '#e8fbfb' },
  { label: 'Not Applicable', value: '6', icon: 'solar:chart-bold-duotone', color: '#dc3a3a', bg: '#fdeced' },
];

const utilityRows = [
  ['Electricity', 'ELE12345', '1245', '332', 'kWh', '5 OMR', '535 OMR', 'Normal'],
  ['Water', 'WAT1234', '4567', '125', 'm', '5 OMR', '253 OMR', 'Normal'],
  ['Gas', 'ASD1234', '4645', '254', 'KL', '1 OMR', '453 OMR', 'Fixed'],
  ['Internet', 'ASD1234', '7864', '354', 'KI', '2 OMR', '857 OMR', 'Fixed'],
  ['AC Service', 'ASD1234', '4533', '125', 'kWh', '6 OMR', '253 OMR', 'Issues'],
  ['Fuel', 'ASD1234', '4534', '235', 'kWh', '4 OMR', '654 OMR', 'Fixed'],
  ['Solar', 'ASD1234', '3452', '125', 'Month', '3 OMR', '523 OMR', 'Fixed'],
  ['Other Services', 'ASD1234', '4534', '324', 'kWh', '2 OMR', '453 OMR', 'Normal'],
];

const overviewItems = [
  ['Total Balance', '856 OMR'],
  ['Total Payable', '560 OMR'],
  ['Total Utilities', '12'],
  ['Total Units', '8'],
  ['Total Current Charge', '1235 OMR'],
  ['Not Applicable', '5'],
];

const readingOverview = [
  ['Electricity', '531 OMR', '#f26c22', 76],
  ['Water', '453 OMR', '#bd63ad', 88],
  ['Gas', '354 OMR', '#a8c414', 50],
  ['Internet', '453 OMR', '#f25d78', 70],
  ['AC Services', '254 OMR', '#4ea7c7', 94],
  ['Others', '120 OMR', '#545579', 53],
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

const UtilityReadingsPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#edf2f8', borderRadius: 8, marginBottom: 24, padding: '26px 25px' }}>
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(5, minmax(190px, 1fr))' }}>
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(650px, 1.7fr) minmax(390px, 1fr)' }}>
        <div>
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>Check-In Utilities Readings</h5>
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
                  <tr style={{ background: '#fbfcfd' }}>
                    {['Utility', 'Meter No', 'Check-In Readings', 'Consumption', 'Unit', 'Rate/Unit', 'Charges', 'Status', 'Actions'].map((head) => (
                      <th
                        key={head}
                        style={{ color: pageText, fontSize: 16, fontWeight: 700, padding: '20px 18px', textAlign: 'left' }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {utilityRows.map((row) => (
                    <tr key={`${row[0]}-${row[1]}`}>
                      <td style={{ color: pageText, fontSize: 15, padding: '16px 18px' }}>
                        <IconifyIcon icon="ri:checkbox-circle-line" width={16} height={16} style={{ color: '#2f7ee6', marginRight: 12 }} />
                        {row[0]}
                      </td>
                      {row.slice(1).map((value) => (
                        <td key={`${row[0]}-${value}`} style={{ color: pageText, fontSize: 15, padding: '16px 18px' }}>
                          {value}
                        </td>
                      ))}
                      <td style={{ padding: '16px 18px' }}>
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
            <h5 style={titleStyle}>Notes / Comments</h5>
            <div style={{ padding: '0 18px 20px' }}>
              <div style={{ background: '#fff7f7', border: '1px solid #f0cfd0', borderRadius: 8, padding: '16px 18px' }}>
                <p style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Notes</p>
                <div style={{ background: '#fff', borderRadius: 8, color: '#666', fontSize: 15, padding: '24px 22px' }}>
                  All Utilities Readings are captured Successfully. No Issues Are Found.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>Utilities Overview</h5>
              <button type="button" style={{ background: 'transparent', border: 0, color: '#1f7ee8', fontSize: 16, paddingRight: 26 }}>
                View All
              </button>
            </div>
            <div style={{ padding: '22px 70px 28px' }}>
              {overviewItems.map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '210px 20px 1fr', minHeight: 45 }}>
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 16 }}>:</span>
                  <span style={{ color: pageText, fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>Check-In Reading Overview</h5>
              <button type="button" style={{ background: 'transparent', border: 0, color: '#1f7ee8', fontSize: 16, paddingRight: 26 }}>
                View All
              </button>
            </div>
            <div style={{ padding: '18px 58px 32px' }}>
              {readingOverview.map(([label, value, color, width]) => (
                <div key={label} style={{ alignItems: 'center', display: 'grid', gap: 18, gridTemplateColumns: '140px 1fr 70px', minHeight: 45 }}>
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ background: '#d7d7d7', borderRadius: 999, display: 'block', height: 7, overflow: 'hidden' }}>
                    <span style={{ background: color, borderRadius: 999, display: 'block', height: '100%', width: `${width}%` }} />
                  </span>
                  <span style={{ color: pageText, fontSize: 15, textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilityReadingsPage;
