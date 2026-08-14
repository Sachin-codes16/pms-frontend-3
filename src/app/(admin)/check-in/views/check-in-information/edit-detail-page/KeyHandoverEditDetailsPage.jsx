// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckIn from "@/hooks/useCheckIn";
import checkInApi from "@/helpers/checkInApi";

const KEY_UPDATE_ENDPOINT = "/checkin-checkout/check_in/key/update/";
const KEY_CREATE_ENDPOINT = "/checkin-checkout/check_in/key/create/";
const DOCUMENT_UPLOAD_ENDPOINT = "/checkin-checkout/check_in/document/upload/";

// Confirmed against the live API schema (Status82bEnum) — the previous
// options included "Handovered", which isn't a valid choice and gets rejected.
const KEY_STATUS_OPTIONS = ["Pending", "Handed Over"];

const KEY_DOCUMENT_SLOTS = [
  { key: "key_handover_photo", label: "Key Handover Photo", documentType: "Key Handover Photo" },
  { key: "tenant_id_proof", label: "Tenant ID Proof", documentType: "Tenant ID Proof" },
  { key: "key_receipt", label: "Key Receipt", documentType: "Key Receipt" },
];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Fields submitted to PATCH /update/key_handover/. key_booked_on / key_prepared_on /
// key_notified_on / handover_completed_on aren't in this Figma but are the real,
// confirmed fields that drive the Key Handover Timeline beyond its first step.
const FIELD_PATHS = {
  key_booking_date:         ["keyHandover", "keyHandoverInformation", "keyBookingDate"],
  expected_handover_date:   ["keyHandover", "keyHandoverInformation", "expectedHandoverDate"],
  key_delivery_date:        ["keyHandover", "keyHandoverInformation", "keyHandoverDate"],
  confirmation_received:    ["keyHandover", "keyHandoverInformation", "confirmationReceived"],
  handover_notes:           ["keyHandover", "keyHandoverInformation", "handoverNotes"],
  key_booked_on:            [],  // flat: keyBookedOn
  key_prepared_on:          [],  // flat: keyPreparedOn
  key_notified_on:          [],  // flat: keyNotifiedOn
  handover_completed_on:    [],  // flat: handoverCompletedOn
  tenant_confirmation_notes: [],  // flat: tenantConfirmationNotes
};

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

const NewKeyRow = ({ rowId, onRemove, removable }) => (
  <div className="mb-4" style={{ background: "#fbfcfd", border: "1px solid #e7e9ef", borderRadius: 8, padding: 20 }}>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="mb-0" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>New Key</h6>
      {removable && (
        <button
          type="button"
          onClick={() => onRemove(rowId)}
          style={{ background: "none", border: "none", color: "#bd2d3a", fontSize: 14, padding: 0 }}
        >
          Remove
        </button>
      )}
    </div>
    <Row className="g-4">
      <Col md={4}>
        <Field label="Key Number" name={`new_key_${rowId}_number`} />
      </Col>
      <Col md={4}>
        <Field label="Key Type" name={`new_key_${rowId}_type`} />
      </Col>
      <Col md={4}>
        <SelectField label="Key Status" name={`new_key_${rowId}_status`} defaultValue="Pending" options={KEY_STATUS_OPTIONS} />
      </Col>
    </Row>
  </div>
);

