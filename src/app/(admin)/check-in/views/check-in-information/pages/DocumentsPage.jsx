import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';

const pageText = '#526b89';
const bodyText = '#303746';

const stats = [
  { label: 'Total Documents', value: '16', icon: 'solar:calendar-date-bold-duotone', color: '#6747ff', bg: '#eee7ff' },
  { label: 'Uploaded Documents', value: '12', badge: '+44%', icon: 'solar:gallery-check-bold-duotone', color: '#47c878', bg: '#e9f8ef' },
  { label: 'Expiring Soon', value: '2', icon: 'solar:user-plus-bold-duotone', color: '#ff8d3c', bg: '#fff0e8' },
  { label: 'Missing Documents', value: '3', icon: 'solar:chart-2-bold-duotone', color: '#36c8cf', bg: '#e8fbfb' },
];

const documents = [
  ['1', 'Agreement Doc.Pdf', 'Agreement', 'A-401, Ocean View', 'John D.', '24 May 2026'],
  ['2', 'ID Proof.Pdf', 'Tenant', 'Bilal Ahmed', 'Bilal Ahmed', '25 May 2026'],
  ['3', 'Company Seal.Pdf', 'Agreement', 'AJ Real Estate', 'John D.', '26 May 2026'],
  ['4', 'Rent Invoice.Pdf', 'Finance', 'May 2025 Rent', 'System', '27 May 2026'],
  ['5', 'NOC Certificate.Pdf', 'Compliance', 'A-401, Ocean View', 'Ramesh Kumar', '28 May 2026'],
  ['6', 'Property Photo.Png', 'Property', 'A-401, Ocean View', 'Mahesh Verma', '29 May 2026'],
  ['7', 'MoveInCheckList.Pdf', 'Inspection', 'CL-123-456', 'Ramesh Kumar', '30 May 2026'],
];

const expiringSoon = [
  ['NOC Certificate', 'A-401, Ocean View', 'Expires in 5 Days'],
  ['Insurance Document', 'A-401, Ocean View', 'Expires in 12 Days'],
  ['Agreement Doc', 'A-401, Ocean View', 'Expires in 13 Days'],
  ['Stamp Duty', 'A-401, Ocean View', 'Expires in 18 Days'],
];

const missingDocuments = [
  ['ID Proof', 'Bilal Ahmed'],
  ['Address Proof', 'Bilal Ahmed'],
  ['Police Clearance', 'Bilal Ahmed'],
  ['Agreement Signed', 'Bilal Ahmed'],
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

const DocumentsPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#edf2f8', borderRadius: 8, marginBottom: 24, padding: '26px 25px' }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))' }}>
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(650px, 1.7fr) minmax(390px, 1fr)' }}>
        <div>
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>All Documents (16)</h5>
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
                    {['#', 'Document Name', 'Category', 'Linked To', 'Uploaded By', 'Uploaded On', 'Actions'].map((head) => (
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
                  {documents.map((row) => (
                    <tr key={row[0]}>
                      {row.map((value) => (
                        <td key={`${row[0]}-${value}`} style={{ color: pageText, fontSize: 15, padding: '14px 24px' }}>
                          {value}
                        </td>
                      ))}
                      <td style={{ padding: '14px 24px' }}>
                        <Button
                          variant="link"
                          className="p-0 me-2"
                          style={{ background: '#f4f7fa', borderRadius: 5, color: pageText, height: 27, width: 27 }}
                        >
                          <IconifyIcon icon="solar:eye-broken" width={16} height={16} />
                        </Button>
                        <Button
                          variant="link"
                          className="p-0"
                          style={{ background: '#f4f7fa', borderRadius: 5, color: pageText, height: 27, width: 27 }}
                        >
                          <IconifyIcon icon="ri:download-line" width={16} height={16} />
                        </Button>
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
                <div style={{ background: '#fff', borderRadius: 8, color: '#666', fontSize: 15, padding: '16px 22px' }}>
                  I, Bilal Ahmed, hereby confirm that I have successfully handed over the documents to Admin, the tenant.
                  The handover has been completed in good condition, and all necessary formalities have been fulfilled.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>Expiring Soon</h5>
              <button type="button" style={{ background: 'transparent', border: 0, color: '#1f7ee8', fontSize: 16, paddingRight: 26 }}>
                View All
              </button>
            </div>
            <div style={{ padding: '22px 42px 18px' }}>
              {expiringSoon.map(([title, linkedTo, expiry]) => (
                <div key={title} className="d-flex align-items-center justify-content-between gap-3 mb-4">
                  <div className="d-flex align-items-center gap-4">
                    <span
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{ background: '#f2c155', borderRadius: '50%', color: '#fff', fontWeight: 800, height: 22, width: 22 }}
                    >
                      !
                    </span>
                    <div>
                      <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>
                        {title}
                      </p>
                      <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>
                        {linkedTo}
                      </p>
                    </div>
                  </div>
                  <span style={{ color: '#bd2d3a', fontSize: 15 }}>{expiry}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>Missing DOcuments</h5>
              <button type="button" style={{ background: 'transparent', border: 0, color: '#1f7ee8', fontSize: 16, paddingRight: 26 }}>
                View All
              </button>
            </div>
            <div style={{ padding: '22px 42px 22px' }}>
              {missingDocuments.map(([title, person]) => (
                <div key={title} className="d-flex align-items-center gap-4 mb-4">
                  <IconifyIcon icon="ri:error-warning-fill" width={21} height={21} style={{ color: '#f04444' }} />
                  <div>
                    <p className="mb-1" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                      {title}
                    </p>
                    <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>
                      {person}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
