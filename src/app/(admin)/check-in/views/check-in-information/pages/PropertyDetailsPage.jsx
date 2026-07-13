import { resolvePhotoSrc } from '@/utils/imageStorage';
import { fmtDate, fmtMoney, val, yesNo } from '@/utils/checkInFormat';

const pageText = '#526b89';
const bodyText = '#111';

const cardStyle = {
  background: '#fff',
  border: '1px solid #dee2e6',
  borderRadius: 8,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  marginBottom: 24,
};

const sectionTitleStyle = {
  color: pageText,
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 18,
};

const PropertyInfoCard = ({ title, items }) => (
  <div style={cardStyle}>
    <div style={{ padding: '28px 30px' }}>
      <h4 style={sectionTitleStyle}>{title}</h4>
      <div style={{ borderTop: '1px solid #d7d7d7', paddingTop: 22 }}>
        <div
          style={{
            display: 'grid',
            gap: '22px 28px',
            gridTemplateColumns: 'repeat(6, minmax(130px, 1fr))',
            overflowX: 'auto',
          }}
        >
          {items.map(([label, value]) => (
            <div key={label}>
              <p
                className="mb-2"
                style={{
                  color: bodyText,
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: 0,
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </p>
              <p className="mb-0" style={{ color: bodyText, fontSize: 16, fontWeight: 600 }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AmenitiesCard = ({ amenities }) => (
  <div style={cardStyle}>
    <div style={{ padding: '28px 30px' }}>
      <h4 style={sectionTitleStyle}>Amenities &amp; Facilities</h4>
      <div style={{ borderTop: '1px solid #d7d7d7', paddingTop: 22 }}>
        {amenities.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gap: '18px 28px',
              gridTemplateColumns: 'repeat(6, minmax(150px, 1fr))',
              overflowX: 'auto',
            }}
          >
            {amenities.map((item) => (
              <span
                key={item}
                style={{
                  background: '#f3f4f6',
                  borderRadius: 6,
                  color: bodyText,
                  display: 'inline-block',
                  fontSize: 15,
                  fontWeight: 500,
                  padding: '12px 12px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="mb-0" style={{ color: bodyText, fontSize: 15 }}>
            No amenities listed
          </p>
        )}
      </div>
    </div>
  </div>
);

const AddressCard = ({ address, items }) => (
  <div style={cardStyle}>
    <div style={{ padding: '28px 30px' }}>
      <h4 style={sectionTitleStyle}>Residential Address</h4>
      <div style={{ borderTop: '1px solid #d7d7d7', paddingTop: 22 }}>
        <div style={{ marginBottom: 24 }}>
          <p
            className="mb-2"
            style={{ color: bodyText, fontSize: 14, fontWeight: 500, textTransform: 'uppercase' }}
          >
            ADDRESS
          </p>
          <p className="mb-0" style={{ color: bodyText, fontSize: 16, fontWeight: 600 }}>
            {address}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gap: '22px 28px',
            gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))',
            overflowX: 'auto',
          }}
        >
          {items.map(([label, value]) => (
            <div key={label}>
              <p
                className="mb-2"
                style={{ color: bodyText, fontSize: 14, fontWeight: 500, textTransform: 'uppercase' }}
              >
                {label}
              </p>
              {label === 'GOOGLE MAP' && value !== '—' ? (
                <a href={value} style={{ color: bodyText, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
                  View Location
                </a>
              ) : (
                <p className="mb-0" style={{ color: bodyText, fontSize: 16, fontWeight: 600 }}>
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PropertyDetailsPage = ({ record }) => {
  const propertyDetails = record?.propertyDetails ?? {};
  const basicInformation = propertyDetails.basicInformation ?? {};
  const configurationAndArea = propertyDetails.configurationAndArea ?? {};
  const rentalAndFinancialDetails = propertyDetails.rentalAndFinancialDetails ?? {};
  const ownership = propertyDetails.ownership ?? {};
  const amenities = propertyDetails.amenitiesAndFacilities ?? [];
  const rentalDetails = propertyDetails.rentalDetails ?? {};
  const agreementDetails = propertyDetails.agreementDetails ?? {};
  const residentialAddress = propertyDetails.residentialAddress ?? {};
  const systemInformation = propertyDetails.systemInformation ?? {};
  const photos = propertyDetails.photos ?? [];

  // Prefer nested API path, fall back to flat top-level field
  const p = (nested, flat) => (nested !== null && nested !== undefined ? nested : flat ?? null);

  const basicInfo = [
    ['PROPERTY TYPE',    val(p(basicInformation.propertyType,     record?.propertyType))],
    ['PROPERTY CODE',    val(p(basicInformation.propertyCode,     record?.propertyCode))],
    ['PROJECT / SOCIETY',val(basicInformation.projectOrSociety)],
    ['NAME / NUMBER',    val(p(basicInformation.nameOrNumber,     record?.buildingName))],
    ['UNIT / FLAT',      val(p(basicInformation.unitNumber,       record?.flatUnitNumber))],
    ['FLOOR',            val(p(basicInformation.floorNumber,      record?.floorNumber))],
  ];

  const configurationInfo = [
    ['CONFIGURATION', val(configurationAndArea.configuration)],
    ['CARPET AREA',   configurationAndArea.carpetAreaSqft  != null ? `${configurationAndArea.carpetAreaSqft} sq.ft`  : '—'],
    ['BUILT-UP AREA', configurationAndArea.builtupAreaSqft != null ? `${configurationAndArea.builtupAreaSqft} sq.ft` : '—'],
    ['PLOT AREA',     configurationAndArea.plotAreaSqft    != null ? `${configurationAndArea.plotAreaSqft} sq.ft`    : '—'],
    ['BATHROOMS',     val(configurationAndArea.bathrooms)],
    ['FACING',        val(configurationAndArea.facing)],
  ];

  const financialInfo = [
    ['MONTHLY RENT',     fmtMoney(p(rentalAndFinancialDetails.monthlyRent,    record?.monthlyRent))],
    ['SECURITY DEPOSIT', fmtMoney(p(rentalAndFinancialDetails.securityDeposit,record?.securityDeposit))],
    ['MAINTENANCE',      fmtMoney(p(rentalAndFinancialDetails.maintenance,    record?.maintenanceCharges))],
    ['ADVANCE RENT',     fmtMoney(p(rentalAndFinancialDetails.advanceRent,    record?.advanceRentReceived))],
    ['ELECTRICITY',      val(rentalAndFinancialDetails.electricity)],
    ['WATER CHARGES',    val(rentalAndFinancialDetails.waterCharges)],
  ];

  const ownershipInfo = [
    ['LANDLORD NAME',   val(p(ownership.landlordName,   record?.landlordName))],
    ['PROPERTY STATUS', val(p(ownership.propertyStatus, record?.propertyStatus))],
  ];

  const rentalDetailInfo = [
    ['RENT START DATE',       fmtDate(p(rentalDetails.rentStartDate,    record?.agreementStartDate))],
    ['RENT END DATE',         fmtDate(p(rentalDetails.rentEndDate,      record?.agreementEndDate))],
    ['AGREEMENT DURATION',    val(rentalDetails.agreementDuration)],
    ['MAINTENANCE REQUIRED',  yesNo(rentalDetails.maintenanceRequired)],
    ['MAINTENANCE STATUS',    val(rentalDetails.maintenanceStatus)],
    ['PAYMENT MODE',          val(p(rentalDetails.paymentMode,          record?.paymentMode))],
  ];

  const agreementInfo = [
    ['AGREEMENT TYPE',   val(p(agreementDetails.agreementType,   record?.agreementType))],
    ['PREPARED BY',      val(agreementDetails.agreementPreparedBy)],
    ['AGREEMENT STATUS', val(p(agreementDetails.agreementStatus, record?.agreementStatus))],
  ];

  const residentialAddressInfo = [
    ['CITY',       val(residentialAddress.city)],
    ['STATE',      val(residentialAddress.state)],
    ['PO BOX',     val(residentialAddress.poBox)],
    ['GOOGLE MAP', residentialAddress.googleMap && residentialAddress.googleMap !== '-' ? residentialAddress.googleMap : '—'],
  ];

  const systemInfo = [
    ['CREATED BY',   val(p(systemInformation.createdBy,    record?.createdBy?.name))],
    ['CREATED ON',   fmtDate(p(systemInformation.createdOn, record?.createdAt))],
    ['LAST UPDATED', fmtDate(p(systemInformation.lastUpdated, record?.updatedAt))],
  ];

  const propertyName = p(propertyDetails.propertyName, record?.buildingName);
  const propertyAddress = p(propertyDetails.address, record?.flatUnitNumber
    ? `${record?.buildingName ?? ''} – Unit ${record.flatUnitNumber}`
    : record?.buildingName);

  return (
    <div style={{ padding: '24px 24px 36px' }}>
      <div style={{ ...cardStyle, padding: 24 }}>
        {photos.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gap: 20,
              gridTemplateColumns: 'repeat(5, minmax(200px, 1fr))',
              overflowX: 'auto',
            }}
          >
            {photos.map((photo, index) => (
              <img
                key={photo}
                alt={`Property ${index + 1}`}
                src={resolvePhotoSrc(photo)}
                style={{
                  borderRadius: 5,
                  height: 350,
                  minWidth: 200,
                  objectFit: 'cover',
                  width: '100%',
                }}
              />
            ))}
          </div>
        ) : (
          <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>
            No photos available
          </p>
        )}

        <div
          className="d-flex flex-column flex-md-row justify-content-between gap-3"
          style={{ padding: '24px 0 14px' }}
        >
          <div>
            <h2 className="mb-2" style={{ color: pageText, fontSize: 28, fontWeight: 700 }}>
              {val(propertyName)}
            </h2>
            <p className="mb-0" style={{ color: pageText, fontSize: 16 }}>
              {val(propertyAddress)}
            </p>
          </div>

          <div className="text-md-end">
            <h2 className="mb-2" style={{ color: pageText, fontSize: 28, fontWeight: 700 }}>
              {fmtMoney(p(propertyDetails.monthlyRent, record?.monthlyRent))}
            </h2>
            <p className="mb-0" style={{ color: pageText, fontSize: 16 }}>
              per month + maintenance
            </p>
          </div>
        </div>

        <PropertyInfoCard title="Basic Property Information" items={basicInfo} />
        <PropertyInfoCard title="Configuration & Area" items={configurationInfo} />
        <PropertyInfoCard title="Rental & Financial Details" items={financialInfo} />
        <PropertyInfoCard title="Ownership" items={ownershipInfo} />
        <AmenitiesCard amenities={amenities} />
        <PropertyInfoCard title="Rental Details" items={rentalDetailInfo} />
        <PropertyInfoCard title="Agreement Details" items={agreementInfo} />
        <AddressCard address={val(propertyDetails.address)} items={residentialAddressInfo} />
        <PropertyInfoCard title="System Information" items={systemInfo} />
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
