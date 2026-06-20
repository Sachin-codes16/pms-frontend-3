import { resolvePhotoSrc } from '@/utils/imageStorage';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { useMemo } from 'react';

/* ─── date formatter ────────────────────────────────────────────────────── */
const formatDate = (val) => {
  if (val == null || val === '' || val === '-') return '—';
  const date = typeof val === 'string' ? new Date(val) : val;
  if (isNaN(date?.getTime())) return String(val);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

/* ─── PropertyDetails ───────────────────────────────────────────────────── */
const PropertyDetails = ({ property, landlordName }) => {
  const d = property || {};
  
  // API response camelCase mein hai - Postman response ke according
  const pd = d.propertyDetails || {};
  const fd = d.flatData || {};
  const vd = d.villaData || {};
  const cd = d.commercialData || {};
  const wd = d.warehouseData || {};

  /* ── Rental Type (property type) ── */
  const rentalType = (d.rentalType || '').toLowerCase();

  /* ── Basic ── */
  const propertyTitle =
    vd.villaName ||
    pd.buildingName ||
    d.buildingDetails ||
    'Property';

  const propertyCode = d.propertyId ? `#${d.propertyId}` : '—';

  const fullAddress = [
    pd.addressLine1,
    pd.city,
    pd.state,
    pd.country
  ].filter((v) => v && v !== '-').join(', ') || '—';

  const addressLine = pd.addressLine1 || fullAddress;
  const city = pd.city || '—';
  const state = pd.state || '—';
  const poBox = pd.pincode || '—';
  const mapUrl = pd.googleMapLocation || null;

  /* ── Financial ── */
  const monthlyRent = pd.monthlyRent ?? d.expectedRent ?? null;
  const securityDeposit = pd.securityDepositAmount ?? d.advanceAmountRent ?? null;
  const electricityType = pd.electricityChargeType || '—';
  const waterType = pd.waterChargeType || '—';

  // Maintenance from type-specific data
  const maintenanceAmt =
    vd.maintenanceChargeAmount ??
    fd.maintenanceChargeAmount ??
    cd.maintenanceChargeAmount ??
    wd.maintenanceChargeAmount ??
    null;
  const maintenance = maintenanceAmt != null ? `OMR ${maintenanceAmt}` : '—';

  const totalRent =
    monthlyRent != null
      ? parseFloat(monthlyRent) + (parseFloat(maintenanceAmt) || 0)
      : null;

  /* ── Areas ── */
  const carpetArea = pd.carpetAreaSqft ?? d.dimensionAreaSqft ?? null;
  const builtupArea = pd.builtupAreaSqft ?? vd.builtupAreaSqft ?? fd.builtupAreaSqft ?? null;
  const plotArea = vd.plotAreaSqft ?? null;

  /* ── Configuration ── */
  const configuration = fd.flatConfiguration || vd.villaConfiguration || '';
  const bhkMatch = configuration.match(/(\d+)\s*BHK/i);
  const bhk = bhkMatch ? `${bhkMatch[1]} BHK` : '';
  const bedrooms = vd.numberOfBedrooms || '';
  const bathrooms = fd.noOfBathrooms || fd.no_of_bathrooms || vd.numberOfBathrooms || vd.number_of_bathrooms || cd.noOfWashrooms || '—';

  /* ── Property Type Specific Fields ── */
  // FLAT specific
  const flatNumber = fd.flatNumber || d.flatNumber || '—';
  const floorNumber = fd.floorNumber || d.floor || '—';
  const buildingBlock = fd.buildingBlock || d.block || '—';
  const facing = fd.facing || '—';
  const kitchenType = fd.kitchenType || '—';

  // VILLA specific
  const villaType = vd.villaType || '—';
  const projectName = vd.projectName || pd.areaZone || '—';
  const livingRooms = vd.livingRoomsCount || '—';
  const privateParking = vd.privateParking || '—';

  // COMMERCIAL specific
  const commercialCategory = cd.commercialCategory || '—';
  const noCabins = cd.noOfCabins || '—';
  const noWashrooms = cd.noOfWashrooms || '—';
  const powerLoad = cd.powerLoadKw || '—';
  const liftType = cd.liftType || '—';
  const parkingAvailability = cd.parkingAvailability || '—';
  const leaseType = cd.leaseType || '—';
  const leaseTenure = cd.leaseTenureYears || '—';

  // WAREHOUSE specific
  const warehouseName = wd.warehouseName || '—';
  const loadingArea = wd.loadingArea || '—';
  const ceilingHeight = wd.ceilingHeightFt || '—';

  /* ── Ownership ── */
  const landlordDisplay = landlordName || '—';

  /* ── Availability ── */
  const currentStatus = pd.currentStatus || (d.isActive === false ? 'Inactive' : 'Vacant');
  const availableFrom = pd.availableFrom ? formatDate(pd.availableFrom) : '—';
  const currentTenantId = pd.currentTenantId;
  const currentTenant = (currentTenantId && currentTenantId !== 0) ? `Tenant #${currentTenantId}` : '---';

  /* ── Tenant Preference ── */
  const rentalPurpose = d.rentalFor || '—';
  const allowedTenants =
    (vd.allowedTenantTypes && vd.allowedTenantTypes.length > 0)
      ? vd.allowedTenantTypes.join(', ')
      : (fd.allowedTenantTypes && fd.allowedTenantTypes.length > 0)
        ? fd.allowedTenantTypes.join(', ')
        : '—';
  const petsAllowed =
    vd.petsAllowed != null
      ? (vd.petsAllowed ? 'Yes' : 'No')
      : fd.petsAllowed != null
        ? (fd.petsAllowed ? 'Yes' : 'No')
        : '—';

  /* ── Amenities — from boolean flags ── */
  const amenitySource = { ...vd, ...fd };
  const AMENITY_MAP = [
    ['waterSupply24x7', '24x7 Water Supply'],
    ['securityGuard', 'Security Guard'],
    ['clubhouseAccess', 'Clubhouse'],
    ['gym', 'Gym'],
    ['childrensPlayArea', "Children's Play Area"],
    ['gatedCommunity', 'Gated Community'],
    ['powerBackup', 'Power Backup'],
    ['cctv', 'CCTV'],
    ['privateGarden', 'Private Garden'],
    ['terraceAccess', 'Terrace Access'],
    ['boundaryWall', 'Boundary Wall'],
    ['driveway', 'Driveway'],
    ['balconyOrSitout', 'Balcony / Sitout'],
    ['balcony', 'Balcony'],
    ['internalRoads', 'Internal Roads'],
    ['streetLights', 'Street Lights'],
    ['storeRoom', 'Store Room'],
    ['lift', 'Lift'],
    ['parking', 'Parking'],
    ['security', 'Security'],
    ['gasPipeline', 'Gas Pipeline'],
    ['waterSupply', 'Water Supply'],
    ['intercom', 'Intercom'],
    ['fireSafety', 'Fire Safety'],
  ];
  const activeAmenities = AMENITY_MAP.filter(([key]) => amenitySource[key] === true).map(([, label]) => label);
  const displayAmenities = activeAmenities.length > 0 ? activeAmenities : ['—'];

  /* ── System info ── */
  const createdByName = d.createdBy?.name || '—';
  const createdAtStr = formatDate(d.createdAt);
  const updatedAtStr = formatDate(d.updatedAt);

  /* ── Photos ── */
  const apiPhotos = Array.isArray(d.photos) ? d.photos : [];

  const photoUrls = useMemo(
    () => apiPhotos.slice(0, 4).map((photo) => resolvePhotoSrc(photo)),
    [apiPhotos]
  );

  return (
    <div style={{ backgroundColor: '#F9F9FC', minHeight: '100vh' }}>

      {/* ── Photos ─────────────────────────────────────────────────────── */}
      <Row className="g-0">
        <Col xl={12} lg={6}>
          <Card>
            <CardBody>
              <div className="photo-scroll-row" style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                {photoUrls.length > 0 ? (
                  photoUrls.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`property ${idx + 1}`}
                      className="rounded"
                      style={{ width: '280px', height: '220px', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ))
                ) : (
                  <p className="text-muted">No photos available</p>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ── Title & Price ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0', marginTop: '0rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingRight: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 550, marginBottom: '0.25rem', color: '#000' }}>
              {propertyTitle}
            </h2>
            <p style={{ margin: 0, color: 'black', fontSize: '1rem', fontWeight: 400 }}>
              {fullAddress}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 550, marginBottom: '0.25rem', color: '#000' }}>
              {totalRent != null ? `OMR ${totalRent}` : monthlyRent != null ? `OMR ${monthlyRent}` : '—'}
            </h2>
            <p style={{ margin: 0, color: 'black', fontSize: '1rem', fontWeight: 400 }}>
              per month {maintenanceAmt ? '+ maintenance' : ''}
            </p>
          </div>
        </div>

        {/* ── Basic Property Information ───────────────────────────────── */}
        <Card style={{ borderRadius: '0.5rem', border: '1px solid #dee2e6', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#000' }}>Basic Property Information</h4>
            <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1.75rem' }}>
              <Row>
                {rentalType === 'flat' ? (
                  <>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PROPERTY TYPE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>Flat</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PROPERTY CODE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{propertyCode}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>BUILDING NAME</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{pd.buildingName || '—'}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>BLOCK</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{buildingBlock}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>FLAT NUMBER</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{flatNumber}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>FLOOR</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{floorNumber}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>TOTAL FLOORS</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{pd.totalFloors || '—'}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>FACING</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{facing}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>KITCHEN TYPE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{kitchenType}</p></div></Col>
                  </>
                ) : rentalType === 'villa' ? (
                  <>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PROPERTY TYPE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>Villa</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PROPERTY CODE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{propertyCode}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>VILLA NAME</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{vd.villaName || '—'}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>VILLA TYPE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{villaType}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PROJECT NAME</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{projectName}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>LIVING ROOMS</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{livingRooms}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PARKING</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{privateParking}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>YEAR BUILT</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{pd.yearOfConstruction || '—'}</p></div></Col>
                  </>
                ) : rentalType === 'commercial' ? (
                  <>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PROPERTY TYPE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>Commercial</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PROPERTY CODE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{propertyCode}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>CATEGORY</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{commercialCategory}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>BUILDING NAME</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{pd.buildingName || '—'}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>NO. OF CABINS</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{noCabins}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>WASHROOMS</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{noWashrooms}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>POWER LOAD (KW)</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{powerLoad}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>LIFT TYPE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{liftType}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PARKING</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{parkingAvailability}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>LEASE TYPE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{leaseType}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>LEASE TENURE (Yrs)</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{leaseTenure}</p></div></Col>
                  </>
                ) : rentalType === 'warehouse' ? (
                  <>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PROPERTY TYPE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>Warehouse</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PROPERTY CODE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{propertyCode}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>WAREHOUSE NAME</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{warehouseName}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>LOADING AREA</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{loadingArea}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>CEILING HEIGHT (ft)</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{ceilingHeight}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>YEAR BUILT</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{pd.yearOfConstruction || '—'}</p></div></Col>
                  </>
                ) : (
                  <>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PROPERTY TYPE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{d.rentalType || '—'}</p></div></Col>
                    <Col lg={2} md={4} sm={6}><div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>PROPERTY CODE</p><p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{propertyCode}</p></div></Col>
                  </>
                )}
              </Row>
            </div>
          </CardBody>
        </Card>

        {/* ── Configuration & Area ─────────────────────────────────────── */}
        <Card style={{ borderRadius: '0.5rem', border: '1px solid #dee2e6', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#000' }}>Configuration & Area</h4>
            <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1.75rem' }}>
              <Row>
                {[
                  ['BHK / CONFIG', configuration || bedrooms],
                  ['CARPET AREA', carpetArea ? `${carpetArea} sq.ft` : '—'],
                  ['BUILT-UP AREA', builtupArea ? `${builtupArea} sq.ft` : '—'],
                  ['PLOT AREA', plotArea ? `${plotArea} sq.ft` : '—'],
                  ['BEDROOMS', bedrooms],
                  ['BATHROOMS', bathrooms],
                ].map(([label, value]) => (
                  <Col lg={2} md={4} sm={6} key={label}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                      <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{value || '—'}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </CardBody>
        </Card>

        {/* ── Rental & Financial Details ───────────────────────────────── */}
        <Card style={{ borderRadius: '0.5rem', border: '1px solid #dee2e6', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#000' }}>Rental & Financial Details</h4>
            <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1.75rem' }}>
              <Row>
                {[
                  ['MONTHLY RENT', monthlyRent != null ? `OMR ${monthlyRent}` : '—'],
                  ['SECURITY DEPOSIT', securityDeposit != null ? `OMR ${securityDeposit}` : '—'],
                  ['MAINTENANCE', maintenance],
                  ['LATE FEE TYPE', pd.lateFeeType || '—'],
                  ['LATE FEE AMOUNT', pd.lateFeeValue || '—'],
                  ['OTHER CHARGES', pd.otherCharges || '—'],
                ].map(([label, value]) => (
                  <Col lg={2} md={4} sm={6} key={label}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                      <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{value}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </CardBody>
        </Card>

        {/* ── Ownership ────────────────────────────────────────────────── */}
        {/* <Card style={{ borderRadius: '0.5rem', border: '1px solid #dee2e6', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#000' }}>Ownership</h4>
            <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1.75rem' }}>
              <Row>
                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>LANDLORD NAME</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0, lineHeight: 1.5 }}>{landlordDisplay}</p>
                  </div>
                </Col>
                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>CREATED BY</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0, lineHeight: 1.5 }}>{createdByName}</p>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card> */}

        {/* ── Amenities & Facilities ───────────────────────────────────── */}
        <Card style={{ borderRadius: '0.5rem', border: '1px solid #dee2e6', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#000' }}>Amenities & Facilities</h4>
            <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1.75rem' }}>
              <Row>
                {displayAmenities.map((amenity, index) => (
                  <Col lg={2} md={4} sm={6} key={index}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px', backgroundColor: '#f3f4f6', padding: '12px 12px', borderRadius: '6px', textAlign: 'center' }}>
                        {amenity}
                      </p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </CardBody>
        </Card>

        {/* ── Tenant Preference ────────────────────────────────────────── */}
        <Card style={{ borderRadius: '0.5rem', border: '1px solid #dee2e6', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#000' }}>Tenant Preference</h4>
            <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1.75rem' }}>
              <Row>
                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>RENTAL PURPOSE</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0, lineHeight: 1.5 }}>{rentalPurpose}</p>
                  </div>
                </Col>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TENANT TYPE</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0, lineHeight: 1.5 }}>{allowedTenants}</p>
                  </div>
                </Col>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PETS ALLOWED</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0, lineHeight: 1.5 }}>{petsAllowed}</p>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>

        {/* ── Availability & Status ────────────────────────────────────── */}
        <Card style={{ borderRadius: '0.5rem', border: '1px solid #dee2e6', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#000' }}>Availability & Status</h4>
            <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1.75rem' }}>
              <Row>
                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>STATUS</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{currentStatus}</p>
                  </div>
                </Col>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AVAILABLE FROM</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{availableFrom}</p>
                  </div>
                </Col>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CURRENT TENANT</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{currentTenant}</p>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>

        {/* ── Residential Address ──────────────────────────────────────── */}
        <Card style={{ borderRadius: '0.5rem', border: '1px solid #dee2e6', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#000' }}>Residential Address</h4>
            <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1.75rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ADDRESS</p>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#000', margin: 0 }}>{addressLine}</p>
              </div>
              <Row>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CITY</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{city}</p>
                  </div>
                </Col>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>STATE</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{state}</p>
                  </div>
                </Col>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PO BOX</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{poBox}</p>
                  </div>
                </Col>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>GOOGLE MAP</p>
                    {mapUrl ? (
                      <a href={mapUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.938rem', fontWeight: 600, color: '#4f46e5', textDecoration: 'none' }}>View Location</a>
                    ) : (
                      <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>—</p>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>

        {/* ── System Information ───────────────────────────────────────── */}
        <Card style={{ borderRadius: '0.5rem', border: '1px solid #dee2e6', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: '#000' }}>System Information</h4>
            <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1.75rem' }}>
              <Row>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CREATED BY</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{createdByName}</p>
                  </div>
                </Col>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CREATED ON</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{createdAtStr}</p>
                  </div>
                </Col>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'black', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>LAST UPDATED</p>
                    <p style={{ fontSize: '0.938rem', fontWeight: 600, color: '#000', margin: 0 }}>{updatedAtStr}</p>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  );
};

export default PropertyDetails;