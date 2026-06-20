import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import httpClient from '@/helpers/httpClient';
import { getPropertyImageUrl } from '@/utils/imageStorage';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const getStatusVariant = (status) => {
  if (!status) return 'secondary';
  const s = status.toLowerCase();
  if (s === 'vacant' || s === 'available') return 'success';
  if (s === 'occupied') return 'danger';
  if (s === 'maintenance') return 'warning';
  return 'secondary';
};

const PropertiesCard = ({
  carpetArea, builtUpArea, icon, location, name, price,
  image, landlordName, currentStatus, raw, onEdit, onDelete,
}) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    if (raw?.propertyId) {
      navigate('/landlord/detailspage', { state: { propertyId: raw.propertyId, property: raw } });
    } else {
      navigate('/landlord/detailspage');
    }
  };

  const statusVariant = getStatusVariant(currentStatus);

  return (
    <Card onClick={handleCardClick} style={{ cursor: 'pointer', minWidth: 0 }} className="overflow-hidden h-100 w-100">
      <div className="position-relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <img src={image} alt="properties" className="img-fluid rounded-top w-100 h-100" style={{ objectFit: 'cover' }} />
        {currentStatus && (
          <span className="position-absolute top-0 end-0 p-1">
            <span className={`badge bg-${statusVariant} text-white fs-13`}>{currentStatus}</span>
          </span>
        )}
      </div>

      <CardBody className="d-flex flex-column" style={{ minHeight: 0 }}>
        <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
          <div className="avatar bg-light rounded flex-centered flex-shrink-0">
            <IconifyIcon icon={icon} width={24} height={24} className="fs-24 text-primary" />
          </div>
          <div className="min-w-0 flex-grow-1">
            <div className="text-dark fw-medium fs-16 text-truncate" title={name}>{name}</div>
            <p className="text-muted mb-0 text-truncate small" title={location}>{location}</p>
          </div>
        </div>

        <Row className="mt-2 g-2">
          <Col xs={6}>
            <span className="badge bg-light-subtle text-muted border fs-12 d-flex align-items-center gap-1 w-100" style={{ padding: '8px 6px' }}>
              <IconifyIcon icon="solar:scale-broken" className="fs-14 flex-shrink-0" />
              <span className="text-truncate" title="Carpet Area">{carpetArea} sqft</span>
            </span>
          </Col>
          <Col xs={6}>
            <span className="badge bg-light-subtle text-muted border fs-12 d-flex align-items-center gap-1 w-100" style={{ padding: '8px 6px' }}>
              <IconifyIcon icon="solar:home-2-broken" className="fs-14 flex-shrink-0" />
              <span className="text-truncate" title="Built-up Area">{builtUpArea} sqft</span>
            </span>
          </Col>
          <Col xs={12}>
            <span className="badge bg-primary-subtle text-primary border fs-13 d-flex align-items-center gap-1 w-100" style={{ padding: '8px 6px' }}>
            <IconifyIcon icon="material-symbols:currency-rupee" className="fs-16 flex-shrink-0" />
              <span className="text-truncate fw-semibold">OMR {price}/month</span>
            </span>
          </Col>
        </Row>

        <p className="mb-0 mt-2 small text-muted" style={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
          <span className="d-inline-block text-truncate" style={{ maxWidth: '100%' }} title={`Landlord: ${landlordName || '---'}`}>
            Landlord : <span className="fw-medium">{landlordName || '---'}</span>
          </span>
        </p>
      </CardBody>

      <CardFooter className="bg-light-subtle d-flex justify-content-between align-items-center border-top flex-wrap gap-2 mt-auto">
        <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()}>
          {onEdit && raw && (
            <Button variant="soft-primary" size="sm" title="Edit" onClick={(e) => { e.stopPropagation(); onEdit(raw); }}>
              <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
            </Button>
          )}
          {onDelete && raw && (
            <Button variant="soft-danger" size="sm" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(raw); }}>
              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

/* ── UPDATED Logic (Using rentalFor) ── */
const applyClientFilters = (items, filters) => {
  if (!filters) return items;
  if (!Array.isArray(items)) return [];
  return items.filter((item) => {
    const d  = item?.data ?? item;
    const pd = d?.propertyDetails ?? {};
    
    // Price Filter
    const priceNum = parseFloat(pd?.monthly_rent ?? d?.expectedRent ?? 0) || 0;
    if (filters.minPrice != null && priceNum < Number(filters.minPrice)) return false;
    if (filters.maxPrice != null && priceNum > Number(filters.maxPrice)) return false;

    // City Filter
    if (filters.city && filters.city !== '') {
      const propCity = (pd?.city || '').toLowerCase();
      if (!propCity.includes(filters.city.toLowerCase())) return false;
    }

    // Property Type (Multiselect) - Case Insensitive check
    if (filters.propertyType && filters.propertyType.length > 0) {
      const rt = (d?.rentalType || '').toLowerCase();
      const match = filters.propertyType.some(f => f.toLowerCase() === rt);
      if (!match) return false;
    }

    // Rental For (Using d.rentalFor from your screenshot)
    if (filters.tenantType && filters.tenantType.length > 0) {
      const rf = (d?.rentalFor || '').toLowerCase();
      const match = filters.tenantType.some(f => f.toLowerCase() === rf);
      if (!match) return false;
    }

    return true;
  });
};

const buildGetAllUrl = (params) => {
  const search = new URLSearchParams();
  if (params.filter_key   != null) search.set('filter_key',   params.filter_key);
  if (params.filter_value != null) search.set('filter_value', params.filter_value);
  const qs = search.toString();
  return `${API_BASE_URL}/property/get_all/${qs ? `?${qs}` : ''}`;
};

const fetchAllLandlordNames = async () => {
  try {
    const response = await httpClient.get(`${API_BASE_URL}/lead/get_all/?limit=999999`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' },
    });

    const rawData = response.data?.data?.data ?? response.data?.data ?? response.data ?? [];
    const leads = Array.isArray(rawData) ? rawData : [];

    console.log('📋 Total leads:', leads.length);
    console.log('📋 Sample:', leads[0]);

    const map = {};
    leads.forEach((lead) => {
      const id = lead.leadId ?? lead.id;
      if (!id) return;
      const fullName = [lead.firstName || '', lead.lastName || ''].join(' ').trim();
      const name = fullName || lead.name || lead.companyName || `#${id}`;
      map[id] = name;
      map[String(id)] = name;
    });

    console.log('📋 LandlordMap:', map);
    return map;
  } catch (e) {
    console.error('❌ Error fetching landlords:', e);
    return {};
  }
};

