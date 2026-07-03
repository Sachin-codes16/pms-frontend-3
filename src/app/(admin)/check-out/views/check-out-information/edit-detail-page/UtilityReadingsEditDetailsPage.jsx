// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckOut from "@/hooks/useCheckOut";
import checkInApi from "@/helpers/checkInApi";

const READING_UPDATE_ENDPOINT = "/checkin-checkout/check_out/utility_reading/update/";

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

// One section per utility reading — prefixes all names with r_{id}_
const UtilitySection = ({ reading, index }) => {
  const rid    = reading.checkOutUtilityReadingId ?? reading.id;
  const prefix = `r_${rid}`;
  return (
    <div className="mb-5">
      <h5 style={sectionTitleStyle}>
        {String.fromCharCode(65 + index)}. {reading.utility}
      </h5>
      <input type="hidden" name={`${prefix}_id`} value={rid ?? ""} />
      <Row className="g-4">
        <Col md={4}><Field label="Meter Number"     name={`${prefix}_meter_no`}       defaultValue={reading.meterNo ?? ""} /></Col>
        <Col md={4}><Field label="Check-Out Reading" name={`${prefix}_reading_value`}  type="number" defaultValue={reading.readingValue ?? ""} /></Col>
        <Col md={4}><Field label="Consumption"      name={`${prefix}_consumption`}     type="number" defaultValue={reading.consumption ?? ""} /></Col>
        <Col md={4}><Field label="Unit"             name={`${prefix}_unit`}            defaultValue={reading.unit ?? ""} /></Col>
        <Col md={4}><Field label="Rate / Unit"      name={`${prefix}_rate_per_unit`}   type="number" defaultValue={reading.ratePerUnit ?? ""} /></Col>
        <Col md={4}><Field label="Charges"          name={`${prefix}_charges`}         type="number" defaultValue={reading.charges ?? ""} /></Col>
        <Col md={4}>
          <SelectField label="Status" name={`${prefix}_status`} defaultValue={reading.status ?? ""}
            options={["Normal", "Fixed", "Issues", "High", "Abnormal"]} />
        </Col>
      </Row>
    </div>
  );
};

const UtilityReadingsEditDetailsPage = ({ mode = "check-out" }) => {
  const location = useLocation();
  const backPath = "/check-out-dashboard";

  const params = new URLSearchParams(location.search);
  const id     = params.get("id");

  const { item, loading, updateSections, fetchItem } = useCheckOut({ id });
  const formRef    = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const readingsList = item?.utilityReadings?.readingsList ?? [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current || !id) return;

    const formData = new FormData(formRef.current);
    const values   = {};
    for (const [k, v] of formData.entries()) {
      if (v !== "") values[k] = v;
    }

    // Top-level meter readings (section update)
    const meterBody = {};
    ["electricity_meter_reading","water_meter_reading","gas_meter_reading"].forEach((f) => {
      if (values[f] !== undefined) meterBody[f] = values[f];
    });

    // Per-reading payloads via individual endpoint
    const API_FIELDS = ["meter_no","reading_value","consumption","unit","rate_per_unit","charges","status"];
    const readingPayloads = readingsList
      .map((r) => {
        const rid    = r.checkOutUtilityReadingId ?? r.id;
        const prefix = `r_${rid}`;
        const body   = { check_out_utility_reading_id: rid };
        let hasChanges = false;
        for (const field of API_FIELDS) {
          const v = values[`${prefix}_${field}`];
          if (v !== undefined) { body[field] = v; hasChanges = true; }
        }
        return hasChanges ? body : null;
      })
      .filter(Boolean);

    if (Object.keys(meterBody).length === 0 && readingPayloads.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    try {
      setSubmitting(true);
      const requests = [];
      if (Object.keys(meterBody).length > 0) requests.push(updateSections(id, { utility_meter_readings: meterBody }));
      readingPayloads.forEach((body) => requests.push(checkInApi.patch(READING_UPDATE_ENDPOINT, body)));
      await Promise.all(requests);
      await fetchItem();
      setSubmitting(false);
      toast.success("Utility readings updated successfully");
      alert("Utility readings updated successfully.");
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
                  Utility Readings
                </h3>

                <div style={{ padding: "34px 36px" }}>
                  {loading ? (
                    <div className="d-flex justify-content-center py-5"><Spinner /></div>
                  ) : readingsList.length > 0 ? (
                    <>
                      {readingsList.map((reading, index) => (
                        <UtilitySection key={reading.checkOutUtilityReadingId ?? index} reading={reading} index={index} />
                      ))}
                    </>
                  ) : (
                    <>
                      {/* Fallback: simple top-level meter reading fields */}
                      <h5 style={sectionTitleStyle}>A. Meter Readings</h5>
                      <Row className="g-4 mb-5">
                        <Col md={4}>
                          <Field label="Electricity Meter Reading" name="electricity_meter_reading"
                            defaultValue={item?.electricityMeterReading ?? ""} />
                        </Col>
                        <Col md={4}>
                          <Field label="Water Meter Reading" name="water_meter_reading"
                            defaultValue={item?.waterMeterReading ?? ""} />
                        </Col>
                        <Col md={4}>
                          <Field label="Gas Meter Reading" name="gas_meter_reading"
                            defaultValue={item?.gasMeterReading ?? ""} />
                        </Col>
                      </Row>
                    </>
                  )}

                  {/* System Fields */}
                  {!loading && (
                    <>
                      <h5 style={sectionTitleStyle}>{readingsList.length > 0 ? `${String.fromCharCode(65 + readingsList.length)}. ` : 'B. '}System Fields</h5>
                      <Row className="g-4 mb-4">
                        <Col md={4}><Field label="Created By" defaultValue={item?.createdBy?.name ?? item?.createdBy ?? ""} readOnly /></Col>
                        <Col md={4}><Field label="Created On" defaultValue={toDateString(item?.createdAt)} readOnly /></Col>
                        <Col md={4}><Field label="Last Updated" defaultValue={toDateString(item?.updatedAt)} readOnly /></Col>
                      </Row>
                    </>
                  )}

                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <Button as={Link} to={backPath} variant="outline-secondary"
                      style={{ borderColor: "#526b89", color: "#526b89", borderRadius: 5, height: 45, minWidth: 200 }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting || loading}
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

export default UtilityReadingsEditDetailsPage;
