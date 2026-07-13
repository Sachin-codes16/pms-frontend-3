import PageTitle from '@/components/PageTitle';
import { Col, Row } from 'react-bootstrap';
import CustomerByCountry from './components/CustomerByCountry';
import CustomerCountry from './components/CustomerCountry';
import CustomersInvest from './components/CustomersInvest';
import CustomerVisit from './components/CustomerVisit';
import PropertyInvestor from './components/PropertyInvestor';
import PurchaseProperty from './components/PurchaseProperty';
import TopCustomer from './components/TopCustomer';
const CustomerPage = () => {
  return <>
      <PageTitle title="Add Leads" subName="" />
      <Row>
        <Col xl={8} lg={12}>
          <CustomerCountry />
          <Row>
            <Col lg={6}></Col>
          </Row>
        </Col>
        <PropertyInvestor />
      </Row>
      <Row>
        <CustomersInvest />
        <CustomerByCountry />
      </Row>
      <Row>
        <TopCustomer />
        <CustomerVisit />
        <PurchaseProperty />
      </Row>
    </>;
};
export default CustomerPage;