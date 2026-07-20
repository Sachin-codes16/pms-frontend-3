import IconifyIcon from "@/components/wrappers/IconifyIcon";
import useCheckOut from "@/hooks/useCheckOut";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const ICON_OVERVIEW    = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABRElEQVR4AeyYTQrCUAyEi6AbvZH4dy1dqAs9liiCJ9JNXehMoBKkFZpEaCGQvD4S8zGdvoXtoCiKV1CW4FTBfQiXAitoJ69a4BkK94a8YqYp2LMwqUWYWuAFlZ0hKQJjtcGehUktAtQCpdC1JQV6n0g6mA56HfDO5xlMB70OeOd7dQZXuNuDIReYaQr2LExqEaZ2cI7K2pBTzDQFexYmtQiTAp/YRST/RQMlEcETBgWOgIzICThVjLGJYI4oEKzuBgXy0UTkXd3mA/sIZkmBQ8Aiko8UKIkInjAoUIhY+P5wxLVt3jDTFOy15fH31CJMLfCEysaQnzcwzH4HexYmtQhLC5SCbfnfVAr0epsOpoNeB7zzeQbTQa8D3vlenUG+4Fi+hs5+uMSehUktgtUOLlHZGpIiMFYb7FmY1CJALVAKXVveAAAA//8tChE3AAAABklEQVQDAITq6iGY1BRMAAAAAElFTkSuQmCC";
const ICON_TENANT      = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAD7klEQVR4AcSYWchNaxjHv+OcUzp1Okdn7swuRFxIuSDEjfFGFMUNGTMms8wzIWOmC5SS2Q1xQ7giUoaiZMg8FC7IGL/f3pZv2XuvvYb9fdvX/7+fd73P8D7fu9Y7NqjJ9vctbu3hLLgfXoN34Wv4Dj6AF+AxOAN2gF/B1Eib4B+0sAI+hCfgbNgT/g/Vmbgxf+W5BewI58Lj8BbcAP+DiWGwJMa/YbQe3oHj4I8wLf7EYRi8DjfBf2EskiQ4hiiX4XCY6TXhV4ghVJyCI2FZlEvwOzzXwlUwS4/hVha+FeOvLGcVlaAJ7cEx9j/EplKMJcBh2BAWISrBg1h2g9VCFxraC31riFqUSnAd6raw2uhOg0vhZyhMcARaifgi8JMaGG45nKDz08ywMmXZuW4qPtOhox6RCc6zDqCcczhBk/ukyGmT/8zDtBNcDBfAZnAOzAIH6JTAMUjQ3vusawODGPkW/QDoP/ceGYarzCgqXPoQqeDI/l2PIMFPGVuZkDexawO3wSg44JqjvA3TwAXBhaHGBGWPNN7Yuly5zp6hHIcrGLixuIFMA3sxl2A7vP6CSbELw1YwTYPatsRnN0wKv8X29p4fd1In56m+GD+FafEMhz7QAYVIhE4m6KtKYj0ao8mwUjigJhDkFYxDExP8JcbqPvrW0IUdUSdYThQ/rbjB0zZJgo7wJIOBNlPBmEtiPBqa4E8xRl/H6CtRP49x/tkECyfYQh/PHZOo7AzrCr0J5LLoskYxEg1M8FGkOq/4B+GrmIasK7jCLCSYUwkiEo9N8GWkOrnCOPa0891F3DzJuRpQrAiPDHy+ohB5ZzcJrr0ehFzaPMll3SzkI+Z/r5rguXw58689NbGE93jqvoGV4KwJHq0kAr6Namr4LYbb9++Lq1PVHDfB07hkWbpwq1d4Bj9pgi45G+u1qWzBd+pmgspl/MTNh5hUDeayxtaCBB/zkKtARuGHKEWG+txuuYyfVyNOWbn9YGDnxPkkeCgh3c9tod5dTZiDqIvCYBRhW8uef5tSHwU3J4sCZdCDPntl5sbAchQ9f6xGGaZ7RKpKQl3Y1nKvkpa1lW7HPE7kasIJWmHXxr1q7eqLbsM2h4MXJqjOXjxkocrcR3tuZBG1KJXgC9T94RFYLXgXZJtF7ZVKUCMn7q4U7HJEvcJPyrNKyU1LVIJBRnb5UB4cWYg6hTNGPyJ6Qepbo1iMuAT18KP1gL6VBydQREUwxnwiONXsQJZFkgQN4KTp1UhjHnztcYcdzIrgZ+MWzAt294texBcZFVYkTTDwM1Ff+99UeFvgHvAA5UvQBr2HeUP5HtR2O1IbbRt9LLtqUUyGDwAAAP//fluP2QAAAAZJREFUAwAOS6GRGmZQBgAAAABJRU5ErkJggg==";
const ICON_PROPERTY    = "data:image/png;base64,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";
const ICON_INSPECTION  = "data:image/png;base64,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";
const ICON_REPAIR      = "data:image/png;base64,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";
const ICON_UTILITY     = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACbUlEQVR4AeyYT0gVQRzHt6ioWxGdggqiS12KCLpVh6JLEXQpCoIuFRHVpW5B1KFbfwjqoiAoohcVQUFREUQQxItHBRU9eBJBD4qKfr7LzjBv2NVd1ufuYeX7mfnN/GbefN/vPR/sHA5K/lcZzPsBZa3gSw78Aocgq46z4Su8gNTKYvAUr9oAmQ9hj/SYRm+ukf4opFKcwTvs/At9MOQwSGz0nsDNpYm/s0fSmf5ra/8/kvehRlpsJlQhmRBvmbwLtx2uEhspdnNp4gtmM33c+tfM90IryAtdELgGB5hR9eiCFZoxGPZgGGqW1s/tNZ5ij9Eogb9+gznpCU0HhDIGnzG6BlITzTm4Ce47db/cn7ycuy4p/sMeo7g1F0m2g3SL5h7YCoYDJpbgFSyDrzkm3sF/6IesambDb/gIplqEVvNE7tlPGVuDqpjGkzTrkCT987whGfcGmN5V2vOBFb8gSVozHSXPqjcfseKysBoZOaa+jAbly+IbPE/mc8GEHy0eQvkG9Vv1g0yRXOJ8K9+gTZQl8A3qx/ME5opkhPOtfINKrNEUySbnW8UZtMkyBJXBvJ9CVcGqgnkrkHf/Pn0H89pI3l8ZTK5NukxVwXR1Sl5VVTC5NukypoJb0fLUdybR+np223pxY3BBA7gMRUpPclciA4vqjcEeDeAk/IQidIRDv8EZkDrVGIO6ctB9ieb0cD1DoBung0QV05UKRwe6QGhTYAwq1v3MuALQ013c/Uk9505zrjRB8wBCuQZ1Y3WD2efQBXqAOkhaOPMhXAfdA9HVXr+FEzRa+Ii+ntWKe20Vpptza+RWsCZRlsEOAAAA//9vtUZRAAAABklEQVQDAIhw5FHsAMpgAAAAAElFTkSuQmCC";
const ICON_FINANCE     = "data:image/png;base64,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";
const ICON_KEYHANDOVER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAETElEQVR4AbyYXWgcVRSAz7kz2+1WrFuEVnywm5jiLig+qEVRaEJqJeC/mCd/CCRd82JJVRDBGvskCJr6UI0IjUJ9sRCpUAqVnajUKgUFlVJ0Zw3+YauJNbTN3945PXc2ze7OzszuzkxmuGfuOefOOfeb+7c/AtboWvh8W6c0si+WjdwJaeR+5XqOZaE8lfuT66+WjdzYkpG7u1n3kQMuFbJ3LBvZgq7pJgG+yQA7CSADANeyJIHgRq7vQ4A93Pkphv+xXMg+wT7Xws+4+gM5ZSH3lkA4jYA9rSZg+FsB8QhDvkdGJu2MiwSQjnUleeo+JIQRAEQIciHmLUh9Nz+ZydSGRwJopfQDPHXP1CYOotNMuSN5XjtKB2/adDU+NKCcyr1EgPmrCQPXM2UQM5YKv40SiUNKURIKkIxshgheVYlaF5ywpNyuLSW2kKB7AakAVbhKGgseWX63q1sZoQAlwT5OonYnV80LEhzUe84MrNv582l84IfziR1nv9a7z/aKWfrWGa3ppE4ACAxI33RtRIGPORP72Yva0htu7VLCyw1+C+5UoxgYUF5K9PL0NhwLDR1VHYsbdpi/V82qpifJrFpVTaD1aGBAIrqrmqolLel2ztmRZXG9XTtuPEO3BwYEgdsd+ZqaZVzP52TjY4TylUav7bklMCAiaNDmhf/KfXK88zX6oGOrCqWPbt4sxzsOgIVPKttFNgcGdEnm71o5ShBwlKSYtsY7Jc3DOQTxPHhfVhjAc955HS0rcPVebN43wd/NH6rPumoRwPerhp/iCucXUNf2U2BA3aLmgOHggMf4ZCBA9e1FChyte1enERJOpVsoy8NtA9JkJi1TCYMT3MPiXiKA48Sfpoanp9sCVHDldOoYB68tHAKhJe0zs2VABSfTqSMIsLZw/PZEuB959FiFlgDtNVcZuV4V5CrRTCuAwE+0fHF1fTcFtOHiWXNAGkyIoWJ/7QD4AtrTGg/c/wQ4og2aA7VwSvcEVHAxbIgLvB/G8FKyk6d1TAE5xRVQwbW3IZxp2dbQQAt7CGiUreMsXyhhoM8I6W0k6MN1sgPzpRHce2aW21xLA6C95sJuCAEnccvlB3G4OKXlS6+LvNnH0q2EgR7Wdpf24nPmcRyYvuBKVeOsA7Thwq45BXfD/C586K/LNf0EVlcB7WkNCMe/zkbRggGLBa9bvD8qOPVWNqCCC7MhLBJTOGxO6CzY/8e8ShyVCAUXdkPogpd8VESOPEKmN3zMvrY/IQjgfUCYRAHv4OAvX3KONSkCgPo8M/t8fIlNcy+I3ebjOGTu8YyPoIEBPbL4wPHIEfb/c9EjMlK3O6AfHHfPB+1hrmIpjYAecAR0CDXYhutpqzZUejoWOu6kHtADjp/jpQr/4aBZxGdLv9l2TLcqoB+cgkHijauUeKUC2AxOg1PiGm1/vGiV3gTMWkdX/tmseJx3pBO4MbkLnyrOOZvisK8AAAD///dF6B4AAAAGSURBVAMAiB7SQ9TszHcAAAAASUVORK5CYII=";
const ICON_DOCUMENTS   = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADHUlEQVR4AeyXXUgUURTH/3d1nbKSIK0gpEQisKB6iBKsrIh6qAeDoF5Ko/IpUiPIKFiQVjIwH6OE8qUCMV96KCEwEKy3ekiRErPd0lBJtl33o9293Vsu7c7Mnd2z7QdEw/zZuXfOnPO75967c8YGk8Ph4LZap++akHuv0xutdXp5qtp3eYLH68St6aijL3DbJExKXaaAg3ZfB8DbhNYxQJxI+2BcPM/Q5Ojz30nHiQFwt5OXCZeX0nFm+QxjjY4noS5LG5ObBsCCiHeziV2GuqIXqZk0AGaIRO1GZpIw3bkHlOgEyPwAEiDzBxiDTLJxsg4YjnCJYiHrjZN1wHlPCIFgxAJQ3LJYk1kHDIejePtuDu8nPPjo+q6W29t4/IZ7m8BNOLMOKKPJDH6Z9mHS7bXUzDf/Smkfr5wAxgekXv8HpGZMb//vZfBQFXB6p1p11XaoVFNVqE9Q0jYpg5tWA1cOMtTvUquuukgAmuv8YQ3ry0ghQbKemAOGxoFpj1qzHg6VRl1RTM5Ek2Yt3oAEGBIvhOtPOU7eV6ulewEqtff642OndE0CTMljho3IgJ3HgEcNajWeLYZKF45q0Oy0TxwSYGUpsL2cYW2JWqXinko7NhaivJQUkrZJxmeB9gGOB6/U6h8OQaW7z4L4MCUWMmEZ0IYjHA+MAj2v1eof/iEAzTU0EhYeaCcZcLkGrFmh15+2anplf7FGW39yKCRACdZziuHxGbVUG0T232xYAiokCdAXAooK5LjSk72ACUDasyRAbxA495CjuU+t9t4AVGrp9v96y1AQSYDSsXzNvXEDKo26IlBpIZjsA0pGSBQZsKZSXcnIKidWyezfWoilRfRNAd1BAqxYBbQdUVcyssqJVTP1BzTs2fIXC3YRlAT4ef731MppVim+khn5RKtcFpkSfkiAspqRGyTVasY1m2PAhKHlqEHKYI6YEsIYAG2Mi7/jBJu8NgyAzIYxMEYvfTMwDC1sH9O7MQC+uFoyxzm/pzfMdpszdD3v2jClj2MAlAYvW5c1id9WcC4+kcRVNk+GrwLOMdhR0WwW5icAAAD//wY0WmcAAAAGSURBVAMAF3cfYkT0dHcAAAAASUVORK5CYII=";
import DocumentsPage from "./pages/DocumentsPage";
import FinancePage from "./pages/FinancePage";
import InspectionPage from "./pages/InspectionPage";
import KeyHandoverPage from "./pages/KeyHandoverPage";
import OverviewPage from "./pages/OverviewPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import RepairDamagePage from "./pages/RepairDamagePage";
import TenantDetailsPage from "./pages/TenantDetailsPage";
import UtilityReadingsPage from "./pages/UtilityReadingsPage";

