import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckIn from "@/hooks/useCheckIn";

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

const FormField = ({ label, name, placeholder, as = "input", defaultValue, children }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {as === "select" ? (
      <select style={fieldStyle} name={name} defaultValue={defaultValue ?? ""}>
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
    ) : (
      <input style={fieldStyle} name={name} placeholder={placeholder} defaultValue={defaultValue} />
    )}
  </div>
);

const TextAreaField = ({ label, name, placeholder, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      style={{
        ...fieldStyle,
        minHeight: 94,
        height: "auto",
        resize: "none",
      }}
    />
  </div>
);

const FileField = ({ label }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type="file"
      style={{
        ...fieldStyle,
        padding: "7px 8px",
      }}
    />
  </div>
);

const InspectionEditDetailsPage = ({ mode = "check-in" }) => {
  const location = useLocation();
  const isCheckOut = mode === "check-out";
  const flowTitle = isCheckOut ? "Check-Out" : "Check-In";
  const dashboardPath = isCheckOut
    ? "/check-out-dashboard"
    : "/check-in-dashboard";

  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const { item, loading, updateSections, fetchItem } = useCheckIn({ id });
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!location.hash) return;

    const section = document.getElementById(location.hash.slice(1));
    section?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [location.hash]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    if (!id) {
      alert('Cannot submit: no check-in id in the URL (open this page via "Edit Details" on an existing check-in, not a fresh "Create Check-Ins").');
      return;
    }
    const formData = new FormData(formRef.current);
    const payload = {};
    for (const [k, v] of formData.entries()) {
      if (v === "") continue;
      payload[k] = v;
    }
    try {
      setSubmitting(true);
      await updateSections(id, { property_inspection: payload });
      await fetchItem();
      setSubmitting(false);
      toast.success("Inspection details updated successfully");
      alert("Inspection details updated successfully.");
    } catch (err) {
      setSubmitting(false);
      console.error("Inspection submit failed", err);
      const res = err?.response?.data;
      const message = res ? JSON.stringify(res) : err?.message || "Something went wrong";
      toast.error(message);
      alert(message);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button
          as={Link}
          to={dashboardPath}
          variant="link"
          className="p-0 d-flex align-items-center justify-content-center"
          style={{
            width: 32,
            height: 32,
            border: "1px solid #8a96a8",
            borderRadius: "50%",
            color: "#2f3848",
            textDecoration: "none",
          }}
        >
          <IconifyIcon icon="ri:arrow-left-s-line" width={20} height={20} />
        </Button>
        <h4
          className="mb-0"
          style={{ color: "#526b89", fontSize: 20, fontWeight: 500 }}
        >
          {flowTitle} Information
        </h4>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
      <Row className="g-4 align-items-start">
        <Col xs={12} lg={3}>
          <Card
            className="border-0 shadow-sm"
            style={{
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(16, 24, 40, 0.07)",
            }}
          >
            <CardBody style={{ padding: 24 }}>
              {loading ? (
                <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
                  <Spinner />
                </div>
              ) : (
                <>
                  <h5
                    className="mb-2"
                    style={{ color: "#526b89", fontSize: 18, fontWeight: 700 }}
                  >
                    {item?.tenantDetails?.personalDetails?.tenantName || "Ali Z Shaikh"}
                  </h5>
                  <div
                    className="d-flex flex-wrap gap-3 mb-4"
                    style={{ color: "#526b89", fontSize: 14 }}
                  >
                    <span>{item?.tenantDetails?.contactDetails?.tenantEmail || "alishaikh@domain.com"}</span>
                    <span>{item?.tenantDetails?.contactDetails?.tenantMobileNumber || "+91 102345XX89"}</span>
                  </div>
                </>
              )}

              <Row className="g-3 mb-4">
                <Col xs={6}>
                  <p
                    className="mb-2"
                    style={{ color: "#526b89", fontSize: 16, fontWeight: 700 }}
                  >
                    {flowTitle} Date
                  </p>
                  <p
                    className="mb-0"
                    style={{ color: "#526b89", fontSize: 15 }}
                  >
                    12 April 2026
                  </p>
                </Col>
                <Col xs={6}>
                  <p
                    className="mb-2"
                    style={{ color: "#526b89", fontSize: 16, fontWeight: 700 }}
                  >
                    {flowTitle} Status
                  </p>
                  <p
                    className="mb-0"
                    style={{ color: "#526b89", fontSize: 15 }}
                  >
                    Approved
                  </p>
                </Col>
              </Row>

              <h6
                className="mb-3"
                style={{ color: "#526b89", fontSize: 17, fontWeight: 700 }}
              >
                Property Details
              </h6>
              <Row className="g-3 mb-4">
                <Col xs={6}>
                  <p
                    className="mb-1"
                    style={{ color: "#526b89", fontSize: 15 }}
                  >
                    Property Type
                  </p>
                  <p
                    className="mb-0"
                    style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}
                  >
                    Villa
                  </p>
                </Col>
                <Col xs={6}>
                  <p
                    className="mb-1"
                    style={{ color: "#526b89", fontSize: 15 }}
                  >
                    Property Status
                  </p>
                  <p
                    className="mb-0"
                    style={{ color: "#526b89", fontSize: 15, fontWeight: 700 }}
                  >
                    Reserved
                  </p>
                </Col>
              </Row>

              <div className="d-flex gap-2">
                <Button
                  as={Link}
                  to="/check-in-dashboard"
                  variant="outline-secondary"
                  className="w-50"
                  style={{
                    borderColor: "#526b89",
                    color: "#526b89",
                    borderRadius: 5,
                    height: 40,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-50"
                  style={{
                    background: "#526b89",
                    borderColor: "#526b89",
                    borderRadius: 5,
                    height: 40,
                  }}
                >
                  {submitting ? "Saving..." : "Submit"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xs={12} lg={9}>
          <Card
            className="border-0 shadow-sm"
            style={{
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(16, 24, 40, 0.07)",
              overflow: "hidden",
            }}
          >
            <CardBody style={{ padding: 0 }}>
              <h3
                className="mb-0"
                style={{
                  color: "#526b89",
                  fontSize: 26,
                  fontWeight: 700,
                  padding: "30px 36px 28px",
                  borderBottom: "1px solid #edf0f3",
                }}
              >
                {flowTitle} Information
              </h3>

              <div style={{ padding: "34px 36px" }}>
                <h5 id="inspection" style={sectionTitleStyle}>
                  Inspection
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField
                      label="Category"
                      name="category"
                      placeholder="Walls & Ceilings"
                      as="select"
                    >
                      <option>Walls & Ceilings</option>
                      <option>Doors & Windows</option>
                      <option>Plumbing</option>
                      <option>Electrical</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Total Items" name="total_items" placeholder="5" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Good" name="good" placeholder="4" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Issues" name="issues" placeholder="2" />
                  </Col>
                  <Col md={4}>
                    <FormField label="N/A" name="na" placeholder="0" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Status" name="status" placeholder="Select" as="select">
                      <option>Select</option>
                      <option>Open</option>
                      <option>Closed</option>
                      <option>Pending</option>
                    </FormField>
                  </Col>
                </Row>

                <h5 id="property-inspection" style={sectionTitleStyle}>
                  Property Inspection
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Inspection Required" name="inspection_required" placeholder="" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Inspection Date" name="inspection_date" placeholder="" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Technician Type" name="technician_type" placeholder="" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Manager Approval" name="manager_approval" placeholder="" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Priority"
                      name="priority"
                      placeholder="Select Priority"
                      as="select"
                    >
                      <option>Select Priority</option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </FormField>
                  </Col>
                  <Col md={12}>
                    <TextAreaField
                      label="Issue Identified"
                      name="issue_identified"
                      placeholder="Describe Issues"
                    />
                  </Col>
                  <Col md={12}>
                    <TextAreaField
                      label="Supervisor Remarks"
                      name="supervisor_remarks"
                      placeholder="Supervisor notes"
                    />
                  </Col>
                </Row>

                <h5 id="notes" style={sectionTitleStyle}>
                  Notes
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={12}>
                    <TextAreaField
                      label="Notes"
                      placeholder="Feedback or Notes from tenant"
                    />
                  </Col>
                </Row>

                <h5 id="system-fields" style={sectionTitleStyle}>
                  System Fields (Auto)
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Created By" placeholder="System Admin" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Created Date" placeholder="dd-mm-yyyy" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Updated By" placeholder="Auto" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Updated Date" placeholder="dd-mm-yyyy" />
                  </Col>
                
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    as={Link}
                    to={dashboardPath}
                    variant="outline-secondary"
                    style={{
                      borderColor: "#526b89",
                      color: "#526b89",
                      borderRadius: 5,
                      minWidth: 200,
                      height: 45,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: "#526b89",
                      borderColor: "#526b89",
                      borderRadius: 5,
                      minWidth: 200,
                      height: 45,
                    }}
                  >
                    {submitting ? "Saving..." : "Submit"}
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

export default InspectionEditDetailsPage;
