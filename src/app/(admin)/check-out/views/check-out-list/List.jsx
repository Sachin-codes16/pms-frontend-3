// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import checkInApi from "@/helpers/checkInApi";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const pageText    = "#526b89";
const detailsPath = "/check-out-details";
const editPathFor = (id) => `/check-out-start?id=${id}`;

const API_ENDPOINT = "/checkin-checkout/check_out/get_all/";

const getRecordsFromResponse = (data) => data?.data?.data ?? [];

const mapRow = (item, idx) => ({
  id:               item.checkOutId,
  srNo:             idx + 1,
  tenantId:         item.tenantId ?? "",
  tenantName:       item.tenantName || "",
  property:         item.buildingName || "",
  unitNo:           item.flatUnitNumber || "",
  checkOutDate:     item.checkOutDate || "",
  securityDeposit:  item.securityDeposit ? `${item.securityDeposit} OMR` : "",
  inspectionStatus: item.managerApproval || "",
  keyReturnStatus:  item.keyReturnStatus || "",
  refundStatus:     item.paymentStatus || "",
  status:           item.checkOutStatus || "",
  requestFrom:      item.requestFrom || "",
});

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
  Completed:          { background: "#d9f3e4", color: "#32bf72" },
  Returned:           { background: "#d9f3e4", color: "#32bf72" },
  Refunded:           { background: "#d9f3e4", color: "#32bf72" },
  Paid:               { background: "#d9f3e4", color: "#32bf72" },
  Active:             { background: "#d9f3e4", color: "#32bf72" },
  Approved:           { background: "#d9f3e4", color: "#32bf72" },
  Pending:            { background: "#fff0df", color: "#f2a24d" },
  Lost:               { background: "#fde8e8", color: "#e05252" },
  "In Progress":      { background: "#e2ebfb", color: "#5d83ff" },
  "Inspection Pending": { background: "#fff0df", color: "#f2a24d" },
  Tenant:             { background: "#e2ebfb", color: "#5d83ff" },
  Admin:              { background: "#fff0df", color: "#f2a24d" },
};

const Badge = ({ value }) => (
  <span
    style={{
      ...(badgePalette[value] || { background: "#eef2f7", color: pageText }),
      borderRadius: 4,
      display: "inline-block",
      fontSize: 13,
      fontWeight: 500,
      minWidth: 78,
      padding: "4px 10px",
      textAlign: "center",
    }}
  >
    {value || "—"}
  </span>
);

const ActionButton = ({ icon, label, to, bg = "#f4f7fa" }) => (
  <Button
    as={Link}
    to={to}
    onClick={(e) => e.stopPropagation()}
    variant="link"
    aria-label={label}
    title={label}
    className="d-inline-flex align-items-center justify-content-center p-0"
    style={{ background: bg, borderRadius: 4, color: "#263044", height: 32, textDecoration: "none", width: 40 }}
  >
    <IconifyIcon icon={icon} width={17} height={17} />
  </Button>
);

