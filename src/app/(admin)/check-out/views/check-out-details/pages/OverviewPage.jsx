import IconifyIcon from "@/components/wrappers/IconifyIcon";

const pageText = "#526b89";
const bodyText = "#303746";

const stats = [
  {
    label: "Inspection",
    value: "Completed",
    icon: "solar:calendar-date-bold-duotone",
    color: "#6747ff",
    bg: "#eee7ff",
  },
  {
    label: "Repair & Damage",
    value: "2 Items",
    icon: "solar:gallery-check-bold-duotone",
    color: "#47c878",
    bg: "#e9f8ef",
  },
  {
    label: "Utility Charges",
    value: "OMR 1962",
    icon: "solar:user-plus-bold-duotone",
    color: "#ff8d3c",
    bg: "#fff0e8",
  },
  {
    label: "Outstanding",
    value: "OMR 1234",
    icon: "solar:chart-2-bold-duotone",
    color: "#36c8cf",
    bg: "#e8fbfb",
  },
];

const progressSteps = [
  ["Request Raised", "24", "#0f4f99", "noto:clipboard"],
  ["Inspection", "14", "#6b178e", "noto:spiral-notepad"],
  ["Repair & Damage", "8", "#1c6f11", "noto:crossed-swords"],
  ["Utility Reading", "10", "#984000", "noto:gear"],
  ["Settlement", "6", "#a10e36", "noto:money-bag"],
  ["Key Return", "12", "#16831d", "noto:key"],
  ["Completed", "12", "#16831d", "ri:checkbox-circle-fill"],
];

const inspectionSummary = [
  ["Inspection Date", "29 May 2026"],
  ["Inspector", "Ajay Sharma"],
  ["Status", "Completed"],
  ["Overall Condition", "Good"],
];

const timelineItems = [
  [
    "Inspection Completed",
    "Inspection has been completed by Ramesh Kumar",
    "29 May 2026, 02:35 PM",
    "#d8f6dc",
  ],
  [
    "Utility Readings Captured",
    "Utility Readings were recorded",
    "29 May 2026, 02:35 PM",
    "#f5f3d8",
  ],
  [
    "Repair & Damage Added",
    "2 repair & damage items added",
    "29 May 2026, 02:35 PM",
    "#dce9fb",
  ],
  [
    "Check-Out Requested",
    "Check-Out request was raised by Bilal Ahmed",
    "29 May 2026, 02:35 PM",
    "#ead9f8",
  ],
];

const financialSummary = [
  ["Outstanding Rent", "250.00 OMR"],
  ["Utility Charges", "150.00 OMR"],
  ["Damage Charges", "350.00 OMR"],
  ["Other Charges", "250.00 OMR"],
  ["Total Deductions", "452.00 OMR"],
  ["Security Deposit", "550.00 OMR"],
  ["Refundable Amount", "130.00 OMR"],
];

