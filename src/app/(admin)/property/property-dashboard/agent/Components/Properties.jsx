import IconifyIcon from '@/components/wrappers/IconifyIcon';
import WorldVectorMap from '@/components/VectorMap/WorldMap';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar, Row } from 'react-bootstrap';
import { countryData } from '../data';
import { Fragment } from 'react';

const progressColors = {
  primary: '#9b35e8',
  info: '#45c3c9',
  warning: '#f8944d',
  success: '#58bd7d'
};

const Properties = () => {
  // Map options
  const worldMapOptions = {
    map: 'world',
    zoomOnScroll: false,
    zoomButtons: false,
    markersSelectable: false,
    markers: [
      { name: 'Muscat', coords: [56.1304, -106.3468] },
      { name: 'Salalah', coords: [37.0902, -95.7129] },
      { name: 'Seeb', coords: [-14.235, -51.9253] },
      { name: 'Sohar', coords: [61, 105] },
      { name: 'Nizwa', coords: [35.8617, 104.1954] }
    ],
    markerStyle: {
      initial: { fill: '#5B8DEC' },
      selected: { fill: '#ed5565' }
    },
    labels: {
      markers: {
        render: marker => marker.name
      }
    },
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1
      }
    }
  };

  return (
    <Col lg={7}>
      <Card className="border-0 shadow-sm" style={{
        borderRadius: 5,
        minHeight: 420
      }}>
        <CardHeader className="d-flex justify-content-between align-items-center border-0 bg-white" style={{
          padding: '16px 20px 0'
        }}>
          <CardTitle as={'h4'} className="mb-0" style={{
            color: '#536b86',
            fontSize: 16,
            fontWeight: 600
          }}>Properties</CardTitle>
          <Dropdown>
            <DropdownToggle 
              as={'a'} 
              className="btn btn-sm btn-outline-light content-none icons-center" 
              style={{
                borderRadius: 5,
                color: '#2f3848',
                padding: '8px 12px'
              }}
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              Oman <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem>Oman</DropdownItem>
              <DropdownItem>ABCD</DropdownItem>
              <DropdownItem>China</DropdownItem>
              <DropdownItem>Canada</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>
        
        <CardBody style={{
          padding: '40px 20px 24px'
        }}>
          <Row className="align-items-start">
            {/* Left Side - Total Leads & Map */}
            <Col lg={6}>
              {/* Total Leads */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="flex-centered" style={{
                  width: 56,
                  height: 56,
                  borderRadius: 5,
                  backgroundColor: '#f7f8fb'
                }}>
                  <IconifyIcon 
                    icon="solar:user-rounded-broken" 
                    width={32} 
                    height={32} 
                    style={{ color: '#604ae3' }}
                  />
                </div>
                <div>
                  <p className="mb-1 text-dark fw-medium" style={{ fontSize: 22, lineHeight: 1 }}>745</p>
                  <small style={{ color: '#647c99' }}>(Total Leads)</small>
                </div>
              </div>
              
              {/* Map */}
              <div style={{ height: 250, marginTop: 16 }}>
                <WorldVectorMap 
                  height="250px" 
                  width="100%" 
                  options={worldMapOptions} 
                />
              </div>
            </Col>
            
            {/* Right Side - Country Stats */}
            <Col lg={6}>
              <div style={{
                border: '1px solid #edf0f4',
                borderRadius: 5,
                padding: '20px 20px 18px'
              }}>
                {countryData.map((item, idx) => (
                  <Fragment key={idx}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <p className="mb-0" style={{
                        color: '#647c99',
                        fontSize: 14
                      }}>
                        <IconifyIcon icon={item.icon} className="fs-16 align-middle me-2" />
                        <span className="align-middle fw-medium">{item.country}</span>
                      </p>
                      <p className="mb-0 fw-semibold" style={{
                        color: '#536b86',
                        fontSize: 13
                      }}>{item.view}</p>
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
                            width: `${item.progress}%`,
                            height: '100%',
                            backgroundColor: progressColors[item.variant],
                            borderRadius: 10
                          }} />
                        </div>
                      </Col>
                      <Col xs={'auto'}>
                        <p className="mb-0" style={{
                          color: '#647c99',
                          fontSize: 12
                        }}>{item.progress}%</p>
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
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Properties;
