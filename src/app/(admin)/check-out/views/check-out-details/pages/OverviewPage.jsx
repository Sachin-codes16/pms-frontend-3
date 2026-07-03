import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { fmtDateTime } from "@/utils/checkInFormat";

const pageText = "#526b89";
const bodyText = "#303746";

const STAT_FIELDS = [
  { key: "inspectionStatus", label: "Inspection",      icon: "solar:calendar-date-bold-duotone", color: "#6747ff", bg: "#eee7ff" },
  { key: "repairDamageItems", label: "Repair & Damage", icon: "solar:gallery-check-bold-duotone", color: "#47c878", bg: "#e9f8ef", suffix: " Items" },
  { key: "utilityCharges",   label: "Utility Charges", icon: "solar:user-plus-bold-duotone",     color: "#ff8d3c", bg: "#fff0e8", prefix: "OMR " },
  { key: "outstanding",      label: "Outstanding",     icon: "solar:chart-2-bold-duotone",       color: "#36c8cf", bg: "#e8fbfb", prefix: "OMR " },
];

const STEP_ICONS = [
  "noto:clipboard", "noto:spiral-notepad", "noto:crossed-swords",
  "noto:gear", "noto:money-bag", "noto:key", "ri:checkbox-circle-fill",
];

const STEP_BACKGROUNDS = [
  "#dff9ff", "#eee4ff", "#ffd9d9", "#d7ffe0", "#ffd9ff", "#ffe9cc", "#ffe9cc",
];

const STEP_COLORS = [
  "#0f4f99", "#6b178e", "#1c6f11", "#984000", "#a10e36", "#16831d", "#16831d",
];

const cardStyle = { border: "1px solid #cfd7df", borderRadius: 8, overflow: "hidden" };

const titleStyle = { color: pageText, fontSize: 16, fontWeight: 700, margin: 0, padding: "22px 30px" };

const summaryTitleStyle = { ...titleStyle, background: "#f8fafc", borderBottom: "1px solid #eef1f5" };

const commentBoxStyle = {
  background: "#f7f7f7", borderRadius: 7, boxShadow: "0 8px 20px rgba(82,107,137,0.12)",
  color: pageText, fontSize: 15, lineHeight: 1.45, margin: "8px -42px 0", padding: "15px 34px",
};

const StatCard = ({ label, value, icon, color, bg }) => (
  <div style={{
    alignItems: "center", background: "#fff", borderRadius: 5,
    boxShadow: "0 8px 18px rgba(15,23,42,0.08)", display: "flex",
    justifyContent: "space-between", minHeight: 98, padding: "20px",
  }}>
    <div>
      <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>{label}</p>
      <strong style={{ color: bodyText, fontSize: 26 }}>{value}</strong>
    </div>
    <span className="d-inline-flex align-items-center justify-content-center"
      style={{ background: bg, borderRadius: 5, color, height: 56, width: 56 }}>
      <IconifyIcon icon={icon} width={32} height={32} />
    </span>
  </div>
);

const DetailRows = ({ items, boldLast = false }) => (
  <div>
    {items.map(([label, value], index) => {
      const isBold = boldLast && index >= items.length - 3;
      return (
        <div key={label} style={{ display: "grid", gridTemplateColumns: "210px 20px 1fr", minHeight: 40 }}>
          <span style={{ color: pageText, fontSize: 16, fontWeight: isBold ? 700 : 400 }}>{label}</span>
          <span style={{ color: pageText, fontSize: 16 }}>:</span>
          <span style={{ color: pageText, fontSize: 16, fontWeight: isBold ? 700 : 400 }}>{value ?? "—"}</span>
        </div>
      );
    })}
  </div>
);

const fmt = (v, prefix = "", suffix = "") =>
  v === null || v === undefined || v === "" ? "—" : `${prefix}${v}${suffix}`;

