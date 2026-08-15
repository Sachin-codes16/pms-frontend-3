import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

const OccupancyOverview = ({ occupancyStatusData = [] }) => {
  const total = occupancyStatusData.reduce((s, d) => s + d.value, 0) || 1;

  const donutOptions = {
    chart: { type: 'donut' },
    labels: occupancyStatusData.map((d) => d.label),
    colors: occupancyStatusData.map((d) => d.color),
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: '65%' } } },
    tooltip: { theme: 'dark', y: { formatter: (v) => `${v} properties` } },
  };

  return <Col lg={6}>
      <Card className="border-0 shadow-sm overflow-hidden" style={{
        borderRadius: 5,
        minHeight: 354
      }}>
        <CardHeader className="d-flex justify-content-between align-items-center border-0 bg-white" style={{
          padding: '16px 20px 0'
        }}>
          <CardTitle as={'h4'} className="mb-0" style={{
            color: '#536b86',
            fontSize: 16,
            fontWeight: 600
          }}>Occupancy Overview</CardTitle>
        </CardHeader>
        <CardBody style={{
          padding: '14px 0 0'
        }}>
          <div>
            <ReactApexChart options={donutOptions} series={occupancyStatusData.map((d) => d.value)} height={225} type="donut" className="apex-charts" />
          </div>
        </CardBody>
        <CardFooter className="p-0 border-top bg-white">
          <div>
            <Row className="text-center g-0">
              {occupancyStatusData.map((d, i) => (
                <Col lg={3} xs={3} key={d.label} className={i < occupancyStatusData.length - 1 ? 'border-end' : ''} style={{ padding: '8px 4px 9px' }}>
                  <p className="mb-1" style={{ color: '#647c99', fontSize: 14 }}>{d.label}</p>
                  <p className="text-dark fw-medium mb-0" style={{ fontSize: 16 }}>{Math.round((d.value / total) * 100)}%</p>
                </Col>
              ))}
            </Row>
          </div>
        </CardFooter>
      </Card>
    </Col>;
};
export default OccupancyOverview;
