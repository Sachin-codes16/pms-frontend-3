// src/app/(admin)/dash/an/components/Statistics.jsx

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { chartOptions } from '../data';

/**
 * Builds dynamic ApexCharts bar options for a stat card.
 * Highlights the highest-value day in purple, rest in light grey.
 */
function buildBarOptions(dailyData = [0, 0, 0, 0, 0, 0, 0]) {
  const maxVal = Math.max(...dailyData, 1); // avoid 0 max
  const colors = dailyData.map((v) =>
    v === maxVal && maxVal > 0 ? '#604ae3' : '#eef2f7'
  );

  return {
    ...chartOptions,
    colors,
    series: [{ name: 'Count', data: dailyData }],
  };
}

const StatCard = ({ amount, icon, title, dailyData = [0, 0, 0, 0, 0, 0, 0] }) => {
  const dynamicOptions = buildBarOptions(dailyData);

  return (
    <Card style={{ height: '185px' }}>
      <CardBody>
        <Row className="align-items-center justify-content-between">
          <Col xs={6}>
            <div className="avatar-md bg-light bg-opacity-50 rounded flex-centered">
              <IconifyIcon width={32} height={32} icon={icon} className="text-primary" />
            </div>
            <p className="text-muted mb-2 mt-3">{title}</p>
            <h3 className="text-dark fw-bold mb-0">
              {amount}
              {/* Percentage badge — commented out as requested */}
              {/* <span className={`badge ...`}>...</span> */}
            </h3>
          </Col>
          <Col xs={6}>
            <ReactApexChart
              key={JSON.stringify(dailyData)} // force re-render when data changes
              options={dynamicOptions}
              series={dynamicOptions.series}
              height={95}
              type="bar"
              className="apex-charts"
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

/**
 * Statistics
 *
 * Props (from AnalyticsPage via useDashboardData):
 *   counts  — { properties, landlords, tenants, dailyProperties, dailyLandlords, dailyTenants }
 *   loading — boolean
 */
const Statistics = ({ counts = {}, loading = false }) => {
  const cards = [
    {
      icon     : 'solar:buildings-2-broken',
      title    : 'No. of Properties',
      amount   : loading ? '…' : String(counts.properties ?? 0),
      dailyData: counts.dailyProperties ?? [0, 0, 0, 0, 0, 0, 0],
    },
    {
      icon     : 'solar:users-group-two-rounded-broken',
      title    : 'Regi.Landlords',
      amount   : loading ? '…' : String(counts.landlords ?? 0),
      dailyData: counts.dailyLandlords ?? [0, 0, 0, 0, 0, 0, 0],
    },
    {
      icon     : 'solar:shield-user-broken',
      title    : 'Tenants',
      amount   : loading ? '…' : String(counts.tenants ?? 0),
      dailyData: counts.dailyTenants ?? [0, 0, 0, 0, 0, 0, 0],
    },
    {
      icon     : 'solar:money-bag-broken',
      title    : 'Conversion Rate',
      amount   : loading ? '…' : (counts.conversionRate ?? '0%'),
      dailyData: counts.dailyAssignments ?? [0, 0, 0, 0, 0, 0, 0],
    },
  ];

  return (
    <Row>
      {cards.map((card, idx) => (
        <Col md={6} xl={3} key={idx}>
          <StatCard {...card} />
        </Col>
      ))}
    </Row>
  );
};

export default Statistics;