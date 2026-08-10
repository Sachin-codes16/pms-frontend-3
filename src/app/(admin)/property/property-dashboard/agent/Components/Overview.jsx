import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Overview = ({ occupiedCount = 0, occupiedPercent = 0, totalProperties = 0 }) => {
  const navigate = useNavigate();

  return  <Col lg={5}>
      <Card className="border-0 shadow-sm" style={{
        minHeight: 420,
        borderRadius: 5
      }}>
        <CardHeader className="d-flex justify-content-between align-items-center border-0 bg-white" style={{
          padding: '16px 20px 0'
        }}>
          <CardTitle as={'h4'} className="mb-0" style={{
            color: '#536b86',
            fontSize: 16,
            fontWeight: 600
          }}>Overview</CardTitle>
        </CardHeader>
        <CardBody style={{
          padding: '38px 20px 20px'
        }}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <p className="mb-2" style={{
                color: '#647c99',
                fontSize: 14
              }}>Total Properties Occupied</p>
              <h3 className="mb-1" style={{
                color: '#2f3848',
                fontSize: 25,
                fontWeight: 700
              }}>{occupiedCount}</h3>
            </div>
            <div className="flex-centered" style={{
              width: 56,
              height: 56,
              borderRadius: 6,
              backgroundColor: '#f7f8fb'
            }}>
              <IconifyIcon icon="solar:hand-money-broken" width={32} height={32} style={{
                color: '#604ae3'
              }} />
            </div>
          </div>
          <ProgressBar style={{
            height: 15,
            borderRadius: 10,
            backgroundColor: '#edf2f6'
          }} now={occupiedPercent} striped animated variant="success" className="mt-4" role="progressbar"></ProgressBar>
          <p className="mb-0 mt-2" style={{ color: '#647c99', fontSize: 13 }}>{occupiedPercent}% of {totalProperties} properties occupied</p>

          <div className="d-flex align-items-center border justify-content-between mt-5" style={{
            borderColor: '#edf0f4',
            borderRadius: 5,
            padding: '30px 16px'
          }}>
            <div>
              <h5 className="fw-medium mb-1 text-dark" style={{
                fontSize: 16
              }}>Total Properties</h5>
              <p className="mb-0" style={{ color: '#647c99', fontSize: 14 }}>{totalProperties} listed overall</p>
            </div>
            <div>
              <Button onClick={() => navigate('/landlord/property-grid')} variant="primary" style={{
                backgroundColor: '#604ae3',
                borderColor: '#604ae3',
                borderRadius: 5,
                padding: '10px 17px'
              }}>View All</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>;
};
export default Overview;
