// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import api from "@/helpers/api";
import useCheckIn from "@/hooks/useCheckIn";

// Maps snake_case form field → nested path in the check-in detail response.
// getValue() automatically falls back to the flat camelCase top-level field.
const FIELD_PATHS = {
  property_type:         ["propertyDetails", "basicInformation", "propertyType"],
  property_code:         ["propertyDetails", "basicInformation", "propertyCode"],
  building_name:         [],   // flat: buildingName
  flat_unit_number:      [],   // flat: flatUnitNumber
  floor_number:          [],   // flat: floorNumber
  property_status:       [],   // flat: propertyStatus
  monthly_rent:          ["propertyDetails", "rentalAndFinancialDetails", "monthlyRent"],
  security_deposit:      ["propertyDetails", "rentalAndFinancialDetails", "securityDeposit"],
  maintenance_charges:   ["propertyDetails", "rentalAndFinancialDetails", "maintenance"],
  advance_rent_received: [],   // flat: advanceRentReceived
  first_month_rent_paid: [],   // flat: firstMonthRentPaid
  payment_mode:          [],   // flat: paymentMode
  internal_comments:     [],   // flat: internalComments
};

// Fields that live on the property record — updated via PUT /property/update/,
// not via the check-in PATCH endpoint (which silently ignores them).
const PROPERTY_API_FIELDS = ["monthly_rent", "security_deposit", "maintenance_charges"];

// All rental fields are sent to BOTH the check-in PATCH and the property PUT.
const SECTION_FIELDS = {
  property_details: ["property_type", "property_code", "building_name", "flat_unit_number", "floor_number", "property_status"],
  rental_details:   ["monthly_rent", "security_deposit", "advance_rent_received", "first_month_rent_paid", "payment_mode", "maintenance_charges"],
  comments:         ["internal_comments"],
};

const fieldStyle = {
  background: "#f9f9fc",
  border: "1px solid #e7e9ef",
  borderRadius: 5,
  color: "#526b89",
  fontSize: 16,
  height: 46,
  padding: "10px 14px",
  width: "100%",
};

const selectFieldStyle = {
  ...fieldStyle,
  paddingRight: 40,
  appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23526b89' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 20px center",
  backgroundSize: "16px",
};

const labelStyle = {
  color: "#526b89",
  fontSize: 16,
  fontWeight: 500,
  marginBottom: 10,
};

const sectionTitleStyle = {
  color: "#526b89",
  fontSize: 21,
  fontWeight: 700,
  borderBottom: "1px solid #dfe3e8",
  paddingBottom: 16,
  marginBottom: 20,
  scrollMarginTop: 110,
};

