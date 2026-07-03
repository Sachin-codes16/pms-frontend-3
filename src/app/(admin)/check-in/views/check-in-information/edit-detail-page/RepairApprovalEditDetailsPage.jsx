// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckIn from "@/hooks/useCheckIn";

const FIELD_PATHS = {
  repair_required:         [],   // flat: repairRequired
  quotation_amount:        [],   // flat: quotationAmount
  inventory_available:     [],   // flat: inventoryAvailable
  repair_priority:         [],   // flat: repairPriority
  rent_adjustment_amount:  [],   // flat: rentAdjustmentAmount
  gm_approval:             [],   // flat: gmApproval
  landlord_consent:        [],   // flat: landlordConsent
  finance_alert_generated: [],   // flat: financeAlertGenerated
  approved_on:             [],   // flat: approvedOn
  inspector_comments:      [],   // flat: inspectorComments
};

const getValue = (item, name) => {
  const path = FIELD_PATHS[name];
  if (path && path.length > 0) {
    const nested = path.reduce((acc, key) => acc?.[key], item);
    if (nested !== null && nested !== undefined) return nested;
  }
  const camelKey = name.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  const flat = item?.[camelKey];
  return flat === null || flat === undefined ? '' : flat;
};

const toDateString = (iso) => (iso ? String(iso).split('T')[0] : '');

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

