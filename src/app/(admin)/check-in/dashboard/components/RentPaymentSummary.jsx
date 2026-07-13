import { Card, CardBody } from "react-bootstrap";

const statusStyle = (status) => {
  switch (status) {
    case "Completed":   return { color: "#526b89" };
    case "In Progress": return { color: "#526b89" };
    case "Pending":     return { color: "#526b89" };
    default:            return { color: "#526b89" };
  }
};

const thStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#526b89",
  padding: "12px 16px",
  borderBottom: "1px solid #eef0f6",
  whiteSpace: "nowrap",
  background: "#fbfbfc",
};

const tdStyle = {
  fontSize: 15,
  color: "#526b89",
  padding: "11px 16px",
  borderBottom: "none",
  fontWeight: 400,
  verticalAlign: "middle",
  whiteSpace: "nowrap",
};

const RentPaymentSummary = ({ data = [] }) => {
  return (
    <Card
      className="border-0 shadow-sm h-100 w-100 d-flex flex-column"
      style={{
        borderRadius: 8,
        boxShadow: "0 10px 30px rgba(16, 24, 40, 0.07)",
        overflow: "hidden",
      }}
    >
      <CardBody style={{ padding: 0, flex: "0 0 auto" }}>
        <h5
          className="mb-0"
          style={{
            color: "#526b89",
            fontWeight: 700,
            fontSize: 18,
            padding: "22px 24px 18px",
            borderBottom: "1px solid #e6e8ec",
          }}
        >
          Rent &amp; Payment Summary
        </h5>
      </CardBody>

      {/* Table */}
      <div style={{ overflowX: "auto", overflowY: "hidden", padding: "18px 14px 0", flex: 1 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            minWidth: 780,
            border: "1px solid #e4e6eb",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Check-In ID</th>
              <th style={thStyle}>Tenant Name</th>
              <th style={thStyle}>Property</th>
              <th style={thStyle}>Check-In Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={{ background: "#fff" }}>
                <td style={tdStyle}>{row.id}</td>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{row.tenant}</td>
                <td style={tdStyle}>{row.property}</td>
                <td style={tdStyle}>{row.date}</td>
                <td style={{ ...tdStyle, ...statusStyle(row.status) }}>{row.status}</td>
                <td style={tdStyle}>{row.assigned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "16px 16px 16px",
          borderTop: "1px solid #edf0f3",
          marginTop: "auto",
        }}
      >
        <a
          href="#"
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#4b4a78",
            textDecoration: "none",
          }}
        >
          View All Check-Ins
        </a>
      </div>
    </Card>
  );
};

export default RentPaymentSummary;
