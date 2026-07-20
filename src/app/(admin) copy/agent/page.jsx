
import PageTitle from '@/components/PageTitle';
import { Col, Row } from 'react-bootstrap';
import CollectionRent from './Components/CollectionRent';
// import Goals from './components/Goals';
import JoinAgent from './components/JoinAgent';
// import RecentAgent from './components/RecentAgent';
// import SalesFunnel from './components/SalesFunnel';
import SessionsCountry from './components/SessionsCountry';
import Statistics from './components/Statistics';
import TopAgents from './components/TopAgents';
import TotalRevenue from './components/TotalRevenue';

const AgentPage = () => {
  return (
    <>
      <PageTitle title="Landlord" />
      
      <Row>
        <Statistics />
      </Row>
      
      <Row>
        <Col xl={9}>
          <Row>
            <TotalRevenue />
          </Row>
          
          
          <Row className="g-3">
            <CollectionRent />
            <SessionsCountry />
          </Row>
        </Col>
        
        <Col xl={3}>
          <TopAgents />
          <JoinAgent />
        </Col>
      </Row>
    </>
  );
};

export default AgentPage;