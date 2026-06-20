import property2 from '@/assets/images/properties/p-2.jpg';
import property3 from '@/assets/images/properties/p-3.jpg';
import property4 from '@/assets/images/properties/p-4.jpg';
import property5 from '@/assets/images/properties/p-5.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const pageText = '#526b89';
const bodyText = '#202b3c';

const infoLeft = [
  ['Key Handover Status', 'Completed', 'pill'],
  ['Key Number', 'KH-1321-5648'],
  ['Key Type', 'Main Door Key'],
  ['Key Available', 'Yes'],
  ['Key Booking Date', '28 May 2026, 03:00 PM'],
  ['Expected Handover Date', '28 May 2026, 05:00 PM'],
];

const infoRight = [
  ['Key Handover Date', '29 May 2026, 04:30 AM'],
  ['Handedover By', 'Ramesh Kumar'],
  ['Received By (Tenant)', 'Bilal Ahmed'],
  ['Tenant Contact', '+965 5555 1234'],
  ['Confirmation Received', 'Yes'],
  ['Handover Notes', 'All Keys Handed over and\nverified'],
];

const timeline = [
  ['Key Booked', 'Key Booked For Unit-A', '25 May 2025, 11:10 AM', 'John D.'],
  ['Key Prepared', 'Key Retrieved from store', '26 May 2025, 11:16 AM', 'Ramesh Kumar'],
  ['Key Notified', 'Tenant notified for key handover', '27 May 2025, 11:18 AM', 'Ramesh Kumar'],
  ['Key Handed Over', 'Key handed over to tenant', '28 May 2025, 11:20 AM', 'Bilal Ahmed'],
  ['Handover Completed', 'Tenant confirmed key receipt', '29 May 2025, 11:25 AM', 'Bilal Ahmed'],
];

const keyRows = [
  ['1', 'KH-1234-5671', 'Main Door Key', 'Handovered'],
  ['2', 'KH-1234-5672', 'Mail Box Key', 'Handovered'],
  ['4', 'KH-1234-5673', 'Utility Room Key', 'Handovered'],
  ['5', 'KH-1234-5674', 'Basement Parking Key', 'Pending'],
  ['6', 'KH-1234-5675', 'Terrace Key', 'Handovered'],
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

const KeyHandoverPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(640px, 1.7fr) minmax(430px, 1fr)' }}>
        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Key Handover Information</h5>
            <div style={{ display: 'grid', gap: 28, gridTemplateColumns: '1fr 1fr', padding: '22px 52px 18px' }}>
              <div style={{ borderRight: '1px solid #d7dce2', paddingRight: 28 }}>
                <DetailRows items={infoLeft} />
              </div>
              <DetailRows items={infoRight} />
            </div>
          </div>

          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.25fr 0.95fr' }}>
            <div style={cardStyle}>
              <h5 style={titleStyle}>Key Details</h5>
              <div style={{ padding: '0 14px 12px' }}>
                <div style={{ border: '1px solid #e4e8ed', borderRadius: 8, overflow: 'hidden' }}>
                  <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                      <tr style={{ background: '#fbfcfd' }}>
                        {['#', 'Key Number', 'Key Type', 'Key Status'].map((head) => (
                          <th key={head} style={{ color: pageText, fontSize: 16, fontWeight: 700, padding: '16px 22px', textAlign: 'left' }}>
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {keyRows.map(([no, number, type, status]) => (
                        <tr key={number}>
                          {[no, number, type].map((value) => (
                            <td key={`${number}-${value}`} style={{ color: bodyText, fontSize: 15, padding: '10px 22px' }}>
                              {value}
                            </td>
                          ))}
                          <td style={{ padding: '10px 22px' }}>
                            <span
                              style={{
                                background: status === 'Pending' ? '#f0efff' : '#e9fae5',
                                borderRadius: 5,
                                color: status === 'Pending' ? '#17227d' : '#1c9646',
                                display: 'inline-block',
                                fontSize: 15,
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

            <div style={cardStyle}>
              <h5 style={titleStyle}>Attachments</h5>
              <div style={{ padding: '0 26px 12px' }}>
                {attachments.map(([name, date, image]) => (
                  <div key={name} className="d-flex align-items-center justify-content-between gap-3 mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <img alt={name} src={image} style={{ borderRadius: 4, height: 50, objectFit: 'cover', width: 50 }} />
                      <div>
                        <p className="mb-1" style={{ color: pageText, fontSize: 15 }}>
                          {name}
                        </p>
                        <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>
                          {date}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{ background: '#fff', border: '1px solid #d7dce2', borderRadius: 9, height: 40, width: 40 }}
                    >
                      <IconifyIcon icon="ri:download-line" width={20} height={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4" style={cardStyle}>
            <h5 style={titleStyle}>Tenant Confirmation</h5>
            <div style={{ padding: '0 18px 18px' }}>
              <div style={{ background: '#fff7f7', border: '1px solid #f0cfd0', borderRadius: 8, padding: '16px 18px' }}>
                <p style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Notes</p>
                <div style={{ background: '#fff', borderRadius: 8, color: '#666', fontSize: 15, padding: '16px 22px' }}>
                  I, Ahmed, hereby confirm that I have successfully handed over the keys of the premises to Bilal Ahmed,
                  the tenant. The handover has been completed in good condition, and all necessary formalities have
                  been fulfilled.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Key Handover Timeline</h5>
            <div style={{ padding: '22px 32px 24px' }}>
              {timeline.map(([title, description, date, by], index) => (
                <div
                  key={title}
                  style={{
                    display: 'grid',
                    gap: 20,
                    gridTemplateColumns: '34px 1fr 170px',
                    minHeight: 76,
                    position: 'relative',
                  }}
                >
                  {index < timeline.length - 1 && (
                    <span style={{ background: '#64c986', height: 76, left: 15, position: 'absolute', top: 26, width: 1 }} />
                  )}
                  <span
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{
                      background: index === timeline.length - 1 ? '#05a9df' : '#37b875',
                      borderRadius: '50%',
                      color: '#fff',
                      height: 30,
                      position: 'relative',
                      width: 30,
                      zIndex: 1,
                    }}
                  >
                    <IconifyIcon icon="ri:check-line" width={20} height={20} />
                  </span>
                  <div>
                    <p className="mb-2" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                      {title}
                    </p>
                    <p className="mb-0" style={{ color: bodyText, fontSize: 15 }}>
                      {description}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="mb-2" style={{ color: bodyText, fontSize: 15 }}>
                      {date}
                    </p>
                    <p className="mb-0" style={{ color: bodyText, fontSize: 15 }}>
                      {by}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

export default KeyHandoverPage;
