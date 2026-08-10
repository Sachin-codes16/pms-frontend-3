import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';
import { fmtDate, fmtMoney, val } from '@/utils/checkInFormat';
import { resolvePhotoSrc } from '@/utils/imageStorage';

const pageText = '#526b89';
const bodyText = '#202b3c';

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

const emptyTextStyle = { color: pageText, fontSize: 16, padding: '0 32px 28px' };

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

const DocumentRow = ({ name, date, url }) => (
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
        as="a"
        href={url || undefined}
        target="_blank"
        rel="noopener noreferrer"
        disabled={!url}
        variant="outline-secondary"
        className="d-inline-flex align-items-center justify-content-center p-0"
        style={{ borderColor: '#c8cdd3', borderRadius: 4, height: 50, width: 50 }}
      >
        <IconifyIcon icon="solar:eye-broken" width={19} height={19} />
      </Button>
      <Button
        as="a"
        href={url || undefined}
        download
        disabled={!url}
        variant="outline-secondary"
        className="d-inline-flex align-items-center justify-content-center p-0"
        style={{ borderColor: '#c8cdd3', borderRadius: 4, height: 50, width: 50 }}
      >
        <IconifyIcon icon="ri:download-line" width={20} height={20} />
      </Button>
    </div>
  </div>
);

const TenantDetailsPage = ({ record }) => {
  const tenantDetails = record?.tenantDetails ?? {};
  const personal = tenantDetails.personalDetails ?? {};
  const contact = tenantDetails.contactDetails ?? {};
  const identification = tenantDetails.identificationDetails ?? {};
  const professional = tenantDetails.professionalDetails ?? {};
  const occupancy = tenantDetails.occupancyDetails ?? {};
  const documents = record?.documents ?? [];

  // Helper: prefer nested API structure, fall back to flat top-level field
  const p = (nested, flat) => nested || flat || null;

  const personalInfo = [
    ['Tenant Type',    val(p(personal.tenantType,            record?.tenantType))],
    ['Date of Birth',  fmtDate(p(personal.dateOfBirth,       record?.dateOfBirth))],
    ['Gender',         val(p(personal.gender,                record?.gender))],
    ['Civil ID',       val(p(identification.tenantCivilId,   record?.tenantCivilId))],
    ['Passport No.',   val(p(identification.tenantPassportNumber, record?.tenantPassportNumber))],
    ['Nationality',    val(p(personal.tenantNationality,     record?.tenantNationality))],
    ['Marital Status', val(p(personal.maritalStatus,         record?.maritalStatus))],
  ];

  const ecName = p(contact.emergencyContactName, record?.emergencyContactName);
  const ecNumber = p(contact.emergencyContactNumber, record?.emergencyContactNumber);
  const emergencyContact =
    ecName || ecNumber
      ? [ecName, ecNumber].filter(Boolean).join('\n')
      : val(null);

  const contactInfo = [
    ['Mobile Number', val(p(contact.tenantMobileNumber,    record?.tenantMobileNumber))],
    ['Alternate No',  val(p(contact.alternateMobileNumber, record?.alternateMobileNumber))],
    ['Email',         val(p(contact.tenantEmail,           record?.tenantEmail))],
    ['Address',       val(p(identification.tenantAddress,  record?.tenantAddress))],
    ['Emergency No',  emergencyContact],
  ];

  const additionalInfo = [
    ['Profession',       val(p(professional.profession,             record?.profession))],
    ['Monthly Rent',     fmtMoney(record?.monthlyRent)],
    ['Move-In Reason',   val(p(occupancy.moveInReason,              record?.moveInReason))],
    ['Company Name',     val(p(professional.companyName,            record?.companyName))],
    ['Security Deposit', fmtMoney(record?.securityDeposit)],
    ['No. Of Occupants', val(p(occupancy.numberOfOccupants,         record?.numberOfOccupants))],
  ];

  const tenantName = p(personal.tenantName, record?.tenantName);
  const tenantCode = p(personal.tenantCode, record?.tenantCode);

  const notes = record?.tenantRemarks || record?.internalComments;

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
                <div
                  className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ background: '#dce8f5', borderRadius: '50%', fontSize: 26, fontWeight: 700, color: pageText, height: 74, width: 74 }}
                >
                  {tenantName ? tenantName.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <div className="d-flex align-items-center gap-5 mb-3">
                    <h4 className="mb-0" style={{ color: pageText, fontSize: 23, fontWeight: 700 }}>
                      {val(tenantName)}
                    </h4>
                    <span style={{ color: pageText, fontSize: 15 }}>{val(record?.checkInStatus)}</span>
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-4 mb-2">
                    <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                      <IconifyIcon icon="ri:phone-fill" width={16} height={16} />
                      {val(p(contact.tenantMobileNumber, record?.tenantMobileNumber))}
                    </span>
                    <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                      <IconifyIcon icon="logos:google-gmail" width={16} height={16} />
                      {val(p(contact.tenantEmail, record?.tenantEmail))}
                    </span>
                  </div>
                  {tenantCode && (
                    <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                      <IconifyIcon icon="ri:id-card-line" width={16} height={16} />
                      {tenantCode}
                    </span>
                  )}
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
            {documents.length > 0 ? (
              <div style={{ padding: '30px 46px 26px' }}>
                {documents.map((document, index) => (
                  <DocumentRow
                    key={document.id ?? document.name ?? index}
                    name={val(document.name ?? document.documentType, 'Document')}
                    date={document.uploadedOn ? `Uploaded on ${fmtDate(document.uploadedOn)}` : 'Not uploaded'}
                    url={resolvePhotoSrc(document)}
                  />
                ))}
              </div>
            ) : (
              <p style={emptyTextStyle}>No documents uploaded</p>
            )}
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Additional Notes</h5>
            <div style={{ padding: '20px 20px 20px' }}>
              {notes ? (
                <div
                  style={{
                    background: '#fffaf3',
                    border: '1px solid #f3d8ad',
                    borderRadius: 8,
                    padding: '30px 22px',
                  }}
                >
                  <p className="mb-0" style={{ color: pageText, fontSize: 16, lineHeight: 1.45 }}>
                    {notes}
                  </p>
                </div>
              ) : (
                <p className="mb-0" style={{ color: pageText, fontSize: 16 }}>
                  No additional notes
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetailsPage;
