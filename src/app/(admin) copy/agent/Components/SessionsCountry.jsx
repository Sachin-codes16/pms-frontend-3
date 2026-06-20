import IconifyIcon from '@/components/wrappers/IconifyIcon';
import WorldVectorMap from '@/components/VectorMap/WorldMap';
import {
  Card, CardBody, CardHeader, CardTitle,
  Col, ProgressBar, Row,
} from 'react-bootstrap';
import { Fragment, useEffect, useState } from 'react';
import { fetchCountryPropertyStats, fetchTotalPropertyCount } from '../data';

const SessionsCountry = () => {
  const [totalCount, setTotalCount] = useState('—');
  const [countryStats, setCountryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [total, stats] = await Promise.all([
          fetchTotalPropertyCount(),
          fetchCountryPropertyStats(),
        ]);
        setTotalCount(total);
        setCountryStats(stats);
      } catch (err) {
        console.error('SessionsCountry load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const mapMarkers = countryStats
    .filter((item) => item.coords)
    .map((item) => ({
      name: `${item.country} (${item.count})`,
      coords: item.coords,
    }));

  const worldMapOptions = {
    map: 'world',
    zoomOnScroll: false,
    zoomButtons: false,
    markersSelectable: false,
    markers: mapMarkers,
    markerStyle: {
      initial: { fill: '#604ae3', stroke: '#fff', 'stroke-width': 2, r: 6 },
      hover:   { fill: '#f8ac59', cursor: 'pointer' },
    },
    labels: {
      markers: {
        render: (marker) => marker.name,
      },
    },
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1,
      },
    },
  };

  return (
    <Col lg={7}>
      <Card>
        {/* Header — dropdown removed */}
        <CardHeader className="d-flex justify-content-between align-items-center border-0">
          <CardTitle as={'h4'}>Property</CardTitle>
        </CardHeader>

        <CardBody>
          <Row className="align-items-start">
            {/* ── Left: Total count + Map ── */}
            <Col lg={6}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="avatar-md bg-light bg-opacity-50 rounded flex-centered">
                  <IconifyIcon
                    icon="solar:buildings-broken"
                    width={32}
                    height={32}
                    className="fs-32 text-primary"
                  />
                </div>
                <div>
                  <p className="mb-0 fs-20 text-dark fw-medium">
                    {loading ? <span className="placeholder col-4" /> : totalCount}
                  </p>
                  <small className="text-muted">(Total Properties)</small>
                </div>
              </div>

              {/* Map — markers appear once countryStats is loaded */}
              <div style={{ height: '280px' }}>
                <WorldVectorMap
                  height="280px"
                  width="100%"
                  options={worldMapOptions}
                />
              </div>
            </Col>

            {/* ── Right: Top-4 country stats ── */}
            <Col lg={6}>
              <div className="p-3 bg-light bg-opacity-10 rounded">
                {loading ? (
                  // Skeleton
                  Array.from({ length: 4 }).map((_, idx) => (
                    <Fragment key={idx}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <p className="mb-0 placeholder-glow w-50">
                          <span className="placeholder col-8" />
                        </p>
                        <p className="mb-0 placeholder-glow">
                          <span className="placeholder col-4" />
                        </p>
                      </div>
                      <Row className="align-items-center mb-3">
                        <Col>
                          <div className="progress" style={{ height: '6px' }}>
                            <div className="progress-bar placeholder col-6" />
                          </div>
                        </Col>
                        <Col xs="auto">
                          <span className="placeholder col-12" style={{ width: '32px', display: 'inline-block' }} />
                        </Col>
                      </Row>
                    </Fragment>
                  ))
                ) : countryStats.length === 0 ? (
                  <p className="text-muted text-center py-4 mb-0">No property data found.</p>
                ) : (
                  countryStats.map((item, idx) => (
                    <Fragment key={idx}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <p className="mb-0">
                          <IconifyIcon
                            icon={item.icon}
                            className="fs-16 align-middle me-2"
                          />
                          <span className="align-middle fw-medium">{item.country}</span>
                        </p>
                        <p className="mb-0 fw-semibold">{item.count}</p>
                      </div>
                      <Row className="align-items-center mb-3">
                        <Col>
                          <ProgressBar
                            now={item.progress}
                            variant={item.variant}
                            className="progress-soft"
                            style={{ height: '6px' }}
                          />
                        </Col>
                        <Col xs="auto">
                          <p className="mb-0 fs-12 text-muted">{item.progress}%</p>
                        </Col>
                      </Row>
                    </Fragment>
                  ))
                )}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SessionsCountry;