const SelectField = ({ label, name, defaultValue, options }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <select name={name} defaultValue={defaultValue ?? ""} style={fieldStyle}>
      <option value="">— Select —</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const TextArea = ({ label, name, defaultValue, readOnly }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea
      name={name}
      defaultValue={defaultValue ?? ""}
      readOnly={readOnly}
      style={{
        ...fieldStyle,
        height: "auto",
        minHeight: 94,
        resize: "none",
        ...(readOnly && { background: "#f3f4f8", color: "#8a96a8", cursor: "not-allowed" }),
      }}
    />
  </div>
);

const RepairApprovalEditDetailsPage = ({ mode = "check-in" }) => {
  const location   = useLocation();
  const isCheckOut = mode === "check-out";
  const flowTitle  = isCheckOut ? "Check-Out" : "Check-In";
  const backPath   = isCheckOut ? "/check-out-dashboard" : "/check-in-dashboard";

  const params = new URLSearchParams(location.search);
  const id     = params.get("id");

  const { item, loading, updateSections, fetchItem } = useCheckIn({ id });
  const formRef    = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const gv = (name) => getValue(item, name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    if (!id) {
      alert('Cannot submit: no check-in id in the URL.');
      return;
    }
    const formData = new FormData(formRef.current);
    const body = {};
    for (const [k, v] of formData.entries()) {
      if (v === '') continue;
      body[k] = v;
    }
    try {
      setSubmitting(true);
      await updateSections(id, { repair_approval: body });
      await fetchItem();
      setSubmitting(false);
      toast.success('Repair & approval details updated successfully');
    } catch (err) {
      setSubmitting(false);
      const res = err?.response?.data;
      const message = res ? JSON.stringify(res) : err?.message || 'Something went wrong';
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

      <form key={loading ? 'loading' : id || 'new'} ref={formRef} onSubmit={handleSubmit}>
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
                      {item?.tenantName || '—'}
                    </h5>
                    <div className="d-flex flex-column gap-1 mb-4" style={{ color: "#526b89", fontSize: 14 }}>
                      <span>{item?.tenantEmail || item?.tenantDetails?.contactDetails?.tenantEmail || '—'}</span>
                      <span>{item?.tenantMobileNumber || item?.tenantDetails?.contactDetails?.tenantMobileNumber || '—'}</span>
                    </div>

                    <Row className="g-3 mb-4">
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>{flowTitle} Date</p>
                        <p className="mb-0" style={{ color: "#526b89", fontSize: 14 }}>{item?.checkInDate || '—'}</p>
                      </Col>
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>Status</p>
                        <p className="mb-0" style={{ color: "#526b89", fontSize: 14 }}>{item?.checkInStatus || '—'}</p>
                      </Col>
                    </Row>

                    <h6 className="mb-3" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>Property Details</h6>
                    <Row className="g-3 mb-4">
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: "#526b89", fontSize: 14 }}>Type</p>
                        <p className="mb-0" style={{ color: "#526b89", fontSize: 14, fontWeight: 700 }}>{item?.propertyType || '—'}</p>
                      </Col>
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: "#526b89", fontSize: 14 }}>Status</p>
                        <p className="mb-0" style={{ color: "#526b89", fontSize: 14, fontWeight: 700 }}>{item?.propertyStatus || '—'}</p>
                      </Col>
                    </Row>
                  </>
                )}

                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to={backPath}
                    variant="outline-secondary"
                    className="w-50"
                    style={{ borderColor: "#526b89", borderRadius: 5, color: "#526b89", height: 40 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-50"
                    style={{ background: "#526b89", borderColor: "#526b89", borderRadius: 5, height: 40 }}
                  >
                    {submitting ? 'Saving…' : 'Submit'}
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
                  Repair &amp; Approval Details
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* Section A — Repair Details */}
                  <h5 id="repair-details" style={sectionTitleStyle}>A. Repair Details</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <SelectField
                        label="Repair Required"
                        name="repair_required"
                        defaultValue={gv('repair_required')}
                        options={['Yes', 'No']}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Quotation Amount"
                        name="quotation_amount"
                        type="number"
                        defaultValue={gv('quotation_amount')}
                      />
                    </Col>
                    <Col md={4}>
                      <SelectField
                        label="Inventory Available"
                        name="inventory_available"
                        defaultValue={gv('inventory_available')}
                        options={['Yes', 'No']}
                      />
                    </Col>
                    <Col md={4}>
                      <SelectField
                        label="Priority"
                        name="repair_priority"
                        defaultValue={gv('repair_priority')}
                        options={['Low', 'Medium', 'High']}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Rent Adjustment Amount"
                        name="rent_adjustment_amount"
                        type="number"
                        defaultValue={gv('rent_adjustment_amount')}
                      />
                    </Col>
                  </Row>

                  {/* Section B — Approval */}
                  <h5 id="approval" style={sectionTitleStyle}>B. Approval</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <SelectField
                        label="GM Approval"
                        name="gm_approval"
                        defaultValue={gv('gm_approval')}
                        options={['Approved', 'Pending', 'Rejected']}
                      />
                    </Col>
                    <Col md={4}>
                      <SelectField
                        label="Landlord Consent"
                        name="landlord_consent"
                        defaultValue={gv('landlord_consent')}
                        options={['Approved', 'Pending', 'Rejected']}
                      />
                    </Col>
                    <Col md={4}>
                      <SelectField
                        label="Finance Alert Generated"
                        name="finance_alert_generated"
                        defaultValue={gv('finance_alert_generated')}
                        options={['Yes', 'No']}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Approved On"
                        name="approved_on"
                        type="date"
                        defaultValue={toDateString(gv('approved_on'))}
                      />
                    </Col>
                  </Row>

                  {/* Section C — Notes */}
                  <h5 id="notes" style={sectionTitleStyle}>C. Notes</h5>
                  <Row className="g-4 mb-5">
                    <Col md={12}>
                      <TextArea
                        label="Inspector Comments"
                        name="inspector_comments"
                        defaultValue={gv('inspector_comments')}
                      />
                    </Col>
                  </Row>

                  {/* Section D — System Fields */}
                  <h5 id="system-fields" style={sectionTitleStyle}>D. System Fields</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <Field label="Created By" defaultValue={item?.createdBy?.name ?? item?.createdBy ?? ''} readOnly />
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
                      variant="outline-secondary"
                      style={{ borderColor: "#526b89", borderRadius: 5, color: "#526b89", height: 45, minWidth: 200 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      style={{ background: "#526b89", borderColor: "#526b89", borderRadius: 5, height: 45, minWidth: 200 }}
                    >
                      {submitting ? 'Saving…' : 'Submit'}
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

export default RepairApprovalEditDetailsPage;
