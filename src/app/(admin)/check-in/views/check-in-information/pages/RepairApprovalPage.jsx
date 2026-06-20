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

const stats = [
  {
    label: "Total Issues",
    value: "16",
    icon: "solar:calendar-date-bold-duotone",
    color: "#6747ff",
    bg: "#eee7ff",
  },
  {
    label: "Pending Repairs",
    value: "12",
    badge: "+44%",
    icon: "solar:gallery-check-bold-duotone",
    color: "#47c878",
    bg: "#e9f8ef",
  },
  {
    label: "Repaired",
    value: "2",
    icon: "solar:user-plus-bold-duotone",
    color: "#ff8d3c",
    bg: "#fff0e8",
  },
  {
    label: "Approved",
    value: "3",
    icon: "solar:chart-2-bold-duotone",
    color: "#36c8cf",
    bg: "#e8fbfb",
  },
];

const issueRows = [
  [
    "IS124345",
    "Electrical Fittings",
    "Loose switch",
    "Required",
    "Ramesh Kumar",
    "29 May 2026",
  ],
  [
    "IS124345",
    "Kitchen Cabinet Door",
    "Door hinge problem",
    "Pending",
    "Imran Khan",
    "29 May 2026",
  ],
  [
    "IS124345",
    "Ceiling Paint Patch",
    "Pain rework",
    "Repaired",
    "Ramesh Kumar",
    "29 May 2026",
  ],
  [
    "IS124345",
    "Tap Leaking",
    "Tap Issue",
    "Repaired",
    "Ramesh Kumar",
    "29 May 2026",
  ],
  [
    "IS124345",
    "Balcony Door Lock",
    "Door Problem",
    "Pending",
    "Salman Ali",
    "29 May 2026",
  ],
  [
    "IS124345",
    "Drain Slow",
    "Plumbing Issue",
    "Repaired",
    "Salman Ali",
    "29 May 2026",
  ],
  [
    "IS124345",
    "Sink Issue",
    "Kitchen Issue",
    "Pending",
    "Imran Khan",
    "29 May 2026",
  ],
  [
    "IS124345",
    "General Cleaning",
    "Other Issues",
    "Repaired",
    "Ramesh Kumar",
    "29 May 2026",
  ],
];

const summaryItems = [
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

const photos = [
  avatar,
  property2,
  property3,
  property4,
  property5,
  property6,
  property7,
];

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
  color: pageText,
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
  padding: "22px 30px",
};

const summaryTitleStyle = {
  ...titleStyle,
  background: "#f8fafc",
  borderBottom: "1px solid #eef1f5",
};

const commentBoxStyle = {
  background: "#f7f7f7",
  borderRadius: 7,
  boxShadow: "0 8px 20px rgba(82, 107, 137, 0.12)",
  color: pageText,
  fontSize: 15,
  lineHeight: 1.45,
  margin: "8px -32px 0",
  padding: "15px 34px",
};

const StatCard = ({ stat }) => (
  <div
    style={{
      alignItems: "center",
      background: "#fff",
      borderRadius: 5,
      boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
      display: "flex",
      justifyContent: "space-between",
      minHeight: 98,
      padding: "20px 20px",
    }}
  >
    <div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <span style={{ color: pageText, fontSize: 15 }}>{stat.label}</span>
        {stat.badge && (
          <span
            style={{
              background: "#d6f6df",
              borderRadius: 4,
              color: "#48bd70",
              fontSize: 12,
              fontWeight: 700,
              padding: "2px 7px",
            }}
          >
            {stat.badge}
          </span>
        )}
      </div>
      <strong style={{ color: bodyText, fontSize: 26 }}>{stat.value}</strong>
    </div>
    <span
      className="d-inline-flex align-items-center justify-content-center"
      style={{
        background: stat.bg,
        borderRadius: 5,
        color: stat.color,
        height: 56,
        width: 56,
      }}
    >
      <IconifyIcon icon={stat.icon} width={32} height={32} />
    </span>
  </div>
);

const RepairApprovalPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          background: "#edf2f8",
          borderRadius: 8,
          marginBottom: 24,
          padding: "26px 25px",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
          }}
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "minmax(650px, 1.7fr) minmax(390px, 1fr)",
        }}
      >
        <div>
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>Issue List</h5>
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

            <div style={{ padding: "34px 18px 16px" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr style={{ background: "#fbfcfd" }}>
                    {[
                      "Issue ID",
                      "Category",
                      "Issue Description",
                      "Status",
                      "Assigned To",
                      "Target Date",
                      "Actions",
                    ].map((head) => (
                      <th
                        key={head}
                        style={{
                          color: pageText,
                          fontSize: 16,
                          fontWeight: 700,
                          padding: "20px 24px",
                          textAlign: "left",
                        }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {issueRows.map(
                    ([id, category, description, status, assignedTo, date]) => (
                      <tr key={`${category}-${description}`}>
                        <td
                          style={{
                            color: pageText,
                            fontSize: 15,
                            padding: "16px 24px",
                          }}
                        >
                          <IconifyIcon
                            icon="ri:checkbox-circle-line"
                            width={16}
                            height={16}
                            style={{ color: "#2f7ee6", marginRight: 12 }}
                          />
                          {id}
                        </td>
                        {[category, description, status, assignedTo, date].map(
                          (value) => (
                            <td
                              key={value}
                              style={{
                                color: pageText,
                                fontSize: 15,
                                padding: "16px 24px",
                              }}
                            >
                              {value}
                            </td>
                          ),
                        )}
                        <td style={{ padding: "16px 24px" }}>
                          <button
                            type="button"
                            style={{
                              background: "transparent",
                              border: 0,
                              color: pageText,
                              textDecoration: "underline",
                            }}
                          >
                            view
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Repaired Photos</h5>
            <div style={{ padding: "0 26px 24px" }}>
              <div className="d-flex gap-3 mb-3">
                {photos.map((photo) => (
                  <img
                    key={photo}
                    alt="Repair"
                    src={photo}
                    style={{
                      borderRadius: 8,
                      height: 78,
                      objectFit: "cover",
                      width: 110,
                    }}
                  />
                ))}
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6
                  className="mb-0"
                  style={{ color: pageText, fontSize: 16, fontWeight: 700 }}
                >
                  Recent Resolved Issues
                </h6>
                <button
                  type="button"
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "#1f7ee8",
                    fontSize: 16,
                  }}
                >
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
                      <p
                        className="mb-1"
                        style={{ color: pageText, fontSize: 15 }}
                      >
                        {title}
                      </p>
                      <p
                        className="mb-0"
                        style={{ color: pageText, fontSize: 15 }}
                      >
                        {category}
                      </p>
                    </div>
                  </div>
                  <span style={{ color: pageText, fontSize: 16 }}>Done</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={summaryTitleStyle}>Approval Summary</h5>
            <div style={{ padding: "5px 48px 12px" }}>
              {summaryItems.map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "220px 20px 1fr",
                    minHeight: 45,
                  }}
                >
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 16 }}>:</span>
                  <span style={{ color: pageText, fontSize: 16 }}>{value}</span>
                </div>
              ))}
              <p
                style={{ color: pageText, fontSize: 16, margin: "8px 0 14px" }}
              >
                Inspector Comments:
              </p>
              <div style={commentBoxStyle}>
                Most of the issues are resolved. Minor Maintenance are pending.
                Overall Condition is Good
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 style={titleStyle}>Pending Repairs</h5>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: 0,
                  color: "#1f7ee8",
                  fontSize: 16,
                  paddingRight: 26,
                }}
              >
                View All
              </button>
            </div>
            <div style={{ padding: "18px 42px 22px" }}>
              {pendingRepairs.map(([title, location, priority]) => (
                <div
                  key={title}
                  className="d-flex align-items-center justify-content-between gap-3 mb-4"
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
                      <p
                        className="mb-2"
                        style={{ color: pageText, fontSize: 15 }}
                      >
                        {title}
                      </p>
                      <p
                        className="mb-0"
                        style={{ color: pageText, fontSize: 15 }}
                      >
                        {location}
                      </p>
                    </div>
                  </div>
                  <span style={{ color: "#bd2d3a", fontSize: 15 }}>
                    {priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairApprovalPage;
