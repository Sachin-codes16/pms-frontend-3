// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckIn from "@/hooks/useCheckIn";
import checkInApi from "@/helpers/checkInApi";

const DOCUMENT_UPLOAD_ENDPOINT = "/checkin-checkout/check_in/document/upload/";

// Confirmed against the live API schema (AgreementTypeEnum / AgreementStatusEnum)
const AGREEMENT_TYPE_OPTIONS = ["Government Agreement", "Internal Agreement"];
const AGREEMENT_STATUS_OPTIONS = ["Pending", "Prepared", "Signed", "Executed", "Terminated"];

// Confirmed valid check-in document types
const AGREEMENT_DOCUMENT_SLOTS = [
  { key: "agreement_signed", label: "Agreement Doc (Signed)", documentType: "Agreement Signed" },
  { key: "tenant_id_proof", label: "Tenant ID Proof", documentType: "Tenant ID Proof" },
  { key: "company_seal", label: "Company Seal", documentType: "Company Seal" },
];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const FIELD_PATHS = {
  agreement_type:           ["agreement", "agreementDetails", "agreementType"],
  agreement_status:         ["agreement", "agreementDetails", "agreementStatus"],
  agreement_number:         ["agreement", "agreementDetails", "agreementNumber"],
  agreement_template:       ["agreement", "agreementDetails", "agreementTemplate"],
  agreement_start_date:     ["agreement", "agreementDetails", "startDate"],
  agreement_end_date:       ["agreement", "agreementDetails", "endDate"],
  generated_on:             ["agreement", "agreementDetails", "generatedOn"],
  submitted_to_tenant_on:   ["agreement", "agreementDetails", "submittedToTenantOn"],
  tenant_signed_on:         ["agreement", "agreementDetails", "tenantSignedOn"],
  manager_signed_on:        ["agreement", "agreementDetails", "managerSignedOn"],
  renewal_reminder_date:    ["agreement", "agreementDetails", "renewalReminderDate"],
  auto_reminder_enabled:    ["agreement", "agreementDetails", "autoReminderEnabled"],
  agreement_notes:          [],   // flat: agreementNotes
};

// Only these fields are ever sent to the agreement_details PATCH — keeps the
// Documents Upload file inputs (added below) from leaking into it.
const AGREEMENT_DETAIL_FIELDS = Object.keys(FIELD_PATHS);

const getValue = (item, name) => {
  const path = FIELD_PATHS[name];
  if (path && path.length > 0) {
    const nested = path.reduce((acc, key) => acc?.[key], item);
    if (nested !== null && nested !== undefined) return nested;
  }
  const camelKey = name.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  const flat = item?.[camelKey];
  return flat === null || flat === undefined ? "" : flat;
};

const toDateString = (iso) => (iso ? String(iso).split("T")[0] : "");

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

