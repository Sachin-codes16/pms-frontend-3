import PropertyPhotoUpload from '@/components/PropertyPhotoUpload';
import PageTitle from '@/components/PageTitle';
import PropertyAdd from '@/app/(admin)/property/add/components/PropertyAdd';
import PropertyAddCard from '@/app/(admin)/property/add/components/PropertyAddCard';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';

// ─── Helper: extract a display URL from any API photo shape ───────────────────
const getPhotoSrc = (photo) => {
  if (!photo) return null;

  let src = null;
  if (typeof photo === 'string')  src = photo;
  else if (photo.photo_url)       src = photo.photo_url;
  else if (photo.url)             src = photo.url;
  else if (photo.image_url)       src = photo.image_url;
  else if (photo.photo)           src = photo.photo;
  else if (photo.src)             src = photo.src;

  if (!src) return null;

  if (src.startsWith('/')) return `${API_BASE_URL}${src}`;

  return src;
};

const PropertyEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;

  // ─── Preview card values ────────────────────────────────────────────────────
  const initialPreview = useMemo(() => {
    if (!property) return {};
    const pd = property.propertyDetails ?? {};
    const fd = property.flatData ?? {};
    const buildingName = property.buildingDetails || pd.building_name || '';
    const address      = pd.address_line_1 || '';
    const city         = pd.city || '';
    const country      = pd.country || '';
    const fullAddress  = [address, city, country].filter(Boolean).join(', ');
    const price        = pd.monthly_rent || property.expectedRent || '';
    const beds         = (fd.flat_configuration || '').replace(/[^0-9]/g, '') || '';
    const baths        = fd.no_of_bathrooms || '';
    const area         = pd.carpet_area_sqft || property.dimensionAreaSqft || '';
    const floor        = property.floor || fd.floor_number || '';
    const status       = pd.current_status || (property.isActive ? 'Active' : 'Inactive');
    return { building_name: buildingName, name: buildingName, address: fullAddress, price, beds, baths, area, floor, status };
  }, [property]);

  const [preview, setPreview] = useState(initialPreview);

  // ─── Photos: normalize API photos → unified { src, type, raw } objects ──────
  const apiPhotos = property?.photos && Array.isArray(property.photos) ? property.photos : [];

  const [uploadedPhotos, setUploadedPhotos] = useState(() =>
    apiPhotos
      .map((p) => ({ src: getPhotoSrc(p), type: 'existing', raw: p }))
      .filter((p) => Boolean(p.src))
  );

  // ─── No property guard ───────────────────────────────────────────────────────
  if (!property) {
    return (
      <>
        <PageTitle title="Update Property" subName="Property not found" />
        <Card>
          <CardBody className="text-center py-5">
            <p className="text-muted mb-3">
              No property data available. Go back to the list and open a property from Edit.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => navigate(-1)}>
              Back to List
            </button>
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Update Property" subName="" />
      <Row>
        {/* ── Left preview card with uploadedPhotos ── */}
        <PropertyAddCard 
          preview={preview} 
          uploadedPhotos={uploadedPhotos}
          mode="update" 
        />

        {/* ── Right: photo upload + form ── */}
        <Col xl={9} lg={8}>
          <PropertyPhotoUpload
            title="Property Photo"
            photos={uploadedPhotos}
            onPhotosChange={setUploadedPhotos}
          />
          <PropertyAdd
            initialData={property}
            mode="update"
            onFormValuesChange={setPreview}
            uploadedPhotos={uploadedPhotos}
          />
        </Col>
      </Row>
    </>
  );
};

export default PropertyEditPage;