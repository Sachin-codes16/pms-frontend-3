import IconifyIcon from "@/components/wrappers/IconifyIcon";
import useCheckIn from "@/hooks/useCheckIn";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import AgreementPage from "./pages/AgreementPage";
import DocumentsPage from "./pages/DocumentsPage";
import InspectionPage from "./pages/InspectionPage";
import KeyHandoverPage from "./pages/KeyHandoverPage";
import OverviewPage from "./pages/OverviewPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import RepairApprovalPage from "./pages/RepairApprovalPage";
import TenantDetailsPage from "./pages/TenantDetailsPage";
import UtilityReadingsPage from "./pages/UtilityReadingsPage";

const pageText = "#526b89";
const darkButton = "#30375f";

// ===== Paste your backend API endpoint here, e.g. '/check-ins' =====
const API_ENDPOINT = "/check-ins";
// =====================================================================
// Until a record loads from the API (or while it's unreachable), the
// summary below shows this demo data so the UI keeps working.

const fallbackDetailItems = [
  { label: "Tenant", value: "Bilal Ahmed" },
  { label: "Property", value: "A-401, Ocean View" },
  { label: "Unit No", value: "A-401" },
  { label: "Check-in Date", value: "29 May 2025" },
  { label: "Assigned To", value: "Ramesh Kumar" },
  { label: "Check-in Status", value: "Completeed" },
  { label: "Mobile No.", value: "+911 1234567890" },
  { label: "Tenant Type", value: "Individual" },
];

const fallbackStatus = "Completed";
const fallbackCode = "CL-12345665";

const getFirstValue = (item, keys, fallback = "") => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "") {
      return item[key];
    }
  }
  return fallback;
};

const buildDetailItems = (item) => {
  if (!item) return fallbackDetailItems;

  return [
    { label: "Tenant", value: getFirstValue(item, ["tenant_name", "tenantName"], fallbackDetailItems[0].value) },
    { label: "Property", value: getFirstValue(item, ["property_name", "propertyName", "property"], fallbackDetailItems[1].value) },
    { label: "Unit No", value: getFirstValue(item, ["unit_no", "unitNo"], fallbackDetailItems[2].value) },
    { label: "Check-in Date", value: getFirstValue(item, ["check_in_date", "checkInDate"], fallbackDetailItems[3].value) },
    { label: "Assigned To", value: getFirstValue(item, ["assigned_to", "assignedTo"], fallbackDetailItems[4].value) },
    { label: "Check-in Status", value: getFirstValue(item, ["check_in_status", "status"], fallbackDetailItems[5].value) },
    { label: "Mobile No.", value: getFirstValue(item, ["mobile_no", "mobileNo", "phone"], fallbackDetailItems[6].value) },
    { label: "Tenant Type", value: getFirstValue(item, ["tenant_type", "tenantType"], fallbackDetailItems[7].value) },
  ];
};

const tabs = [
  {
    key: "overview",
    label: "Overview",
    icon: "ri:layout-grid-line",
    iconColor: "#3f6fd1",
    iconBg: "#eef3fc",
    component: OverviewPage,
  },
  {
    key: "tenantDetails",
    label: "Tenant Details",
    icon: "ri:home-4-fill",
    iconColor: "#1f2630",
    iconBg: "#f2f3f5",
    component: TenantDetailsPage,
  },
  {
    key: "propertyDetails",
    label: "Property Details",
    icon: "noto:house",
    iconColor: undefined,
    iconBg: "#fdf1e9",
    component: PropertyDetailsPage,
  },
  {
    key: "inspection",
    label: "Inspection",
    icon: "solar:clipboard-list-bold",
    iconColor: "#1f2630",
    iconBg: "#f2f3f5",
    component: InspectionPage,
  },
  {
    key: "repairApproval",
    label: "Repair & Approval",
    icon: "solar:wrench-bold",
    iconColor: "#ff8b3d",
    iconBg: "#fdf1e9",
    component: RepairApprovalPage,
  },
  {
    key: "utilityReadings",
    label: "Utility Readings",
    icon: "ri:calendar-line",
    iconColor: "#1f2630",
    iconBg: "#f2f3f5",
    component: UtilityReadingsPage,
  },
  {
    key: "agreement",
    label: "Agreement",
    icon: "ri:checkbox-circle-fill",
    iconColor: "#21c55d",
    iconBg: "#e8f9ee",
    component: AgreementPage,
  },
  {
    key: "keyHandover",
    label: "Key Handover",
    icon: "noto:key",
    iconColor: undefined,
    iconBg: "#fdf1e9",
    component: KeyHandoverPage,
  },
  {
    key: "documents",
    label: "Documents",
    icon: "solar:document-bold",
    iconColor: "#3478f6",
    iconBg: "#eaf1fe",
    component: DocumentsPage,
  },
];

