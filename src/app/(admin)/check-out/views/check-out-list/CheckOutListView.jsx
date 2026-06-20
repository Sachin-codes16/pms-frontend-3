import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import List from './List';

const pageText = '#526b89';
const darkButton = '#292f57';
const borderColor = '#b8c5d7';

const filterOptions = {
  propertyType: ['All', 'Apartment', 'Villa', 'Flat', 'Commercial'],
  building: ['All', 'Pearl Residency', 'AZ Apartment', 'Royal Villa', 'Star Studio'],
  checkOutStatus: ['All', 'Pending', 'In Progress', 'Completed'],
  inspectionStatus: ['All', 'Pending', 'In Progress', 'Completed'],
  refundStatus: ['All', 'Pending', 'Refunded', 'Rejected'],
  keyReturnStatus: ['All', 'Pending', 'Returned', 'Missing'],
};

const shellStyle = {
  background: '#f6f7fb',
  margin: '0 -48px',
  minHeight: 'calc(100vh - 80px)',
  paddingTop: 10,
};

const topBarStyle = {
  background: '#fff',
  borderBottom: '1px solid #eef1f5',
  padding: '28px 56px 12px',
};

const panelStyle = {
  background: '#fff',
  borderRadius: 6,
  boxShadow: '0 7px 24px rgba(15, 23, 42, 0.07)',
};

const inputStyle = {
  border: '1px solid #d9e0ea',
  borderRadius: 5,
  color: pageText,
  height: 39,
  outline: 'none',
  width: '100%',
};

const selectStyle = {
  ...inputStyle,
  borderColor,
  height: 45,
  padding: '0 14px',
};

const outlineButtonStyle = {
  border: '1px solid #233f78',
  borderRadius: 5,
  color: '#1c376d',
  height: 40,
  minWidth: 94,
};

const primaryButtonStyle = {
  background: darkButton,
  borderColor: darkButton,
  borderRadius: 5,
  height: 40,
  minWidth: 116,
};

const SelectField = ({ label, options }) => (
  <Col xs={12} sm={6} lg={4} xl={2}>
    <label className="d-block mb-2" style={{ color: '#71849c', fontSize: 16, fontWeight: 500 }}>
      {label}
    </label>
    <select style={selectStyle} defaultValue="All">
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </Col>
);

const DateFilterButton = ({ label }) => (
  <Button variant="outline-primary" className="d-inline-flex align-items-center justify-content-center gap-2 px-3" style={outlineButtonStyle}>
    <IconifyIcon icon="ri:arrow-down-s-line" width={16} height={16} />
    <span>{label}</span>
  </Button>
);

const CheckOutListView = () => {
  return (
    <div style={shellStyle}>
      <div className="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-3" style={topBarStyle}>
        <div>
          <h4 className="mb-2" style={{ color: pageText, fontSize: 18, fontWeight: 700 }}>
            Check-Out List
          </h4>
          <div style={{ color: pageText, fontSize: 15 }}>Dashboard &gt; Check-Out &gt;Check-Out List</div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Button
            as={Link}
            to="/check-out-dashboard"
            variant="outline-primary"
            className="d-inline-flex align-items-center justify-content-center gap-2 px-4"
            style={{ ...outlineButtonStyle, borderColor: '#b8b6ff', color: darkButton }}
          >
            <IconifyIcon icon="ri:arrow-left-s-line" width={18} height={18} />
            <span>Back</span>
          </Button>
          <Button as={Link} to="/check-out-start" style={{ ...primaryButtonStyle, minWidth: 150 }}>
            Create Check-Out
          </Button>
        </div>
      </div>

      <div style={{ padding: '30px 56px' }}>
        <div className="d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-3 mb-4" style={{ ...panelStyle, padding: '15px 20px' }}>
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-4">
            <div style={{ maxWidth: 360, minWidth: 300, position: 'relative' }}>
              <IconifyIcon icon="ri:search-line" style={{ color: '#6f78a6', fontSize: 18, left: 13, position: 'absolute', top: 10 }} />
              <input placeholder="Check-Out List" style={{ ...inputStyle, padding: '0 14px 0 40px' }} type="search" />
            </div>
            <span style={{ color: pageText, fontSize: 15, whiteSpace: 'nowrap' }}>311 Check-Out</span>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <DateFilterButton label="From Date" />
            <DateFilterButton label="To Date" />
            <Button style={primaryButtonStyle}>Export Excel</Button>
          </div>
        </div>

        <div className="mb-4" style={{ ...panelStyle, padding: '20px 20px' }}>
          <Row className="g-4">
            <SelectField label="Property Type" options={filterOptions.propertyType} />
            <SelectField label="Building" options={filterOptions.building} />
            <SelectField label="Check-Out Status" options={filterOptions.checkOutStatus} />
            <SelectField label="Inspection Status" options={filterOptions.inspectionStatus} />
            <SelectField label="Refund Status" options={filterOptions.refundStatus} />
            <SelectField label="Key Return Status" options={filterOptions.keyReturnStatus} />
          </Row>
        </div>

        <List />
      </div>
    </div>
  );
};

export default CheckOutListView;
