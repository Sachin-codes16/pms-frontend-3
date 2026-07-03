import IconifyIcon from "@/components/wrappers/IconifyIcon";
import checkInApi from "@/helpers/checkInApi";
import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckOut from "@/hooks/useCheckOut";

const DOCUMENT_UPLOAD_ENDPOINT = "/checkin-checkout/check_in/document/upload/";

const NUMERIC_FIELDS = [
  "property_id",
  "property_assignment_id",
  "tenant_id",
  "assigned_employee_id",
];

// GET /checkin-checkout/check_out/get/ returns camelCase; form fields use snake_case
const FIELD_MAP = {
  property_id:              "propertyId",
  property_assignment_id:   "propertyAssignmentId",
  check_out_date:           "checkOutDate",
  check_out_status:         "checkOutStatus",
  assigned_employee_id:     "assignedEmployeeId",
  remarks_notes:            "remarksNotes",
  tenant_id:                "tenantId",
  tenant_code:              "tenantCode",
  tenant_name:              "tenantName",
  tenant_type:              "tenantType",
  tenant_mobile_number:     "tenantMobileNumber",
  tenant_email:             "tenantEmail",
  tenant_civil_id:          "tenantCivilId",
  tenant_passport_number:   "tenantPassportNumber",
  tenant_nationality:       "tenantNationality",
  date_of_birth:            "dateOfBirth",
  gender:                   "gender",
  marital_status:           "maritalStatus",
  emergency_contact_name:   "emergencyContactName",
  emergency_contact_number: "emergencyContactNumber",
  profession:               "profession",
  company_name:             "companyName",
  property_type:            "propertyType",
  property_code:            "propertyCode",
  building_name:            "buildingName",
  flat_unit_number:         "flatUnitNumber",
  floor_number:             "floorNumber",
  property_status:          "propertyStatus",
  monthly_rent:             "monthlyRent",
  security_deposit:         "securityDeposit",
  advance_rent_received:    "advanceRentReceived",
  first_month_rent_paid:    "firstMonthRentPaid",
  payment_mode:             "paymentMode",
  maintenance_charges:      "maintenanceCharges",
  inspection_required:      "inspectionRequired",
  inspection_date:          "inspectionDate",
  technician_type:          "technicianType",
  manager_approval:         "managerApproval",
  issue_identified:         "issueIdentified",
  supervisor_remarks:       "supervisorRemarks",
  repair_required:          "repairRequired",
  quotation_amount:         "quotationAmount",
  inventory_available:      "inventoryAvailable",
  gm_approval:              "gmApproval",
  landlord_consent:         "landlordConsent",
  finance_alert_generated:  "financeAlertGenerated",
  rent_adjustment_amount:   "rentAdjustmentAmount",
  electricity_meter_reading: "electricityMeterReading",
  water_meter_reading:      "waterMeterReading",
  gas_meter_reading:        "gasMeterReading",
  charge_type:              "chargeType",
  total_amount:             "totalAmount",
  payment_status:           "paymentStatus",
  payment_date:             "paymentDate",
  transaction_id:           "transactionId",
  finance_description:      "financeDescription",
  key_number:               "keyNumber",
  key_return:               "keyReturn",
  expected_return_date:     "expectedReturnDate",
  confirmation_received:    "confirmationReceived",
  key_return_date:          "keyReturnDate",
  key_return_status:        "keyReturnStatus",
  internal_comments:        "internalComments",
  tenant_remarks:           "tenantRemarks",
  special_instructions:     "specialInstructions",
};