const editSectionByTab = {
  overview: 'check-in-information',
  tenantDetails: 'tenant-details',
  propertyDetails: 'property-details',
  inspection: 'property-inspection',
  repairApproval: 'repair-approval',
  utilityReadings: 'utility-meter-readings',
  agreement: 'agreement-details',
  keyHandover: 'key-handover',
  documents: 'documents-upload',
};

const shellStyle = {
  background: "#f6f7fb",
  margin: "0 -48px",
  minHeight: "calc(100vh - 80px)",
  paddingTop: 10,
};

const topBarStyle = {
  background: "#fff",
  borderBottom: "1px solid #eef1f5",
  padding: "28px 56px 12px",
};

const cardStyle = {
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 8px 26px rgba(15, 23, 42, 0.08)",
};

const outlineButtonStyle = {
  border: "1px solid #b8b6ff",
  borderRadius: 5,
  color: darkButton,
  height: 40,
  minWidth: 100,
};

const primaryButtonStyle = {
  background: darkButton,
  borderColor: darkButton,
  borderRadius: 5,
  height: 40,
  minWidth: 140,
};

const CheckInDetailsPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const { item } = useCheckIn({ endpoint: API_ENDPOINT, id });

  const detailItems = buildDetailItems(item);
  const statusLabel = getFirstValue(item, ["check_in_status", "status"], fallbackStatus);
  const recordCode = getFirstValue(item, ["check_in_code", "code", "id"], fallbackCode);

  const ActivePage =
    tabs.find((tab) => tab.key === activeTab)?.component ?? OverviewPage;
  const editSection = editSectionByTab[activeTab] ?? editSectionByTab.overview;
  const editPath = id
    ? `/check-in-start?id=${id}#${editSection}`
    : `/check-in-start#${editSection}`;

  return (
    <div style={shellStyle}>
      <div
        className="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-3"
        style={topBarStyle}
      >
        <div>
          <h4
            className="mb-2"
            style={{ color: pageText, fontSize: 18, fontWeight: 700 }}
          >
            Check-In Details
          </h4>
          <div style={{ color: pageText, fontSize: 15 }}>
            Dashboard &gt; Check-in &gt; Check-In Details
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Button
            as={Link}
            to="/check-in-list"
            variant="outline-primary"
            className="d-inline-flex align-items-center justify-content-center gap-2 px-4"
            style={outlineButtonStyle}
          >
            <IconifyIcon icon="ri:arrow-left-s-line" width={18} height={18} />
            <span>Back</span>
          </Button>
          <Button as={Link} to={editPath} style={primaryButtonStyle}>
            Edit Details
          </Button>
        </div>
      </div>

      <div style={{ padding: "30px 56px" }}>
        <div
          className="mb-4"
          style={{ ...cardStyle, padding: "25px 29px 22px" }}
        >
          <div className="d-flex align-items-center gap-4 mb-3">
            <span
              style={{
                background: "#e6fbea",
                borderRadius: 8,
                color: "#21865f",
                display: "inline-block",
                fontSize: 16,
                fontWeight: 700,
                padding: "8px 16px",
              }}
            >
              {statusLabel}
            </span>
            <span style={{ color: pageText, fontSize: 17, fontWeight: 700 }}>
              {recordCode}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: "repeat(8, minmax(120px, 1fr))",
              overflowX: "auto",
            }}
          >
            {detailItems.map((item) => (
              <div key={item.label} style={{ minWidth: 120 }}>
                <p className="mb-2" style={{ color: pageText, fontSize: 15 }}>
                  {item.label}
                </p>
                <p
                  className="mb-0"
                  style={{ color: pageText, fontSize: 16, fontWeight: 700 }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4" style={{ ...cardStyle, padding: "8px 10px" }}>
          <div
            style={{
              display: "grid",
              gap: 18,
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              width: "100%",
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <Button
                  key={tab.key}
                  type="button"
                  variant="light"
                  onClick={() => setActiveTab(tab.key)}
                  className="d-inline-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: isActive ? "#f3f8fb" : "#fff",
                    border: isActive
                      ? "1px solid #c7d2dc"
                      : "1px solid #edf0f4",
                    borderRadius: 8,
                    color: pageText,
                    fontSize: 15,
                    fontWeight: 700,
                    height: 45,
                    minWidth: 0,
                    padding: "0 10px",
                    whiteSpace: "nowrap",
                    width: "100%",
                  }}
                >
                  <IconifyIcon icon={tab.icon} width={20} height={20} />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div style={{ ...cardStyle, minHeight: 290 }}>
          <ActivePage record={item} />
        </div>
      </div>
    </div>
  );
};

export default CheckInDetailsPage;
