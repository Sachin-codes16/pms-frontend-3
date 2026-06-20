import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const pageText = '#526b89';

const rows = [
  ['1', 'CH12345', 'Aylin Huynh', 'Silver Oak Residency', 'A-101', '21 May 2015', '1500 OMR', 'Completed', 'Returned', 'Refunded', 'Completed', 'Tenant'],
  ['2', 'CH12345', 'Louise Morton', 'Green Valley Heights', 'B-204', '21 May 2018', '2500 OMR', 'Completed', 'Returned', 'Refunded', 'In Progress', 'Tenant'],
  ['3', 'CH12345', 'Analia Huffman', 'Sunrise Meadows', 'C-307', '21 May 2011', '3500 OMR', 'In Progress', 'Pending', 'Pending', 'In Progress', 'Admin'],
  ['4', 'CH12345', 'Novah Gibson', 'Blue Horizon Towers', 'D-402', '21 May 2011', '3500 OMR', 'Completed', 'Pending', 'Pending', 'Active', 'Admin'],
  ['5', 'CH12345', 'Kavya Joshi', 'Maple Leaf Villas', 'E-509', '21 May 2018', '2700 OMR', 'Pending', 'Pending', 'Pending', 'In Progress', 'Tenant'],
  ['6', 'CH12345', 'Rahul Mehta', 'Golden Crest Villa', 'F-603', '21 May 2018', '5800 OMR', 'Completed', 'Returned', 'Refunded', 'Completed', 'Admin'],
  ['7', 'CH12345', 'Sneha Nair', 'Riverstone Enclave', 'G-708', '21 May 2018', '4600 OMR', 'Completed', 'Returned', 'Refunded', 'Completed', 'Tenant'],
  ['8', 'CH12345', 'Arjun Reddy', 'Palm Grove Estate', 'H-812', '21 May 2018', '2500 OMR', 'Pending', 'Pending', 'Pending', 'In Progress', 'Tenant'],
];

const panelStyle = {
  background: '#fff',
  borderRadius: 6,
  boxShadow: '0 7px 24px rgba(15, 23, 42, 0.07)',
};

const tableHeaderStyle = {
  color: pageText,
  fontSize: 14,
  fontWeight: 500,
  padding: '16px 10px',
  whiteSpace: 'nowrap',
};

const tableCellStyle = {
  color: pageText,
  fontSize: 14,
  padding: '17px 10px',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
};

const badgePalette = {
  Completed: { background: '#d9f3e4', color: '#32bf72' },
  Returned: { background: '#d9f3e4', color: '#32bf72' },
  Refunded: { background: '#d9f3e4', color: '#32bf72' },
  Active: { background: '#d9f3e4', color: '#32bf72' },
  Pending: { background: '#fff0df', color: '#f2a24d' },
  'In Progress': { background: '#e2ebfb', color: '#5d83ff' },
  Tenant: { background: '#e2ebfb', color: '#5d83ff' },
  Admin: { background: '#fff0df', color: '#f2a24d' },
};

const Badge = ({ value }) => (
  <span
    style={{
      ...badgePalette[value],
      borderRadius: 4,
      display: 'inline-block',
      fontSize: 13,
      fontWeight: 500,
      minWidth: 78,
      padding: '4px 10px',
      textAlign: 'center',
    }}
  >
    {value}
  </span>
);

const ActionButton = ({ icon, bg = '#f4f7fa' }) => (
  <Button
    as={Link}
    to="/check-out-details"
    onClick={(event) => event.stopPropagation()}
    variant="link"
    className="d-inline-flex align-items-center justify-content-center p-0"
    style={{ background: bg, borderRadius: 4, color: '#263044', height: 32, textDecoration: 'none', width: 40 }}
  >
    <IconifyIcon icon={icon} width={17} height={17} />
  </Button>
);

const List = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...panelStyle, overflow: 'hidden' }}>
      <h5
        className="mb-0"
        style={{
          borderBottom: '1px solid #e7ebf1',
          color: pageText,
          fontSize: 18,
          fontWeight: 700,
          padding: '13px 20px',
        }}
      >
        Check-Out List (123)
      </h5>

      <div style={{ overflowX: 'auto', padding: '0 16px 0' }}>
        <table style={{ borderCollapse: 'collapse', minWidth: 1550, width: '100%' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e7ebf1' }}>
              {[
                'Sr. No.',
                'Tenant ID',
                'Tenant Name',
                'Property',
                'Unit No.',
                'Check-Out Date',
                <>
                  Security
                  <br />
                  Deposit
                </>,
                <>
                  Inspection
                  <br />
                  Status
                </>,
                <>
                  Key Return
                  <br />
                  Status
                </>,
                'Refund Status',
                'Status',
                'Request From',
                'Action',
              ].map((head, index) => (
                <th key={index} style={tableHeaderStyle}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row[0]}-${row[2]}`}
                onClick={() => navigate('/check-out-details')}
                style={{ borderBottom: '1px solid #eef1f5', cursor: 'pointer' }}
              >
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>{row[0]}</td>
                <td style={tableCellStyle}>{row[1]}</td>
                <td style={{ ...tableCellStyle, color: '#273247', fontWeight: 500 }}>{row[2]}</td>
                <td style={tableCellStyle}>{row[3]}</td>
                <td style={tableCellStyle}>{row[4]}</td>
                <td style={tableCellStyle}>{row[5]}</td>
                <td style={tableCellStyle}>{row[6]}</td>
                <td style={tableCellStyle}>
                  <Badge value={row[7]} />
                </td>
                <td style={tableCellStyle}>
                  <Badge value={row[8]} />
                </td>
                <td style={tableCellStyle}>
                  <Badge value={row[9]} />
                </td>
                <td style={tableCellStyle}>
                  <Badge value={row[10]} />
                </td>
                <td style={tableCellStyle}>
                  <Badge value={row[11]} />
                </td>
                <td style={tableCellStyle}>
                  <div className="d-flex gap-2">
                    <ActionButton icon="solar:eye-broken" />
                    <ActionButton icon="solar:pen-2-broken" bg="#f5f0ff" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end" style={{ padding: '20px 20px 15px' }}>
        <div className="d-flex" style={{ border: '1px solid #e4e9f0', borderRadius: 5, overflow: 'hidden' }}>
          {['Previous', '1', '2', '3', 'Next'].map((item) => (
            <button
              key={item}
              type="button"
              style={{
                background: item === '1' ? '#283140' : '#fff',
                border: 0,
                borderRight: item === 'Next' ? 0 : '1px solid #e4e9f0',
                color: item === '1' ? '#fff' : '#3d4655',
                height: 35,
                minWidth: item.length > 1 ? 78 : 32,
                padding: '0 12px',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