const pageText = "#526b89";
const darkButton = "#30375f";

const fallbackDetailItems = [
  { label: "Tenant",          value: "—" },
  { label: "Property",        value: "—" },
  { label: "Unit No",         value: "—" },
  { label: "Check-Out Date",  value: "—" },
  { label: "Assigned To",     value: "—" },
  { label: "Check-Out Status", value: "—" },
  { label: "Mobile No.",      value: "—" },
  { label: "Tenant Type",     value: "—" },
];

const buildDetailItems = (item) => {
  if (!item) return fallbackDetailItems;
  return [
    { label: "Tenant",          value: item.tenantName || "–" },
    { label: "Property",        value: item.buildingName || "–" },
    { label: "Unit No",         value: item.flatUnitNumber || "–" },
    { label: "Check-Out Date",  value: item.checkOutDate || "–" },
    { label: "Assigned To",     value: item.assignedEmployee?.name || "–" },
    { label: "Check-Out Status", value: item.checkOutStatus || "–" },
    { label: "Mobile No.",      value: item.tenantMobileNumber || "–" },
    { label: "Tenant Type",     value: item.tenantType || "–" },
  ];
};

const tabs = [
  { key: "overview",        label: "Overview",         imgSrc: ICON_OVERVIEW,    component: OverviewPage },
  { key: "tenantDetails",   label: "Tenant Details",   imgSrc: ICON_TENANT,      component: TenantDetailsPage },
  { key: "propertyDetails", label: "Property Details", imgSrc: ICON_PROPERTY,    component: PropertyDetailsPage },
  { key: "inspection",      label: "Inspection",       imgSrc: ICON_INSPECTION,  component: InspectionPage },
  { key: "repairDamage",    label: "Repair & Damage",  imgSrc: ICON_REPAIR,      component: RepairDamagePage },
  { key: "utilityReadings", label: "Utility Readings", imgSrc: ICON_UTILITY,     component: UtilityReadingsPage },
  { key: "finance",         label: "Finance",          imgSrc: ICON_FINANCE,     component: FinancePage },
  { key: "keyHandover",     label: "Key Handover",     imgSrc: ICON_KEYHANDOVER, component: KeyHandoverPage },
  { key: "documents",       label: "Documents",        imgSrc: ICON_DOCUMENTS,   component: DocumentsPage },
];

