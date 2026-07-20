import IconifyIcon from "@/components/wrappers/IconifyIcon";
import checkInApi from "@/helpers/checkInApi";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactSelect from "react-select";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckIn from "@/hooks/useCheckIn";

// Fields the API expects as a number rather than a string.
const NUMERIC_FIELDS = [
  "property_id",
  "tenant_id",
  "assigned_employee_id",
  "recommended_by_id",
  "approved_by_id",
  "number_of_occupants",
];

// GET /checkin-checkout/check_in/get/ returns camelCase keys; the form
// fields (and create/update payloads) use snake_case. This maps form
// field name -> response key so fetched records can prefill the form.
const FIELD_MAP = {
  property_id: "propertyId",
  check_in_date: "checkInDate",
  check_in_status: "checkInStatus",
  assigned_employee_id: "assignedEmployeeId",
  remarks_notes: "remarksNotes",
  tenant_id: "tenantId",
  tenant_code: "tenantCode",
  tenant_name: "tenantName",
  tenant_type: "tenantType",
  tenant_mobile_number: "tenantMobileNumber",
  tenant_email: "tenantEmail",
  tenant_civil_id: "tenantCivilId",
  tenant_passport_number: "tenantPassportNumber",
  tenant_nationality: "tenantNationality",
  date_of_birth: "dateOfBirth",
  gender: "gender",
  marital_status: "maritalStatus",
  alternate_mobile_number: "alternateMobileNumber",
  emergency_contact_name: "emergencyContactName",
  emergency_contact_number: "emergencyContactNumber",
  profession: "profession",
  company_name: "companyName",
  move_in_reason: "moveInReason",
  number_of_occupants: "numberOfOccupants",
  property_type: "propertyType",
  property_code: "propertyCode",
  building_name: "buildingName",
  flat_unit_number: "flatUnitNumber",
  floor_number: "floorNumber",
  property_status: "propertyStatus",
  monthly_rent: "monthlyRent",
  security_deposit: "securityDeposit",
  advance_rent_received: "advanceRentReceived",
  first_month_rent_paid: "firstMonthRentPaid",
  payment_mode: "paymentMode",
  maintenance_charges: "maintenanceCharges",
  inspection_required: "inspectionRequired",
  inspection_date: "inspectionDate",
  technician_type: "technicianType",
  manager_approval: "managerApproval",
  issue_identified: "issueIdentified",
  supervisor_remarks: "supervisorRemarks",
  inspection_type: "inspectionType",
  inspection_duration: "inspectionDuration",
  next_inspection_due: "nextInspectionDue",
  repair_required: "repairRequired",
  quotation_amount: "quotationAmount",
  inventory_available: "inventoryAvailable",
  gm_approval: "gmApproval",
  landlord_consent: "landlordConsent",
  finance_alert_generated: "financeAlertGenerated",
  rent_adjustment_amount: "rentAdjustmentAmount",
  recommended_by_id: "recommendedById",
  approved_by_id: "approvedById",
  approved_on: "approvedOn",
  inspector_comments: "inspectorComments",
  electricity_meter_reading: "electricityMeterReading",
  water_meter_reading: "waterMeterReading",
  gas_meter_reading: "gasMeterReading",
  agreement_type: "agreementType",
  agreement_status: "agreementStatus",
  agreement_start_date: "agreementStartDate",
  agreement_end_date: "agreementEndDate",
  agreement_document: "agreementDocument",
  internal_comments: "internalComments",
  tenant_remarks: "tenantRemarks",
  special_instructions: "specialInstructions",
  key_number: "keyNumber",
  key_available: "keyAvailable",
  key_booking_date: "keyBookingDate",
  confirmation_received: "confirmationReceived",
  key_delivery_date: "keyDeliveryDate",
  key_handover_status: "keyHandoverStatus",
};

