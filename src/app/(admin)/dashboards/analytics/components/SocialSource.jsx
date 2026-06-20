import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { statusOverviewOptions } from '../data';
import SalesLocation from './SalesLocation';
import PendingSettlements from './PendingSettlements';

const StatusOverviewCard = () => {
  return <Col xl={4} lg={6}>
      <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '8px', minHeight: '372px' }}>
        <CardHeader className="border-0" style={{ backgroundColor: '#fbfcfe', padding: '22px 28px 18px' }}>
          <CardTitle as={'h4'} className="mb-0 fw-semibold" style={{ color: '#516986', fontSize: '17px' }}>
            Status Overview
          </CardTitle>
        </CardHeader>
        <CardBody className="d-flex flex-column justify-content-center" style={{ padding: '12px 16px 0' }}>
          <Row className="align-items-center g-0">
            <Col xs={12} md={5}>
              <div className="d-flex justify-content-center justify-content-md-start">
                <ReactApexChart options={statusOverviewOptions} series={statusOverviewOptions.series} width={210} height={210} type="donut" className="apex-charts" />
              </div>
            </Col>
            <Col xs={12} md={7} className="ps-md-4">
              <div className="d-flex flex-column" style={{ gap: '20px', paddingLeft: '4px', paddingRight: '4px' }}>
                {[
                  { label: 'Checked-In', color: '#58bf7d', value: '82.00%' },
                  { label: 'Checked-Out', color: '#604ae3', value: '42.00%' },
                  { label: 'Pending Check-In', color: '#ff9142', value: '12.00%' },
                  { label: 'Pending Check-Out', color: '#e6ed3f', value: '06.00%' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="align-items-center"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '184px 64px',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div className="d-flex align-items-center" style={{ gap: '11px' }}>
                      <span className="flex-shrink-0" style={{ width: '15px', height: '15px', backgroundColor: item.color, borderRadius: '50%' }}></span>
                      <span className="fw-medium text-nowrap" style={{ color: '#7b8ca3', fontSize: '16px' }}>{item.label}</span>
                    </div>
                    <span className="fw-medium text-nowrap" style={{ color: '#3f3f3f', fontSize: '16px', textAlign: 'right' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>;
};
const SocialSource = () => {
  return <Row className="g-3 mt-1">
      <StatusOverviewCard />
      <SalesLocation />
      <PendingSettlements />
    </Row>;
};
export default SocialSource;