// Maps each section to its PATCH endpoint key + the fields it accepts
const SECTION_FIELD_MAP = {
  information: [
    "assigned_employee_id",
    "check_out_date",
    "check_out_status",
    "remarks_notes",
  ],
  tenant_details: [
    "tenant_code",
    "tenant_name",
    "tenant_type",
    "tenant_mobile_number",
    "tenant_email",
    "tenant_civil_id",
    "tenant_passport_number",
    "tenant_nationality",
    "date_of_birth",
    "gender",
    "marital_status",
    "emergency_contact_name",
    "emergency_contact_number",
    "profession",
    "company_name",
  ],
  property_details: [
    "property_type",
    "property_code",
    "building_name",
    "flat_unit_number",
    "floor_number",
    "property_status",
  ],
  rental_details: [
    "monthly_rent",
    "security_deposit",
    "advance_rent_received",
    "first_month_rent_paid",
    "payment_mode",
    "maintenance_charges",
  ],
  property_inspection: [
    "inspection_required",
    "inspection_date",
    "technician_type",
    "manager_approval",
    "issue_identified",
    "supervisor_remarks",
  ],
  repair_damage: [
    "repair_required",
    "quotation_amount",
    "inventory_available",
    "gm_approval",
    "landlord_consent",
    "finance_alert_generated",
    "rent_adjustment_amount",
  ],
  utility_meter_readings: [
    "electricity_meter_reading",
    "water_meter_reading",
    "gas_meter_reading",
  ],
  finance_details: [
    "charge_type",
    "total_amount",
    "payment_status",
    "payment_date",
    "transaction_id",
    "finance_description",
  ],
  key_return: [
    "key_number",
    "key_return",
    "expected_return_date",
    "confirmation_received",
    "key_return_date",
    "key_return_status",
  ],
  comments: ["internal_comments", "tenant_remarks", "special_instructions"],
};

const FILE_FIELDS = [
  "meter_photo",
  "payment_proof",
  "tenant_id_proof",
  "passport_copy",
  "agreement_copy",
  "inspection_photos",
  "meter_reading_photos",
];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ─── Shared UI primitives ────────────────────────────────────────────────────

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

