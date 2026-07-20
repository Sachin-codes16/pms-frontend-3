import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { getAllAgent } from "@/helpers/data";
import { Link } from "react-router-dom";
import {  useNavigate } from 'react-router-dom';
import { useState } from "react";
import avatar1 from '../../../../../assets/images/users/avatar-1.jpg';

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
  Row,
} from "react-bootstrap";
import { useFetchData } from "@/hooks/useFetchData";

const AgentList = () => {
  const agentData = useFetchData(getAllAgent);
  const navigate = useNavigate();
  
  
  const [openCommentId, setOpenCommentId] = useState(null);
  
  const [comment, setComment] = useState("");
  
  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <CardTitle as="h4">All tenants List</CardTitle>

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
                      <td className="fw-medium text-muted">{idx + 1}</td>


                      {/* Photo + Name */}
                      <td>
                        <div className="d-flex align-items-center gap-2"
                         onClick={(e) => {
       navigate("/Customers-Details");
       }}  style={{ cursor: "pointer" }}>
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
                      <td>
                        {item.date.toLocaleString("en-us", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* End Date */}
                      <td>
                        {item.date.toLocaleString("en-us", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Comment */}
                   <td style={{ position: "relative", overflow: "visible" }}>
  {/* Add Comment link */}
  <Link
    to=""
    className="text-primary text-decoration-underline"
    onClick={(e) => {
      e.preventDefault();
      setOpenCommentId(openCommentId === item.id ? null : item.id);
    }}
  >
    Add Comment
  </Link>

  {/* Comment Box */}
  {openCommentId === item.id && (
    <div
      style={{
         position: "fixed",
  top: "46%",
  left: "70%",
  transform: "translate(-50%, -50%)",
  zIndex: 9999,
  background: "#e0e0e0",
  padding: "22px 6px",
  borderRadius: "30px",
  width: "550px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
          text :"bold",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 800 }}>
          Add Comment
        </span>

        <span style={{ fontSize: "12px", color: "#555" ,fontWeight: 800 }}>
          <span>Ali S.</span>
          {item.name} |{" "}
          
          {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          |{" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Input Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Avatar */}
       <img
  src={avatar1}
  alt="user"
  width="36"
  height="36"
  className="rounded-circle"
  style={{ border: "2px solid #fff" }}
/>

        {/* Input + Send */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: "20px",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comment"
            className="form-control form-control-sm border-0 shadow-none"
            style={{ fontSize: "13px" }}
          />

          <button
            className="btn btn-light btn-sm rounded-circle"
            style={{
              width: "30px",
              height: "30px",
              padding: 0,
              marginLeft: "6px",
            }}
            onClick={() => {
              // yahan API call karega
              console.log("Saved Comment:", comment);
              setComment("");
              setOpenCommentId(null); // submit ke baad hide
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )}
</td>

                      
                      {/* Assign Property */}
<td>
  <button
    onClick={() => navigate('/Assignment-property')}
    style={{
      backgroundColor: '#4a6fa5',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }}
  >
    Assign Property
  </button>
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
                           <Button
                           variant="light"
                           size="sm"
                           onClick={() => navigate('/comment')}
>
                           <IconifyIcon icon="ri:time-line" width={18} height={18} />
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
  <Link 
    className="page-link" 
    to=""
    style={{
      backgroundColor: '#5D7186',
      borderColor: '#5D7186'
    }}
  >
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
