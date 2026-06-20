import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CheckOutDashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div>
        <h4 className="mb-2 fw-semibold" style={{ color: '#536b86', fontSize: 18 }}>
          Check-Out Dashboard
        </h4>
        <p className="mb-0" style={{ color: '#536b86', fontSize: 15 }}>
          Dashboard &gt; Check-Out &gt; Dashboard
        </p>
      </div>

      <div className="d-flex align-items-center gap-2">
        <Button
          type="button"
          variant="outline-primary"
          onClick={() => navigate(-1)}
          style={{ borderColor: '#b9abff', borderRadius: 4, color: '#604ae3', minWidth: 100, padding: '10px 18px' }}
        >
          <IconifyIcon icon="ri:arrow-left-s-line" className="me-1" />
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          style={{ backgroundColor: '#604ae3', borderColor: '#604ae3', borderRadius: 4, minWidth: 100, padding: '10px 18px' }}
        >
          Create Check out
        </Button>
      </div>
    </div>
  );
};

export default CheckOutDashboardHeader;
