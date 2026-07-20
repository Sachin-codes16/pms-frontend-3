import IconifyIcon from '@/components/wrappers/IconifyIcon';
import {
  Card, CardBody, CardHeader, CardTitle, Col,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
  ProgressBar, Row,
} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {
  revenueData,
  fetchTotalPropertyCount,
  fetchPropertyCountByType,
} from '../data';

const TotalRevenue = () => {
  const [counts, setCounts] = useState({
    total: 0,
    flat: 0,
    villa: 0,
    warehouse: 0,
    rowhouse: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [total, flat, villa, warehouse, rowhouse] = await Promise.all([
          fetchTotalPropertyCount(),
          fetchPropertyCountByType('flat'),
          fetchPropertyCountByType('villa'),
          fetchPropertyCountByType('warehouse'),
          fetchPropertyCountByType('rowhouse'),
        ]);
        setCounts({ total, flat, villa, warehouse, rowhouse });
      } catch (err) {
        console.error('TotalRevenue fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const totalNum = counts.total > 0 ? counts.total : null;

  const enriched = revenueData.map((item) => {
    const count = counts[item.fetchKey] ?? 0;
    const progress = totalNum ? Math.round((count / totalNum) * 100) : item.progress;
    return { ...item, amount: count, progress };
  });

  return (
    <Col lg={12}>
      <Card style={{ height: '400px' }}>
        <CardHeader className="d-flex justify-content-between align-items-center border-0">
          <CardTitle as="h4">Total Properties Listed</CardTitle>
          <Dropdown>
            <DropdownToggle
              as="a"
              className="btn btn-sm btn-outline-light rounded content-none icons-center"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              This Month{' '}
              <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem>Today</DropdownItem>
              <DropdownItem>Month</DropdownItem>
              <DropdownItem>Years</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>

        <CardBody>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="d-flex align-items-center gap-2 text-dark fw-semibold">
                {loading ? (
                  <span
                    className="placeholder rounded"
                    style={{ width: '3rem', height: '1.75rem', display: 'inline-block' }}
                  />
                ) : (
                  counts.total
                )}
              </h3>
            </div>
            <div className="avatar-md bg-light bg-opacity-50 rounded flex-centered">
              <IconifyIcon icon="solar:bag-2-broken" width={32} height={32} className="text-primary" />
            </div>
          </div>

          <div className="p-3 rounded bg-light-subtle border border-light mt-4">
            <h5>Properties</h5>
            <Row className="my-3 g-lg-0 g-2">
              {enriched.map((item, idx) => (
                <Col lg={3} xs={4} key={idx}>
                  <p className="mb-1 text-muted">
                    <IconifyIcon icon="ri:circle-fill" className={`fs-6 text-${item.variant}`} />{' '}
                    {item.title}
                  </p>
                  <p className="fs-16 text-dark fw-medium mb-1">
                    {loading ? (
                      <span
                        className="placeholder rounded"
                        style={{ width: '2rem', height: '1rem', display: 'inline-block' }}
                      />
                    ) : (
                      item.amount
                    )}
                  </p>
                </Col>
              ))}
            </Row>

            <ProgressBar style={{ height: '10px' }}>
              {enriched.map((item, idx) => (
                <ProgressBar
                  variant={item.variant}
                  className="rounded-pill rounded-0 gap-3 overflow-visible"
                  now={item.progress}
                  key={idx}
                />
              ))}
            </ProgressBar>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default TotalRevenue;