// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckOut from "@/hooks/useCheckOut";

// All fields live at the top level of the check-out record (camelCase)
const FIELD_MAP = {
  property_type:         "propertyType",
  property_code:         "propertyCode",
  building_name:         "buildingName",
  flat_unit_number:      "flatUnitNumber",
  floor_number:          "floorNumber",
  property_status:       "propertyStatus",
  monthly_rent:          "monthlyRent",
  security_deposit:      "securityDeposit",
  advance_rent_received: "advanceRentReceived",
  first_month_rent_paid: "firstMonthRentPaid",
  payment_mode:          "paymentMode",
  maintenance_charges:   "maintenanceCharges",
};

const PROPERTY_FIELDS = [
  "property_type", "property_code", "building_name",
  "flat_unit_number", "floor_number", "property_status",
];

const RENTAL_FIELDS = [
  "monthly_rent", "security_deposit", "advance_rent_received",
  "first_month_rent_paid", "payment_mode", "maintenance_charges",
];

const getValue = (item, name) => {
  const key   = FIELD_MAP[name];
  const value = key ? item?.[key] : undefined;
  return value === null || value === undefined ? "" : value;
};

const fieldStyle = {
  background: "#f9f9fc", border: "1px solid #e7e9ef", borderRadius: 5,
  color: "#526b89", fontSize: 16, height: 46, padding: "10px 14px", width: "100%",
};

const readOnlyStyle = { ...fieldStyle, background: "#f3f4f8", color: "#8a96a8", cursor: "not-allowed" };
const labelStyle     = { color: "#526b89", fontSize: 16, fontWeight: 500, marginBottom: 10 };
const sectionTitleStyle = {
  color: "#526b89", fontSize: 21, fontWeight: 700,
  borderBottom: "1px solid #dfe3e8", paddingBottom: 16, marginBottom: 20, scrollMarginTop: 110,
};

const toDateString = (iso) => (iso ? String(iso).split("T")[0] : "");

const Field = ({ label, name, type = "text", defaultValue, readOnly }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type={type} name={name} defaultValue={defaultValue ?? ""}
      readOnly={readOnly} style={readOnly ? readOnlyStyle : fieldStyle} />
  </div>
);

