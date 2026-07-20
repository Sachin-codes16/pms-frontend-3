import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllAgent } from '@/helpers/data';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row
} from 'react-bootstrap';
import { useFetchData } from '@/hooks/useFetchData';

const AgentList = () => {
  const agentData = useFetchData(getAllAgent);
  const navigate = useNavigate();

  // Sample property data matching Figma
  const propertyData = [
    { title: '3BHK Apartment', type: 'Apartment', target: 'Family', addedBy: 'Ali', area: 1200, rooms: 4, features: 'Balcony, Modular Kitchen', rent: '1200 OMN', status: 'Active' },
    { title: '4BHK Villa', type: 'Apartment', target: 'Bachelor', addedBy: 'Sara', area: 1200, rooms: 3, features: 'Garden', rent: '1600 OMN', status: 'Active' },
    { title: '3BHK Apartment', type: 'Villa', target: 'Family', addedBy: 'Ali', area: 1800, rooms: 2, features: 'Balcony, Modular Kitchen', rent: '1100 OMN', status: 'Inactive' },
    { title: '3BHK Apartment', type: 'Apartment', target: 'Family', addedBy: 'Ali', area: 1000, rooms: 4, features: 'Kitchen', rent: '1200 OMN', status: 'Active' },
    { title: '4BHK Villa', type: 'Villa', target: 'Bachelor', addedBy: 'Sara', area: 800, rooms: 1, features: 'Balcony, Modular Kitchen', rent: '1100 OMN', status: 'Inactive' },
    { title: '4BHK Villa', type: 'Apartment', target: 'Family', addedBy: 'Sara', area: 1200, rooms: 2, features: 'Balcony, Modular Kitchen', rent: '1300 OMN', status: 'Active' },
    { title: '4BHK Villa', type: 'Villa', target: 'Bachelor', addedBy: 'Ali', area: 1600, rooms: 3, features: 'Balcony', rent: '1650 OMN', status: 'Active' },
    { title: '3BHK Apartment', type: 'Apartment', target: 'Family', addedBy: 'Sara', area: 1200, rooms: 4, features: 'Modular Kitchen', rent: '1800 OMN', status: 'Inactive' }
  ];

  return (
    <Row>
      <Col xl={12}>
        <Card className="border-0 shadow-sm" style={{ borderRadius: '0.5rem' }}>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom bg-white" style={{ padding: '1rem 1.5rem' }}>
            <CardTitle as="h5" className="mb-0" style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
              Property Reports
            </CardTitle>

            <Dropdown>
              <DropdownToggle
                as="a"
                className="btn btn-sm rounded content-none icons-center"
                style={{ 
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  backgroundColor: 'white',
                  padding: '0.375rem 0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.813rem'
                }}
              >
                This Month
                <IconifyIcon
                  className="ms-1"
                  width={14}
                  height={14}
                  icon="ri:arrow-down-s-line"
                />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Download</DropdownItem>
                <DropdownItem>Export</DropdownItem>
                <DropdownItem>Import</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardHeader>

          <CardBody className="p-0">
            <div className="table-responsive">
              <table className="table align-middle text-nowrap mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.688rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>P. ID</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.688rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TITLE</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.688rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TYPE</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.688rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TARGET</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.688rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ADDED BY</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.688rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AREA (SQ.FT)</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.688rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROOMS</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.688rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FEATURES</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.688rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RENT</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.688rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>STATUS</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.688rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {propertyData.map((item, idx) => (
                    <tr 
                      key={idx}
                      style={{ 
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Property ID */}
                      <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.813rem' }}>12345</td>

                      {/* Photo + Title */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div className="d-flex align-items-center gap-2">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ 
                              width: '32px', 
                              height: '32px', 
                              backgroundColor: '#e2e8f0',
                              flexShrink: 0
                            }}
                          >
                            <IconifyIcon icon="solar:home-2-broken" width={16} height={16} style={{ color: '#64748b' }} />
                          </div>
                          <span style={{ fontSize: '0.813rem', fontWeight: 500, color: '#1e293b' }}>
                            {item.title}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: '0.875rem 1rem', color: '#5d6eb8', fontSize: '0.813rem' }}>
                        {item.type}
                      </td>

                      {/* Target */}
                      <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.813rem' }}>
                        {item.target}
                      </td>

                      {/* Added By */}
                      <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.813rem' }}>
                        {item.addedBy}
                      </td>

                      {/* Area */}
                      <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.813rem' }}>
                        {item.area}
                      </td>

                      {/* Rooms */}
                      <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.813rem' }}>
                        {item.rooms}
                      </td>

                      {/* Features */}
                      <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.813rem', maxWidth: '150px' }}>
                        {item.features}
                      </td>

                      {/* Rent */}
                      <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.813rem', fontWeight: 500 }}>
                        {item.rent}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span
                          className="badge rounded-pill px-2 py-1"
                          style={{
                            backgroundColor: item.status === 'Active' ? '#d1fae5' : '#fee2e2',
                            color: item.status === 'Active' ? '#065f46' : '#991b1b',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="light" 
                            size="sm"
                            className="rounded p-1"
                            style={{ 
                              border: '1px solid #e2e8f0',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <IconifyIcon icon="solar:eye-broken" width={14} height={14} style={{ color: '#64748b' }} />
                          </Button>
                          <Button 
                            size="sm"
                            className="rounded p-1"
                            style={{ 
                              backgroundColor: '#ede9fe',
                              color: '#5d6eb8',
                              border: 'none',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <IconifyIcon icon="solar:pen-2-broken" width={14} height={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>

          {/* Pagination */}
          <div className="bg-white border-top" style={{ padding: '1rem 1.5rem' }}>
            <nav>
              <ul className="pagination justify-content-end mb-0">
                <li className="page-item">
                  <Link 
                    className="page-link" 
                    to=""
                    style={{ 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      marginRight: '0.25rem',
                      color: '#64748b',
                      fontSize: '0.813rem'
                    }}
                  >
                    Previous
                  </Link>
                </li>
                <li className="page-item active">
                  <Link 
                    className="page-link" 
                    to=""
                    style={{ 
                      backgroundColor: '#3b4b7d',
                      borderColor: '#3b4b7d',
                      borderRadius: '0.375rem',
                      marginRight: '0.25rem',
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.813rem'
                    }}
                  >
                    1
                  </Link>
                </li>
                <li className="page-item">
                  <Link 
                    className="page-link" 
                    to=""
                    style={{ 
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      marginRight: '0.25rem',
                      padding: '0.375rem 0.75rem',
                      color: '#64748b',
                      fontSize: '0.813rem'
                    }}
                  >
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link 
                    className="page-link" 
                    to=""
                    style={{ 
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      marginRight: '0.25rem',
                      padding: '0.375rem 0.75rem',
                      color: '#64748b',
                      fontSize: '0.813rem'
                    }}
                  >
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <Link 
                    className="page-link" 
                    to=""
                    style={{ 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      color: '#64748b',
                      fontSize: '0.813rem'
                    }}
                  >
                    Next
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default AgentList;