import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const pageText = "#526b89";
const detailsPath = "/check-in-information";
const editPath = "/check-in-start#check-in-information";

const checkInRows = [
  {
    srNo: 1,
    tenantId: "12345",
    tenantName: "Aylin Huynh",
    property: "Silver Oak Residency",
    unitNo: "A-101",
    checkinDate: "21 May 2015",
    rent: "1500 OMR",
    assignmentStatus: "Approved",
    keyStatus: "Handed Over",
    status: "Completed",
    assignedTo: "Ahmed Al-Harthi",
  },
  {
    srNo: 2,
    tenantId: "12345",
    tenantName: "Louise Morton",
    property: "Green Valley Heights",
    unitNo: "B-204",
    checkinDate: "21 May 2018",
    rent: "2500 OMR",
    assignmentStatus: "Approved",
    keyStatus: "Handed Over",
    status: "In Progress",
    assignedTo: "Salim Al-Balushi",
  },
  {
    srNo: 3,
    tenantId: "12345",
    tenantName: "Analia Huffman",
    property: "Sunrise Meadows",
    unitNo: "C-307",
    checkinDate: "21 May 2011",
    rent: "3500 OMR",
    assignmentStatus: "Pending",
    keyStatus: "Pending",
    status: "In Progress",
    assignedTo: "Khalid Al-Rawahi",
  },
  {
    srNo: 4,
    tenantId: "12345",
    tenantName: "Novah Gibson",
    property: "Blue Horizon Towers",
    unitNo: "D-402",
    checkinDate: "21 May 2011",
    rent: "3500 OMR",
    assignmentStatus: "Approved",
    keyStatus: "Pending",
    status: "Active",
    assignedTo: "Aarav Sharma",
  },
  {
    srNo: 5,
    tenantId: "12345",
    tenantName: "Kavya Joshi",
    property: "Maple Leaf Villas",
    unitNo: "E-509",
    checkinDate: "21 May 2018",
    rent: "2700 OMR",
    assignmentStatus: "Pending",
    keyStatus: "Pending",
    status: "In Progress",
    assignedTo: "Rohan Patel",
  },
  {
    srNo: 6,
    tenantId: "12345",
    tenantName: "Rahul Mehta",
    property: "Golden Crest Villa",
    unitNo: "F-603",
    checkinDate: "21 May 2018",
    rent: "5800 OMR",
    assignmentStatus: "Approved",
    keyStatus: "Handed Over",
    status: "Completed",
    assignedTo: "Ananya Iyer",
  },
  {
    srNo: 7,
    tenantId: "12345",
    tenantName: "Sneha Nair",
    property: "Riverstone Enclave",
    unitNo: "G-708",
    checkinDate: "21 May 2018",
    rent: "4600 OMR",
    assignmentStatus: "Approved",
    keyStatus: "Handed Over",
    status: "Completed",
    assignedTo: "Karan Singh",
  },
  {
    srNo: 8,
    tenantId: "12345",
    tenantName: "Arjun Reddy",
    property: "Palm Grove Estate",
    unitNo: "H-812",
    checkinDate: "21 May 2018",
    rent: "2500 OMR",
    assignmentStatus: "Pending",
    keyStatus: "Pending",
    status: "Key Pending",
    assignedTo: "Neha Gupta",
  },
];

const panelStyle = {
  background: "#fff",
  borderRadius: 6,
  boxShadow: "0 7px 24px rgba(15, 23, 42, 0.06)",
};

const tableHeaderStyle = {
  color: pageText,
  fontSize: 14,
  fontWeight: 500,
  padding: "17px 10px",
  whiteSpace: "nowrap",
};

const tableCellStyle = {
  color: pageText,
  fontSize: 14,
  padding: "17px 10px",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
};

const badgePalette = {
  Approved: { background: "#d9f3e4", color: "#32bf72" },
  "Handed Over": { background: "#d9f3e4", color: "#32bf72" },
  Completed: { background: "#d9f3e4", color: "#32bf72" },
  Active: { background: "#d9f3e4", color: "#32bf72" },
  Pending: { background: "#fff0df", color: "#f2a24d" },
  "In Progress": { background: "#e2ebfb", color: "#5d83ff" },
  "Key Pending": { background: "#fff0df", color: "#f2a24d" },
};

const Badge = ({ value }) => (
  <span
    style={{
      ...(badgePalette[value] || { background: "#eef2f7", color: pageText }),
      borderRadius: 4,
      display: "inline-block",
      fontSize: 13,
      fontWeight: 500,
      minWidth: 68,
      padding: "4px 10px",
      textAlign: "center",
    }}
  >
    {value}
  </span>
);

