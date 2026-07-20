import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Col } from 'react-bootstrap';
import { statData } from '../data';

const statTheme = {
  primary: {
    bg: '#f0ebff',
    color: '#604ae3'
  },
  success: {
    bg: '#eaf8f0',
    color: '#50c878'
  },
  warning: {
    bg: '#fff3ec',
    color: '#ff8b3d'
  },
  info: {
    bg: '#eafafa',
    color: '#38c6cf'
  }
};

const StatCard = ({
  amount,
  icon,
  title,
  change,
  variant
}) => {
  const theme = statTheme[variant] ?? statTheme.primary;

  return <Card className="border-0 shadow-sm" style={{
    minHeight: 100,
    borderRadius: 5
  }}>
      <CardBody style={{
        padding: '22px 20px'
      }}>
        <div className="d-flex align-items-center justify-content-between h-100">
          <div>
            <p className="mb-2 d-flex align-items-center gap-2" style={{
              color: '#536b86',
              fontSize: 15,
              fontWeight: 500
            }}>
              <span>{title}</span>
              {change && <span className="badge text-success bg-success-subtle fs-11 icons-center px-2 py-1">
                  <IconifyIcon width={11} height={11} icon="ri:arrow-up-line" />
                  {change}%
                </span>}
            </p>
            <h3 className="mb-0" style={{
              color: '#2f3848',
              fontSize: 27,
              fontWeight: 700,
              lineHeight: 1
            }}>{amount}</h3>
          </div>
          <div className="flex-shrink-0">
            <div className="flex-centered" style={{
              width: 56,
              height: 56,
              borderRadius: 6,
              backgroundColor: theme.bg
            }}>
              <IconifyIcon icon={icon} width={32} height={32} style={{
                color: theme.color
              }} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>;
};
const PropertyStats = () => {
  return <>
      {statData.map((item, idx) => <Col md={6} xl={3} key={idx}>
          <StatCard {...item} />
        </Col>)}
    </>;
};
export default PropertyStats;
