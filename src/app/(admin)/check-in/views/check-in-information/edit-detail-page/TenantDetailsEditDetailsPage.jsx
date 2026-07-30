// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckIn from "@/hooks/useCheckIn";
import useNationalities from "@/hooks/useNationalities";

// Maps snake_case form field → nested path in the check-in detail response.
// getValue() falls back to the flat camelCase top-level field automatically.
const FIELD_PATHS = {
  tenant_id:              [],                   // flat: item.tenantId
  tenant_code:            ["tenantDetails", "personalDetails", "tenantCode"],
  tenant_name:            ["tenantDetails", "personalDetails", "tenantName"],
  tenant_type:            ["tenantDetails", "personalDetails", "tenantType"],
  date_of_birth:          ["tenantDetails", "personalDetails", "dateOfBirth"],
  gender:                 ["tenantDetails", "personalDetails", "gender"],
  marital_status:         ["tenantDetails", "personalDetails", "maritalStatus"],
  tenant_nationality:     ["tenantDetails", "personalDetails", "tenantNationality"],
  tenant_mobile_number:   ["tenantDetails", "contactDetails", "tenantMobileNumber"],
  alternate_mobile_number:["tenantDetails", "contactDetails", "alternateMobileNumber"],
  tenant_email:           ["tenantDetails", "contactDetails", "tenantEmail"],
  emergency_contact_name: ["tenantDetails", "contactDetails", "emergencyContactName"],
  emergency_contact_number:["tenantDetails","contactDetails", "emergencyContactNumber"],
  tenant_civil_id:        ["tenantDetails", "identificationDetails", "tenantCivilId"],
  tenant_passport_number: ["tenantDetails", "identificationDetails", "tenantPassportNumber"],
  tenant_address:         ["tenantDetails", "identificationDetails", "tenantAddress"],
  profession:             ["tenantDetails", "professionalDetails", "profession"],
  company_name:           ["tenantDetails", "professionalDetails", "companyName"],
  move_in_reason:         ["tenantDetails", "occupancyDetails", "moveInReason"],
  number_of_occupants:    ["tenantDetails", "occupancyDetails", "numberOfOccupants"],
};

const NUMERIC_FIELDS = ["tenant_id", "number_of_occupants"];

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

