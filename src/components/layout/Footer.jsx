import { currentYear } from '@/context/constants';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import IconifyIcon from '../wrappers/IconifyIcon';
const Footer = () => {
  return <footer className="footer">
      <Container fluid>
        <Row>
          <Col xs={12} className="text-center">
            {currentYear}  <IconifyIcon icon="" className="fs-18 align-middle text-danger" />{' '}
            <Link to="" className="fw-bold footer-text" target="_blank">
              
            </Link>
          </Col>
        </Row>
      </Container>
    </footer>;
};
export default Footer;
