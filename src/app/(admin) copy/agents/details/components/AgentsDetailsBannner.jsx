import propertiesImg from '@/assets/images/properties/p-12.jpg';

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
const AgentsDetailsBanner = () => {
  return <Row>
      <Col lg={12}>
        
          
          <CardBody>
            <Row>
              <Col lg={12}>
                <div className="position-relative">
                  <img src={propertiesImg} alt="properties" className="img-fluid rounded border border-light border-4" />
                </div>
              </Col>
            </Row>
          </CardBody>
        
      </Col>
    </Row>;
};
export default AgentsDetailsBanner;