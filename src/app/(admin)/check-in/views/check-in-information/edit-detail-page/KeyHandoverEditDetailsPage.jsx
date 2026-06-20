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

const FormField = ({ label, placeholder, as = "input", children }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {as === "select" ? (
      <select style={fieldStyle} defaultValue="">
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
    ) : (
      <input style={fieldStyle} placeholder={placeholder} />
    )}
  </div>
);

const TextAreaField = ({ label, placeholder }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea
      placeholder={placeholder}
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

const DateField = ({ label }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type="date"
      placeholder="dd-mm-yyyy"
      style={fieldStyle}
    />
  </div>
);

const CheckInInformationForm = ({ mode = "check-in" }) => {
  const location = useLocation();
  const isCheckOut = mode === "check-out";
  const dashboardPath = isCheckOut
    ? "/check-out-dashboard"
    : "/check-in-dashboard";

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
          Check-In Information &gt; Key Handower information
        </h4>
      </div>

      <Row className="g-4 align-items-start">
        {/* Left Sidebar */}
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
                    Check-in Date
                  </p>
                  <p className="mb-0" style={{ color: "#526b89", fontSize: 15 }}>
                    12 April 2026
                  </p>
                </Col>
                <Col xs={6}>
                  <p
                    className="mb-2"
                    style={{ color: "#526b89", fontSize: 16, fontWeight: 700 }}
                  >
                    Check-in Status
                  </p>
                  <p className="mb-0" style={{ color: "#526b89", fontSize: 15 }}>
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
                  <p className="mb-1" style={{ color: "#526b89", fontSize: 15 }}>
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
                  <p className="mb-1" style={{ color: "#526b89", fontSize: 15 }}>
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
                  to={dashboardPath}
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

        {/* Main Form */}
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
                Check-In Information &gt; Key Handover information 
              </h3>

              <div style={{ padding: "34px 36px" }}>

                {/* Agreement Details */}
                <h5 id="agreement-details" style={sectionTitleStyle}>
                  Key Handover information
                </h5>
                <Row className="g-4 mb-4">
  <Col md={4}>
    <FormField
      label="Key Return Status"
      placeholder="Completed"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Number"
      placeholder="KH-1321-5648"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Type"
      placeholder="Main Door Key"
      as="select"
    >
      <option>Main Door Key</option>
      <option>Bedroom Key</option>
      <option>Parking Key</option>
      <option>Office Key</option>
    </FormField>
  </Col>

  <Col md={4}>
    <FormField
      label="Key Available"
      placeholder="Yes"
      as="select"
    >
      <option>Yes</option>
      <option>No</option>
    </FormField>
  </Col>
</Row>

                {/* Documents Upload */}
                <h5 id="documents-upload" style={sectionTitleStyle}>
                  Dates & time details
                </h5>
              <Row className="g-4 mb-4">
  <Col md={4}>
    <DateField label="Key Return Date & Time" />
  </Col>

  <Col md={4}>
    <DateField label="Expected Return Date & Time" />
  </Col>

  <Col md={4}>
    <DateField label="Actual Key Return Date & Time" />
  </Col>

  <Col md={4}>
    <FormField
      label="Handed Over By"
      placeholder="Ramesh Kumar"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Received By (Tenant)"
      placeholder="Bilal Ahmed"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Tenant Contact Number"
      placeholder="+965 5555 1234"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Confirmation Received"
      placeholder="Yes"
      as="select"
    >
      <option>Yes</option>
      <option>No</option>
    </FormField>
  </Col>
</Row>

                {/* Agreement Notes */}
                <h5 id="agreement-notes" style={sectionTitleStyle}>
                  Key details & multiple emteries
                </h5>
               <Row className="g-4 mb-4">
  <Col md={4}>
    <FormField
      label="1 Key Number"
      placeholder="KH-1234-5671"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Type"
      placeholder="Main Door Key"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Status"
      placeholder="Handovered"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="2 Key Number"
      placeholder="KH-1234-5671"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Type"
      placeholder="Mail Box Key"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Status"
      placeholder="Handovered"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="3 Key Number"
      placeholder="KH-1234-5671"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Type"
      placeholder="Utility Room Key"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Status"
      placeholder="Handovered"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="4 Key Number"
      placeholder="KH-1234-5671"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Type"
      placeholder="Basement Parking Key"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Status"
      placeholder="Handovered"
    />
  </Col>
</Row>

                {/* Agreement Timeline */}
                <h5 id="agreement-timeline" style={sectionTitleStyle}>
                  Documents Upload
                </h5>
               <Row className="g-4 mb-4">
  <Col md={4}>
    <FileField label="Key Return Photo" />
  </Col>

  <Col md={4}>
    <FileField label="Tenant ID Proof" />
  </Col>

  <Col md={4}>
    <FileField label="Key Receipt" />
  </Col>

  <Col md={4}>
    <FileField label="Main Door Key" />
  </Col>
</Row>
<h5 id="tenant-confirmation" style={sectionTitleStyle}>
  Tenant Confirmation
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
    <FormField
      label="Created By"
      placeholder="System Admin"
    />
  </Col>

  <Col md={4}>
    <div>
      <label style={labelStyle}>Created Date</label>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="dd-mm-yyyy"
          style={fieldStyle}
        />

        <IconifyIcon
          icon="mdi:calendar-month-outline"
          style={{
            position: "absolute",
            right: 12,
            top: 13,
            fontSize: 20,
            color: "#526b89",
          }}
        />
      </div>
    </div>
  </Col>

  <Col md={4}>
    <FormField
      label="Updated By"
      placeholder="Auto"
    />
  </Col>

  <Col md={4}>
    <div>
      <label style={labelStyle}>Updated Date</label>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="dd-mm-yyyy"
          style={fieldStyle}
        />

        <IconifyIcon
          icon="mdi:calendar-month-outline"
          style={{
            position: "absolute",
            right: 12,
            top: 13,
            fontSize: 20,
            color: "#526b89",
          }}
        />
      </div>
    </div>
  </Col>
</Row>
                {/* Bottom Buttons */}
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

export default CheckInInformationForm;