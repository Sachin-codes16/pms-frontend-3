import property2 from "@/assets/images/properties/p-2.jpg";
import property3 from "@/assets/images/properties/p-3.jpg";
import property4 from "@/assets/images/properties/p-4.jpg";
import property5 from "@/assets/images/properties/p-5.jpg";
import property6 from "@/assets/images/properties/p-6.jpg";
import property7 from "@/assets/images/properties/p-7.jpg";
import avatar from "@/assets/images/users/avatar-1.jpg";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const pageText = "#526b89";
const bodyText = "#303746";

const issueRows = [
  ["IS124345", "Electrical Fittings", "Loose switch", "Required", "Ramesh Kumar", "125 OMR"],
  ["IS124345", "Kitchen Cabinet Door", "Door hinge problem", "Pending", "Imran Khan", "243 OMR"],
  ["IS124345", "Ceiling Paint Patch", "Pain rework", "Repaired", "Ramesh Kumar", "354 OMR"],
  ["IS124345", "Tap Leaking", "Tap Issue", "Repaired", "Ramesh Kumar", "245 OMR"],
  ["IS124345", "Balcony Door Lock", "Door Problem", "Pending", "Salman Ali", "134 OMR"],
  ["IS124345", "Drain Slow", "Plumbing Issue", "Repaired", "Salman Ali", "457 OMR"],
  ["IS124345", "Sink Issue", "Kitchen Issue", "Pending", "Imran Khan", "425 OMR"],
  ["IS124345", "General Cleaning", "Other Issues", "Repaired", "Ramesh Kumar", "250 OMR"],
];

const repairSummary = [
  ["Approved", "82.00%", "#5cc481"],
  ["Pending", "42.00%", "#5c45df"],
  ["Repaired", "12.00%", "#f49345"],
  ["No Action", "06.00%", "#edf049"],
];

const approvalItems = [
  ["Recommended By", "Ramesh Kumar"],
  ["Approved By", "Ajay Sharma"],
  ["Approved On", "29"],
  ["Overall Status", "01:45 Hrs"],
];

const pendingRepairs = [
  ["Kitchen Cabinet & Door Hinge", "A-401, Ocean View", "Low"],
  ["Balcony Door Locked", "A-401, Ocean View", "High"],
  ["Sink Minor Issue", "A-401, Ocean View", "High"],
  ["Leakage Isssue", "A-401, Ocean View", "High"],
];

const documents = [
  ["Repair Estimate .pdf", "Uploaded on 15 April 2026"],
  ["Repair Approval .pdf", "Uploaded on 15 April 2026"],
  ["CostSummary .pdf", "Uploaded on 15 April 2026"],
];

const photos = [avatar, property2, property3, property4, property5, property6, property7];

const resolvedIssues = [
  ["Loose Switch Board", "Electrical Fittings", property4],
  ["Kitchen Cabinet Door Hinge Loose", "Electrical Fittings", property3],
  ["Ceiling Paint Patch Required", "Electrical Fittings", property2],
];

const cardStyle = {
  border: "1px solid #cfd7df",
  borderRadius: 8,
  overflow: "hidden",
};

const titleStyle = {
  background: "#fbfcfd",
  color: pageText,
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
  padding: "20px 30px",
};

const linkButtonStyle = {
  background: "transparent",
  border: 0,
  color: "#1f7ee8",
  fontSize: 16,
};

const infoRowStyle = {
  display: "grid",
  gridTemplateColumns: "220px 20px 1fr",
  minHeight: 40,
};