const KeyHandoverEditDetailsPage = ({ mode = "check-in" }) => {
  const location   = useLocation();
  const isCheckOut = mode === "check-out";
  const flowTitle  = isCheckOut ? "Check-Out" : "Check-In";

  const params = new URLSearchParams(location.search);
  const id     = params.get("id");
  const backPath   = isCheckOut ? `/check-out-details?id=${id}` : `/check-in-information?id=${id}&tab=keyHandover`;

  const { item, loading, updateSections, fetchItem } = useCheckIn({ id });
  const formRef    = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [newKeyRowIds, setNewKeyRowIds] = useState([1]);
  const nextKeyRowId = useRef(2);

  const gv       = (name) => getValue(item, name);
  const keyRows  = item?.keyHandover?.keyDetails ?? [];

  const addKeyRow = () => setNewKeyRowIds((rows) => [...rows, nextKeyRowId.current++]);
  const removeKeyRow = (rowId) => setNewKeyRowIds((rows) => rows.filter((r) => r !== rowId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    if (!id) {
      alert("Cannot submit: no check-in id in the URL.");
      return;
    }

    const formData = new FormData(form);
    const values   = {};
    for (const [k, v] of formData.entries()) {
      if (v !== "") values[k] = v;
    }

    // Build key_handover section payload (known fields only)
    const SECTION_FIELDS = Object.keys(FIELD_PATHS);
    const sectionBody = {};
    for (const field of SECTION_FIELDS) {
      if (values[field] !== undefined) sectionBody[field] = values[field];
    }

    // Build per-key update payloads from key_{id}_* prefixed fields
    const keyPayloads = keyRows
      .map((row) => {
        const kid    = row.checkInKeyId;
        const status = values[`key_${kid}_status`];
        return status ? { check_in_key_id: kid, status } : null;
      })
      .filter(Boolean);

    // Build create payloads for filled-in "New Key" rows
    const newKeyPayloads = newKeyRowIds
      .map((rowId) => {
        const keyNumber = values[`new_key_${rowId}_number`];
        const keyType    = values[`new_key_${rowId}_type`];
        if (!keyNumber || !keyType) return null;
        return {
          check_in_id: Number(id),
          key_number: keyNumber,
          key_type: keyType,
          status: values[`new_key_${rowId}_status`] || "Pending",
        };
      })
      .filter(Boolean);

    // Document uploads
    const documentUploads = KEY_DOCUMENT_SLOTS
      .map(({ key, documentType }) => {
        const file = form.querySelector(`[name="doc_${key}"]`)?.files?.[0];
        return file ? { file, documentType } : null;
      })
      .filter(Boolean);

    try {
      setSubmitting(true);
      const requests = [];
      if (Object.keys(sectionBody).length > 0) {
        requests.push(updateSections(id, { key_handover: sectionBody }));
      }
      newKeyPayloads.forEach((body) => {
        requests.push(checkInApi.post(KEY_CREATE_ENDPOINT, body));
      });
      documentUploads.forEach(({ file, documentType }) => {
        requests.push(
          (async () => {
            const base64 = await fileToBase64(file);
            return checkInApi.post(DOCUMENT_UPLOAD_ENDPOINT, {
              check_in_id: Number(id),
              document_type: documentType,
              file: base64,
            });
          })()
        );
      });
      keyPayloads.forEach((body) => {
        requests.push(checkInApi.patch(KEY_UPDATE_ENDPOINT, body));
      });
      await Promise.all(requests);
      await fetchItem();
      setSubmitting(false);
      toast.success("Key handover details updated successfully");
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
                  Key Handover Details
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* Section A — Date & Time Details */}
                  <h5 id="dates" style={sectionTitleStyle}>A. Date &amp; Time Details</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <Field
                        label="Key Booking Date & Time"
                        name="key_booking_date"
                        type="date"
                        defaultValue={toDateString(gv("key_booking_date"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Expected Handover Date & Time"
                        name="expected_handover_date"
                        type="date"
                        defaultValue={toDateString(gv("expected_handover_date"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Actual Key Handover Date & Time"
                        name="key_delivery_date"
                        type="date"
                        defaultValue={toDateString(gv("key_delivery_date"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Handed Over By"
                        defaultValue={item?.keyHandover?.keyHandoverInformation?.handoveredBy ?? ""}
                        readOnly
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Received By (Tenant)"
                        defaultValue={item?.keyHandover?.keyHandoverInformation?.receivedByTenant ?? ""}
                        readOnly
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Tenant Contact Number"
                        defaultValue={item?.keyHandover?.keyHandoverInformation?.tenantContact ?? ""}
                        readOnly
                      />
                    </Col>
                    <Col md={4}>
                      <SelectField
                        label="Confirmation Received"
                        name="confirmation_received"
                        defaultValue={gv("confirmation_received")}
                        options={["Yes", "No"]}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Key Booked On"
                        name="key_booked_on"
                        type="date"
                        defaultValue={toDateString(gv("key_booked_on"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Key Prepared On"
                        name="key_prepared_on"
                        type="date"
                        defaultValue={toDateString(gv("key_prepared_on"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Key Notified On"
                        name="key_notified_on"
                        type="date"
                        defaultValue={toDateString(gv("key_notified_on"))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Handover Completed On"
                        name="handover_completed_on"
                        type="date"
                        defaultValue={toDateString(gv("handover_completed_on"))}
                      />
                    </Col>
                  </Row>

                  {/* Section B — Key Details (existing + new) */}
                  <h5 id="key-details" style={sectionTitleStyle}>B. Key Details</h5>
                  {keyRows.length === 0 ? (
                    <p style={{ color: "#526b89", fontSize: 15, marginBottom: 40 }}>No individual key records found.</p>
                  ) : (
                    <div style={{ border: "1px solid #e4e8ed", borderRadius: 8, marginBottom: 40, overflow: "hidden" }}>
                      <table style={{ borderCollapse: "collapse", width: "100%" }}>
                        <thead>
                          <tr style={{ background: "#fbfcfd" }}>
                            {["#", "Key Number", "Key Type", "Key Status"].map((h) => (
                              <th key={h} style={{ color: "#526b89", fontSize: 15, fontWeight: 700, padding: "14px 20px", textAlign: "left" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {keyRows.map((row, index) => (
                            <tr key={row.checkInKeyId ?? index} style={{ borderTop: "1px solid #f0f2f5" }}>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 20px" }}>{index + 1}</td>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 20px" }}>{row.keyNumber}</td>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 20px" }}>{row.keyType}</td>
                              <td style={{ padding: "12px 20px" }}>
                                <select
                                  name={`key_${row.checkInKeyId}_status`}
                                  defaultValue={row.status ?? ""}
                                  style={{ ...selectFieldStyle, height: 38, padding: "6px 32px 6px 10px", width: 160 }}
                                >
                                  <option value="">— Select —</option>
                                  {KEY_STATUS_OPTIONS.map((o) => (
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

                  {newKeyRowIds.map((rowId) => (
                    <NewKeyRow
                      key={rowId}
                      rowId={rowId}
                      onRemove={removeKeyRow}
                      removable={newKeyRowIds.length > 1}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={addKeyRow}
                    className="mb-5"
                    style={{ background: "none", border: "1px dashed #8a96a8", borderRadius: 5, color: "#526b89", fontSize: 15, padding: "10px 16px" }}
                  >
                    + Add Another Key
                  </button>

                  {/* Section C — Documents Upload */}
                  <h5 id="documents-upload" style={sectionTitleStyle}>C. Documents Upload</h5>
                  <Row className="g-4 mb-5">
                    {KEY_DOCUMENT_SLOTS.map(({ key, label }) => (
                      <Col md={4} key={key}>
                        <div>
                          <label style={labelStyle}>{label}</label>
                          <input type="file" name={`doc_${key}`} accept=".pdf,.jpg,.jpeg,.png" style={{ ...fieldStyle, padding: "7px 8px" }} />
                        </div>
                      </Col>
                    ))}
                  </Row>

                  {/* Section D — Handover Notes */}
                  <h5 id="notes" style={sectionTitleStyle}>D. Notes</h5>
                  <Row className="g-4 mb-5">
                    <Col md={12}>
                      <TextArea
                        label="Handover Notes"
                        name="handover_notes"
                        defaultValue={gv("handover_notes")}
                      />
                    </Col>
                  </Row>

                  {/* Section E — Tenant Confirmation */}
                  <h5 id="tenant-confirmation" style={sectionTitleStyle}>E. Tenant Confirmation</h5>
                  <Row className="g-4 mb-5">
                    <Col md={12}>
                      <TextArea
                        label="Confirmation Notes"
                        name="tenant_confirmation_notes"
                        defaultValue={item?.keyHandover?.tenantConfirmation ?? item?.tenantConfirmationNotes ?? ""}
                      />
                    </Col>
                  </Row>

                  {/* Section F — System Fields */}
                  <h5 id="system-fields" style={sectionTitleStyle}>F. System Fields</h5>
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

export default KeyHandoverEditDetailsPage;
