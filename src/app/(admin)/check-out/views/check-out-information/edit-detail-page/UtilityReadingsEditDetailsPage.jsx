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

const DateField = ({ label, placeholder = "dd-mm-yyyy" }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div style={{ position: "relative" }}>
      <input style={fieldStyle} placeholder={placeholder} />
      <IconifyIcon
        icon="ri:calendar-line"
        width={18}
        height={18}
        style={{
          position: "absolute",
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#8a96a8",
          pointerEvents: "none",
        }}
      />
    </div>
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

const UtilitiesReadingsForm = ({ mode = "check-in" }) => {
  const isCheckOut = mode === "check-out";
  const flowTitle = isCheckOut ? "Check-Out" : "Check-In";
  const dashboardPath = isCheckOut
    ? "/check-out-dashboard"
    : "/check-in-dashboard";
  const parentPath = isCheckOut
    ? "/check-out-information"
    : "/check-in-information";
  const pageTitle = `${flowTitle} Information > Utilities Readings`;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button
          as={Link}
          to={parentPath}
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
          {pageTitle}
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
                {pageTitle}
              </h3>

              <div style={{ padding: "34px 36px" }}>
                <h5 style={sectionTitleStyle}>Utilities Readings</h5>
                <Row className="g-4 mb-3">
                  <Col md={4}>
                    <FormField label="Meter Number:" placeholder="ELE12345" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Current Reading:" placeholder="1245" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Consumption" placeholder="332" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Unit" placeholder="kWh" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Rate per Unit" placeholder="5 OMR" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Total Charges" placeholder="535 OMR" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Status"
                      placeholder="Select Status"
                      as="select"
                    >
                      <option>Normal</option>
                      <option>High</option>
                      <option>Abnormal</option>
                    </FormField>
                  </Col>
                </Row>

                <h5 style={sectionTitleStyle}>Water Utilities Readings</h5>
                <Row className="g-4 mb-3">
                  <Col md={4}>
                    <FormField label="Meter Number:" placeholder="WTR12345" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Current Reading:" placeholder="1245" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Consumption" placeholder="332" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Unit" placeholder="m3" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Rate per Unit" placeholder="5 OMR" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Total Charges" placeholder="535 OMR" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Status"
                      placeholder="Select Status"
                      as="select"
                    >
                      <option>Normal</option>
                      <option>High</option>
                      <option>Abnormal</option>
                    </FormField>
                  </Col>
                </Row>

                <h5 style={sectionTitleStyle}>Documents Upload</h5>
                <Row className="g-4 mb-3">
                  <Col md={4}>
                    <FileField label="Meter Photo Upload" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Meter Photo Upload" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Meter Photo Upload" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Meter Photo Upload" />
                  </Col>
                </Row>

                <h5 style={sectionTitleStyle}>Notes</h5>
                <Row className="g-4 mb-3">
                  <Col md={12}>
                    <TextAreaField
                      label="Notes"
                      placeholder="Feedback or Notes from tenant"
                    />
                  </Col>
                </Row>

                <h5 style={sectionTitleStyle}>System Fields (Auto)</h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Created By" placeholder="System Admin" />
                  </Col>
                  <Col md={4}>
                    <DateField label="Created Date" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Updated By" placeholder="Auto" />
                  </Col>
                  <Col md={4}>
                    <DateField label="Updated Date" />
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    as={Link}
                    to={parentPath}
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

export default UtilitiesReadingsForm;