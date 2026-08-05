import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';
import { resolvePhotoSrc } from '@/utils/imageStorage';
import { DASH, fmtDate, fmtMoney, val, yesNo } from '@/utils/checkInFormat';

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
  padding: '26px 32px 17px',
};

const valueRowStyle = {
  alignItems: 'center',
  display: 'grid',
  gridTemplateColumns: '135px 16px 1fr',
  minHeight: 40,
};

const emptyTextStyle = { color: pageText, fontSize: 15, padding: '0 32px 24px' };

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

const OverviewPage = ({ record }) => {
  const overview = record?.overview ?? {};
  const propertyDetails = record?.propertyDetails ?? {};
  const propertyInformation = overview.propertyInformation ?? {};
  const rentAndCharges = overview.rentAndCharges ?? {};
  const activityTimeline = overview.activityTimeline ?? {};
  const landlordDetails = overview.landlordDetails ?? {};
  const tenantDocuments = overview.tenantDocuments ?? [];
  const photos = propertyDetails.photos ?? [];

  const propertyInfoLeft = [
    ['Property Type', val(propertyInformation.rentalType)],
    ['Building Name', val(propertyInformation.buildingName)],
    ['Unit No', val(propertyInformation.flatNumber)],
    ['Floor', val(propertyInformation.floorNumber ?? propertyInformation.floor)],
    ['Area (Sq. Ft.)', val(propertyInformation.builtupAreaSqft ?? propertyInformation.dimensionAreaSqft)],
    ['Facing', val(propertyInformation.facing)],
    ['Year Built', val(propertyInformation.yearOfConstruction)],
  ];

  const propertyInfoRight = [
    ['Configuration', val(propertyInformation.flatConfiguration)],
    ['Bathrooms', val(propertyInformation.noOfBathrooms)],
    ['Balcony', yesNo(propertyInformation.balcony)],
    ['Parking', yesNo(propertyInformation.parking)],
    ['Furnishing', val(propertyInformation.furnishingStatus)],
    ['Kitchen Type', val(propertyInformation.kitchenType)],
    ['Store Room', yesNo(propertyInformation.storeRoom)],
  ];

  const rentItems = [
    ['Monthly Rent', fmtMoney(rentAndCharges.monthlyRent)],
    ['Security Deposit', fmtMoney(rentAndCharges.securityDeposit)],
    ['Maintenance Fee', fmtMoney(rentAndCharges.maintenanceFee)],
    [
      'Late Fee Rule',
      rentAndCharges.lateFeeType
        ? `${rentAndCharges.lateFeeType}${rentAndCharges.lateFeeValue ? ` - ${rentAndCharges.lateFeeValue}` : ''}`
        : DASH,
    ],
    ['Payment Due Date', fmtDate(rentAndCharges.paymentDueDate)],
    ['Rent Increase Date', fmtDate(rentAndCharges.rentIncreaseDate)],
  ];

  const timelineItems = [
    { label: 'Property Created', value: fmtDate(activityTimeline.propertyCreatedDate), color: '#b9d900' },
    { label: 'Listed For Rent', value: fmtDate(activityTimeline.listedForRentDate), color: '#44c4c8' },
    { label: 'Tenant Assigned', value: fmtDate(activityTimeline.tenantAssignedDate), color: '#f49a45' },
    { label: 'Assigned to Employee', value: fmtDate(activityTimeline.assignedToEmployeeDate), color: '#55bd7b' },
    { label: 'Property Occupied', value: fmtDate(activityTimeline.propertyOccupiedDate), color: '#286be8' },
  ];

  const landlordItems = [
    ['Landlord Name', val(landlordDetails.name)],
    ['Contact Number', val(landlordDetails.mobileNumber)],
    ['Email', val(landlordDetails.email)],
    ['Address', val(landlordDetails.address)],
  ];

  const features = propertyDetails.amenitiesAndFacilities ?? [];

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
                  gridTemplateColumns: '34px 1fr 110px',
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
                <span style={{ color: item.color, fontSize: 14, fontWeight: 700, textAlign: 'right' }}>
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
          {features.length > 0 ? (
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
          ) : (
            <p style={emptyTextStyle}>No features listed</p>
          )}
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
          {tenantDocuments.length > 0 ? (
            <div style={{ padding: '10px 18px 18px' }}>
              {tenantDocuments.map((document, index) => (
                <div
                  key={document.id ?? document.name ?? index}
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
                        {val(document.name ?? document.documentType)}
                      </p>
                      <p className="mb-0" style={{ color: bodyText, fontSize: 14 }}>
                        {document.uploadedOn ? `Uploaded on ${fmtDate(document.uploadedOn)}` : 'Not uploaded'}
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
          ) : (
            <p style={emptyTextStyle}>No documents uploaded</p>
          )}
        </div>

        <div style={cardStyle}>
          <h5 style={titleStyle}>Photos</h5>
          {photos.length > 0 ? (
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr', padding: '10px 24px 24px' }}>
              {photos.map((photo) => (
                <img
                  key={photo}
                  alt="Property"
                  src={resolvePhotoSrc(photo)}
                  style={{ aspectRatio: '1.65 / 1', borderRadius: 4, objectFit: 'cover', width: '100%' }}
                />
              ))}
            </div>
          ) : (
            <p style={emptyTextStyle}>No photos available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
