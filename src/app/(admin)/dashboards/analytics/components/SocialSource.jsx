import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { statusOverviewOptions } from '../data';
import SalesLocation from './SalesLocation';
import PendingSettlements from './PendingSettlements';

const StatusOverviewCard = () => {
  return <Col xl={4} lg={6}>
      <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '8px', minHeight: '420px' }}>
        <CardHeader className="border-0" style={{ backgroundColor: '#fbfcfe', padding: '22px 28px 18px' }}>
          <CardTitle as={'h4'} className="mb-0 fw-semibold" style={{ color: '#516986', fontSize: '17px' }}>
            Status Overview
          </CardTitle>
        </CardHeader>
        <CardBody className="d-flex flex-column align-items-center justify-content-center text-center" style={{ padding: '0 16px 18px' }}>
          <div className="d-flex justify-content-center" style={{ marginTop: '0' }}>
            <ReactApexChart options={statusOverviewOptions} series={statusOverviewOptions.series} width={240} height={240} type="donut" className="apex-charts" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              columnGap: '28px',
              rowGap: '22px',
              marginTop: '20px',
            }}
          >
            {[
              { label: 'Checked-In', color: '#58bf7d', value: '82.00%' },
              { label: 'Checked-Out', color: '#604ae3', value: '42.00%' },
              { label: 'Pending Check-In', color: '#ff9142', value: '12.00%' },
              { label: 'Pending Check-Out', color: '#e6ed3f', value: '06.00%' }
            ].map((item, idx) => (
              <div key={idx} className="d-flex align-items-center" style={{ gap: '10px', minWidth: 0 }}>
                <span className="flex-shrink-0" style={{ width: '15px', height: '15px', backgroundColor: item.color, borderRadius: '50%' }}></span>
                <span className="fw-medium text-start" style={{ color: '#7b8ca3', fontSize: '15px', whiteSpace: 'nowrap' }}>
                  {item.label} <span style={{ color: '#3f3f3f', fontSize: '17px' }}>{item.value}</span>
                </span>
              </div>
            ))}
          </div>
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
