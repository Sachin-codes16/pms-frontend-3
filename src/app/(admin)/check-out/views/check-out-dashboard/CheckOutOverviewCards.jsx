import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Col, Row } from 'react-bootstrap';

const overviewTextColor = '#526b89';

const CheckOutOverviewCards = ({ cards = [] }) => (
  <Row className="g-3">
    {cards.map((card) => (
      <Col xs={12} md={6} xl={3} key={card.title}>
        <Card className="border-0 h-100" style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 8px 28px rgba(30, 41, 59, 0.08)' }}>
          <CardBody className="d-flex flex-column h-100" style={{ padding: 0 }}>
            <div className="flex-grow-1" style={{ padding: '19px 29px 26px', minHeight: 247 }}>
              <div className="d-flex align-items-center" style={{ gap: 12, marginBottom: 28 }}>
                <span
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 45, height: 45, borderRadius: '50%', background: card.iconBg ?? '#e8f0ff' }}>
                  <IconifyIcon icon={card.icon} width={24} height={24} style={{ color: card.iconColor ?? '#2f3848' }} />
                </span>
                <h5 className="mb-0" style={{ color: overviewTextColor, fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>
                  {card.title}
                </h5>
              </div>

              {card.rows.map((row, index) => (
                <div
                  key={row.label}
                  className={row.stacked ? '' : 'd-flex align-items-center justify-content-between'}
                  style={{
                    gap: 12,
                    marginBottom: index === card.rows.length - 1 ? 0 : 17,
                    minHeight: row.stacked ? 51 : 18,
                  }}>
                  <span style={{ color: overviewTextColor, fontSize: 15, fontWeight: 400, lineHeight: 1.2 }}>{row.label}</span>
                  <span className={row.stacked ? 'd-block mt-3' : ''} style={{ color: overviewTextColor, fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 52, padding: '12px', borderTop: '1px solid #d8dee8', background: '#fff' }}>
              <a href="#" style={{ color: overviewTextColor, fontSize: 16, fontWeight: 500, lineHeight: 1.2, textDecoration: 'none' }}>
                {card.footer}
              </a>
            </div>
          </CardBody>
        </Card>
      </Col>
    ))}
  </Row>
);

export default CheckOutOverviewCards;
