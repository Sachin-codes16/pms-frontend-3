import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

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

const TenantDetailsEditDetailsPage = () => {
  const dashboardPath = "/check-in-dashboard";
  const flowTitle = "Check-In";

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
                {flowTitle} Information
              </h3>

              <div style={{ padding: "34px 36px" }}>
                <h5 id="check-in-information" style={sectionTitleStyle}>
                  A. {flowTitle} Information
                </h5>
                <Row className="g-3 mb-4">
                  <Col md={4}>
                    <FormField
                      label={`${flowTitle} Code / ID`}
                      placeholder="Auto-Generated"
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label={`${flowTitle} Date *`}
                      placeholder="dd-mm-yyyy"
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label={`${flowTitle} Status *`}
                      placeholder="Select Status"
                      as="select"
                    >
                      <option>Approved</option>
                      <option>Pending</option>
                      <option>In Progress</option>
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

                <h5 id="tenant-details" style={sectionTitleStyle}>
                  B. Tenant Details
                </h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Tenant ID" placeholder="TXD132456" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Tenant Name"
                      placeholder="Full Name or Company Name"
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Tenant Type"
                      placeholder="Select Type"
                      as="select"
                    >
                      <option>Individual</option>
                      <option>Company</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Mobile Number"
                      placeholder="01 2456 46547"
                    />
                  </Col>
                  <Col md={4}>
                    <FormField label="Email" placeholder="email@domain.com" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Civil ID" placeholder="Civil ID Number" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Passport Number"
                      placeholder="Passport Number"
                    />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Nationality"
                      placeholder="Select Nationality"
                      as="select"
                    >
                      <option>Oman</option>
                      <option>India</option>
                      <option>United Arab Emirates</option>
                    </FormField>
                  </Col>
                   <Row className="g-4 mb-4">
                  <Col md={12}>
                    <TextAreaField
                      label="Address"
                      placeholder="Enter Address"
                    />
                  </Col>
                </Row>
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
                  <Col md={12}>
                    <TextAreaField
                      label="Status History"
                      placeholder="Created -> Inspection Pending"
                    />
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

export default TenantDetailsEditDetailsPage;
