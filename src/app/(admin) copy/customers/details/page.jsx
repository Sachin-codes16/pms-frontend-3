import PageTitle from '@/components/PageTitle';
import { getAllProperty } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import CustomerCard from './components/CustomerCard';
import CustomersDetails from './components/CustomersDetails';
import OwnProperty from './components/OwnProperty';
import PropertyCard from './components/PropertyCard';
import TransactionHistory from './components/TransactionHistory';
import Transactions from './components/Transactions';
import WeeklyInquiry from './components/WeeklyInquiry';
import { customerData } from './data';
const CustomerDetailsPage = () => {
  const propertyData = useFetchData(getAllProperty);
  return <>
  <div style={{
        fontSize: '1.2rem',
        fontWeight: 550,
        color: 'black',
        marginBottom: '1rem',
        paddingLeft: ''
      }}>
        Tenant Overview/Tenant
      </div>
      <Row>
        
          <CustomersDetails />
         
          
         
        <Col xl={4} lg={12}>
          {/* <WeeklyInquiry /> */}
          {/* <Transactions /> */}
          {/* <OwnProperty /> */}
        </Col>
      </Row>
      {/* <TransactionHistory /> */}
    </>;
};
export default CustomerDetailsPage;