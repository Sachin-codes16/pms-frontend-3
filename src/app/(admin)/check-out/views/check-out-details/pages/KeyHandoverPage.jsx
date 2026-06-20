import property2 from '@/assets/images/properties/p-2.jpg';
import property3 from '@/assets/images/properties/p-3.jpg';
import property4 from '@/assets/images/properties/p-4.jpg';
import property5 from '@/assets/images/properties/p-5.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const pageText = '#526b89';
const bodyText = '#202b3c';

const infoLeft = [
  ['Key Returned Status', 'Completed', 'pill'],
  ['Key Number', 'KH-1321-5648'],
  ['Key Type', 'Main Door Key'],
  ['Key Available', 'Yes'],
  ['Key Booking Date', '28 May 2026, 03:00 PM'],
  ['Expected Returning Date', '28 May 2026, 05:00 PM'],
];

const infoRight = [
  ['Key Return Date', '29 May 2026, 04:30 AM'],
  ['Total Keys', '8'],
  ['Tenant Name', 'Bilal Ahmed'],
  ['Tenant Contact', '+965 5555 1234'],
  ['Confirmation Received', 'Yes'],
  ['Notes', 'All Keys Handed over and\nverified'],
];

const keyReturnInfo = [
  ['Tenant Name', 'Bilal Ahmed'],
  ['Unit No', 'A-401'],
  ['Check Out Date', '29  May 2026'],
  ['Move Out Date', '29  May 2026'],
  ['Total Key Issued', '8'],
  ['Keys Returned', '5'],
  ['Keys Pending', '3'],
  ['Status', 'Pending'],
];

const keyRows = [
  ['1', 'KH-1234-5671', 'Main Door Key', 'Returned'],
  ['2', 'KH-1234-5672', 'Mail Box Key', 'Returned'],
  ['4', 'KH-1234-5673', 'Utility Room Key', 'Returned'],
  ['5', 'KH-1234-5674', 'Basement Parking Key', 'Pending'],
  ['6', 'KH-1234-5675', 'Terrace Key', 'Returned'],
];

const attachments = [
  ['Key Handover Photo.jpg', '26 May 2026, 11:30 AM', property2],
  ['Tenant ID Copy.Png', '27 May 2026, 11:30 AM', property3],
  ['Key Receipt.Png', '28 May 2026, 11:30 AM', property4],
  ['Main Door Key.Png', '29 May 2026, 11:30 AM', property5],
];

