import { useCallback, useEffect, useState, useMemo } from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, Col, Row, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon as IconifyIcon } from '@iconify/react';
import PageTitle from '@/components/PageTitle';
import httpClient from '@/helpers/httpClient';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import * as XLSX from 'xlsx';

// Constants
const LANDLORD_PURPOSES = ['landlord', 'owner', 'company'];
const ORIGINS = ["Open Sooq", "OLX", "Employee Referral", "Reference", "Website Inquiry", "Instagram", "Facebook", "Twitter", "LinkedIn", "Walk-in Customer", "Phone Call Inquiry", "Office Visit", "Online Property Portal", "Printing Banner", "wa", "call"];
const PAGE_SIZE = 10;
const HEADERS = { Authorization: `Bearer ${AUTH_TOKEN}` };

// Global caches to prevent redundant API calls
let countryCache = null;
let cityCache = null;

const getAvatarColor = (name) => {
  const char = String(name || 'L').charAt(0).toUpperCase();
  if (char < 'G') return 'bg-soft-primary text-primary';
  if (char < 'M') return 'bg-soft-success text-success';
  return 'bg-soft-warning text-warning';
};

const LandlordAvatar = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = item.profileImage || item.avatar || item.image || item.user?.avatar;

  if (imageUrl && !imgError) {
    return (
      <img
        src={imageUrl}
        alt={`${item.firstName} avatar`}
        className="rounded-circle"
        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`${getAvatarColor(item.firstName)} rounded-circle d-flex align-items-center justify-content-center`}
      style={{ width: '32px', height: '32px', fontWeight: 600, fontSize: '0.8rem' }}
    >
      {item.firstName?.charAt(0) || 'U'}
    </div>
  );
};

