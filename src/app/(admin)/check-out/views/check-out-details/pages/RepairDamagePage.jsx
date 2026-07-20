import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { resolvePhotoSrc } from "@/utils/imageStorage";
import { fmtDate, val } from "@/utils/checkInFormat";

const pageText = "#526b89";
const bodyText  = "#303746";

const cardStyle = { border: "1px solid #cfd7df", borderRadius: 8, overflow: "hidden" };
const titleStyle = { background: "#fbfcfd", color: pageText, fontSize: 16, fontWeight: 700, margin: 0, padding: "20px 30px" };
const linkButtonStyle = { background: "transparent", border: 0, color: "#1f7ee8", fontSize: 16 };
const infoRowStyle = { display: "grid", gridTemplateColumns: "220px 20px 1fr", minHeight: 40 };

const STAT_ICONS = [
  "solar:calendar-date-bold-duotone",
  "solar:gallery-check-bold-duotone",
  "solar:user-plus-bold-duotone",
  "solar:chart-2-bold-duotone",
  "solar:chart-2-bold-duotone",
];
const STAT_COLORS = ["#6747ff","#47c878","#ff8d3c","#36c8cf","#f04444"];
const STAT_BGS    = ["#eee7ff","#e9f8ef","#fff0e8","#e8fbfb","#fde8e8"];

const DONUT_COLORS = ["#5cc481","#5c45df","#f49345","#edf049"];
const PRIORITY_COLORS = { High: "#bd2d3a", Medium: "#f2a24d", Low: "#22a06b" };

const StatCard = ({ label, value, icon, color, bg, badge }) => (
  <div style={{
    alignItems: "center", background: "#fff", borderRadius: 5,
    boxShadow: "0 8px 18px rgba(15,23,42,0.08)", display: "flex",
    justifyContent: "space-between", minHeight: 98, padding: "20px",
  }}>
    <div>
      <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>{label}</p>
      <div className="d-flex align-items-center gap-2">
        <strong style={{ color: bodyText, fontSize: 26 }}>{value}</strong>
        {badge && (
          <span style={{ background: "#e8f7ef", borderRadius: 4, color: "#22a06b", fontSize: 12, fontWeight: 700, padding: "2px 6px" }}>
            {badge}
          </span>
        )}
      </div>
    </div>
    <span className="d-inline-flex align-items-center justify-content-center"
      style={{ background: bg, borderRadius: 5, color, height: 56, width: 56 }}>
      <IconifyIcon icon={icon} width={32} height={32} />
    </span>
  </div>
);