const ActionButton = ({ icon, label, to, bg = "#f4f7fa" }) => (
  <Button
    as={Link}
    to={to}
    onClick={(event) => event.stopPropagation()}
    variant="link"
    aria-label={label}
    title={label}
    className="d-inline-flex align-items-center justify-content-center p-0"
    style={{
      background: bg,
      borderRadius: 4,
      color: "#263044",
      height: 32,
      textDecoration: "none",
      width: 40,
    }}
  >
    <IconifyIcon icon={icon} width={17} height={17} />
  </Button>
);

const List = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...panelStyle, overflow: "hidden", width: "100%" }}>
      <h5
        className="mb-0"
        style={{
          borderBottom: "1px solid #e7ebf1",
          color: pageText,
          fontSize: 18,
          fontWeight: 700,
          padding: "15px 20px",
        }}
      >
        Check-in List (123)
      </h5>
      <div
        style={{
          background: "#fff",
          overflowX: "auto",
          padding: "0 16px 16px",
        }}
      >
        <table
          style={{ borderCollapse: "collapse", minWidth: 1450, width: "100%" }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #e7ebf1" }}>
              <th style={tableHeaderStyle}>Sr. No.</th>
              <th style={tableHeaderStyle}>Tenant ID</th>
              <th style={tableHeaderStyle}>Tenant Name</th>
              <th style={tableHeaderStyle}>Property</th>
              <th style={tableHeaderStyle}>Unit No.</th>
              <th style={tableHeaderStyle}>Check-In Date</th>
              <th style={tableHeaderStyle}>Rent</th>
              <th style={tableHeaderStyle}>Assignment Status</th>
              <th style={tableHeaderStyle}>Key Status</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Assigned To</th>
              <th style={tableHeaderStyle}>Request</th>
              <th style={tableHeaderStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {checkInRows.map((row) => (
              <tr
                key={`${row.srNo}-${row.tenantName}`}
                onClick={() => navigate(detailsPath)}
                style={{ borderBottom: "1px solid #eef1f5", cursor: "pointer" }}
              >
                <td style={{ ...tableCellStyle, textAlign: "center" }}>
                  {row.srNo}
                </td>
                <td style={tableCellStyle}>{row.tenantId}</td>
                <td
                  style={{
                    ...tableCellStyle,
                    color: "#273247",
                    fontWeight: 500,
                  }}
                >
                  <Link
                    to={detailsPath}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {row.tenantName}
                  </Link>
                </td>
                <td style={tableCellStyle}>{row.property}</td>
                <td style={tableCellStyle}>{row.unitNo}</td>
                <td style={tableCellStyle}>{row.checkinDate}</td>
                <td style={tableCellStyle}>{row.rent}</td>
                <td style={tableCellStyle}>
                  <Badge value={row.assignmentStatus} />
                </td>
                <td style={tableCellStyle}>
                  <Badge value={row.keyStatus} />
                </td>
                <td style={tableCellStyle}>
                  <Badge value={row.status} />
                </td>
                <td style={tableCellStyle}>{row.assignedTo}</td>
                <td style={tableCellStyle}>
                  <Button
                    as={Link}
                    to="/check-out-start"
                    onClick={(event) => event.stopPropagation()}
                    style={{
                      background: "#6382b0",
                      borderColor: "#6382b0",
                      borderRadius: 4,
                      fontSize: 13,
                      fontWeight: 600,
                      height: 25,
                      padding: "2px 12px",
                    }}
                  >
                    Add Check-Out
                  </Button>
                </td>
                <td style={tableCellStyle}>
                  <div className="d-flex gap-2">
                    <ActionButton
                      icon="solar:eye-broken"
                      label="View check-in details"
                      to={detailsPath}
                    />
                    <ActionButton
                      icon="solar:pen-2-broken"
                      label="Edit check-in"
                      to={editPath}
                      bg="#f5f0ff"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="d-flex justify-content-end"
        style={{ padding: "0 20px 15px" }}
      >
        <div
          className="d-flex"
          style={{
            border: "1px solid #e4e9f0",
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          {["Previous", "1", "2", "3", "Next"].map((item) => (
            <button
              key={item}
              type="button"
              style={{
                background: item === "1" ? "#283140" : "#fff",
                border: 0,
                borderRight: item === "Next" ? 0 : "1px solid #e4e9f0",
                color: item === "1" ? "#fff" : "#3d4655",
                height: 35,
                minWidth: item.length > 1 ? 78 : 32,
                padding: "0 12px",
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
