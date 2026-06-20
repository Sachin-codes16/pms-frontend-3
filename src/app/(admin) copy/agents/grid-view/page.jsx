import PageTitle from '@/components/PageTitle';
import { Card, CardHeader, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AgentData from './Components/AgentData';
import AgentGridCard from './Components/AgentGridCard';

const GridViewPage = () => {
  return (
    <>
      <PageTitle subName="" title="Tenants" />
      <AgentGridCard />

      <Row>
        <Col lg={12}>
          <Card className="bg-body shadow-none">
            <CardHeader className="border-0">
              <Row className="justify-content-between align-items-center">
                <Col lg={6} />
                <Col lg={6}>
                  <div className="text-md-end mt-3 mt-md-0">
                    <Link to="/add leads" className="btn btn-outline-primary me-1">
                      + New Tenants
                    </Link>
                  </div>
                </Col>
              </Row>
            </CardHeader>
          </Card>
        </Col>
      </Row>

      {/* AgentData now includes its own pagination */}
      <AgentData />
    </>
  );
};

export default GridViewPage;