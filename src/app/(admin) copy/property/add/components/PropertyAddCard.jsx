import properties1 from '@/assets/images/properties/p-1.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Col, Row } from 'react-bootstrap';

const PropertyAddCard = ({ preview = {}, uploadedPhotos = [], mainPhoto, mode = 'create', formId = 'property-add-form' }) => {
  const name        = preview.building_name || preview.name || '—';
  const address     = preview.address || '—';
  const price       = preview.price || '0';
  const beds        = preview.beds || '—';
  const baths       = preview.baths || '—';
  const area        = preview.area || '—';
  const floor       = preview.floor || '—';
  const statusBadge = preview.status || 'For Rent';

  // ─── Resolve the best available image ─────────────────────────────────────
  const resolveImg = () => {
    // Priority 1: mainPhoto prop (if explicitly passed)
    if (mainPhoto) return mainPhoto;

    // Priority 2: First uploaded photo
    if (uploadedPhotos.length > 0) {
      const first = uploadedPhotos[0];

      // New upload with blob preview URL
      if (first?.preview) return first.preview;

      // Existing photo with src URL
      if (first?.src) return first.src;

      // New upload with base64 raw data
      if (first?.raw && typeof first.raw === 'string') {
        if (first.raw.startsWith('data:'))  return first.raw;
        if (first.raw.startsWith('http') || first.raw.startsWith('/')) return first.raw;
        return `data:image/jpeg;base64,${first.raw}`;
      }
    }

    // Priority 3: Default placeholder
    return properties1;
  };

  const imgSrc = resolveImg();

  return (
    <Col xl={3} lg={4}>
      <Card>
        <CardBody>
          <div className="position-relative">
            <img
              src={imgSrc}
              alt="property preview"
              className="img-fluid rounded bg-light"
              style={{ objectFit: 'cover', aspectRatio: '4/3', width: '100%' }}
              onError={(e) => { e.currentTarget.src = properties1; }}
            />
            <span className="position-absolute top-0 end-0 p-1">
              <span className="badge bg-success text-light fs-13">{statusBadge}</span>
            </span>
          </div>

          <div className="mt-3">
            <h4 className="mb-1">{name}</h4>
            <p className="mb-1">{address}</p>
            <h5 className="text-dark fw-medium mt-3">Price :</h5>
            <h4 className="fw-semibold mt-2 text-muted">₹{price}</h4>
          </div>

          <Row className="mt-2 g-2">
            <Col xs={6}>
              <span
                className="badge bg-light-subtle text-muted border fs-12 d-inline-flex align-items-center gap-1 w-100"
                style={{ padding: '8px 6px' }}
              >
                <IconifyIcon icon="solar:bed-broken" className="fs-14 flex-shrink-0" />
                <span className="text-truncate">{beds} Beds</span>
              </span>
            </Col>
            <Col xs={6}>
              <span
                className="badge bg-light-subtle text-muted border fs-12 d-inline-flex align-items-center gap-1 w-100"
                style={{ padding: '8px 6px' }}
              >
                <IconifyIcon icon="solar:bath-broken" className="fs-14 flex-shrink-0" />
                <span className="text-truncate">{baths} Bath</span>
              </span>
            </Col>
            <Col xs={6}>
              <span
                className="badge bg-light-subtle text-muted border fs-12 d-inline-flex align-items-center gap-1 w-100"
                style={{ padding: '8px 6px' }}
              >
                <IconifyIcon icon="solar:scale-broken" className="fs-14 flex-shrink-0" />
                <span className="text-truncate">{area} ft</span>
              </span>
            </Col>
            <Col xs={6}>
              <span
                className="badge bg-light-subtle text-muted border fs-12 d-inline-flex align-items-center gap-1 w-100"
                style={{ padding: '8px 6px' }}
              >
                <IconifyIcon icon="solar:double-alt-arrow-up-broken" className="fs-14 flex-shrink-0" />
                <span className="text-truncate">{floor} Floor</span>
              </span>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default PropertyAddCard;