const RepairDamagePage = ({ record }) => {
  const rd      = record?.repairDamage ?? {};
  const summary = rd.summary ?? {};
  const issues  = rd.issueList ?? [];
  const appr    = rd.approvalSummary ?? {};
  const pending = rd.pendingRepairs ?? [];
  const photos  = rd.repairedPhotos ?? [];
  const resolved = rd.recentResolvedIssues ?? [];
  const docs    = rd.documents ?? [];
  const notes   = rd.notes ?? record?.remarksNotes ?? "";

  const total    = summary.totalItems ?? 0;
  const approved = summary.approved ?? 0;
  const repair   = summary.repairItems ?? 0;
  const repaired = summary.repairedItems ?? 0;
  const noAction = summary.noActionRequired ?? 0;
  const cost     = summary.estimatedCost ?? 0;

  // Build conic-gradient segments (approved → pending → repaired → no action)
  const pct = (v) => (total > 0 ? Math.round((v / total) * 100) : 0);
  const a = pct(approved), b = pct(repair), c = pct(repaired), dd = pct(noAction);
  const gradient = total > 0
    ? `conic-gradient(${DONUT_COLORS[0]} 0 ${a}%, ${DONUT_COLORS[1]} ${a}% ${a+b}%, ${DONUT_COLORS[2]} ${a+b}% ${a+b+c}%, ${DONUT_COLORS[3]} ${a+b+c}% 100%)`
    : "conic-gradient(#d8d8d8 0 100%)";

  const repairSummaryItems = [
    ["Approved", approved, DONUT_COLORS[0]],
    ["Pending",  repair,   DONUT_COLORS[1]],
    ["Repaired", repaired, DONUT_COLORS[2]],
    ["No Action",noAction, DONUT_COLORS[3]],
  ];

  const approvalRows = [
    ["Recommended By", val(appr.recommendedBy)],
    ["Approved By",    val(appr.approvedBy)],
    ["Approved On",    fmtDate(appr.approvedOn)],
    ["Overall Status", val(appr.overallStatus)],
    ["Landlord Consent",         val(appr.landlordConsent)],
    ["Finance Alert Generated",  val(appr.financeAlertGenerated)],
    ["Quotation Amount",         appr.quotationAmount != null ? `${appr.quotationAmount} OMR` : "—"],
    ["Rent Adjustment",          appr.rentAdjustmentAmount != null ? `${appr.rentAdjustmentAmount} OMR` : "—"],
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Stat cards */}
      <div style={{ background: "#edf2f8", borderRadius: 8, marginBottom: 24, padding: "26px 25px" }}>
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(5, minmax(180px, 1fr))" }}>
          <StatCard label="Total Items"       value={total}    icon={STAT_ICONS[0]} color={STAT_COLORS[0]} bg={STAT_BGS[0]} />
          <StatCard label="Repair Items"      value={repair}   icon={STAT_ICONS[1]} color={STAT_COLORS[1]} bg={STAT_BGS[1]} />
          <StatCard label="Repaired Items"    value={repaired} icon={STAT_ICONS[2]} color={STAT_COLORS[2]} bg={STAT_BGS[2]} />
          <StatCard label="No Action Required" value={noAction} icon={STAT_ICONS[3]} color={STAT_COLORS[3]} bg={STAT_BGS[3]} />
          <StatCard label="Estimated Cost"    value={`${cost} OMR`} icon={STAT_ICONS[4]} color={STAT_COLORS[4]} bg={STAT_BGS[4]} />
        </div>
      </div>

      {/* Row 1: Issue table | Repair Summary + Approval Summary */}
      <div style={{ alignItems: "start", display: "grid", gap: 24, gridTemplateColumns: "minmax(650px, 1.7fr) minmax(430px, 1fr)", marginBottom: 24 }}>

        {/* Issue table */}
        <div style={cardStyle}>
          <div className="d-flex align-items-center justify-content-between" style={{ background: "#fbfcfd" }}>
            <h5 style={titleStyle}>Repair &amp; Damage Items</h5>
            <input placeholder="Search" style={{
              border: 0, borderRadius: 4, boxShadow: "0 8px 18px rgba(15,23,42,0.06)",
              color: pageText, height: 39, marginRight: 14, outline: 0, padding: "0 15px", width: 325,
            }} />
          </div>
          <div style={{ padding: "18px 24px 18px" }}>
            <div style={{ border: "1px solid #eef1f4", borderRadius: 8, overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", minWidth: 880, width: "100%" }}>
                <thead>
                  <tr style={{ background: "#fbfcfd" }}>
                    {["Issue ID","Category","Issue Description","Status","Assigned To","Cost","Actions"].map((h) => (
                      <th key={h} style={{ color: pageText, fontSize: 15, fontWeight: 700, padding: "13px 18px", textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {issues.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ color: pageText, fontSize: 15, padding: "24px", textAlign: "center" }}>
                        No repair &amp; damage items recorded.
                      </td>
                    </tr>
                  ) : issues.map((row, idx) => (
                    <tr key={row.issueId ?? idx}>
                      <td style={{ color: pageText, fontSize: 15, padding: "9px 18px" }}>
                        <IconifyIcon icon="ri:checkbox-circle-line" width={16} height={16} style={{ color: "#2f7ee6", marginRight: 11 }} />
                        {val(row.issueId ?? row.id)}
                      </td>
                      <td style={{ color: pageText, fontSize: 15, padding: "9px 18px" }}>{val(row.category)}</td>
                      <td style={{ color: pageText, fontSize: 15, padding: "9px 18px" }}>{val(row.description ?? row.issueDescription)}</td>
                      <td style={{ color: pageText, fontSize: 15, padding: "9px 18px" }}>{val(row.status)}</td>
                      <td style={{ color: pageText, fontSize: 15, padding: "9px 18px" }}>{val(row.assignedTo)}</td>
                      <td style={{ color: pageText, fontSize: 15, padding: "9px 18px" }}>
                        {row.cost != null ? `${row.cost} OMR` : "—"}
                      </td>
                      <td style={{ padding: "9px 18px" }}>
                        <button type="button" style={{ background: "transparent", border: 0, color: pageText, padding: 0, textDecoration: "underline" }}>
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

        {/* Right: Repair Summary + Approval Summary */}
        <div style={{ display: "grid", gap: 20 }}>
          {/* Donut chart */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Repair Summary</h5>
            <div className="d-flex align-items-center justify-content-center gap-4" style={{ padding: "26px 34px 38px" }}>
              <div style={{ background: gradient, borderRadius: "50%", flex: "0 0 auto", height: 198, position: "relative", width: 198 }}>
                <span style={{ background: "#fff", borderRadius: "50%", height: 114, left: 42, position: "absolute", top: 42, width: 114 }} />
              </div>
              <div style={{ minWidth: 200 }}>
                {repairSummaryItems.map(([label, value, color]) => (
                  <div key={label} className="d-flex align-items-center justify-content-between gap-4 mb-4">
                    <span className="d-inline-flex align-items-center gap-3" style={{ color: "#7c8ca1", fontSize: 16, fontWeight: 700 }}>
                      <span style={{ background: color, borderRadius: "50%", display: "inline-block", height: 15, width: 15 }} />
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
            <div style={{ padding: "26px 42px 18px" }}>
              {approvalRows.map(([label, value]) => (
                <div key={label} style={infoRowStyle}>
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 16 }}>:</span>
                  <span style={{ color: pageText, fontSize: 16 }}>{value || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Repaired Photos + Notes | Pending Repairs + Documents */}
      <div style={{ alignItems: "start", display: "grid", gap: 24, gridTemplateColumns: "minmax(650px, 1.7fr) minmax(430px, 1fr)" }}>

        <div style={{ display: "grid", gap: 24 }}>
          {/* Repaired Photos + Resolved Issues */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Repaired Photos</h5>
            <div style={{ padding: "26px 30px 24px" }}>
              {photos.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>No repaired photos uploaded.</p>
              ) : (
                <div className="d-flex gap-4 mb-4" style={{ overflowX: "auto", paddingBottom: 4 }}>
                  {photos.map((p, i) => (
                    <img key={i} alt="Repair" src={resolvePhotoSrc(p?.photo ?? p)}
                      style={{ borderRadius: 8, flex: "0 0 auto", height: 78, objectFit: "cover", width: 110 }} />
                  ))}
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>Recent Resolved Issues</h6>
                <button type="button" style={linkButtonStyle}>View All</button>
              </div>

              {resolved.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15 }}>No resolved issues recorded.</p>
              ) : resolved.map((issue, i) => {
                const title    = val(issue.title ?? issue.itemName ?? issue.issueDescription);
                const category = val(issue.category);
                const photo    = issue.photo;
                return (
                  <div key={i} className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {photo ? (
                        <img alt={title} src={resolvePhotoSrc(photo)} style={{ height: 32, objectFit: "cover", width: 32 }} />
                      ) : (
                        <div style={{ background: "#eef2f7", borderRadius: 4, height: 32, width: 32 }} />
                      )}
                      <div>
                        <p className="mb-1" style={{ color: pageText, fontSize: 15 }}>{title}</p>
                        <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>{category}</p>
                      </div>
                    </div>
                    <span style={{ color: pageText, fontSize: 16 }}>Done</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes / Comments */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Notes / Comments</h5>
            <div style={{ padding: "26px 16px 18px" }}>
              <div style={{ background: "#fff6f6", border: "1px solid #f1d8d8", borderRadius: 8, color: pageText, padding: "14px 16px" }}>
                <h6 style={{ color: pageText, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Notes</h6>
                <div style={{ background: "#fff", borderRadius: 8, color: "#666", fontSize: 15, padding: "22px 20px" }}>
                  {notes || "No notes added."}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          {/* Pending Repairs */}
          <div style={cardStyle}>
            <div className="d-flex align-items-center justify-content-between" style={{ background: "#fbfcfd" }}>
              <h5 style={titleStyle}>Pending Repairs</h5>
              <button type="button" style={{ ...linkButtonStyle, paddingRight: 26 }}>View All</button>
            </div>
            <div style={{ padding: "16px 42px 2px" }}>
              {pending.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15, paddingBottom: 16 }}>No pending repairs.</p>
              ) : pending.map((item, i) => {
                const title    = val(item.title ?? item.itemName);
                const location = val(item.location ?? item.property);
                const priority = val(item.priority ?? item.severity);
                return (
                  <div key={i} className="d-flex align-items-center justify-content-between gap-3 mb-3">
                    <div className="d-flex align-items-center gap-4">
                      <span className="d-inline-flex align-items-center justify-content-center"
                        style={{ background: "#f2c155", borderRadius: "50%", color: "#fff", fontWeight: 800, height: 22, width: 22 }}>
                        !
                      </span>
                      <div>
                        <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>{title}</p>
                        <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>{location}</p>
                      </div>
                    </div>
                    <span style={{ color: PRIORITY_COLORS[priority] ?? "#bd2d3a", fontSize: 15 }}>{priority}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Document & Files */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Document &amp; Files</h5>
            <div style={{ padding: "18px 24px 6px" }}>
              {docs.length === 0 ? (
                <p style={{ color: pageText, fontSize: 15, paddingBottom: 16 }}>No documents uploaded.</p>
              ) : docs.map((doc, i) => (
                <div key={i} className="d-flex align-items-center gap-4 mb-3">
                  <span className="d-inline-flex align-items-center justify-content-center"
                    style={{ border: "1px solid #eef1f4", borderRadius: 5, height: 50, width: 50 }}>
                    <IconifyIcon icon="vscode-icons:file-type-pdf2" width={28} height={28} />
                  </span>
                  <div>
                    <p className="mb-1" style={{ color: bodyText, fontSize: 16, fontWeight: 600 }}>
                      {doc.documentName ?? doc.name ?? "Document"}
                    </p>
                    <p className="mb-0" style={{ color: bodyText, fontSize: 14 }}>
                      {doc.uploadedOn ? `Uploaded on ${fmtDate(doc.uploadedOn)}` : ""}
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