const relatedInfo = [
  ['Check-In ID', 'CL-1234-4567', 'noto:spiral-calendar'],
  ['Property', 'A-401 Ocean View', 'noto:house-with-garden'],
  ['Tenant', 'Bilal Ahmed', 'noto:house'],
  ['Agreement No.', 'AGR-123-456', 'noto:money-bag'],
  ['Finance Status', 'Completed', 'noto:spiral-notepad'],
  ['Check In Status', 'Completed', 'ri:checkbox-circle-fill'],
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

const DetailRows = ({ items }) => (
  <div>
    {items.map(([label, value, type]) => (
      <div key={label} style={{ display: 'grid', gridTemplateColumns: '210px 18px 1fr', minHeight: 40 }}>
        <span style={{ color: bodyText, fontSize: 16 }}>{label}</span>
        <span style={{ color: bodyText, fontSize: 16 }}>:</span>
        {type === 'pill' ? (
          <span
            style={{
              background: '#e9fae5',
              borderRadius: 9,
              color: '#238f27',
              display: 'inline-block',
              fontSize: 16,
              height: 30,
              lineHeight: '30px',
              textAlign: 'center',
              width: 110,
            }}
          >
            {value}
          </span>
        ) : (
          <span style={{ color: bodyText, fontSize: 16, whiteSpace: 'pre-line' }}>{value}</span>
        )}
      </div>
    ))}
  </div>
);

const KeyReturnPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(640px, 1.7fr) minmax(430px, 1fr)' }}>

        {/* ── Left Column ── */}
        <div>
          {/* Key Return Information - 2 column info */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Key Return Information</h5>
            <div style={{ display: 'grid', gap: 28, gridTemplateColumns: '1fr 1fr', padding: '22px 52px 18px' }}>
              <div style={{ borderRight: '1px solid #d7dce2', paddingRight: 28 }}>
                <DetailRows items={infoLeft} />
              </div>
              <DetailRows items={infoRight} />
            </div>
          </div>

          {/* Key Details + Key Return Photos side by side */}
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.25fr 0.95fr', alignItems: 'stretch' }}>
            {/* Key Details table */}
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
              <h5 style={titleStyle}>Key Details</h5>
              <div style={{ padding: '0 14px 12px', flex: 1 }}>
                <div style={{ border: '1px solid #e4e8ed', borderRadius: 8, overflow: 'hidden' }}>
                  <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                      <tr style={{ background: '#fbfcfd' }}>
                        {['#', 'Key Number', 'Key Type', 'Key Status'].map((head) => (
                          <th key={head} style={{ color: pageText, fontSize: 15, fontWeight: 700, padding: '14px 16px', textAlign: 'left' }}>
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {keyRows.map(([no, number, type, status]) => (
                        <tr key={number}>
                          {[no, number, type].map((value) => (
                            <td key={`${number}-${value}`} style={{ color: bodyText, fontSize: 15, padding: '12px 16px' }}>
                              {value}
                            </td>
                          ))}
                          <td style={{ padding: '12px 16px' }}>
                            <span
                              style={{
                                background: status === 'Pending' ? '#f0efff' : '#e9fae5',
                                borderRadius: 5,
                                color: status === 'Pending' ? '#17227d' : '#1c9646',
                                display: 'inline-block',
                                fontSize: 14,
                                padding: '5px 10px',
                              }}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Key Return Photos */}
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
              <h5 style={titleStyle}>Key Return Photos</h5>
              <div style={{ padding: '0 26px 20px', flex: 1 }}>
                {attachments.map(([name, date, image]) => (
                  <div key={name} className="d-flex align-items-center justify-content-between gap-3" style={{ padding: '14px 0', borderBottom: '1px solid #eef1f4' }}>
                    <div className="d-flex align-items-center gap-3">
                      <img alt={name} src={image} style={{ borderRadius: 4, height: 50, objectFit: 'cover', width: 50 }} />
                      <div>
                        <p className="mb-1" style={{ color: pageText, fontSize: 15 }}>{name}</p>
                        <p className="mb-0" style={{ color: pageText, fontSize: 14 }}>{date}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{ background: '#fff', border: '1px solid #d7dce2', borderRadius: 9, height: 40, width: 40, flexShrink: 0 }}
                    >
                      <IconifyIcon icon="ri:download-line" width={20} height={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tenant Confirmation */}
          <div className="mt-4" style={cardStyle}>
            <h5 style={titleStyle}>Tenant Confirmation</h5>
            <div style={{ padding: '0 18px 18px' }}>
              <div style={{ background: '#fff7f7', border: '1px solid #f0cfd0', borderRadius: 8, padding: '16px 18px' }}>
                <p style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Notes</p>
                <div style={{ background: '#fff', borderRadius: 8, color: '#666', fontSize: 15, padding: '16px 22px' }}>
                  I hereby confirm that I have returned all the keys of the premises to Mr. Ramesh Kumar. The key handover was completed
                  successfully, and all keys were returned in proper condition without any issues.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div>
          {/* Key Return Information - right side summary */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Key Return Information</h5>
            <div style={{ padding: '22px 36px 28px' }}>
              {keyReturnInfo.map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '180px 18px 1fr', minHeight: 40 }}>
                  <span style={{ color: bodyText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: bodyText, fontSize: 16 }}>:</span>
                  <span style={{ color: bodyText, fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Information */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Related Information</h5>
            <div style={{ padding: '24px 36px 30px' }}>
              {relatedInfo.map(([label, value, icon]) => (
                <div
                  key={label}
                  className="d-flex align-items-center justify-content-between gap-3"
                  style={{ borderBottom: '1px solid #d7dce2', padding: '12px 0' }}
                >
                  <span className="d-inline-flex align-items-center gap-3" style={{ color: pageText, fontSize: 16 }}>
                    <IconifyIcon icon={icon} width={26} height={26} />
                    {label}
                  </span>
                  <strong style={{ color: '#28548e', fontSize: 16 }}>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default KeyReturnPage;