import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { forwardRef, useRef, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import List from './List';

const pageText = '#526b89';
const darkButton = '#292f57';
const borderColor = '#b8c5d7';

const filterOptions = {
  propertyType: ['All', 'Villa', 'Warehouse', 'Flat', 'Commercial'],
  building: ['All', 'Pearl Residency', 'AZ Apartment', 'Royal Villa', 'Star Studio'],
  status: ['All', 'Pending', 'In Progress', 'Completed'],
  assignedEmployee: ['All', 'John D.', 'Shounak S.', 'Kartik D.', 'Pranit P.'],
  assignmentStatus: ['All', 'Assigned', 'Unassigned', 'Reassigned'],
  keyStatus: ['All', 'Available', 'Booked', 'Handed Over'],
};

const shellStyle = {
  background: '#f6f7fb',
  margin: '0 -24px',
  minHeight: 'calc(100vh - 80px)',
  paddingTop: 10,
};

const topBarStyle = {
  background: '#fff',
  borderBottom: '1px solid #eef1f5',
  padding: '28px 24px 12px',
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
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  borderColor,
  height: 45,
  padding: '0 40px 0 16px',
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

const SelectField = ({ label, options, value, onChange }) => (
  <Col xs={12} sm={6} lg={4} xl={2}>
    <label className="d-block mb-2" style={{ color: '#71849c', fontSize: 16, fontWeight: 500 }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <select style={selectStyle} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <IconifyIcon
        icon="ri:arrow-down-s-line"
        width={18}
        height={18}
        style={{
          color: pageText,
          pointerEvents: 'none',
          position: 'absolute',
          right: 14,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  </Col>
);

const DateFilterButton = forwardRef(({ label, value, onClick }, ref) => (
  <Button
    variant="outline-primary"
    className="d-inline-flex align-items-center justify-content-center gap-2 px-3"
    style={outlineButtonStyle}
    onClick={onClick}
    ref={ref}
  >
    <IconifyIcon icon="ri:calendar-line" width={16} height={16} />
    <span>{value || label}</span>
    <IconifyIcon icon="ri:arrow-down-s-line" width={16} height={16} />
  </Button>
));
DateFilterButton.displayName = 'DateFilterButton';

const CheckInListView = () => {
  const listRef = useRef(null);
  const [search, setSearch] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [building, setBuilding] = useState('All');
  const [status, setStatus] = useState('All');
  const [assignedEmployee, setAssignedEmployee] = useState('All');
  const [assignmentStatus, setAssignmentStatus] = useState('All');
  const [keyStatus, setKeyStatus] = useState('All');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  return (
    <div className="check-in-list-page" style={shellStyle}>
      <div
        className="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-3"
        style={topBarStyle}
      >
        <div>
          <h4 className="mb-2" style={{ color: pageText, fontSize: 18, fontWeight: 700 }}>
            Check-In List
          </h4>
          <div style={{ color: pageText, fontSize: 15 }}>
            <Link to="/dashboards" style={{ color: pageText }}>Dashboard</Link> &gt;{' '}
            <Link to="/check-in-dashboard" style={{ color: pageText }}>Check-in</Link> &gt; Check-In List
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Button
            as={Link}
            to="/check-in-dashboard"
            variant="outline-primary"
            className="d-inline-flex align-items-center justify-content-center gap-2 px-4"
            style={{ ...outlineButtonStyle, borderColor: '#b8b6ff', color: darkButton }}
          >
            <IconifyIcon icon="ri:arrow-left-s-line" width={18} height={18} />
            <span>Back</span>
          </Button>
          <Button as={Link} to="/check-in-start" style={{ ...primaryButtonStyle, minWidth: 139 }}>
            Create Check-In
          </Button>
        </div>
      </div>

      <div style={{ padding: '30px 24px' }}>
        <div
          className="d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-3 mb-4"
          style={{ ...panelStyle, padding: '15px 20px' }}
        >
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-4">
            <div style={{ maxWidth: 360, minWidth: 300, position: 'relative' }}>
              <IconifyIcon
                icon="ri:search-line"
                style={{ color: '#6f78a6', fontSize: 18, left: 13, position: 'absolute', top: 10 }}
              />
              <input
                placeholder="Check-Ins List"
                style={{ ...inputStyle, padding: '0 14px 0 40px' }}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              selectsStart
              startDate={fromDate}
              endDate={toDate}
              maxDate={toDate || undefined}
              dateFormat="dd-MM-yyyy"
              placeholderText="dd-mm-yyyy"
              isClearable
              portalId="datepicker-portal"
              popperPlacement="bottom-start"
              customInput={<DateFilterButton label="From Date" />}
            />
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              selectsEnd
              startDate={fromDate}
              endDate={toDate}
              minDate={fromDate || undefined}
              dateFormat="dd-MM-yyyy"
              placeholderText="dd-mm-yyyy"
              isClearable
              portalId="datepicker-portal"
              popperPlacement="bottom-end"
              customInput={<DateFilterButton label="To Date" />}
            />
            <Button style={primaryButtonStyle} onClick={() => listRef.current?.exportToExcel()}>
              Export Excel
            </Button>
          </div>
        </div>

        <div className="mb-4" style={{ ...panelStyle, padding: '20px 20px' }}>
          <Row className="g-4">
            <SelectField
              label="Property Type"
              options={filterOptions.propertyType}
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            />
            <SelectField
              label="Building"
              options={filterOptions.building}
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            />
            <SelectField
              label="Status"
              options={filterOptions.status}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
            <SelectField
              label="Assigned Employee"
              options={filterOptions.assignedEmployee}
              value={assignedEmployee}
              onChange={(e) => setAssignedEmployee(e.target.value)}
            />
            <SelectField
              label="Assignment Status"
              options={filterOptions.assignmentStatus}
              value={assignmentStatus}
              onChange={(e) => setAssignmentStatus(e.target.value)}
            />
            <SelectField
              label="Key Status"
              options={filterOptions.keyStatus}
              value={keyStatus}
              onChange={(e) => setKeyStatus(e.target.value)}
            />
          </Row>
        </div>

        <List
          ref={listRef}
          search={search}
          propertyType={propertyType}
          building={building}
          status={status}
          assignedEmployee={assignedEmployee}
          assignmentStatus={assignmentStatus}
          keyStatus={keyStatus}
          fromDate={fromDate}
          toDate={toDate}
        />
      </div>
    </div>
  );
};

export default CheckInListView;
