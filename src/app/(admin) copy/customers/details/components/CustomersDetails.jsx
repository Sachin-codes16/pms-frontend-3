import properties11 from '@/assets/images/properties/p-11.jpg';
import properties13 from '@/assets/images/properties/p-13.jpg';
import properties14 from '@/assets/images/properties/p-14.jpg';
import properties15 from '@/assets/images/properties/p-15.jpg';

import avatar from '@/assets/images/users/avatar-2.jpg'; 
import avatar2 from '@/assets/images/users/avatar-2.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, Carousel, CarouselItem, Col, Row } from 'react-bootstrap';

  
  const CustomersDetails = () => {
  const properties = [
    {
      code: 'March 2026',
      name: 'OMR 8,500',
      type: 'UPI',
      location: '01 Mar 2026',
      status: 'Paid'
    },
    {
      code: 'February 2026',
      name: 'OMR 8,500',
      type: 'BANK NEFT',
      location: '1 Feb 2026',
      status: 'Paid'
    }
  ];

  return (
    <div style={{ 
      backgroundColor: '#F9F9FC',
      minHeight: '100vh',
      padding: ''
    }}>
      {/* Image Carousel Section */}
      <Row className="g-0">
        <Col className="px-0">
          <Card className="w-100 border-0 rounded-0" style={{width:'100%', height:'70%',borderRadius:'2rem',}}> 
            <CardBody className="p-0">
              <Carousel indicators={false}>
                <CarouselItem className="active" style={{height:'500px'}}>
                  <img src={properties14} height={425} className="d-block w-100 h-100 rounded" alt="img-6" />
                  <div className="carousel-caption"></div>
                </CarouselItem>
                <CarouselItem className="carousel-item" style={{height:'500px'}}>
                  <img height={425} src={properties13} className="d-block w-100 h-100 rounded" alt="img-7" />
                  <div className="carousel-caption"></div>
                </CarouselItem>
                <CarouselItem className="carousel-item" style={{height:'500px'}}>
                  <img height={425} src={properties11} className="d-block w-100 h-100 rounded" alt="img-5" />
                  <div className="carousel-caption"></div>
                </CarouselItem>
                <CarouselItem className="carousel-item" style={{height:'500px'}}>
                  <img height={425} src={properties15} className="d-block w-100 h-100 rounded" alt="img-5" />
                  <div className="carousel-caption"></div>
                </CarouselItem>
              </Carousel>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Profile Section */}
      <div style={{ 
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0',
        marginTop: '0rem'
      }}>
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingLeft: '0rem',
          paddingRight: '1rem'
        }}>
          <img 
            src={avatar} 
            alt="profile" 
            style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%',
              border: '3px solid white',
              objectFit: 'cover'
            }} 
          />
          <div>
            <h2 style={{ 
              fontSize: '1.375rem', 
              fontWeight: 700, 
              marginBottom: '0.25rem',
              color: '#000'
            }}>
              Mr. Amit Sharma
            </h2>
            <p style={{ 
              margin: 0, 
              color: 'black',
              fontSize: '1rem',
              fontWeight: 400
            }}>
              Tenant ID:TN-0042 . Status: Active
            </p>
          </div>
        </div>

      {/* Basic Profile Card */}
<Card style={{ 
  borderRadius: '0.5rem',
  border: '1px solid #dee2e6',
  marginBottom: '1.5rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  backgroundColor: 'white',
  marginLeft: '0rem',
  marginRight: '0rem'
}}>
  <CardBody style={{ padding: '2rem 2.5rem' }}>
    <h4 style={{ 
      fontSize: '1.2rem', 
      fontWeight: 600,
      marginBottom: '1.5rem',
      color: '#000'
    }}>
      Basic Profile
    </h4>
    
    <div style={{ 
      borderTop: '1px solid #dee2e6',
      paddingTop: '1.75rem'
    }}>
      <Row>
        <Col lg={2} md={4} sm={6}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ 
              fontSize: '1rem',
              fontWeight: 500,
              color: 'black',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              FULL NAME
            </p>
            <p style={{ 
              fontSize: '0.938rem',
              fontWeight: 600,
              color: '#000',
              margin: 0,
              lineHeight: 1.5
            }}>
              Amit Sharma
            </p>
          </div>
        </Col>

        <Col lg={2} md={4} sm={6}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ 
              fontSize: '1rem',
              fontWeight: 500,
              color: 'black',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              MOBILE NUMBER
            </p>
            <p style={{ 
              fontSize: '0.938rem',
              fontWeight: 600,
              color: '#000',
              margin: 0
            }}>
              98XXXXXX12
            </p>
          </div>
        </Col>

        <Col lg={2} md={4} sm={6}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ 
              fontSize: '1rem',
              fontWeight: 500,
              color: 'black',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              EMAIL ADDRESS
            </p>
            <p style={{ 
              fontSize: '0.938rem',
              fontWeight: 600,
              color: '#000',
              margin: 0
            }}>
              rajesh.mehta@email.com
            </p>
          </div>
        </Col>

        <Col lg={2} md={4} sm={6}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ 
              fontSize: '1rem',
              fontWeight: 500,
              color: 'black',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              OCCUPATION
            </p>
            <p style={{ 
              fontSize: '0.938rem',
              fontWeight: 600,
              color: '#000',
              margin: 0
            }}>
              IT Professional
            </p>
          </div>
        </Col>

        <Col lg={2} md={4} sm={6}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ 
              fontSize: '1rem',
              fontWeight: 500,
              color: 'black',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              COMPANY/BUSINESS
            </p>
            <p style={{ 
              fontSize: '0.938rem',
              fontWeight: 600,
              color: '#000',
              margin: 0
            }}>
              Infosys Ltd.
            </p>
          </div>
        </Col>

        <Col lg={2} md={4} sm={6}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ 
              fontSize: '1rem',
              fontWeight: 500,
              color: 'black',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              TENANT TYPE
            </p>
            <p style={{ 
              fontSize: '0.938rem',
              fontWeight: 600,
              color: '#000',
              margin: 0
            }}>
              Family
            </p>
          </div>
        </Col>
      </Row>
    </div>
  </CardBody>
