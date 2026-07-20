import avatar3 from '@/assets/images/users/avatar-3.jpg';
import avatar4 from '@/assets/images/users/avatar-4.jpg';
import avatar5 from '@/assets/images/users/avatar-5.jpg';
import avatar6 from '@/assets/images/users/avatar-6.jpg';
import avatar7 from '@/assets/images/users/avatar-7.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar } from 'react-bootstrap';
const CollectionRent = () => {
 
  return  <Col lg={5}
   >
      <Card style={{ minHeight: '470px' }}>
        <CardHeader className="d-flex justify-content-between align-items-center border-0">
          <CardTitle as={'h4'}>Overview</CardTitle>
          <Dropdown>
            <DropdownToggle as={'a'} className="btn btn-sm btn-outline-light rounded content-none icons-center" data-bs-toggle="dropdown" aria-expanded="false">
              This Month <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem>Today</DropdownItem>
              <DropdownItem>Month</DropdownItem>
              <DropdownItem>Years</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <p className="text-muted fs-14 mb-2">Conversion Rate (<small className="text-muted">
            It depends on other modules</small>)</p>
              <h3 className="text-dark fw-bold mb-1">78.5%</h3>
            </div>
            <div className="avatar-md bg-light bg-opacity-50 rounded flex-centered">
              <IconifyIcon icon="solar:hand-money-broken" width={32} height={32} className="fs-32 text-primary" />
            </div>
          </div>
          <ProgressBar style={{
          height: 15
        }} now={50} striped animated variant="success" className="mt-3" role="progressbar"></ProgressBar>

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
          <div className="d-flex align-items-center bg-light-subtle border justify-content-between p-3 rounded mt-4">
            <div>
              <h5 className="fw-medium mb-1 text-dark fs-16">New Leads</h5>
              <div className="avatar-group mt-3">
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
              <Link to="/landlord-list">
              <Button variant="primary">View All</Button>
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>;
};
export default CollectionRent;