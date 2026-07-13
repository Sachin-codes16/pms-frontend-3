import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Col, Row } from 'react-bootstrap';

const CheckOutStatCard = ({ title, amount, icon, color, bg }) => (
  <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 5 }}>
    <CardBody style={{ padding: '22px 24px' }}>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <p className="mb-2" style={{ color: '#536b86', fontSize: 15, fontWeight: 500 }}>
            {title}
          </p>
          <h3 className="mb-0" style={{ color: '#2f3848', fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
            {amount}
          </h3>
        </div>
        <div className="flex-centered" style={{ backgroundColor: bg, borderRadius: 5, height: 56, width: 56 }}>
          <IconifyIcon icon={icon} width={30} height={30} style={{ color }} />
        </div>
      </div>
    </CardBody>
  </Card>
);

const CheckOutStats = ({ stats = [] }) => (
  <Row className="g-3">
    {stats.map((stat) => (
      <Col xs={12} sm={6} xl key={stat.title}>
        <CheckOutStatCard {...stat} />
      </Col>
    ))}
  </Row>
);

export default CheckOutStats;
