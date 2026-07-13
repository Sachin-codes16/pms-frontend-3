import avatar3 from '@/assets/images/users/avatar-3.jpg';
import avatar4 from '@/assets/images/users/avatar-4.jpg';
import avatar5 from '@/assets/images/users/avatar-5.jpg';
import avatar6 from '@/assets/images/users/avatar-6.jpg';
import avatar7 from '@/assets/images/users/avatar-7.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const Overview = () => {
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
          <Dropdown>
            <DropdownToggle as={'a'} className="btn btn-sm btn-outline-light content-none icons-center" style={{
              borderRadius: 5,
              color: '#2f3848',
              padding: '8px 12px'
            }} data-bs-toggle="dropdown" aria-expanded="false">
              This Month <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem>Today</DropdownItem>
              <DropdownItem>Month</DropdownItem>
              <DropdownItem>Years</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>
        <CardBody style={{
          padding: '38px 20px 20px'
        }}>
          <div className="d-flex align-items-center justify-content-between position-relative">
            <div>
              <p className="mb-2" style={{
                color: '#647c99',
                fontSize: 14
              }}>Total Properties Rented</p>
              <h3 className="mb-1" style={{
                color: '#2f3848',
                fontSize: 25,
                fontWeight: 700
              }}>153</h3>
            </div>
            <div className="flex-centered" style={{
              position: 'absolute',
              right: -38,
              top: 0,
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
          }} now={50} striped animated variant="success" className="mt-4" role="progressbar"></ProgressBar>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <div>
              <p className="mb-2 text-success fs-15 fw-medium"></p>
              <h4 className="text-dark fw-bold mb-0"></h4>
            </div>
            <div className="text-end">
              <p className="mb-2 fs-15 fw-medium"></p>
              <h4 className="text-dark fw-bold mb-0"></h4>
            </div>
          </div>
          <div className="d-flex align-items-center border justify-content-between mt-5" style={{
            borderColor: '#edf0f4',
            borderRadius: 5,
            padding: '30px 16px'
          }}>
            <div>
              <h5 className="fw-medium mb-3 text-dark" style={{
                fontSize: 16
              }}>New Properies</h5>
              <div className="avatar-group">
                <div className="avatar d-flex align-items-center justify-content-center">
                  <img src={avatar4} alt="avatar1" className="rounded-circle avatar border border-light border-3" />
                </div>
                <div className="avatar d-flex align-items-center justify-content-center">
                  <img src={avatar5} alt="avatar2" className="rounded-circle avatar border border-light border-3" />
                </div>
                <div className="avatar d-flex align-items-center justify-content-center">
                  <img src={avatar3} alt="avatar3" className="rounded-circle avatar border border-light border-3" />
                </div>
                <div className="avatar d-flex align-items-center justify-content-center">
                  <img src={avatar6} alt="avatar4" className="rounded-circle avatar border border-light border-3" />
                </div>
                <div className="avatar d-flex align-items-center justify-content-center">
                  <img src={avatar7} alt="avatar5" className="rounded-circle avatar border border-light border-3" />
                </div>
              </div>
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
