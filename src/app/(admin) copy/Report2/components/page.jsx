import { useCallback, useEffect, useState, useMemo } from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon as IconifyIcon } from '@iconify/react';
import PageTitle from '@/components/PageTitle';
import httpClient from '@/helpers/httpClient';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import { getPropertyImageUrl } from '@/utils/imageStorage';
import * as XLSX from 'xlsx';

const PAGE_SIZE = 10;
const HEADERS = { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' };

let cityCache = null;

// ─── Same status color helper as PropertiesCard ────────────────────────────
const getStatusVariant = (status) => {
  if (!status) return 'secondary';
  const s = status.toLowerCase();
  if (s === 'vacant' || s === 'available') return 'success';
  if (s === 'occupied') return 'danger';
  if (s === 'maintenance') return 'warning';
  return 'secondary';
};

const PropertyReportsPage = () => {
  const navigate = useNavigate();

  const [rawData, setRawData]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Top Bar ────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate]       = useState(null);
  const [toDate, setToDate]           = useState(null);

  // ─── Sidebar Filters ────────────────────────────────────────────────────
  const [allCities, setAllCities]       = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange]     = useState(20000);
  const [propType, setPropType]         = useState('all');
  const [features, setFeatures]         = useState({
    amenity_Parking: false,
    amenity_Lift: false,
    amenity_PowerBackup: false,
    amenity_Security: false,
    amenity_CCTV: false,
    amenity_GasPipeline: false,
    amenity_WaterSupply: false,
    amenity_Intercom: false,
    amenity_FireSafety: false
  });
  const [rentalFor, setRentalFor] = useState({
    tenant_Bachelor: false,
    tenant_Family: false,
    tenant_CompanyStaff: false,
    tenant_Labour: false
  });

  // ─── 1. Fetch Cities ─────────────────────────────────────────────────────
  useEffect(() => {
    if (cityCache) { setAllCities(cityCache); setCitiesLoading(false); return; }
    (async () => {
      setCitiesLoading(true);
      try {
        const res  = await httpClient.get(`${API_BASE_URL}/helper/city/get_all?limit=1000`, { headers: HEADERS });
        const data = res.data?.data?.data ?? res.data?.data ?? [];
        const cities = data.filter((c) => c.name);
        cityCache = cities;
        setAllCities(cities);
      } catch (e) { console.error('City fetch failed', e); }
      finally { setCitiesLoading(false); }
    })();
  }, []);

  // ─── 2. Fetch Properties ─────────────────────────────────────────────────
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get(`${API_BASE_URL}/property/get_all/?limit=1000`, { headers: HEADERS });
      if (res.data?.status) setRawData(res.data.data.data || res.data.data || []);
    } catch (e) { console.error('Failed to load properties', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  // ─── Reset pagination on filter change ───────────────────────────────────
  useEffect(() => { setCurrentPage(1); }, [
    searchQuery, fromDate, toDate, selectedCity,
    priceRange, propType, features, rentalFor,
  ]);

  // ─── 3. Filter Logic ─────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      const pd = item?.propertyDetails ?? {};

      // Search
      const title = String(item.buildingDetails || pd?.building_name || '').toLowerCase();
      const searchMatch = !searchQuery || title.includes(searchQuery.toLowerCase()) || String(item.propertyId || '').includes(searchQuery);

      // City
      const itemCity = (pd?.city || '').toLowerCase();
      const cityMatch = !selectedCity || itemCity.includes(selectedCity.toLowerCase());

      // Price
      const rentValue = parseFloat(pd?.monthly_rent ?? item.expectedRent ?? 0);
      const priceMatch = rentValue <= priceRange;

      // Property Type
      const itemRentalType = String(item.rentalType || '').toLowerCase();
      const propTypeMatch = propType === 'all' || itemRentalType === propType;

      // Features
      const activeFeatures = Object.keys(features).filter(k => features[k]);
      const villaStr = JSON.stringify(item.villaData || {}).toLowerCase();
      const commStr  = JSON.stringify(item.commercialData || {}).toLowerCase();
      const flatStr  = JSON.stringify(item.propertyDetails || {}).toLowerCase();
      const featuresMatch = activeFeatures.length === 0 || activeFeatures.every(f => {
        const amenityName = f.replace('amenity_', '').toLowerCase();
        return villaStr.includes(amenityName) || commStr.includes(amenityName) || flatStr.includes(amenityName);
      });

      // Rental For
      const activeRentalFor = Object.keys(rentalFor).filter(k => rentalFor[k]);
      const rentalForMatch = activeRentalFor.length === 0 || activeRentalFor.some(rf => {
        const tenantType = rf.replace('tenant_', '').toLowerCase();
        const itemRentalFor = String(item.rentalFor || '').toLowerCase();
        return itemRentalFor.includes(tenantType);
      });

      // Date
      let dateMatch = true;
      if (fromDate || toDate) {
        const itemDate = new Date(item.createdAt).getTime();
        if (!isNaN(itemDate)) {
          if (fromDate && itemDate < new Date(fromDate).setHours(0, 0, 0, 0))     dateMatch = false;
          if (toDate   && itemDate > new Date(toDate).setHours(23, 59, 59, 999)) dateMatch = false;
        }
      }

      return searchMatch && cityMatch && priceMatch && propTypeMatch && featuresMatch && rentalForMatch && dateMatch;
    });
  }, [rawData, searchQuery, selectedCity, priceRange, propType, features, rentalFor, fromDate, toDate]);

  // ─── Pagination ───────────────────────────────────────────────────────────
  const totalPages    = Math.ceil(filteredData.length / PAGE_SIZE) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  // ─── 4. Export Excel ──────────────────────────────────────────────────────
  const exportToExcel = () => {
    const excelData = filteredData.map(item => {
      const pd = item?.propertyDetails ?? {};
      return {
        'P. ID':        item.propertyId,
        'Building':     item.buildingDetails || pd?.building_name || 'N/A',
        'Rental Type':  item.rentalType || 'N/A',
        'Rental For':   item.rentalFor  || 'N/A',
        'Added By':     item.createdBy?.name || 'N/A',
        'City':         pd?.city || 'N/A',
        'Area (Sq.Ft)': pd?.carpet_area_sqft ?? item.dimensionAreaSqft ?? 'N/A',
        'Rent (OMR)':   pd?.monthly_rent ?? item.expectedRent ?? 'N/A',
        'Prop Status':  pd?.current_status || 'N/A',
        'Active':       item.isActive ? 'Active' : 'Inactive',
        'Created At':   new Date(item.createdAt).toLocaleDateString(),
      };
    });
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Property Report');
    XLSX.writeFile(wb, `Property_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // ─── Build display values ─────────────────────────────────────────────────
  const getCardValues = (item) => {
    const pd = item?.propertyDetails ?? {};
    const vd = item?.villaData       ?? {};
    const cd = item?.commercialData  ?? {};
    const wd = item?.warehouseData   ?? {};

    const rentalType = (item?.rentalType || '').toLowerCase();
    let name = '';
    if      (rentalType === 'flat')        name = pd?.building_name || item?.buildingDetails || `Flat #${item?.propertyId}`;
    else if (rentalType === 'villa')       name = vd?.villa_name    || pd?.building_name     || `Villa #${item?.propertyId}`;
    else if (rentalType === 'commercial')  name = cd?.building_complex_name || pd?.building_name || `Commercial #${item?.propertyId}`;
    else if (rentalType === 'warehouse')   name = wd?.warehouse_name        || pd?.building_name || `Warehouse #${item?.propertyId}`;
    else                                   name = item?.buildingDetails || pd?.building_name || `Property #${item?.propertyId}`;

    const location      = [pd?.city, pd?.country].filter(Boolean).join(', ') || pd?.address_line_1 || '—';
    const price         = pd?.monthly_rent    ?? item?.expectedRent    ?? '0';
    const carpetArea    = pd?.carpet_area_sqft ?? item?.dimensionAreaSqft ?? '—';
    const currentStatus = pd?.current_status  || '';
    const image         = getPropertyImageUrl(item?.propertyId, item?.photos);
    const statusVariant = getStatusVariant(currentStatus);

    return { name, location, price, carpetArea, currentStatus, image, statusVariant };
  };

  // ─── Feature options ──────────────────────────────────────────────────────
  const featureOptions = [
    { key: 'amenity_Parking', label: 'Parking' },
    { key: 'amenity_Lift', label: 'Lift' },
    { key: 'amenity_PowerBackup', label: 'Power Backup' },
    { key: 'amenity_Security', label: 'Security' },
    { key: 'amenity_CCTV', label: 'CCTV' },
    { key: 'amenity_GasPipeline', label: 'Gas Pipeline' },
    { key: 'amenity_WaterSupply', label: 'Water Supply' },
    { key: 'amenity_Intercom', label: 'Intercom' },
    { key: 'amenity_FireSafety', label: 'Fire Safety' },
  ];

  // ─── Rental For options ───────────────────────────────────────────────────
  const rentalForOptions = [
    { name: 'tenant_Bachelor', label: 'Bachelor' },
    { name: 'tenant_Family', label: 'Family' },
    { name: 'tenant_CompanyStaff', label: 'Company Staff' },
    { name: 'tenant_Labour', label: 'Labour' },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <PageTitle title="Property Reports" />

      {/* TOP SEARCH BAR */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <CardBody style={{ padding: '1rem 1.5rem' }}>
              <Row className="align-items-center g-3">
                <Col lg={3} md={6}>
                  <div className="position-relative">
                    <input
                      type="search" className="form-control"
                      placeholder="Search Property ID or Building..."
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '2.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.875rem' }}
                    />
                    <IconifyIcon icon="solar:magnifer-broken" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.25rem' }} />
                  </div>
                </Col>
                <Col lg={2} md={6}>
                  <h5 className="mb-0" style={{ fontSize: '0.938rem', fontWeight: 600, color: '#1e293b' }}>
                    {filteredData.length} <span style={{ color: '#64748b', fontWeight: 400 }}>Properties</span>
                  </h5>
                </Col>
                <Col lg={7} md={12}>
                  <div className="d-flex justify-content-lg-end gap-2 flex-wrap">
                    <DatePicker selected={fromDate} onChange={date => setFromDate(date)} placeholderText="From Date" className="form-control w-auto" dateFormat="dd/MM/yyyy" />
                    <DatePicker selected={toDate}   onChange={date => setToDate(date)}   placeholderText="To Date"   className="form-control w-auto" dateFormat="dd/MM/yyyy" />
                    <Button onClick={exportToExcel} variant="success" className="d-flex align-items-center gap-1" style={{ borderRadius: '0.5rem', fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}>
                      <IconifyIcon icon="ri:file-excel-2-line" /> Export Excel
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* ── LEFT SIDEBAR ───────────────────────────────────────────────── */}
        <Col xl={3} lg={4} md={12}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <CardHeader className="bg-white border-bottom" style={{ padding: '1.25rem 1.5rem' }}>
              <CardTitle as="h5" className="mb-1" style={{ fontSize: '1rem', fontWeight: 600, color: '#6c757d' }}>Property</CardTitle>
              <p className="mb-0" style={{ fontSize: '0.813rem', color: '#8e9aaf' }}>Show {filteredData.length.toLocaleString()} Properties</p>
            </CardHeader>

            <CardBody style={{ padding: '1.5rem' }}>

              {/* 1. City */}
              <div className="mb-4">
                <h6 className="mb-2" style={{ fontSize: '0.813rem', fontWeight: 600, color: 'black' }}>City :</h6>
                <select
                  className="form-select"
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  disabled={citiesLoading}
                  style={{ border: '1px solid #dee2e6', borderRadius: '0.5rem', fontSize: '0.813rem', color: '#4a5568' }}
                >
                  <option value="">{citiesLoading ? 'Loading cities…' : 'All Cities'}</option>
                  {allCities.map(c => (
                    <option key={c.cityId} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* 2. Price Range */}
              <div className="mb-4">
                <h6 className="mb-3" style={{ fontSize: '0.813rem', fontWeight: 600, color: 'black' }}>Custom Price Range :</h6>
                <input type="range" className="form-range" min="0" max="20000" step="500" value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} style={{ accentColor: '#3b4b7d' }} />
                <div className="d-flex align-items-center gap-2 mt-2">
                  <input className="form-control text-center" type="text" value="OMR 0" readOnly style={{ border: '1px solid #dee2e6', borderRadius: '0.375rem', fontSize: '0.813rem', padding: '0.5rem', color: '#4a5568' }} />
                  <span className="fw-medium" style={{ fontSize: '0.813rem', color: '#6c757d' }}>to</span>
                  <input className="form-control text-center" type="text" value={`OMR ${priceRange}`} readOnly style={{ border: '1px solid #dee2e6', borderRadius: '0.375rem', fontSize: '0.813rem', padding: '0.5rem', color: '#4a5568' }} />
                </div>
              </div>

              {/* 3. Property Type */}
              <div className="mb-4">
                <h6 className="mb-3" style={{ fontSize: '0.813rem', fontWeight: 600, color: 'black' }}>Property Type :</h6>
                <select
                  className="form-select"
                  value={propType}
                  onChange={e => setPropType(e.target.value)}
                  style={{ border: '1px solid #dee2e6', borderRadius: '0.5rem', fontSize: '0.813rem', color: '#4a5568' }}
                >
                  <option value="all">All</option>
                  <option value="flat">Flat / Apartment</option>
                  <option value="villa">Villa / Bungalow</option>
                  <option value="commercial">Commercial</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </div>

              {/* 4. Accessibility Features */}
              <div className="mb-4">
                <h6 className="mb-3" style={{ fontSize: '0.813rem', fontWeight: 600, color: 'black' }}>Accessibility Features :</h6>
                <Row className="g-2">
                  {featureOptions.map(({ key, label }) => (
                    <Col xs={6} key={key}>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id={`feat-${key}`} 
                          checked={features[key]} 
                          onChange={() => setFeatures({ ...features, [key]: !features[key] })} 
                        />
                        <label className="form-check-label text-muted small" htmlFor={`feat-${key}`}>{label}</label>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* 5. Rental For */}
              <div className="mb-2">
                <h6 className="mb-3" style={{ fontSize: '0.813rem', fontWeight: 600, color: 'black' }}>Rental For :</h6>
                <Row className="g-2">
                  {rentalForOptions.map(({ name, label }) => (
                    <Col xs={6} key={name}>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id={`rf-${name}`} 
                          checked={rentalFor[name]} 
                          onChange={() => setRentalFor({ ...rentalFor, [name]: !rentalFor[name] })} 
                        />
                        <label className="form-check-label text-muted small" htmlFor={`rf-${name}`}>{label}</label>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

            </CardBody>
          </Card>
        </Col>

        {/* ── RIGHT — TABLE ──────────────────────────────────────────────── */}
        <Col xl={9} lg={8} md={12}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover">
                  <thead style={{ backgroundColor: '#F9F9FC' }}>
                    <tr>
                      <th style={{ padding: '0.875rem 1rem', fontSize: '0.688rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>P. ID</th>
                      <th style={{ padding: '0.875rem 1rem', fontSize: '0.688rem', fontWeight: 600, color: '#64748b' }}>PROPERTY</th>
                      <th style={{ padding: '0.875rem 1rem', fontSize: '0.688rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>RENTAL TYPE</th>
                      <th style={{ padding: '0.875rem 1rem', fontSize: '0.688rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>RENTAL FOR</th>
                      <th style={{ padding: '0.875rem 1rem', fontSize: '0.688rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>ADDED BY</th>
                      <th style={{ padding: '0.875rem 1rem', fontSize: '0.688rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>AREA (SQ.FT)</th>
                      <th style={{ padding: '0.875rem 1rem', fontSize: '0.688rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>RENT</th>
                      <th style={{ padding: '0.875rem 1rem', fontSize: '0.688rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>PROP STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="10" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                    ) : paginatedData.length > 0 ? (
                      paginatedData.map((item, idx) => {
                        const { name, location, price, carpetArea, currentStatus, image, statusVariant } = getCardValues(item);
                        return (
                          <tr key={item.propertyId ?? idx} style={{ borderBottom: '1px solid #f1f5f9' }}>

                            {/* P. ID */}
                            <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.813rem', whiteSpace: 'nowrap' }}>
                              #{item.propertyId ?? 'N/A'}
                            </td>

                            {/* PROPERTY */}
                            <td style={{ padding: '0.75rem 1rem', minWidth: '210px' }}>
                              <div className="d-flex align-items-center gap-2">
                                <div style={{ width: '44px', height: '44px', flexShrink: 0, borderRadius: '0.375rem', overflow: 'hidden', background: '#e2e8f0' }}>
                                  <img
                                    src={image}
                                    alt={name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/property-placeholder.png'; }}
                                  />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }} title={name}>
                                    {name}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }} title={location}>
                                    {location}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* RENTAL TYPE */}
                            <td style={{ padding: '0.75rem 1rem', color: '#5d6eb8', fontSize: '0.813rem', whiteSpace: 'nowrap' }}>
                              {item.rentalType || '—'}
                            </td>

                            {/* RENTAL FOR */}
                            <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.813rem', whiteSpace: 'nowrap' }}>
                              {item.rentalFor || '—'}
                            </td>

                            {/* ADDED BY */}
                            <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.813rem', whiteSpace: 'nowrap' }}>
                              {item.createdBy?.name || '—'}
                            </td>

                            {/* AREA */}
                            <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.813rem', whiteSpace: 'nowrap' }}>
                              {carpetArea !== '—' ? `${carpetArea} sqft` : '—'}
                            </td>

                            {/* RENT */}
                            <td style={{ padding: '0.75rem 1rem', color: '#1e293b', fontSize: '0.813rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              {price ? `OMR ${parseFloat(price).toLocaleString()}` : '—'}
                            </td>

                            {/* PROP STATUS */}
                            <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                              {currentStatus
                                ? <Badge bg={statusVariant} style={{ fontSize: '0.75rem' }}>{currentStatus}</Badge>
                                : '—'}
                            </td>

                          </tr>
                        );
                      })
                    ) : (
                      <tr><td colSpan="10" className="text-center py-4 text-muted">No properties found matching these filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>

            {/* Pagination */}
            <div className="border-top bg-white d-flex justify-content-between align-items-center" style={{ padding: '1rem 1.5rem', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
              <div className="text-muted small">Showing {paginatedData.length} of {filteredData.length} properties</div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link text-secondary" onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)} style={currentPage === i + 1 ? { backgroundColor: '#3b4b7d', borderColor: '#3b4b7d' } : {}}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link text-secondary" onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PropertyReportsPage;