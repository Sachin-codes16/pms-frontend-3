import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Col, Row } from 'react-bootstrap';

const StatCard = ({ title, amount, icon, color, bg, change }) => {
  return (
    <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 5 }}>
      <CardBody style={{ padding: '22px 24px' }}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <p className="mb-0" style={{ color: '#536b86', fontSize: 15, fontWeight: 500 }}>{title}</p>
              {change && (
                <span className="badge bg-success-subtle text-success px-2 py-1" style={{ fontSize: 11 }}>
                  <IconifyIcon icon="ri:arrow-up-line" width={11} height={11} /> {change}
                </span>
              )}
            </div>
            <h3 className="mb-0" style={{ color: '#2f3848', fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
              {amount}
            </h3>
          </div>
          <div
            className="flex-centered"
            style={{
              backgroundColor: bg,
              borderRadius: 5,
              height: 56,
              width: 56
            }}
          >
            <IconifyIcon icon={icon} width={30} height={30} style={{ color }} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const CheckInStats = ({ stats = [] }) => {
  return (
    <Row className="g-3">
      {stats.map((stat, idx) => (
        <Col xs={12} sm={6} xl key={idx}>
          <StatCard {...stat} />
        </Col>
      ))}
    </Row>
  );
};

export default CheckInStats;
