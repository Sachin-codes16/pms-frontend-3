// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import checkInApi from "@/helpers/checkInApi";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const pageText = "#526b89";
const detailsPath = "/check-in-information";
const editPathFor = (id) => `/check-in-start?id=${id}#check-in-information`;

const API_ENDPOINT = "/checkin-checkout/check_in/get_all/";

// GET /checkin-checkout/check_in/get_all/ response shape:
// { data: { data: CheckInListItem[], presentPage, totalPage } }
const getRecordsFromResponse = (data) => data?.data?.data ?? [];

// Maps a CheckInListItem (response) to the table row shape.
const mapRow = (item, idx) => ({
  id: item.checkInId,
  srNo: idx + 1,
  tenantId: item.tenantId ?? "",
  tenantName: item.tenantName || "",
  property: item.buildingName || "",
  unitNo: item.flatUnitNumber || "",
  checkinDate: item.checkInDate || "",
  rent: item.monthlyRent || "",
  assignmentStatus: item.managerApproval || "",
  keyStatus: item.keyHandoverStatus || "",
  status: item.checkInStatus || "",
  assignedTo: item.assignedEmployee?.name || "",
  requestFrom: item.requestFrom || "",
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

const List = forwardRef(({
  propertyType = 'All',
  building = 'All',
  status = 'All',
  assignedEmployee = 'All',
  assignmentStatus = 'All',
  keyStatus = 'All',
  search = '',
  fromDate = null,
  toDate = null,
}, ref) => {
  const navigate = useNavigate();
  const [allRows, setAllRows] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingList(true);
    setFetchError(null);

    const loadCheckIns = async () => {
      try {
        const params = {};
        if (propertyType && propertyType !== 'All') {
          params.filter_key = 'rental_type';
          params.filter_value = propertyType.toLowerCase();
        }
        const res = await checkInApi.get(API_ENDPOINT, { params });
        const records = getRecordsFromResponse(res.data);
        if (!cancelled) {
          const mapped = records.map(mapRow);
          setAllRows(mapped);
          setTotalCount(mapped.length);
        }
      } catch (err) {
        const status = err?.response?.status;
        const detail =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Unknown error";
        const msg = status ? `HTTP ${status}: ${detail}` : detail;
        console.error("Check-in list fetch failed:", msg);
        if (!cancelled) {
          setAllRows([]);
          setTotalCount(0);
          setFetchError(msg);
        }
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    };

    loadCheckIns();
    return () => {
      cancelled = true;
    };
  }, [propertyType]);

  // Client-side filtering
  const rows = allRows.filter((row) => {
    const hay = `${row.tenantId} ${row.tenantName} ${row.property} ${row.unitNo}`.toLowerCase();
    if (search && !hay.includes(search.toLowerCase())) return false;
    if (building !== "All" && row.property !== building) return false;
    if (status !== "All" && row.status !== status) return false;
    if (assignedEmployee !== "All" && row.assignedTo !== assignedEmployee) return false;
    if (assignmentStatus !== "All" && row.assignmentStatus !== assignmentStatus) return false;
    if (keyStatus !== "All" && row.keyStatus !== keyStatus) return false;
    if (row.checkinDate && (fromDate || toDate)) {
      const rowDate = new Date(row.checkinDate);
      if (fromDate && rowDate < new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())) return false;
      if (toDate && rowDate > new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 23, 59, 59)) return false;
    }
    return true;
  });

  useImperativeHandle(ref, () => ({
    exportToExcel: () => {
      const excelRows = rows.map((row) => ({
        "Sr. No.": row.srNo,
        "Tenant ID": row.tenantId,
        "Tenant Name": row.tenantName,
        Property: row.property,
        "Unit No.": row.unitNo,
        "Check-In Date": row.checkinDate,
        Rent: row.rent,
        "Assignment Status": row.assignmentStatus,
        "Key Status": row.keyStatus,
        Status: row.status,
        "Assigned To": row.assignedTo,
        "Request From": row.requestFrom,
      }));
      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Check-In List");
      XLSX.writeFile(workbook, `Check_In_List_${new Date().toISOString().split("T")[0]}.xlsx`);
    },
  }));

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
        Check-in List {totalCount !== null ? `(${totalCount})` : ""}
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
              <th style={tableHeaderStyle}>Request From</th>
              <th style={tableHeaderStyle}>Request</th>
              <th style={tableHeaderStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr>
                <td colSpan={14} style={{ ...tableCellStyle, textAlign: "center", padding: "40px 0" }}>
                  Loading...
                </td>
              </tr>
            ) : fetchError ? (
              <tr>
                <td colSpan={14} style={{ ...tableCellStyle, textAlign: "center", padding: "40px 0", color: "#e05252" }}>
                  Failed to load check-ins: {fetchError}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={14} style={{ ...tableCellStyle, textAlign: "center", padding: "40px 0", color: "#8a96a8" }}>
                  No check-ins available.
                </td>
              </tr>
            ) : rows.map((row) => (
              <tr
                key={`${row.id}-${row.srNo}-${row.tenantName}`}
                onClick={() => navigate(`${detailsPath}?id=${row.id}`)}
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
                    to={`${detailsPath}?id=${row.id}`}
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
                <td style={tableCellStyle}>{row.requestFrom || "—"}</td>
                <td style={tableCellStyle}>
                  <Button
                    as={Link}
                    to="/check-in-start"
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
                    Add Check-In
                  </Button>
                </td>
                <td style={tableCellStyle}>
                  <div className="d-flex gap-2">
                    <ActionButton
                      icon="solar:eye-broken"
                      label="View check-in details"
                      to={`${detailsPath}?id=${row.id}`}
                    />
                    <ActionButton
                      icon="solar:pen-2-broken"
                      label="Edit check-in"
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
});

List.displayName = "List";

export default List;
