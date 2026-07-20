import Spinner from '@/components/Spinner';
import { Col, Row } from 'react-bootstrap';
import { useAnalyticsDashboardController } from '../controllers/useAnalyticsDashboardController';
import RecentCheckInOuts from '../components/RecentCheckInOuts';
import SocialSource from '../components/SocialSource';
import Statistics from '../components/Statistics';
import UpcomingActivities from '../components/UpcomingActivities';

const AnalyticsDashboardView = () => {
  const { stats, statusOverview, monthlyOverview, pendingSettlements, recentCheckIns, recentCheckOuts, loading, error } =
    useAnalyticsDashboardController();

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
        Failed to load Dashboard: {error}
      </div>
    );
  }

  return (
    <>
      <h4 className="mb-2 fw-semibold" style={{ color: '#516986', fontSize: '17px' }}>Dashboard</h4>
      <Statistics stats={stats} />

      <SocialSource statusOverview={statusOverview} monthlyOverview={monthlyOverview} pendingSettlements={pendingSettlements} />

      <Row className="g-3 mt-1">
        <Col xl={7} lg={7}>
          <RecentCheckInOuts checkIns={recentCheckIns} checkOuts={recentCheckOuts} />
        </Col>
        <Col xl={5} lg={5}>
          <UpcomingActivities />
        </Col>
      </Row>
    </>
  );
};

export default AnalyticsDashboardView;