const keyReturn = [
  ["Key Return Status", "Pending"],
  ["Keys to Return", "2"],
  ["Received By", "Bilal Ahmed"],
  ["Return Date", "12 Aug 2026"],
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
  margin: "8px -42px 0",
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
      <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>
        {stat.label}
      </p>
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

const DetailRows = ({ items, boldLast = false }) => (
  <div>
    {items.map(([label, value], index) => {
      const isBold = boldLast && index >= items.length - 3;

      return (
        <div
          key={label}
          style={{
            display: "grid",
            gridTemplateColumns: "210px 20px 1fr",
            minHeight: 40,
          }}
        >
          <span
            style={{
              color: pageText,
              fontSize: 16,
              fontWeight: isBold ? 700 : 400,
            }}
          >
            {label}
          </span>
          <span style={{ color: pageText, fontSize: 16 }}>:</span>
          <span
            style={{
              color: pageText,
              fontSize: 16,
              fontWeight: isBold ? 700 : 400,
            }}
          >
            {value}
          </span>
        </div>
      );
    })}
  </div>
);

const OverviewPage = () => {
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
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ borderBottom: "1px solid #e5e7ea" }}
            >
              <h5 style={titleStyle}>Check-Out Progress</h5>
              <button
                type="button"
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7ea",
                  borderRadius: 5,
                  boxShadow: "0 4px 10px rgba(15, 23, 42, 0.08)",
                  color: pageText,
                  height: 40,
                  marginRight: 20,
                  width: 125,
                }}
              >
                This Month
              </button>
            </div>

            <div style={{ padding: "52px 28px 34px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    background: "#d8d8d8",
                    height: 2,
                    left: "6%",
                    position: "absolute",
                    right: "6%",
                    top: 31,
                    zIndex: 0,
                  }}
                />
                {progressSteps.map(([label, value, color, icon], index) => (
                  <div
                    key={label}
                    className="text-center"
                    style={{ position: "relative", zIndex: 1 }}
                  >
                    <span
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        background: [
                          "#dff9ff",
                          "#eee4ff",
                          "#ffd9d9",
                          "#d7ffe0",
                          "#ffd9ff",
                          "#ffe9cc",
                          "#ffe9cc",
                        ][index],
                        borderRadius: "50%",
                        height: 60,
                        marginBottom: 12,
                        width: 60,
                      }}
                    >
                      <span
                        className="d-inline-flex align-items-center justify-content-center"
                        style={{
                          background: "#fff",
                          borderRadius: "50%",
                          height: 35,
                          width: 35,
                        }}
                      >
                        <IconifyIcon icon={icon} width={24} height={24} />
                      </span>
                    </span>
                    <p
                      className="mb-2"
                      style={{ color: pageText, fontSize: 15 }}
                    >
                      {label}
                    </p>
                    <strong style={{ color, fontSize: 18 }}>{value}</strong>
                  </div>
                ))}
              </div>

              <div
                style={{
                  alignItems: "center",
                  display: "grid",
                  gap: 22,
                  gridTemplateColumns: "150px 1fr 140px",
                  marginTop: 54,
                }}
              >
                <strong style={{ color: pageText, fontSize: 16 }}>
                  Overall Progress
                </strong>
                <span
                  style={{
                    background: "#d8d8d8",
                    borderRadius: 999,
                    height: 10,
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      background: "#6f95d2",
                      borderRadius: 999,
                      display: "block",
                      height: "100%",
                      width: "65%",
                    }}
                  />
                </span>
                <strong style={{ color: pageText, fontSize: 16 }}>
                  65% Completed
                </strong>
              </div>
            </div>
          </div>

          <div className="mb-4" style={cardStyle}>
            <h5 style={summaryTitleStyle}>Activity Timeline</h5>
            <div style={{ padding: "20px 34px 26px" }}>
              {timelineItems.map(([title, description, date, color], index) => (
                <div
                  key={title}
                  style={{
                    display: "grid",
                    gap: 20,
                    gridTemplateColumns: "30px 1fr 210px",
                    minHeight: 75,
                    position: "relative",
                  }}
                >
                  {index < timelineItems.length - 1 && (
                    <span
                      style={{
                        background: "#e1e1e1",
                        height: 75,
                        left: 14,
                        position: "absolute",
                        top: 25,
                        width: 1,
                      }}
                    />
                  )}
                  <span
                    style={{
                      background: color,
                      borderRadius: 5,
                      height: 30,
                      position: "relative",
                      width: 30,
                      zIndex: 1,
                    }}
                  />
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
                      {description}
                    </p>
                  </div>
                  <span style={{ color: pageText, fontSize: 15 }}>{date}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h5 style={summaryTitleStyle}>Notes / Comments</h5>
            <div style={{ padding: "42px 18px 18px" }}>
              <div
                style={{
                  background: "#fff7f7",
                  border: "1px solid #f0cfd0",
                  borderRadius: 8,
                  padding: "14px 16px",
                }}
              >
                <p
                  style={{
                    color: pageText,
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 18,
                  }}
                >
                  Notes
                </p>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    color: "#666",
                    fontSize: 15,
                    padding: "24px 22px",
                  }}
                >
                  All Utilities Readings are captured Successfully. No Issues
                  Are Found.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={summaryTitleStyle}>Inspection Summary</h5>
            <div style={{ padding: "22px 58px 10px" }}>
              <DetailRows items={inspectionSummary} />
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

          <div className="mb-4" style={cardStyle}>
            <h5 style={summaryTitleStyle}>Financial Summary</h5>
            <div style={{ padding: "22px 74px 28px" }}>
              <DetailRows items={financialSummary} boldLast />
            </div>
          </div>

          <div style={cardStyle}>
            <h5 style={summaryTitleStyle}>Key Return</h5>
            <div style={{ padding: "22px 74px 28px" }}>
              <DetailRows items={keyReturn} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