const FormField = ({ label, name, placeholder, as = "input", type = "text", defaultValue, children }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {as === "select" ? (
      <select style={fieldStyle} name={name} defaultValue={defaultValue ?? ""}>
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
    ) : (
      <input style={fieldStyle} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} />
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

const FileField = ({ label, name }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type="file" name={name} style={{ ...fieldStyle, padding: "7px 8px" }} />
  </div>
);

const DateField = ({ label, name, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type="date" name={name} defaultValue={defaultValue} style={fieldStyle} />
  </div>
);

// ─── Main component ──────────────────────────────────────────────────────────

const CheckOutInformationForm = () => {
  const location = useLocation();
  const backPath = "/check-out-dashboard";

  const params = new URLSearchParams(location.search);
  const id     = params.get("id");

  const { item, loading, create, updateSections, fetchItem } = useCheckOut({ id });
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [properties, setProperties]             = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [tenants, setTenants]             = useState([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [selectedTenantId, setSelectedTenantId] = useState("");

  // Fetch properties list
  useEffect(() => {
    let cancelled = false;
    checkInApi
      .get("/property/get_all/")
      .then((res) => { if (!cancelled) setProperties(res.data?.data?.data ?? []); })
      .catch(() => { if (!cancelled) setProperties([]); })
      .finally(() => { if (!cancelled) setPropertiesLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Fetch tenants list (all pages)
  useEffect(() => {
    let cancelled = false;
    const fetchAllTenants = async () => {
      try {
        const base    = "/lead/get_all/?filter_key=purpose&filter_value=tenant";
        const first   = await checkInApi.get(base);
        const payload = first.data?.data ?? {};
        const totalPages = payload.totalPage ?? 1;
        let all = payload.data ?? [];
        if (totalPages > 1) {
          const rest = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) =>
              checkInApi.get(`${base}&page_num=${i + 2}`).then((r) => r.data?.data?.data ?? [])
            )
          );
          all = all.concat(...rest);
        }
        if (!cancelled) setTenants(all);
      } catch {
        if (!cancelled) setTenants([]);
      } finally {
        if (!cancelled) setTenantsLoading(false);
      }
    };
    fetchAllTenants();
    return () => { cancelled = true; };
  }, []);

  // Sync dropdowns when editing an existing record
  useEffect(() => { if (item?.propertyId) setSelectedPropertyId(String(item.propertyId)); }, [item?.propertyId]);
  useEffect(() => { if (item?.tenantId)   setSelectedTenantId(String(item.tenantId)); },   [item?.tenantId]);

  // Autofill property fields when a property is selected
  const handlePropertyChange = (e) => {
    const pid = e.target.value;
    setSelectedPropertyId(pid);
    const property = properties.find((p) => String(p.propertyId) === pid);
    if (!property || !formRef.current) return;
    const set = (name, value) => {
      const el = formRef.current.elements[name];
      if (el && value !== null && value !== undefined && value !== "") el.value = String(value);
    };
    set("assigned_employee_id", property.assignedTo?.userId);
    set("property_type",        property.rentalType);
    set("building_name",        property.buildingDetails || property.propertyDetails?.buildingName);
    set("flat_unit_number",     property.flatNumber ?? property.flatData?.flatNumber);
    set("floor_number",         property.floor ?? property.flatData?.floorNumber);
    set("property_status",      property.propertyDetails?.currentStatus);
    set("monthly_rent",         property.propertyDetails?.monthlyRent ?? property.expectedRent);
    set("security_deposit",     property.propertyDetails?.securityDepositAmount);
    set("advance_rent_received", property.advanceAmountRent || property.propertyDetails?.advanceAmountRent);
    set("maintenance_charges",  property.propertyDetails?.otherCharges);
  };

  // Autofill tenant fields when a tenant is selected
  const handleTenantChange = (e) => {
    const tid = e.target.value;
    setSelectedTenantId(tid);
    const tenant = tenants.find((t) => String(t.leadId) === tid);
    if (!tenant || !formRef.current) return;
    const set = (name, value) => {
      const el = formRef.current.elements[name];
      if (el && value !== null && value !== undefined && value !== "") el.value = String(value);
    };
    const fullName = [tenant.firstName, tenant.lastName].filter(Boolean).join(" ");
    set("tenant_name",           fullName);
    set("tenant_mobile_number",  tenant.phoneNumber);
    set("tenant_civil_id",       tenant.civil_id);
    set("tenant_passport_number", tenant.passportOrId);
    set("tenant_nationality",    tenant.nationality);
  };

  const getValue = (name) => {
    const key   = FIELD_MAP[name];
    const value = key ? item?.[key] : undefined;
    return value === null || value === undefined ? "" : value;
  };

  // Hash-based scroll to section
  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [location.hash]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formEl   = formRef.current;
    const formData = new FormData(formEl);
    const payload  = {};

    // Separate file and text fields
    const fileUploads = [];
    for (const [k, v] of formData.entries()) {
      if (v instanceof File) {
        if (v.size > 0) fileUploads.push({ fieldName: k, file: v });
        continue;
      }
      if (v === "") continue;
      payload[k] = NUMERIC_FIELDS.includes(k) ? Number(v) : v;
    }

    try {
      setSubmitting(true);

      if (id) {
        // Update mode — split payload into per-section bodies
        const sections = {};
        for (const [sectionKey, fields] of Object.entries(SECTION_FIELD_MAP)) {
          const body = {};
          for (const field of fields) {
            if (payload[field] !== undefined) body[field] = payload[field];
          }
          sections[sectionKey] = body;
        }
        await updateSections(id, sections);

        // Upload any documents via document endpoint
        if (fileUploads.length > 0) {
          await Promise.all(
            fileUploads.map(async ({ file }) => {
              const base64 = await fileToBase64(file);
              return checkInApi.post(DOCUMENT_UPLOAD_ENDPOINT, {
                check_in_id:   Number(id),
                document_type: "Property Photo",
                document_name: file.name,
                file:          base64,
              });
            })
          );
        }

        await fetchItem();
        setSubmitting(false);
        toast.success("Check-Out updated successfully");
        alert("Check-Out updated successfully.");
      } else {
        // Create mode
        const res   = await create(payload);
        const newId = res?.data?.check_out_id;

        // Upload documents after creation if files selected
        if (fileUploads.length > 0 && newId) {
          await Promise.all(
            fileUploads.map(async ({ file }) => {
              const base64 = await fileToBase64(file);
              return checkInApi.post(DOCUMENT_UPLOAD_ENDPOINT, {
                check_in_id:   Number(newId),
                document_type: "Property Photo",
                document_name: file.name,
                file:          base64,
              });
            })
          );
        }

        setSubmitting(false);
        const successMsg = `Check-Out created successfully${newId ? ` (ID: ${newId})` : ""}.`;
        toast.success(successMsg);
        alert(successMsg);
      }
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
        <Button
          as={Link}
          to={backPath}
          variant="link"
          className="p-0 d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32, border: "1px solid #8a96a8", borderRadius: "50%", color: "#2f3848", textDecoration: "none" }}
        >
          <IconifyIcon icon="ri:arrow-left-s-line" width={20} height={20} />
        </Button>
        <h4 className="mb-0" style={{ color: "#526b89", fontSize: 20, fontWeight: 500 }}>
          Check-Out Information
        </h4>
      </div>

      <form key={loading ? "loading" : id || "new"} ref={formRef} onSubmit={handleSubmit}>
        <Row className="g-4 align-items-start">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <Col xs={12} lg={3}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: "0 10px 30px rgba(16,24,40,0.07)" }}>
              <CardBody style={{ padding: 24 }}>
                {loading ? (
                  <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <h5 className="mb-2" style={{ color: "#526b89", fontSize: 18, fontWeight: 700 }}>
                      {item?.tenantName || "Ali Z Shaikh"}
                    </h5>
                    <div className="d-flex flex-wrap gap-3 mb-4" style={{ color: "#526b89", fontSize: 14 }}>
                      <span>{item?.tenantEmail || "alishaikh@domain.com"}</span>
                      <span>{item?.tenantMobileNumber || "+91 102345XX89"}</span>
                    </div>
                  </>
                )}

                <Row className="g-3 mb-4">
                  <Col xs={6}>
                    <p className="mb-2" style={{ color: "#526b89", fontSize: 16, fontWeight: 700 }}>Check-Out Date</p>
                    <p className="mb-0" style={{ color: "#526b89", fontSize: 15 }}>{item?.checkOutDate || "12 April 2026"}</p>
                  </Col>
                  <Col xs={6}>
                    <p className="mb-2" style={{ color: "#526b89", fontSize: 16, fontWeight: 700 }}>Check-Out Status</p>
                    <p className="mb-0" style={{ color: "#526b89", fontSize: 15 }}>{item?.checkOutStatus || "Approved"}</p>
                  </Col>
                </Row>

                <h6 className="mb-3" style={{ color: "#526b89", fontSize: 17, fontWeight: 700 }}>Property Details</h6>
                <Row className="g-3 mb-4">
                  <Col xs={6}>
                    <p className="mb-1" style={{ color: "#526b89", fontSize: 15 }}>Property Type</p>
                    <p className="mb-0" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>{item?.propertyType || "Villa"}</p>
                  </Col>
                  <Col xs={6}>
                    <p className="mb-1" style={{ color: "#526b89", fontSize: 15 }}>Property Status</p>
                    <p className="mb-0" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>{item?.propertyStatus || "Reserved"}</p>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to={backPath}
                    variant="outline-secondary"
                    className="w-50"
                    style={{ borderColor: "#526b89", color: "#526b89", borderRadius: 5, height: 40 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-50"
                    disabled={submitting}
                    style={{ background: "#526b89", borderColor: "#526b89", borderRadius: 5, height: 40 }}
                  >
                    {submitting ? "Saving..." : "Submit"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* ── Main form ───────────────────────────────────────────────── */}
          <Col xs={12} lg={9}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: "0 10px 30px rgba(16,24,40,0.07)", overflow: "hidden" }}>
              <CardBody style={{ padding: 0 }}>
                <h3
                  className="mb-0"
                  style={{ color: "#526b89", fontSize: 26, fontWeight: 700, padding: "30px 36px 28px", borderBottom: "1px solid #edf0f3" }}
                >
                  Check-Out Information
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* A. Check-Out Information */}
                  <h5 id="check-out-information" style={sectionTitleStyle}>A. Check-Out Information</h5>
                  <Row className="g-3 mb-4">
                    <Col md={4}>
                      <div>
                        <label style={labelStyle}>Property ID *</label>
                        <select
                          name="property_id"
                          style={fieldStyle}
                          value={selectedPropertyId}
                          onChange={handlePropertyChange}
                        >
                          <option value="" disabled>
                            {propertiesLoading ? "Loading properties…" : "Select Property ID"}
                          </option>
                          {!propertiesLoading && properties.length === 0 && <option disabled>No properties available</option>}
                          {properties.map((p) => (
                            <option key={p.propertyId} value={String(p.propertyId)}>
                              {p.propertyId} – {p.buildingDetails || p.propertyDetails?.buildingName || ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Check-Out Code / ID"
                        name="check_out_code"
                        defaultValue={item?.checkOutCode ?? ""}
                        placeholder="Auto-Generated"
                      />
                    </Col>
                    <Col md={4}>
                      <DateField label="Check-Out Date *" name="check_out_date" defaultValue={getValue("check_out_date")} />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Check-Out Status *"
                        name="check_out_status"
                        defaultValue={getValue("check_out_status")}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Pending</option>
                        <option>Inspection Pending</option>
                        <option>Active</option>
                        <option>Approved</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Assigned Employee ID *"
                        name="assigned_employee_id"
                        defaultValue={getValue("assigned_employee_id")}
                        type="number"
                        placeholder="Employee Name"
                      />
                    </Col>
                    <Col md={12}>
                      <FormField
                        label="Remarks / Notes"
                        name="remarks_notes"
                        defaultValue={getValue("remarks_notes")}
                        placeholder="Enter initial remarks"
                      />
                    </Col>
                  </Row>

                  {/* B. Tenant Details */}
                  <h5 id="tenant-details" style={sectionTitleStyle}>B. Tenant Details</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <div>
                        <label style={labelStyle}>Tenant ID *</label>
                        <select
                          name="tenant_id"
                          style={fieldStyle}
                          value={selectedTenantId}
                          onChange={handleTenantChange}
                        >
                          <option value="" disabled>
                            {tenantsLoading ? "Loading tenants…" : "Select Tenant ID"}
                          </option>
                          {!tenantsLoading && tenants.length === 0 && <option disabled>No tenants available</option>}
                          {tenants.map((t) => (
                            <option key={t.leadId} value={String(t.leadId)}>
                              {t.leadId} – {[t.firstName, t.lastName].filter(Boolean).join(" ")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>
                    <Col md={4}>
                      <FormField label="Tenant Name" name="tenant_name" defaultValue={getValue("tenant_name")} placeholder="Full Name or Company Name" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Tenant Type" name="tenant_type" defaultValue={getValue("tenant_type")} placeholder="Select Type" as="select">
                        <option>Individual</option>
                        <option>Corporate</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField label="Mobile Number" name="tenant_mobile_number" defaultValue={getValue("tenant_mobile_number")} placeholder="01 2456 46547" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Email" name="tenant_email" defaultValue={getValue("tenant_email")} type="email" placeholder="email@domain.com" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Civil ID" name="tenant_civil_id" defaultValue={getValue("tenant_civil_id")} placeholder="Civil ID Number" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Passport Number" name="tenant_passport_number" defaultValue={getValue("tenant_passport_number")} placeholder="Passport Number" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Nationality" name="tenant_nationality" defaultValue={getValue("tenant_nationality")} placeholder="Select Nationality" as="select">
                        <option>Oman</option>
                        <option>India</option>
                        <option>United Arab Emirates</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField label="Date of Birth" name="date_of_birth" defaultValue={getValue("date_of_birth")} />
                    </Col>
                    <Col md={4}>
                      <FormField label="Gender" name="gender" defaultValue={getValue("gender")} placeholder="Select Gender" as="select">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField label="Marital Status" name="marital_status" defaultValue={getValue("marital_status")} placeholder="Select Status" as="select">
                        <option>Single</option>
                        <option>Married</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField label="Emergency Contact Name" name="emergency_contact_name" defaultValue={getValue("emergency_contact_name")} placeholder="Emergency Contact Name" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Emergency Contact Number" name="emergency_contact_number" defaultValue={getValue("emergency_contact_number")} placeholder="Emergency Contact Number" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Profession" name="profession" defaultValue={getValue("profession")} placeholder="Profession" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Company Name" name="company_name" defaultValue={getValue("company_name")} placeholder="Company Name" />
                    </Col>
                  </Row>

                  {/* C. Property Details */}
                  <h5 id="property-details" style={sectionTitleStyle}>C. Property Details</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField label="Property Type" name="property_type" defaultValue={getValue("property_type")} placeholder="Select Status" as="select">
                        <option>Villa</option>
                        <option>Warehouse</option>
                        <option>Flat</option>
                        <option>Commercial</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField label="Property Code" name="property_code" defaultValue={getValue("property_code")} placeholder="PRX123456" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Building Name" name="building_name" defaultValue={getValue("building_name")} placeholder="Building Name" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Flat / Unit Number" name="flat_unit_number" defaultValue={getValue("flat_unit_number")} placeholder="Unit Number" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Floor Number" name="floor_number" defaultValue={getValue("floor_number")} placeholder="Floor Number" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Property Status" name="property_status" defaultValue={getValue("property_status")} placeholder="Select Status" as="select">
                        <option>Reserved</option>
                        <option>Available</option>
                        <option>Occupied</option>
                        <option>Maintenance</option>
                      </FormField>
                    </Col>
                  </Row>

                  {/* D. Rental Details */}
                  <h5 id="rental-details" style={sectionTitleStyle}>D. Rental Details</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField label="Monthly Rent" name="monthly_rent" defaultValue={getValue("monthly_rent")} placeholder="Amount" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Security Deposit" name="security_deposit" defaultValue={getValue("security_deposit")} placeholder="Amount" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Advance Rent Received" name="advance_rent_received" defaultValue={getValue("advance_rent_received")} placeholder="Amount" />
                    </Col>
                    <Col md={4}>
                      <FormField label="First Month Rent Paid" name="first_month_rent_paid" defaultValue={getValue("first_month_rent_paid")} placeholder="Amount" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Payment Mode" name="payment_mode" defaultValue={getValue("payment_mode")} placeholder="Select Mode" as="select">
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                        <option>Online</option>
                        <option>Cheque</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField label="Maintenance Charges" name="maintenance_charges" defaultValue={getValue("maintenance_charges")} placeholder="Amount" />
                    </Col>
                  </Row>

                  {/* E. Property Inspection */}
                  <h5 id="property-inspection" style={sectionTitleStyle}>E. Property Inspection</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField label="Inspection Required" name="inspection_required" defaultValue={getValue("inspection_required")} placeholder="Select" as="select">
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField label="Inspection Date" name="inspection_date" defaultValue={getValue("inspection_date")} />
                    </Col>
                    <Col md={4}>
                      <FormField label="Technician Type" name="technician_type" defaultValue={getValue("technician_type")} placeholder="Technician Type" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Manager Approval" name="manager_approval" defaultValue={getValue("manager_approval")} placeholder="Select" as="select">
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </FormField>
                    </Col>
                    <Col md={12}>
                      <TextAreaField label="Issue Identified" name="issue_identified" defaultValue={getValue("issue_identified")} placeholder="Describe Issues" />
                    </Col>
                    <Col md={12}>
                      <TextAreaField label="Supervisor Remarks" name="supervisor_remarks" defaultValue={getValue("supervisor_remarks")} placeholder="Supervisor notes" />
                    </Col>
                  </Row>

                  {/* F. Repair & Damage */}
                  <h5 id="repair-damage" style={sectionTitleStyle}>F. Repair &amp; Damage</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField label="Repair Required" name="repair_required" defaultValue={getValue("repair_required")} placeholder="Select" as="select">
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField label="Quotation Amount" name="quotation_amount" defaultValue={getValue("quotation_amount")} placeholder="Amount" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Inventory Available" name="inventory_available" defaultValue={getValue("inventory_available")} placeholder="Select" as="select">
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField label="GM Approval" name="gm_approval" defaultValue={getValue("gm_approval")} placeholder="Select" as="select">
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField label="Landlord Consent" name="landlord_consent" defaultValue={getValue("landlord_consent")} placeholder="Select" as="select">
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField label="Finance Alert Generated" name="finance_alert_generated" defaultValue={getValue("finance_alert_generated")} placeholder="Select" as="select">
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField label="Rent Adjustment Amount" name="rent_adjustment_amount" defaultValue={getValue("rent_adjustment_amount")} placeholder="Amount" />
                    </Col>
                  </Row>

                  {/* G. Check-Out Utility Meter Readings */}
                  <h5 id="utility-meter-readings" style={sectionTitleStyle}>G. Check-Out Utility Meter Readings</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField label="Electricity Meter Reading" name="electricity_meter_reading" defaultValue={getValue("electricity_meter_reading")} placeholder="Reading Value" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Water Meter Reading" name="water_meter_reading" defaultValue={getValue("water_meter_reading")} placeholder="Reading Value" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Gas Meter Reading" name="gas_meter_reading" defaultValue={getValue("gas_meter_reading")} placeholder="Reading Value" />
                    </Col>
                    <Col md={12}>
                      <FileField label="Meter Photo Upload" name="meter_photo" />
                    </Col>
                  </Row>

                  {/* H. Finance Details */}
                  <h5 id="finance-details" style={sectionTitleStyle}>H. Finance Details</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField label="Charge Type" name="charge_type" defaultValue={getValue("charge_type")} placeholder="Select Type" as="select">
                        <option>Security Deposit Refund</option>
                        <option>Other</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField label="Total Amount" name="total_amount" defaultValue={getValue("total_amount")} placeholder="Enter Amount" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Payment Status" name="payment_status" defaultValue={getValue("payment_status")} placeholder="Select Status" as="select">
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Refunded</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField label="Payment Date" name="payment_date" defaultValue={getValue("payment_date")} />
                    </Col>
                    <Col md={4}>
                      <FormField label="Transaction ID" name="transaction_id" defaultValue={getValue("transaction_id")} placeholder="Enter Transaction ID" />
                    </Col>
                    <Col md={4}>
                      <FileField label="Payment Proof Upload" name="payment_proof" />
                    </Col>
                  </Row>

                  {/* I. Key Return */}
                  <h5 id="key-return" style={sectionTitleStyle}>I. Key Return</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField label="Key Number" name="key_number" defaultValue={getValue("key_number")} placeholder="Key ID" />
                    </Col>
                    <Col md={4}>
                      <FormField label="Key Return" name="key_return" defaultValue={getValue("key_return")} placeholder="Select Status" as="select">
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField label="Expected Return Date" name="expected_return_date" defaultValue={getValue("expected_return_date")} />
                    </Col>
                    <Col md={4}>
                      <FormField label="Confirmation Received" name="confirmation_received" defaultValue={getValue("confirmation_received")} placeholder="Select" as="select">
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField label="Key Return Date" name="key_return_date" defaultValue={getValue("key_return_date")} />
                    </Col>
                    <Col md={4}>
                      <FormField label="Key Return Status" name="key_return_status" defaultValue={getValue("key_return_status")} placeholder="Select Status" as="select">
                        <option>Pending</option>
                        <option>Returned</option>
                        <option>Lost</option>
                      </FormField>
                    </Col>
                  </Row>

                  {/* J. Documents Upload */}
                  <h5 id="documents-upload" style={sectionTitleStyle}>J. Documents Upload</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}><FileField label="Tenant ID Proof"        name="tenant_id_proof" /></Col>
                    <Col md={4}><FileField label="Passport Copy"          name="passport_copy" /></Col>
                    <Col md={4}><FileField label="Agreement Copy"         name="agreement_copy" /></Col>
                    <Col md={4}><FileField label="Inspection Photos"      name="inspection_photos" /></Col>
                    <Col md={4}><FileField label="Meter Reading Photos"   name="meter_reading_photos" /></Col>
                  </Row>

                  {/* K. Comments */}
                  <h5 id="comments" style={sectionTitleStyle}>K. Comments</h5>
                  <Row className="g-4 mb-4">
                    <Col md={12}>
                      <TextAreaField label="Internal Comments" name="internal_comments" defaultValue={getValue("internal_comments")} placeholder="For Internal Staff Only" />
                    </Col>
                    <Col md={12}>
                      <TextAreaField label="Tenant Remarks" name="tenant_remarks" defaultValue={getValue("tenant_remarks")} placeholder="Feedback or Notes from tenant" />
                    </Col>
                    <Col md={12}>
                      <TextAreaField label="Special Instructions" name="special_instructions" defaultValue={getValue("special_instructions")} placeholder="Any special instruction for this check-out" />
                    </Col>
                  </Row>

                  {/* L. System Fields (Auto) */}
                  <h5 id="system-fields" style={sectionTitleStyle}>L. System Fields (Auto)</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField label="Created By" defaultValue={item?.createdBy?.name ?? item?.createdBy ?? "System Admin"} placeholder="System Admin" />
                    </Col>
                    <Col md={4}>
                      <DateField label="Created Date" defaultValue={item?.createdAt ? String(item.createdAt).split("T")[0] : ""} />
                    </Col>
                    <Col md={4}>
                      <FormField label="Updated By" defaultValue={item?.updatedById ?? "Auto"} placeholder="Auto" />
                    </Col>
                    <Col md={4}>
                      <DateField label="Updated Date" defaultValue={item?.updatedAt ? String(item.updatedAt).split("T")[0] : ""} />
                    </Col>
                    {item?.statusHistory && (
                      <Col md={12}>
                        <FormField label="Status History" defaultValue={item.statusHistory} placeholder="Status History" />
                      </Col>
                    )}
                  </Row>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      as={Link}
                      to={backPath}
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

export default CheckOutInformationForm;
