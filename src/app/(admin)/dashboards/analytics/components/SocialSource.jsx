import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { statusOverviewOptions } from '../data';
import SalesLocation from './SalesLocation';
import PendingSettlements from './PendingSettlements';

const StatusOverviewCard = ({ data = [] }) => {
  const options = { ...statusOverviewOptions, labels: data.map((item) => item.label), colors: data.map((item) => item.color) };
  const series = data.map((item) => item.value);

  return <Col xl={4} lg={6}>
      <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '8px', minHeight: '372px', overflow: 'hidden' }}>
        <CardHeader className="border-0" style={{ backgroundColor: '#fbfcfe', padding: '22px 28px 18px' }}>
          <CardTitle as={'h4'} className="mb-0 fw-semibold" style={{ color: '#516986', fontSize: '17px' }}>
            Status Overview
          </CardTitle>
        </CardHeader>
        <CardBody className="d-flex flex-column justify-content-center" style={{ padding: '12px 16px 0' }}>
          <Row className="align-items-center g-0">
            <Col xs={12} md={4}>
              <div
                className="d-flex justify-content-center justify-content-md-start"
                style={{ width: 190, height: 190, flexShrink: 0 }}
              >
                <ReactApexChart options={options} series={series} width={190} height={190} type="donut" className="apex-charts" />
              </div>
            </Col>
            <Col xs={12} md={8} className="ps-md-5">
              <div className="d-flex flex-column" style={{ gap: '20px', paddingLeft: '18px', paddingRight: '10px' }}>
                {data.map((item, idx) => (
                  <div
                    key={idx}
                    className="align-items-center"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) auto',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      columnGap: '6px',
                    }}
                  >
                    <div className="d-flex align-items-center" style={{ gap: '8px', minWidth: 0 }}>
                      <span className="flex-shrink-0" style={{ width: '10px', height: '10px', backgroundColor: item.color, borderRadius: '50%' }}></span>
                      <span
                        className="fw-medium"
                        style={{
                          color: '#7b8ca3',
                          fontSize: '16px',
                          minWidth: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span className="fw-medium text-nowrap" style={{ color: '#3f3f3f', fontSize: '16px', textAlign: 'right' }}>{item.display}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>;
};
const SocialSource = ({ statusOverview = [], monthlyOverview = { categories: [], series: [] }, pendingSettlements = [] }) => {
  return <Row className="g-3 mt-1">
      <StatusOverviewCard data={statusOverview} />
      <SalesLocation categories={monthlyOverview.categories} series={monthlyOverview.series} />
      <PendingSettlements items={pendingSettlements} />
    </Row>;
};
export default SocialSource;