const SelectField = ({ label, name, defaultValue, options }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <select name={name} defaultValue={defaultValue ?? ""} style={fieldStyle}>
      <option value="">— Select —</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const PropertyDetailsEditDetailsPage = ({ mode = "check-out" }) => {
  const location = useLocation();
  const backPath = "/check-out-dashboard";

  const params = new URLSearchParams(location.search);
  const id     = params.get("id");

  const { item, loading, updateSections, fetchItem } = useCheckOut({ id });
  const formRef    = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const gv = (name) => getValue(item, name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current || !id) return;

    const formData = new FormData(formRef.current);
    const values   = {};
    for (const [k, v] of formData.entries()) {
      if (v !== "") values[k] = v;
    }

    const propBody  = {};
    const rentBody  = {};
    PROPERTY_FIELDS.forEach((f) => { if (values[f] !== undefined) propBody[f] = values[f]; });
    RENTAL_FIELDS.forEach((f)   => { if (values[f] !== undefined) rentBody[f] = values[f]; });

    const sections = {};
    if (Object.keys(propBody).length)  sections.property_details = propBody;
    if (Object.keys(rentBody).length)  sections.rental_details   = rentBody;

    if (Object.keys(sections).length === 0) {
      toast.info("No changes to save.");
      return;
    }

    try {
      setSubmitting(true);
      await updateSections(id, sections);
      await fetchItem();
      setSubmitting(false);
      toast.success("Property details updated successfully");
      alert("Property details updated successfully.");
    } catch (err) {
      setSubmitting(false);
      const res     = err?.response?.data;
      const message = res ? JSON.stringify(res) : err?.message || "Something went wrong";
      toast.error(message);
      alert(message);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button as={Link} to={backPath} variant="link"
          className="p-0 d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32, border: "1px solid #8a96a8", borderRadius: "50%", color: "#2f3848", textDecoration: "none" }}>
          <IconifyIcon icon="ri:arrow-left-s-line" width={20} height={20} />
        </Button>
        <h4 className="mb-0" style={{ color: "#526b89", fontSize: 20, fontWeight: 500 }}>
          Check-Out Information
        </h4>
      </div>

      <form key={loading ? "loading" : id || "new"} ref={formRef} onSubmit={handleSubmit}>
        <Row className="g-4 align-items-start">

          {/* Sidebar */}
          <Col xs={12} lg={3}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: "0 10px 30px rgba(16,24,40,0.07)" }}>
              <CardBody style={{ padding: 24 }}>
                {loading ? (
                  <div className="d-flex justify-content-center" style={{ padding: 24 }}><Spinner /></div>
                ) : (
                  <>
                    <h5 className="mb-1" style={{ color: "#526b89", fontSize: 18, fontWeight: 700 }}>
                      {item?.tenantName || "—"}
                    </h5>
                    <div className="d-flex flex-column gap-1 mb-4" style={{ color: "#526b89", fontSize: 14 }}>
                      <span>{item?.tenantEmail || "—"}</span>
                      <span>{item?.tenantMobileNumber || "—"}</span>
                    </div>
                    <Row className="g-3 mb-4">
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>Check-Out Date</p>
                        <p className="mb-0" style={{ color: "#526b89", fontSize: 14 }}>{item?.checkOutDate || "—"}</p>
                      </Col>
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>Status</p>
                        <p className="mb-0" style={{ color: "#526b89", fontSize: 14 }}>{item?.checkOutStatus || "—"}</p>
                      </Col>
                    </Row>
                    <h6 className="mb-3" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>Property Details</h6>
                    <Row className="g-3 mb-4">
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: "#526b89", fontSize: 14 }}>Type</p>
                        <p className="mb-0" style={{ color: "#526b89", fontSize: 14, fontWeight: 700 }}>{item?.propertyType || "—"}</p>
                      </Col>
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: "#526b89", fontSize: 14 }}>Status</p>
                        <p className="mb-0" style={{ color: "#526b89", fontSize: 14, fontWeight: 700 }}>{item?.propertyStatus || "—"}</p>
                      </Col>
                    </Row>
                  </>
                )}
                <div className="d-flex gap-2">
                  <Button as={Link} to={backPath} variant="outline-secondary" className="w-50"
                    style={{ borderColor: "#526b89", color: "#526b89", borderRadius: 5, height: 40 }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="w-50"
                    style={{ background: "#526b89", borderColor: "#526b89", borderRadius: 5, height: 40 }}>
                    {submitting ? "Saving…" : "Submit"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Main form */}
          <Col xs={12} lg={9}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: "0 10px 30px rgba(16,24,40,0.07)", overflow: "hidden" }}>
              <CardBody style={{ padding: 0 }}>
                <h3 className="mb-0" style={{ borderBottom: "1px solid #edf0f3", color: "#526b89", fontSize: 26, fontWeight: 700, padding: "30px 36px 28px" }}>
                  Property Details
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* A — Property Details */}
                  <h5 id="property-details" style={sectionTitleStyle}>A. Property Details</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <SelectField label="Property Type" name="property_type" defaultValue={gv("property_type")}
                        options={["Villa", "Warehouse", "Flat", "Commercial"]} />
                    </Col>
                    <Col md={4}>
                      <Field label="Property Code" name="property_code" defaultValue={gv("property_code")} />
                    </Col>
                    <Col md={4}>
                      <Field label="Building Name" name="building_name" defaultValue={gv("building_name")} />
                    </Col>
                    <Col md={4}>
                      <Field label="Flat / Unit Number" name="flat_unit_number" defaultValue={gv("flat_unit_number")} />
                    </Col>
                    <Col md={4}>
                      <Field label="Floor Number" name="floor_number" defaultValue={gv("floor_number")} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="Property Status" name="property_status" defaultValue={gv("property_status")}
                        options={["Reserved", "Available", "Occupied", "Maintenance"]} />
                    </Col>
                  </Row>

                  {/* B — Rental Details */}
                  <h5 id="rental-details" style={sectionTitleStyle}>B. Rental Details</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <Field label="Monthly Rent" name="monthly_rent" defaultValue={gv("monthly_rent")} />
                    </Col>
                    <Col md={4}>
                      <Field label="Security Deposit" name="security_deposit" defaultValue={gv("security_deposit")} />
                    </Col>
                    <Col md={4}>
                      <Field label="Advance Rent Received" name="advance_rent_received" defaultValue={gv("advance_rent_received")} />
                    </Col>
                    <Col md={4}>
                      <Field label="First Month Rent Paid" name="first_month_rent_paid" defaultValue={gv("first_month_rent_paid")} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="Payment Mode" name="payment_mode" defaultValue={gv("payment_mode")}
                        options={["Cash", "Bank Transfer", "Online", "Cheque"]} />
                    </Col>
                    <Col md={4}>
                      <Field label="Maintenance Charges" name="maintenance_charges" defaultValue={gv("maintenance_charges")} />
                    </Col>
                  </Row>

                  {/* C — System Fields */}
                  <h5 id="system-fields" style={sectionTitleStyle}>C. System Fields</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <Field label="Created By" defaultValue={item?.createdBy?.name ?? item?.createdBy ?? ""} readOnly />
                    </Col>
                    <Col md={4}>
                      <Field label="Created On" defaultValue={toDateString(item?.createdAt)} readOnly />
                    </Col>
                    <Col md={4}>
                      <Field label="Last Updated" defaultValue={toDateString(item?.updatedAt)} readOnly />
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <Button as={Link} to={backPath} variant="outline-secondary"
                      style={{ borderColor: "#526b89", color: "#526b89", borderRadius: 5, height: 45, minWidth: 200 }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}
                      style={{ background: "#526b89", borderColor: "#526b89", borderRadius: 5, height: 45, minWidth: 200 }}>
                      {submitting ? "Saving…" : "Submit"}
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
