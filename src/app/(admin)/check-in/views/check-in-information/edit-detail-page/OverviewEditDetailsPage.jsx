import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import useCheckIn from '@/hooks/useCheckIn';

// Fields the API expects as a number rather than a string.
const NUMERIC_FIELDS = ['assigned_employee_id'];

// GET /checkin-checkout/check_in/get/ returns camelCase keys; map to the
// snake_case form field names used here.
const FIELD_MAP = {
  check_in_date: 'checkInDate',
  check_in_status: 'checkInStatus',
  assigned_employee_id: 'assignedEmployeeId',
  remarks_notes: 'remarksNotes',
};

const fieldStyle = {
  background: '#f9f9fc',
  border: '1px solid #e7e9ef',
  borderRadius: 5,
  color: '#526b89',
  fontSize: 16,
  height: 46,
  padding: '10px 14px',
  width: '100%',
};

const labelStyle = {
  color: '#526b89',
  fontSize: 16,
  fontWeight: 500,
  marginBottom: 10,
};

const sectionTitleStyle = {
  color: '#526b89',
  fontSize: 21,
  fontWeight: 700,
  borderBottom: '1px solid #dfe3e8',
  paddingBottom: 16,
  marginBottom: 20,
  scrollMarginTop: 110,
};

const FormField = ({ label, name, placeholder, as = 'input', type = 'text', defaultValue, children }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {as === 'select' ? (
      <select style={fieldStyle} name={name} defaultValue={defaultValue ?? ''}>
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
    ) : (
      <input style={fieldStyle} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} />
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
        height: 'auto',
        resize: 'none',
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
        padding: '7px 8px',
      }}
    />
  </div>
);