// Maps each section to its dedicated PATCH endpoint
// (/checkin-checkout/check_in/update/<key>/). There's no single
// whole-record update endpoint — every section saves independently.
const SECTION_FIELD_MAP = {
  information: [
    "assigned_employee_id",
    "check_in_date",
    "check_in_status",
    "remarks_notes",
    "property_id",
  ],
  tenant_details: [
    "tenant_code",
    "tenant_name",
    "tenant_mobile_number",
    "tenant_email",
    "tenant_civil_id",
    "tenant_passport_number",
    "tenant_nationality",
    "date_of_birth",
    "gender",
    "marital_status",
    "alternate_mobile_number",
    "emergency_contact_name",
    "emergency_contact_number",
    "profession",
    "company_name",
    "move_in_reason",
    "number_of_occupants",
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
    "inspection_type",
    "inspection_duration",
    "next_inspection_due",
  ],
  repair_approval: [
    "repair_required",
    "quotation_amount",
    "inventory_available",
    "gm_approval",
    "landlord_consent",
    "finance_alert_generated",
    "rent_adjustment_amount",
    "recommended_by_id",
    "approved_by_id",
    "approved_on",
    "inspector_comments",
  ],
  utility_meter_readings: [
    "electricity_meter_reading",
    "water_meter_reading",
    "gas_meter_reading",
  ],
  agreement_details: [
    "agreement_type",
    "agreement_status",
    "agreement_start_date",
    "agreement_end_date",
    "agreement_document",
  ],
  key_handover: [
    "key_number",
    "key_available",
    "key_booking_date",
    "confirmation_received",
    "key_delivery_date",
    "key_handover_status",
  ],
  comments: ["internal_comments", "tenant_remarks", "special_instructions"],
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

const countrySelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#f9f9fc",
    border: "1px solid #e7e9ef",
    borderRadius: 5,
    minHeight: 46,
    fontSize: 16,
    boxShadow: "none",
    "&:hover": { border: "1px solid #e7e9ef" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#526b89" : state.isFocused ? "#f0f0f0" : "#fff",
    color: state.isSelected ? "#fff" : "#526b89",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#526b89" }),
  placeholder: (base) => ({ ...base, color: "#aab4be", fontWeight: "400" }),
  indicatorSeparator: () => ({ display: "none" }),
};

const sectionTitleStyle = {
  color: "#526b89",
  fontSize: 21,
  fontWeight: 700,
  borderBottom: "1px solid #dfe3e8",
  paddingBottom: 22,
  marginBottom: 30,
  scrollMarginTop: 110,
};

const FormField = ({
  label,
  name,
  placeholder,
  as = "input",
  type = "text",
  defaultValue,
  children,
}) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {as === "select" ? (
      <select style={selectFieldStyle} name={name} defaultValue={defaultValue ?? ""}>
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
    ) : (
      <input
        style={fieldStyle}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    )}
  </div>
);

