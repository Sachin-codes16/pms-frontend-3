import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckIn from "@/hooks/useCheckIn";
import checkInApi from "@/helpers/checkInApi";

// PATCH /checkin-checkout/check_in/utility_reading/update/ updates ONE
// reading record at a time (keyed by check_in_utility_reading_id), not the
// whole check-in by section like the other edit pages.
const READING_UPDATE_ENDPOINT = "/checkin-checkout/check_in/utility_reading/update/";

const READING_FIELD_MAP = {
  meter_number: "meter_no",
  current_reading: "reading_value",
  consumption: "consumption",
  unit: "unit",
  rate_per_unit: "rate_per_unit",
  total_charges: "charges",
  status: "status",
};

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

const UtilitiesReadingsForm = ({ mode = "check-in" }) => {
  const location = useLocation();
  const isCheckOut = mode === "check-out";
  const flowTitle = isCheckOut ? "Check-Out" : "Check-In";
  const dashboardPath = isCheckOut
    ? "/check-out-dashboard"
    : "/check-in-dashboard";
  const parentPath = isCheckOut
    ? "/check-out-information"
    : "/check-in-information";
  const pageTitle = `${flowTitle} Information > Utilities Readings`;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const { item, loading, fetchItem } = useCheckIn({ id });
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const readingsList = item?.utilityReadings?.readingsList ?? [];
  const electricityReading = readingsList.find((r) => r.utility === "Electricity");
  const waterReading = readingsList.find((r) => r.utility === "Water");

  const getReadingValue = (reading, field) => {
    const value = reading?.[field];
    return value === null || value === undefined ? "" : value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const values = {};
    for (const [k, v] of formData.entries()) {
      if (v === "") continue;
      values[k] = v;
    }

    const buildPayload = (prefix, utilityType, readingId) => {
      if (!readingId) return null;
      const body = { check_in_utility_reading_id: readingId, utility_type: utilityType };
      for (const [suffix, apiKey] of Object.entries(READING_FIELD_MAP)) {
        const value = values[`${prefix}_${suffix}`];
        if (value !== undefined) body[apiKey] = value;
      }
      if (values.notes !== undefined) body.remarks = values.notes;
      return body;
    };

    const requests = [
      buildPayload("electricity", "Electricity", electricityReading?.id),
      buildPayload("water", "Water", waterReading?.id),
    ].filter(Boolean);

    if (requests.length === 0) {
      alert("Cannot submit: no existing electricity/water reading record found for this check-in to update.");
      return;
    }

    try {
      setSubmitting(true);
      await Promise.all(requests.map((body) => checkInApi.patch(READING_UPDATE_ENDPOINT, body)));
      await fetchItem();
      setSubmitting(false);
      toast.success("Utility readings updated successfully");
      alert("Utility readings updated successfully.");
    } catch (err) {
      setSubmitting(false);
      console.error("Utility readings submit failed", err);
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
                    <FormField label="Meter Number:" name="electricity_meter_number" defaultValue={getReadingValue(electricityReading, "meterNo")} placeholder="ELE12345" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Current Reading:" name="electricity_current_reading" defaultValue={getReadingValue(electricityReading, "checkInReading")} placeholder="1245" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Consumption" name="electricity_consumption" defaultValue={getReadingValue(electricityReading, "consumption")} placeholder="332" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Unit" name="electricity_unit" defaultValue={getReadingValue(electricityReading, "unit")} placeholder="kWh" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Rate per Unit" name="electricity_rate_per_unit" defaultValue={getReadingValue(electricityReading, "ratePerUnit")} placeholder="5 OMR" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Total Charges" name="electricity_total_charges" defaultValue={getReadingValue(electricityReading, "charges")} placeholder="535 OMR" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Status"
                      name="electricity_status"
                      defaultValue={getReadingValue(electricityReading, "status")}
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
                    <FormField label="Meter Number:" name="water_meter_number" defaultValue={getReadingValue(waterReading, "meterNo")} placeholder="WTR12345" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Current Reading:" name="water_current_reading" defaultValue={getReadingValue(waterReading, "checkInReading")} placeholder="1245" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Consumption" name="water_consumption" defaultValue={getReadingValue(waterReading, "consumption")} placeholder="332" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Unit" name="water_unit" defaultValue={getReadingValue(waterReading, "unit")} placeholder="m3" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Rate per Unit" name="water_rate_per_unit" defaultValue={getReadingValue(waterReading, "ratePerUnit")} placeholder="5 OMR" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Total Charges" name="water_total_charges" defaultValue={getReadingValue(waterReading, "charges")} placeholder="535 OMR" />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Status"
                      name="water_status"
                      defaultValue={getReadingValue(waterReading, "status")}
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
                      name="notes"
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

export default UtilitiesReadingsForm;