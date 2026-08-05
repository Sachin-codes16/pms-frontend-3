import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { resolvePhotoSrc } from '@/utils/imageStorage';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';

const TopProperties = ({ topProperty }) => {
  const name = topProperty?.buildingDetails || topProperty?.propertyDetails?.buildingName || '—';
  const location = [topProperty?.propertyDetails?.city, topProperty?.propertyDetails?.country].filter(Boolean).join(', ') || '—';
  const rent = topProperty?.propertyDetails?.monthlyRent ?? topProperty?.expectedRent;
  const photo = topProperty?.photos?.[0];
  const detailPath = topProperty ? `/landlord/detailspage?property_id=${topProperty.propertyId}` : '';

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
        <p className="mb-0" style={{ color: '#647c99', fontSize: 13 }}>By highest monthly rent</p>
      </CardHeader>
      <CardBody style={{
        padding: '34px 20px 12px'
      }}>
        <div className="position-relative overflow-hidden z-1 text-center" style={{
          backgroundColor: '#625b87',
          borderRadius: 5,
          padding: 10
        }}>
          {photo ? (
            <img src={resolvePhotoSrc(photo)} alt={name} className="img-fluid w-100" style={{
              height: 150,
              objectFit: 'cover',
              borderRadius: 4
            }} />
          ) : (
            <div className="d-flex align-items-center justify-content-center" style={{ height: 150, borderRadius: 4, background: '#7a739b', color: '#fff' }}>
              <IconifyIcon icon="solar:home-2-bold-duotone" width={48} height={48} />
            </div>
          )}
          <div className="d-flex align-items-center justify-content-between mt-2 text-start" style={{
            backgroundColor: '#8e88aa',
            borderRadius: 5,
            minHeight: 96,
            padding: '12px 11px'
          }}>
            <div>
              <Link to={detailPath} className="text-white fw-medium" style={{
                fontSize: 16
              }}>
                {name}
              </Link>
              <p className="mb-0" style={{
                color: '#d8d4e6',
                fontSize: 14
              }}>{location}</p>
              <p className="mb-0 text-white mt-2" style={{
                fontSize: 14
              }}>{rent != null ? `OMR ${rent} / month` : '—'}</p>
            </div>
            <div>
              <Link to={detailPath}>
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
