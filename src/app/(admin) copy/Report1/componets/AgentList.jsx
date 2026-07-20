import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllAgent } from '@/helpers/data';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
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

  return (
    <Row>
      <Col xl={12}>
        <Card className="border-0 shadow-sm" style={{ borderRadius: '0.5rem' }}>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom bg-white">
            <CardTitle as="h4" className="mb-0">All Landlord List</CardTitle>

            <Dropdown>
              <DropdownToggle
                as="a"
                className="btn btn-sm rounded content-none icons-center"
                style={{ 
                  border: '1px solid #dee2e6',
                  color: '#6c757d',
                  backgroundColor: 'white',
                  padding: '0.375rem 0.75rem',
                  cursor: 'pointer'
                }}
              >
                This Month
                <IconifyIcon
                  className="ms-1"
                  width={16}
                  height={16}
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
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Landlord ID</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Landlord Photo & Name</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Date</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Date</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comment</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.875rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {agentData?.slice(0, 8).map((item, idx) => (
                    <tr 
                      key={idx}
                      style={{ 
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Landlord ID */}
                      <td className="fw-medium text-muted">{idx + 1}</td>

                      {/* Photo + Name */}
                      <td style={{ padding: '1rem' }}>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={item.user?.avatar}
                            alt="avatar"
                            className="avatar-sm rounded-circle"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                          <span className="fw-medium text-dark">
                            {item.user?.name}
                          </span>
                        </div>
                      </td>

                      {/* Address */}
                      <td style={{ padding: '1rem', color: '#6c757d' }}>{item.address}</td>

                      {/* Contact */}
                      <td style={{ padding: '1rem', color: '#6c757d' }}>{item.user?.contact}</td>

                      {/* Start Date */}
                      <td style={{ padding: '1rem', color: '#6c757d' }}>
                        {item.date.toLocaleString('en-us', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* End Date */}
                      <td style={{ padding: '1rem', color: '#6c757d' }}>
                        {item.date.toLocaleString('en-us', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Comment */}
                      <td style={{ padding: '1rem' }}>
                        <Link 
                          to="" 
                          className="text-decoration-underline"
                          style={{ color: '#5d5fef', fontSize: '0.875rem' }}
                        >
                          Add Comment
                        </Link>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem' }}>
                        <span
                          className="badge rounded-pill px-3 py-1"
                          style={{
                            backgroundColor: item.user?.status === 'Active' ? '#d4edda' : '#f8d7da',
                            color: item.user?.status === 'Active' ? '#155724' : '#721c24',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                        >
                          {item.user?.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '1rem' }}>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="light" 
                            size="sm"
                            className="rounded"
                            style={{ 
                              padding: '0.375rem 0.5rem',
                              border: '1px solid #e9ecef'
                            }}
                          >
                            <IconifyIcon icon="solar:eye-broken" width={16} height={16} />
                          </Button>
                          <Button 
                            size="sm"
                            className="rounded"
                            style={{ 
                              padding: '0.375rem 0.5rem',
                              backgroundColor: '#f0f4ff',
                              color: '#5d5fef',
                              border: 'none'
                            }}
                          >
                            <IconifyIcon icon="solar:pen-2-broken" width={16} height={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>

          <CardFooter className="bg-white border-top">
            <nav>
              <ul className="pagination justify-content-end mb-0">
                <li className="page-item">
                  <Link 
                    className="page-link text-muted" 
                    to=""
                    style={{ 
                      border: '1px solid #dee2e6', 
                      borderRadius: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      marginRight: '0.25rem'
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
                      backgroundColor: '#5d5fef',
                      borderColor: '#5d5fef',
                      borderRadius: '0.375rem',
                      marginRight: '0.25rem',
                      padding: '0.375rem 0.75rem'
                    }}
                  >
                    1
                  </Link>
                </li>
                <li className="page-item">
                  <Link 
                    className="page-link text-dark" 
                    to=""
                    style={{ 
                      border: '1px solid #dee2e6',
                      borderRadius: '0.375rem',
                      marginRight: '0.25rem',
                      padding: '0.375rem 0.75rem'
                    }}
                  >
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link 
                    className="page-link text-dark" 
                    to=""
                    style={{ 
                      border: '1px solid #dee2e6',
                      borderRadius: '0.375rem',
                      marginRight: '0.25rem',
                      padding: '0.375rem 0.75rem'
                    }}
                  >
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <Link 
                    className="page-link text-muted" 
                    to=""
                    style={{ 
                      border: '1px solid #dee2e6', 
                      borderRadius: '0.375rem',
                      padding: '0.375rem 0.75rem'
                    }}
                  >
                    Next
                  </Link>
                </li>
              </ul>
            </nav>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};

export default AgentList;
