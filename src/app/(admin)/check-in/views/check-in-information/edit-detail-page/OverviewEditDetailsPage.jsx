// @refresh reset
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import useCheckIn from '@/hooks/useCheckIn';

const NUMERIC_FIELDS = [
  'assigned_employee_id',
  'tenant_id',
  'number_of_occupants',
  'quotation_amount',
  'rent_adjustment_amount',
  'electricity_meter_reading',
  'water_meter_reading',
  'gas_meter_reading',
];

const FIELD_MAP = {
  // Section A
  check_in_code:            'checkInCode',
  check_in_date:            'checkInDate',
  check_in_status:          'checkInStatus',
  assigned_employee_id:     'assignedEmployeeId',
  remarks_notes:            'remarksNotes',
  // Section B
  tenant_id:                'tenantId',
  tenant_code:              'tenantCode',
  tenant_name:              'tenantName',
  tenant_type:              'tenantType',
  tenant_mobile_number:     'tenantMobileNumber',
  tenant_email:             'tenantEmail',
  tenant_civil_id:          'tenantCivilId',
  tenant_passport_number:   'tenantPassportNumber',
  tenant_nationality:       'tenantNationality',
  // Section C
  property_type:            'propertyType',
  property_code:            'propertyCode',
  building_name:            'buildingName',
  flat_unit_number:         'flatUnitNumber',
  floor_number:             'floorNumber',
  property_status:          'propertyStatus',
  // Section D
  monthly_rent:             'monthlyRent',
  security_deposit:         'securityDeposit',
  advance_rent_received:    'advanceRentReceived',
  first_month_rent_paid:    'firstMonthRentPaid',
  payment_mode:             'paymentMode',
  maintenance_charges:      'maintenanceCharges',
  // Section E
  inspection_required:      'inspectionRequired',
  inspection_date:          'inspectionDate',
  technician_type:          'technicianType',
  manager_approval:         'managerApproval',
  issue_identified:         'issueIdentified',
  supervisor_remarks:       'supervisorRemarks',
  // Section F
  repair_required:          'repairRequired',
  quotation_amount:         'quotationAmount',
  inventory_available:      'inventoryAvailable',
  gm_approval:              'gmApproval',
  landlord_consent:         'landlordConsent',
  finance_alert_generated:  'financeAlertGenerated',
  rent_adjustment_amount:   'rentAdjustmentAmount',
  // Section G
  electricity_meter_reading: 'electricityMeterReading',
  water_meter_reading:      'waterMeterReading',
  gas_meter_reading:        'gasMeterReading',
  // Section H
  agreement_type:           'agreementType',
  agreement_status:         'agreementStatus',
  agreement_start_date:     'agreementStartDate',
  agreement_end_date:       'agreementEndDate',
  // Section I
  key_number:               'keyNumber',
  key_available:            'keyAvailable',
  key_booking_date:         'keyBookingDate',
  confirmation_received:    'confirmationReceived',
  key_delivery_date:        'keyDeliveryDate',
  key_handover_status:      'keyHandoverStatus',
  // Section K
  internal_comments:        'internalComments',
  tenant_remarks:           'tenantRemarks',
  special_instructions:     'specialInstructions',
  // Section L
  status_history:           'statusHistory',
};

const SECTION_FIELD_MAP = {
  information: [
    'check_in_date', 'check_in_status', 'assigned_employee_id', 'remarks_notes',
  ],
  tenant_details: [
    'tenant_id', 'tenant_code', 'tenant_name', 'tenant_type',
    'tenant_mobile_number', 'tenant_email', 'tenant_civil_id',
    'tenant_passport_number', 'tenant_nationality',
  ],
  property_details: [
    'property_type', 'property_code', 'building_name',
    'flat_unit_number', 'floor_number', 'property_status',
  ],
  rental_details: [
    'monthly_rent', 'security_deposit', 'advance_rent_received',
    'first_month_rent_paid', 'payment_mode', 'maintenance_charges',
  ],
  property_inspection: [
    'inspection_required', 'inspection_date', 'technician_type',
    'manager_approval', 'issue_identified', 'supervisor_remarks',
  ],
  repair_approval: [
    'repair_required', 'quotation_amount', 'inventory_available',
    'gm_approval', 'landlord_consent', 'finance_alert_generated',
    'rent_adjustment_amount',
  ],
  utility_meter_readings: [
    'electricity_meter_reading', 'water_meter_reading', 'gas_meter_reading',
  ],
  agreement_details: [
    'agreement_type', 'agreement_status', 'agreement_start_date', 'agreement_end_date',
  ],
  key_handover: [
    'key_number', 'key_available', 'key_booking_date',
    'confirmation_received', 'key_delivery_date', 'key_handover_status',
  ],
  comments: [
    'internal_comments', 'tenant_remarks', 'special_instructions',
  ],
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
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
    ) : (
      <input style={fieldStyle} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} />
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
      style={{ ...fieldStyle, minHeight: 94, height: 'auto', resize: 'none' }}
    />
  </div>
);

