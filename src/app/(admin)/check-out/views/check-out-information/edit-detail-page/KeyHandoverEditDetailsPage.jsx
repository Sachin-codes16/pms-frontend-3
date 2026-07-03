// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckOut from "@/hooks/useCheckOut";
import checkInApi from "@/helpers/checkInApi";

const KEY_UPDATE_ENDPOINT = "/checkin-checkout/check_out/key/update/";

// Top-level fields for key_return section update
const FIELD_MAP = {
  key_return_status:    "keyReturnStatus",
  key_number:           "keyNumber",
  key_type:             "keyType",
  key_available:        "keyAvailable",
  expected_return_date: "expectedReturnDate",
  confirmation_received:"confirmationReceived",
  key_return_date:      "keyReturnDate",
  key_return:           null, // from keyReturn.keyReturnInformation.keyReturn
};

const KEY_RETURN_SECTION_FIELDS = [
  "key_return_status","key_number","key_type","key_available",
  "expected_return_date","confirmation_received","key_return_date","key_return",
];

const getValue = (item, name) => {
  if (name === "key_return") return item?.keyReturn?.keyReturnInformation?.keyReturn ?? "";
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
    <select name={name} defaultValue={defaultValue ?? ""} style={fieldStyle}>
      <option value="">— Select —</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const TextArea = ({ label, name, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea name={name} defaultValue={defaultValue ?? ""}
      style={{ ...fieldStyle, height: "auto", minHeight: 94, resize: "none" }} />
  </div>
);

const KeyHandoverEditDetailsPage = ({ mode = "check-out" }) => {
  const location = useLocation();
  const backPath = "/check-out-dashboard";

  const params = new URLSearchParams(location.search);
  const id     = params.get("id");

  const { item, loading, updateSections, fetchItem } = useCheckOut({ id });
  const formRef    = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const gv       = (name) => getValue(item, name);
  const keyRows  = item?.keyReturn?.keyDetails ?? [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current || !id) return;

    const formData = new FormData(formRef.current);
    const values   = {};
    for (const [k, v] of formData.entries()) {
      if (v !== "") values[k] = v;
    }

    // Section body for key_return update
    const sectionBody = {};
    KEY_RETURN_SECTION_FIELDS.forEach((f) => {
      if (values[f] !== undefined) sectionBody[f] = values[f];
    });

    // Per-key update payloads
    const keyPayloads = keyRows
      .map((row) => {
        const kid    = row.checkOutKeyId;
        const status = values[`key_${kid}_status`];
        return status ? { check_out_key_id: kid, key_status: status } : null;
      })
      .filter(Boolean);

    try {
      setSubmitting(true);
      const requests = [];
      if (Object.keys(sectionBody).length > 0) requests.push(updateSections(id, { key_return: sectionBody }));
      keyPayloads.forEach((body) => requests.push(checkInApi.patch(KEY_UPDATE_ENDPOINT, body)));
      await Promise.all(requests);
      await fetchItem();
      setSubmitting(false);
      toast.success("Key return details updated successfully");
      alert("Key return details updated successfully.");
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
                  Key Return Details
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* A — Key Return Information */}
                  <h5 id="key-return" style={sectionTitleStyle}>A. Key Return Information</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <SelectField label="Key Return Status" name="key_return_status"
                        defaultValue={gv("key_return_status")}
                        options={["Pending", "Returned", "Lost"]} />
                    </Col>
                    <Col md={4}>
                      <Field label="Key Number" name="key_number" defaultValue={gv("key_number")} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="Key Type" name="key_type" defaultValue={gv("key_type")}
                        options={["Main Door Key","Mail Box Key","Utility Room Key","Basement Parking Key","Terrace Key","Bedroom Key","Parking Key"]} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="Key Available" name="key_available"
                        defaultValue={gv("key_available")} options={["Yes","No"]} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="Key Return" name="key_return"
                        defaultValue={gv("key_return")} options={["Yes","No"]} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="Confirmation Received" name="confirmation_received"
                        defaultValue={gv("confirmation_received")} options={["Yes","No"]} />
                    </Col>
                  </Row>

                  {/* B — Dates */}
                  <h5 id="dates" style={sectionTitleStyle}>B. Dates &amp; Time</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <Field label="Expected Return Date" name="expected_return_date" type="date"
                        defaultValue={toDateString(gv("expected_return_date"))} />
                    </Col>
                    <Col md={4}>
                      <Field label="Key Return Date" name="key_return_date" type="date"
                        defaultValue={toDateString(gv("key_return_date"))} />
                    </Col>
                    <Col md={4}>
                      <Field label="Received By" defaultValue={item?.keyReturn?.keyReturnInformation?.receivedBy ?? ""} readOnly />
                    </Col>
                    <Col md={4}>
                      <Field label="Tenant Contact" defaultValue={item?.keyReturn?.keyReturnInformation?.tenantContact ?? ""} readOnly />
                    </Col>
                  </Row>

                  {/* C — Key Details */}
                  <h5 id="key-details" style={sectionTitleStyle}>C. Key Details</h5>
                  {keyRows.length === 0 ? (
                    <p style={{ color: "#526b89", fontSize: 15, marginBottom: 40 }}>No individual key records found.</p>
                  ) : (
                    <div style={{ border: "1px solid #e4e8ed", borderRadius: 8, marginBottom: 40, overflow: "hidden" }}>
                      <table style={{ borderCollapse: "collapse", width: "100%" }}>
                        <thead>
                          <tr style={{ background: "#fbfcfd" }}>
                            {["#","Key Number","Key Type","Key Status"].map((h) => (
                              <th key={h} style={{ color: "#526b89", fontSize: 15, fontWeight: 700, padding: "14px 20px", textAlign: "left" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {keyRows.map((row, idx) => (
                            <tr key={row.checkOutKeyId ?? idx} style={{ borderTop: "1px solid #f0f2f5" }}>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 20px" }}>{idx + 1}</td>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 20px" }}>{row.keyNumber}</td>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 20px" }}>{row.keyType}</td>
                              <td style={{ padding: "12px 20px" }}>
                                <select name={`key_${row.checkOutKeyId}_status`}
                                  defaultValue={row.status ?? ""}
                                  style={{ ...fieldStyle, height: 38, padding: "6px 10px", width: 160 }}>
                                  <option value="">— Select —</option>
                                  {["Pending","Returned","Lost"].map((o) => (
                                    <option key={o} value={o}>{o}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* D — Tenant Confirmation */}
                  <h5 id="tenant-confirmation" style={sectionTitleStyle}>D. Tenant Confirmation</h5>
                  <Row className="g-4 mb-5">
                    <Col md={12}>
                      <TextArea label="Confirmation Notes" name="tenant_confirmation_notes"
                        defaultValue={item?.tenantRemarks ?? ""} />
                    </Col>
                  </Row>

                  {/* E — System Fields */}
                  <h5 id="system-fields" style={sectionTitleStyle}>E. System Fields</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}><Field label="Created By" defaultValue={item?.createdBy?.name ?? item?.createdBy ?? ""} readOnly /></Col>
                    <Col md={4}><Field label="Created On" defaultValue={toDateString(item?.createdAt)} readOnly /></Col>
                    <Col md={4}><Field label="Last Updated" defaultValue={toDateString(item?.updatedAt)} readOnly /></Col>
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

export default KeyHandoverEditDetailsPage;
