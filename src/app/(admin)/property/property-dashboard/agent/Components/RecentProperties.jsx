import IconifyIcon from '@/components/wrappers/IconifyIcon';
import clsx from 'clsx';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const recentProperties = [
  { name: 'Silver Apartment', location: 'P.O.Box 1609, Muscat, Oman', date: 'Dec 2025' },
  { name: 'D Residency', location: 'P.O.Box 1609, Muscat, Oman', date: 'Dec 2025' },
  { name: 'Luxury Penthouse', location: 'P.O.Box 1609, Muscat, Oman', date: 'Dec 2025' },
  { name: 'Weekend Villa', location: 'P.O.Box 1609, Muscat, Oman', date: 'Dec 2025' },
];

const RecentProperties = () => {
  const navigate = useNavigate();
  const joinDataLength = recentProperties.length - 1;
  return <Card className="border-0 shadow-sm" style={{
      borderRadius: 5
    }}>
      <CardHeader className="border-0 bg-white" style={{
        padding: '16px 20px 0'
      }}>
        <div>
          <CardTitle as={'h4'} className="mb-1" style={{
            color: '#536b86',
            fontSize: 16,
            fontWeight: 600
          }}>
            Recent Properties
          </CardTitle>
          <p className="mb-0" style={{
            color: '#647c99',
            fontSize: 14
          }}>450 Properties</p>
        </div>
      </CardHeader>
      <CardBody style={{
        padding: '20px 20px 0'
      }}>
        {recentProperties.map((item, idx) => <div className={clsx(`d-flex flex-wrap align-items-center justify-content-between ${joinDataLength == idx ? '' : 'border-bottom'}  ${joinDataLength == idx || idx == 0 ? '' : 'py-3'} gap-2 ${idx == 0 && 'pb-3'} ${joinDataLength == idx && 'pt-3'}`)} key={idx}>
            <div className="d-flex align-items-center gap-3">
              <div>
                <span className="flex-centered rounded-circle" style={{
                  width: 48,
                  height: 48,
                  backgroundColor: '#d9d9d9',
                  color: '#111',
                  fontSize: 14
                }}>
                  <IconifyIcon icon="solar:gallery-minimalistic-broken" />
                </span>
              </div>
              <div className="d-block">
                <span className="text-dark">
                  <Link to="" className="text-dark fw-medium" style={{
                    fontSize: 15
                  }}>
                    {item.name}
                  </Link>
                </span>
                <p className="mb-0" style={{
                  color: '#647c99',
                  fontSize: 13
                }}>{item.location}</p>
              </div>
            </div>
            <div>
              <p className="fw-medium mb-0" style={{
                color: '#536b86',
                fontSize: 14
              }}>{item.date}</p>
            </div>
          </div>)}
      </CardBody>
      <CardFooter className="border-top bg-white" style={{
        padding: '15px 20px'
      }}>
        <Button onClick={() => navigate('/landlord/property-grid')} variant="primary" className="w-100" style={{
          backgroundColor: '#604ae3',
          borderColor: '#604ae3',
          borderRadius: 5,
          padding: '11px 16px'
        }}>
          View All
        </Button>
      </CardFooter>
    </Card>;
};
export default RecentProperties;