</Card>

        {/* Residential Address Card */}
        <Card style={{ 
          borderRadius: '0.5rem',
          border: '1px solid #dee2e6',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          backgroundColor: 'white',
          marginLeft: '0rem',
          marginRight: '0rem'
        }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#000'
            }}>
              KYC & Identity
            </h4>
            
            <div style={{ 
              borderTop: '1px solid #dee2e6',
              paddingTop: '1.75rem'
            }}>
              

              <Row>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      ID NUMBER 
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      ABCDE6789D
                    </p>
                  </div>
                </Col>

                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      RESIDENT NUMBER 
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      XXXX-XXXX-1234
                    </p>
                  </div>
                </Col>

                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      VERIFICATION
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      COMPLETED
                    </p>
                  </div>
                </Col>

                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      EMERGENCY CONTACT
                    </p>
                    <a 
                      href="#" 
                      style={{ 
                        fontSize: '0.938rem',
                        fontWeight: 600,
                        color: 'black',
                        textDecoration: 'none',
                        margin: 0
                      }}
                    >
                      Sunita Sharma-9XXXXXX998
                    </a>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>

        {/* Bank & Payout Details Card */}
        <Card style={{ 
          borderRadius: '0.5rem',
          border: '1px solid #dee2e6',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          backgroundColor: 'white',
          marginLeft: '0rem',
          marginRight: '0rem'
        }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#000'
            }}>
              Property Linked 
            </h4>
            
            <div style={{ 
              borderTop: '1px solid #dee2e6',
              paddingTop: '1.75rem'
            }}>
              <Row>
                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px'
                    }}>
                      PROPERTY CODE 
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0,
                      lineHeight: 1.5
                    }}>
                      PRO-10234
                    </p>
                  </div>
                </Col>

                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                     PROPERTY NAME
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      Green Valley Villa 12A
                    </p>
                  </div>
                </Col>

                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      PROPERTY TYPE
                    </p>
                    <p style={{ 
                      fontSize: '0.999rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      Villa
                    </p>
                  </div>
                </Col>

                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      LOCATION
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      MUSCAT
                    </p>
                  </div>
                </Col>

                
              </Row>
            </div>
          </CardBody>
        </Card>
 <Card style={{ 
          borderRadius: '0.5rem',
          border: '1px solid #dee2e6',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          backgroundColor: 'white',
          marginLeft: '0rem',
          marginRight: '0rem'
        }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#000'
            }}>
              Lease & Contact
            </h4>
            
            <div style={{ 
              borderTop: '1px solid #dee2e6',
              paddingTop: '1.75rem'
            }}>
              <Row>
                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px'
                    }}>
                      LEASE START DATE
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0,
                      lineHeight: 1.5
                    }}>
                      01 Feb 2026
                    </p>
                  </div>
                </Col>

                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                     LEASE END DATE
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      31 Jan 2027
                    </p>
                  </div>
                </Col>

                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                    RENT CYCLE
                    </p>
                    <p style={{ 
                      fontSize: '0.999rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      Monthly
                    </p>
                  </div>
                </Col>

                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      LOCK-IN PERIOD
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      6 Months
                    </p>
                  </div>
                </Col>
                
                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      NOTICE PERIOD 
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      2 Months
                    </p>
                  </div>
                </Col>
                
                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      AGREEMENT TYPE
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      Registered
                    </p>
                  </div>
                </Col>

                
              </Row>
            </div>
          </CardBody>
        </Card>
        
        {/* Commercial Terms Card */}
        <Card style={{ 
          borderRadius: '0.5rem',
          border: '1px solid #dee2e6',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          backgroundColor: 'white',
          marginLeft: '0rem',
          marginRight: '0rem'
        }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#000'
            }}>
              Rent & Financials
            </h4>
            
            <div style={{ 
              borderTop: '1px solid #dee2e6',
              paddingTop: '1.75rem'
            }}>
              <Row>
                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px'
                    }}>
                      MONTHLY RENT
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0,
                      lineHeight: 1.5
                    }}>
                      OMR 8,500
                    </p>
                  </div>
                </Col>

                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      SECURITY DEPOSIT
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      OMR 100,000
                    </p>
                  </div>
                </Col>

                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      MAINTENANCE
                    </p>
                    <p style={{ 
                      fontSize: '0.999rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      OMR 1,000
                    </p>
                  </div>
                </Col>

                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      LAST RENT DATE 
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      1 Mar 2026
                    </p>
                  </div>
                </Col>

                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      PAYEMENT STATUS 
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      On Time
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>

        {/* Properties Linked Card */}
        <Card style={{ 
          borderRadius: '0.5rem',
          border: '1px solid #dee2e6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          backgroundColor: 'white',
          marginBottom: '2rem'
        }}>
          <CardBody style={{ padding: '2rem 3rem' }}>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600,
              marginBottom: '2rem',
              color: '#000'
            }}>
              Recent Payments
            </h4>
            
            <div style={{ 
             
            }}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
                gap: '1.5rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  fontSize: '0.938rem',
                  fontWeight: 600,
                  color: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  MONTH
                </div>
                <div style={{ 
                  fontSize: '0.938rem',
                  fontWeight: 600,
                  color: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  AMOUNT
                </div>
                <div style={{ 
                  fontSize: '0.938rem',
                  fontWeight: 600,
                  color: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  MODE
                </div>
                <div style={{ 
                  fontSize: '0.938rem',
                  fontWeight: 600,
                  color: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  DATE
                </div>
                <div style={{ 
                  fontSize: '0.938rem',
                  fontWeight: 600,
                  color: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  STATUS
                </div>
              </div>

              {properties.map((property, index) => (
                <div 
                  key={index}
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
                    gap: '1.5rem',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: index < properties.length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}
                >
                  <div style={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#000',
                    lineHeight: 1.5
                  }}>
                    {property.code}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#000',
                    lineHeight: 1.5
                  }}>
                    {property.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#000',
                    lineHeight: 1.5
                  }}>
                    {property.type}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#000',
                    lineHeight: 1.5
                  }}>
                    {property.location}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#000',
                    lineHeight: 1.5
                  }}>
                    {property.status}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Documents & KYC Card */}
        <Card style={{ 
          borderRadius: '0.5rem',
          border: '1px solid #dee2e6',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          backgroundColor: 'white',
          marginLeft: '0rem',
          marginRight: '0rem'
        }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#000'
            }}>
              Preferences & Rules
            </h4>
            
            <div style={{ 
              borderTop: '1px solid #dee2e6',
              paddingTop: '1.75rem'
            }}>
              <Row>
                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px'
                    }}>
                      No Pets
                    </p>
                  </div>
                </Col>

                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      No Subletting
                    </p>
                  </div>
                </Col>

                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Family Occupancy
                    </p>
                  </div>
                </Col>

               

               
              </Row>
            </div>
          </CardBody>
        </Card>

        {/* System Information Card */}
        <Card style={{ 
          borderRadius: '0.5rem',
          border: '1px solid #dee2e6',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          backgroundColor: 'white',
          marginLeft: '0rem',
          marginRight: '0rem'
        }}>
          <CardBody style={{ padding: '2rem 2.5rem' }}>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#000'
            }}>
              System Information
            </h4>
            
            <div style={{ 
              borderTop: '1px solid #dee2e6',
              paddingTop: '1.75rem'
            }}>
              <Row>
                <Col lg={2} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px'
                    }}>
                      CREATED BY
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      Admin
                    </p>
                  </div>
                </Col>

                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      CREATED ON
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      10 Feb 2026
                    </p>
                  </div>
                </Col>

                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      LAST UPDATED
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      02 Mar 2026
                    </p>
                  </div>
                </Col>
                <Col lg={3} md={4} sm={6}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      TENANT STATUS
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      Active
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Original AgentDetailsCard Component */}
      {/* <AgentDetailsCard /> */}
    </div>
  );
};
      

export default CustomersDetails;