const DateField = ({ label, name, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type="date" name={name} defaultValue={defaultValue} placeholder="dd-mm-yyyy" style={fieldStyle} />
  </div>
);

const CheckInInformationForm = ({ mode = 'check-in' }) => {
  const location = useLocation();
  const isCheckOut = mode === 'check-out';
  const flowTitle = isCheckOut ? 'Check-Out' : 'Check-In';
  const dashboardPath = isCheckOut ? '/check-out-dashboard' : '/check-in-dashboard';

  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const { item, loading, updateSections, fetchItem } = useCheckIn({ id });
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const getValue = (name) => {
    const key = FIELD_MAP[name];
    const value = key ? item?.[key] : undefined;
    return value === null || value === undefined ? '' : value;
  };

  useEffect(() => {
    if (!location.hash) return;

    const section = document.getElementById(location.hash.slice(1));
    section?.scrollIntoView({ block: 'start', behavior: 'smooth' });
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
      if (v === '') continue;
      payload[k] = NUMERIC_FIELDS.includes(k) ? Number(v) : v;
    }
    try {
      setSubmitting(true);
      await updateSections(id, { information: payload });
      await fetchItem();
      setSubmitting(false);
      toast.success(`${flowTitle} information updated successfully`);
      alert(`${flowTitle} information updated successfully.`);
    } catch (err) {
      setSubmitting(false);
      console.error('Check-in information submit failed', err);
      const res = err?.response?.data;
      const message = res ? JSON.stringify(res) : err?.message || 'Something went wrong';
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
            border: '1px solid #8a96a8',
            borderRadius: '50%',
            color: '#2f3848',
            textDecoration: 'none',
          }}
        >
          <IconifyIcon icon="ri:arrow-left-s-line" width={20} height={20} />
        </Button>
        <h4 className="mb-0" style={{ color: '#526b89', fontSize: 20, fontWeight: 500 }}>
          {flowTitle} Information
        </h4>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
      <Row className="g-4 align-items-start">
        <Col xs={12} lg={3}>
          <Card
            className="border-0 shadow-sm"
            style={{ borderRadius: 10, boxShadow: '0 10px 30px rgba(16, 24, 40, 0.07)' }}
          >
            <CardBody style={{ padding: 24 }}>
              {loading ? (
                <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
                  <Spinner />
                </div>
              ) : (
                <>
                  <h5 className="mb-2" style={{ color: '#526b89', fontSize: 18, fontWeight: 700 }}>
                    {item?.tenantName || 'Ali Z Shaikh'}
                  </h5>
                  <div className="d-flex flex-wrap gap-3 mb-4" style={{ color: '#526b89', fontSize: 14 }}>
                    <span>{item?.tenantEmail || 'alishaikh@domain.com'}</span>
                    <span>{item?.tenantMobileNumber || '+91 102345XX89'}</span>
                  </div>
                </>
              )}

              <Row className="g-3 mb-4">
                <Col xs={6}>
                  <p className="mb-2" style={{ color: '#526b89', fontSize: 16, fontWeight: 700 }}>
                    {flowTitle} Date
                  </p>
                  <p className="mb-0" style={{ color: '#526b89', fontSize: 15 }}>
                    {item?.checkInDate || '12 April 2026'}
                  </p>
                </Col>
                <Col xs={6}>
                  <p className="mb-2" style={{ color: '#526b89', fontSize: 16, fontWeight: 700 }}>
                    {flowTitle} Status
                  </p>
                  <p className="mb-0" style={{ color: '#526b89', fontSize: 15 }}>
                    {item?.checkInStatus || 'Approved'}
                  </p>
                </Col>
              </Row>

              <h6 className="mb-3" style={{ color: '#526b89', fontSize: 17, fontWeight: 700 }}>
                Property Details
              </h6>
              <Row className="g-3 mb-4">
                <Col xs={6}>
                  <p className="mb-1" style={{ color: '#526b89', fontSize: 15 }}>
                    Property Type
                  </p>
                  <p className="mb-0" style={{ color: '#526b89', fontSize: 15, fontWeight: 700 }}>
                    {item?.propertyType || 'Villa'}
                  </p>
                </Col>
                <Col xs={6}>
                  <p className="mb-1" style={{ color: '#526b89', fontSize: 15 }}>
                    Property Status
                  </p>
                  <p className="mb-0" style={{ color: '#526b89', fontSize: 15, fontWeight: 700 }}>
                    {item?.propertyStatus || 'Reserved'}
                  </p>
                </Col>
              </Row>

              <div className="d-flex gap-2">
                <Button
                  as={Link}
                  to="/check-in-dashboard"
                  variant="outline-secondary"
                  className="w-50"
                  style={{ borderColor: '#526b89', color: '#526b89', borderRadius: 5, height: 40 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-50"
                  style={{ background: '#526b89', borderColor: '#526b89', borderRadius: 5, height: 40 }}
                >
                  {submitting ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xs={12} lg={9}>
          <Card
            className="border-0 shadow-sm"
            style={{ borderRadius: 10, boxShadow: '0 10px 30px rgba(16, 24, 40, 0.07)', overflow: 'hidden' }}
          >
            <CardBody style={{ padding: 0 }}>
              <h3
                className="mb-0"
                style={{
                  color: '#526b89',
                  fontSize: 26,
                  fontWeight: 700,
                  padding: '30px 36px 28px',
                  borderBottom: '1px solid #edf0f3',
                }}
              >
                {flowTitle} Information
              </h3>

              <div style={{ padding: '34px 36px' }}>
                <h5 id="check-in-information" style={sectionTitleStyle}>A. {flowTitle} Information</h5>
                <Row className="g-3 mb-4">
                  <Col md={4}>
                    <FormField label={`${flowTitle} Code / ID`} placeholder="Auto-Generated" />
                  </Col>
                  <Col md={4}>
                    <DateField label={`${flowTitle} Date *`} name="check_in_date" defaultValue={getValue('check_in_date')} />
                  </Col>
                  <Col md={4}>
                    <FormField
                      label={`${flowTitle} Status *`}
                      name="check_in_status"
                      defaultValue={getValue('check_in_status')}
                      placeholder="Select Status"
                      as="select"
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Key Pending</option>
                      <option>Active</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField
                      label="Assigned Employee ID *"
                      name="assigned_employee_id"
                      defaultValue={getValue('assigned_employee_id')}
                      type="number"
                      placeholder="Employee ID"
                    />
                  </Col>
                  <Col md={12}>
                    <FormField
                      label="Remarks / Notes"
                      name="remarks_notes"
                      defaultValue={getValue('remarks_notes')}
                      placeholder="Enter initial remarks"
                    />
                  </Col>
                </Row>

                <h5 id="tenant-details" style={sectionTitleStyle}>B. Tenant Details</h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Tenant ID" placeholder="TXD132456" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Tenant Name" placeholder="Full Name or Company Name" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Tenant Type" placeholder="Select Type" as="select">
                      <option>Individual</option>
                      <option>Company</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Mobile Number" placeholder="01 2456 46547" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Email" placeholder="email@domain.com" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Civil ID" placeholder="Civil ID Number" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Passport Number" placeholder="Passport Number" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Nationality" placeholder="Select Nationality" as="select">
                      <option>Oman</option>
                      <option>India</option>
                      <option>United Arab Emirates</option>
                    </FormField>
                  </Col>
                 
                </Row>

               
                

                <h5 id="property-details" style={sectionTitleStyle}>C. Property Details</h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Property Type" placeholder="Select Status" as="select">
                      <option>Villa</option>
                      <option>Apartment</option>
                      <option>Flat</option>
                      <option>Commercial</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Property Code" placeholder="PRX123456" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Building Name" placeholder="Building Name" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Flat / Unit Number" placeholder="Unit Number" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Floor Number" placeholder="Floor Number" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Property Status" placeholder="Select Status" as="select">
                      <option>Reserved</option>
                      <option>Available</option>
                      <option>Occupied</option>
                      <option>Maintenance</option>
                    </FormField>
                  </Col>
                </Row>

                <h5 id="rental-details" style={sectionTitleStyle}>D. Rental Details</h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Monthly Rent" placeholder="Amount" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Security Deposit" placeholder="Amount" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Advance Rent Received" placeholder="Amount" />
                  </Col>
                  <Col md={4}>
                    <FormField label="First Month Rent Paid" placeholder="Amount" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Payment Mode" placeholder="Select Mode" as="select">
                      <option>Cash</option>
                      <option>Bank Transfer</option>
                      <option>Card</option>
                      <option>Cheque</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Maintenance Charges" placeholder="Amount" />
                  </Col>
                </Row>

                <h5 id="property-inspection" style={sectionTitleStyle}>E. Property Inspection</h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Inspection Required" placeholder="" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Inspection Date" placeholder="" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Technician Type" placeholder="" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Manager Approval" placeholder="" />
                  </Col>
                  <Col md={12}>
                    <TextAreaField label="Issue Identified" placeholder="Describe Issues" />
                  </Col>
                  <Col md={12}>
                    <TextAreaField label="Supervisor Remarks" placeholder="Supervisor notes" />
                  </Col>
                </Row>

                <h5 id="repair-approval" style={sectionTitleStyle}>F. Repair &amp; Approval</h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Repair Required" placeholder="Select" as="select">
                      <option>Yes</option>
                      <option>No</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Quotation Amount" placeholder="Amount" as="select">
                      <option>Amount</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Inventory Available" placeholder="Select" as="select">
                      <option>Yes</option>
                      <option>No</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="GM Approval" placeholder="Select" as="select">
                      <option>Approved</option>
                      <option>Pending</option>
                      <option>Rejected</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Landlord Consent" placeholder="Select" as="select">
                      <option>Received</option>
                      <option>Pending</option>
                      <option>Not Required</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Finance Alert Generated" placeholder="Select" as="select">
                      <option>Yes</option>
                      <option>No</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Rent Adjustment Amount" placeholder="Amount" />
                  </Col>
                </Row>

                <h5 id="utility-meter-readings" style={sectionTitleStyle}>G. Utility Meter Readings</h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Electricity Meter Reading" placeholder="Reading Value" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Water Meter Reading" placeholder="Reading Value" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Gas Meter Reading" placeholder="Reading Value" />
                  </Col>
                  <Col md={12}>
                    <label style={labelStyle}>Meter Photo Upload</label>
                  </Col>
                </Row>

                <h5 id="agreement-details" style={sectionTitleStyle}>H. Agreement Details</h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Agreement Type" placeholder="Select Type" as="select">
                      <option>Rental</option>
                      <option>Lease</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Agreement Status" placeholder="Select Status" as="select">
                      <option>Draft</option>
                      <option>Active</option>
                      <option>Completed</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Agreement Start Date" placeholder="dd-mm-yyyy" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Agreement End Date" placeholder="dd-mm-yyyy" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Agreement Document Upload" />
                  </Col>
                </Row>

                <h5 id="key-handover" style={sectionTitleStyle}>I. Key Handover</h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField label="Key Number" placeholder="Key ID" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Key Available" placeholder="Select Status" as="select">
                      <option>Available</option>
                      <option>Not Available</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Key Booking Date" placeholder="dd-mm-yyyy" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Confirmation Received" placeholder="Select" as="select">
                      <option>Yes</option>
                      <option>No</option>
                    </FormField>
                  </Col>
                  <Col md={4}>
                    <FormField label="Key Delivery Date" placeholder="dd-mm-yyyy" />
                  </Col>
                  <Col md={4}>
                    <FormField label="Key Handover Status" placeholder="Select Status" as="select">
                      <option>Pending</option>
                      <option>Completed</option>
                    </FormField>
                  </Col>
                </Row>

                <h5 id="documents-upload" style={sectionTitleStyle}>J. Documents Upload</h5>
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FileField label="Tenant ID Proof" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Passport Copy" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Agreement Copy" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Inspection Photos" />
                  </Col>
                  <Col md={4}>
                    <FileField label="Meter Reading Photos" />
                  </Col>
                </Row>

                <h5 style={sectionTitleStyle}>
                  K. Comments
                </h5>
                
                <Row className="g-4 mb-4">
                  <Col md={12}>
                    <TextAreaField
                      label="Internal Comments"
                      placeholder="For Internal Staff Only"
                    />
                  </Col>
                
                  <Col md={12}>
                    <TextAreaField
                      label="Tenant Remarks"
                      placeholder="Feedback or Notes from tenant"
                    />
                  </Col>
                
                  <Col md={12}>
                    <TextAreaField
                      label="Special Instructions"
                      placeholder="Any special instruction for this check-in"
                    />
                  </Col>
                </Row>
                <h5 style={sectionTitleStyle}>
                  L. System Fields (Auto)
                </h5>
                
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <FormField
                      label="Created By"
                      placeholder="System Admin"
                    />
                  </Col>
                
                  <Col md={4}>
                    <DateField
                      label="Created Date"
                      placeholder="dd-mm-yyyy"
                    />
                  </Col>
                
                  <Col md={4}>
                    <FormField
                      label="Updated By"
                      placeholder="Auto"
                    />
                  </Col>
                
                  <Col md={4}>
                    <DateField
                      label="Updated Date"
                      placeholder="dd-mm-yyyy"
                    />
                  </Col>
                
                  <Col md={12}>
                    <div>
                      <label style={labelStyle}>
                        Status History
                      </label>
                
                      <textarea
                        style={{
                          ...fieldStyle,
                          minHeight: "85px",
                          resize: "none",
                          paddingTop: "12px",
                        }}
                        defaultValue="Created -> Inspection Pending"
                      />
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    as={Link}
                    to={dashboardPath}
                    variant="outline-secondary"
                    style={{ borderColor: '#526b89', color: '#526b89', borderRadius: 5, minWidth: 200, height: 45 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    style={{ background: '#526b89', borderColor: '#526b89', borderRadius: 5, minWidth: 200, height: 45 }}
                  >
                    {submitting ? 'Saving...' : 'Submit'}
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
