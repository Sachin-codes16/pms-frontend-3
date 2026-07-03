import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';
import { fmtDate, fmtDateTime, fmtMoney, val, yesNo } from '@/utils/checkInFormat';

const pageText = '#526b89';
const bodyText = '#202b3c';

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

const emptyTextStyle = { color: pageText, fontSize: 15, padding: '0 28px 24px' };

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

const AgreementPage = ({ record }) => {
  const agreement = record?.agreement ?? {};
  const details = agreement.agreementDetails ?? {};
  const timeline = agreement.agreementTimeline ?? [];
  const rentAndPaymentSummary = agreement.rentAndPaymentSummary ?? {};
  const payments = rentAndPaymentSummary.payments ?? [];
  const documents = agreement.agreementDocuments ?? [];
  const notes = agreement.agreementNotes;

  const agreementLeft = [
    ['Agreement Type', val(details.agreementType)],
    ['Agreement No', val(details.agreementNumber)],
    ['Agreement Status', val(details.agreementStatus)],
    ['Start Date', fmtDate(details.startDate)],
    ['End Date', fmtDate(details.endDate)],
    ['Duration', val(details.duration)],
    ['Rent (Monthly)', fmtMoney(details.rentMonthly)],
    ['Security Deposit', fmtMoney(details.securityDeposit)],
    ['Advance Rent', fmtMoney(details.advanceRent)],
    ['Maintenance Charges', fmtMoney(details.maintenanceCharges)],
  ];

  const agreementRight = [
    ['Agreement Template', val(details.agreementTemplate), 'pill'],
    ['Generated On', fmtDateTime(details.generatedOn)],
    ['Submitted to Tenant', fmtDateTime(details.submittedToTenantOn)],
    ['Tenant Signed On', fmtDateTime(details.tenantSignedOn)],
    ['Manager Signed On', fmtDateTime(details.managerSignedOn)],
    ['Agreement Expiry In', val(details.agreementExpiryIn), 'greenText'],
    ['Renewal Reminder', fmtDate(details.renewalReminderDate)],
    ['Auto Reminder', yesNo(details.autoReminderEnabled), details.autoReminderEnabled ? 'greenPill' : undefined],
  ];

  const summaryCards = [
    ['Monthly Rent', fmtMoney(rentAndPaymentSummary.monthlyRent), 'noto:house'],
    ['Security Deposit', fmtMoney(rentAndPaymentSummary.securityDeposit), 'noto:money-bag'],
    ['Advance Rent', fmtMoney(rentAndPaymentSummary.advanceRent), 'noto:money-with-wings'],
    ['Total Paid', fmtMoney(rentAndPaymentSummary.totalPaid), 'noto:receipt'],
  ];

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
          {timeline.length > 0 ? (
            <div style={{ padding: '22px 32px 24px' }}>
              {timeline.map((entry, index) => (
                <div
                  key={entry.event ?? index}
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
                      {val(entry.event ?? entry.title)}
                    </p>
                    <p className="mb-0" style={{ color: bodyText, fontSize: 15 }}>
                      {val(entry.description)}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="mb-2" style={{ color: bodyText, fontSize: 15 }}>
                      {fmtDateTime(entry.timestamp ?? entry.date)}
                    </p>
                    <p className="mb-0" style={{ color: bodyText, fontSize: 15 }}>
                      {val(entry.actor ?? entry.by)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={emptyTextStyle}>No timeline activity yet</p>
          )}
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

            {payments.length > 0 ? (
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
                    {payments.map((payment, index) => (
                      <tr key={payment.receiptNo ?? index}>
                        <td style={{ color: bodyText, fontSize: 16, padding: '10px 22px' }}>{val(payment.description)}</td>
                        <td style={{ color: bodyText, fontSize: 16, padding: '10px 22px' }}>{fmtMoney(payment.amount)}</td>
                        <td style={{ color: bodyText, fontSize: 16, padding: '10px 22px' }}>{val(payment.status)}</td>
                        <td style={{ color: bodyText, fontSize: 16, padding: '10px 22px' }}>{fmtDate(payment.paymentDate)}</td>
                        <td style={{ color: bodyText, fontSize: 16, padding: '10px 22px' }}>{val(payment.receiptNo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: pageText, fontSize: 15 }}>No payments recorded</p>
            )}

            <p style={{ color: '#6d96d5', fontSize: 17, fontWeight: 700, margin: '22px 0 0 22px' }}>
              Total Paid : <span style={{ marginLeft: 48 }}>{fmtMoney(rentAndPaymentSummary.totalPaid)}</span>
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
            {documents.length > 0 ? (
              <div style={{ border: '1px solid #e4e4e4', borderRadius: 8, padding: '15px 12px' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr>
                      {['Document Name', 'Uploaded On', 'Uploaded By'].map((head) => (
                        <th key={head} style={{ color: pageText, fontSize: 16, fontWeight: 700, padding: '0 8px 16px', textAlign: 'left' }}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, index) => (
                      <tr key={doc.name ?? index}>
                        <td style={{ color: bodyText, fontSize: 16, padding: '8px' }}>
                          <IconifyIcon icon="vscode-icons:file-type-pdf2" width={20} height={20} style={{ marginRight: 12 }} />
                          {val(doc.name)}
                        </td>
                        <td style={{ color: bodyText, fontSize: 16, padding: '8px' }}>{fmtDateTime(doc.uploadedOn)}</td>
                        <td style={{ color: bodyText, fontSize: 16, padding: '8px' }}>{val(doc.uploadedBy)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: pageText, fontSize: 15 }}>No documents uploaded</p>
            )}

            <div style={{ background: '#fff7f7', border: '1px solid #f0cfd0', borderRadius: 8, marginTop: 24, padding: '16px 14px' }}>
              <p style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Agreement Notes</p>
              <div style={{ background: '#fff', borderRadius: 8, color: '#666', fontSize: 15, padding: '18px 26px' }}>
                {notes || 'No notes added'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementPage;
