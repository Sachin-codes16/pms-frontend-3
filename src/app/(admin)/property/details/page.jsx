import api from '@/helpers/api';
import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import PropertyDetails from './components/PropertyDetails';

const fetchLandlordName = async (landlordId) => {
  if (!landlordId) return null;
  try {
    const res = await api.get('/lead/get_all/', { params: { limit: 99999 } });
    const leads = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
    const match = leads.find((l) => Number(l.leadId) === Number(landlordId));
    if (!match) return null;
    return [match.firstName || '', match.lastName || ''].join(' ').trim() || `Lead #${landlordId}`;
  } catch {
    return null;
  }
};

const PropertyDetailsPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialProperty = location.state?.property ?? null;

  const initialId = useMemo(() => {
    const fromState = location.state?.propertyId ?? initialProperty?.propertyId;
    const fromQuery = searchParams.get('property_id');
    return fromState || (fromQuery ? Number(fromQuery) : undefined);
  }, [location.state, initialProperty, searchParams]);

  const [property, setProperty] = useState(initialProperty);
  const [landlordName, setLandlordName] = useState('');
  const [loading, setLoading] = useState(!initialProperty && !!initialId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialProperty) {
      const id = initialProperty?.propertyDetails?.landlord_id;
      fetchLandlordName(id).then((n) => setLandlordName(n || ''));
      return;
    }

    if (!initialId) return;

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/property/get/?property_id=${initialId}`);
        const payload = res.data;
        let found = null;

        if (payload?.data?.propertyId) {
          found = payload.data;
        } else if (Array.isArray(payload?.data?.data)) {
          found = payload.data.data.find((p) => p.propertyId === initialId) ?? payload.data.data[0] ?? null;
        } else if (Array.isArray(payload?.data)) {
          found = payload.data.find((p) => p.propertyId === initialId) ?? payload.data[0] ?? null;
        }

        if (!found) throw new Error('not_found');

        setProperty(found);
        const name = await fetchLandlordName(found?.propertyDetails?.landlord_id);
        setLandlordName(name || '');
      } catch {
        try {
          const allRes = await api.get('/property/get_all/');
          const list = allRes.data?.data?.data ?? allRes.data?.data ?? [];
          const found = list.find((p) => p.propertyId === initialId) ?? null;
          setProperty(found);
          if (!found) { setError(`Property #${initialId} not found.`); return; }
          const name = await fetchLandlordName(found?.propertyDetails?.landlord_id);
          setLandlordName(name || '');
        } catch (e2) {
          setError(e2?.response?.data?.message || e2?.message || 'Failed to load property');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [initialId, initialProperty]);

  const pd = property?.propertyDetails ?? {};
  const breadcrumbCity = pd.city && pd.city !== '-' ? pd.city : null;
  const breadcrumbState = pd.state && pd.state !== '-' ? pd.state : null;

  return (
    <>
      <div style={{ fontSize: '1rem', fontWeight: 500, color: '#555', marginBottom: '1rem' }}>
        Properties
        {breadcrumbCity && <> / {breadcrumbCity}</>}
        {breadcrumbState && <> / {breadcrumbState}</>}
        {property?.propertyId && <> / #{property.propertyId}</>}
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <p className="text-danger mb-3">{error}</p>
          <div className="d-flex justify-content-center gap-2">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>← Back</Button>
            <Button variant="primary" onClick={() => navigate('/')}>Home</Button>
          </div>
        </div>
      ) : !property ? (
        <div className="text-center py-5 text-muted">Property not found.</div>
      ) : (
        <Row>
          <PropertyDetails property={property} landlordName={landlordName} />
        </Row>
      )}
    </>
  );
};

export default PropertyDetailsPage;
