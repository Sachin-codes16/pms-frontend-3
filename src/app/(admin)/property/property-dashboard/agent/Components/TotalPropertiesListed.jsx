import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { revenueData } from '../data';

const progressColors = {
  primary: '#604ae3',
  warning: '#f8944d',
  success: '#58bd7d',
  info: '#45c3c9'
};

const TotalPropertiesListed = () => {
  return <Col lg={6}>
      <Card className="border-0 shadow-sm" style={{
        borderRadius: 5,
        minHeight: 354
      }}>
        <CardHeader className="d-flex justify-content-between align-items-center border-0 bg-white" style={{
          padding: '16px 20px 0'
        }}>
          <CardTitle as={'h4'} className="mb-0" style={{
            color: '#536b86',
            fontSize: 16,
            fontWeight: 600
          }}>Total Properties Listed</CardTitle>
        </CardHeader>
        <CardBody style={{
          padding: '34px 20px 20px'
        }}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-4 mb-2">
                <h3 className="mb-0" style={{
                  color: '#2f3848',
                  fontSize: 25,
                  fontWeight: 700
                }}>356</h3>
                <span className="badge text-success bg-success-subtle px-2 py-1 fs-12 icons-center">
                  <IconifyIcon width={12} height={12} icon="ri-arrow-up-line" />
                  4.53%
                </span>
              </div>
              <p className="mb-0" style={{
                color: '#647c99',
                fontSize: 14
              }}>
                Gained <span className="text-success">OMR 125605</span> This Month !
              </p>
            </div>
            <div className="flex-centered" style={{
              width: 56,
              height: 56,
              borderRadius: 6,
              backgroundColor: '#f7f8fb'
            }}>
              <IconifyIcon icon="solar:bag-2-broken" width={32} height={32} style={{
                color: '#604ae3'
              }} />
            </div>
          </div>
          <div className="mt-4" style={{
            border: '1px solid #edf0f4',
            borderRadius: 5,
            padding: '20px 20px 19px'
          }}>
            <h5 className="mb-3" style={{
              color: '#536b86',
              fontSize: 15,
              fontWeight: 500
            }}>Properties</h5>
            <Row className="mb-3 g-lg-0 g-2">
              {revenueData?.map((item, idx) => <Col lg={3} xs={4} key={idx}>
                  <p className="mb-2 d-flex align-items-center" style={{
                    color: '#647c99',
                    fontSize: 14
                  }}>
                    <IconifyIcon icon="ri:circle-fill" width={11} height={11} style={{
                      color: progressColors[item.variant],
                      marginRight: 3
                    }} /> {item.title}
                  </p>
                  <p className="text-dark fw-medium mb-0" style={{ fontSize: 16 }}>{item.amount}</p>
                </Col>)}
            </Row>
            <div className="d-flex align-items-center gap-1">
              {revenueData.map((item, idx) => <div key={idx} style={{
                height: 9,
                borderRadius: 10,
                backgroundColor: progressColors[item.variant],
                flex: item.progress
              }} />)}
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>;
};
export default TotalPropertiesListed;
