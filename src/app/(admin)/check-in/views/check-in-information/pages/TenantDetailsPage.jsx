import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';

const pageText = '#526b89';
const bodyText = '#202b3c';

const personalInfo = [
  ['Tenant Type', 'Individual'],
  ['Date of Birth', '12 Aug 1990'],
  ['Gender', 'Male'],
  ['Civil ID', 'CVG-21-564'],
  ['Passport Number', '95615616115'],
  ['Nationality', 'Oman'],
  ['Marital Status', 'Married'],
];

const contactInfo = [
  ['Mobile Number', '+91 1234567890'],
  ['Alternate No', '+91 1234567890'],
  ['Email', 'bilalahmed@gmail.com'],
  ['Address', '1 88/11, South West\nBoag Road, T Beside\nMuscat Oman'],
  ['Emergency No', 'Ahmed Khan (Brother)\n+91 1234567890'],
];

const additionalInfo = [
  ['Profession', 'IT Consultants'],
  ['Monthly Rent', '12500 OMR'],
  ['Move-In Reason', 'Work'],
  ['Company Name', 'Tech Solutions LLC'],
  ['Security Deposit', '5000 OMR'],
  ['No. Of Occupants', '3'],
];

const documents = [
  ['Civil ID .pdf', 'Uploaded on 15 April 2026'],
  ['Passport .pdf', 'Uploaded on 15 April 2026'],
  ['SignedAgreement .pdf', 'Uploaded on 15 April 2026'],
  ['Profile Photo.Png', 'Uploaded on 10 April 2026'],
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
  padding: '26px 32px 18px',
};

const rowStyle = {
  alignItems: 'start',
  display: 'grid',
  gridTemplateColumns: '140px 16px 1fr',
  minHeight: 40,
};

const InfoRows = ({ items }) => (
  <div>
    {items.map(([label, value]) => (
      <div key={label} style={rowStyle}>
        <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
        <span style={{ color: pageText, fontSize: 16 }}>:</span>
        <span style={{ color: pageText, fontSize: 16, whiteSpace: 'pre-line' }}>{value}</span>
      </div>
    ))}
  </div>
);

const DocumentRow = ({ name, date }) => (
  <div className="d-flex align-items-center justify-content-between gap-3" style={{ marginBottom: 30 }}>
    <div className="d-flex align-items-center gap-4">
      <span
        className="d-inline-flex align-items-center justify-content-center"
        style={{ border: '1px solid #8d9299', borderRadius: 4, height: 50, width: 50 }}
      >
        <IconifyIcon icon="vscode-icons:file-type-pdf2" width={28} height={28} />
      </span>
      <div>
        <p className="mb-1" style={{ color: bodyText, fontSize: 17, fontWeight: 500 }}>
          {name}
        </p>
        <p className="mb-0" style={{ color: bodyText, fontSize: 14 }}>
          {date}
        </p>
      </div>
    </div>
    <div className="d-flex gap-3">
      <Button
        variant="outline-secondary"
        className="d-inline-flex align-items-center justify-content-center p-0"
        style={{ borderColor: '#c8cdd3', borderRadius: 4, height: 50, width: 50 }}
      >
        <IconifyIcon icon="solar:eye-broken" width={19} height={19} />
      </Button>
      <Button
        variant="outline-secondary"
        className="d-inline-flex align-items-center justify-content-center p-0"
        style={{ borderColor: '#c8cdd3', borderRadius: 4, height: 50, width: 50 }}
      >
        <IconifyIcon icon="ri:download-line" width={20} height={20} />
      </Button>
    </div>
  </div>
);

const TenantDetailsPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: 'minmax(620px, 1.7fr) minmax(430px, 1fr)',
          overflowX: 'auto',
        }}
      >
        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Tenant Details</h5>

            <div style={{ padding: '28px 55px 40px' }}>
              <div className="d-flex align-items-start gap-4 mb-4">
                <img
                  alt="Bilal Ahmed"
                  src="https://i.pravatar.cc/120?img=12"
                  style={{ borderRadius: '50%', height: 74, objectFit: 'cover', width: 74 }}
                />
                <div>
                  <div className="d-flex align-items-center gap-5 mb-3">
                    <h4 className="mb-0" style={{ color: pageText, fontSize: 23, fontWeight: 700 }}>
                      Bilal Ahmed
                    </h4>
                    <span style={{ color: pageText, fontSize: 15 }}>Active Tenant</span>
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-4 mb-2">
                    <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                      <IconifyIcon icon="ri:phone-fill" width={16} height={16} />
                      +911 1234567890
                    </span>
                    <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                      <IconifyIcon icon="logos:google-gmail" width={16} height={16} />
                      bilalahmed@gmail.com
                    </span>
                  </div>
                  <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                    <IconifyIcon icon="ri:user-location-line" width={16} height={16} />
                    TNT-1245-4698
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 70, gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <h6 className="mb-4" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                    Personal Information
                  </h6>
                  <InfoRows items={personalInfo} />
                </div>

                <div style={{ borderLeft: '1px solid #d6dce3', paddingLeft: 72 }}>
                  <h6 className="mb-4" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                    Contact &amp; Address
                  </h6>
                  <InfoRows items={contactInfo} />
                </div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Additional Information</h5>
            <div
              style={{
                display: 'grid',
                gap: '18px 34px',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '22px 24px 24px',
              }}
            >
              {additionalInfo.map(([label, value], index) => (
                <div
                  key={label}
                  style={{
                    ...rowStyle,
                    borderRight: index % 3 === 2 ? 0 : '1px solid #d6dce3',
                    gridTemplateColumns: '135px 16px 1fr',
                  }}
                >
                  <span style={{ color: '#5f6470', fontSize: 16 }}>{label}</span>
                  <span style={{ color: '#5f6470', fontSize: 16 }}>:</span>
                  <span style={{ color: '#5f6470', fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Documents</h5>
            <div style={{ padding: '30px 46px 26px' }}>
              {documents.map(([name, date]) => (
                <DocumentRow key={name} name={name} date={date} />
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Additional Notes</h5>
            <div style={{ padding: '20px 20px 20px' }}>
              <div
                style={{
                  background: '#fffaf3',
                  border: '1px solid #f3d8ad',
                  borderRadius: 8,
                  padding: '30px 22px',
                }}
              >
                <p className="mb-3" style={{ color: pageText, fontSize: 16, lineHeight: 1.45 }}>
                  Tenant has Signed All the required documents and has agreed to the terms and conditions.
                </p>
                <p className="mb-0" style={{ color: pageText, fontSize: 12 }}>
                  Added on 29 April 2026 by Ramesh Kumar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetailsPage;
