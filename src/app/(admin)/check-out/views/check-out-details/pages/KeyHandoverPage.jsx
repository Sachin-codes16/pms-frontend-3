import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { resolvePhotoSrc } from '@/utils/imageStorage';
import { fmtDate, fmtDateTime, val, yesNo } from '@/utils/checkInFormat';

const pageText = '#526b89';
const bodyText  = '#202b3c';

const cardStyle  = { border: '1px solid #cfd7df', borderRadius: 8, overflow: 'hidden' };
const titleStyle = { color: pageText, fontSize: 16, fontWeight: 700, margin: 0, padding: '22px 30px' };

const STAT_ICONS_BG  = ['#eee7ff','#e9f8ef','#fff0e8','#fde8e8'];
const STAT_COLORS    = ['#6747ff','#47c878','#ff8d3c','#f04444'];

const StatCard = ({ label, value, color, bg }) => (
  <div style={{
    alignItems: 'center', background: '#fff', borderRadius: 5,
    boxShadow: '0 8px 18px rgba(15,23,42,0.08)', display: 'flex',
    justifyContent: 'space-between', minHeight: 98, padding: '20px',
  }}>
    <div>
      <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>{label}</p>
      <strong style={{ color: bodyText, fontSize: 26 }}>{value}</strong>
    </div>
    <span style={{ background: bg, borderRadius: 5, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, height: 56, width: 56 }}>
      🔑
    </span>
  </div>
);

