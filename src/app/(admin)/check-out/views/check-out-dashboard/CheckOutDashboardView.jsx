import Spinner from '@/components/Spinner';
import { Col, Row } from 'react-bootstrap';
import { useCheckOutDashboardController } from '../../controllers/useCheckOutDashboardController';
import CheckOutOverviewCards from './CheckOutOverviewCards';
import CheckOutProgressCard from './CheckOutProgressCard';
import CheckOutStatusOverview from './CheckOutStatusOverview';
import Dashboardtop from './Dashboardtop';
import PendingCheckOuts from './PendingCheckOuts';
import UpcomingCheckOuts from './UpcomingCheckOuts';

const CheckOutDashboardView = () => {
  const { overviewCards, pendingCheckOuts, progressSteps, progressSummary, stats, statusOverview, upcomingCheckOuts, loading, error } =
    useCheckOutDashboardController();

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
        Failed to load Check-Out Dashboard: {error}
      </div>
    );
  }

  return (
    <>
      <Dashboardtop stats={stats} />

      <Row className="g-3" style={{ marginTop: 8 }}>
        <Col xs={12} xl={8}>
          <CheckOutProgressCard steps={progressSteps} summary={progressSummary} />
        </Col>
        <Col xs={12} xl={4}>
          <CheckOutStatusOverview data={statusOverview} />
        </Col>
      </Row>

      <Row className="g-3 align-items-stretch" style={{ marginTop: 8 }}>
        <Col xs={12} lg={8} className="d-flex align-self-stretch">
          <PendingCheckOuts rows={pendingCheckOuts} />
        </Col>
        <Col xs={12} lg={4} className="d-flex align-self-stretch">
          <UpcomingCheckOuts data={upcomingCheckOuts} />
        </Col>
      </Row>

      <div className="mt-4">
        <CheckOutOverviewCards cards={overviewCards} />
      </div>

    </>
  );
};

export default CheckOutDashboardView;