const PropertiesData = ({ filters = {} }) => {
  const navigate = useNavigate();
  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [landlordMap, setLandlordMap] = useState({});

  const [params] = useState(() => ({
    filter_key:   'is_active',
    filter_value: 'true',
  }));

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = buildGetAllUrl(params);
      const res = await httpClient.get(url, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' },
      });
      const payload = res.data;
      const empty   = { data: [], presentPage: 1, totalPage: 0 };
      if (!payload) { setData(empty); return; }
      const page = payload.data;
      if (Array.isArray(page)) {
        setData({ data: page, presentPage: payload.presentPage ?? 1, totalPage: payload.totalPage ?? 0 });
      } else if (page && (Array.isArray(page.data) || page.presentPage !== undefined)) {
        setData({ data: Array.isArray(page.data) ? page.data : [], presentPage: page.presentPage ?? 1, totalPage: page.totalPage ?? 0 });
      } else {
        setData(empty);
      }
      const landlordNames = await fetchAllLandlordNames();
      setLandlordMap(landlordNames);
    } catch (e) {
      setError(e?.message || 'Failed to load properties');
      setData({ data: [], presentPage: 1, totalPage: 0 });
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleDeleteProperty = useCallback(async (prop) => {
    const propertyId = prop.propertyId;
    if (!propertyId || !window.confirm(`Are you sure you want to delete this?`)) return;
    try {
      await httpClient.delete(`${API_BASE_URL}/property/delete/?property_id=${propertyId}`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' },
      });
      fetchProperties();
    } catch (e) {
      alert('Delete failed');
    }
  }, [fetchProperties]);

  const rawList = data?.data ?? [];
  const list = applyClientFilters(rawList, filters);
  const presentPage = data?.presentPage ?? 1;
  const totalPage   = data?.totalPage   ?? 0;

  const cards = list.map((item, idx) => {
    const d  = item?.data ?? item;
    const pd = d?.propertyDetails ?? {};
    
    const rentalType = (d?.rentalType || '').toLowerCase();
    let name =
  (pd?.building_name && pd.building_name !== "N/A" && pd.building_name) ||
  (d?.buildingDetails && d.buildingDetails !== "N/A" && d.buildingDetails) ||
  (d?.block && d.block !== "N/A" && d.block) ||
  `Property ${d?.propertyId ?? ''}`;
    
    const location = [pd?.city, pd?.country].filter(Boolean).join(', ') || '—';
    const price = pd?.monthlyRent ?? d?.expectedRent ?? '0';
const carpetArea = pd?.carpetAreaSqft ?? '—';
const builtUpArea = pd?.builtupAreaSqft ?? '—';
const currentStatus = pd?.currentStatus || '';
    const image = getPropertyImageUrl(d?.propertyId, d?.photos);
    const landlordId = pd?.landlordId;
    const landlordName = landlordId
      ? (landlordMap[landlordId] || landlordMap[String(landlordId)] || landlordMap[Number(landlordId)] || `ID ${landlordId}`)
      : '---';

    return {
      key: d?.propertyId ?? idx,
      props: { carpetArea, builtUpArea, currentStatus, icon: 'solar:home-2-broken', location, name, price, image, landlordName, raw: d },
    };
  });

  return (
    <Col xl={9} lg={12}>
      {loading ? (
        <div className="d-flex justify-content-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <div className="text-center py-5"><p className="text-danger">{error}</p></div>
      ) : cards.length === 0 ? (
        <div className="text-center py-5 text-muted">No properties found.</div>
      ) : (
        <Row className="g-3">
          {cards.map((item) => (
            <Col xl={4} lg={6} md={6} xs={12} key={item.key} className="d-flex">
              <PropertiesCard {...item.props} onEdit={(prop) => navigate('/property/edit', { state: { property: prop } })} onDelete={handleDeleteProperty} />
            </Col>
          ))}
        </Row>
      )}
    </Col>
  );
};

export default PropertiesData;