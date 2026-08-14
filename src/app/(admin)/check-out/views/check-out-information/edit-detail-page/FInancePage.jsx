// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckOut from "@/hooks/useCheckOut";
import checkInApi from "@/helpers/checkInApi";

const FIELD_MAP = {
  charge_type:          "chargeType",
  total_amount:         "totalAmount",
  payment_status:       "paymentStatus",
  payment_date:         "paymentDate",
  transaction_id:       "transactionId",
  settlement_status:    "settlementStatus",
  finance_description:  "financeDescription",
};

// Only these fields are ever sent to the finance_details PATCH — keeps the
// dynamic payment-management inputs (added below) from leaking into it.
const FINANCE_DETAILS_FIELDS = Object.keys(FIELD_MAP);

const PAYMENT_CREATE_ENDPOINT = "/checkin-checkout/check_out/payment/create/";
const PAYMENT_UPDATE_ENDPOINT = "/checkin-checkout/check_out/payment/update/";

// Confirmed against the live API schema (ChargeTypeEnum / PaymentMethodEnum / StatusD8aEnum)
const CHARGE_TYPE_OPTIONS = ["Security Deposit Refund", "Deduction", "Pending Dues", "Rent", "Maintenance", "Damage", "Other"];
const PAYMENT_METHOD_OPTIONS = ["Cash", "Bank Transfer", "Online", "Cheque"];
const PAYMENT_STATUS_OPTIONS = ["Pending", "Paid"];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