const OverviewPage = ({ record }) => {
  const overview = record?.overview ?? {};
  const cards    = overview.summaryCards ?? {};
  const pipeline = overview.progressPipeline ?? [];
  const progress = overview.overallProgress ?? 0;
  const timeline = overview.activityTimeline ?? [];
  const insp     = overview.inspectionSummary ?? {};
  const fin      = overview.financialSummary ?? {};
  const keyInfo  = record?.keyReturn?.keyReturnInformation ?? {};
  const notes    = record?.remarksNotes ?? record?.internalComments ?? "";

  const financialRows = [
    ["Outstanding Rent",  fmt(fin.outstandingRent)],
    ["Utility Charges",   fmt(fin.utilityCharges)],
    ["Damage Charges",    fmt(fin.damageCharges)],
    ["Other Charges",     fmt(fin.otherCharges)],
    ["Total Deductions",  fmt(fin.totalDeductions)],
    ["Security Deposit",  fmt(fin.securityDeposit)],
    ["Refundable Amount", fmt(fin.refundableAmount)],
  ];

  const inspRows = [
    ["Inspection Date",   insp.inspectionDate ? String(insp.inspectionDate).split("T")[0] : "—"],
    ["Inspector",         insp.inspector || "—"],
    ["Status",            insp.status || "—"],
    ["Overall Condition", insp.overallCondition || "—"],
  ];

  const keyRows = [
    ["Key Return Status", keyInfo.keyReturnStatus || "—"],
    ["Keys to Return",    String(keyInfo.totalKeys ?? record?.keyReturn?.summaryCards?.totalKeysIssued ?? "—")],
    ["Received By",       keyInfo.receivedBy || "—"],
    ["Return Date",       keyInfo.keyReturnDate ? String(keyInfo.keyReturnDate).split("T")[0] : "—"],
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Stat cards */}
      <div style={{ background: "#edf2f8", borderRadius: 8, marginBottom: 24, padding: "26px 25px" }}>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(4, minmax(220px, 1fr))" }}>
          {STAT_FIELDS.map((f) => (
            <StatCard
              key={f.key}
              label={f.label}
              icon={f.icon}
              color={f.color}
              bg={f.bg}
              value={fmt(cards[f.key], f.prefix ?? "", f.suffix ?? "")}
            />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(650px, 1.7fr) minmax(390px, 1fr)" }}>
        <div>
          {/* Progress pipeline */}
          <div className="mb-4" style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ borderBottom: "1px solid #e5e7ea" }}>
              <h5 style={titleStyle}>Check-Out Progress</h5>
              <button type="button" style={{
                background: "#fff", border: "1px solid #e5e7ea", borderRadius: 5,
                boxShadow: "0 4px 10px rgba(15,23,42,0.08)", color: pageText,
                height: 40, marginRight: 20, width: 125,
              }}>
                This Month
              </button>
            </div>

            <div style={{ padding: "52px 28px 34px" }}>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(pipeline.length, 1)}, 1fr)`, position: "relative" }}>
                <span style={{
                  background: "#d8d8d8", height: 2, left: "6%", position: "absolute",
                  right: "6%", top: 31, zIndex: 0,
                }} />
                {pipeline.map(({ stage, status }, index) => (
                  <div key={stage} className="text-center" style={{ position: "relative", zIndex: 1 }}>
                    <span className="d-inline-flex align-items-center justify-content-center" style={{
                      background: STEP_BACKGROUNDS[index % STEP_BACKGROUNDS.length],
                      borderRadius: "50%", height: 60, marginBottom: 12, width: 60,
                    }}>
                      <span className="d-inline-flex align-items-center justify-content-center"
                        style={{ background: "#fff", borderRadius: "50%", height: 35, width: 35 }}>
                        <IconifyIcon icon={STEP_ICONS[index % STEP_ICONS.length]} width={24} height={24} />
                      </span>
                    </span>
                    <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>{stage}</p>
                    <strong style={{ color: status === "completed" ? "#16831d" : "#f2a24d", fontSize: 15 }}>
                      {status === "completed" ? "Done" : "Pending"}
                    </strong>
                  </div>
                ))}
              </div>

              <div style={{ alignItems: "center", display: "grid", gap: 22, gridTemplateColumns: "150px 1fr 140px", marginTop: 54 }}>
                <strong style={{ color: pageText, fontSize: 16 }}>Overall Progress</strong>
                <span style={{ background: "#d8d8d8", borderRadius: 999, height: 10, overflow: "hidden" }}>
                  <span style={{ background: "#6f95d2", borderRadius: 999, display: "block", height: "100%", width: `${progress}%` }} />
                </span>
                <strong style={{ color: pageText, fontSize: 16 }}>{progress}% Completed</strong>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={summaryTitleStyle}>Activity Timeline</h5>
            <div style={{ padding: "20px 34px 26px" }}>
              {timeline.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>No activity yet.</p>
              ) : timeline.map(({ event, description, timestamp }, index) => (
                <div key={event ?? index} style={{ display: "grid", gap: 20, gridTemplateColumns: "30px 1fr 210px", minHeight: 75, position: "relative" }}>
                  {index < timeline.length - 1 && (
                    <span style={{ background: "#e1e1e1", height: 75, left: 14, position: "absolute", top: 25, width: 1 }} />
                  )}
                  <span style={{
                    background: ["#d8f6dc","#f5f3d8","#dce9fb","#ead9f8"][index % 4],
                    borderRadius: 5, height: 30, position: "relative", width: 30, zIndex: 1,
                  }} />
                  <div>
                    <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>{event}</p>
                    <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>{description}</p>
                  </div>
                  <span style={{ color: pageText, fontSize: 15 }}>{fmtDateTime(timestamp)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={cardStyle}>
            <h5 style={summaryTitleStyle}>Notes / Comments</h5>
            <div style={{ padding: "42px 18px 18px" }}>
              <div style={{ background: "#fff7f7", border: "1px solid #f0cfd0", borderRadius: 8, padding: "14px 16px" }}>
                <p style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Notes</p>
                <div style={{ background: "#fff", borderRadius: 8, color: "#666", fontSize: 15, padding: "24px 22px" }}>
                  {notes || "No notes added."}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Inspection Summary */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={summaryTitleStyle}>Inspection Summary</h5>
            <div style={{ padding: "22px 58px 10px" }}>
              <DetailRows items={inspRows} />
              <p style={{ color: pageText, fontSize: 16, margin: "8px 0 14px" }}>Inspector Comments:</p>
              <div style={commentBoxStyle}>
                {insp.inspectorComments || "No comments added."}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={summaryTitleStyle}>Financial Summary</h5>
            <div style={{ padding: "22px 74px 28px" }}>
              <DetailRows items={financialRows} boldLast />
            </div>
          </div>

          {/* Key Return */}
          <div style={cardStyle}>
            <h5 style={summaryTitleStyle}>Key Return</h5>
            <div style={{ padding: "22px 74px 28px" }}>
              <DetailRows items={keyRows} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
