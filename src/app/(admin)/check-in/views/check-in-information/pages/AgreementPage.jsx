import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';

const pageText = '#526b89';
const bodyText = '#202b3c';

const agreementLeft = [
  ['Agreement Type', 'Internal Agreement', 'pill'],
  ['Agreement No', 'AGR-2050-0098'],
  ['Agreement Status', 'Signed'],
  ['Start Date', '01 July 2025'],
  ['End Date', '31 July 2026'],
  ['Duration', '12 Months'],
  ['Rent (Monthly)', '1250 OMR'],
  ['Security Deposit', '550 OMR'],
  ['Advance Rent', '1500 OMR'],
  ['Maintenance Charges', '150 OMR'],
];

const agreementRight = [
  ['Agreement Template', 'Standard Residential', 'pill'],
  ['Generated On', '25 May 2025 : 11:15 AM'],
  ['Submitted to Tenant', '25 May 2025 : 11:15 AM'],
  ['Tenant Signed On', '25 May 2025 : 11:15 AM'],
  ['Manager Signed On', '25 May 2025 : 11:15 AM'],
  ['Agreement Expiry In', '11 Months 2 Days', 'greenText'],
  ['Renewal Reminder', '01 May 2026'],
  ['Auto Reminder', 'Enabled', 'greenPill'],
];

const timeline = [
  ['Agreement Generated', 'AGR-1234567 Generated', '29 May 2025, 11:10 AM', 'John D.'],
  ['Submitted To Tenant', 'Agreement sent to Bilal Ahmed', '29 May 2025, 11:16 AM', 'John D.'],
  ['Tenant Signed', 'Tenant Signed the Agreement', '29 May 2025, 11:18 AM', 'Bilal Ahmed'],
  ['Company Signed', 'Manager Signed the Agreement', '29 May 2025, 11:20 AM', 'Mahesh Verma'],
  ['Agreement Completed', 'Agreement Process Completed', '29 May 2025, 11:25 AM', 'System'],
];

const summaryCards = [
  ['Monthly Rent', '1250 OMR', 'noto:house'],
  ['Security Deposit', '5500 OMR', 'noto:money-bag'],
  ['Advance Rent', '1500 OMR', 'noto:money-with-wings'],
  ['Total Paid', '3550 OMR', 'noto:receipt'],
];

const paymentRows = [
  ['Security Deposit', '1500 OMR', 'Paid', '27 May 2025', 'RC-1256-3456'],
  ['Advance Rent', '5500 OMR', 'Paid', '28 May 2025', 'RC-1256-3457'],
  ['First Month Rent', '1250 OMR', 'Paid', '29 May 2025', 'RC-1256-3458'],
  ['Maintenance Charges', '250 OMR', 'Paid', '30 May 2025', 'RC-1256-3459'],
];

const documentRows = [
  ['Agreement Doc .pdf', '29 May 2025, 11:20 AM', 'John D.', 'vscode-icons:file-type-pdf2'],
  ['Tenant ID Proof.pdf', '29 May 2025, 11:20 AM', 'Bilal Ahmed', 'vscode-icons:file-type-pdf2'],
  ['Company Seal.png', '29 May 2025, 11:20 AM', 'vscode-icons:file-type-image', 'John D.'],
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
  padding: '22px 28px',
};

const DetailRows = ({ items }) => (
  <div>
    {items.map(([label, value, type]) => (
      <div key={label} style={{ display: 'grid', gridTemplateColumns: '190px 20px 1fr', minHeight: 40 }}>
        <span style={{ color: bodyText, fontSize: 16 }}>{label}</span>
        <span style={{ color: bodyText, fontSize: 16 }}>:</span>
        {type === 'pill' || type === 'greenPill' ? (
          <span
            style={{
              background: type === 'greenPill' ? '#4daf72' : '#efeaff',
              borderRadius: 9,
              color: type === 'greenPill' ? '#fff' : '#26549a',
              display: 'inline-block',
              fontSize: 16,
              height: 30,
              lineHeight: '30px',
              minWidth: type === 'greenPill' ? 92 : 150,
              textAlign: 'center',
              width: 'fit-content',
            }}
          >
            {value}
          </span>
        ) : (
          <span style={{ color: type === 'greenText' ? '#35b36b' : bodyText, fontSize: 16 }}>{value}</span>
        )}
      </div>
    ))}
  </div>
);

const AgreementPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(640px, 1.7fr) minmax(430px, 1fr)' }}>
        <div style={cardStyle}>
          <h5 style={titleStyle}>Agreement Details</h5>
          <div style={{ display: 'grid', gap: 52, gridTemplateColumns: '1fr 1fr', padding: '26px 52px 20px' }}>
            <DetailRows items={agreementLeft} />
            <DetailRows items={agreementRight} />
          </div>
        </div>

        <div style={cardStyle}>
          <h5 style={titleStyle}>Agreement Timeline</h5>
          <div style={{ padding: '22px 32px 24px' }}>
            {timeline.map(([title, description, date, by], index) => (
              <div
                key={title}
                style={{
                  display: 'grid',
                  gap: 20,
                  gridTemplateColumns: '34px 1fr 180px',
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
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(600px, 1.2fr) minmax(470px, 0.95fr)', marginTop: 24 }}>
        <div style={cardStyle}>
          <h5 style={titleStyle}>Rent &amp; Payment Summary</h5>
          <div style={{ padding: '2px 16px 24px' }}>
            <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(4, minmax(160px, 1fr))', marginBottom: 24 }}>
              {summaryCards.map(([label, value, icon]) => (
                <div key={label} className="d-flex align-items-center gap-3" style={{ background: '#f0eefb', borderRadius: 6, padding: '18px 16px' }}>
                  <span className="d-inline-flex align-items-center justify-content-center" style={{ background: '#fff', borderRadius: 5, height: 35, width: 35 }}>
                    <IconifyIcon icon={icon} width={24} height={24} />
                  </span>
                  <div>
                    <p className="mb-1" style={{ color: bodyText, fontSize: 16 }}>
                      {label}
                    </p>
                    <p className="mb-0" style={{ color: '#000', fontSize: 18, fontWeight: 800 }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ border: '1px solid #e4e4e4', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    {['Description', 'Amount (OMR)', 'Status', 'Payment Date', 'Receipt / Ref No.'].map((head) => (
                      <th key={head} style={{ color: pageText, fontSize: 16, fontWeight: 700, padding: '16px 22px', textAlign: 'left' }}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paymentRows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((value) => (
                        <td key={`${row[0]}-${value}`} style={{ color: bodyText, fontSize: 16, padding: '10px 22px' }}>
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ color: '#6d96d5', fontSize: 17, fontWeight: 700, margin: '22px 0 0 22px' }}>
              Total Paid : <span style={{ marginLeft: 48 }}>7500 OMR</span>
            </p>
          </div>
        </div>

        <div style={cardStyle}>
          <div className="d-flex align-items-center justify-content-between">
            <h5 style={titleStyle}>Agreement Documents</h5>
            <Button variant="outline-secondary" style={{ borderColor: '#b8bec6', borderRadius: 8, color: pageText, marginRight: 24 }}>
              Upload Documents
            </Button>
          </div>

          <div style={{ padding: '16px 16px 24px' }}>
            <div style={{ border: '1px solid #e4e4e4', borderRadius: 8, padding: '15px 12px' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    {['Document Name', 'Uploaded On', 'Uploaded By', 'Actions'].map((head) => (
                      <th key={head} style={{ color: pageText, fontSize: 16, fontWeight: 700, padding: '0 8px 16px', textAlign: 'left' }}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {documentRows.map(([name, uploadedOn, uploadedBy, icon]) => (
                    <tr key={name}>
                      <td style={{ color: bodyText, fontSize: 16, padding: '8px' }}>
                        <IconifyIcon icon={icon} width={20} height={20} style={{ marginRight: 12 }} />
                        {name}
                      </td>
                      <td style={{ color: bodyText, fontSize: 16, padding: '8px' }}>{uploadedOn}</td>
                      <td style={{ color: bodyText, fontSize: 16, padding: '8px' }}>{uploadedBy}</td>
                      <td style={{ padding: '8px' }}>
                        <span style={{ border: '1px solid #cbd0d6', borderRadius: 4, display: 'inline-block', height: 21, marginRight: 8, width: 27 }} />
                        <span style={{ border: '1px solid #cbd0d6', borderRadius: 4, display: 'inline-block', height: 21, width: 27 }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: '#fff7f7', border: '1px solid #f0cfd0', borderRadius: 8, marginTop: 24, padding: '16px 14px' }}>
              <p style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Agreement Notes</p>
              <div style={{ background: '#fff', borderRadius: 8, color: '#666', fontSize: 15, padding: '18px 26px' }}>
                Standard internal residential lease agreement signed by both tenant &amp; company
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementPage;