const AmountField = ({ label, name, defaultValue, readOnly }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div style={{ display: "flex", alignItems: "center", border: "1px solid #e7e9ef", borderRadius: 5, overflow: "hidden", background: readOnly ? "#dbeafe" : "#f9f9fc" }}>
      <span style={{ padding: "0 12px", height: 46, display: "flex", alignItems: "center", background: "#e7e9ef", color: "#526b89", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>OMR</span>
      <input name={name} type="number" defaultValue={defaultValue} placeholder="0.000" readOnly={readOnly} style={{ ...fieldStyle, border: "none", borderRadius: 0, background: "transparent", flex: 1, cursor: readOnly ? "not-allowed" : "auto" }} />
    </div>
  </div>
);

const FormField = ({ label, name, placeholder, as = "input", type = "text", defaultValue, readOnly, children }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {as === "select" ? (
      <select style={selectFieldStyle} name={name} defaultValue={defaultValue ?? ""} disabled={readOnly}>
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
    ) : (
      <input style={fieldStyle} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} readOnly={readOnly} />
    )}
  </div>
);

const TextAreaField = ({ label, name, placeholder, defaultValue, readOnly }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      readOnly={readOnly}
      style={{ ...fieldStyle, minHeight: 94, height: "auto", resize: "none" }}
    />
  </div>
);

const DateField = ({ label, name, defaultValue, readOnly }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type="date" name={name} defaultValue={defaultValue} readOnly={readOnly} style={fieldStyle} />
  </div>
);

const toDateString = (iso) => iso ? String(iso).split("T")[0] : "";

const PropertyDetailsEditDetailsPage = ({ mode = "check-in" }) => {
  const location = useLocation();
  const isCheckOut = mode === "check-out";
  const flowTitle = isCheckOut ? "Check-Out" : "Check-In";

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const dashboardPath = isCheckOut ? `/check-out-details?id=${id}` : `/check-in-information?id=${id}&tab=propertyDetails`;

  const { item, loading, updateSections, fetchItem } = useCheckIn({ id });
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const getValue = (name) => {
    // Try nested path first
    const path = FIELD_PATHS[name];
    if (path && path.length > 0) {
      const nested = path.reduce((acc, key) => acc?.[key], item);
      if (nested !== null && nested !== undefined) return nested;
    }
    // Fall back to flat camelCase key
    const camelKey = name.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    const flat = item?.[camelKey];
    return flat === null || flat === undefined ? "" : flat;
  };

  useEffect(() => {
    if (!location.hash) return;
    const section = document.getElementById(location.hash.slice(1));
    section?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [location.hash]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    if (!id) {
      alert("Cannot submit: no check-in id in the URL.");
      return;
    }

    const formData = new FormData(formRef.current);
    const values = {};
    for (const [k, v] of formData.entries()) {
      if (v === "") continue;
      values[k] = v;
    }

    const promises = [];

    // ── Property-level fields → PUT /property/update/ ──────────────────────
    const propertyFields = {};
    for (const f of PROPERTY_API_FIELDS) {
      if (values[f] !== undefined) propertyFields[f] = values[f];
    }
    if (item?.propertyId && Object.keys(propertyFields).length > 0) {
      const propertyPayload = {
        property_id: item.propertyId,
        property_details: {
          ...(propertyFields.monthly_rent        !== undefined && { monthly_rent:            propertyFields.monthly_rent }),
          ...(propertyFields.security_deposit    !== undefined && { security_deposit_amount: propertyFields.security_deposit }),
          ...(propertyFields.maintenance_charges !== undefined && { maintenance_charges:     propertyFields.maintenance_charges }),
        },
        ...(propertyFields.monthly_rent !== undefined && { expected_rent: propertyFields.monthly_rent }),
      };
      console.log("[PropertyUpdate] PUT /property/update/ payload:", propertyPayload);
      promises.push(
        api.put("/property/update/", propertyPayload)
          .then((res) => { console.log("[PropertyUpdate] response:", res.data); return res; })
          .catch((err) => { console.error("[PropertyUpdate] error:", err?.response?.status, err?.response?.data); throw err; })
      );
    } else {
      console.warn("[PropertyUpdate] skipped — propertyId:", item?.propertyId, "fields:", propertyFields);
    }

    // ── Check-in-level fields → PATCH per section ──────────────────────────
    const sections = {};
    for (const [sectionKey, fields] of Object.entries(SECTION_FIELDS)) {
      const body = {};
      for (const field of fields) {
        if (values[field] !== undefined) body[field] = values[field];
      }
      if (Object.keys(body).length > 0) sections[sectionKey] = body;
    }
    if (Object.keys(sections).length > 0) {
      console.log("[CheckInUpdate] sections payload:", sections);
      promises.push(
        updateSections(id, sections)
          .then((res) => { console.log("[CheckInUpdate] response:", res); return res; })
      );
    }

    try {
      setSubmitting(true);
      await Promise.all(promises);
      const freshData = await fetchItem();
      console.log("[FetchAfterSave] monthlyRent flat:", freshData?.monthlyRent, "| nested:", freshData?.propertyDetails?.rentalAndFinancialDetails?.monthlyRent);
      setSubmitting(false);
      toast.success("Property details updated successfully");
      alert("Property details updated successfully.");
    } catch (err) {
      setSubmitting(false);
      const res = err?.response?.data;
      const message = res ? JSON.stringify(res) : err?.message || "Something went wrong";
      toast.error(message);
      alert(message);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button
          as={Link}
          to={dashboardPath}
          variant="link"
          className="p-0 d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32, border: "1px solid #8a96a8", borderRadius: "50%", color: "#2f3848", textDecoration: "none" }}
        >
          <IconifyIcon icon="ri:arrow-left-s-line" width={20} height={20} />
        </Button>
        <h4 className="mb-0" style={{ color: "#526b89", fontSize: 20, fontWeight: 500 }}>
          {flowTitle} Information
        </h4>
      </div>

      <form key={loading ? "loading" : id || "new"} ref={formRef} onSubmit={handleSubmit}>
        <Row className="g-4 align-items-start">
          {/* ── Sidebar ── */}
          <Col xs={12} lg={3}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: "0 10px 30px rgba(16, 24, 40, 0.07)" }}>
              <CardBody style={{ padding: 24 }}>
                {loading ? (
                  <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <h5 className="mb-2" style={{ color: "#526b89", fontSize: 18, fontWeight: 700 }}>
                      {item?.tenantName || "—"}
                    </h5>
                    <div className="d-flex flex-wrap gap-3 mb-4" style={{ color: "#526b89", fontSize: 14 }}>
                      <span>{item?.tenantEmail || "—"}</span>
                      <span>{item?.tenantMobileNumber || "—"}</span>
                    </div>
                  </>
                )}

                <Row className="g-3 mb-4">
                  <Col xs={6}>
                    <p className="mb-2" style={{ color: "#526b89", fontSize: 16, fontWeight: 700 }}>{flowTitle} Date</p>
                    <p className="mb-0" style={{ color: "#526b89", fontSize: 15 }}>{item?.checkInDate || "—"}</p>
                  </Col>
                  <Col xs={6}>
                    <p className="mb-2" style={{ color: "#526b89", fontSize: 16, fontWeight: 700 }}>{flowTitle} Status</p>
                    <p className="mb-0" style={{ color: "#526b89", fontSize: 15 }}>{item?.checkInStatus || "—"}</p>
                  </Col>
                </Row>

                <h6 className="mb-3" style={{ color: "#526b89", fontSize: 17, fontWeight: 700 }}>Property Details</h6>
                <Row className="g-3 mb-4">
                  <Col xs={6}>
                    <p className="mb-1" style={{ color: "#526b89", fontSize: 15 }}>Property Type</p>
                    <p className="mb-0" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>{item?.propertyType || "—"}</p>
                  </Col>
                  <Col xs={6}>
                    <p className="mb-1" style={{ color: "#526b89", fontSize: 15 }}>Property Status</p>
                    <p className="mb-0" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>{item?.propertyStatus || "—"}</p>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to={dashboardPath}
                    variant="outline-secondary"
                    className="w-50"
                    style={{ borderColor: "#526b89", color: "#526b89", borderRadius: 5, height: 40 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-50"
                    style={{ background: "#526b89", borderColor: "#526b89", borderRadius: 5, height: 40 }}
                  >
                    {submitting ? "Saving..." : "Submit"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* ── Main form ── */}
          <Col xs={12} lg={9}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: "0 10px 30px rgba(16, 24, 40, 0.07)", overflow: "hidden" }}>
              <CardBody style={{ padding: 0 }}>
                <h3 className="mb-0" style={{ color: "#526b89", fontSize: 26, fontWeight: 700, padding: "30px 36px 28px", borderBottom: "1px solid #edf0f3" }}>
                  Property Details
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* A. Property Details */}
                  <h5 id="property-details" style={sectionTitleStyle}>
                    A. Property Details
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Property Type"
                        name="property_type"
                        defaultValue={getValue("property_type")}
                        placeholder="Select Type"
                        as="select"
                      >
                        <option>Villa</option>
                        <option>Warehouse</option>
                        <option>Flat</option>
                        <option>Commercial</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Property Code"
                        name="property_code"
                        defaultValue={getValue("property_code")}
                        placeholder="PRX123456"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Building Name"
                        name="building_name"
                        defaultValue={getValue("building_name")}
                        placeholder="Building Name"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Flat / Unit Number"
                        name="flat_unit_number"
                        defaultValue={getValue("flat_unit_number")}
                        placeholder="Unit Number"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Floor Number"
                        name="floor_number"
                        defaultValue={getValue("floor_number")}
                        placeholder="Floor Number"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Property Status"
                        name="property_status"
                        defaultValue={getValue("property_status")}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Reserved</option>
                        <option>Available</option>
                        <option>Occupied</option>
                        <option>Maintenance</option>
                      </FormField>
                    </Col>
                  </Row>

                  {/* B. Rental Details */}
                  <h5 id="rental-details" style={sectionTitleStyle}>
                    B. Rental Details
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <AmountField
                        label="Monthly Rent"
                        name="monthly_rent"
                        defaultValue={getValue("monthly_rent")}
                      />
                    </Col>
                    <Col md={4}>
                      <AmountField
                        label="Security Deposit"
                        name="security_deposit"
                        defaultValue={getValue("security_deposit")}
                      />
                    </Col>
                    <Col md={4}>
                      <AmountField
                        label="Advance Rent Received"
                        name="advance_rent_received"
                        defaultValue={getValue("advance_rent_received")}
                      />
                    </Col>
                    <Col md={4}>
                      <AmountField
                        label="First Month Rent Paid"
                        name="first_month_rent_paid"
                        defaultValue={getValue("first_month_rent_paid")}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Payment Mode"
                        name="payment_mode"
                        defaultValue={getValue("payment_mode")}
                        placeholder="Select Mode"
                        as="select"
                      >
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                        <option>Online</option>
                        <option>Cheque</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <AmountField
                        label="Maintenance Charges"
                        name="maintenance_charges"
                        defaultValue={getValue("maintenance_charges")}
                      />
                    </Col>
                  </Row>

                  {/* C. Comments */}
                  <h5 id="comments" style={sectionTitleStyle}>
                    C. Comments
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={12}>
                      <TextAreaField
                        label="Internal Comments"
                        name="internal_comments"
                        defaultValue={getValue("internal_comments")}
                        placeholder="Internal notes about this property..."
                      />
                    </Col>
                  </Row>

                  {/* D. System Fields */}
                  <h5 id="system-fields" style={sectionTitleStyle}>
                    D. System Fields (Auto)
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField label="Created By" defaultValue={item?.createdBy?.name ?? ""} placeholder="System Admin" readOnly />
                    </Col>
                    <Col md={4}>
                      <DateField label="Created Date" defaultValue={toDateString(item?.createdAt)} readOnly />
                    </Col>
                    <Col md={4}>
                      <FormField label="Updated By" defaultValue={item?.updatedBy?.name ?? item?.createdBy?.name ?? ""} placeholder="Auto" readOnly />
                    </Col>
                    <Col md={4}>
                      <DateField label="Updated Date" defaultValue={toDateString(item?.updatedAt)} readOnly />
                    </Col>
                    <Col md={12}>
                      <TextAreaField
                        label="Status History"
                        defaultValue={item?.statusHistory ?? ""}
                        placeholder="Status history"
                        readOnly
                      />
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      as={Link}
                      to={dashboardPath}
                      variant="outline-secondary"
                      style={{ borderColor: "#526b89", color: "#526b89", borderRadius: 5, minWidth: 200, height: 45 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      style={{ background: "#526b89", borderColor: "#526b89", borderRadius: 5, minWidth: 200, height: 45 }}
                    >
                      {submitting ? "Saving..." : "Submit"}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default PropertyDetailsEditDetailsPage;
