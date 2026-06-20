import { Button, Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useOccupancyReportController } from '../../controllers/useOccupancyReportController';

const OccupancyReportView = () => {
  const { filters, rows, stats } = useOccupancyReportController();

  return (
    <div className="occupancy-report-page">
      <style>
        {`
          .occupancy-report-page {
            color: #526b89;
          }

          .occupancy-report-page .soft-card {
            border: 0;
            border-radius: 5px;
            box-shadow: 0 1px 6px rgba(47, 56, 72, 0.08);
            overflow: hidden;
          }

          .occupancy-report-page .toolbar {
            align-items: center;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 1px 6px rgba(47, 56, 72, 0.08);
            display: flex;
            gap: 16px;
            justify-content: space-between;
            margin: 18px 0 24px;
            padding: 16px 20px;
          }

          .occupancy-report-page .search-box {
            position: relative;
            width: 360px;
          }

          .occupancy-report-page .search-box input {
            border: 1px solid #dfe6ee;
            border-radius: 5px;
            color: #536b86;
            font-size: 14px;
            min-height: 39px;
            padding-left: 40px;
          }

          .occupancy-report-page .outline-action {
            border-color: #173d72;
            border-radius: 5px;
            color: #2f3848;
            min-height: 39px;
            padding: 8px 15px;
          }

          .occupancy-report-page .primary-action {
            background: #293052;
            border-color: #293052;
            border-radius: 5px;
            min-height: 39px;
            padding: 8px 18px;
          }

          .occupancy-report-page .filter-label {
            color: #2f3848;
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 14px;
          }

          .occupancy-report-page .filter-section {
            margin-top: 34px;
          }

          .occupancy-report-page .form-check-input {
            border-color: #cfd7df;
            height: 15px;
            margin: 0;
            width: 15px;
          }

          .occupancy-report-page .form-check-input:checked {
            background-color: #293052;
            border-color: #293052;
          }

          .occupancy-report-page .table > :not(caption) > * > * {
            background: transparent;
          }

          .occupancy-report-page .report-table-wrap {
            overflow-x: visible;
            width: 100%;
          }

          .occupancy-report-page .report-table {
            table-layout: fixed;
            width: 100%;
          }

          .occupancy-report-page .report-table th,
          .occupancy-report-page .report-table td {
            white-space: normal;
          }

          .occupancy-report-page .report-table .property-cell,
          .occupancy-report-page .report-table .status-cell,
          .occupancy-report-page .report-table .action-cell {
            white-space: nowrap;
          }
        `}
      </style>

      <h4 className="mb-3 fw-semibold" style={{ color: '#536b86', fontSize: 18 }}>
        Occupancy Reports
      </h4>

      <Row className="g-3 mb-3">
        {stats.map((item) => (
          <Col xs={12} sm={6} xl key={item.label}>
            <Card className="soft-card h-100">
              <CardBody style={{ padding: '20px 22px' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <p className="mb-0" style={{ color: '#536b86', fontSize: 15, fontWeight: 500 }}>
                        {item.label}
                      </p>
                      {item.change && (
                        <span className="badge bg-success-subtle text-success px-2 py-1" style={{ fontSize: 11 }}>
                          <IconifyIcon icon="ri:arrow-up-line" width={11} height={11} /> {item.change}
                        </span>
                      )}
                    </div>
                    <h3 className="mb-0" style={{ color: '#2f3848', fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
                      {item.value}
                    </h3>
                  </div>
                  <span className="d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, borderRadius: 5, background: item.bg }}>
                    <IconifyIcon icon={item.icon} width={30} height={30} style={{ color: item.color }} />
                  </span>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="toolbar">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="search-box">
            <IconifyIcon icon="ri:search-line" className="position-absolute" style={{ left: 13, top: '50%', transform: 'translateY(-50%)', color: '#7a8da5', fontSize: 17 }} />
            <input className="form-control" placeholder="Search" />
          </div>
          <span style={{ color: '#2f3848', fontSize: 15, fontWeight: 500 }}>311 Properties</span>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Button variant="outline-primary" className="outline-action">
            <IconifyIcon icon="ri:arrow-down-s-line" className="me-1" />
            From Date
          </Button>
          <Button variant="outline-primary" className="outline-action">
            <IconifyIcon icon="ri:arrow-down-s-line" className="me-1" />
            To Date
          </Button>
          <Button className="primary-action">Export Excel</Button>
        </div>
      </div>

      <Row className="g-3">
        <Col xl={2} lg={12}>
          <Card className="soft-card">
            <CardHeader className="bg-white border-0" style={{ padding: '20px 24px 12px' }}>
              <h5 className="mb-1" style={{ color: '#536b86', fontSize: 16, fontWeight: 700 }}>
                Property
              </h5>
              <p className="mb-0" style={{ color: '#536b86', fontSize: 14 }}>
                Show 311 <strong>Property</strong>
              </p>
            </CardHeader>
            <CardBody style={{ padding: '22px 24px 28px' }}>
              <FilterCheckboxGroup title="Property Type" items={filters.propertyTypes} />
              <FilterCheckboxGroup title="Status" items={filters.statuses} />
            </CardBody>
          </Card>

          <Button className="primary-action w-100 mt-4" style={{ minHeight: 40 }}>
            Apply
          </Button>
        </Col>

        <Col xl={10} lg={12}>
          <Card className="soft-card">
            <CardHeader className="bg-white border-bottom" style={{ padding: '18px 20px' }}>
              <h5 className="mb-0" style={{ color: '#536b86', fontSize: 16, fontWeight: 700 }}>
                Occupancy Property Reports
              </h5>
            </CardHeader>
            <CardBody className="p-0">
              <div className="report-table-wrap">
                <table className="table align-middle table-hover table-centered mb-0 report-table">
                  <thead style={{ background: '#fbfbfc' }}>
                    <tr>
                      {['Sr. No.', 'P. ID', 'Property Name', 'Type', 'Building/Project', 'Unit No', 'Start Date', 'End Date', 'Rent', 'Status', 'Action'].map((heading) => (
                        <th key={heading} style={headStyle}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={`${row.srNo}-${row.unitNo}`}>
                        <td style={cellStyle}>{row.srNo}</td>
                        <td style={cellStyle}>{row.id}</td>
                        <td className="property-cell" style={{ ...cellStyle, color: '#2f3848', fontWeight: 600 }}>
                          <span className="d-inline-flex align-items-center gap-3">
                            <span className="d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '50%', background: '#dedede', color: '#2f3848' }}>
                              <IconifyIcon icon="ri:image-line" width={14} height={14} />
                            </span>
                            {row.propertyName}
                          </span>
                        </td>
                        <td style={cellStyle}>{row.type}</td>
                        <td style={cellStyle}>{row.building}</td>
                        <td style={cellStyle}>{row.unitNo}</td>
                        <td style={cellStyle}>{row.startDate}</td>
                        <td style={cellStyle}>{row.endDate}</td>
                        <td style={cellStyle}>{row.rent}</td>
                        <td className="status-cell" style={cellStyle}>
                          <span style={getStatusStyle(row.status)}>{row.status}</span>
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
                <nav aria-label="Occupancy report pagination">
                  <ul className="pagination pagination-sm mb-0">
                    <li className="page-item">
                      <button className="page-link" style={paginationButtonStyle}>Previous</button>
                    </li>
                    {[1, 2, 3].map((page) => (
                      <li className={`page-item ${page === 1 ? 'active' : ''}`} key={page}>
                        <button className="page-link" style={page === 1 ? activePaginationButtonStyle : paginationButtonStyle}>
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

const FilterCheckboxGroup = ({ title, items }) => (
  <div className="filter-section">
    <h5 className="filter-label">{title}</h5>
    <Row className="g-0">
      {items.map((item) => (
        <Col xs={6} key={item}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <input className="form-check-input" type="checkbox" id={`occupancy-${title}-${item}`} />
            <label className="form-check-label" htmlFor={`occupancy-${title}-${item}`} style={{ color: '#536b86', fontSize: 14 }}>
              {item}
            </label>
          </div>
        </Col>
      ))}
    </Row>
  </div>
);

const getStatusStyle = (status) => {
  const styles = {
    Rented: { color: '#43b36f', background: '#d6f8e6' },
    Booked: { color: '#7e8a99', background: '#dceeff' },
    Vacant: { color: '#8d8420', background: '#fff685' },
    Police: { color: '#d95c63', background: '#ffd3d8' },
  };

  return {
     borderRadius: 5,
    fontSize: 13,
    fontWeight: 600,
    padding: '5px 11px',
    ...(styles[status] || styles.Rented),
  };
};

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

export default OccupancyReportView;
