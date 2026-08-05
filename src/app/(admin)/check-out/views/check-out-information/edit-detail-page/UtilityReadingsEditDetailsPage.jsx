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
const READING_CREATE_ENDPOINT = "/checkin-checkout/check_out/utility_reading/create/";
const DOCUMENT_UPLOAD_ENDPOINT = "/checkin-checkout/check_out/document/upload/";

// Confirmed against the live API schema (UtilityTypeEnum / StatusFb7Enum)
const STATUS_OPTIONS = ["Normal", "Fixed", "Issues", "Not Applicable"];

// The 3 common utility types a fixed "add" section is always shown for,
// each with its own default unit — only rendered when no reading of that
// type already exists in readingsList (avoids creating a duplicate).
const FIXED_UTILITY_TYPES = [
  { type: "Electricity", label: "Electricity Reading", unit: "kWh" },
  { type: "Water", label: "Water Reading", unit: "m3" },
  { type: "Gas", label: "Gas Reading", unit: "m3" },
];

const METER_PHOTO_SLOTS = [
  { key: "electricity", label: "Electricity Meter Photo" },
  { key: "water", label: "Water Meter Photo" },
  { key: "gas", label: "Gas Meter Photo" },
  { key: "additional", label: "Additional Photo" },
];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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
            options={STATUS_OPTIONS} />
        </Col>
        <Col md={8}>
          <Field label="Remarks / Notes" name={`${prefix}_remarks`} defaultValue={reading.remarks ?? ""} />
        </Col>
      </Row>
    </div>
  );
};

// Fixed "add new reading" block for one of the 3 common utility types —
// only rendered by the parent when no reading of that type exists yet.
const NewReadingSection = ({ utilityType, label, unit, letter }) => {
  const prefix = `new_${utilityType}`;
  return (
    <div className="mb-5">
      <h5 style={sectionTitleStyle}>{letter}. {label}</h5>
      <Row className="g-4">
        <Col md={4}><Field label="Meter Number" name={`${prefix}_meter_no`} /></Col>
        <Col md={4}><Field label="Check-Out Reading" name={`${prefix}_reading_value`} type="number" /></Col>
        <Col md={4}><Field label="Consumption" name={`${prefix}_consumption`} type="number" /></Col>
        <Col md={4}><Field label="Unit" name={`${prefix}_unit`} defaultValue={unit} /></Col>
        <Col md={4}><Field label="Rate / Unit" name={`${prefix}_rate_per_unit`} type="number" /></Col>
        <Col md={4}><Field label="Charges" name={`${prefix}_charges`} type="number" /></Col>
        <Col md={4}>
          <SelectField label="Status" name={`${prefix}_status`} defaultValue="Normal" options={STATUS_OPTIONS} />
        </Col>
        <Col md={8}><Field label="Remarks / Notes" name={`${prefix}_remarks`} /></Col>
      </Row>
    </div>
  );
};

const MeterPhotoUpload = ({ letter }) => (
  <div className="mb-5">
    <h5 style={sectionTitleStyle}>{letter}. Meter Photo Upload</h5>
    <Row className="g-4">
      {METER_PHOTO_SLOTS.map(({ key, label }) => (
        <Col md={4} key={key}>
          <div>
            <label style={labelStyle}>{label}</label>
            <input type="file" name={`meter_photo_${key}`} accept="image/*" style={{ ...fieldStyle, padding: "7px 8px" }} />
          </div>
        </Col>
      ))}
    </Row>
  </div>
);

const UtilityReadingsEditDetailsPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id     = params.get("id");
  const backPath = `/check-out-details?id=${id}&tab=utilityReadings`;

  const { item, loading, updateSections, fetchItem } = useCheckOut({ id });
  const formRef    = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const readingsList = item?.utilityReadings?.readingsList ?? [];

  // Only offer a fixed "add" section for a common utility type when no
  // reading of that type exists yet — avoids creating an accidental duplicate.
  const missingFixedTypes = FIXED_UTILITY_TYPES.filter(
    ({ type }) => !readingsList.some((r) => r.utility === type)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current || !id) return;

    const form = formRef.current;
    const formData = new FormData(form);
    const values   = {};
    for (const [k, v] of formData.entries()) {
      if (v !== "") values[k] = v;
    }

    // Top-level meter readings (section update) — legacy fallback fields
    const meterBody = {};
    ["electricity_meter_reading","water_meter_reading","gas_meter_reading"].forEach((f) => {
      if (values[f] !== undefined) meterBody[f] = values[f];
    });

    // Per-reading payloads via individual endpoint
    const API_FIELDS = ["meter_no","reading_value","consumption","unit","rate_per_unit","charges","status","remarks"];
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

    // New reading payloads for the fixed "add" sections
    const createPayloads = missingFixedTypes
      .map(({ type }) => {
        const prefix = `new_${type}`;
        const meterNo = values[`${prefix}_meter_no`];
        const readingValue = values[`${prefix}_reading_value`];
        if (!meterNo && !readingValue) return null;

        const body = { check_out_id: Number(id), utility_type: type };
        for (const field of API_FIELDS) {
          const v = values[`${prefix}_${field}`];
          if (v !== undefined) body[field] = v;
        }
        return body;
      })
      .filter(Boolean);

    // Meter photo uploads
    const photoUploads = METER_PHOTO_SLOTS
      .map(({ key, label }) => {
        const file = form.querySelector(`[name="meter_photo_${key}"]`)?.files?.[0];
        return file ? { file, label } : null;
      })
      .filter(Boolean);

    if (Object.keys(meterBody).length === 0 && readingPayloads.length === 0 && createPayloads.length === 0 && photoUploads.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    try {
      setSubmitting(true);
      const requests = [];
      if (Object.keys(meterBody).length > 0) requests.push(updateSections(id, { utility_meter_readings: meterBody }));
      readingPayloads.forEach((body) => requests.push(checkInApi.patch(READING_UPDATE_ENDPOINT, body)));
      createPayloads.forEach((body) => requests.push(checkInApi.post(READING_CREATE_ENDPOINT, body)));
      photoUploads.forEach(({ file, label }) => requests.push(
        fileToBase64(file).then((base64) => checkInApi.post(DOCUMENT_UPLOAD_ENDPOINT, {
          check_out_id: Number(id),
          document_type: "Meter Reading Photo",
          file: base64,
          linked_to_label: label,
        }))
      ));
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
                  ) : (
                    <>
                      {readingsList.map((reading, index) => (
                        <UtilitySection key={reading.checkOutUtilityReadingId ?? index} reading={reading} index={index} />
                      ))}

                      {missingFixedTypes.map(({ type, label, unit }, i) => (
                        <NewReadingSection
                          key={type}
                          utilityType={type}
                          label={label}
                          unit={unit}
                          letter={String.fromCharCode(65 + readingsList.length + i)}
                        />
                      ))}

                      <MeterPhotoUpload letter={String.fromCharCode(65 + readingsList.length + missingFixedTypes.length)} />
                    </>
                  )}

                  {/* System Fields */}
                  {!loading && (
                    <>
                      <h5 style={sectionTitleStyle}>{String.fromCharCode(65 + readingsList.length + missingFixedTypes.length + 1)}. System Fields</h5>
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