const RepairDamagePage = () => {
  return (
    <div style={{ padding: 24 }}>
      {/* ── Row 1: Issue Table (left, wide) + Repair Summary & Approval (right, stacked) ── */}
      <div
        style={{
          alignItems: "start",
          display: "grid",
          gap: 24,
          gridTemplateColumns: "minmax(650px, 1.7fr) minmax(430px, 1fr)",
          marginBottom: 24,
        }}
      >
        {/* Issue Table */}
        <div style={cardStyle}>
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ background: "#fbfcfd" }}
          >
            <h5 style={titleStyle}>Repair &amp; Damage Items</h5>
            <input
              placeholder="Search"
              style={{
                border: 0,
                borderRadius: 4,
                boxShadow: "0 8px 18px rgba(15, 23, 42, 0.06)",
                color: pageText,
                height: 39,
                marginRight: 14,
                outline: 0,
                padding: "0 15px",
                width: 325,
              }}
            />
          </div>

          <div style={{ padding: "18px 24px 18px" }}>
            <div
              style={{
                border: "1px solid #eef1f4",
                borderRadius: 8,
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  minWidth: 880,
                  width: "100%",
                }}
              >
                <thead>
                  <tr style={{ background: "#fbfcfd" }}>
                    {["Issue ID", "Category", "Issue Description", "Status", "Assigned To", "Cost", "Actions"].map(
                      (head) => (
                        <th
                          key={head}
                          style={{
                            color: pageText,
                            fontSize: 15,
                            fontWeight: 700,
                            padding: "13px 18px",
                            textAlign: "left",
                          }}
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {issueRows.map(([id, category, description, status, assignedTo, cost]) => (
                    <tr key={`${category}-${description}`}>
                      <td style={{ color: pageText, fontSize: 15, padding: "9px 18px" }}>
                        <IconifyIcon
                          icon="ri:checkbox-circle-line"
                          width={16}
                          height={16}
                          style={{ color: "#2f7ee6", marginRight: 11 }}
                        />
                        {id}
                      </td>
                      {[category, description, status, assignedTo, cost].map((value) => (
                        <td key={value} style={{ color: pageText, fontSize: 15, padding: "9px 18px" }}>
                          {value}
                        </td>
                      ))}
                      <td style={{ padding: "9px 18px" }}>
                        <button
                          type="button"
                          style={{
                            background: "transparent",
                            border: 0,
                            color: pageText,
                            padding: 0,
                            textDecoration: "underline",
                          }}
                        >
                          view
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: Repair Summary + Approval Summary stacked */}
        <div style={{ display: "grid", gap: 20 }}>
          {/* Repair Summary */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Repair Summary</h5>
            <div
              className="d-flex align-items-center justify-content-center gap-6"
              style={{ padding: "26px 34px 38px" }}
            >
              <div
                style={{
                  background:
                    "conic-gradient(#5cc481 0 58%, #5c45df 58% 82%, #f49345 82% 95%, #edf049 95% 100%)",
                  borderRadius: "50%",
                  flex: "0 0 auto",
                  height: 198,
                  position: "relative",
                  width: 198,
                }}
              >
                <span
                  style={{
                    background: "#fff",
                    borderRadius: "50%",
                    height: 114,
                    left: 42,
                    position: "absolute",
                    top: 42,
                    width: 114,
                  }}
                />
              </div>
              <div style={{ minWidth: 220 }}>
                {repairSummary.map(([label, value, color]) => (
                  <div
                    key={label}
                    className="d-flex align-items-center justify-content-between gap-4 mb-4"
                  >
                    <span
                      className="d-inline-flex align-items-center gap-3"
                      style={{ color: "#7c8ca1", fontSize: 16, fontWeight: 700 }}
                    >
                      <span
                        style={{
                          background: color,
                          borderRadius: "50%",
                          display: "inline-block",
                          height: 15,
                          width: 15,
                        }}
                      />
                      {label}
                    </span>
                    <span style={{ color: bodyText, fontSize: 16 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Approval Summary */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Approval Summary</h5>
            <div style={{ padding: "26px 74px 18px" }}>
              {approvalItems.map(([label, value]) => (
                <div key={label} style={infoRowStyle}>
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 16 }}>:</span>
                  <span style={{ color: pageText, fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Left (Repaired Photos + Notes) | Right (Pending Repairs + Documents) ── */}
      <div
        style={{
          alignItems: "start",
          display: "grid",
          gap: 24,
          gridTemplateColumns: "minmax(650px, 1.7fr) minmax(430px, 1fr)",
        }}
      >
        {/* Left column: Repaired Photos + Notes/Comments */}
        <div style={{ display: "grid", gap: 24 }}>
          {/* Repaired Photos */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Repaired Photos</h5>
            <div style={{ padding: "26px 30px 24px" }}>
              <div
                className="d-flex gap-4 mb-4"
                style={{ overflowX: "auto", paddingBottom: 4 }}
              >
                {photos.map((photo) => (
                  <img
                    key={photo}
                    alt="Repair"
                    src={photo}
                    style={{
                      borderRadius: 8,
                      flex: "0 0 auto",
                      height: 78,
                      objectFit: "cover",
                      width: 110,
                    }}
                  />
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                  Recent Resolved Issues
                </h6>
                <button type="button" style={linkButtonStyle}>
                  View All
                </button>
              </div>

              {resolvedIssues.map(([title, category, image]) => (
                <div
                  key={title}
                  className="d-flex align-items-center justify-content-between mb-3"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      alt={title}
                      src={image}
                      style={{ height: 32, objectFit: "cover", width: 32 }}
                    />
                    <div>
                      <p className="mb-1" style={{ color: pageText, fontSize: 15 }}>{title}</p>
                      <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>{category}</p>
                    </div>
                  </div>
                  <span style={{ color: pageText, fontSize: 16 }}>Done</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes / Comments */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Notes / Comments</h5>
            <div style={{ padding: "26px 16px 18px" }}>
              <div
                style={{
                  background: "#fff6f6",
                  border: "1px solid #f1d8d8",
                  borderRadius: 8,
                  color: pageText,
                  padding: "14px 16px",
                }}
              >
                <h6
                  style={{
                    color: pageText,
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 18,
                  }}
                >
                  Notes
                </h6>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    color: "#666",
                    fontSize: 15,
                    padding: "22px 20px",
                  }}
                >
                  All Repair &amp; Damage Inspection are captured Successfully. Almost No Issues Are Found.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Pending Repairs + Document & Files */}
        <div style={{ display: "grid", gap: 24 }}>
          {/* Pending Repairs */}
          <div style={cardStyle}>
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ background: "#fbfcfd" }}
            >
              <h5 style={titleStyle}>Pending Repairs</h5>
              <button type="button" style={{ ...linkButtonStyle, paddingRight: 26 }}>
                View All
              </button>
            </div>
            <div style={{ padding: "16px 42px 2px" }}>
              {pendingRepairs.map(([title, location, priority]) => (
                <div
                  key={title}
                  className="d-flex align-items-center justify-content-between gap-3 mb-3"
                >
                  <div className="d-flex align-items-center gap-4">
                    <span
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        background: "#f2c155",
                        borderRadius: "50%",
                        color: "#fff",
                        fontWeight: 800,
                        height: 22,
                        width: 22,
                      }}
                    >
                      !
                    </span>
                    <div>
                      <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>{title}</p>
                      <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>{location}</p>
                    </div>
                  </div>
                  <span style={{ color: "#bd2d3a", fontSize: 15 }}>{priority}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Document & Files */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Document &amp; Files</h5>
            <div style={{ padding: "18px 24px 6px" }}>
              {documents.map(([name, date]) => (
                <div key={name} className="d-flex align-items-center gap-4 mb-3">
                  <span
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{
                      border: "1px solid #eef1f4",
                      borderRadius: 5,
                      height: 50,
                      width: 50,
                    }}
                  >
                    <IconifyIcon icon="vscode-icons:file-type-pdf2" width={28} height={28} />
                  </span>
                  <div>
                    <p className="mb-1" style={{ color: bodyText, fontSize: 16, fontWeight: 600 }}>
                      {name}
                    </p>
                    <p className="mb-0" style={{ color: bodyText, fontSize: 14 }}>
                      {date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairDamagePage;