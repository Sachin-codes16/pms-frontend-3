import { Col, Row } from 'react-bootstrap';
import Conversions from './components/Conversions';
import FriendsRequest from './components/FriendsRequest';
import ProjectSummary from './components/ProjectSummary';
import RecentTransactions from './components/RecentTransactions';
import Schedules from './components/Schedules';
import Statistic from './components/Statistic';
import Stats from './components/Stats';
import Tasks from './components/Tasks';
const WidgetsPage = () => {
  return <>
      <div>
        <Stats />
        <Statistic />
        <Row>
          <Col xl={6}>
            <ProjectSummary />
          </Col>
          <Col xl={6}>
            <Schedules />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Conversions />
          </Col>
        </Row>
        <Row>
          <Col xl={4}>
            <Tasks />
          </Col>
          <Col xl={4}>
            <FriendsRequest />
          </Col>
          <Col xl={4}>
            <RecentTransactions />
          </Col>
        </Row>
      </div>
    </>;
};
export default WidgetsPage;