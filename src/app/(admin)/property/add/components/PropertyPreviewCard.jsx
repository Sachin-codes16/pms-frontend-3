import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button, Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap';

const badgeStyle = {
  padding: '8px 6px',
};

const PropertyPreviewCard = ({ image }) => (
  <Col xl={3} lg={4}>
    <Card>
      <div className="position-relative">
        {image ? (
          <img
            src={image}
            alt="Property preview"
            className="img-fluid rounded-top w-100"
            style={{ height: 200, objectFit: 'cover' }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center rounded-top w-100"
            style={{ height: 200, background: '#e9ecef' }}
          >
            <IconifyIcon icon="solar:gallery-broken" width={40} height={40} className="text-muted" />
          </div>
        )}
        <span className="position-absolute top-0 end-0 p-2">
          <span className="badge bg-success text-white fs-13">Vacant</span>
        </span>
      </div>
      <CardBody>
        <h5 className="mb-1 fs-16 fw-medium text-dark">
          Dvilla Residences Batu <span className="text-muted fw-normal">(Residences)</span>
        </h5>
        <p className="text-muted mb-3">4604 , Philli Lane Kiowa U.S.A</p>
        <p className="text-muted mb-1">Price :</p>
        <h4 className="fw-semibold mb-3" style={{ color: '#2f3848' }}>OMR 8,930.00</h4>
        <Row className="g-2">
          <Col xs={3}>
            <span className="badge bg-light-subtle text-muted border fs-12 d-flex align-items-center gap-1 w-100" style={badgeStyle}>
              <IconifyIcon icon="solar:bed-broken" className="fs-14 flex-shrink-0" />
              <span className="text-truncate" style={{ minWidth: 0 }}>5 Beds</span>
            </span>
          </Col>
          <Col xs={3}>
            <span className="badge bg-light-subtle text-muted border fs-12 d-flex align-items-center gap-1 w-100" style={badgeStyle}>
              <IconifyIcon icon="solar:bath-broken" className="fs-14 flex-shrink-0" />
              <span className="text-truncate" style={{ minWidth: 0 }}>4 Bath</span>
            </span>
          </Col>
          <Col xs={3}>
            <span className="badge bg-light-subtle text-muted border fs-12 d-flex align-items-center gap-1 w-100" style={badgeStyle}>
              <IconifyIcon icon="solar:scale-broken" className="fs-14 flex-shrink-0" />
              <span className="text-truncate" style={{ minWidth: 0 }}>1400ft</span>
            </span>
          </Col>
          <Col xs={3}>
            <span className="badge bg-light-subtle text-muted border fs-12 d-flex align-items-center gap-1 w-100" style={badgeStyle}>
              <IconifyIcon icon="solar:double-alt-arrow-up-broken" className="fs-14 flex-shrink-0" />
              <span className="text-truncate" style={{ minWidth: 0 }}>3 Floor</span>
            </span>
          </Col>
        </Row>
      </CardBody>
      <CardFooter className="d-flex gap-2 bg-white">
        <Button variant="outline-secondary" className="w-50">Cancel</Button>
        <Button className="w-50" style={{ background: '#293052', borderColor: '#293052' }}>Add Property</Button>
      </CardFooter>
    </Card>
  </Col>
);

export default PropertyPreviewCard;
