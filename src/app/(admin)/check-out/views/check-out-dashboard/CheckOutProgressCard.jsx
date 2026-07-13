import { Button, Card, CardBody } from 'react-bootstrap';

const CheckOutProgressCard = ({ steps = [], summary }) => (
  <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 8, overflow: 'hidden' }}>
    <CardBody style={{ padding: 0 }}>
      <div className="d-flex align-items-center justify-content-between" style={{ padding: '14px 28px', borderBottom: '1px solid #e6e8ec' }}>
        <h5 className="mb-0" style={{ color: '#526b89', fontSize: 18, fontWeight: 700 }}>
          Check-Out Progress
        </h5>
        <Button variant="light" style={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 5, color: '#526b89', minWidth: 124, padding: '10px 18px' }}>
          This Month
        </Button>
      </div>

      <div style={{ padding: '54px 28px 56px' }}>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, alignItems: 'start' }}>
          <div style={{ position: 'absolute', left: '7%', right: '7%', top: 30, height: 2, background: '#d9d9d9' }} />

          {steps.map((step) => (
            <div key={step.label} className="text-center" style={{ position: 'relative', zIndex: 1 }}>
              <div className="d-inline-flex align-items-center justify-content-center" style={{ width: 60, height: 60, borderRadius: '50%', background: step.bg }}>
                <span className="d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', fontSize: 20 }}>
                  {step.icon}
                </span>
              </div>
              <p className="mb-2 mt-3" style={{ color: '#526b89', fontSize: 15, fontWeight: 500 }}>
                {step.label}
              </p>
              <h5 className="mb-0" style={{ color: step.color, fontSize: 18, fontWeight: 700 }}>
                {step.value}
              </h5>
            </div>
          ))}
        </div>

        <div className="d-flex align-items-center gap-4" style={{ marginTop: 64 }}>
          <span style={{ color: '#526b89', fontSize: 16, fontWeight: 700, minWidth: 130 }}>
            Overall Progress
          </span>
          <div style={{ flex: 1, height: 10, borderRadius: 10, background: '#d6d6d6', overflow: 'hidden' }}>
            <div style={{ width: `${summary?.percent || 0}%`, height: '100%', background: '#6e96d5', borderRadius: 10 }} />
          </div>
          <span style={{ color: '#526b89', fontSize: 16, fontWeight: 700, minWidth: 130, textAlign: 'right' }}>
            {summary?.label}
          </span>
        </div>
      </div>
    </CardBody>
  </Card>
);

export default CheckOutProgressCard;
