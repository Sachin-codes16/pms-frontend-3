import agent1Img from '@/assets/images/agent-1.png';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
const TopProperties = () => {
  return <Card className="border-0 shadow-sm" style={{
      borderRadius: 5,
      minHeight: 354
    }}>
      <CardHeader className="border-0 bg-white" style={{
        padding: '16px 20px 0'
      }}>
        <CardTitle as={'h4'} className="mb-0" style={{
          color: '#536b86',
          fontSize: 16,
          fontWeight: 600
        }}>Top Properties</CardTitle>
      </CardHeader>
      <CardBody style={{
        padding: '34px 20px 12px'
      }}>
        <div className="position-relative overflow-hidden z-1 text-center" style={{
          backgroundColor: '#625b87',
          borderRadius: 5,
          padding: 10
        }}>
          <img src={agent1Img} alt="top property" className="img-fluid w-100" style={{
            height: 150,
            objectFit: 'cover',
            borderRadius: 4
          }} />
          <div className="d-flex align-items-center justify-content-between mt-2 text-start" style={{
            backgroundColor: '#8e88aa',
            borderRadius: 5,
            minHeight: 96,
            padding: '12px 11px'
          }}>
            <div>
              <Link to="" className="text-white fw-medium" style={{
                fontSize: 16
              }}>
                Lahomes Group , Pvt Ltd
              </Link>
              <p className="mb-0" style={{
                color: '#d8d4e6',
                fontSize: 14
              }}>Markova , USA</p>
              <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                <ul className="d-flex m-0 list-unstyled" style={{
                  color: '#ff9b44',
                  fontSize: 19
                }}>
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
                <p className="mb-0 text-white" style={{
                  fontSize: 14
                }}>4.5 / 5 Rating</p>
              </div>
            </div>
            <div>
              <Link to="">
                <div className="flex-shrink-0">
                  <span className="flex-centered text-white rounded-circle" style={{
                    width: 36,
                    height: 36,
                    backgroundColor: '#604ae3',
                    fontSize: 22
                  }}>
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
export default TopProperties;