const FileField = ({ label, name }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type="file" name={name} style={{ ...fieldStyle, padding: '7px 8px' }} />
  </div>
);

const DateField = ({ label, name, defaultValue }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type="date" name={name} defaultValue={defaultValue} style={fieldStyle} />
  </div>
);

const toDateString = (iso) => iso ? String(iso).split('T')[0] : '';

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
      alert('Cannot submit: no check-in id in the URL (open this page via "Edit Details" on an existing check-in).');
      return;
    }

    const formData = new FormData(formRef.current);
    const payload = {};
    for (const [k, v] of formData.entries()) {
      if (v instanceof File) continue;
      if (v === '') continue;
      payload[k] = NUMERIC_FIELDS.includes(k) ? Number(v) : v;
    }

    const sections = {};
    for (const [sectionKey, fields] of Object.entries(SECTION_FIELD_MAP)) {
      const body = {};
      for (const field of fields) {
        if (payload[field] !== undefined) body[field] = payload[field];
      }
      sections[sectionKey] = body;
    }

    try {
      setSubmitting(true);
      await updateSections(id, sections);
      await fetchItem();
      setSubmitting(false);
      toast.success(`${flowTitle} updated successfully`);
      alert(`${flowTitle} updated successfully.`);
    } catch (err) {
      setSubmitting(false);
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
          style={{ width: 32, height: 32, border: '1px solid #8a96a8', borderRadius: '50%', color: '#2f3848', textDecoration: 'none' }}
        >
          <IconifyIcon icon="ri:arrow-left-s-line" width={20} height={20} />
        </Button>
        <h4 className="mb-0" style={{ color: '#526b89', fontSize: 20, fontWeight: 500 }}>
          {flowTitle} Information
        </h4>
      </div>

      <form key={loading ? 'loading' : id || 'new'} ref={formRef} onSubmit={handleSubmit}>
        <Row className="g-4 align-items-start">
          {/* ── Sidebar ── */}
          <Col xs={12} lg={3}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: '0 10px 30px rgba(16, 24, 40, 0.07)' }}>
              <CardBody style={{ padding: 24 }}>
                {loading ? (
                  <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <h5 className="mb-2" style={{ color: '#526b89', fontSize: 18, fontWeight: 700 }}>
                      {item?.tenantName || '—'}
                    </h5>
                    <div className="d-flex flex-wrap gap-3 mb-4" style={{ color: '#526b89', fontSize: 14 }}>
                      <span>{item?.tenantEmail || '—'}</span>
                      <span>{item?.tenantMobileNumber || '—'}</span>
                    </div>
                  </>
                )}

                <Row className="g-3 mb-4">
                  <Col xs={6}>
                    <p className="mb-2" style={{ color: '#526b89', fontSize: 16, fontWeight: 700 }}>{flowTitle} Date</p>
                    <p className="mb-0" style={{ color: '#526b89', fontSize: 15 }}>{item?.checkInDate || '—'}</p>
                  </Col>
                  <Col xs={6}>
                    <p className="mb-2" style={{ color: '#526b89', fontSize: 16, fontWeight: 700 }}>{flowTitle} Status</p>
                    <p className="mb-0" style={{ color: '#526b89', fontSize: 15 }}>{item?.checkInStatus || '—'}</p>
                  </Col>
                </Row>

                <h6 className="mb-3" style={{ color: '#526b89', fontSize: 17, fontWeight: 700 }}>Property Details</h6>
                <Row className="g-3 mb-4">
                  <Col xs={6}>
                    <p className="mb-1" style={{ color: '#526b89', fontSize: 15 }}>Property Type</p>
                    <p className="mb-0" style={{ color: '#526b89', fontSize: 15, fontWeight: 700 }}>{item?.propertyType || '—'}</p>
                  </Col>
                  <Col xs={6}>
                    <p className="mb-1" style={{ color: '#526b89', fontSize: 15 }}>Property Status</p>
                    <p className="mb-0" style={{ color: '#526b89', fontSize: 15, fontWeight: 700 }}>{item?.propertyStatus || '—'}</p>
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

          {/* ── Main form ── */}
          <Col xs={12} lg={9}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: '0 10px 30px rgba(16, 24, 40, 0.07)', overflow: 'hidden' }}>
              <CardBody style={{ padding: 0 }}>
                <h3 className="mb-0" style={{ color: '#526b89', fontSize: 26, fontWeight: 700, padding: '30px 36px 28px', borderBottom: '1px solid #edf0f3' }}>
                  {flowTitle} Information
                </h3>

                <div style={{ padding: '34px 36px' }}>

                  {/* A. Check-In Information */}
                  <h5 id="check-in-information" style={sectionTitleStyle}>A. {flowTitle} Information</h5>
                  <Row className="g-3 mb-4">
                    <Col md={4}>
                      <FormField
                        label={`${flowTitle} Code / ID`}
                        name="check_in_code"
                        defaultValue={getValue('check_in_code')}
                        placeholder="Auto-Generated"
                      />
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

                  {/* B. Tenant Details */}
                  <h5 id="tenant-details" style={sectionTitleStyle}>B. Tenant Details</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Tenant ID"
                        name="tenant_id"
                        defaultValue={getValue('tenant_id')}
                        type="number"
                        placeholder="Tenant ID"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Tenant Code"
                        name="tenant_code"
                        defaultValue={getValue('tenant_code')}
                        placeholder="TXD132456"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Tenant Name"
                        name="tenant_name"
                        defaultValue={getValue('tenant_name')}
                        placeholder="Full Name or Company Name"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Tenant Type"
                        name="tenant_type"
                        defaultValue={getValue('tenant_type')}
                        placeholder="Select Type"
                        as="select"
                      >
                        <option>Individual</option>
                        <option>Corporate</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Mobile Number"
                        name="tenant_mobile_number"
                        defaultValue={getValue('tenant_mobile_number')}
                        placeholder="01 2456 46547"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Email"
                        name="tenant_email"
                        defaultValue={getValue('tenant_email')}
                        type="email"
                        placeholder="email@domain.com"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Civil ID"
                        name="tenant_civil_id"
                        defaultValue={getValue('tenant_civil_id')}
                        placeholder="Civil ID Number"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Passport Number"
                        name="tenant_passport_number"
                        defaultValue={getValue('tenant_passport_number')}
                        placeholder="Passport Number"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Nationality"
                        name="tenant_nationality"
                        defaultValue={getValue('tenant_nationality')}
                        placeholder="Select Nationality"
                        as="select"
                      >
                        <option>Oman</option>
                        <option>India</option>
                        <option>United Arab Emirates</option>
                      </FormField>
                    </Col>
                  </Row>

                  {/* C. Property Details */}
                  <h5 id="property-details" style={sectionTitleStyle}>C. Property Details</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Property Type"
                        name="property_type"
                        defaultValue={getValue('property_type')}
                        placeholder="Select Type"
                        as="select"
                      >
                        <option>Villa</option>
                        <option>Warehouse</option>
                        <option>Flat</option>
                        <option>Commercial</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Property Code"
                        name="property_code"
                        defaultValue={getValue('property_code')}
                        placeholder="PRX123456"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Building Name"
                        name="building_name"
                        defaultValue={getValue('building_name')}
                        placeholder="Building Name"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Flat / Unit Number"
                        name="flat_unit_number"
                        defaultValue={getValue('flat_unit_number')}
                        placeholder="Unit Number"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Floor Number"
                        name="floor_number"
                        defaultValue={getValue('floor_number')}
                        placeholder="Floor Number"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Property Status"
                        name="property_status"
                        defaultValue={getValue('property_status')}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Reserved</option>
                        <option>Available</option>
                        <option>Occupied</option>
                        <option>Maintenance</option>
                      </FormField>
                    </Col>
                  </Row>

                  {/* D. Rental Details */}
                  <h5 id="rental-details" style={sectionTitleStyle}>D. Rental Details</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Monthly Rent"
                        name="monthly_rent"
                        defaultValue={getValue('monthly_rent')}
                        placeholder="Amount"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Security Deposit"
                        name="security_deposit"
                        defaultValue={getValue('security_deposit')}
                        placeholder="Amount"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Advance Rent Received"
                        name="advance_rent_received"
                        defaultValue={getValue('advance_rent_received')}
                        placeholder="Amount"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="First Month Rent Paid"
                        name="first_month_rent_paid"
                        defaultValue={getValue('first_month_rent_paid')}
                        placeholder="Amount"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Payment Mode"
                        name="payment_mode"
                        defaultValue={getValue('payment_mode')}
                        placeholder="Select Mode"
                        as="select"
                      >
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                        <option>Online</option>
                        <option>Cheque</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Maintenance Charges"
                        name="maintenance_charges"
                        defaultValue={getValue('maintenance_charges')}
                        placeholder="Amount"
                      />
                    </Col>
                  </Row>

                  {/* E. Property Inspection */}
                  <h5 id="property-inspection" style={sectionTitleStyle}>E. Property Inspection</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Inspection Required"
                        name="inspection_required"
                        defaultValue={getValue('inspection_required')}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Inspection Date"
                        name="inspection_date"
                        defaultValue={getValue('inspection_date')}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Technician Type"
                        name="technician_type"
                        defaultValue={getValue('technician_type')}
                        placeholder="Technician Type"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Manager Approval"
                        name="manager_approval"
                        defaultValue={getValue('manager_approval')}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </FormField>
                    </Col>
                    <Col md={12}>
                      <TextAreaField
                        label="Issue Identified"
                        name="issue_identified"
                        defaultValue={getValue('issue_identified')}
                        placeholder="Describe Issues"
                      />
                    </Col>
                    <Col md={12}>
                      <TextAreaField
                        label="Supervisor Remarks"
                        name="supervisor_remarks"
                        defaultValue={getValue('supervisor_remarks')}
                        placeholder="Supervisor notes"
                      />
                    </Col>
                  </Row>

                  {/* F. Repair & Approval */}
                  <h5 id="repair-approval" style={sectionTitleStyle}>F. Repair &amp; Approval</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Repair Required"
                        name="repair_required"
                        defaultValue={getValue('repair_required')}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Quotation Amount"
                        name="quotation_amount"
                        defaultValue={getValue('quotation_amount')}
                        type="number"
                        placeholder="Amount"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Inventory Available"
                        name="inventory_available"
                        defaultValue={getValue('inventory_available')}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="GM Approval"
                        name="gm_approval"
                        defaultValue={getValue('gm_approval')}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Approved</option>
                        <option>Pending</option>
                        <option>Rejected</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Landlord Consent"
                        name="landlord_consent"
                        defaultValue={getValue('landlord_consent')}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Received</option>
                        <option>Pending</option>
                        <option>Not Required</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Finance Alert Generated"
                        name="finance_alert_generated"
                        defaultValue={getValue('finance_alert_generated')}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Rent Adjustment Amount"
                        name="rent_adjustment_amount"
                        defaultValue={getValue('rent_adjustment_amount')}
                        placeholder="Amount"
                      />
                    </Col>
                  </Row>

                  {/* G. Utility Meter Readings */}
                  <h5 id="utility-meter-readings" style={sectionTitleStyle}>G. Utility Meter Readings</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Electricity Meter Reading"
                        name="electricity_meter_reading"
                        defaultValue={getValue('electricity_meter_reading')}
                        type="number"
                        placeholder="Reading Value"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Water Meter Reading"
                        name="water_meter_reading"
                        defaultValue={getValue('water_meter_reading')}
                        type="number"
                        placeholder="Reading Value"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Gas Meter Reading"
                        name="gas_meter_reading"
                        defaultValue={getValue('gas_meter_reading')}
                        type="number"
                        placeholder="Reading Value"
                      />
                    </Col>
                    <Col md={12}>
                      <label style={labelStyle}>Meter Photo Upload</label>
                    </Col>
                  </Row>

                  {/* H. Agreement Details */}
                  <h5 id="agreement-details" style={sectionTitleStyle}>H. Agreement Details</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Agreement Type"
                        name="agreement_type"
                        defaultValue={getValue('agreement_type')}
                        placeholder="Select Type"
                        as="select"
                      >
                        <option>Rental</option>
                        <option>Lease</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Agreement Status"
                        name="agreement_status"
                        defaultValue={getValue('agreement_status')}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Draft</option>
                        <option>Pending</option>
                        <option>Active</option>
                        <option>Completed</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Agreement Start Date"
                        name="agreement_start_date"
                        defaultValue={getValue('agreement_start_date')}
                      />
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Agreement End Date"
                        name="agreement_end_date"
                        defaultValue={getValue('agreement_end_date')}
                      />
                    </Col>
                    <Col md={4}>
                      <FileField label="Agreement Document Upload" name="agreement_document" />
                    </Col>
                  </Row>

                  {/* I. Key Handover */}
                  <h5 id="key-handover" style={sectionTitleStyle}>I. Key Handover</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Key Number"
                        name="key_number"
                        defaultValue={getValue('key_number')}
                        placeholder="Key ID"
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Key Available"
                        name="key_available"
                        defaultValue={getValue('key_available')}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Available</option>
                        <option>Not Available</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Key Booking Date"
                        name="key_booking_date"
                        defaultValue={getValue('key_booking_date')}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Confirmation Received"
                        name="confirmation_received"
                        defaultValue={getValue('confirmation_received')}
                        placeholder="Select"
                        as="select"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </FormField>
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Key Delivery Date"
                        name="key_delivery_date"
                        defaultValue={getValue('key_delivery_date')}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Key Handover Status"
                        name="key_handover_status"
                        defaultValue={getValue('key_handover_status')}
                        placeholder="Select Status"
                        as="select"
                      >
                        <option>Pending</option>
                        <option>Completed</option>
                      </FormField>
                    </Col>
                  </Row>

                  {/* J. Documents Upload */}
                  <h5 id="documents-upload" style={sectionTitleStyle}>J. Documents Upload</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}><FileField label="Tenant ID Proof" name="tenant_id_proof" /></Col>
                    <Col md={4}><FileField label="Passport Copy" name="passport_copy" /></Col>
                    <Col md={4}><FileField label="Agreement Copy" name="agreement_copy" /></Col>
                    <Col md={4}><FileField label="Inspection Photos" name="inspection_photos" /></Col>
                    <Col md={4}><FileField label="Meter Reading Photos" name="meter_reading_photos" /></Col>
                  </Row>

                  {/* K. Comments */}
                  <h5 style={sectionTitleStyle}>K. Comments</h5>
                  <Row className="g-4 mb-4">
                    <Col md={12}>
                      <TextAreaField
                        label="Internal Comments"
                        name="internal_comments"
                        defaultValue={getValue('internal_comments')}
                        placeholder="For Internal Staff Only"
                      />
                    </Col>
                    <Col md={12}>
                      <TextAreaField
                        label="Tenant Remarks"
                        name="tenant_remarks"
                        defaultValue={getValue('tenant_remarks')}
                        placeholder="Feedback or Notes from tenant"
                      />
                    </Col>
                    <Col md={12}>
                      <TextAreaField
                        label="Special Instructions"
                        name="special_instructions"
                        defaultValue={getValue('special_instructions')}
                        placeholder="Any special instruction for this check-in"
                      />
                    </Col>
                  </Row>

                  {/* L. System Fields */}
                  <h5 style={sectionTitleStyle}>L. System Fields (Auto)</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <FormField
                        label="Created By"
                        name="created_by"
                        defaultValue={item?.createdBy?.name ?? ''}
                        placeholder="System Admin"
                      />
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Created Date"
                        name="created_date"
                        defaultValue={toDateString(item?.createdAt)}
                      />
                    </Col>
                    <Col md={4}>
                      <FormField
                        label="Updated By"
                        name="updated_by"
                        defaultValue={item?.updatedBy?.name ?? item?.createdBy?.name ?? ''}
                        placeholder="Auto"
                      />
                    </Col>
                    <Col md={4}>
                      <DateField
                        label="Updated Date"
                        name="updated_date"
                        defaultValue={toDateString(item?.updatedAt)}
                      />
                    </Col>
                    <Col md={12}>
                      <TextAreaField
                        label="Status History"
                        name="status_history"
                        defaultValue={getValue('status_history')}
                        placeholder="Status history"
                      />
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
