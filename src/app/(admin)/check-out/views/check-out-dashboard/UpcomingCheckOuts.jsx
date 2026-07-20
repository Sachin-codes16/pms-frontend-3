import { Card, CardBody } from 'react-bootstrap';

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

const Avatar = ({ src, name }) =>
  src ? (
    <img src={src} alt={name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
  ) : (
    <span
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: '#e2ebfb',
        color: '#5d83ff',
        fontSize: 12,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
      {initials(name)}
    </span>
  );

const UpcomingCheckOuts = ({ data = [] }) => (
  <Card className="border-0 shadow-sm h-100 w-100 d-flex flex-column" style={{ borderRadius: 8, boxShadow: '0 10px 30px rgba(16, 24, 40, 0.07)', overflow: 'hidden' }}>
    <CardBody style={{ padding: 0, flex: 1 }}>
      <h5 className="mb-0" style={{ color: '#526b89', fontWeight: 700, fontSize: 18, padding: '28px 22px 22px', borderBottom: '1px solid #e6e8ec' }}>
        Upcoming Check-Outs
      </h5>

      <div>
        {data.length === 0 && (
          <div style={{ padding: '40px 22px', textAlign: 'center', fontSize: 15, color: '#8a96a8' }}>
            No upcoming check-outs.
          </div>
        )}
        {data.map((item, index) => (
          <div key={`${item.property}-${item.day}`} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 23px', minHeight: 118, borderBottom: index < data.length - 1 ? '1px solid #edf0f3' : 'none' }}>
            <div style={{ width: 90, height: 90, border: '2px solid #e0e0e0', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#526b89', lineHeight: 1.2 }}>{item.day}</span>
              <span style={{ fontSize: 16, color: '#526b89', fontWeight: 400, marginTop: 12 }}>{item.month}</span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#526b89' }}>{item.property}</p>
              <p style={{ margin: '6px 0 3px', fontSize: 15, fontWeight: 400, color: '#526b89' }}>Tenant : {item.tenant}</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: '#2f2f2f' }}>Days Left : {item.daysLeft}</p>
            </div>

            <div style={{ width: 1, height: 88, background: '#d9dde3', flexShrink: 0 }} />

            <div style={{ width: 160, flexShrink: 0 }}>
              <p style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 400, color: '#526b89' }}>Assigned To:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar src={item.avatar} name={item.assignedTo} />
                <span style={{ fontSize: 16, fontWeight: 500, color: '#526b89' }}>{item.assignedTo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardBody>

    <div style={{ textAlign: 'center', padding: '22px 14px 20px', borderTop: '1px solid #edf0f3', marginTop: 'auto', minHeight: 63 }}>
      <a href="#" style={{ fontSize: 16, fontWeight: 700, color: '#4b4a78', textDecoration: 'none' }}>
        View All Check-Outs
      </a>
    </div>
  </Card>
);

export default UpcomingCheckOuts;
