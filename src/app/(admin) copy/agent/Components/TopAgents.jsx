import agent1Img from '@/assets/images/agent-1.png';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
const TopAgents = () => {
  return <Card style={{ height: '400px' }}>
      <CardHeader>
        <CardTitle as={'h4'}>Top Landlord</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="bg-primary position-relative rounded p-2 overflow-hidden z-1 text-center">
          <img src={agent1Img} alt="agent-1" className="img-fluid rounded" />
          <div className="d-flex align-items-center justify-content-between bg-light bg-opacity-25 p-2 mt-2 rounded text-start">
            <div>
              <Link to="" className="text-white fw-medium fs-16">
                test56 Reddy
              </Link>
              <p className="mb-0 text-white-50">dubai , Oman</p>
              <div className="d-flex flex-wrap gap-2 align-items-center mt-1">
                <ul className="d-flex text-warning m-0 fs-18  list-unstyled">
                  <li>
                    <IconifyIcon icon="ri:star-fill" />
                  </li>
                  <li>
                    <IconifyIcon icon="ri:star-fill" />
                  </li>
                  <li>
                    <IconifyIcon icon="ri:star-fill" />
                  </li>
                  <li>
                    <IconifyIcon icon="ri:star-fill" />
                  </li>
                  <li>
                    <IconifyIcon icon="ri:star-half-line" />
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <Link to="/landlord-list">
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-primary text-white fs-4 rounded-circle">
                    <IconifyIcon icon="ri:arrow-right-line" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>;
};
export default TopAgents;