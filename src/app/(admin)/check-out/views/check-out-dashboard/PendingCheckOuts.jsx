import { Card, CardBody } from 'react-bootstrap';

const PendingCheckOuts = ({ rows = [] }) => (
  <Card className="border-0 shadow-sm h-100 w-100 d-flex flex-column" style={{ borderRadius: 8, boxShadow: '0 10px 30px rgba(16, 24, 40, 0.07)', overflow: 'hidden' }}>
    <CardBody style={{ padding: 0, flex: '0 0 auto' }}>
      <h5 className="mb-0" style={{ color: '#526b89', fontWeight: 700, fontSize: 18, padding: '28px 24px 22px', borderBottom: '1px solid #e6e8ec' }}>
        Pending Check-Outs
      </h5>
    </CardBody>

    <div style={{ overflowX: 'auto', overflowY: 'hidden', padding: '20px 16px 0', flex: 1 }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 720, border: '1px solid #e4e6eb', borderRadius: 8, overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={thStyle}>Check-Out ID</th>
            <th style={thStyle}>Tenant Name</th>
            <th style={thStyle}>Property</th>
            <th style={thStyle}>Check-Out Date</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Days Left</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.tenant}-${index}`} style={{ background: '#fff' }}>
              <td style={tdStyle}>{row.id}</td>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{row.tenant}</td>
              <td style={tdStyle}>{row.property}</td>
              <td style={tdStyle}>{row.date}</td>
              <td style={tdStyle}>{row.status}</td>
              <td style={tdStyle}>{row.daysLeft}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div style={{ textAlign: 'center', padding: '22px 14px 20px', borderTop: '1px solid #edf0f3', marginTop: 'auto', minHeight: 63 }}>
      <a href="#" style={{ fontSize: 16, fontWeight: 700, color: '#4b4a78', textDecoration: 'none' }}>
        View All Pendings
      </a>
    </div>
  </Card>
);

const thStyle = {
  fontSize: 16,
  fontWeight: 700,
  color: '#526b89',
  padding: '16px 20px',
  borderBottom: '1px solid #eef0f6',
  whiteSpace: 'nowrap',
  background: '#fbfbfc',
};

const tdStyle = {
  fontSize: 16,
  color: '#526b89',
  padding: '15px 20px',
  borderBottom: 'none',
  fontWeight: 400,
  verticalAlign: 'middle',
};

export default PendingCheckOuts;