const editSectionByTab = {
  overview: "check-out-information",
  tenantDetails: "tenant-details",
  propertyDetails: "property-details",
  inspection: "property-inspection",
  repairDamage: "repair-damage",
  utilityReadings: "utility-meter-readings",
  finance: "finance-details",
  keyHandover: "key-handover",
  documents: "documents-upload",
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
  padding: "28px 30px 12px",
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

const CheckOutDetailsPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const tabParam = params.get("tab");
  const initialTab = tabs.find((t) => t.key === tabParam)?.key ?? tabs[0].key;
  const [activeTab, setActiveTab] = useState(initialTab);
  const { item } = useCheckOut({ id });

  const detailItems = buildDetailItems(item);
  const statusLabel = item?.checkOutStatus || "Pending";
  const recordCode  = item?.checkOutCode   || "—";

  const ActivePage =
    tabs.find((tab) => tab.key === activeTab)?.component ?? OverviewPage;
  const editSection = editSectionByTab[activeTab] ?? editSectionByTab.overview;
  const editPath = id
    ? `/check-out-start?id=${id}#${editSection}`
    : `/check-out-start#${editSection}`;

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
            Check-Out Details
          </h4>
          <div style={{ color: pageText, fontSize: 15 }}>
            Dashboard &gt; Check-Out &gt; Check-Out Details
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Button
            as={Link}
            to="/check-out-list"
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

      <div style={{ padding: "20px 30px" }}>
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
                  <img src={tab.imgSrc} width={20} height={20} alt={tab.label} style={{ display: "block" }} />
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

export default CheckOutDetailsPage;
