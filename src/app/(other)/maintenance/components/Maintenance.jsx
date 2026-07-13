import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import maintenanceImg from '@/assets/images/maintenance.svg';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
const Maintenance = () => {
  useEffect(() => {
    document.body.classList.add('authentication-bg');
    return () => {
      document.body.classList.remove('authentication-bg');
    };
  }, []);
  return <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col xl={12}>
            <Card className="auth-card">
              <CardBody className="p-0">
                <Row className="align-items-center g-0">
                  <Col lg={4} className="d-none d-lg-inline-block border-end">
                    <div className="auth-page-sidebar">
                      <img src={maintenanceImg} alt="auth" className="img-fluid" />
                    </div>
                  </Col>
                  <Col lg={8}>
                    <div className="p-4">
                      <div className="mx-auto mb-5 text-center auth-logo">
                        <Link to="/dashboards/analytics" className="logo-dark">
                          <img src={logoDark} height={32} alt="logo dark" />
                        </Link>
                        <Link to="/dashboards/analytics" className="logo-light">
                          <img src={logoLight} height={28} alt="logo light" />
                        </Link>
                      </div>
                      <h2 className="fw-bold text-center lh-base">We are currently performing maintenance</h2>
                      <p className="text-muted text-center mt-1 mb-4">We&apos;re making the system more awesome. We&apos;ll be back shortly.</p>
                      <div className="text-center">
                        <Button variant="danger">Contact Us</Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>;
};
export default Maintenance;