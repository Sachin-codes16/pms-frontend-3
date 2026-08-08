import { Card, CardBody, Col, Row } from 'react-bootstrap';

const StatCard = ({
  amount,
  icon,
  title
}) => {
  return <Card className="shadow-sm border-0 h-100" style={{ borderRadius: '6px' }}>
      <CardBody className="d-flex align-items-center" style={{ minHeight: '100px', padding: '20px' }}>
        <div className="d-flex align-items-center justify-content-between gap-3 w-100">
          <div>
            <p className="mb-2 fw-medium" style={{ color: '#516986', fontSize: '15px' }}>{title}</p>
            <h3 className="text-dark fw-bold mb-0" style={{ fontSize: '24px' }}>{amount}</h3>
          </div>
          <div className="flex-shrink-0">
            <img src={icon} alt="" width={56} height={56} />
          </div>
        </div>
      </CardBody>
    </Card>;
};
const Statistics = ({ stats = [] }) => {
  return <Row className="g-3 mt-0 mb-2">
      {stats.map((item, idx) => <Col xs={12} sm={6} lg={4} xl key={idx}>
          <StatCard {...item} />
        </Col>)}
    </Row>;
};
export default Statistics;
