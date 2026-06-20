import WorldVectorMap from '@/components/VectorMap/WorldMap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect, useState } from 'react';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import httpClient from '@/helpers/httpClient';
import {
  Card, CardBody, CardHeader, CardTitle, Col,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row
} from 'react-bootstrap';

const countryNameToCoords = {
  'India':                [20.5937,   78.9629],
  'United States':        [37.0902,  -95.7129],
  'United Kingdom':       [55.3781,   -3.4360],
  'Canada':               [56.1304, -106.3468],
  'Australia':            [-25.2744, 133.7751],
  'Germany':              [51.1657,   10.4515],
  'France':               [46.2276,    2.2137],
  'Japan':                [36.2048,  138.2529],
  'Brazil':               [-14.235,  -51.9253],
  'UAE':                  [23.4241,   53.8478],
  'United Arab Emirates': [23.4241,   53.8478],
  'Saudi Arabia':         [23.8859,   45.0792],
  'Kuwait':               [29.3117,   47.4818],
  'Qatar':                [25.3548,   51.1839],
  'Bahrain':              [26.0667,   50.5577],
  'Jordan':               [30.5852,   36.2384],
  'Egypt':                [26.8206,   30.8025],
  'Pakistan':             [30.3753,   69.3451],
  'Philippines':          [12.8797,  121.7740],
  'Oman':                 [21.4735,   55.9754],
  'Bangladesh':           [23.6850,   90.3563],
  'Russia':               [61.0,     105.0   ],
  'China':                [35.8617,  104.1954],
  'Sri Lanka':            [ 7.8731,   80.7718],
  'Nepal':                [28.3949,   84.1240],
  'Nigeria':              [ 9.0820,    8.6753],
  'South Africa':         [-30.5595,  22.9375],
  'Turkey':               [38.9637,   35.2433],
};

const progressVariants = [
  'bg-primary',
  'bg-primary bg-opacity-75',
  'bg-primary bg-opacity-50',
  'bg-primary bg-opacity-25',
  'bg-primary bg-opacity-10',
];

