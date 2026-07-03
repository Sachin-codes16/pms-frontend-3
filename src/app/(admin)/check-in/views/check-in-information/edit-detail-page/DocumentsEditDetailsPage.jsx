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

const DOCUMENT_TYPES = [
  "Company Seal",
  "Rent Invoice",
  "NOC Certificate",
  "Property Photo",
  "Agreement Signed",
];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

const Field = ({ label, defaultValue, readOnly }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      defaultValue={defaultValue ?? ""}
      readOnly={readOnly}
      style={readOnly ? readOnlyStyle : fieldStyle}
    />
  </div>
);

const DocumentSlot = ({ num }) => (
  <div className="mb-5">
    <h5 style={{ ...sectionTitleStyle, fontSize: 19 }}>Document {num} Details</h5>
    <Row className="g-4">
      <Col md={4}>
        <div>
          <label style={labelStyle}>Document File</label>
          <input
            type="file"
            name={`slot_${num}_file`}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            style={{ ...fieldStyle, padding: "7px 8px" }}
          />
        </div>
      </Col>
      <Col md={4}>
        <div>
          <label style={labelStyle}>Document Name</label>
          <input
            type="text"
            name={`slot_${num}_document_name`}
            placeholder="e.g. Agreement Doc.pdf"
            style={fieldStyle}
          />
        </div>
      </Col>
      <Col md={4}>
        <div>
          <label style={labelStyle}>Document Type</label>
          <select name={`slot_${num}_document_type`} defaultValue="" style={fieldStyle}>
            <option value="">— Select —</option>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </Col>
      <Col md={4}>
        <div>
          <label style={labelStyle}>Linked To</label>
          <input
            type="text"
            name={`slot_${num}_linked_to`}
            placeholder="e.g. A-401, Ocean View"
            style={fieldStyle}
          />
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

const DocumentsEditDetailsPage = ({ mode = "check-in" }) => {
  const location   = useLocation();
  const isCheckOut = mode === "check-out";
  const flowTitle  = isCheckOut ? "Check-Out" : "Check-In";
  const backPath   = isCheckOut ? "/check-out-dashboard" : "/check-in-dashboard";

  const params = new URLSearchParams(location.search);
  const id     = params.get("id");

  const { item, loading, fetchItem } = useCheckIn({ id });
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

    if (uploads.length === 0) {
      toast.info("No files selected. Pick at least one document to upload.");
      return;
    }

    try {
      setSubmitting(true);
      await Promise.all(
        uploads.map(async ({ file, docType, docName, linkedTo, expiry }) => {
          const base64  = await fileToBase64(file);
          const payload = {
            check_in_id:   Number(id),
            document_type: docType,
            document_name: docName,
            file:          base64,
          };
          if (linkedTo) payload.linked_to   = linkedTo;
          if (expiry)   payload.expiry_date = expiry;
          return checkInApi.post(DOCUMENT_UPLOAD_ENDPOINT, payload);
        })
      );
      await fetchItem();
      setSubmitting(false);
      toast.success(`${uploads.length} document${uploads.length > 1 ? "s" : ""} uploaded successfully`);
      formRef.current.reset();
    } catch (err) {
      setSubmitting(false);
      const res     = err?.response?.data;
      const message = res ? JSON.stringify(res) : err?.message || "Upload failed";
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
                    {submitting ? "Uploading…" : "Upload"}
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
                  Document Details
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* Section A — Existing Documents */}
                  <h5 style={sectionTitleStyle}>A. Existing Documents</h5>
                  {loading ? (
                    <div className="d-flex justify-content-center py-4">
                      <Spinner />
                    </div>
                  ) : allDocuments.length === 0 ? (
                    <p style={{ color: "#526b89", fontSize: 15, marginBottom: 40 }}>No documents uploaded yet.</p>
                  ) : (
                    <div style={{ border: "1px solid #e4e8ed", borderRadius: 8, marginBottom: 40, overflow: "hidden" }}>
                      <table style={{ borderCollapse: "collapse", width: "100%" }}>
                        <thead>
                          <tr style={{ background: "#fbfcfd" }}>
                            {["#", "Document Name", "Type", "Linked To", "Uploaded By", "Uploaded On"].map((h) => (
                              <th key={h} style={{ color: "#526b89", fontSize: 15, fontWeight: 700, padding: "14px 18px", textAlign: "left" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {allDocuments.map((doc, index) => (
                            <tr key={doc.documentId ?? doc.id ?? index} style={{ borderTop: "1px solid #f0f2f5" }}>
                              <td style={{ color: "#526b89", fontSize: 15, padding: "12px 18px" }}>{index + 1}</td>
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

                  {/* Section B — Upload New Documents */}
                  <h5 style={sectionTitleStyle}>B. Upload New Documents</h5>
                  {SLOTS.map((num) => (
                    <DocumentSlot key={num} num={num} />
                  ))}

                  {/* Section C — Notes / Comments */}
                  <h5 style={sectionTitleStyle}>C. Notes / Comments</h5>
                  <div className="mb-5">
                    <div style={{ background: "#fff7f7", border: "1px solid #f0cfd0", borderRadius: 8, padding: "16px 18px" }}>
                      <p style={{ color: "#526b89", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Notes</p>
                      <div style={{ background: "#fff", borderRadius: 8, color: "#666", fontSize: 15, padding: "16px 22px" }}>
                        {notes || "No notes added"}
                      </div>
                    </div>
                  </div>

                  {/* Section D — System Fields */}
                  <h5 style={sectionTitleStyle}>D. System Fields</h5>
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
