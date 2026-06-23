import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';
import { fmtDate, val } from '@/utils/checkInFormat';

const pageText = '#526b89';
const bodyText = '#303746';

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

const emptyTextStyle = { color: pageText, fontSize: 15, padding: '0 30px 24px' };

const STAT_FIELDS = [
  { key: 'totalDocuments', label: 'Total Documents', icon: 'solar:calendar-date-bold-duotone', color: '#6747ff', bg: '#eee7ff' },
  { key: 'uploadedDocuments', label: 'Uploaded Documents', icon: 'solar:gallery-check-bold-duotone', color: '#47c878', bg: '#e9f8ef' },
  { key: 'expiringSoon', label: 'Expiring Soon', icon: 'solar:user-plus-bold-duotone', color: '#ff8d3c', bg: '#fff0e8' },
  { key: 'missingDocuments', label: 'Missing Documents', icon: 'solar:chart-2-bold-duotone', color: '#36c8cf', bg: '#e8fbfb' },
];

const StatCard = ({ label, value, icon, color, bg }) => (
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
        <span style={{ color: pageText, fontSize: 15 }}>{label}</span>
      </div>
      <strong style={{ color: bodyText, fontSize: 26 }}>{value}</strong>
    </div>
    <span
      className="d-inline-flex align-items-center justify-content-center"
      style={{ background: bg, borderRadius: 5, color, height: 56, width: 56 }}
    >
      <IconifyIcon icon={icon} width={32} height={32} />
    </span>
  </div>
);

const DocumentsPage = ({ record }) => {
  const documentsTab = record?.documentsTab ?? {};
  const summary = documentsTab.summary ?? {};
  const allDocuments = documentsTab.allDocuments ?? [];
  const expiringSoon = documentsTab.expiringSoon ?? [];
  const missingDocuments = documentsTab.missingDocuments ?? [];
  const notes = documentsTab.notes;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#edf2f8', borderRadius: 8, marginBottom: 24, padding: '26px 25px' }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))' }}>
          {STAT_FIELDS.map((stat) => (
            <StatCard key={stat.key} {...stat} value={summary[stat.key] ?? 0} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(650px, 1.7fr) minmax(390px, 1fr)' }}>
        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>All Documents ({summary.totalDocuments ?? allDocuments.length})</h5>

            {allDocuments.length > 0 ? (
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
                    {allDocuments.map((doc, index) => (
                      <tr key={doc.id ?? index}>
                        <td style={{ color: pageText, fontSize: 15, padding: '14px 24px' }}>{index + 1}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '14px 24px' }}>{val(doc.name)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '14px 24px' }}>{val(doc.category)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '14px 24px' }}>{val(doc.linkedTo)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '14px 24px' }}>{val(doc.uploadedBy)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '14px 24px' }}>{fmtDate(doc.uploadedOn)}</td>
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
            ) : (
              <p style={emptyTextStyle}>No documents uploaded yet</p>
            )}
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Notes / Comments</h5>
            <div style={{ padding: '0 18px 20px' }}>
              <div style={{ background: '#fff7f7', border: '1px solid #f0cfd0', borderRadius: 8, padding: '16px 18px' }}>
                <p style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Notes</p>
                <div style={{ background: '#fff', borderRadius: 8, color: '#666', fontSize: 15, padding: '16px 22px' }}>
                  {notes || 'No notes added'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Expiring Soon</h5>
            {expiringSoon.length > 0 ? (
              <div style={{ padding: '22px 42px 18px' }}>
                {expiringSoon.map((item, index) => (
                  <div key={item.title ?? index} className="d-flex align-items-center justify-content-between gap-3 mb-4">
                    <div className="d-flex align-items-center gap-4">
                      <span
                        className="d-inline-flex align-items-center justify-content-center"
                        style={{ background: '#f2c155', borderRadius: '50%', color: '#fff', fontWeight: 800, height: 22, width: 22 }}
                      >
                        !
                      </span>
                      <div>
                        <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>
                          {val(item.title)}
                        </p>
                        <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>
                          {val(item.linkedTo)}
                        </p>
                      </div>
                    </div>
                    <span style={{ color: '#bd2d3a', fontSize: 15 }}>{val(item.expiry)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={emptyTextStyle}>Nothing expiring soon</p>
            )}
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Missing Documents</h5>
            {missingDocuments.length > 0 ? (
              <div style={{ padding: '22px 42px 22px' }}>
                {missingDocuments.map((item, index) => (
                  <div key={item.documentType ?? index} className="d-flex align-items-center gap-4 mb-4">
                    <IconifyIcon icon="ri:error-warning-fill" width={21} height={21} style={{ color: '#f04444' }} />
                    <div>
                      <p className="mb-1" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                        {val(item.documentType)}
                      </p>
                      <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>
                        {val(item.tenant)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={emptyTextStyle}>No missing documents</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
