// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import checkInApi from "@/helpers/checkInApi";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const pageText    = "#526b89";
const detailsPath = "/check-out-details";
const editPathFor = (id) => `/check-out-start?id=${id}`;

const API_ENDPOINT = "/checkin-checkout/check_out/get_all/";
const PAGE_SIZE = 10;
const EXPORT_PAGE_SIZE = 500;

const getListData = (data) => data?.data ?? {};

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

// backend expects DD-MM-YY
const toApiDateParam = (date) => {
  if (!date) return undefined;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

// property_type is not yet filterable server-side (backend gap, flagged separately) so
// it is intentionally NOT included here even though propertyType is now present in the response.
const buildFilterParams = ({ building, checkOutStatus, inspectionStatus, refundStatus, keyReturnStatus, requestFrom, search, fromDate, toDate }) => {
  const params = {};
  if (building && building !== "All") params.building = building;
  if (checkOutStatus && checkOutStatus !== "All") params.status = checkOutStatus;
  if (inspectionStatus && inspectionStatus !== "All") params.manager_approval = inspectionStatus;
  if (refundStatus && refundStatus !== "All") params.payment_status = refundStatus;
  if (keyReturnStatus && keyReturnStatus !== "All") params.key_return_status = keyReturnStatus;
  if (requestFrom && requestFrom !== "All") params.request_from = requestFrom;
  const from = toApiDateParam(fromDate);
  if (from) params.from_date = from;
  const to = toApiDateParam(toDate);
  if (to) params.to_date = to;
  // search_key/values is still non-functional server-side (confirmed via testing); sent anyway so
  // it activates automatically once the backend fixes it, without further frontend changes.
  if (search) {
    params.search_key = "tenant_name";
    params.values = search;
  }
  return params;
};

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

const List = forwardRef(({
  building        = "All",
  checkOutStatus  = "All",
  inspectionStatus = "All",
  refundStatus    = "All",
  keyReturnStatus = "All",
  requestFrom     = "All",
  search          = "",
  fromDate        = null,
  toDate          = null,
}, ref) => {
  const navigate = useNavigate();
  const [rows,        setRows]        = useState([]);
  const [presentPage, setPresentPage] = useState(1);
  const [totalPage,   setTotalPage]   = useState(1);
  const [totalCount,  setTotalCount]  = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [fetchError,  setFetchError]  = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError,   setExportError]   = useState(null);

  // reset to page 1 whenever a filter changes
  useEffect(() => {
    setPresentPage(1);
  }, [building, checkOutStatus, inspectionStatus, refundStatus, keyReturnStatus, requestFrom, search, fromDate, toDate]);

  useEffect(() => {
    let cancelled = false;
    setLoadingList(true);
    setFetchError(null);

    const params = {
      page_num: presentPage,
      limit: PAGE_SIZE,
      // cache-bust so a freshly created/updated check-out is never served from a stale
      // browser/proxy cache of this same URL+params combination
      _: Date.now(),
      ...buildFilterParams({ building, checkOutStatus, inspectionStatus, refundStatus, keyReturnStatus, requestFrom, search, fromDate, toDate }),
    };

    checkInApi
      .get(API_ENDPOINT, { params, headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => {
        if (cancelled) return;
        const data = getListData(res.data);
        const records = data.data ?? [];
        setRows(records.map(mapRow));
        setTotalPage(data.totalPage ?? 1);
        setTotalCount(records.length);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Unknown error";
        setFetchError(status ? `HTTP ${status}: ${detail}` : detail);
        setRows([]);
        setTotalCount(0);
      })
      .finally(() => { if (!cancelled) setLoadingList(false); });

    return () => { cancelled = true; };
  }, [presentPage, building, checkOutStatus, inspectionStatus, refundStatus, keyReturnStatus, requestFrom, search, fromDate, toDate]);

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPage);
    setPresentPage(clamped);
  };

  const COLS = [
    "Sr. No.", "Tenant ID", "Tenant Name", "Property", "Unit No.",
    "Check-Out Date", "Security\nDeposit", "Inspection\nStatus",
    "Key Return\nStatus", "Refund Status", "Status", "Request From", "Action",
  ];

  useImperativeHandle(ref, () => ({
    exportToPDF: async () => {
      setExportLoading(true);
      setExportError(null);

      const params = { limit: EXPORT_PAGE_SIZE, ...buildFilterParams({ building, checkOutStatus, inspectionStatus, refundStatus, keyReturnStatus, requestFrom, search, fromDate, toDate }) };

      try {
        let page = 1;
        let totalPages = 1;
        const allItems = [];

        do {
          const res = await checkInApi.get(API_ENDPOINT, { params: { ...params, page_num: page } });
          const data = getListData(res.data);
          allItems.push(...(data.data ?? []));
          totalPages = data.totalPage ?? 1;
          page += 1;
        } while (page <= totalPages);

        const excelRows = allItems.map((item, idx) => {
          const row = mapRow(item, idx);
          return {
            "Sr. No.": row.srNo,
            "Tenant ID": row.tenantId,
            "Tenant Name": row.tenantName,
            Property: row.property,
            "Unit No.": row.unitNo,
            "Check-Out Date": row.checkOutDate,
            "Security Deposit": row.securityDeposit,
            "Inspection Status": row.inspectionStatus,
            "Key Return Status": row.keyReturnStatus,
            "Refund Status": row.refundStatus,
            Status: row.status,
            "Request From": row.requestFrom,
          };
        });
        const worksheet = XLSX.utils.json_to_sheet(excelRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Check-Out List");
        XLSX.writeFile(workbook, `Check_Out_List_${new Date().toISOString().split("T")[0]}.xlsx`);
      } catch (err) {
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Unable to export check-out list.";
        setExportError(status ? `HTTP ${status}: ${detail}` : detail);
      } finally {
        setExportLoading(false);
      }
    },
  }));

  return (
    <div style={{ ...panelStyle, overflow: "hidden", width: "100%" }}>
      <h5
        className="mb-0"
        style={{ borderBottom: "1px solid #e7ebf1", color: pageText, fontSize: 18, fontWeight: 700, padding: "15px 20px" }}
      >
        Check-Out List {totalCount !== null ? `(${totalCount})` : ""}
      </h5>
      {exportError && (
        <div style={{ padding: "10px 20px", color: "#e05252", fontSize: 14 }}>
          Export failed: {exportError}
        </div>
      )}
      {exportLoading && (
        <div style={{ padding: "10px 20px" }}>
          <Spinner animation="border" size="sm" /> Exporting...
        </div>
      )}

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
                  <Spinner animation="border" size="sm" />
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
          <button
            type="button"
            onClick={() => goToPage(presentPage - 1)}
            disabled={presentPage <= 1}
            style={{
              background: "#fff",
              border: 0,
              borderRight: "1px solid #e4e9f0",
              color: "#3d4655",
              height: 35,
              minWidth: 78,
              padding: "0 12px",
            }}
          >
            Previous
          </button>
          {paginationRange(presentPage, totalPage).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              style={{
                background: page === presentPage ? "#283140" : "#fff",
                border: 0,
                borderRight: "1px solid #e4e9f0",
                color: page === presentPage ? "#fff" : "#3d4655",
                height: 35,
                minWidth: 32,
                padding: "0 12px",
              }}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goToPage(presentPage + 1)}
            disabled={presentPage >= totalPage}
            style={{
              background: "#fff",
              border: 0,
              color: "#3d4655",
              height: 35,
              minWidth: 32,
              padding: "0 12px",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
});

const paginationRange = (current, total) => {
  const windowSize = 3;
  let start = Math.max(1, current - 1);
  const end = Math.min(total, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return pages;
};

List.displayName = "List";

export default List;
