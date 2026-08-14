// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckOut from "@/hooks/useCheckOut";
import checkInApi from "@/helpers/checkInApi";

const DOCUMENT_UPLOAD_ENDPOINT = "/checkin-checkout/check_out/document/upload/";

const DOCUMENT_TYPES = [
  "Tenant ID Proof",
  "Passport Copy",
  "Address Proof",
  "Police Clearance",
  "Agreement Copy",
  "Agreement Signed",
  "Company Seal",
  "Inspection Photo",
  "Meter Reading Photo",
  "Property Photo",
  "Key Return Photo",
  "Repair Document",
  "Rent Invoice",
  "NOC Certificate",
  "Insurance Document",
  "Stamp Duty",
  "Notice",
  "Other",
];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

const Field = ({ label, defaultValue, readOnly }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input defaultValue={defaultValue ?? ""} readOnly={readOnly} style={readOnly ? readOnlyStyle : fieldStyle} />
  </div>
);

const DocumentSlot = ({ num }) => (
  <div className="mb-5">
    <h5 style={{ ...sectionTitleStyle, fontSize: 19 }}>Document {num} Details</h5>
    <Row className="g-4">
      <Col md={4}>
        <div>
          <label style={labelStyle}>Document File</label>
          <input type="file" name={`slot_${num}_file`} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            style={{ ...fieldStyle, padding: "7px 8px" }} />
        </div>
      </Col>
      <Col md={4}>
        <div>
          <label style={labelStyle}>Document Name</label>
          <input type="text" name={`slot_${num}_document_name`} placeholder="e.g. Tenant ID.pdf" style={fieldStyle} />
        </div>
      </Col>
      <Col md={4}>
        <div>
          <label style={labelStyle}>Document Type</label>
          <div style={{ position: 'relative' }}>
            <select name={`slot_${num}_document_type`} defaultValue="" style={{ ...fieldStyle, WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', paddingRight: 40 }}>
              <option value="">— Select —</option>
              {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18}
              style={{ color: '#526b89', pointerEvents: 'none', position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>
      </Col>
      <Col md={4}>
        <div>
          <label style={labelStyle}>Linked To</label>
          <input type="text" name={`slot_${num}_linked_to`} placeholder="e.g. A-401, Ocean View" style={fieldStyle} />
        </div>
      </Col>
      <Col md={4}>
        <div>
          <label style={labelStyle}>Expiry Date</label>
          <input type="date" name={`slot_${num}_expiry_date`} style={fieldStyle} />
        </div>
      </Col>
    </Row>
  </div>
);

const SLOTS = [1, 2, 3];

const DocumentsEditDetailsPage = ({ mode = "check-out" }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id     = params.get("id");
  const backPath = `/check-out-details?id=${id}&tab=documents`;

  const { item, loading, updateSections, fetchItem } = useCheckOut({ id });
  const formRef    = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const allDocuments = item?.documentsTab?.allDocuments ?? [];
  const notes        = item?.documentsTab?.notes ?? "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current || !id) return;

    const form    = formRef.current;
    const uploads = [];

    for (const num of SLOTS) {
      const fileInput = form.querySelector(`[name="slot_${num}_file"]`);
      const file      = fileInput?.files?.[0];
      if (!file) continue;

      const docType = form.querySelector(`[name="slot_${num}_document_type"]`)?.value;
      if (!docType) {
        toast.error(`Document ${num}: please select a Document Type before uploading.`);
        return;
      }

      const docName  = form.querySelector(`[name="slot_${num}_document_name"]`)?.value || file.name;
      const linkedTo = form.querySelector(`[name="slot_${num}_linked_to"]`)?.value || undefined;
      const expiry   = form.querySelector(`[name="slot_${num}_expiry_date"]`)?.value || undefined;

      uploads.push({ file, docType, docName, linkedTo, expiry });
    }

    const notesValue = form.querySelector('[name="documents_notes"]')?.value ?? "";
    const notesChanged = notesValue !== notes;

    if (uploads.length === 0 && !notesChanged) {
      toast.info("No changes to save.");
      return;
    }

    try {
      setSubmitting(true);
      const requests = uploads.map(async ({ file, docType, docName, linkedTo, expiry }) => {
        const base64  = await fileToBase64(file);
        const payload = {
          check_out_id:  Number(id),
          document_type: docType,
          document_name: docName,
          file:          base64,
        };
        if (linkedTo) payload.linked_to_label = linkedTo;
        if (expiry)   payload.expiry_date = expiry;
        return checkInApi.post(DOCUMENT_UPLOAD_ENDPOINT, payload);
      });
      if (notesChanged) {
        requests.push(updateSections(id, { documents: { documents_notes: notesValue } }));
      }
      await Promise.all(requests);
      await fetchItem();
      setSubmitting(false);
      toast.success("Documents updated successfully");
      alert("Documents updated successfully.");
      formRef.current.reset();
    } catch (err) {
      setSubmitting(false);
      const res     = err?.response?.data;
      const message = res ? JSON.stringify(res) : err?.message || "Upload failed";
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
                  <Button as={Link} to={backPath} variant="outline-secondary" className="w-50 edit-detail-btn-cancel"
                    style={{ borderColor: "#526b89", color: "#526b89", borderRadius: 5, height: 40 }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="w-50 edit-detail-btn-submit"
                    style={{ background: "#526b89", borderColor: "#526b89", borderRadius: 5, height: 40 }}>
                    {submitting ? "Uploading…" : "Upload"}
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
                  Document Details
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* A — Existing Documents */}
                  <h5 style={sectionTitleStyle}>A. Existing Documents</h5>
                  {loading ? (
                    <div className="d-flex justify-content-center py-4"><Spinner /></div>
                  ) : allDocuments.length === 0 ? (
                    <p style={{ color: "#526b89", fontSize: 15, marginBottom: 40 }}>No documents uploaded yet.</p>
                  ) : (
                    <div style={{ border: "1px solid #e4e8ed", borderRadius: 8, marginBottom: 40, overflow: "hidden" }}>
                      <table style={{ borderCollapse: "collapse", width: "100%" }}>
                        <thead>
                          <tr style={{ background: "#fbfcfd" }}>
                            {["#","Document Name","Type","Linked To","Uploaded By","Uploaded On"].map((h) => (
                              <th key={h} style={{ color: "#526b89", fontSize: 15, fontWeight: 700, padding: "14px 18px", textAlign: "left" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {allDocuments.map((doc, idx) => (
                            <tr key={doc.documentId ?? doc.id ?? idx} style={{ borderTop: "1px solid #f0f2f5" }}>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 18px" }}>{idx + 1}</td>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 18px" }}>{doc.documentName ?? doc.name ?? "—"}</td>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 18px" }}>{doc.documentType ?? doc.category ?? "—"}</td>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 18px" }}>{doc.linkedTo ?? "—"}</td>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 18px" }}>{doc.uploadedBy ?? "—"}</td>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 18px" }}>
                                {doc.uploadedOn ? new Date(doc.uploadedOn).toLocaleDateString() : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* B — Upload New Documents */}
                  <h5 style={sectionTitleStyle}>B. Upload New Documents</h5>
                  {SLOTS.map((num) => <DocumentSlot key={num} num={num} />)}

                  {/* C — Notes */}
                  <h5 style={sectionTitleStyle}>C. Notes / Comments</h5>
                  <div className="mb-5">
                    <label style={labelStyle}>Notes</label>
                    <textarea name="documents_notes" defaultValue={notes} placeholder="Notes about this check-out's documents…"
                      style={{ ...fieldStyle, height: "auto", minHeight: 94, resize: "none" }} />
                  </div>

                  {/* D — System Fields */}
                  <h5 style={sectionTitleStyle}>D. System Fields</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}><Field label="Created By" defaultValue={item?.createdBy?.name ?? item?.createdBy ?? ""} readOnly /></Col>
                    <Col md={4}><Field label="Created On" defaultValue={toDateString(item?.createdAt)} readOnly /></Col>
                    <Col md={4}><Field label="Last Updated" defaultValue={toDateString(item?.updatedAt)} readOnly /></Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <Button as={Link} to={backPath} variant="outline-secondary" className="edit-detail-btn-cancel"
                      style={{ borderColor: "#526b89", color: "#526b89", borderRadius: 5, height: 45, minWidth: 200 }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting} className="edit-detail-btn-submit"
                      style={{ background: "#526b89", borderColor: "#526b89", borderRadius: 5, height: 45, minWidth: 200 }}>
                      {submitting ? "Uploading…" : "Upload Documents"}
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

export default DocumentsEditDetailsPage;
