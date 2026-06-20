import property1 from '@/assets/images/properties/p-11.jpg';
import property2 from '@/assets/images/properties/p-2.jpg';
import property3 from '@/assets/images/properties/p-3.jpg';
import property4 from '@/assets/images/properties/p-4.jpg';
import property5 from '@/assets/images/properties/p-5.jpg';

const pageText = '#526b89';
const bodyText = '#111';

const gallery = [property1, property2, property3, property4, property5];

const basicInfo = [
  ['PROPERTY TYPE', 'Villa'],
  ['PROPERTY CODE', 'PRP-10234'],
  ['PROJECT / SOCIETY', 'Green Valley'],
  ['VILLA NAME / NO', 'Villa 12A'],
  ['TOTAL FLOORS', '2'],
  ['YEAR BUILT', '2023'],
];

const configurationInfo = [
  ['BHK', '4'],
  ['CARPET AREA', '2200 sq.ft'],
  ['BUILT-UP AREA', '2800 sq.ft'],
  ['PLOT AREA', '4000 sq.ft'],
  ['BATHROOMS', '4'],
  ['FACING', 'EAST'],
];

const financialInfo = [
  ['MONTHLY RENT', 'OMR 8,500'],
  ['SECURITY DEPOSIT', 'OMR 100,000'],
  ['MAINTENANCE', 'OMR 1000'],
  ['ELECTRICITY', 'Metered'],
  ['WATER CHARGES', 'Included'],
];

const ownershipInfo = [['LANDLORD NAME', 'Mr.Rajesh Mehta']];

const amenities = ['Parking', 'Private Garden', 'Swimming Pool', 'Power Backup', 'CCTV', 'Gated Community'];

const tenantPreferenceInfo = [
  ['RENTAL PURPOSE', 'Residential'],
  ['TENANT TYPE', 'Family / Company Lease'],
  ['PETS ALLOWED', 'Yes'],
];

const availabilityInfo = [
  ['STATUS', 'Vacant'],
  ['AVAILABLE FROM', '15 Mar 2026'],
  ['CURRENT TENANT', '---'],
];

const residentialAddressInfo = [
  ['CITY', 'Muskat'],
  ['STATE', 'Muskat'],
  ['PO BOX', '401000'],
  ['GOOGLE MAP', 'View Location'],
];

const systemInfo = [
  ['CREATED BY', 'Admin'],
  ['CREATED ON', '10 Feb 2026'],
  ['LAST UPDATED', '02 Mar 2026'],
];

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

const AmenitiesCard = () => (
  <div style={cardStyle}>
    <div style={{ padding: '28px 30px' }}>
      <h4 style={sectionTitleStyle}>Amenities &amp; Facilities</h4>
      <div style={{ borderTop: '1px solid #d7d7d7', paddingTop: 22 }}>
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
      </div>
    </div>
  </div>
);

const AddressCard = () => (
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
            Green Valley Society, Muskat, Oman
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
          {residentialAddressInfo.map(([label, value]) => (
            <div key={label}>
              <p
                className="mb-2"
                style={{ color: bodyText, fontSize: 14, fontWeight: 500, textTransform: 'uppercase' }}
              >
                {label}
              </p>
              {label === 'GOOGLE MAP' ? (
                <a href="#" style={{ color: bodyText, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
                  {value}
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

const PropertyDetailsPage = () => {
  return (
    <div style={{ padding: '24px 24px 36px' }}>
      <div style={{ ...cardStyle, padding: 24 }}>
        <div
          style={{
            display: 'grid',
            gap: 20,
            gridTemplateColumns: 'repeat(5, minmax(200px, 1fr))',
            overflowX: 'auto',
          }}
        >
          {gallery.map((image, index) => (
            <img
              key={image}
              alt={`Property ${index + 1}`}
              src={image}
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

        <div
          className="d-flex flex-column flex-md-row justify-content-between gap-3"
          style={{ padding: '24px 0 14px' }}
        >
          <div>
            <h2 className="mb-2" style={{ color: pageText, fontSize: 28, fontWeight: 700 }}>
              Green Valley Villa 12A
            </h2>
            <p className="mb-0" style={{ color: pageText, fontSize: 16 }}>
              Green Valley Society, Muskat, Oman, 4100001
            </p>
          </div>

          <div className="text-md-end">
            <h2 className="mb-2" style={{ color: pageText, fontSize: 28, fontWeight: 700 }}>
              OMR 8,500
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
        <AmenitiesCard />
        <PropertyInfoCard title="Tenant Preference" items={tenantPreferenceInfo} />
        <PropertyInfoCard title="Availability & Status" items={availabilityInfo} />
        <AddressCard />
        <PropertyInfoCard title="System Information" items={systemInfo} />
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