const LandlordReportsPage = () => {
  const navigate = useNavigate();

  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [countries, setCountries]               = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [selectedCountry, setSelectedCountry]   = useState('');

  const [allCities, setAllCities]               = useState([]);
  const [citiesLoading, setCitiesLoading]       = useState(true);
  const [filteredCities, setFilteredCities]     = useState([]);
  const [selectedCity, setSelectedCity]         = useState('');

  const [searchQuery, setSearchQuery]       = useState("");
  const [fromDate, setFromDate]             = useState(null);
  const [toDate, setToDate]                 = useState(null);
  const [landlordType, setLandlordType]     = useState({ active: true, inactive: true });
  const [selectedOrigin, setSelectedOrigin] = useState("Select Origin");

  /* ── 1. Fetch countries ─────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      setCountriesLoading(true);
      try {
        if (countryCache) {
          setCountries(countryCache);
        } else {
          const res  = await httpClient.get(`${API_BASE_URL}/helper/country/get_all?limit=1000`, { headers: HEADERS });
          const data = res.data?.data?.data ?? res.data?.data ?? [];
          const validData = data.filter((c) => c.name);
          countryCache = validData;
          setCountries(validData);
        }
      } catch (e) {
        console.error('Countries fetch error:', e);
      } finally {
        setCountriesLoading(false);
      }
    })();
  }, []);

  /* ── 2. Fetch ALL cities once ───────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      setCitiesLoading(true);
      try {
        if (cityCache) {
          setAllCities(cityCache);
        } else {
          const res  = await httpClient.get(`${API_BASE_URL}/helper/city/get_all?limit=1000`, { headers: HEADERS });
          const data = res.data?.data?.data ?? res.data?.data ?? [];
          const validData = data.filter((c) => c.name);
          cityCache = validData;
          setAllCities(validData);
        }
      } catch (e) {
        console.error('Cities fetch error:', e);
      } finally {
        setCitiesLoading(false);
      }
    })();
  }, []);

  /* ── 3. Filter cities whenever country selection or allCities changes ─ */
  useEffect(() => {
    setSelectedCity('');
    if (!selectedCountry) {
      setFilteredCities(allCities);
      return;
    }
    const norm = selectedCountry.trim().toLowerCase();
    const matched = allCities.filter(
      (c) => (c.countryName ?? '').trim().toLowerCase() === norm
    );
    setFilteredCities(matched);
  }, [selectedCountry, allCities]);

  /* ── 4. Fetch Leads ─────────────────────────────────────────────────── */
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/lead/get_all/?limit=1000`;
      const res = await httpClient.get(url, { headers: HEADERS });
      if (res.data?.status) setRawData(res.data.data.data);
    } catch (e) { console.error('Load leads failed', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, fromDate, toDate, selectedCity, selectedCountry, landlordType, selectedOrigin]);

  /* ── 5. LIVE FILTER LOGIC ───────────────────────────────────────────── */
  const filteredData = useMemo(() => {
    return rawData.filter((lead) => {
      const purpose = String(lead.purpose || '').toLowerCase();
      if (!LANDLORD_PURPOSES.includes(purpose)) return false;

      const fullName = `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase();
      const searchMatch = !searchQuery || fullName.includes(searchQuery.toLowerCase()) || String(lead.leadId).includes(searchQuery);

      const cityMatch = !selectedCity || lead.city === selectedCity;

      const statusMatch = (landlordType.active && lead.isActive) || (landlordType.inactive && !lead.isActive);

      const originMatch = selectedOrigin === "Select Origin" ||
        String(lead.leadOrigin || '').toLowerCase() === selectedOrigin.toLowerCase();

      let dateMatch = true;
      if (fromDate || toDate) {
        const leadDate = new Date(lead.createdAt).getTime();
        if (!isNaN(leadDate)) {
          if (fromDate) {
            const start = new Date(fromDate).setHours(0, 0, 0, 0);
            if (leadDate < start) dateMatch = false;
          }
          if (toDate) {
            const end = new Date(toDate).setHours(23, 59, 59, 999);
            if (leadDate > end) dateMatch = false;
          }
        }
      }

      return searchMatch && cityMatch && statusMatch && originMatch && dateMatch;
    });
  }, [rawData, searchQuery, selectedCity, landlordType, selectedOrigin, fromDate, toDate]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const exportToExcel = () => {
    const excelData = filteredData.map(t => ({
      "Landlord ID": t.leadId,
      "Name": `${t.firstName} ${t.lastName}`,
      "Source": t.leadOrigin || 'N/A',
      "Contact": t.phoneNumber || t.phone_number || 'N/A',
      "Handled By": t.leadAssignTo?.name || 'Unassigned',
      "Nationality": t.nationality || 'N/A',
      "Status": t.isActive ? "Active" : "Inactive",
      "Created At": new Date(t.createdAt).toLocaleDateString()
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Landlord Report");
    XLSX.writeFile(wb, `Landlord_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <>
      <PageTitle title="Reports and Analysis" />

      <Row className="mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <CardBody className="p-3">
              <Row className="align-items-center g-3">
                <Col lg={3}>
                  <div className="position-relative">
                    <input type="search" className="form-control" placeholder="Search name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
                    <IconifyIcon icon="solar:magnifer-broken" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
                  </div>
                </Col>
                <Col lg={2}>
                  <h5 className="mb-0">{filteredData.length} <span className="text-muted fw-normal">Landlords</span></h5>
                </Col>
                <Col lg={7}>
                  <div className="d-flex justify-content-lg-end gap-2 flex-wrap">
                    <DatePicker selected={fromDate} onChange={d => setFromDate(d)} placeholderText="From Date" className="form-control" dateFormat="dd/MM/yyyy" />
                    <DatePicker selected={toDate} onChange={d => setToDate(d)} placeholderText="To Date" className="form-control" dateFormat="dd/MM/yyyy" />
                    <Button onClick={exportToExcel} variant="success" className="d-flex align-items-center gap-1">
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
        {/* SIDEBAR FILTERS */}
        <Col xl={3} lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <CardHeader className="bg-white border-bottom p-3">
              <CardTitle as="h4" className="mb-1">Properties</CardTitle>
              <p className="text-muted mb-0 small">Show {filteredData.length.toLocaleString()} Properties</p>
            </CardHeader>
            <CardBody>

              {/* Country Dropdown */}
              <div className="mb-4">
                <label className="form-label fw-bold small">Country</label>
                <select className="form-select mb-3" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} disabled={countriesLoading}>
                  <option value="">{countriesLoading ? 'Loading countries…' : 'All Countries'}</option>
                  {countries.map((c) => (
                    <option key={c.id || c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div className="mb-4">
                <label className="form-label fw-bold small">Lead Location (City)</label>
                <select className="form-select mb-3" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={citiesLoading}>
                  <option value="">
                    {citiesLoading ? 'Loading cities…' : filteredCities.length === 0 && selectedCountry ? 'No cities for this country' : 'All Cities'}
                  </option>
                  {filteredCities.map((c) => (
                    <option key={c.cityId || c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Landlord Type */}
              <div className="mb-4">
                <label className="form-label fw-bold small">Landlord Type :</label>
                <div className="d-flex flex-column gap-2">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={landlordType.active} onChange={() => setLandlordType({ ...landlordType, active: !landlordType.active })} id="act" />
                    <label className="form-check-label text-muted small" htmlFor="act">Active Landlord</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={landlordType.inactive} onChange={() => setLandlordType({ ...landlordType, inactive: !landlordType.inactive })} id="inact" />
                    <label className="form-check-label text-muted small" htmlFor="inact">Inactive Landlord</label>
                  </div>
                </div>
              </div>

              {/* Lead Origin */}
              <div className="mb-4">
                <label className="form-label fw-bold small">Lead Origin</label>
                <select className="form-select" value={selectedOrigin} onChange={e => setSelectedOrigin(e.target.value)}>
                  <option>Select Origin</option>
                  {ORIGINS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

            </CardBody>
          </Card>
        </Col>

        {/* TABLE */}
        <Col xl={9} lg={8}>
          <Card className="border-0 shadow-sm">
            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0 text-nowrap table-hover">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-3 small text-uppercase text-muted">Landlord ID</th>
                      <th className="small text-uppercase text-muted">Landlord Photo & Name</th>
                      <th className="small text-uppercase text-muted">Source</th>
                      <th className="small text-uppercase text-muted">Contact</th>
                      <th className="small text-uppercase text-muted">Handled By</th>
                      <th className="small text-uppercase text-muted">Nationality</th>
                      <th className="small text-uppercase text-muted">Status</th>
                      <th className="small text-uppercase text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="8" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                    ) : paginatedLeads.length > 0 ? (
                      paginatedLeads.map((item) => (
                        <tr key={item.leadId}>
                          <td className="ps-3 text-muted">#{item.leadId}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <LandlordAvatar item={item} />
                              <div className="fw-medium text-dark">{item.firstName || ''} {item.lastName || ''}</div>
                            </div>
                          </td>
                          <td><Badge bg="soft-primary" className="text-primary text-capitalize">{item.leadOrigin || '—'}</Badge></td>
                          <td className="text-muted small">{item.phoneNumber || item.phone_number || '—'}</td>
                          <td className="text-muted small">{item.leadAssignTo?.name || 'Unassigned'}</td>
                          <td className="text-muted small">{item.nationality || '—'}</td>
                          <td><Badge bg={item.isActive ? "soft-success" : "soft-danger"} className={item.isActive ? "text-success" : "text-danger"}>{item.isActive ? "Active" : "Inactive"}</Badge></td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button variant="light" size="sm" title="View details" onClick={() => navigate('/lead/preview', { state: { lead: item } })}>
                                <IconifyIcon icon="solar:eye-broken" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="8" className="text-center py-4 text-muted">No landlords found matching these filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
            <CardFooter className="bg-white border-top d-flex justify-content-between align-items-center p-3">
              <div className="text-muted small">Showing {paginatedLeads.length} of {filteredData.length} records</div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button></li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}><button className="page-link" onClick={() => setCurrentPage(i + 1)} style={currentPage === i + 1 ? { backgroundColor: '#3b4b7d', borderColor: '#3b4b7d', color: '#fff' } : {}}>{i + 1}</button></li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button></li>
                </ul>
              </nav>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LandlordReportsPage;