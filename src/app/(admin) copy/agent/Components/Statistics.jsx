import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {
  statData,
  fetchTotalPropertyCount,
  fetchPropertyCountByType,
  fetchLandlordCount,
} from '../data';

const StatCard = ({ amount, icon, title, change, variant, loading }) => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="mb-2 fs-15 fw-medium">
              {title}&nbsp;
              {change && (
                <span className="badge text-success bg-success-subtle fs-11 icons-center">
                  <IconifyIcon width={11} height={11} icon="ri:arrow-up-line" />
                  {change}%
                </span>
              )}
            </p>
            <h3 className="text-dark fw-bold d-flex align-items-center gap-2 mb-0">
              {loading ? (
                <span
                  className="placeholder rounded"
                  style={{ width: '3rem', height: '1.5rem', display: 'inline-block' }}
                />
              ) : (
                amount
              )}
            </h3>
          </div>
          <div>
            <div className={`avatar-md bg-${variant} bg-opacity-10 rounded flex-centered`}>
              <IconifyIcon icon={icon} width={32} height={32} className={`text-${variant}`} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const Statistics = () => {
  const [counts, setCounts] = useState({
    landlords: 0,
    total: 0,
    commercial: 0,
    warehouse: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [landlords, total, commercial, warehouse] = await Promise.all([
          fetchLandlordCount(),
          fetchTotalPropertyCount(),
          fetchPropertyCountByType('commercial'),
          fetchPropertyCountByType('warehouse'),
        ]);
        setCounts({ landlords, total, commercial, warehouse });
      } catch (err) {
        console.error('Statistics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const enriched = statData.map((item) => ({
    ...item,
    amount: counts[item.fetchKey] ?? item.amount,
  }));

  return (
    <>
      {enriched.map((item, idx) => (
        <Col md={6} xl={3} key={idx}>
          <StatCard {...item} loading={loading} />
        </Col>
      ))}
    </>
  );
};

export default Statistics;