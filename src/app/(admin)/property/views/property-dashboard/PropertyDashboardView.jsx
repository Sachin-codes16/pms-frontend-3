import { Col, Row } from 'react-bootstrap';
import Spinner from '@/components/Spinner';
import { usePropertyDashboardController } from '../../controllers/usePropertyDashboardController';
import OccupancyOverview from '../../property-dashboard/agent/Components/OccupancyOverview';
import Overview from '../../property-dashboard/agent/Components/Overview';
import Properties from '../../property-dashboard/agent/Components/Properties';
import PropertyStats from '../../property-dashboard/agent/Components/PropertyStats';
import RecentProperties from '../../property-dashboard/agent/Components/RecentProperties';
import TopProperties from '../../property-dashboard/agent/Components/TopProperties';
import TotalPropertiesListed from '../../property-dashboard/agent/Components/TotalPropertiesListed';

const PropertyDashboardView = () => {
  const {
    loading,
    error,
    statData,
    occupancyStatusData,
    typeBreakdown,
    cityBreakdown,
    topProperty,
    occupiedCount,
    occupiedPercent,
    totalProperties,
    recentProperties,
  } = usePropertyDashboardController();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 300, color: '#e05252' }}>
        Failed to load Property Dashboard: {error}
      </div>
    );
  }

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
        <PropertyStats statData={statData} />
      </Row>

      <Row className="g-3 mb-3">
        <Col xl={9}>
          <Row className="g-3">
            <OccupancyOverview occupancyStatusData={occupancyStatusData} />
            <TotalPropertiesListed typeBreakdown={typeBreakdown} totalProperties={totalProperties} />
          </Row>
        </Col>
        <Col xl={3}>
          <TopProperties topProperty={topProperty} />
        </Col>
      </Row>

      <Row className="g-3">
        <Col xl={9}>
          <Row className="g-3">
            <Overview occupiedCount={occupiedCount} occupiedPercent={occupiedPercent} totalProperties={totalProperties} />
            <Properties cityBreakdown={cityBreakdown} totalProperties={totalProperties} />
          </Row>
        </Col>

        <Col xl={3}>
          <RecentProperties recentProperties={recentProperties} totalProperties={totalProperties} />
        </Col>
      </Row>
    </div>
  );
};

export default PropertyDashboardView;
