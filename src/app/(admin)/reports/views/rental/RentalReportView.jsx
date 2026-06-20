import { Button, Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useRentalReportController } from '../../controllers/useRentalReportController';

const RentalReportView = () => {
  const { breadcrumb, filterSummary, filters, rows, title, totalProperties } = useRentalReportController();

  return (
    <div className="rental-report-page">
      <style>
        {`
          .rental-report-page {
            color: #526b89;
          }

          .rental-report-page .report-card {
            border: 0;
            border-radius: 5px;
            box-shadow: 0 1px 6px rgba(47, 56, 72, 0.08);
            overflow: hidden;
          }

          .rental-report-page .report-toolbar {
            align-items: center;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 1px 6px rgba(47, 56, 72, 0.08);
            display: flex;
            gap: 16px;
            justify-content: space-between;
            margin: 20px 0 24px;
            padding: 16px 20px;
          }

          .rental-report-page .search-box {
            position: relative;
            width: 360px;
          }

          .rental-report-page .search-box input,
          .rental-report-page .filter-select,
          .rental-report-page .price-input {
            border: 1px solid #dfe6ee;
            border-radius: 5px;
            color: #536b86;
            font-size: 14px;
            min-height: 39px;
          }

          .rental-report-page .search-box input {
            padding-left: 40px;
          }

          .rental-report-page .toolbar-btn {
            border-color: #173d72;
            border-radius: 5px;
            color: #2f3848;
            min-height: 39px;
            padding: 8px 15px;
          }

          .rental-report-page .primary-action {
            background: #293052;
            border-color: #293052;
            border-radius: 5px;
            min-height: 39px;
            padding: 8px 18px;
          }

          .rental-report-page .filter-title {
            color: #536b86;
            font-size: 16px;
            font-weight: 700;
          }

          .rental-report-page .filter-label {
            color: #2f3848;
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 12px;
          }

          .rental-report-page .filter-section {
            margin-top: 20px;
          }

          .rental-report-page .form-check-input {
            border-color: #cfd7df;
            height: 15px;
            margin-top: 2px;
            width: 15px;
          }

          .rental-report-page .form-check-input:checked {
            background-color: #293052;
            border-color: #293052;
          }

          .rental-report-page .bedroom-options {
            display: grid;
            gap: 4px;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .rental-report-page .bedroom-options .btn {
            border-color: #293052;
            border-radius: 5px;
            color: #293052;
            font-size: 14px;
            min-height: 39px;
          }

          .rental-report-page .bedroom-options .btn-check:checked + .btn {
            background: #293052;
            color: #fff;
          }

          .rental-report-page .table > :not(caption) > * > * {
            background: transparent;
          }

          .rental-report-page .report-table-wrap {
            overflow-x: visible;
            width: 100%;
          }

          .rental-report-page .report-table {
            table-layout: fixed;
            width: 100%;
          }

          .rental-report-page .report-table th,
          .rental-report-page .report-table td {
            white-space: normal;
          }

          .rental-report-page .report-table .title-cell,
          .rental-report-page .report-table .status-cell,
          .rental-report-page .report-table .action-cell {
            white-space: nowrap;
          }
        `}
      </style>

      <div>
        <h4 className="mb-1 fw-semibold" style={{ color: '#536b86', fontSize: 18 }}>
          {title}
        </h4>
        <p className="mb-0" style={{ color: '#536b86', fontSize: 14 }}>
          {breadcrumb}
        </p>
      </div>

      <div className="report-toolbar">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="search-box">
            <IconifyIcon icon="ri:search-line" className="position-absolute" style={{ left: 13, top: '50%', transform: 'translateY(-50%)', color: '#7a8da5', fontSize: 17 }} />
            <input className="form-control" placeholder="Reports and Analysis" />
          </div>
          <span style={{ color: '#2f3848', fontSize: 15, fontWeight: 500 }}>{totalProperties}</span>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Button variant="outline-primary" className="toolbar-btn">
            <IconifyIcon icon="ri:arrow-down-s-line" className="me-1" />
            From Date
          </Button>
          <Button variant="outline-primary" className="toolbar-btn">
            <IconifyIcon icon="ri:arrow-down-s-line" className="me-1" />
            To Date
          </Button>
          <Button className="primary-action">Export Excel</Button>
        </div>
      </div>

      <Row className="g-3">
        <Col xl={2} lg={12}>
          <Card className="report-card">
            <CardHeader className="bg-white border-bottom" style={{ padding: '16px 20px' }}>
              <h5 className="filter-title mb-1">Property</h5>
              <p className="mb-0" style={{ color: '#536b86', fontSize: 14 }}>
                {filterSummary}
              </p>
            </CardHeader>
            <CardBody style={{ padding: 20 }}>
              <label className="form-label mb-2" style={{ color: '#536b86', fontSize: 14 }}>
                Properties Location
              </label>
              <select className="form-select filter-select">
                {filters.cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>

              <div className="filter-section">
                <h5 className="filter-label">Custom Price Range :</h5>
                <div className="d-flex align-items-center px-1 mb-3" style={{ height: 18 }}>
                  <span style={{ width: 17, height: 17, borderRadius: '50%', background: '#293052' }} />
                  <span style={{ flex: 1, height: 7, background: '#293052' }} />
                  <span style={{ width: 17, height: 17, borderRadius: '50%', background: '#293052' }} />
                </div>
                <div className="d-flex align-items-center gap-2">
                  <input className="form-control price-input text-center" value="OMR 1000" readOnly />
                  <span style={{ color: '#536b86', fontSize: 14, fontWeight: 600 }}>to</span>
                  <input className="form-control price-input text-center" value="OMR 10000" readOnly />
                </div>
              </div>

              <FilterCheckboxGroup title="Property Type :" items={filters.propertyType} />
              <FilterCheckboxGroup title="Properties Type :" items={filters.propertiesType} checkedItem="All Properties" />

              <div className="filter-section">
                <h5 className="filter-label">Bedrooms :</h5>
                <div className="bedroom-options">
                  {filters.bedrooms.map((bedroom) => (
                    <div key={bedroom}>
                      <input type="checkbox" className="btn-check" id={`rental-${bedroom}`} defaultChecked={bedroom === '3 BHK'} />
                      <label className="btn w-100" htmlFor={`rental-${bedroom}`}>
                        {bedroom}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <FilterCheckboxGroup title="Accessibility Features :" items={filters.accessibilityFeatures} />
              <FilterCheckboxGroup title="Rental For" items={filters.rentalFor} />
              <FilterCheckboxGroup title="Rental For" items={filters.rentalStatus} />
            </CardBody>

            <div style={{ padding: '14px 20px 20px' }}>
              <Button className="primary-action w-100">Apply</Button>
            </div>
          </Card>
        </Col>

        <Col xl={10} lg={12}>
          <Card className="report-card">
            <CardHeader className="bg-white border-0" style={{ padding: '18px 20px 14px' }}>
              <h5 className="mb-0" style={{ color: '#536b86', fontSize: 16, fontWeight: 700 }}>
                Property Reports
              </h5>
            </CardHeader>
            <CardBody className="p-0">
              <div className="report-table-wrap">
                <table className="table align-middle table-hover table-centered mb-0 report-table">
                  <thead style={{ background: '#fbfbfc' }}>
                    <tr>
                      {['P. ID', 'Title', 'Type', 'Target', 'Added By', 'Area (sq.ft)', 'Rooms', 'Features', 'Rent', 'Status', 'Action'].map((heading) => (
                        <th key={heading} style={headStyle}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={`${row.title}-${index}`}>
                        <td style={cellStyle}>{row.id}</td>
                        <td className="title-cell" style={{ ...cellStyle, color: '#2f3848', fontWeight: 600 }}>
                          <span className="d-inline-flex align-items-center gap-2">
                            <span className="d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '50%', background: '#e5e5e5', color: '#2f3848' }}>
                              <IconifyIcon icon="ri:image-line" width={14} height={14} />
                            </span>
                            {row.title}
                          </span>
                        </td>
                        <td style={cellStyle}>{row.type}</td>
                        <td style={cellStyle}>{row.target}</td>
                        <td style={cellStyle}>{row.addedBy}</td>
                        <td style={cellStyle}>{row.area}</td>
                        <td style={cellStyle}>{row.rooms}</td>
                        <td style={{ ...cellStyle, maxWidth: 150, whiteSpace: 'normal' }}>{row.features}</td>
                        <td style={cellStyle}>{row.rent}</td>
                        <td className="status-cell" style={cellStyle}>
                          <span style={{ borderRadius: 5, color: row.status === 'Active' ? '#22a06b' : '#e65f5c', background: row.status === 'Active' ? '#dff6e9' : '#ffe2e2', fontSize: 13, fontWeight: 600, padding: '5px 11px' }}>
                            {row.status}
                          </span>
                        </td>
                        <td className="action-cell" style={cellStyle}>
                          <div className="d-flex gap-2">
                            <Button variant="light" size="sm" style={actionButtonStyle}>
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-16" />
                            </Button>
                            <Button variant="light" size="sm" style={{ ...actionButtonStyle, background: '#f0edff', color: '#293052' }}>
                              <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-16" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-end" style={{ padding: '18px 20px' }}>
                <nav aria-label="Rental report pagination">
                  <ul className="pagination pagination-sm mb-0">
                    <li className="page-item">
                      <button className="page-link" style={paginationButtonStyle}>Previous</button>
                    </li>
                    {[1, 2, 3].map((page) => (
                      <li className={`page-item ${page === 1 ? 'active' : ''}`} key={page}>
                        <button
                          className="page-link"
                          style={page === 1 ? activePaginationButtonStyle : paginationButtonStyle}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                    <li className="page-item">
                      <button className="page-link" style={paginationButtonStyle}>Next</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const FilterCheckboxGroup = ({ title, items, checkedItem }) => (
  <div className="filter-section">
    <h5 className="filter-label">{title}</h5>
    <Row className="g-0">
      {items.map((item) => (
        <Col xs={6} key={item}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <input className="form-check-input" type="checkbox" id={`rental-${item}`} defaultChecked={item === checkedItem} />
            <label className="form-check-label" htmlFor={`rental-${item}`} style={{ color: '#536b86', fontSize: 14 }}>
              {item}
            </label>
          </div>
        </Col>
      ))}
    </Row>
  </div>
);

const headStyle = {
  color: '#526b89',
  fontSize: 14,
  fontWeight: 600,
  padding: '15px 12px',
  borderBottom: '1px solid #edf0f3',
};

const cellStyle = {
  color: '#526b89',
  fontSize: 14,
  fontWeight: 400,
  padding: '12px',
  borderBottom: '1px solid #edf0f3',
  verticalAlign: 'middle',
};

const actionButtonStyle = {
  background: '#f4f6f9',
  border: 'none',
  color: '#2f3848',
  height: 32,
  width: 40,
};

const paginationButtonStyle = {
  background: '#fff',
  borderColor: '#e4e8ef',
  color: '#536b86',
  minWidth: 36,
  padding: '8px 12px',
};

const activePaginationButtonStyle = {
  ...paginationButtonStyle,
  background: '#293052',
  borderColor: '#293052',
  color: '#fff',
};

export default RentalReportView;
