import { resolvePhotoSrc } from '@/utils/imageStorage';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { fmtDateTime, val, yesNo } from '@/utils/checkInFormat';

// Fixed, ordered steps the backend computes into keyHandoverTimeline — it only
// ever includes an entry once that step's date is actually set, so the
// canonical list here is what lets pending steps render (blue, no date).
const TIMELINE_STEPS = ['Key Booked', 'Key Prepared', 'Key Notified', 'Key Handed Over', 'Handover Completed'];

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
  padding: '22px 30px',
};

const emptyTextStyle = { color: pageText, fontSize: 15, padding: '0 30px 24px' };

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

const KeyHandoverPage = ({ record }) => {
  const keyHandover = record?.keyHandover ?? {};
  const info = keyHandover.keyHandoverInformation ?? {};
  const timeline = keyHandover.keyHandoverTimeline ?? [];
  const keyRows = keyHandover.keyDetails ?? [];
  const attachments = keyHandover.attachments ?? [];
  const tenantConfirmation = keyHandover.tenantConfirmation;
  const relatedInformation = keyHandover.relatedInformation ?? {};

  const infoLeft = [
    ['Key Handover Status', val(info.keyHandoverStatus), 'pill'],
    ['Key Number', val(info.keyNumber)],
    ['Key Type', val(info.keyType)],
    ['Key Available', yesNo(info.keyAvailable)],
    ['Key Booking Date', fmtDateTime(info.keyBookingDate)],
    ['Expected Handover Date', fmtDateTime(info.expectedHandoverDate)],
  ];

  const infoRight = [
    ['Key Handover Date', fmtDateTime(info.keyHandoverDate)],
    ['Handedover By', val(info.handoveredBy)],
    ['Received By (Tenant)', val(info.receivedByTenant)],
    ['Tenant Contact', val(info.tenantContact)],
    ['Confirmation Received', yesNo(info.confirmationReceived)],
    ['Handover Notes', val(info.handoverNotes)],
  ];

  const relatedInfo = [
    ['Check-In ID', val(relatedInformation.checkInCode), 'noto:spiral-calendar'],
    ['Property', val(relatedInformation.property), 'noto:house-with-garden'],
    ['Tenant', val(relatedInformation.tenant), 'noto:house'],
    ['Agreement No.', val(relatedInformation.agreementNumber), 'noto:money-bag'],
    ['Finance Status', val(relatedInformation.financeStatus), 'noto:spiral-notepad'],
    ['Check In Status', val(relatedInformation.checkInStatus), 'ri:checkbox-circle-fill'],
  ];

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
              {keyRows.length > 0 ? (
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
                        {keyRows.map((row, index) => (
                          <tr key={row.keyNumber ?? index}>
                            <td style={{ color: bodyText, fontSize: 15, padding: '10px 22px' }}>{index + 1}</td>
                            <td style={{ color: bodyText, fontSize: 15, padding: '10px 22px' }}>{val(row.keyNumber)}</td>
                            <td style={{ color: bodyText, fontSize: 15, padding: '10px 22px' }}>{val(row.keyType)}</td>
                            <td style={{ padding: '10px 22px' }}>
                              <span
                                style={{
                                  background: row.status === 'Pending' ? '#f0efff' : '#e9fae5',
                                  borderRadius: 5,
                                  color: row.status === 'Pending' ? '#17227d' : '#1c9646',
                                  display: 'inline-block',
                                  fontSize: 15,
                                  padding: '5px 10px',
                                }}
                              >
                                {val(row.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p style={emptyTextStyle}>No keys recorded</p>
              )}
            </div>

            <div style={cardStyle}>
              <h5 style={titleStyle}>Attachments</h5>
              {attachments.length > 0 ? (
                <div style={{ padding: '0 26px 12px' }}>
                  {attachments.map((attachment, index) => (
                    <div key={attachment.documentId ?? index} className="d-flex align-items-center justify-content-between gap-3 mb-3">
                      <div className="d-flex align-items-center gap-3">
                        {attachment.file && (
                          <img
                            alt={attachment.documentName ?? attachment.documentType}
                            src={resolvePhotoSrc(attachment.file)}
                            style={{ borderRadius: 4, height: 50, objectFit: 'cover', width: 50 }}
                          />
                        )}
                        <div>
                          <p className="mb-1" style={{ color: pageText, fontSize: 15 }}>
                            {val(attachment.documentName ?? attachment.documentType)}
                          </p>
                          <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>
                            {fmtDateTime(attachment.uploadedOn)}
                          </p>
                        </div>
                      </div>
                      {attachment.file && (
                        <a
                          href={resolvePhotoSrc(attachment.file)}
                          download
                          className="d-inline-flex align-items-center justify-content-center"
                          style={{ border: '1px solid #cfd7df', borderRadius: 5, color: pageText, height: 32, width: 32 }}
                        >
                          <IconifyIcon icon="ri:download-line" width={16} height={16} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={emptyTextStyle}>No attachments uploaded</p>
              )}
            </div>
          </div>

          <div className="mt-4" style={cardStyle}>
            <h5 style={titleStyle}>Tenant Confirmation</h5>
            <div style={{ padding: '0 18px 18px' }}>
              <div style={{ background: '#fff7f7', border: '1px solid #f0cfd0', borderRadius: 8, padding: '16px 18px' }}>
                <p style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Notes</p>
                <div style={{ background: '#fff', borderRadius: 8, color: '#666', fontSize: 15, padding: '16px 22px' }}>
                  {tenantConfirmation || 'No confirmation notes added'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Key Handover Timeline</h5>
            {(() => {
              const steps = TIMELINE_STEPS.map((stepEvent) => {
                const entry = timeline.find((e) => (e.event ?? e.title) === stepEvent);
                return { event: stepEvent, entry };
              });
              return (
              <div style={{ padding: '22px 32px 24px' }}>
                {steps.map(({ event, entry }, index) => {
                  const completed = Boolean(entry?.timestamp ?? entry?.date);
                  const dotColor = completed ? '#37b875' : '#05a9df';
                  return (
                  <div
                    key={event}
                    style={{
                      display: 'grid',
                      gap: 20,
                      gridTemplateColumns: '34px 1fr 170px',
                      minHeight: 76,
                      position: 'relative',
                    }}
                  >
                    {index < steps.length - 1 && (
                      <span style={{ background: '#64c986', height: 76, left: 15, position: 'absolute', top: 26, width: 1 }} />
                    )}
                    <span
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        background: dotColor,
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
                        {val(event)}
                      </p>
                      <p className="mb-0" style={{ color: bodyText, fontSize: 15 }}>
                        {val(entry?.description)}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="mb-2" style={{ color: bodyText, fontSize: 15 }}>
                        {completed ? fmtDateTime(entry.timestamp ?? entry.date) : ''}
                      </p>
                      <p className="mb-0" style={{ color: bodyText, fontSize: 15 }}>
                        {completed ? val(entry?.actor ?? entry?.by) : ''}
                      </p>
                    </div>
                  </div>
                  );
                })}
              </div>
              );
            })()}
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
