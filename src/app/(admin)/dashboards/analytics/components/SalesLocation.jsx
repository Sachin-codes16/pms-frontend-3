import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, CardTitle, Col } from 'react-bootstrap';
import { checkInOutOptions, checkInOutSeries } from '../data';

const CheckInOutOverview = () => {
  return (
    <Col xl={4} lg={6}>
      <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '8px', minHeight: '372px' }}>
        <CardHeader className="border-0" style={{ backgroundColor: '#fbfcfe', padding: '22px 28px 16px' }}>
          <CardTitle as={'h4'} className="mb-0 fw-semibold" style={{ color: '#516986', fontSize: '17px' }}>
            Check-in & Check-Out Overview
          </CardTitle>
        </CardHeader>
        <CardBody style={{ padding: '0 20px', overflow: 'hidden' }}>
          <div style={{ transform: 'scale(1.08)', transformOrigin: 'top center' }}>
            <ReactApexChart options={checkInOutOptions} series={checkInOutSeries} height={306} type="bar" className="apex-charts" />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};
export default CheckInOutOverview;
