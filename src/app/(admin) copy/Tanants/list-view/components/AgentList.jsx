import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllAgent } from '@/helpers/data';
import { Link } from 'react-router-dom';
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

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <CardTitle as="h4">All Tenants List</CardTitle>

            <Dropdown>
              <DropdownToggle
                as="a"
                className="btn btn-sm btn-outline-light rounded content-none icons-center"
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
              <table className="table align-middle text-nowrap table-hover mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Tenants ID</th>
                    <th>Tenants Photo & Name</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Comment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {agentData?.slice(0, 8).map((item, idx) => (
                    <tr key={idx}>
                      {/* Landlord ID */}
                      <td className="fw-medium text-muted">12345</td>

                      {/* Photo + Name */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={item.user?.avatar}
                            alt="avatar"
                            className="avatar-sm rounded-circle"
                          />
                          <span className="fw-medium text-dark">
                            {item.user?.name}
                          </span>
                        </div>
                      </td>

                      {/* Address */}
                      <td>{item.address}</td>

                      {/* Contact */}
                      <td>{item.user?.contact}</td>

                      {/* Start Date */}
                      <td>{item.experience} Year</td>

                      {/* End Date */}
                      <td>
                        {item.date.toLocaleString('en-us', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Comment */}
                      <td>
                        <Link to="" className="text-primary text-decoration-underline">
                          Add Comment
                        </Link>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge bg-${
                            item.user?.status === 'Active'
                              ? 'success'
                              : 'danger'
                          }-subtle text-${
                            item.user?.status === 'Active'
                              ? 'success'
                              : 'danger'
                          } px-3 py-1`}
                        >
                          {item.user?.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td>
                        <div className="d-flex gap-2">
                          <Button variant="light" size="sm">
                            <IconifyIcon icon="solar:eye-broken" />
                          </Button>
                          <Button variant="soft-primary" size="sm">
                            <IconifyIcon icon="solar:pen-2-broken" />
                          </Button>
                          <Button variant="soft-secondary" size="sm">
                          <IconifyIcon icon="solar:refresh-broken" /> 
                          </Button>
  
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>

          <CardFooter>
            <nav>
              <ul className="pagination justify-content-end mb-0">
                <li className="page-item">
                  <Link className="page-link" to="">
                    Previous
                  </Link>
                </li>
                <li className="page-item active">
                  <Link className="page-link" to="">
                    1
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" to="">
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" to="">
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" to="">
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
