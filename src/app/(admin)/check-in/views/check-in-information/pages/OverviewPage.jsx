import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';

const pageText = '#526b89';
const bodyText = '#202b3c';

const propertyInfoLeft = [
  ['Property Type', 'Apartment'],
  ['Building Name', 'Ocean View Apt'],
  ['Unit No', 'A401'],
  ['Floor', '4th Floor'],
  ['Area (Sq. Ft.)', '1250 Sq Ft'],
  ['Facing', 'North'],
  ['Year Built', '2020'],
];

const propertyInfoRight = [
  ['Bedrooms', '2'],
  ['Bathrooms', '2'],
  ['Balcony', '1'],
  ['Parking', '1 Covered'],
  ['Furnishing', 'Semi Furnished'],
  ['Pet Allowed', 'Yes'],
  ['Maintenance', 'Required'],
];

const rentItems = [
  ['Monthly Rent', '12500 OMR'],
  ['Security Deposit', '12500 OMR'],
  ['Maintenance Fee', '3500 OMR'],
  ['Late Fee Rule', '2500 OMR'],
  ['Payment Due Date', '5th Of Every Month'],
  ['Rent Increase Date', '01 January 2026'],
];

const timelineItems = [
  { label: 'Property Created', value: '118', color: '#b9d900' },
  { label: 'Listed For Rent', value: '111', color: '#44c4c8' },
  { label: 'Tenant Assigned', value: '89', color: '#f49a45' },
  { label: 'Assigned to Employee', value: '78', color: '#55bd7b' },
  { label: 'Property Occupied', value: '68', color: '#286be8' },
];

const landlordItems = [
  ['Landlord Name', 'Bilal Ahmed'],
  ['Contact Number', '+911 1234567890'],
  ['Email', 'bilalahmed@gmail.com'],
  ['Ownership Type', 'Individual'],
];

const features = [
  'CCTV Security',
  'Swimming Pool',
  '24/7 Security',
  'Covered Parking',
  'Gym',
  'Elevator',
  'Private Terrace',
  'Outdoor Deck',
];

const documents = ['Civil ID .pdf', 'Passport .pdf', 'SignedAgreement .pdf'];

const photos = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=320&q=80',
];

const cardStyle = {
  border: '1px solid #dfe5eb',
  borderRadius: 8,
  overflow: 'hidden',
};

const titleStyle = {
  color: pageText,
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
  padding: '26px 32px 17px',
};

const valueRowStyle = {
  alignItems: 'center',
  display: 'grid',
  gridTemplateColumns: '135px 16px 1fr',
  minHeight: 40,
};

const InfoRows = ({ items }) => (
  <div>
    {items.map(([label, value]) => (
      <div key={label} style={valueRowStyle}>
        <span style={{ color: bodyText, fontSize: 16 }}>{label}</span>
        <span style={{ color: bodyText, fontSize: 16 }}>:</span>
        <span style={{ color: bodyText, fontSize: 16 }}>{value}</span>
      </div>
    ))}
  </div>
);

const OverviewPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'grid',
          gap: 20,
          gridTemplateColumns: 'minmax(520px, 1.7fr) minmax(360px, 1fr) minmax(360px, 1.05fr)',
          overflowX: 'auto',
        }}
      >
        <div style={cardStyle}>
          <h5 style={titleStyle}>Property Information</h5>
          <div style={{ display: 'grid', gap: 36, gridTemplateColumns: '1fr 1fr', padding: '24px 32px 28px' }}>
            <InfoRows items={propertyInfoLeft} />
            <InfoRows items={propertyInfoRight} />
          </div>
        </div>

        <div style={cardStyle}>
          <h5 style={titleStyle}>Rent &amp; Charges</h5>
          <div style={{ padding: '18px 32px 28px' }}>
            <InfoRows items={rentItems} />
          </div>
        </div>

        <div style={cardStyle}>
          <h5 style={titleStyle}>Activity Timeline</h5>
          <div style={{ padding: '26px 36px 30px' }}>
            {timelineItems.map((item, index) => (
              <div
                key={item.label}
                style={{
                  alignItems: 'center',
                  display: 'grid',
                  gridTemplateColumns: '34px 1fr 40px',
                  minHeight: 50,
                  position: 'relative',
                }}
              >
                {index < timelineItems.length - 1 && (
                  <span
                    style={{
                      background: '#72c68e',
                      height: 50,
                      left: 9,
                      position: 'absolute',
                      top: 25,
                      width: 1,
                    }}
                  />
                )}
                <span
                  style={{
                    background: item.color,
                    borderRadius: '50%',
                    height: 20,
                    position: 'relative',
                    width: 20,
                    zIndex: 1,
                  }}
                />
                <span style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>{item.label}</span>
                <span style={{ color: item.color, fontSize: 16, fontWeight: 700, textAlign: 'right' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 20,
          gridTemplateColumns: 'minmax(310px, 1fr) minmax(310px, 1fr) minmax(380px, 1.05fr) minmax(330px, 0.95fr)',
          marginTop: 20,
          overflowX: 'auto',
        }}
      >
        <div style={cardStyle}>
          <h5 style={titleStyle}>Landlord Details</h5>
          <div style={{ padding: '28px 24px 28px' }}>
            <InfoRows items={landlordItems} />
          </div>
        </div>

        <div style={cardStyle}>
          <h5 style={titleStyle}>Property Features</h5>
          <div
            style={{
              display: 'grid',
              gap: '18px 34px',
              gridTemplateColumns: '1fr 1fr',
              padding: '28px 24px 34px',
            }}
          >
            {features.map((feature) => (
              <div key={feature} className="d-flex align-items-center gap-2">
                <IconifyIcon icon="ri:checkbox-circle-line" width={16} height={16} style={{ color: '#2f7ee6' }} />
                <span style={{ color: pageText, fontSize: 16 }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <div className="d-flex align-items-center justify-content-between">
            <h5 style={titleStyle}>Tenant Documents</h5>
            <button
              type="button"
              style={{
                background: 'transparent',
                border: 0,
                color: '#a7adb6',
                fontSize: 16,
                padding: '26px 24px 17px',
              }}
            >
              View All
            </button>
          </div>
          <div style={{ padding: '10px 18px 18px' }}>
            {documents.map((document) => (
              <div
                key={document}
                className="d-flex align-items-center justify-content-between gap-3"
                style={{ marginBottom: 14 }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{ border: '1px solid #cfd6de', borderRadius: 4, height: 36, width: 36 }}
                  >
                    <IconifyIcon icon="vscode-icons:file-type-pdf2" width={22} height={22} />
                  </span>
                  <div>
                    <p className="mb-1" style={{ color: bodyText, fontSize: 16, fontWeight: 500 }}>
                      {document}
                    </p>
                    <p className="mb-0" style={{ color: bodyText, fontSize: 14 }}>
                      Uploaded on 15 April 2026
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    className="d-inline-flex align-items-center justify-content-center p-0"
                    style={{ borderColor: '#c9ced5', borderRadius: 4, height: 36, width: 36 }}
                  >
                    <IconifyIcon icon="solar:eye-broken" width={18} height={18} />
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="d-inline-flex align-items-center justify-content-center p-0"
                    style={{ borderColor: '#c9ced5', borderRadius: 4, height: 36, width: 36 }}
                  >
                    <IconifyIcon icon="ri:download-line" width={18} height={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h5 style={titleStyle}>Photos</h5>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr', padding: '10px 24px 24px' }}>
            {photos.map((photo) => (
              <img
                key={photo}
                alt="Property"
                src={photo}
                style={{ aspectRatio: '1.65 / 1', borderRadius: 4, objectFit: 'cover', width: '100%' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
