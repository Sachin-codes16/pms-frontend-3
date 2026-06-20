import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import httpClient from '@/helpers/httpClient';
import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import OwnerDetails from './components/OwnerDetails';
import PropertyDetails from './components/PropertyDetails';

/* ─────────────────────────────────────────────────────────────────────────────
   Fetch landlord name by matching landlord_id with leadId from /lead/get_all/
───────────────────────────────────────────────────────────────────────────── */
const fetchLandlordName = async (landlordId) => {
  if (!landlordId) return null;
  
  console.log('🔍 Fetching landlord name for ID:', landlordId, typeof landlordId);
  
  try {
    const res = await httpClient.get(`${API_BASE_URL}/lead/get_all/?limit=99999`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        Accept: 'application/json',
      },
    });

    const leads =
      res.data?.data?.data ??
      res.data?.data ??
      res.data ??
      [];

    console.log('📋 Total leads fetched:', leads.length);
    console.log('🔎 Looking for leadId ==', landlordId);

    // Convert both to numbers for comparison to avoid type mismatch
    const match = leads.find((l) => Number(l.leadId) === Number(landlordId));

    console.log('✅ Matched lead:', match);

    if (!match) {
      console.log('❌ No match found. Available leadIds:', leads.slice(0, 10).map(l => l.leadId));
      return null;
    }

    const fullName = [match.firstName || '', match.lastName || '']
      .join(' ')
      .trim();

    return fullName || `Lead #${landlordId}`;
  } catch (err) {
    console.error('❌ fetchLandlordName error:', err);
    return null;
  }
};

const PropertyDetailsPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Property passed from list page
  const initialProperty = location.state?.property ?? null;

  const initialId = useMemo(() => {
    const fromState =
      location.state?.propertyId ?? initialProperty?.propertyId;

    const fromQuery = searchParams.get('property_id');

    return fromState || (fromQuery ? Number(fromQuery) : undefined);
  }, [location.state, initialProperty, searchParams]);

  const [property, setProperty] = useState(initialProperty);
  const [landlordName, setLandlordName] = useState('');
  const [loading, setLoading] = useState(
    !initialProperty && !!initialId
  );
  const [error, setError] = useState(null);

  /* ── Fetch property if not passed via state ── */
  useEffect(() => {
    if (initialProperty) {
      const id = initialProperty?.propertyDetails?.landlord_id;
      
      console.log('🏠 Initial property landlord_id:', id, typeof id);

      fetchLandlordName(id).then((n) => {
        console.log('👤 Fetched landlord name:', n);
        setLandlordName(n || '');
      });
      return;
    }

    if (!initialId) return;

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await httpClient.get(
          `${API_BASE_URL}/property/get/?property_id=${initialId}`,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
              Accept: 'application/json',
            },
          }
        );

        const payload = res.data;
        let found = null;

        if (payload?.data?.propertyId) {
          found = payload.data;
        } else if (Array.isArray(payload?.data?.data)) {
          found =
            payload.data.data.find(
              (p) => p.propertyId === initialId
            ) ??
            payload.data.data[0] ??
            null;
        } else if (Array.isArray(payload?.data)) {
          found =
            payload.data.find(
              (p) => p.propertyId === initialId
            ) ??
            payload.data[0] ??
            null;
        }

        if (!found) throw new Error('not_found');

        setProperty(found);

        const landlordId = found?.propertyDetails?.landlord_id;
        
        console.log('🏠 Property landlord_id:', landlordId, typeof landlordId);

        const name = await fetchLandlordName(landlordId);
        
        console.log('👤 Fetched landlord name:', name);

        setLandlordName(name || '');
      } catch {
        try {
          const allRes = await httpClient.get(
            `${API_BASE_URL}/property/get_all/?filter_key=is_active&filter_value=true`,
            {
              headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`,
                Accept: 'application/json',
              },
            }
          );

          const list =
            allRes.data?.data?.data ??
            allRes.data?.data ??
            [];

          const found =
            list.find(
              (p) => p.propertyId === initialId
            ) ?? null;

          setProperty(found);

          if (!found) {
            setError(
              `Property #${initialId} not found.`
            );
            return;
          }

          const landlordId = found?.propertyDetails?.landlord_id;
          
          console.log('🏠 Property landlord_id (from get_all):', landlordId, typeof landlordId);

          const name = await fetchLandlordName(landlordId);
          
          console.log('👤 Fetched landlord name (from get_all):', name);

          setLandlordName(name || '');
        } catch (e2) {
          setError(
            e2?.response?.data?.message ||
              e2?.message ||
              'Failed to load property'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [initialId, initialProperty]);

  // Breadcrumb
  const pd = property?.propertyDetails ?? {};

  const breadcrumbCity =
    pd.city && pd.city !== '-' ? pd.city : null;

  const breadcrumbState =
    pd.state && pd.state !== '-' ? pd.state : null;

  const breadcrumbCode = `#${
    property?.propertyId ?? ''
  }`;

  return (
    <>
      {/* Breadcrumb */}
      <div
        style={{
          fontSize: '1rem',
          fontWeight: 500,
          color: '#555',
          marginBottom: '0.5rem',
        }}
      >
        Properties
        {breadcrumbCity && <> / {breadcrumbCity}</>}
        {breadcrumbState && <> / {breadcrumbState}</>}
        {property?.propertyId && (
          <> / {breadcrumbCode}</>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex gap-2 mb-3">
        <Button
          variant="outline-secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>

        <Button
          variant="primary"
          onClick={() => navigate('/')}
        >
          🏠 Home
        </Button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner
            animation="border"
            variant="primary"
          />
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <p className="text-danger mb-3">
            {error}
          </p>

          <div className="d-flex justify-content-center gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>

            <Button
              variant="primary"
              onClick={() => navigate('/')}
            >
              🏠 Home
            </Button>
          </div>
        </div>
      ) : !property ? (
        <div className="text-center py-5 text-muted">
          Property not found.
        </div>
      ) : (
        <Row>
          <Col xl={12} lg={12}>
            <PropertyDetails
              property={property}
              landlordName={landlordName}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default PropertyDetailsPage;