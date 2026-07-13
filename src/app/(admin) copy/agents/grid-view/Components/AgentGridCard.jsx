import homeImg from '@/assets/images/home-2.png';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useRef, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import httpClient from '@/helpers/httpClient';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';

const TENANT_PURPOSES = ['tenant'];

/* ─────────────────────────────────────────────────────────────────────────────
   Hook: Fetch property assignment stats
───────────────────────────────────────────────────────────────────────────── */
const usePropertyAssignmentStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await httpClient.get(`${API_BASE_URL}/property/assignment/count/`);
        const data = response.data?.data || {};
        setStats({
          total:      data.total_properties      ?? 0,
          assigned:   data.assigned_properties   ?? 0,
          unassigned: data.unassigned_properties ?? 0,
          loading: false,
        });
      } catch (err) {
        console.error('Property assignment fetch error:', err);
        setStats((s) => ({ ...s, loading: false }));
      }
    };
    fetchStats();
  }, []);

  return stats;
};

const useTenantCityStats = () => {
  const [cityStats, setCityStats] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          Accept: 'application/json',
        };

        const countResults = await Promise.all(
          TENANT_PURPOSES.map((purpose) =>
            httpClient
              .get(`${API_BASE_URL}/lead/count/?filter_key=purpose&filter_value=${purpose}`, { headers })
              .then((res) => res.data?.data?.count ?? 0)
              .catch(() => 0)
          )
        );
        const totalTenants = countResults.reduce((sum, c) => sum + c, 0);

        const leadsResults = await Promise.all(
          TENANT_PURPOSES.map((purpose) =>
            httpClient
              .get(`${API_BASE_URL}/lead/get_all/?filter_key=purpose&filter_value=${purpose}`, { headers })
              .then((res) => res.data?.data?.data || res.data?.data || [])
              .catch(() => [])
          )
        );
        const allTenants = leadsResults.flat();

        // 3. Group by city
        const cityMap = {};
        allTenants.forEach((lead) => {
          const city = (lead?.city || 'Unknown').trim();
          cityMap[city] = (cityMap[city] || 0) + 1;
        });

        const sorted = Object.entries(cityMap)
          .map(([city, count]) => ({ city, count }))
          .sort((a, b) => b.count - a.count);

        setTotal(totalTenants);
        setCityStats(sorted);
      } catch (err) {
        console.error('Tenant city fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  return { cityStats, total, loading };
};

/* ─────────────────────────────────────────────────────────────────────────────
   Card 1: Properties Portfolio (Assigned vs Unassigned)
───────────────────────────────────────────────────────────────────────────── */
const PropertiesChart = () => {
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(undefined);
  const { total, assigned, unassigned, loading } = usePropertyAssignmentStats();

  useEffect(() => {
    if (!chartRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setChartWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  const isEmpty = !loading && total === 0;

  const chartOptions = {
    chart: { height: 123, type: 'donut' },
    series: isEmpty ? [1] : [assigned, unassigned],
    legend: { show: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: { show: false, total: { showAlways: true, show: true } },
        },
      },
    },
    labels: isEmpty ? ['No Data'] : ['Assigned', 'Unassigned'],
    colors: isEmpty ? ['#e0e0e0'] : ['#47ad94', '#f0934e'],
    dataLabels: { enabled: false },
    tooltip: { enabled: !isEmpty },
    responsive: [{ breakpoint: 480, options: { chart: { width: 200 } } }],
  };

  return (
    <Col xl={6} lg={10} md={12}>
      <Card style={{ height: '100%' }}>
        <CardBody>
          <Row className="align-items-center">
            <Col lg={8}>
              <h4 className="text-dark mb-1">Welcome Back</h4>
              <p className="fs-14">This is your properties portfolio report</p>
              <Row className="align-items-center text-center mb-2">
                <Col lg={7} className="border-end border-light">
                  <Row className="align-items-center g-0">
                    <Col lg={6}>
                      <div ref={chartRef} style={{ overflow: 'hidden', width: '100%' }}>
                        {!loading && (
                          <ReactApexChart
                            options={chartOptions}
                            series={chartOptions.series}
                            height={chartWidth ? Math.min(150, chartWidth) : 150}
                            width={chartWidth || '100%'}
                            type="donut"
                            className="apex-charts mb-4"
                          />
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <h5>Properties</h5>
                      <h2 className="fw-semibold text-dark">{loading ? '...' : total}</h2>
                    </Col>
                  </Row>
                </Col>
                <Col lg={5}>
                  <div className="ps-2">
                    <p className="d-flex align-items-center mb-2 gap-2">
                      <IconifyIcon icon="ri:circle-fill" className="text-success" />
                      {loading ? '...' : assigned} Assigned
                    </p>
                    <p className="d-flex align-items-center gap-2 mb-0">
                      <IconifyIcon icon="ri:circle-fill" className="text-warning" />
                      {loading ? '...' : unassigned} Unassigned
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col lg={4} className="text-end">
              <img src={homeImg} alt="home" className="img-fluid" />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Card 2: Tenants by City
───────────────────────────────────────────────────────────────────────────── */
const CITY_COLORS = ['warning', 'info', 'primary', 'success', 'danger', 'secondary'];

const AssignmentStatusCard = () => {
  const { cityStats, total, loading } = useTenantCityStats();

  return (
    <Col xl={3} lg={6}>
      <Card style={{ height: '100%' }}>
        <CardHeader className="d-flex align-items-center border-bottom border-dashed">
          <CardTitle as="h4" className="mb-0">
            Tenants by City
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <h5 className="text-dark fw-medium mb-1">{loading ? '...' : total}</h5>
              <p className="text-muted mb-0">Total Tenants</p>
            </div>
          </div>

          {loading ? (
            <p className="text-muted fs-13">Loading...</p>
          ) : cityStats.length === 0 ? (
            <p className="text-muted fs-13">No tenant data found.</p>
          ) : (
            cityStats.map(({ city, count }, idx) => {
              const color = CITY_COLORS[idx % CITY_COLORS.length];
              return (
                <div key={city} className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <IconifyIcon icon="ri:circle-fill" className={`text-${color} fs-10`} />
                    <span className="fs-13 text-muted">{city}</span>
                  </div>
                  <span className={`badge bg-${color}-subtle text-${color} fs-12`}>
                    {count}
                  </span>
                </div>
              );
            })
          )}

          {!loading && cityStats.length > 0 && (
            <div
              className="progress progress-lg bg-light-subtle rounded-0 gap-1 overflow-visible mt-3"
              style={{ height: 10 }}
            >
              {cityStats.map(({ city, count }, idx) => {
                const color = CITY_COLORS[idx % CITY_COLORS.length];
                return (
                  <div
                    key={city}
                    className={`progress-bar bg-${color} rounded-pill`}
                    role="progressbar"
                    style={{ width: total ? `${(count / total) * 100}%` : '0%' }}
                  />
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Card 3: Total Tenants
   useTenantCityStats already has the total — no extra API call needed
───────────────────────────────────────────────────────────────────────────── */
const SealProperties = () => {
  const { total: totalTenants, loading } = useTenantCityStats();

  const chartOptions = {
    chart: { type: 'line', height: 115, sparkline: { enabled: true } },
    series: [{ data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54] }],
    stroke: { width: 2, curve: 'smooth' },
    markers: { size: 0 },
    colors: ['#ffffff'],
    tooltip: { enabled: false },
  };

  return (
    <Col xl={3} lg={6}>
      <Card className="bg-primary bg-gradient" style={{ height: '100%' }}>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <CardTitle as="h4" className="mb-2 text-white">
                Total Tenants
              </CardTitle>
              <p className="text-white fw-medium fs-24 mb-0">
                {loading ? '...' : totalTenants}
              </p>
            </div>
            <div>
              <div className="avatar-md bg-light rounded flex-centered">
                <IconifyIcon
                  icon="solar:users-group-rounded-bold-duotone"
                  width={32}
                  height={32}
                  className="fs-32 text-primary"
                />
              </div>
            </div>
          </div>
          <ReactApexChart
            options={chartOptions}
            series={chartOptions.series}
            height={115}
            type="line"
            className="apex-charts"
          />
        </CardBody>
      </Card>
    </Col>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────────────────────── */
const AgentGridCard = () => (
  <Row>
    <PropertiesChart />
    <AssignmentStatusCard />
    <SealProperties />
  </Row>
);

export default AgentGridCard;