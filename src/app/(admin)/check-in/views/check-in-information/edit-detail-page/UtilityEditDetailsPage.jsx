import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useEffect } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

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

const FormField = ({
  label,
  placeholder,
  as = "input",
  children,
  disabled = false,
}) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {as === "select" ? (
      <select style={fieldStyle} defaultValue="" disabled={disabled}>
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
    ) : (
      <input style={fieldStyle} placeholder={placeholder} disabled={disabled} />
    )}
  </div>
);

const TextAreaField = ({ label, placeholder, disabled = false }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea
      placeholder={placeholder}
      disabled={disabled}
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

const UtilityEditDetailsPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const section = document.getElementById(location.hash.slice(1));
    section?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [location.hash]);

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button
          as={Link}
          to="/check-in-dashboard"
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
          Check-In Information
        </h4>
      </div>

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
              <h5
                className="mb-2"
                style={{ color: "#526b89", fontSize: 18, fontWeight: 700 }}
              >
                Ali Z Shaikh
              </h5>
              <div
                className="d-flex flex-wrap gap-3 mb-4"
                style={{ color: "#526b89", fontSize: 14 }}
              >
                <span>alishaikh@domain.com</span>
                <span>+91 102345XX89</span>
              </div>

              <Row className="g-3 mb-4">
                <Col xs={6}>
                  <p
                    className="mb-2"
                    style={{ color: "#526b89", fontSize: 16, fontWeight: 700 }}
                  >
                    Check-In Date
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
                    Check-In Status
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
                  type="button"
                  className="w-50"
                  style={{
                    background: "#526b89",
                    borderColor: "#526b89",
                    borderRadius: 5,
                    height: 40,
                  }}
                >
                  Submit
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
                Check-In Information
              </h3>

              <div style={{ padding: "34px 36px" }}>
                <h5 id="utility-reading-info" style={sectionTitleStyle}>
                  A. Utility Reading Information
                </h5>
                <Row className="g-3 mb-4">
                  <Col md={4}>
                    <FormField
                      label="Reading Code / ID"
                      placeholder="Auto-Generated"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Reading Date *"
                      placeholder="dd-mm-yyyy"
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Reading Status *"
                      placeholder="Select Status"
                      as="select"
                    >
                      <option>Completed</option>
                      <option>Pending</option>
                      <option>In Review</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Assigned Employee *"
                      placeholder="Employee Name"
                    />
                  </Col>
                  <Col md={12}>
                    <FormField
                      label="Remarks / Notes"
                      placeholder="Enter initial remarks"
                    />
                  </Col>
                </Row>

                <h5 id="electricity-readings" style={sectionTitleStyle}>
                  B. Electricity Readings
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Meter Number *" placeholder="ELE12345" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Previous Reading"
                      placeholder="Reading Value"
                    />
                  </Col>
                  <Col md={4}>
                    <FormField label="Current Reading *" placeholder="1245" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Consumption (kWh)"
                      placeholder="332"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField label="Unit" placeholder="kWh" disabled />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Rate per Unit"
                      placeholder="5 OMR"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Total Charges"
                      placeholder="535 OMR"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Status"
                      placeholder="Select Status"
                      as="select"
                    >
                      <option>Normal</option>
                      <option>Abnormal</option>
                      <option>Pending Review</option>
                    </FormField>
                  </Col>
                  <Col md={12}>
                    <TextAreaField
                      label="Technician Notes"
                      placeholder="Any observations or issues"
                    />
                  </Col>
                </Row>

                <h5 id="water-readings" style={sectionTitleStyle}>
                  C. Water Utilities Readings
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Meter Number *" placeholder="WAT12345" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Previous Reading"
                      placeholder="Reading Value"
                    />
                  </Col>
                  <Col md={4}>
                    <FormField label="Current Reading *" placeholder="1245" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Consumption (m³)"
                      placeholder="332"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField label="Unit" placeholder="m³" disabled />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Rate per Unit"
                      placeholder="5 OMR"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Total Charges"
                      placeholder="535 OMR"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Status"
                      placeholder="Select Status"
                      as="select"
                    >
                      <option>Normal</option>
                      <option>Abnormal</option>
                      <option>Pending Review</option>
                    </FormField>
                  </Col>
                  <Col md={12}>
                    <TextAreaField
                      label="Technician Notes"
                      placeholder="Any observations or issues"
                    />
                  </Col>
                </Row>

                <h5 id="gas-readings" style={sectionTitleStyle}>
                  D. Gas Utilities Readings
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Meter Number" placeholder="GAS12345" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Previous Reading"
                      placeholder="Reading Value"
                    />
                  </Col>
                  <Col md={4}>
                    <FormField label="Current Reading" placeholder="1245" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Consumption (m³)"
                      placeholder="332"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField label="Unit" placeholder="m³" disabled />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Rate per Unit"
                      placeholder="5 OMR"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Total Charges"
                      placeholder="535 OMR"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Status"
                      placeholder="Select Status"
                      as="select"
                    >
                      <option>Normal</option>
                      <option>Abnormal</option>
                      <option>Not Applicable</option>
                    </FormField>
                  </Col>
                </Row>

                <h5 id="meter-photo-upload" style={sectionTitleStyle}>
                  E. Meter Photo Upload
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FileField label="Electricity Meter Photo" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Water Meter Photo" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Gas Meter Photo" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Additional Photo" />
                  </Col>
                </Row>

                <h5 id="verification-approval" style={sectionTitleStyle}>
                  F. Verification &amp; Approval
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField
                      label="Verification Required"
                      placeholder="Select"
                      as="select"
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Supervisor Approval"
                      placeholder="Select Status"
                      as="select"
                    >
                      <option>Approved</option>
                      <option>Pending</option>
                      <option>Rejected</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Approval Date" placeholder="dd-mm-yyyy" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Approved By"
                      placeholder="Employee Name"
                    />
                  </Col>
                  <Col md={12}>
                    <TextAreaField
                      label="Supervisor Remarks"
                      placeholder="Supervisor notes and comments"
                    />
                  </Col>
                </Row>

                <h5 id="billing-calculation" style={sectionTitleStyle}>
                  G. Billing Calculation
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField
                      label="Electricity Total Charges"
                      placeholder="Amount"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Water Total Charges"
                      placeholder="Amount"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Gas Total Charges"
                      placeholder="Amount"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Maintenance Charges"
                      placeholder="Amount"
                    />
                  </Col>
                  <Col md={4}>
                    <FormField label="Other Charges" placeholder="Amount" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Grand Total"
                      placeholder="Total Amount"
                      disabled
                    />
                  </Col>
                </Row>

                <h5 id="documents-upload" style={sectionTitleStyle}>
                  H. Documents Upload
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FileField label="Reading Receipt" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Inspection Report" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Billing Document" />
                  </Col>
                </Row>

                <h5 id="notes" style={sectionTitleStyle}>
                  I. General Notes
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={12}>
                    <TextAreaField
                      label="Internal Notes"
                      placeholder="Feedback or internal notes"
                    />
                  </Col>
                </Row>

                <h5 id="system-fields" style={sectionTitleStyle}>
                  J. System Fields (Auto)
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField
                      label="Created By"
                      placeholder="System Admin"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Created Date"
                      placeholder="dd-mm-yyyy"
                      disabled
                    />
                  </Col>
                  <Col md={4}>
                    <FormField label="Updated By" placeholder="Auto" disabled />
                  </Col>
                  <Col md={12}>
                    <FormField label="Updated Date" placeholder="dd-mm-yyyy" />
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    as={Link}
                    to="/check-in-dashboard"
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
                    type="button"
                    style={{
                      background: "#526b89",
                      borderColor: "#526b89",
                      borderRadius: 5,
                      minWidth: 200,
                      height: 45,
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UtilityEditDetailsPage;