const SalesLocation = () => {
  const [allCountries, setAllCountries]   = useState([]);
  const [countryCounts, setCountryCounts] = useState([]);
  const [totalLeads, setTotalLeads]       = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // ✅ Dono APIs parallel fetch karo
        const [countryRes, leadRes] = await Promise.all([
          httpClient.get(`${API_BASE_URL}/helper/country/get_all`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' },
          }),
          httpClient.get(`${API_BASE_URL}/lead/get_all/`, {  // ← trailing slash
            headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' },
          }),
        ]);
  
        const countriesList = countryRes.data?.data?.data ?? [];
        setAllCountries(countriesList);
  
        const countryIdToName = {};
        countriesList.forEach((c) => { countryIdToName[c.countryId] = c.name; });
  
        const leads =
          leadRes.data?.data?.data ??
          leadRes.data?.data ??
          leadRes.data?.leads ??
          [];
  
        if (!Array.isArray(leads) || leads.length === 0) {
          setCountryCounts([]);
          setTotalLeads(0);
          return;
        }
  
        const countMap = {};
        leads.forEach((lead) => {
          let countryName = '';
  
          if (typeof lead.country === 'string' && lead.country.trim()) {
            countryName = lead.country.trim();
          } else if (typeof lead.country === 'object' && lead.country !== null) {
            countryName = lead.country?.name?.trim() || lead.country?.countryName?.trim() || '';
          } else if (lead.countryId && countryIdToName[lead.countryId]) {
            countryName = countryIdToName[lead.countryId];
          } else if (typeof lead.countryName === 'string') {
            countryName = lead.countryName.trim();
          }
  
          if (!countryName) return;
  
          const matched = countriesList.find(
            (c) => c.name.toLowerCase() === countryName.toLowerCase()
          );
          const finalName = matched ? matched.name : countryName;
          countMap[finalName] = (countMap[finalName] || 0) + 1;
        });
  
        const total = Object.values(countMap).reduce((a, b) => a + b, 0);
        const sorted = Object.entries(countMap)
          .map(([name, count]) => ({
            name,
            count,
            percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0',
          }))
          .sort((a, b) => b.count - a.count);
  
        setCountryCounts(sorted);
        setTotalLeads(total);
  
      } catch (err) {
        console.error('❌ Error:', err?.response?.status, err?.config?.url, err?.message);
        setError(`${err?.response?.status ?? 'Network'} — ${err?.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAll();
  }, []);

  const markers = countryCounts
    .filter((c) => countryNameToCoords[c.name])
    .map((c) => ({
      name: `${c.name}: ${c.count} lead${c.count !== 1 ? 's' : ''} (${c.percentage}%)`,
      coords: countryNameToCoords[c.name],
      style: { fill: '#7f56da' },
    }));

  const noLeadMarkers = allCountries
    .filter((c) => countryNameToCoords[c.name])
    .filter((c) => !countryCounts.find((cc) => cc.name === c.name))
    .map((c) => ({
      name: c.name,
      coords: countryNameToCoords[c.name],
      style: { fill: '#d0d9e0' },
    }));

  const top5 = countryCounts.slice(0, 5);

  const mapOptions = {
    map: 'world',
    zoomOnScroll: true,
    zoomButtons: false,
    markersSelectable: true,
    markers: [...markers, ...noLeadMarkers],
    markerStyle: {
      initial: { fill: '#aab8c5' },
      hover:   { fill: '#7f56da' },
      selected:{ fill: '#1bb394' },
    },
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1,
      },
    },
  };

  return (
    <Col xl={6} lg={6}>
      <Card style={{ height: '510px' }}>
        <CardHeader className="d-flex justify-content-between align-items-center pb-1">
          <div>
            <CardTitle as="h4">Most Sales Location</CardTitle>
            <small className="text-muted">
              {loading
                ? 'Loading...'
                : error
                  ? <span className="text-danger">{error}</span>
                  : `Based on ${totalLeads} leads · ${allCountries.length} countries tracked`}
            </small>
          </div>
          <Dropdown>
            <DropdownToggle
              as="a"
              className="btn btn-sm btn-outline-light rounded content-none icons-center"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Top Countries{' '}
              <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              {top5.length > 0
                ? top5.map((c) => (
                    <DropdownItem key={c.name}>
                      {c.name} — {c.count} leads ({c.percentage}%)
                    </DropdownItem>
                  ))
                : <DropdownItem disabled>No lead data yet</DropdownItem>}
            </DropdownMenu>
          </Dropdown>
        </CardHeader>

        <CardBody>
          <Row>
            <Col xl={12}>
              <div style={{ height: 280 }}>
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    <div className="spinner-border spinner-border-sm me-2" role="status" />
                    Loading map...
                  </div>
                ) : (
                  <WorldVectorMap height="280" width="100%" options={mapOptions} />
                )}
              </div>
            </Col>
          </Row>

          {/* Progress Bar */}
          {!loading && top5.length > 0 && (
            <div className="mt-3">
              <div className="d-flex mb-1">
                {top5.map((country) => (
                  <div key={country.name} style={{ flex: 1, paddingRight: '2px' }}>
                    <p className="text-dark mb-0 fs-12 fw-semibold text-truncate" title={country.name}>
                      {country.name}
                    </p>
                    <p className="text-muted mb-0 fs-11">{country.count} lead{country.count !== 1 ? 's' : ''}</p>
                  </div>
                ))}
              </div>
              <div className="progress overflow-hidden" style={{ height: 24, borderRadius: '6px' }}>
                {top5.map((country, index) => (
                  <div
                    key={country.name}
                    className={`progress-bar ${progressVariants[index] ?? progressVariants[4]}`}
                    role="progressbar"
                    style={{ width: `${Math.max(parseFloat(country.percentage), 5)}%` }}
                    title={`${country.name}: ${country.percentage}%`}
                  >
                    <span className="text-white fs-12 px-1">{country.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && top5.length === 0 && (
            <div className="text-center text-muted mt-3">
              <p className="mb-0 fs-13">No lead location data available</p>
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default SalesLocation;