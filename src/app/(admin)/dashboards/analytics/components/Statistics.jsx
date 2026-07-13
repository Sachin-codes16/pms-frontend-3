import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { statData } from '../data';

const StatCard = ({
  amount,
  icon,
  title,
  variant
}) => {
  return <Card className="shadow-sm border-0 h-100" style={{ borderRadius: '6px' }}>
      <CardBody className="d-flex align-items-center" style={{ minHeight: '100px', padding: '20px' }}>
        <div className="d-flex align-items-center justify-content-between gap-3 w-100">
          <div>
            <p className="mb-2 fw-medium" style={{ color: '#516986', fontSize: '15px' }}>{title}</p>
            <h3 className="text-dark fw-bold mb-0" style={{ fontSize: '24px' }}>{amount}</h3>
          </div>
          <div className={`avatar-md bg-${variant} bg-opacity-10 rounded flex-centered flex-shrink-0`} style={{ width: '56px', height: '56px' }}>
            <IconifyIcon icon={icon} width={28} height={28} className={`text-${variant}`} />
          </div>
        </div>
      </CardBody>
    </Card>;
};
const Statistics = () => {
  return <Row className="g-3 mt-0 mb-2">
      {statData.map((item, idx) => <Col xs={12} sm={6} lg={4} xl key={idx}>
          <StatCard {...item} />
        </Col>)}
    </Row>;
};
export default Statistics;
