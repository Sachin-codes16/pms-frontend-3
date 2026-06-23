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

const DateField = ({ label, name, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type="date"
      name={name}
      defaultValue={defaultValue}
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
      await updateSections(id, { key_handover: payload });
      await fetchItem();
      setSubmitting(false);
      toast.success("Key handover details updated successfully");
      alert("Key handover details updated successfully.");
    } catch (err) {
      setSubmitting(false);
      console.error("Key handover submit failed", err);
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
          Check-In Information &gt; Key Handower information
        </h4>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
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
      name="key_handover_status"
      placeholder="Completed"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Number"
      name="key_number"
      placeholder="KH-1321-5648"
    />
  </Col>

  <Col md={4}>
    <FormField
      label="Key Type"
      name="key_type"
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
      name="key_available"
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
    <DateField label="Key Return Date & Time" name="key_delivery_date" />
  </Col>

  <Col md={4}>
    <DateField label="Expected Return Date & Time" name="expected_handover_date" />
  </Col>

  <Col md={4}>
    <DateField label="Actual Key Return Date & Time" name="handover_completed_on" />
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
      name="confirmation_received"
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
      name="tenant_confirmation_notes"
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

export default CheckInInformationForm;