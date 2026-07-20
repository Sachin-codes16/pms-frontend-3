import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, CardTitle, Col } from 'react-bootstrap';
import { checkInOutOptions } from '../data';

const CheckInOutOverview = ({ categories = [], series = [] }) => {
  const highest = series.reduce((max, s) => Math.max(max, ...(s.data ?? [])), 0);
  // Round the axis ceiling up to the nearest 10 (min 40) so real data never clips.
  const maxValue = Math.max(40, Math.ceil((highest || 1) / 10) * 10);
  const options = {
    ...checkInOutOptions,
    xaxis: { ...checkInOutOptions.xaxis, categories },
    yaxis: { ...checkInOutOptions.yaxis, max: maxValue, tickAmount: 4 },
  };

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
            <ReactApexChart options={options} series={series} height={306} type="bar" className="apex-charts" />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};
export default CheckInOutOverview;
