import avatar2 from '@/assets/images/users/dummy1.jpg';
import { Card, CardBody, Col, Row } from 'react-bootstrap';

// ─── Must match the base URL used by the API server ───────────────────────────
const IMAGE_BASE_URL = 'https://essdemo.alwijha.net/media/';

function resolveImageSrc(raw) {
  if (!raw || typeof raw !== 'string' || raw.trim() === '') return null;

  // Already a data-URL (new upload preview)
  if (raw.startsWith('data:image')) return raw;

  // Already a full HTTP/HTTPS URL
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

  // Raw base64 string (no data: prefix, but very long)
  if (!raw.includes('/') && raw.length > 100) {
    return `data:image/jpeg;base64,${raw}`;
  }

  // Relative path from API e.g. "lead_profiles/property_photo_abc.jpg"
  return `${IMAGE_BASE_URL}${raw}`;
}

const CustomerAddCard = ({ preview = {} }) => {
  const firstName = preview.first_name ?? '';
  const lastName  = preview.last_name  ?? '';
  const name      = [firstName, lastName].filter(Boolean).join(' ') || '—';
  const contact   = preview.phone       ?? '';
  const address   = preview.description ?? '';
  const leadType  = preview.leadType    ?? '';
  const status    = preview.status      ?? 'Available';

  // ── Resolve image src ─────────────────────────────────────────────────────
  const resolvedSrc = resolveImageSrc(preview.profileImage);
  const displayImage = resolvedSrc ?? avatar2;

  return (
    <Col xl={3} lg={12}>
      <Card className="overflow-hidden">
        <CardBody>
          <div
            className="customer-bg text-center rounded position-relative"
            style={{ height: '100px', backgroundColor: '#f0f0f0' }}
          >
            <img
              src={displayImage}
              alt="avatar"
              className="avatar-xl border border-light border-3 rounded-circle position-absolute top-100 start-0 translate-middle ms-5"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              onError={(e) => {
                // If the resolved URL fails to load, fall back to local avatar
                e.target.onerror = null;
                e.target.src = avatar2;
              }}
            />
          </div>

          <div className="mt-5 pt-3 ms-1">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0 text-dark fw-semibold">{name}</h4>
              <span className="badge bg-success text-white fs-12 px-2 py-1">
                {status}
              </span>
            </div>

            <p className="text-muted fw-medium fs-14 mb-1">
              <span className="text-dark me-1">Contact Number :</span>
              {contact || '—'}
            </p>

            <p className="text-muted fw-medium fs-14 mb-1">
              <span className="text-dark me-1">Address :</span>
              {address || '—'}
            </p>

            <Row className="mt-3 justify-content-between">
              <Col lg={6}>
                <p className="fw-medium mb-2">Lead Id</p>
                <h5 className="mb-0 fw-semibold text-dark">{preview.leadId || '—'}</h5>
              </Col>
              <Col lg={6}>
                <p className="fw-medium mb-2">Lead type</p>
                <h5 className="mb-0 fw-semibold text-dark">{leadType || '—'}</h5>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CustomerAddCard;