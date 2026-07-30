// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import checkInApi from "@/helpers/checkInApi";
import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckOut from "@/hooks/useCheckOut";

const FIELD_MAP = {
  repair_required:        "repairRequired",
  quotation_amount:       "quotationAmount",
  inventory_available:    "inventoryAvailable",
  gm_approval:            "gmApproval",
  landlord_consent:       "landlordConsent",
  finance_alert_generated:"financeAlertGenerated",
  rent_adjustment_amount: "rentAdjustmentAmount",
  repair_priority:        "repairPriority",
};

const getValue = (item, name) => {
  const key   = FIELD_MAP[name];
  const value = key ? item?.[key] : undefined;
  return value === null || value === undefined ? "" : value;
};

const toDateString = (iso) => (iso ? String(iso).split("T")[0] : "");

const fieldStyle = {
  background: "#f9f9fc", border: "1px solid #e7e9ef", borderRadius: 5,
  color: "#526b89", fontSize: 16, height: 46, padding: "10px 14px", width: "100%",
};
const readOnlyStyle   = { ...fieldStyle, background: "#f3f4f8", color: "#8a96a8", cursor: "not-allowed" };
const labelStyle      = { color: "#526b89", fontSize: 16, fontWeight: 500, marginBottom: 10 };
const sectionTitleStyle = {
  color: "#526b89", fontSize: 21, fontWeight: 700,
  borderBottom: "1px solid #dfe3e8", paddingBottom: 16, marginBottom: 20, scrollMarginTop: 110,
};

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
    <div style={{ position: 'relative' }}>
      <select name={name} defaultValue={defaultValue ?? ""} style={{ ...fieldStyle, WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', paddingRight: 40 }}>
        <option value="">— Select —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18}
        style={{ color: '#526b89', pointerEvents: 'none', position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  </div>
);

const EmployeeSelectField = ({ label, name, employees, employeesLoading }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div style={{ position: 'relative' }}>
      <select name={name} defaultValue="" style={{ ...fieldStyle, WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', paddingRight: 40 }}>
        <option value="">{employeesLoading ? "Loading employees…" : "— Select —"}</option>
        {!employeesLoading && employees.length === 0 && <option disabled>No employees available</option>}
        {employees.map((emp) => (
          <option key={emp.managerId ?? emp.userId} value={String(emp.managerId ?? emp.userId)}>{emp.name}</option>
        ))}
      </select>
      <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18}
        style={{ color: '#526b89', pointerEvents: 'none', position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  </div>
);

const RepairApprovalEditDetailsPage = ({ mode = "check-out" }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id     = params.get("id");
  const backPath = `/check-out-details?id=${id}&tab=repairDamage`;

  const { item, loading, updateSections, fetchItem } = useCheckOut({ id });
  const formRef    = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    checkInApi.get("/marketing/manager/get_all/")
      .then((res) => { if (!cancelled) setEmployees(res.data?.data?.data ?? []); })
      .catch(() => { if (!cancelled) setEmployees([]); })
      .finally(() => { if (!cancelled) setEmployeesLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const gv = (name) => getValue(item, name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current || !id) return;

    const formData = new FormData(formRef.current);
    const body = {};
    for (const [k, v] of formData.entries()) {
      if (v !== "") body[k] = v;
    }

    try {
      setSubmitting(true);
      await updateSections(id, { repair_damage: body });
      await fetchItem();
      setSubmitting(false);
      toast.success("Repair & Damage details updated successfully");
      alert("Repair & Damage details updated successfully.");
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
                    <h5 className="mb-1" style={{ color: "#526b89", fontSize: 18, fontWeight: 700 }}>{item?.tenantName || "—"}</h5>
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
                  Repair &amp; Damage Details
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* A — Repair & Approval */}
                  <h5 id="repair-damage" style={sectionTitleStyle}>A. Repair &amp; Approval</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <SelectField label="Repair Required" name="repair_required"
                        defaultValue={gv("repair_required")} options={["Yes", "No"]} />
                    </Col>
                    <Col md={4}>
                      <Field label="Quotation Amount" name="quotation_amount"
                        defaultValue={gv("quotation_amount")} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="Inventory Available" name="inventory_available"
                        defaultValue={gv("inventory_available")} options={["Yes", "No"]} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="GM Approval" name="gm_approval"
                        defaultValue={gv("gm_approval")}
                        options={["Pending", "Approved", "Rejected"]} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="Landlord Consent" name="landlord_consent"
                        defaultValue={gv("landlord_consent")}
                        options={["Pending", "Approved", "Rejected"]} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="Finance Alert Generated" name="finance_alert_generated"
                        defaultValue={gv("finance_alert_generated")} options={["Yes", "No"]} />
                    </Col>
                    <Col md={4}>
                      <Field label="Rent Adjustment Amount" name="rent_adjustment_amount"
                        defaultValue={gv("rent_adjustment_amount")} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="Repair Priority" name="repair_priority"
                        defaultValue={gv("repair_priority")}
                        options={["Low", "Medium", "High", "Critical"]} />
                    </Col>
                    <Col md={4}>
                      <EmployeeSelectField label="Recommended By" name="recommended_by_id"
                        employees={employees} employeesLoading={employeesLoading} />
                    </Col>
                    <Col md={4}>
                      <EmployeeSelectField label="Approved By" name="approved_by_id"
                        employees={employees} employeesLoading={employeesLoading} />
                    </Col>
                    <Col md={4}>
                      <Field label="Approved On" name="approved_on" type="date"
                        defaultValue={toDateString(item?.repairDamage?.approvalSummary?.approvedOn)} />
                    </Col>
                  </Row>

                  {/* B — System Fields */}
                  <h5 id="system-fields" style={sectionTitleStyle}>B. System Fields</h5>
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

export default RepairApprovalEditDetailsPage;