const AmountField = ({ label, name, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div style={{ display: "flex", alignItems: "center", border: "1px solid #e7e9ef", borderRadius: 5, overflow: "hidden", background: "#f9f9fc" }}>
      <span style={{ padding: "0 12px", height: 46, display: "flex", alignItems: "center", background: "#e7e9ef", color: "#526b89", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>OMR</span>
      <input
        name={name}
        type="number"
        defaultValue={defaultValue}
        placeholder="0.000"
        style={{ ...fieldStyle, border: "none", borderRadius: 0, background: "transparent", flex: 1 }}
      />
    </div>
  </div>
);

const TextAreaField = ({ label, name, placeholder, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      style={{
        ...fieldStyle,
        minHeight: 94,
        height: "auto",
        resize: "none",
      }}
    />
  </div>
);

const FileField = ({ label, name }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type="file"
      name={name}
      style={{
        ...fieldStyle,
        padding: "7px 8px",
      }}
    />
  </div>
);

const DateField = ({ label, name, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type="date"
      name={name}
      defaultValue={defaultValue}
      style={fieldStyle}
    />
  </div>
);

const CheckInInformationForm = ({ mode = "check-in" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCheckOut = mode === "check-out";
  const flowTitle = isCheckOut ? "Check-Out" : "Check-In";

  // read id from query param ?id=123
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const dashboardPath = id
    ? (isCheckOut ? `/check-out-details?id=${id}&tab=overview` : `/check-in-information?id=${id}&tab=overview`)
    : (isCheckOut ? "/check-out-list" : "/check-in-list");

  const { item, loading, create, updateSections, fetchItem } = useCheckIn({ id });
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [tenants, setTenants] = useState([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [selectedNationalityId, setSelectedNationalityId] = useState(null);
  const [selectedNationalityValue, setSelectedNationalityValue] = useState(null);

  useEffect(() => {
    let cancelled = false;
    checkInApi
      .get("/property/get_all/")
      .then((res) => {
        if (!cancelled) {
          const all = res.data?.data?.data ?? [];
          const unassigned = all.filter((p) => {
            const status = p.propertyDetails?.currentStatus ?? p.currentStatus ?? "";
            return !status || status === "Available" || status === "Vacant";
          });
          setProperties(unassigned);
        }
      })
      .catch(() => {
        if (!cancelled) setProperties([]);
      })
      .finally(() => {
        if (!cancelled) setPropertiesLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchAllTenants = async () => {
      try {
        const base = "/lead/get_all/?filter_key=purpose&filter_value=tenant";
        const first = await checkInApi.get(base);
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

  useEffect(() => {
    let cancelled = false;
    checkInApi
      .get("/marketing/manager/get_all/")
      .then((res) => {
        if (!cancelled) setEmployees(res.data?.data?.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setEmployees([]);
      })
      .finally(() => {
        if (!cancelled) setEmployeesLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

 useEffect(() => {
  let cancelled = false;

  checkInApi
    .get("/helper/nationality/get_all?limit=999999")
    .then((res) => {
      if (cancelled) return;

      const list = res.data?.data?.data ?? [];

      const options = list.map((n) => ({
        value: n.nationalityId,
        label: n.name,
      }));

      setNationalityOptions(options);
    })
    .catch(() => {
      if (!cancelled) setNationalityOptions([]);
    });

  return () => {
    cancelled = true;
  };
}, []);

  // Sync dropdowns with loaded item in edit mode (runs after item is fetched)
  useEffect(() => {
    if (item?.propertyId) setSelectedPropertyId(String(item.propertyId));
  }, [item?.propertyId]);

  useEffect(() => {
    if (item?.tenantId) setSelectedTenantId(String(item.tenantId));
  }, [item?.tenantId]);

  useEffect(() => {
    if (item?.assignedEmployeeId) setSelectedEmployeeId(String(item.assignedEmployeeId));
  }, [item?.assignedEmployeeId]);

  const setNationalitySelection = useCallback((nationality) => {
  if (!nationality) {
    setSelectedNationalityId(null);
    setSelectedNationalityValue(null);
    return;
  }

  const option = nationalityOptions.find(
    (o) => o.label === nationality
  );

  if (option) {
    setSelectedNationalityId(option.value);
    setSelectedNationalityValue(option);
  }
}, [nationalityOptions]);
  useEffect(() => {
    if (item?.tenantNationality && nationalityOptions.length > 0) {
      setNationalitySelection(item.tenantNationality);
    }
  }, [item?.tenantNationality, nationalityOptions, setNationalitySelection]);

  const handlePropertyChange = (e) => {
    const pid = e.target.value;
    setSelectedPropertyId(pid);

    const property = properties.find((p) => String(p.propertyId) === pid);
    if (!property || !formRef.current) return;

    const setField = (name, value) => {
      const el = formRef.current.elements[name];
      if (el && value !== null && value !== undefined && value !== "") {
        el.value = String(value);
      }
    };

    if (property.assignedTo?.userId) {
      setSelectedEmployeeId(String(property.assignedTo.userId));
    }
    setField("property_type", property.rentalType);
    setField("building_name", property.buildingDetails || property.propertyDetails?.buildingName);
    setField("flat_unit_number", property.flatNumber ?? property.flatData?.flatNumber);
    setField("floor_number", property.floor ?? property.flatData?.floorNumber);
    setField("property_status", property.propertyDetails?.currentStatus);
    setField("monthly_rent", property.propertyDetails?.monthlyRent ?? property.expectedRent);
    setField("security_deposit", property.propertyDetails?.securityDepositAmount);
    setField("advance_rent_received", property.advanceAmountRent || property.propertyDetails?.advanceAmountRent);
    setField("maintenance_charges", property.propertyDetails?.otherCharges);
  };

  const handleTenantChange = async (e) => {
    const tid = e.target.value;
    setSelectedTenantId(tid);

    const summary = tenants.find((t) => String(t.leadId) === tid);
    if (!summary || !formRef.current) return;

    const setField = (name, value) => {
      const el = formRef.current?.elements[name];
      if (el && value !== null && value !== undefined && value !== "") {
        el.value = String(value);
      }
    };

    // Prefill from list data immediately (fields available in get_all)
    const fullName = [summary.firstName, summary.lastName].filter(Boolean).join(" ");
    setField("tenant_name",          fullName);
    setField("tenant_mobile_number", summary.phoneNumber);
    setField("tenant_civil_id",      summary.civil_id);
    setField("tenant_passport_number", summary.passportOrId);
    // setField("tenant_nationality",   summary.nationality);
    

    // Fetch full lead record for fields not returned by get_all
    try {
      const res = await checkInApi.get(`/lead/get/?lead_id=${tid}`);
      const lead = res.data?.data ?? res.data ?? {};

      setNationalitySelection(lead.nationality ?? summary.nationality);
      // Defer DOM writes until after React's render cycle triggered by setSelectedTenantId
      setTimeout(() => {
        if (!formRef.current) return;
        setField("tenant_code",              lead.tenantCode);
        setField("tenant_email",             lead.email);
        setField("tenant_civil_id",          lead.civil_id          ?? lead.civilId);
        setField("tenant_passport_number",   lead.passportOrId);
        setField("tenant_nationality",       lead.nationality);
        setField("tenant_type",              lead.leadCategory);
        setField("date_of_birth",            lead.dateOfBirth);
        setField("gender",                   lead.gender);
        setField("marital_status",           lead.maritalStatus);
        setField("alternate_mobile_number",  lead.alternateMobileNumber);
        setField("emergency_contact_name",   lead.emergencyContactName);
        setField("emergency_contact_number", lead.emergencyContactNumber);
        setField("profession",               lead.profession);
        setField("company_name",             lead.companyName);
      }, 0);
    } catch {
      // full record unavailable � list-level fields already filled above
    }
  };

  const getValue = (name) => {
    const key = FIELD_MAP[name];
    const value = key ? item?.[key] : undefined;
    return value === null || value === undefined ? "" : value;
  };

  useEffect(() => {
    if (!location.hash) return;

    const section = document.getElementById(location.hash.slice(1));
    section?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [location.hash]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formEl = formRef.current;
    const formData = new FormData(formEl);
    const payload = {};

    for (const [k, v] of formData.entries()) {
      if (v instanceof File) continue; // no uploads in this form yet
      if (v === "") continue;
      payload[k] = NUMERIC_FIELDS.includes(k) ? Number(v) : v;
    }
    if (selectedNationalityId != null) payload["tenant_nationality"] = selectedNationalityId;
       console.log("Payload =", payload);

    try {
      setSubmitting(true);
      if (id) {
        const sections = {};
        for (const [sectionKey, fields] of Object.entries(SECTION_FIELD_MAP)) {
          const body = {};
          for (const field of fields) {
            if (payload[field] !== undefined) body[field] = payload[field];
          }
          sections[sectionKey] = body;
        }
        await updateSections(id, sections);
        await fetchItem();
        setSubmitting(false);
        toast.success(`${flowTitle} updated successfully`);
        navigate(isCheckOut ? "/check-out-list" : "/check-in-list");
      } else {
        await create(payload);
        setSubmitting(false);
        toast.success(`${flowTitle} created successfully`);
        navigate(isCheckOut ? "/check-out-list" : "/check-in-list");
      }
    } catch (err) {
      setSubmitting(false);
      console.error(`${flowTitle} submit failed`, err);
      const res = err?.response?.data;
      const message = res ? JSON.stringify(res) : err?.message || "Something went wrong";
      toast.error(message);
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
          style={{
            width: 32,
            height: 32,
            border: "1px solid #8a96a8",
            borderRadius: "50%",
            color: "#2f3848",
            textDecoration: "none",
          }}
        >
          <IconifyIcon icon="ri:arrow-left-s-line" width={20} height={20} />
        </Button>
        <h4
          className="mb-0"
          style={{ color: "#526b89", fontSize: 20, fontWeight: 500 }}
        >
          {flowTitle} Information
        </h4>
      </div>

      <form
        key={loading ? "loading" : id || "new"}
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <Row className="g-4 align-items-start">
          <Col xs={12} lg={3}>
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: 10,
                boxShadow: "0 10px 30px rgba(16, 24, 40, 0.07)",
              }}
            >
              <CardBody style={{ padding: 24 }}>
                {loading ? (
                  <div
                    style={{
                      padding: 24,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <h5
                      className="mb-2"
                      style={{
                        color: "#526b89",
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      {item?.tenantName || "Ali Z Shaikh"}
                    </h5>
                    <div
                      className="d-flex flex-wrap gap-3 mb-4"
                      style={{ color: "#526b89", fontSize: 14 }}
                    >
                      <span>{item?.tenantEmail || "alishaikh@domain.com"}</span>
                      <span>{item?.tenantMobileNumber || "+91 102345XX89"}</span>
                    </div>
                  </>
                )}

                <Row className="g-3 mb-4">
                  <Col xs={6}>
                    <p
                      className="mb-2"
                      style={{
                        color: "#526b89",
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      {flowTitle} Date
                    </p>
                    <p
                      className="mb-0"
                      style={{ color: "#526b89", fontSize: 15 }}
                    >
                      {item?.checkInDate || "12 April 2026"}
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p
                      className="mb-2"
                      style={{
                        color: "#526b89",
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      {flowTitle} Status
                    </p>
                    <p
                      className="mb-0"
                      style={{ color: "#526b89", fontSize: 15 }}
                    >
                      {item?.checkInStatus || "Approved"}
                    </p>
                  </Col>
                </Row>

                <h6
                  className="mb-3"
                  style={{ color: "#526b89", fontSize: 17, fontWeight: 700 }}
                >
                  Property Details
                </h6>
                <Row className="g-3 mb-4">
                  <Col xs={6}>
                    <p
                      className="mb-1"
                      style={{ color: "#526b89", fontSize: 15 }}
                    >
                      Property Type
                    </p>
                    <p
                      className="mb-0"
                      style={{
                        color: "#526b89",
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      {item?.propertyType || "Villa"}
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p
                      className="mb-1"
                      style={{ color: "#526b89", fontSize: 15 }}
                    >
                      Property Status
                    </p>
                    <p
                      className="mb-0"
                      style={{
                        color: "#526b89",
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      {item?.propertyStatus || "Reserved"}
                    </p>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to={dashboardPath}
                    variant="outline-secondary"
                    className="w-50"
                    style={{
                      borderColor: "#526b89",
                      color: "#526b89",
                      borderRadius: 5,
                      height: 40,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-50"
                    disabled={submitting}
                    style={{
                      background: "#526b89",
                      borderColor: "#526b89",
                      borderRadius: 5,
                      height: 40,
                    }}
                  >
                    {submitting ? "Saving..." : "Submit"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xs={12} lg={9}>
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: 10,
                boxShadow: "0 10px 30px rgba(16, 24, 40, 0.07)",
                overflow: "hidden",
              }}
            >
              <CardBody style={{ padding: 0 }}>
                <h3
                  className="mb-0"
                  style={{
                    color: "#526b89",
                    fontSize: 26,
                    fontWeight: 700,
                    padding: "30px 36px 28px",
                    borderBottom: "1px solid #edf0f3",
                  }}
                >
                  {flowTitle} Information
                </h3>

                <div style={{ padding: "34px 36px" }}>
                  {/* error UI removed to keep page clean; check hook `error` for debugging */}
                  <h5 id="check-in-information" style={sectionTitleStyle}>
                    A. {flowTitle} Information
                  </h5>
                  <Row className="g-3 mb-4">
                    <Col md={4}>
                      <div>
                        <label style={labelStyle}>Property ID *</label>
                        <select
                          name="property_id"
                          style={selectFieldStyle}
                          value={selectedPropertyId}
                          onChange={handlePropertyChange}
                        >
                          <option value="" disabled>
                            {propertiesLoading ? "Loading properties…" : "Select Property ID"}
                          </option>
                          {!propertiesLoading && properties.length === 0 && (
                            <option disabled>No properties available</option>
                          )}
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
                        label="Property Assignment ID"
                        name="property_assignment_id"
                        defaultValue={getValue("property_assignment_id")}
                        type="number"
                        placeholder="Assignment ID"
                      />
                    </Col>
                    <Col md={4}>
                      <DateField
                        label={`${flowTitle} Date *`}
                        name="check_in_date"
                        defaultValue={getValue("check_in_date")}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label={`${flowTitle} Status *`}
                        name="check_in_status"
                        defaultValue={getValue("check_in_status")}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Key Pending</option>
                        <option>Active</option>
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
                        placeholder="Employee ID"
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

                  <h5 id="tenant-details" style={sectionTitleStyle}>
                    A. Tenant Details
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <div>
                        <label style={labelStyle}>Tenant ID *</label>
                        <select
                          name="tenant_id"
                          style={selectFieldStyle}
                          value={selectedTenantId}
                          onChange={handleTenantChange}
                        >
                          <option value="" disabled>
                            {tenantsLoading ? "Loading tenants…" : "Select Tenant ID"}
                          </option>
                          {!tenantsLoading && tenants.length === 0 && (
                            <option disabled>No tenants available</option>
                          )}
                          {tenants.map((t) => (
                            <option key={t.leadId} value={String(t.leadId)}>
                              {t.leadId} – {[t.firstName, t.lastName].filter(Boolean).join(" ")}
                            </option>
                          ))}
                        </select>
                      </div>
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
                        label="Tenant Category"
                        name="tenant_type"
                        defaultValue={getValue("tenant_type")}
                        placeholder="Select Category"
                        as="select"
                      >
                        <option>Married</option>
                        <option>Bachelor</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Mobile Number"
                        name="tenant_mobile_number"
                        defaultValue={getValue("tenant_mobile_number")}
                        placeholder="01 2456 46547"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Email"
                        name="tenant_email"
                        defaultValue={getValue("tenant_email")}
                        type="email"
                        placeholder="email@domain.com"
                      />
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
                      <div>
                        <label style={labelStyle}>Nationality</label>
                        <ReactSelect
                          options={nationalityOptions}
                          styles={countrySelectStyles}
                          placeholder="Select Nationality"
                          value={selectedNationalityValue}
                          onChange={(selected) => {
                            setSelectedNationalityId(selected?.value ?? null);
                            setSelectedNationalityValue(selected);
                          }}
                          isClearable={false}
                          noOptionsMessage={() => nationalityOptions.length === 0 ? "Loading..." : "No options"}
                        />
                        <input
                          type="hidden"
                          name="tenant_nationality"
                          value={selectedNationalityId ?? ""}
                        />
                      </div>
                    </Col>


                    <Col md={4}>
                      <DateField label="Date of Birth" name="date_of_birth" defaultValue={getValue("date_of_birth")} />
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
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Alternate Mobile Number"
                        name="alternate_mobile_number"
                        defaultValue={getValue("alternate_mobile_number")}
                        placeholder="Alternate Mobile Number"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Emergency Contact Name"
                        name="emergency_contact_name"
                        defaultValue={getValue("emergency_contact_name")}
                        placeholder="Emergency Contact Name"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Emergency Contact Number"
                        name="emergency_contact_number"
                        defaultValue={getValue("emergency_contact_number")}
                        placeholder="Emergency Contact Number"
                      />
                    </Col>
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
                        placeholder="Move-In Reason"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Number of Occupants"
                        name="number_of_occupants"
                        defaultValue={getValue("number_of_occupants")}
                        type="number"
                        placeholder="0"
                      />
                    </Col>
                  </Row>

                  <h5 id="check-in-information" style={sectionTitleStyle}>
                    B. {flowTitle} Information
                  </h5>
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
                          {!propertiesLoading && properties.length === 0 && (
                            <option disabled>No properties available</option>
                          )}
                          {properties.map((p) => (
                            <option key={p.propertyId} value={String(p.propertyId)}>
                              {p.propertyId} – {p.buildingDetails || p.propertyDetails?.buildingName || ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>
                    <Col md={4}>
                      <DateField
                        label={`${flowTitle} Date *`}
                        name="check_in_date"
                        defaultValue={getValue("check_in_date") || (!id ? new Date().toISOString().split("T")[0] : "")}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label={`${flowTitle} Status *`}
                        name="check_in_status"
                        defaultValue={getValue("check_in_status")}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Key Pending</option>
                        <option>Active</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <div>
                        <label style={labelStyle}>Assigned Employee *</label>
                        <select
                          name="assigned_employee_id"
                          style={fieldStyle}
                          value={selectedEmployeeId}
                          onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        >
                          <option value="" disabled>
                            {employeesLoading ? "Loading employees…" : "Select Employee"}
                          </option>
                          {!employeesLoading && employees.length === 0 && (
                            <option disabled>No employees available</option>
                          )}
                          {employees.map((emp) => (
                            <option key={emp.managerId ?? emp.userId} value={String(emp.managerId ?? emp.userId)}>
                              {emp.name}
                            </option>
                          ))}
                        </select>
                      </div>
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

                  <h5 id="property-details" style={sectionTitleStyle}>
                    C. Property Details
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Property Type"
                        name="property_type"
                        defaultValue={getValue("property_type")}
                        placeholder="Select Status"
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

                  <h5 id="rental-details" style={sectionTitleStyle}>
                    D. Rental Details
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

                  <h5 id="property-inspection" style={sectionTitleStyle}>
                    E. Property Inspection
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Inspection Required"
                        name="inspection_required"
                        defaultValue={getValue("inspection_required")}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Inspection Date"
                        name="inspection_date"
                        defaultValue={getValue("inspection_date")}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Inspection Type"
                        name="inspection_type"
                        defaultValue={getValue("inspection_type")}
                        placeholder="Select Type"
                        as="select"
                      >
                        <option>Move-In Inspection</option>
                        <option>Move-Out Inspection</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Technician Type"
                        name="technician_type"
                        defaultValue={getValue("technician_type")}
                        placeholder="Technician Type"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Inspection Duration"
                        name="inspection_duration"
                        defaultValue={getValue("inspection_duration")}
                        placeholder="e.g. 45 mins"
                      />
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Next Inspection Due"
                        name="next_inspection_due"
                        defaultValue={getValue("next_inspection_due")}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Manager Approval"
                        name="manager_approval"
                        defaultValue={getValue("manager_approval")}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </FormField>
                    </Col>
                    <Col md={12}>
                      <TextAreaField
                        label="Issue Identified"
                        name="issue_identified"
                        defaultValue={getValue("issue_identified")}
                        placeholder="Describe Issues"
                      />
                    </Col>
                    <Col md={12}>
                      <TextAreaField
                        label="Supervisor Remarks"
                        name="supervisor_remarks"
                        defaultValue={getValue("supervisor_remarks")}
                        placeholder="Supervisor notes"
                      />
                    </Col>
                  </Row>

                  <h5 id="repair-approval" style={sectionTitleStyle}>
                    F. Repair &amp; Approval
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Repair Required"
                        name="repair_required"
                        defaultValue={getValue("repair_required")}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <AmountField
                        label="Quotation Amount"
                        name="quotation_amount"
                        defaultValue={getValue("quotation_amount")}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Inventory Available"
                        name="inventory_available"
                        defaultValue={getValue("inventory_available")}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="GM Approval"
                        name="gm_approval"
                        defaultValue={getValue("gm_approval")}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Landlord Consent"
                        name="landlord_consent"
                        defaultValue={getValue("landlord_consent")}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Finance Alert Generated"
                        name="finance_alert_generated"
                        defaultValue={getValue("finance_alert_generated")}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Rent Adjustment Amount"
                        name="rent_adjustment_amount"
                        defaultValue={getValue("rent_adjustment_amount")}
                        placeholder="Amount"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Assign Repair Employee"
                        name="recommended_by_id"
                        defaultValue={getValue("recommended_by_id")}
                        type="number"
                        placeholder="assign repair employee"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Approved By (Employee ID)"
                        name="approved_by_id"
                        defaultValue={getValue("approved_by_id")}
                        type="number"
                        placeholder="Employee ID"
                      />
                    </Col>
                    <Col md={12}>
                      <TextAreaField
                        label="Inspector Comments"
                        name="inspector_comments"
                        defaultValue={getValue("inspector_comments")}
                        placeholder="Inspector comments"
                      />
                    </Col>
                  </Row>

                  <h5 id="utility-meter-readings" style={sectionTitleStyle}>
                    G. Utility Meter Readings
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Electricity Meter Reading"
                        name="electricity_meter_reading"
                        defaultValue={getValue("electricity_meter_reading")}
                        placeholder="Reading Value"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Water Meter Reading"
                        name="water_meter_reading"
                        defaultValue={getValue("water_meter_reading")}
                        placeholder="Reading Value"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Gas Meter Reading"
                        name="gas_meter_reading"
                        defaultValue={getValue("gas_meter_reading")}
                        placeholder="Reading Value"
                      />
                    </Col>
                  </Row>

                  <h5 id="agreement-details" style={sectionTitleStyle}>
                    H. Agreement Details
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Agreement Type"
                        name="agreement_type"
                        defaultValue={getValue("agreement_type")}
                        placeholder="Select Type"
                        as="select"
                      >
                        <option>Government Agreement</option>
                        <option>Internal Agreement</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Agreement Status"
                        name="agreement_status"
                        defaultValue={getValue("agreement_status")}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Pending</option>
                        <option>Prepared</option>
                        <option>Signed</option>
                        <option>Executed</option>
                        <option>Terminated</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Agreement Start Date"
                        name="agreement_start_date"
                        defaultValue={getValue("agreement_start_date")}
                      />
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Agreement End Date"
                        name="agreement_end_date"
                        defaultValue={getValue("agreement_end_date")}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Agreement Document (URL)"
                        name="agreement_document"
                        defaultValue={getValue("agreement_document")}
                        placeholder="Link to uploaded document"
                      />
                    </Col>
                  </Row>

                  <h5 id="key-handover" style={sectionTitleStyle}>
                    I. Key Handover
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Key Number"
                        name="key_number"
                        defaultValue={getValue("key_number")}
                        placeholder="Key ID"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Key Available"
                        name="key_available"
                        defaultValue={getValue("key_available")}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Key Booking Date"
                        name="key_booking_date"
                        defaultValue={getValue("key_booking_date")}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Confirmation Received"
                        name="confirmation_received"
                        defaultValue={getValue("confirmation_received")}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Key Delivery Date"
                        name="key_delivery_date"
                        defaultValue={getValue("key_delivery_date")}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Key Handover Status"
                        name="key_handover_status"
                        defaultValue={getValue("key_handover_status")}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Pending</option>
                        <option>Booked</option>
                        <option>Handed Over</option>
                        <option>Returned</option>
                      </FormField>
                    </Col>
                  </Row>

                  <h5 id="documents-upload" style={sectionTitleStyle}>
                    J. Documents Upload
                  </h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FileField label="Tenant ID Proof" />
                    </Col>
                    <Col md={4}>
                      <FileField label="Passport Copy" />
                    </Col>
                    <Col md={4}>
                      <FileField label="Agreement Copy" />
                    </Col>
                    <Col md={4}>
                      <FileField label="Inspection Photos" />
                    </Col>
                    <Col md={4}>
                      <FileField label="Meter Reading Photos" />
                    </Col>
                  </Row>

                  <h5 style={sectionTitleStyle}>K. Comments</h5>

                  <Row className="g-4 mb-4">
                    <Col md={12}>
                      <TextAreaField
                        label="Internal Comments"
                        name="internal_comments"
                        defaultValue={getValue("internal_comments")}
                        placeholder="For Internal Staff Only"
                      />
                    </Col>

                    <Col md={12}>
                      <TextAreaField
                        label="Tenant Remarks"
                        name="tenant_remarks"
                        defaultValue={getValue("tenant_remarks")}
                        placeholder="Feedback or Notes from tenant"
                      />
                    </Col>

                    <Col md={12}>
                      <TextAreaField
                        label="Special Instructions"
                        name="special_instructions"
                        defaultValue={getValue("special_instructions")}
                        placeholder="Any special instruction for this check-in"
                      />
                    </Col>
                  </Row>
                  <h5 style={sectionTitleStyle}>L. Property Lifecycle Dates</h5>

                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <DateField
                        label="Property Created Date"
                        name="property_created_date"
                      />
                    </Col>

                    <Col md={4}>
                      <DateField
                        label="Listed For Rent Date"
                        name="listed_for_rent_date"
                      />
                    </Col>

                    <Col md={4}>
                      <DateField
                        label="Tenant Created Date"
                        name="tenant_created_date"
                      />
                    </Col>

                    <Col md={4}>
                      <DateField
                        label=" Tenanted Created Date"
                        name="tenant_assigned_date"
                      />
                    </Col>

                    <Col md={4}>
                      <DateField
                        label="Property Occupied Date"
                        name="property_occupied_date"
                      />
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      as={Link}
                      to={dashboardPath}
                      variant="outline-secondary"
                      style={{
                        borderColor: "#526b89",
                        color: "#526b89",
                        borderRadius: 5,
                        minWidth: 200,
                        height: 45,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      style={{
                        background: "#526b89",
                        borderColor: "#526b89",
                        borderRadius: 5,
                        minWidth: 200,
                        height: 45,
                      }}
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

export default CheckInInformationForm;