const DetailRows = ({ items }) => (
  <div>
    {items.map(([label, value, type]) => (
      <div key={label} style={{ display: 'grid', gridTemplateColumns: '210px 18px minmax(0, 1fr)', minHeight: 40 }}>
        <span style={{ color: bodyText, fontSize: 16 }}>{label}</span>
        <span style={{ color: bodyText, fontSize: 16 }}>:</span>
        {type === 'pill' ? (
          <span style={{ background: '#e9fae5', borderRadius: 9, color: '#238f27', display: 'inline-block', fontSize: 16, height: 30, lineHeight: '30px', textAlign: 'center', width: 110 }}>
            {value}
          </span>
        ) : (
          <span style={{ color: bodyText, fontSize: 16, whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>{value || '—'}</span>
        )}
      </div>
    ))}
  </div>
);

const KeyHandoverPage = ({ record }) => {
  const kr      = record?.keyReturn ?? {};
  const cards   = kr.summaryCards ?? {};
  const info    = kr.keyReturnInformation ?? {};
  const summary = kr.keyReturnSummary ?? {};
  const related = kr.relatedInformation ?? {};
  const keyDetails = kr.keyDetails ?? [];
  const photos  = kr.keyReturnPhotos ?? [];
  const tenantConfirmation = record?.tenantRemarks ?? kr.tenantConfirmation ?? '';

  const statCards = [
    { label: 'Total Keys Issued',    value: cards.totalKeysIssued    ?? 0 },
    { label: 'Total Keys Returned',  value: cards.totalKeysReturned  ?? 0 },
    { label: 'Pending Keys',         value: cards.pendingKeys        ?? 0 },
    { label: 'Lost/Unreturned Keys', value: cards.lostUnreturnedKeys ?? 0 },
  ];

  const infoLeft = [
    ['Key Returned Status',   val(info.keyReturnStatus),                  info.keyReturnStatus === 'Returned' ? 'pill' : undefined],
    ['Key Number',            val(info.keyNumber ?? record?.keyNumber)],
    ['Key Type',              val(record?.keyType)],
    ['Key Available',         yesNo(record?.keyAvailable)],
    ['Key Booking Date',      fmtDateTime(info.keyBookingDate)],
    ['Expected Return Date',  fmtDateTime(info.expectedReturnDate ?? record?.expectedReturnDate)],
  ];

  const infoRight = [
    ['Key Return Date',       fmtDateTime(info.keyReturnDate ?? record?.keyReturnDate)],
    ['Total Keys',            val(info.totalKeys)],
    ['Tenant Name',           val(info.tenantName)],
    ['Tenant Contact',        val(info.tenantContact)],
    ['Confirmation Received', yesNo(info.confirmationReceived ?? record?.confirmationReceived)],
    ['Received By',           val(info.receivedBy)],
  ];

  const summaryRows = [
    ['Tenant Name',      val(summary.tenantName)],
    ['Unit No',          val(summary.unitNo)],
    ['Check Out Date',   fmtDate(summary.checkOutDate)],
    ['Total Key Issued', String(summary.totalKeyIssued ?? 0)],
    ['Keys Returned',    String(summary.keysReturned ?? 0)],
    ['Keys Pending',     String(summary.keysPending ?? 0)],
    ['Status',           val(summary.status)],
  ];

  const relatedRows = [
    ['Check-Out Code', val(related.checkOutCode),    'noto:spiral-calendar'],
    ['Property',       val(related.property),         'noto:house-with-garden'],
    ['Tenant',         val(related.tenant),           'noto:house'],
    ['Finance Status', val(related.financeStatus),    'noto:spiral-notepad'],
    ['Check-Out Status', val(related.checkOutStatus), 'ri:checkbox-circle-fill'],
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Stat cards */}
      <div style={{ background: '#edf2f8', borderRadius: 8, marginBottom: 24, padding: '26px 25px' }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))' }}>
          {statCards.map((s, i) => (
            <StatCard key={s.label} label={s.label} value={s.value} color={STAT_COLORS[i]} bg={STAT_ICONS_BG[i]} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(640px, 1.7fr) minmax(430px, 1fr)' }}>

        {/* Left column */}
        <div>
          {/* Key Return Information */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Key Return Information</h5>
            <div style={{ padding: '22px 52px 18px' }}>
              <DetailRows items={[...infoLeft, ...infoRight]} />
            </div>
          </div>

          {/* Key Details table + Key Return Photos side by side */}
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.25fr 0.95fr', alignItems: 'stretch' }}>
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
              <h5 style={titleStyle}>Key Details</h5>
              <div style={{ padding: '0 14px 12px', flex: 1 }}>
                {keyDetails.length === 0 ? (
                  <p style={{ color: pageText, fontSize: 15, padding: '14px 12px' }}>No key records.</p>
                ) : (
                  <div style={{ border: '1px solid #e4e8ed', borderRadius: 8, overflow: 'hidden' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                      <thead>
                        <tr style={{ background: '#fbfcfd' }}>
                          {['#','Key Number','Key Type','Key Status'].map((h) => (
                            <th key={h} style={{ color: pageText, fontSize: 15, fontWeight: 700, padding: '14px 16px', textAlign: 'left' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {keyDetails.map((row, idx) => {
                          const status = val(row.status ?? row.keyStatus);
                          return (
                            <tr key={row.checkOutKeyId ?? idx}>
                              <td style={{ color: bodyText, fontSize: 15, padding: '12px 16px' }}>{idx + 1}</td>
                              <td style={{ color: bodyText, fontSize: 15, padding: '12px 16px' }}>{val(row.keyNumber)}</td>
                              <td style={{ color: bodyText, fontSize: 15, padding: '12px 16px' }}>{val(row.keyType)}</td>
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{
                                  background: status === 'Pending' ? '#f0efff' : '#e9fae5',
                                  borderRadius: 5, color: status === 'Pending' ? '#17227d' : '#1c9646',
                                  display: 'inline-block', fontSize: 14, padding: '5px 10px',
                                }}>
                                  {status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Key Return Photos */}
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
              <h5 style={titleStyle}>Key Return Photos</h5>
              <div style={{ padding: '0 26px 20px', flex: 1 }}>
                {photos.length === 0 ? (
                  <p style={{ color: pageText, fontSize: 15, padding: '14px 0' }}>No photos uploaded.</p>
                ) : photos.map((p, i) => {
                  const name = val(p.name ?? p.fileName);
                  const date = fmtDateTime(p.uploadedOn ?? p.date);
                  const src  = resolvePhotoSrc(p.photo ?? p.file ?? p);
                  return (
                    <div key={i} className="d-flex align-items-center justify-content-between gap-3"
                      style={{ padding: '14px 0', borderBottom: '1px solid #eef1f4' }}>
                      <div className="d-flex align-items-center gap-3">
                        {src && <img alt={name} src={src} style={{ borderRadius: 4, height: 50, objectFit: 'cover', width: 50 }} />}
                        <div>
                          <p className="mb-1" style={{ color: pageText, fontSize: 15 }}>{name}</p>
                          <p className="mb-0" style={{ color: pageText, fontSize: 14 }}>{date}</p>
                        </div>
                      </div>
                      <button type="button" className="d-inline-flex align-items-center justify-content-center"
                        style={{ background: '#fff', border: '1px solid #d7dce2', borderRadius: 9, height: 40, width: 40, flexShrink: 0 }}>
                        <IconifyIcon icon="ri:download-line" width={20} height={20} />
                      </button>
                    </div>
                  );
                })}
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
                  {tenantConfirmation || 'No confirmation notes added.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Key Return Summary */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Key Return Information</h5>
            <div style={{ padding: '22px 36px 28px' }}>
              {summaryRows.map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '180px 18px 1fr', minHeight: 40 }}>
                  <span style={{ color: bodyText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: bodyText, fontSize: 16 }}>:</span>
                  <span style={{ color: bodyText, fontSize: 16 }}>{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Information */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Related Information</h5>
            <div style={{ padding: '24px 36px 30px' }}>
              {relatedRows.map(([label, value, icon]) => (
                <div key={label} className="d-flex align-items-center justify-content-between gap-3"
                  style={{ borderBottom: '1px solid #d7dce2', padding: '12px 0' }}>
                  <span className="d-inline-flex align-items-center gap-3" style={{ color: pageText, fontSize: 16 }}>
                    <IconifyIcon icon={icon} width={26} height={26} />
                    {label}
                  </span>
                  <strong style={{ color: '#28548e', fontSize: 16 }}>{value || '—'}</strong>
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
