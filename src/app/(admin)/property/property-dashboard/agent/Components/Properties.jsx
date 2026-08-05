import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { Fragment } from 'react';

const progressColors = ['#9b35e8', '#45c3c9', '#f8944d', '#58bd7d', '#604ae3', '#e35d5d'];

const Properties = ({ cityBreakdown = [], totalProperties = 0 }) => {
  const maxCount = Math.max(...cityBreakdown.map((c) => c.count), 1);

  return (
    <Col lg={7}>
      <Card className="border-0 shadow-sm" style={{
        borderRadius: 5,
        minHeight: 420
      }}>
        <CardHeader className="border-0 bg-white" style={{
          padding: '16px 20px 0'
        }}>
          <CardTitle as={'h4'} className="mb-0" style={{
            color: '#536b86',
            fontSize: 16,
            fontWeight: 600
          }}>Properties by City</CardTitle>
        </CardHeader>

        <CardBody style={{
          padding: '40px 20px 24px'
        }}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="flex-centered" style={{
              width: 56,
              height: 56,
              borderRadius: 5,
              backgroundColor: '#f7f8fb'
            }}>
              <IconifyIcon
                icon="solar:home-2-broken"
                width={32}
                height={32}
                style={{ color: '#604ae3' }}
              />
            </div>
            <div>
              <p className="mb-1 text-dark fw-medium" style={{ fontSize: 22, lineHeight: 1 }}>{totalProperties}</p>
              <small style={{ color: '#647c99' }}>(Total Properties)</small>
            </div>
          </div>

          <div style={{
            border: '1px solid #edf0f4',
            borderRadius: 5,
            padding: '20px 20px 18px'
          }}>
            {cityBreakdown.length === 0 ? (
              <p className="mb-0" style={{ color: '#647c99', fontSize: 14 }}>No property location data available.</p>
            ) : cityBreakdown.map((item, idx) => (
              <Fragment key={item.city}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <p className="mb-0" style={{
                    color: '#647c99',
                    fontSize: 14
                  }}>
                    <IconifyIcon icon="ri:map-pin-line" className="fs-16 align-middle me-2" />
                    <span className="align-middle fw-medium">{item.city}</span>
                  </p>
                  <p className="mb-0 fw-semibold" style={{
                    color: '#536b86',
                    fontSize: 13
                  }}>{item.count}</p>
                </div>
                <Row className="align-items-center mb-4">
                  <Col>
                    <div style={{
                      height: 4,
                      borderRadius: 10,
                      backgroundColor: '#edf4f3',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.round((item.count / maxCount) * 100)}%`,
                        height: '100%',
                        backgroundColor: progressColors[idx % progressColors.length],
                        borderRadius: 10
                      }} />
                    </div>
                  </Col>
                  <Col xs={'auto'}>
                    <p className="mb-0" style={{
                      color: '#647c99',
                      fontSize: 12
                    }}>{Math.round((item.count / totalProperties) * 100)}%</p>
                  </Col>
                </Row>
              </Fragment>
            ))}

            <div className="text-center">
              <Link to="/landlord/add-property" className="text-decoration-none" style={{
                color: '#604ae3',
                fontSize: 14
              }}>
                Add Property
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Properties;