const readOnlyStyle = {
  ...fieldStyle,
  background: "#f3f4f8",
  color: "#8a96a8",
  cursor: "not-allowed",
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

const Field = ({ label, name, type = "text", defaultValue, readOnly }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      name={name}
      defaultValue={defaultValue ?? ""}
      readOnly={readOnly}
      style={readOnly ? readOnlyStyle : fieldStyle}
    />
  </div>
);

const AmountField = ({ label, name, defaultValue, readOnly }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div style={{ display: "flex", alignItems: "center", border: "1px solid #e7e9ef", borderRadius: 5, overflow: "hidden", background: readOnly ? "#f3f4f8" : "#f9f9fc" }}>
      <span style={{ padding: "0 12px", height: 46, display: "flex", alignItems: "center", background: "#e7e9ef", color: "#526b89", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>OMR</span>
      <input name={name} type="number" defaultValue={defaultValue} placeholder="0.000" readOnly={readOnly} style={{ ...fieldStyle, border: "none", borderRadius: 0, background: "transparent", flex: 1, cursor: readOnly ? "not-allowed" : "auto" }} />
    </div>
  </div>
);

const SelectField = ({ label, name, defaultValue, options }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <select name={name} defaultValue={defaultValue ?? ""} style={selectFieldStyle}>
      <option value="">— Select —</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const TextArea = ({ label, name, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea
      name={name}
      defaultValue={defaultValue ?? ""}
      style={{ ...fieldStyle, height: "auto", minHeight: 94, resize: "none" }}
    />
  </div>
);

const AgreementEditDetailsPage = ({ mode = "check-in" }) => {
  const location   = useLocation();
  const isCheckOut = mode === "check-out";
  const flowTitle  = isCheckOut ? "Check-Out" : "Check-In";

  const params = new URLSearchParams(location.search);
  const id     = params.get("id");
  const backPath   = isCheckOut ? `/check-out-details?id=${id}` : `/check-in-information?id=${id}&tab=agreement`;

  const { item, loading, updateSections, fetchItem } = useCheckIn({ id });
  const formRef    = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const gv = (name) => getValue(item, name);

  const details = item?.agreement?.agreementDetails ?? {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    if (!id) {
      alert("Cannot submit: no check-in id in the URL.");
      return;
    }
    const formData = new FormData(form);
    const payload  = {};
    for (const [k, v] of formData.entries()) {
      if (!AGREEMENT_DETAIL_FIELDS.includes(k)) continue;
      if (v === "") continue;
      payload[k] = k === "auto_reminder_enabled" ? v === "Enabled" : v;
    }

    const documentUploads = AGREEMENT_DOCUMENT_SLOTS
      .map(({ key, documentType }) => {
        const file = form.querySelector(`[name="doc_${key}"]`)?.files?.[0];
        return file ? { file, documentType } : null;
      })
      .filter(Boolean);

    try {
      setSubmitting(true);
      const requests = [
        updateSections(id, { agreement_details: payload }),
        ...documentUploads.map(async ({ file, documentType }) => {
          const base64 = await fileToBase64(file);
          return checkInApi.post(DOCUMENT_UPLOAD_ENDPOINT, {
            check_in_id: Number(id),
            document_type: documentType,
            file: base64,
          });
        }),
      ];
      await Promise.all(requests);
      await fetchItem();
      setSubmitting(false);
      toast.success("Agreement details updated successfully");
    } catch (err) {
      setSubmitting(false);
      const res     = err?.response?.data;
      const message = res ? JSON.stringify(res) : err?.message || "Something went wrong";
      toast.error(message);
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
          style={{ border: "1px solid #8a96a8", borderRadius: "50%", color: "#2f3848", height: 32, textDecoration: "none", width: 32 }}
        >
          <IconifyIcon icon="ri:arrow-left-s-line" width={20} height={20} />
        </Button>
        <h4 className="mb-0" style={{ color: "#526b89", fontSize: 20, fontWeight: 500 }}>
          {flowTitle} Information
        </h4>
      </div>

      <form key={loading ? "loading" : id || "new"} ref={formRef} onSubmit={handleSubmit}>
        <Row className="g-4 align-items-start">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <Col xs={12} lg={3}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: "0 10px 30px rgba(16,24,40,0.07)" }}>
              <CardBody style={{ padding: 24 }}>
                {loading ? (
                  <div className="d-flex justify-content-center" style={{ padding: 24 }}>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <h5 className="mb-1" style={{ color: "#526b89", fontSize: 18, fontWeight: 700 }}>
                      {item?.tenantName || "—"}
                    </h5>
                    <div className="d-flex flex-column gap-1 mb-4" style={{ color: "#526b89", fontSize: 14 }}>
                      <span>{item?.tenantEmail || item?.tenantDetails?.contactDetails?.tenantEmail || "—"}</span>
                      <span>{item?.tenantMobileNumber || item?.tenantDetails?.contactDetails?.tenantMobileNumber || "—"}</span>
                    </div>

                    <Row className="g-3 mb-4">
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>{flowTitle} Date</p>
                        <p className="mb-0" style={{ color: "#526b89", fontSize: 14 }}>{item?.checkInDate || "—"}</p>
                      </Col>
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>Status</p>
                        <p className="mb-0" style={{ color: "#526b89", fontSize: 14 }}>{item?.checkInStatus || "—"}</p>
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
                  <Button
                    as={Link}
                    to={backPath}
                    variant="outline-secondary"
                    className="w-50 edit-detail-btn-cancel"
                    style={{ borderColor: "#526b89", borderRadius: 5, color: "#526b89", height: 40 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-50 edit-detail-btn-submit"
                    style={{ background: "#526b89", borderColor: "#526b89", borderRadius: 5, height: 40 }}
                  >
                    {submitting ? "Saving…" : "Submit"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* ── Main form ───────────────────────────────────────────────── */}
          <Col xs={12} lg={9}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: "0 10px 30px rgba(16,24,40,0.07)", overflow: "hidden" }}>
              <CardBody style={{ padding: 0 }}>
                <h3 className="mb-0" style={{ borderBottom: "1px solid #edf0f3", color: "#526b89", fontSize: 26, fontWeight: 700, padding: "30px 36px 28px" }}>
                  Agreement Details
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* Section A — Agreement Details */}
                  <h5 id="agreement-details" style={sectionTitleStyle}>A. Agreement Details</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <SelectField
                        label="Agreement Type"
                        name="agreement_type"
                        defaultValue={gv("agreement_type")}
                        options={AGREEMENT_TYPE_OPTIONS}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Agreement Number"
                        name="agreement_number"
                        defaultValue={gv("agreement_number")}
                      />
                    </Col>
                    <Col md={4}>
                      <SelectField
                        label="Agreement Status"
                        name="agreement_status"
                        defaultValue={gv("agreement_status")}
                        options={AGREEMENT_STATUS_OPTIONS}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Agreement Start Date"
                        name="agreement_start_date"
                        type="date"
                        defaultValue={toDateString(gv("agreement_start_date"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Agreement End Date"
                        name="agreement_end_date"
                        type="date"
                        defaultValue={toDateString(gv("agreement_end_date"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Duration"
                        defaultValue={details.duration ?? ""}
                        readOnly
                      />
                    </Col>
                    <Col md={4}>
                      <AmountField label="Rent (Monthly)" defaultValue={details.rentMonthly ?? ""} readOnly />
                    </Col>
                    <Col md={4}>
                      <AmountField label="Security Deposit" defaultValue={details.securityDeposit ?? ""} readOnly />
                    </Col>
                    <Col md={4}>
                      <AmountField label="Advance Rent" defaultValue={details.advanceRent ?? ""} readOnly />
                    </Col>
                    <Col md={4}>
                      <AmountField label="Maintenance Charges" defaultValue={details.maintenanceCharges ?? ""} readOnly />
                    </Col>
                    <Col md={4}>
                      <SelectField
                        label="Agreement Template"
                        name="agreement_template"
                        defaultValue={gv("agreement_template")}
                        options={["Standard Residential", "Commercial", "Custom"]}
                      />
                    </Col>
                  </Row>

                  {/* Section B — Documents Upload */}
                  <h5 id="documents-upload" style={sectionTitleStyle}>B. Documents Upload</h5>
                  <Row className="g-4 mb-5">
                    {AGREEMENT_DOCUMENT_SLOTS.map(({ key, label }) => (
                      <Col md={4} key={key}>
                        <div>
                          <label style={labelStyle}>{label}</label>
                          <input type="file" name={`doc_${key}`} accept=".pdf,.jpg,.jpeg,.png" style={{ ...fieldStyle, padding: "7px 8px" }} />
                        </div>
                      </Col>
                    ))}
                  </Row>

                  {/* Section C — Notes */}
                  <h5 id="agreement-notes" style={sectionTitleStyle}>C. Agreement Notes</h5>
                  <Row className="g-4 mb-5">
                    <Col md={12}>
                      <TextArea
                        label="Notes"
                        name="agreement_notes"
                        defaultValue={item?.agreement?.agreementNotes ?? item?.agreementNotes ?? ""}
                      />
                    </Col>
                  </Row>

                  {/* Section D — Timeline Dates */}
                  <h5 id="agreement-timeline" style={sectionTitleStyle}>D. Agreement Timeline</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <Field
                        label="Generated On"
                        name="generated_on"
                        type="date"
                        defaultValue={toDateString(gv("generated_on"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Submitted to Tenant"
                        name="submitted_to_tenant_on"
                        type="date"
                        defaultValue={toDateString(gv("submitted_to_tenant_on"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Tenant Signed On"
                        name="tenant_signed_on"
                        type="date"
                        defaultValue={toDateString(gv("tenant_signed_on"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Manager Signed On"
                        name="manager_signed_on"
                        type="date"
                        defaultValue={toDateString(gv("manager_signed_on"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Renewal Reminder Date"
                        name="renewal_reminder_date"
                        type="date"
                        defaultValue={toDateString(gv("renewal_reminder_date"))}
                      />
                    </Col>
                    <Col md={4}>
                      <SelectField
                        label="Auto Reminder"
                        name="auto_reminder_enabled"
                        defaultValue={gv("auto_reminder_enabled") === true || gv("auto_reminder_enabled") === "true" ? "Enabled" : gv("auto_reminder_enabled") === false || gv("auto_reminder_enabled") === "false" ? "Disabled" : ""}
                        options={["Enabled", "Disabled"]}
                      />
                    </Col>
                  </Row>

                  {/* Section E — System Fields */}
                  <h5 id="system-fields" style={sectionTitleStyle}>E. System Fields</h5>
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
                    <Button
                      as={Link}
                      to={backPath}
                      variant="outline-secondary" className="edit-detail-btn-cancel"
                      style={{ borderColor: "#526b89", borderRadius: 5, color: "#526b89", height: 45, minWidth: 200 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting} className="edit-detail-btn-submit"
                      style={{ background: "#526b89", borderColor: "#526b89", borderRadius: 5, height: 45, minWidth: 200 }}
                    >
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

export default AgreementEditDetailsPage;
