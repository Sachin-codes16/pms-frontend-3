import { Col, Row } from 'react-bootstrap';
import { useCheckInDashboardController } from '../../controllers/useCheckInDashboardController';
import CheckInDashboardHeader from '../../dashboard/components/CheckInDashboardHeader';
import CheckInPropertyTypeChart from '../../dashboard/components/CheckInPropertyTypeChart';
import CheckInStats from '../../dashboard/components/CheckInStats';
import CheckInStatusChart from '../../dashboard/components/CheckInStatusChart';
import CheckInWorkflow from '../../dashboard/components/CheckInWorkflow';
import RentPaymentSummary from '../../dashboard/components/RentPaymentSummary';
import UpcomingCheckIns from '../../dashboard/components/UpcommingCheckins';

const CheckInDashboardView = () => {
  const { propertyTypes, rentPaymentSummary, stats, statusOverview, upcomingCheckIns, workflowSteps } = useCheckInDashboardController();

  return (
    <div>
      <CheckInDashboardHeader />
      <div className="mt-2">
        <CheckInStats stats={stats} />
      </div>
      <Row className="g-2 mt-2 align-items-start">
        <Col xs={12} md={4} className="d-flex">
          <CheckInStatusChart data={statusOverview} />
        </Col>
        <Col xs={12} md={4} className="d-flex">
          <CheckInPropertyTypeChart data={propertyTypes} />
        </Col>
        <Col xs={12} md={4} className="d-flex">
          <CheckInWorkflow steps={workflowSteps} />
        </Col>
      </Row>
      <Row className="g-3 align-items-start">
        <Col xs={12} lg={8} xl={7} xxl={7} className="order-1 d-flex">
          <RentPaymentSummary data={rentPaymentSummary} />
        </Col>
        <Col xs={12} lg={4} xl={5} xxl={5} className="order-2 d-flex">
          <UpcomingCheckIns data={upcomingCheckIns} />
        </Col>
      </Row>
    </div>
  );
};

export default CheckInDashboardView;
