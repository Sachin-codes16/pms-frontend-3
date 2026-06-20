import property2 from '@/assets/images/properties/p-2.jpg';
import property3 from '@/assets/images/properties/p-3.jpg';
import property4 from '@/assets/images/properties/p-4.jpg';
import property5 from '@/assets/images/properties/p-5.jpg';
import property6 from '@/assets/images/properties/p-6.jpg';
import property7 from '@/assets/images/properties/p-7.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const pageText = '#526b89';

const utilityRows = [
  ['Electricity', 'ELE12345', '567', '1245', '332', 'kWh', '535 OMR', 'Normal'],
  ['Water', 'WAT1234', '785', '4567', '125', 'm', '253 OMR', 'Normal'],
  ['Gas', 'ASD1234', '524', '4645', '254', 'KL', '453 OMR', 'Fixed'],
  ['Internet', 'ASD1234', '375', '7864', '354', 'KI', '857 OMR', 'Fixed'],
  ['AC Service', 'ASD1234', '725', '4533', '125', 'kWh', '253 OMR', 'Issues'],
  ['Fuel', 'ASD1234', '242', '4534', '235', 'kWh', '654 OMR', 'Fixed'],
  ['Solar', 'ASD1234', '752', '3452', '125', 'Month', '523 OMR', 'Fixed'],
  ['Other Services', 'ASD1234', '675', '4534', '324', 'kWh', '453 OMR', 'Normal'],
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

const photos = [property2, property3, property4, property5, property6, property7];

const recentIssues = [
  ['Electric Meter Photo', 'Electricity', '29 May 2026, 11:15 AM', property2],
  ['Water Meter Photo', 'Water', '29 May 2026, 13:15 AM', property3],
  ['Gas Bill Photo', 'Gas', '30 May 2026, 15:15 AM', property4],
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

const UtilityReadingsPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(650px, 1.7fr) minmax(430px, 1fr)' }}>

        {/* ── Left Column ── */}
        <div>
          {/* Table Card */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Check-Out Utilities Readings</h5>
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
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '11%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '11%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '8%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#fbfcfd' }}>
                      {[
                        'Utility',
                        'Meter No',
                        'Check-In Readings',
                        'Check-Out Readings',
                        'Consumption',
                        'Unit',
                        'Charges',
                        'Status',
                        'Actions',
                      ].map((head) => (
                        <th
                          key={head}
                          style={{
                            color: pageText,
                            fontSize: 13,
                            fontWeight: 700,
                            padding: '12px 10px',
                            textAlign: 'left',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {utilityRows.map((row) => (
                      <tr key={`${row[0]}-${row[1]}`}>
                        <td
                          style={{
                            color: pageText,
                            fontSize: 13,
                            padding: '9px 10px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <IconifyIcon
                            icon="ri:checkbox-circle-line"
                            width={14}
                            height={14}
                            style={{ color: '#2f7ee6', marginRight: 6 }}
                          />
                          {row[0]}
                        </td>
                        {row.slice(1).map((value, index) => (
                          <td
                            key={`${row[0]}-${index}`}
                            style={{
                              color: pageText,
                              fontSize: 13,
                              padding: '9px 10px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {value}
                          </td>
                        ))}
                        <td style={{ padding: '9px 10px' }}>
                          <button
                            type="button"
                            style={{
                              background: 'transparent',
                              border: 0,
                              color: pageText,
                              padding: 0,
                              textDecoration: 'underline',
                              fontSize: 13,
                            }}
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

          {/* Meter & Bill Photos Card */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Meter &amp; Bill Photos</h5>
            <div style={{ padding: '26px 30px 50px' }}>
              <div className="d-flex gap-3 mb-3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
                {photos.map((photo) => (
                  <img
                    key={photo}
                    alt="Meter or bill"
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

              {recentIssues.map(([title, category, date, image]) => (
                <div key={title} className="d-flex align-items-center justify-content-between" style={{ padding: '22px 0', borderTop: '1px solid #eef1f4' }}>
                  <div className="d-flex align-items-center gap-3">
                    <img alt={title} src={image} style={{ height: 52, objectFit: 'cover', width: 52, borderRadius: 8 }} />
                    <div>
                      <p className="mb-1" style={{ color: pageText, fontSize: 15, fontWeight: 600 }}>{title}</p>
                      <p className="mb-0" style={{ color: pageText, fontSize: 14 }}>{category}</p>
                    </div>
                  </div>
                  <span style={{ color: pageText, fontSize: 14 }}>{date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div>
          {/* Utilities Overview */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Utilities Overview</h5>
              <button type="button" style={{ ...linkButtonStyle, paddingRight: 26 }}>
                View All
              </button>
            </div>
            <div style={{ padding: '26px 70px 28px' }}>
              {overviewItems.map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '210px 20px 1fr', minHeight: 45 }}>
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 16 }}>:</span>
                  <span style={{ color: pageText, fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Check-Out Reading Overview */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: '#fbfcfd' }}>
              <h5 style={titleStyle}>Check-Out Reading Overview</h5>
              <button type="button" style={{ ...linkButtonStyle, paddingRight: 26 }}>
                View All
              </button>
            </div>
            <div style={{ padding: '18px 58px 32px' }}>
              {readingOverview.map(([label, value, color, width]) => (
                <div
                  key={label}
                  style={{ alignItems: 'center', display: 'grid', gap: 18, gridTemplateColumns: '140px 1fr 70px', minHeight: 45 }}
                >
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ background: '#d7d7d7', borderRadius: 999, display: 'block', height: 7, overflow: 'hidden' }}>
                    <span style={{ background: color, borderRadius: 999, display: 'block', height: '100%', width: `${width}%` }} />
                  </span>
                  <span style={{ color: pageText, fontSize: 15, textAlign: 'right' }}>{value}</span>
                </div>
              ))}
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
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UtilityReadingsPage;