const TextArea = ({ label, name, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea name={name} defaultValue={defaultValue ?? ""}
      style={{ ...fieldStyle, height: "auto", minHeight: 94, resize: "none" }} />
  </div>
);

// One card per existing payment/charge entry — lets the user update its
// status, method, date, receipt ref, and remarks.
const PaymentRow = ({ entry }) => {
  const pid    = entry.checkOutPaymentId ?? entry.id;
  const prefix = `p_${pid}`;
  return (
    <div className="mb-4" style={{ background: "#fbfcfd", border: "1px solid #e7e9ef", borderRadius: 8, padding: 20 }}>
      <h6 className="mb-3" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>
        #{pid} — {entry.chargeType ?? "—"}: {entry.description ?? "—"} ({entry.amount != null ? `${entry.amount} OMR` : "—"})
      </h6>
      <Row className="g-4">
        <Col md={3}>
          <SelectField label="Status" name={`${prefix}_status`} defaultValue={entry.status ?? ""} options={PAYMENT_STATUS_OPTIONS} />
        </Col>
        <Col md={3}>
          <SelectField label="Payment Method" name={`${prefix}_payment_method`} defaultValue={entry.paymentMethod ?? ""} options={PAYMENT_METHOD_OPTIONS} />
        </Col>
        <Col md={3}>
          <Field label="Payment Date" name={`${prefix}_payment_date`} type="date" defaultValue={toDateString(entry.paymentDate)} />
        </Col>
        <Col md={3}>
          <Field label="Receipt Ref No" name={`${prefix}_receipt_ref_no`} defaultValue={entry.receiptRefNo ?? entry.transactionId ?? ""} />
        </Col>
      </Row>
    </div>
  );
};

// One dynamic "add new" row for recording a new charge/payment.
const NewPaymentRow = ({ rowId, onRemove }) => {
  const prefix = `new_${rowId}`;
  return (
    <div className="mb-4" style={{ background: "#fbfcfd", border: "1px solid #e7e9ef", borderRadius: 8, padding: 20 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0" style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}>New Entry #{rowId}</h6>
        <Button type="button" variant="link" className="p-0" style={{ color: "#e35d5d" }} onClick={() => onRemove(rowId)}>
          Remove
        </Button>
      </div>
      <Row className="g-4">
        <Col md={4}>
          <Field label="Description" name={`${prefix}_description`} />
        </Col>
        <Col md={4}>
          <SelectField label="Charge Type" name={`${prefix}_charge_type`} options={CHARGE_TYPE_OPTIONS} />
        </Col>
        <Col md={4}>
          <Field label="Amount" name={`${prefix}_amount`} type="number" />
        </Col>
        <Col md={4}>
          <Field label="Tax" name={`${prefix}_tax`} type="number" />
        </Col>
        <Col md={4}>
          <SelectField label="Payment Method" name={`${prefix}_payment_method`} options={PAYMENT_METHOD_OPTIONS} />
        </Col>
        <Col md={4}>
          <Field label="Payment Date" name={`${prefix}_payment_date`} type="date" />
        </Col>
        <Col md={4}>
          <Field label="Receipt Ref No" name={`${prefix}_receipt_ref_no`} />
        </Col>
        <Col md={4}>
          <SelectField label="Status" name={`${prefix}_status`} defaultValue="Pending" options={PAYMENT_STATUS_OPTIONS} />
        </Col>
        <Col md={8}>
          <Field label="Remarks" name={`${prefix}_remarks`} />
        </Col>
      </Row>
    </div>
  );
};

const FinanceEditDetailsPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id     = params.get("id");
  const backPath = `/check-out-details?id=${id}&tab=finance`;

  const { item, loading, updateSections, fetchItem } = useCheckOut({ id });
  const formRef    = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [newRowIds, setNewRowIds] = useState([]);
  const nextRowId  = useRef(1);

  const gv = (name) => getValue(item, name);

  const existingPayments = item?.financeDetails?.chargesAndDeductions ?? [];

  const addNewRow = () => {
    setNewRowIds((prev) => [...prev, nextRowId.current++]);
  };
  const removeNewRow = (rowId) => {
    setNewRowIds((prev) => prev.filter((r) => r !== rowId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current || !id) return;

    const form = formRef.current;
    const formData = new FormData(form);
    const values = {};
    for (const [k, v] of formData.entries()) {
      if (v !== "") values[k] = v;
    }

    const body = {};
    for (const k of FINANCE_DETAILS_FIELDS) {
      if (values[k] !== undefined) body[k] = values[k];
    }

    const paymentUpdates = existingPayments
      .map((entry) => {
        const pid    = entry.checkOutPaymentId ?? entry.id;
        const prefix = `p_${pid}`;
        const payload = { check_out_payment_id: pid };
        let hasChange = false;
        ["status", "payment_method", "payment_date", "receipt_ref_no"].forEach((field) => {
          const v = values[`${prefix}_${field}`];
          if (v !== undefined) { payload[field] = v; hasChange = true; }
        });
        return hasChange ? payload : null;
      })
      .filter(Boolean);

    const paymentCreates = newRowIds
      .map((rowId) => {
        const prefix = `new_${rowId}`;
        const description = values[`${prefix}_description`];
        const amount = values[`${prefix}_amount`];
        if (!description && !amount) return null;

        const payload = { check_out_id: Number(id) };
        ["description", "amount", "tax", "charge_type", "payment_method", "payment_date", "receipt_ref_no", "status", "remarks"].forEach((field) => {
          const v = values[`${prefix}_${field}`];
          if (v !== undefined) payload[field] = v;
        });
        return payload;
      })
      .filter(Boolean);

    const proofFile = form.querySelector('[name="payment_proof_file"]')?.files?.[0];
    if (proofFile) body.payment_proof = await fileToBase64(proofFile);

    try {
      setSubmitting(true);
      await Promise.all([
        updateSections(id, { finance_details: body }),
        ...paymentUpdates.map((payload) => checkInApi.patch(PAYMENT_UPDATE_ENDPOINT, payload)),
        ...paymentCreates.map((payload) => checkInApi.post(PAYMENT_CREATE_ENDPOINT, payload)),
      ]);
      setNewRowIds([]);
      await fetchItem();
      setSubmitting(false);
      toast.success("Finance details updated successfully");
      alert("Finance details updated successfully.");
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
                  <Button as={Link} to={backPath} variant="outline-secondary" className="w-50 edit-detail-btn-cancel"
                    style={{ borderColor: "#526b89", color: "#526b89", borderRadius: 5, height: 40 }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="w-50 edit-detail-btn-submit"
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
                  Finance Details
                </h3>

                <div style={{ padding: "34px 36px" }}>

                  {/* A — Finance Details */}
                  <h5 id="finance-details" style={sectionTitleStyle}>A. Finance Details</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <SelectField label="Charge Type" name="charge_type"
                        defaultValue={gv("charge_type")}
                        options={["Security Deposit Refund", "Deduction", "Pending Dues", "Rent", "Maintenance", "Damage", "Other"]} />
                    </Col>
                    <Col md={4}>
                      <Field label="Total Amount" name="total_amount" defaultValue={gv("total_amount")} />
                    </Col>
                    <Col md={4}>
                      <SelectField label="Payment Status" name="payment_status"
                        defaultValue={gv("payment_status")}
                        options={["Pending", "Paid", "Partially Paid", "Refunded"]} />
                    </Col>
                    <Col md={4}>
                      <Field label="Payment Date" name="payment_date" type="date"
                        defaultValue={toDateString(gv("payment_date"))} />
                    </Col>
                    <Col md={4}>
                      <Field label="Transaction ID" name="transaction_id" defaultValue={gv("transaction_id")} />
                    </Col>
                    <Col md={4}>
                      {/* Read-only: confirmed live that the backend silently drops this
                          field on PATCH even though the schema marks it as writable. */}
                      <Field label="Settlement Status" defaultValue={gv("settlement_status")} readOnly />
                    </Col>
                    <Col md={4}>
                      <div>
                        <label style={labelStyle}>Payment Proof</label>
                        <input type="file" name="payment_proof_file" accept="image/*,application/pdf" style={{ ...fieldStyle, padding: "7px 8px" }} />
                      </div>
                    </Col>
                    <Col md={12}>
                      <TextArea label="Finance Description" name="finance_description" defaultValue={gv("finance_description")} />
                    </Col>
                  </Row>

                  {/* B — Manage Payments & Charges */}
                  <h5 id="manage-payments" style={sectionTitleStyle}>B. Manage Payments &amp; Charges</h5>
                  {existingPayments.length === 0 ? (
                    <p style={{ color: "#526b89", fontSize: 15, marginBottom: 20 }}>
                      No payments or charges recorded yet.
                    </p>
                  ) : (
                    existingPayments.map((entry) => (
                      <PaymentRow key={entry.checkOutPaymentId ?? entry.id} entry={entry} />
                    ))
                  )}

                  {newRowIds.map((rowId) => (
                    <NewPaymentRow key={rowId} rowId={rowId} onRemove={removeNewRow} />
                  ))}

                  <Button type="button" variant="outline-secondary" className="mb-5 edit-detail-btn-cancel"
                    style={{ borderColor: "#526b89", color: "#526b89", borderRadius: 5 }}
                    onClick={addNewRow}>
                    + Add Charge / Payment
                  </Button>

                  {/* C — System Fields */}
                  <h5 id="system-fields" style={sectionTitleStyle}>C. System Fields</h5>
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
                    <Button as={Link} to={backPath} variant="outline-secondary" className="edit-detail-btn-cancel"
                      style={{ borderColor: "#526b89", color: "#526b89", borderRadius: 5, height: 45, minWidth: 200 }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting} className="edit-detail-btn-submit"
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

export default FinanceEditDetailsPage;