const List = ({
  propertyType    = "All",
  checkOutStatus  = "All",
  inspectionStatus = "All",
  refundStatus    = "All",
  keyReturnStatus = "All",
  search          = "",
}) => {
  const navigate = useNavigate();
  const [allRows,     setAllRows]     = useState([]);
  const [totalCount,  setTotalCount]  = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [fetchError,  setFetchError]  = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingList(true);
    setFetchError(null);

    checkInApi
      .get(API_ENDPOINT)
      .then((res) => {
        if (cancelled) return;
        const records = getRecordsFromResponse(res.data);
        setAllRows(records.map(mapRow));
        setTotalCount(records.length);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Unknown error";
        setFetchError(status ? `HTTP ${status}: ${detail}` : detail);
        setAllRows([]);
        setTotalCount(0);
      })
      .finally(() => { if (!cancelled) setLoadingList(false); });

    return () => { cancelled = true; };
  }, []);

  // Client-side filtering
  const rows = allRows.filter((row) => {
    const hay = `${row.tenantId} ${row.tenantName} ${row.property} ${row.unitNo}`.toLowerCase();
    if (search && !hay.includes(search.toLowerCase())) return false;
    if (propertyType    !== "All" && row.property      !== propertyType)    return false;
    if (checkOutStatus  !== "All" && row.status        !== checkOutStatus)  return false;
    if (inspectionStatus !== "All" && row.inspectionStatus !== inspectionStatus) return false;
    if (refundStatus    !== "All" && row.refundStatus  !== refundStatus)    return false;
    if (keyReturnStatus !== "All" && row.keyReturnStatus !== keyReturnStatus) return false;
    return true;
  });

  const COLS = [
    "Sr. No.", "Tenant ID", "Tenant Name", "Property", "Unit No.",
    "Check-Out Date", "Security\nDeposit", "Inspection\nStatus",
    "Key Return\nStatus", "Refund Status", "Status", "Request From", "Action",
  ];

  return (
    <div style={{ ...panelStyle, overflow: "hidden", width: "100%" }}>
      <h5
        className="mb-0"
        style={{ borderBottom: "1px solid #e7ebf1", color: pageText, fontSize: 18, fontWeight: 700, padding: "15px 20px" }}
      >
        Check-Out List {totalCount !== null ? `(${totalCount})` : ""}
      </h5>

      <div style={{ background: "#fff", overflowX: "auto", padding: "0 16px 16px" }}>
        <table style={{ borderCollapse: "collapse", minWidth: 1550, width: "100%" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e7ebf1" }}>
              {COLS.map((col) => (
                <th key={col} style={tableHeaderStyle}>
                  {col.includes("\n")
                    ? col.split("\n").map((line, i) => <span key={i}>{line}{i < col.split("\n").length - 1 && <br />}</span>)
                    : col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr>
                <td colSpan={COLS.length} style={{ ...tableCellStyle, textAlign: "center", padding: "40px 0" }}>
                  Loading...
                </td>
              </tr>
            ) : fetchError ? (
              <tr>
                <td colSpan={COLS.length} style={{ ...tableCellStyle, textAlign: "center", padding: "40px 0", color: "#e05252" }}>
                  Failed to load: {fetchError}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} style={{ ...tableCellStyle, textAlign: "center", padding: "40px 0", color: "#8a96a8" }}>
                  No check-outs found.
                </td>
              </tr>
            ) : rows.map((row) => (
              <tr
                key={`${row.id}-${row.srNo}`}
                onClick={() => navigate(`${detailsPath}?id=${row.id}`)}
                style={{ borderBottom: "1px solid #eef1f5", cursor: "pointer" }}
              >
                <td style={{ ...tableCellStyle, textAlign: "center" }}>{row.srNo}</td>
                <td style={tableCellStyle}>{row.tenantId || "—"}</td>
                <td style={{ ...tableCellStyle, color: "#273247", fontWeight: 500 }}>
                  <Link to={`${detailsPath}?id=${row.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {row.tenantName}
                  </Link>
                </td>
                <td style={tableCellStyle}>{row.property}</td>
                <td style={tableCellStyle}>{row.unitNo}</td>
                <td style={tableCellStyle}>{row.checkOutDate || "—"}</td>
                <td style={tableCellStyle}>{row.securityDeposit || "—"}</td>
                <td style={tableCellStyle}><Badge value={row.inspectionStatus} /></td>
                <td style={tableCellStyle}><Badge value={row.keyReturnStatus} /></td>
                <td style={tableCellStyle}><Badge value={row.refundStatus} /></td>
                <td style={tableCellStyle}><Badge value={row.status} /></td>
                <td style={tableCellStyle}><Badge value={row.requestFrom} /></td>
                <td style={tableCellStyle}>
                  <div className="d-flex gap-2">
                    <ActionButton
                      icon="solar:eye-broken"
                      label="View check-out details"
                      to={`${detailsPath}?id=${row.id}`}
                    />
                    <ActionButton
                      icon="solar:pen-2-broken"
                      label="Edit check-out"
                      to={editPathFor(row.id)}
                      bg="#f5f0ff"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end" style={{ padding: "0 20px 15px" }}>
        <div className="d-flex" style={{ border: "1px solid #e4e9f0", borderRadius: 5, overflow: "hidden" }}>
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
