import { Col, Row } from 'react-bootstrap';
import { usePropertyDashboardController } from '../../controllers/usePropertyDashboardController';
import OccupancyOverview from '../../property-dashboard/agent/Components/OccupancyOverview';
import Overview from '../../property-dashboard/agent/Components/Overview';
import Properties from '../../property-dashboard/agent/Components/Properties';
import PropertyStats from '../../property-dashboard/agent/Components/PropertyStats';
import RecentProperties from '../../property-dashboard/agent/Components/RecentProperties';
import TopProperties from '../../property-dashboard/agent/Components/TopProperties';
import TotalPropertiesListed from '../../property-dashboard/agent/Components/TotalPropertiesListed';

const PropertyDashboardView = () => {
  usePropertyDashboardController();

  return (
    <div className="property-dashboard-page">
      <style>
        {`
          .property-dashboard-page .card {
            margin-bottom: 0;
          }
        `}
      </style>
      <h4 className="mb-3 fw-semibold" style={{ color: '#516986', fontSize: '17px' }}>Property Dashboard</h4>

      <Row className="g-3 mb-3">
        <PropertyStats />
      </Row>

      <Row className="g-3 mb-3">
        <Col xl={9}>
          <Row className="g-3">
            <OccupancyOverview />
            <TotalPropertiesListed />
          </Row>
        </Col>
        <Col xl={3}>
          <TopProperties />
        </Col>
      </Row>

      <Row className="g-3">
        <Col xl={9}>
          <Row className="g-3">
            <Overview />
            <Properties />
          </Row>
        </Col>

        <Col xl={3}>
          <RecentProperties />
        </Col>
      </Row>
    </div>
  );
};

export default PropertyDashboardView;