const TextAreaField = ({ label, name, placeholder, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
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

const TenantDetailsEditDetailsPage = () => {
  const flowTitle = "Check-In";

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const dashboardPath = `/check-in-information?id=${id}&tab=tenantDetails`;

  const { item, loading, updateSections, fetchItem } = useCheckIn({ id });
  const { nationalities, loaded: nationalitiesLoaded } = useNationalities();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    if (!id) {
      alert("Cannot submit: no check-in id in the URL.");
      return;
    }
    const formData = new FormData(formRef.current);
    const payload = {};
    for (const [k, v] of formData.entries()) {
      if (v === "") continue;
      payload[k] = NUMERIC_FIELDS.includes(k) ? Number(v) : v;
    }
    try {
      setSubmitting(true);
      await updateSections(id, { tenant_details: payload });
      await fetchItem();
      setSubmitting(false);
      toast.success("Tenant details updated successfully");
      alert("Tenant details updated successfully.");
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

      <form key={loading || !nationalitiesLoaded ? "loading" : id || "new"} ref={formRef} onSubmit={handleSubmit}>
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
                  Tenant Details
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* A. Check-In Information (context — not submitted from this form) */}
                  <h5 id="check-in-information" style={sectionTitleStyle}>
                    A. {flowTitle} Information
                  </h5>
                  <Row className="g-3 mb-4">
                    <Col md={4}>
                      <FormField label={`${flowTitle} Code / ID`} defaultValue={item?.checkInCode ?? ""} placeholder="Auto-Generated" readOnly />
                    </Col>
                    <Col md={4}>
                      <DateField label={`${flowTitle} Date`} defaultValue={toDateString(item?.checkInDate)} readOnly />
                    </Col>
                    <Col md={4}>
                      <FormField label={`${flowTitle} Status`} defaultValue={item?.checkInStatus ?? ""} placeholder="—" readOnly />
                    </Col>
                    <Col md={4}>
                      <FormField label="Assigned Employee ID" defaultValue={item?.assignedEmployeeId ?? ""} placeholder="—" readOnly />
                    </Col>
                    <Col md={12}>
                      <FormField label="Remarks / Notes" defaultValue={item?.remarksNotes ?? ""} placeholder="—" readOnly />
                    </Col>
                  </Row>

                  {/* B. Tenant Details */}
                  <h5 id="tenant-details" style={sectionTitleStyle}>
                    B. Tenant Details
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Tenant ID"
                        name="tenant_id"
                        type="number"
                        defaultValue={getValue("tenant_id")}
                        placeholder="Tenant ID"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Tenant Code"
                        name="tenant_code"
                        defaultValue={getValue("tenant_code")}
                        placeholder="TXD132456"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Tenant Name"
                        name="tenant_name"
                        defaultValue={getValue("tenant_name")}
                        placeholder="Full Name or Company Name"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Tenant Type"
                        name="tenant_type"
                        defaultValue={getValue("tenant_type")}
                        placeholder="Select Type"
                        as="select"
                      >
                        <option>Individual</option>
                        <option>Corporate</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Date of Birth"
                        name="date_of_birth"
                        defaultValue={toDateString(getValue("date_of_birth"))}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Gender"
                        name="gender"
                        defaultValue={getValue("gender")}
                        placeholder="Select Gender"
                        as="select"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Marital Status"
                        name="marital_status"
                        defaultValue={getValue("marital_status")}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Nationality"
                        name="tenant_nationality"
                        defaultValue={getValue("tenant_nationality")}
                        placeholder="Select Nationality"
                        as="select"
                      >
                        {nationalities.map((name) => (
                          <option key={name}>{name}</option>
                        ))}
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Civil ID"
                        name="tenant_civil_id"
                        defaultValue={getValue("tenant_civil_id")}
                        placeholder="Civil ID Number"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Passport Number"
                        name="tenant_passport_number"
                        defaultValue={getValue("tenant_passport_number")}
                        placeholder="Passport Number"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Mobile Number"
                        name="tenant_mobile_number"
                        defaultValue={getValue("tenant_mobile_number")}
                        placeholder="Mobile Number"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Alternate Mobile"
                        name="alternate_mobile_number"
                        defaultValue={getValue("alternate_mobile_number")}
                        placeholder="Alternate Number"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Email"
                        name="tenant_email"
                        type="email"
                        defaultValue={getValue("tenant_email")}
                        placeholder="email@domain.com"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Emergency Contact Name"
                        name="emergency_contact_name"
                        defaultValue={getValue("emergency_contact_name")}
                        placeholder="Name"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Emergency Contact Number"
                        name="emergency_contact_number"
                        defaultValue={getValue("emergency_contact_number")}
                        placeholder="Number"
                      />
                    </Col>
                    <Col md={12}>
                      <TextAreaField
                        label="Address"
                        name="tenant_address"
                        defaultValue={getValue("tenant_address")}
                        placeholder="Enter Address"
                      />
                    </Col>
                  </Row>

                  {/* C. Professional & Occupancy */}
                  <h5 style={sectionTitleStyle}>C. Professional &amp; Occupancy</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Profession"
                        name="profession"
                        defaultValue={getValue("profession")}
                        placeholder="Profession"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Company Name"
                        name="company_name"
                        defaultValue={getValue("company_name")}
                        placeholder="Company Name"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Move-In Reason"
                        name="move_in_reason"
                        defaultValue={getValue("move_in_reason")}
                        placeholder="Reason"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="No. of Occupants"
                        name="number_of_occupants"
                        type="number"
                        defaultValue={getValue("number_of_occupants")}
                        placeholder="Count"
                      />
                    </Col>
                  </Row>

                  {/* D. Notes */}
                  <h5 style={sectionTitleStyle}>D. Notes</h5>
                  <Row className="g-4 mb-4">
                    <Col md={12}>
                      <TextAreaField
                        label="Tenant Remarks"
                        name="tenant_remarks"
                        defaultValue={item?.tenantRemarks ?? ""}
                        placeholder="Feedback or notes from tenant"
                      />
                    </Col>
                  </Row>

                  {/* E. System Fields */}
                  <h5 style={sectionTitleStyle}>E. System Fields (Auto)</h5>
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
                      <TextAreaField label="Status History" defaultValue={item?.statusHistory ?? ""} placeholder="Status history" />
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

export default TenantDetailsEditDetailsPage;
