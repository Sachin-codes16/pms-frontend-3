import { Card, CardBody, Col, Row } from 'react-bootstrap';
import avatar from '@/assets/images/users/avatar-2.jpg'; 
import AgentDetailsCard from './AgentDetailsCard';

const AgentDetails = () => {
   const properties = [
    {
      code: 'PRP-10234',
      name: 'Green Valley Villa 12A',
      type: 'Villa',
      location: 'Muscat',
      status: 'Vacant'
    },
    {
      code: 'PRP-10234',
      name: 'Green Valley Villa 14B',
      type: 'Villa',
      location: 'Salalah',
      status: 'Occupied'
    }
  ];
  return (
    <div style={{ 
      backgroundColor: '#F9F9FC',
       minHeight: '100vh',
      padding: ''  //
    }}>
     
      <div style={{ 
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0'  
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
              Mr. Rajesh Mehta
            </h2>
            <p style={{ 
              margin: 0, 
              color: 'black',
              fontSize: '1rem',
              fontWeight: 400
            }}>
              Green Valley Society, Muskat, Oman, 4100001
            </p>
          </div>
        </div>

       
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
      Mr. Rajesh Mehta
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
                      EMAIL ADDRESS
                    </p>
                    <p style={{ 
                      fontSize: '0.999rem',
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
                      ID NUMBER
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      ABCDE1234F
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
                      XXXX-XXXX-4321
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
              Residential Address
            </h4>
            
            <div style={{ 
              borderTop: '1px solid #dee2e6',
              paddingTop: '1.75rem'
            }}>
              {/* Address */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'black',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  ADDRESS
                </p>
                <p style={{ 
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#000',
                  margin: 0
                }}>
                  Green Valley Society, Muskat, Oman
                </p>
              </div>

              <Row>
                {/* City */}
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
                      CITY
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      Muskat
                    </p>
                  </div>
                </Col>

                {/* State */}
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
                      STATE
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      Muskat
                    </p>
                  </div>
                </Col>

                {/* PO Box */}
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
                      PO BOX
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      401000
                    </p>
                  </div>
                </Col>

                {/* Google Map */}
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
                      GOOGLE MAP
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
                      View Location
                    </a>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </div>
    
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
              Bank & Payout Details
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
      ACCOUNT HOLDER NAME
    </p>
    <p style={{ 
      fontSize: '0.938rem',   
      fontWeight: 600,        
      color: '#000',          
      margin: 0,
      lineHeight: 1.5
    }}>
      Mr. Rajesh Mehta
    </p>
  </div>
</Col>

                {/* Mobile Number */}
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
                      BANK NAME 
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      HDFC Bank
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
                      ACCOUNT NUMBER
                    </p>
                    <p style={{ 
                      fontSize: '0.999rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                     XXXXXX9812
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
                      IFSC CODE
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      HDFC0001234
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
                      PAYOUT METHOD
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                     Monthely NEFT 
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
              Commercial Terms
            </h4>
            
            <div style={{ 
              borderTop: '1px solid #dee2e6',
              paddingTop: '1.75rem'
            }}>
              <Row>
                {/* Full Name */}
               {/* Full Name */}
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
      REVENUE MODEL
    </p>
    <p style={{ 
      fontSize: '0.938rem',  
      fontWeight: 600,       
      color: '#000',        
      margin: 0,
      lineHeight: 1.5
    }}>
      Revenue Sharing 
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
                      COMMISSION/SHARE
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      20%
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
                      AGREEMENT START
                    </p>
                    <p style={{ 
                      fontSize: '0.999rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      01 Jan 2026
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
                      AGREEMENT END
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      31 Dec 2026
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
                      GST REGISTERED
                    </p>
                    <p style={{ 
                      fontSize: '0.938rem',
                      fontWeight: 600,
                      color: '#000',
                      margin: 0
                    }}>
                      NO
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
          Properties Linked
        </h4>
        
      
        <div style={{ 
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1.5rem'
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
              PROPERTY CODE
            </div>
            <div style={{ 
              fontSize: '0.938rem',
              fontWeight: 600,
              color: 'black',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              PROPERTY NAME
            </div>
            <div style={{ 
              fontSize: '0.938rem',
              fontWeight: 600,
              color: 'black',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              TYPE
            </div>
            <div style={{ 
              fontSize: '0.938rem',
              fontWeight: 600,
              color: 'black',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              LOCATION
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
              Dacuments & KYC 
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
      Passport
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
                      Resident Card
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
                      Signed Sale
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
                      letterSpacing: '0.5px',
                      
                    }}>
             No Objection 
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
                      Bank Statements
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
              System Information
            </h4>
            
            <div style={{ 
              borderTop: '1px solid #dee2e6',
              paddingTop: '1.75rem'
            }}>
              <Row>
                {/* Full Name */}
               {/* Full Name */}
        <Col lg={2} md={4} sm={6}>
         <div style={{ marginBottom: '1.5rem' }}>
         <p style={{ 
          fontSize: '1rem',  // Thoda chhota label
         fontWeight: 500,        // Bold
         color: 'black',       // Dark gray
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

               

                {/* Email Address */}
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

              

                {/* Resident Number */}
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
              </Row>
            </div>
          </CardBody>
        </Card>
  

      {/* Original AgentDetailsCard Component */}
      <AgentDetailsCard />
    </div>
  );
};

export default AgentDetails;