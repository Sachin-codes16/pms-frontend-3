import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { resolvePhotoSrc } from "@/utils/imageStorage";
import { fmtDate, val } from "@/utils/checkInFormat";

const pageText = "#526b89";
const bodyText = "#303746";

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

const emptyTextStyle = { color: pageText, fontSize: 15, padding: "0 30px 24px" };

const STAT_FIELDS = [
  { key: "totalIssues", label: "Total Issues", icon: "solar:calendar-date-bold-duotone", color: "#6747ff", bg: "#eee7ff" },
  { key: "pendingRepairs", label: "Pending Repairs", icon: "solar:gallery-check-bold-duotone", color: "#47c878", bg: "#e9f8ef" },
  { key: "repaired", label: "Repaired", icon: "solar:user-plus-bold-duotone", color: "#ff8d3c", bg: "#fff0e8" },
  { key: "approved", label: "Approved", icon: "solar:chart-2-bold-duotone", color: "#36c8cf", bg: "#e8fbfb" },
];

const StatCard = ({ label, value, icon, color, bg }) => (
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
        <span style={{ color: pageText, fontSize: 15 }}>{label}</span>
      </div>
      <strong style={{ color: bodyText, fontSize: 26 }}>{value}</strong>
    </div>
    <span
      className="d-inline-flex align-items-center justify-content-center"
      style={{ background: bg, borderRadius: 5, color, height: 56, width: 56 }}
    >
      <IconifyIcon icon={icon} width={32} height={32} />
    </span>
  </div>
);

const RepairApprovalPage = ({ record }) => {
  const repairApproval = record?.repairApproval ?? {};
  const summary = repairApproval.summary ?? {};
  const issueList = repairApproval.issueList ?? [];
  const approvalSummary = repairApproval.approvalSummary ?? {};
  const pendingRepairs = repairApproval.pendingRepairs ?? [];
  const photos = repairApproval.repairedPhotos ?? [];
  const resolvedIssues = repairApproval.recentResolvedIssues ?? [];

  const summaryItems = [
    ["Recommended By", val(approvalSummary.recommendedBy)],
    ["Approved By", val(approvalSummary.approvedBy)],
    ["Approved On", fmtDate(approvalSummary.approvedOn)],
    ["Overall Status", val(approvalSummary.overallStatus)],
    ["Priority", val(approvalSummary.priority)],
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: "#edf2f8", borderRadius: 8, marginBottom: 24, padding: "26px 25px" }}>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(4, minmax(220px, 1fr))" }}>
          {STAT_FIELDS.map((stat) => (
            <StatCard key={stat.key} {...stat} value={summary[stat.key] ?? 0} />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(650px, 1.7fr) minmax(390px, 1fr)" }}>
        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Issue List</h5>

            {issueList.length > 0 ? (
              <div style={{ padding: "34px 18px 16px" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr style={{ background: "#fbfcfd" }}>
                      {["Issue ID", "Category", "Issue Description", "Status", "Assigned To", "Target Date"].map((head) => (
                        <th key={head} style={{ color: pageText, fontSize: 16, fontWeight: 700, padding: "20px 24px", textAlign: "left" }}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {issueList.map((issue, index) => (
                      <tr key={issue.id ?? index}>
                        <td style={{ color: pageText, fontSize: 15, padding: "16px 24px" }}>
                          <IconifyIcon icon="ri:checkbox-circle-line" width={16} height={16} style={{ color: "#2f7ee6", marginRight: 12 }} />
                          {val(issue.issueId ?? issue.id)}
                        </td>
                        <td style={{ color: pageText, fontSize: 15, padding: "16px 24px" }}>{val(issue.category)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: "16px 24px" }}>{val(issue.description)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: "16px 24px" }}>{val(issue.status)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: "16px 24px" }}>{val(issue.assignedTo)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: "16px 24px" }}>{fmtDate(issue.targetDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={emptyTextStyle}>No issues recorded</p>
            )}
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Repaired Photos</h5>
            <div style={{ padding: "0 26px 24px" }}>
              {photos.length > 0 ? (
                <div className="d-flex gap-3 mb-3">
                  {photos.map((photo) => (
                    <img key={photo} alt="Repair" src={resolvePhotoSrc(photo)} style={{ borderRadius: 8, height: 78, objectFit: "cover", width: 110 }} />
                  ))}
                </div>
              ) : (
                <p style={{ color: pageText, fontSize: 15 }}>No photos uploaded</p>
              )}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                  Recent Resolved Issues
                </h6>
              </div>
              {resolvedIssues.length > 0 ? (
                resolvedIssues.map((issue, index) => (
                  <div key={issue.id ?? index} className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {issue.photo && (
                        <img alt={issue.title} src={resolvePhotoSrc(issue.photo)} style={{ height: 32, objectFit: "cover", width: 32 }} />
                      )}
                      <div>
                        <p className="mb-1" style={{ color: pageText, fontSize: 15 }}>
                          {val(issue.title)}
                        </p>
                        <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>
                          {val(issue.category)}
                        </p>
                      </div>
                    </div>
                    <span style={{ color: pageText, fontSize: 16 }}>Done</span>
                  </div>
                ))
              ) : (
                <p style={{ color: pageText, fontSize: 15 }}>No resolved issues yet</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={summaryTitleStyle}>Approval Summary</h5>
            <div style={{ padding: "5px 48px 12px" }}>
              {summaryItems.map(([label, value]) => (
                <div key={label} style={{ display: "grid", gridTemplateColumns: "220px 20px 1fr", minHeight: 45 }}>
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 16 }}>:</span>
                  <span style={{ color: pageText, fontSize: 16 }}>{value}</span>
                </div>
              ))}
              <p style={{ color: pageText, fontSize: 16, margin: "8px 0 14px" }}>Inspector Comments:</p>
              <div style={commentBoxStyle}>{approvalSummary.inspectorComments || "No comments recorded"}</div>
            </div>
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Pending Repairs</h5>
            {pendingRepairs.length > 0 ? (
              <div style={{ padding: "18px 42px 22px" }}>
                {pendingRepairs.map((repair, index) => (
                  <div key={repair.id ?? index} className="d-flex align-items-center justify-content-between gap-3 mb-4">
                    <div className="d-flex align-items-center gap-4">
                      <span
                        className="d-inline-flex align-items-center justify-content-center"
                        style={{ background: "#f2c155", borderRadius: "50%", color: "#fff", fontWeight: 800, height: 22, width: 22 }}
                      >
                        !
                      </span>
                      <div>
                        <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>
                          {val(repair.title)}
                        </p>
                        <p className="mb-0" style={{ color: pageText, fontSize: 15 }}>
                          {val(repair.location)}
                        </p>
                      </div>
                    </div>
                    <span style={{ color: "#bd2d3a", fontSize: 15 }}>{val(repair.priority)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={emptyTextStyle}>No pending repairs</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairApprovalPage;
