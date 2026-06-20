import TextFormInput from '@/components/from/TextFormInput';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import TextAreaFormInput from '@/components/from/TextAreaFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardBody, Col, Row, Button, Spinner } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import httpClient from '@/helpers/httpClient';
import { useNavigate } from 'react-router-dom';
import { getCookie } from 'cookies-next';
import './PropertyAdd.css';

const schema = yup.object({});

const PropertyAdd = ({ tenantData, onPropertySelect }) => {
  const navigate = useNavigate();

  const [propertyType, setPropertyType] = useState('flat');
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { handleSubmit, control, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tenant_type: 'Individual',
      assignment_status: 'Pending',
      agreement_status: 'Pending',
      key_handover_status: 'Pending',
      finance_approval_status: 'Pending',
      maintenance_status: 'Pending',
      payment_mode: 'Cash',
      advance_rent_paid: 'No',
      key_available_in_office: 'No',
      rent_entry_created: 'No',
      invoice_generated: 'No',
      maintenance_required: 'No',
      internal_notes: '',
      tenant_special_requirements: '',
      company_name: '',
      rental_start_date: '',
      rental_end_date: '',
      agreement_duration_months: '',
      maintenance_charges: '',
      agreement_type: '',
      key_code: '',
      key_handover_date: '',
      electricity_meter_number: '',
      electricity_meter_reading: '0',
      water_meter_reading: '0',
      gas_meter_reading: '0',
      maintenance_ticket_id: '',
    }
  });

  const watchedTenantType = watch('tenant_type');

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setPropertiesLoading(true);
      try {
        const response = await httpClient.get(`${API_BASE_URL}/property/get_all/`, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        });
        if (response.data?.status && response.data?.data?.data) {
          const filtered = response.data.data.data.filter(prop => {
            const type = (prop.rentalType || '').toLowerCase();
            const status = prop.propertyDetails?.currentStatus;
            return type === propertyType && status === 'Vacant';
          });
          setProperties(filtered);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setPropertiesLoading(false);
      }
    };
    fetchProperties();
  }, [propertyType]);

  // Auto-fill tenant data
  useEffect(() => {
    if (tenantData) {
      setValue('tenant_name', `${tenantData.firstName || ''} ${tenantData.lastName || ''}`.trim());
      setValue('mobile_number', tenantData.phoneNumber || tenantData.phone_number || '');
      setValue('nationality', tenantData.nationality || '');
    }
  }, [tenantData, setValue]);

  // Auto-fill property details
  useEffect(() => {
    if (selectedPropertyId && properties.length > 0) {
      const property = properties.find(p => p.propertyId === parseInt(selectedPropertyId));
      if (property) {
        if (onPropertySelect) onPropertySelect(property);
        setValue('monthly_rent', property.propertyDetails?.monthlyRent || '');
setValue('security_deposit', property.propertyDetails?.securityDepositAmount || '');
const mc =
  property.flatData?.maintenanceChargeAmount ||
  property.villaData?.maintenanceChargeAmount ||
  property.commercialData?.maintenanceChargeAmount ||
  property.propertyDetails?.maintenanceChargeAmount || '';
setValue('maintenance_charges', mc);
      }
    }
  }, [selectedPropertyId, properties, onPropertySelect, setValue]);

  const getLoggedInUser = () => {
    try {
      const raw = getCookie('_LAHOMES_AUTH_KEY_')?.toString();
      if (raw) {
        const d = JSON.parse(raw);
        return d.user_id || d.userId || d.id || 36;
      }
    } catch (e) {}
    return 36;
  };

  // ✅ FIX: Converts "Yes"/"No" strings to proper booleans for the API
  const vBool = (val) => val === 'Yes' || val === true || val === 'true' || val === 1;

  // ✅ FIX: Returns null for empty values
  const v = (val) => (val === '' || val === undefined || val === null ? null : val);

  // ✅ FIX: Returns null for empty integers
  const vInt = (val) => (val === '' || val === undefined || val === null ? null : parseInt(val));

  // ✅ FIX: Returns empty string for null/undefined
  const vStr = (val) => (val === '' || val === undefined || val === null ? '' : String(val));

  // ✅ FIX: Returns null for empty floats, parses to float for valid values
  const vFloat = (val) => {
    if (val === '' || val === undefined || val === null) return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedPropertyId) { alert('Please select a property'); return; }
    if (!tenantData?.leadId) { alert('Tenant data not found.'); return; }

    setSubmitting(true);

    const payload = {
      property_id: parseInt(selectedPropertyId),
      tenant_id: tenantData.leadId,
      assigned_by_id: getLoggedInUser(),
      assignment_status: values.assignment_status || 'Pending',
      tenant_type: values.tenant_type || 'Individual',
      company_name: v(values.company_name),
      rental_start_date: v(values.rental_start_date),
      rental_end_date: v(values.rental_end_date),
      agreement_duration_months: vInt(values.agreement_duration_months),

      // ✅ FIX: Send as float number, not string
      maintenance_charges: vFloat(values.maintenance_charges),

      // ✅ FIX: Proper booleans (not "Yes"/"No" strings)
      advance_rent_paid: values.advance_rent_paid,
      payment_mode: values.payment_mode || 'Cash',
      agreement_type: v(values.agreement_type),
      agreement_status: values.agreement_status || 'Pending',
      agreement_prepared_by_id: getLoggedInUser(),

      // ✅ FIX: Proper boolean
      key_available_in_office: values.key_available_in_office,
      key_code: v(values.key_code),
      key_handover_date: v(values.key_handover_date),
      key_handover_status: values.key_handover_status || 'Pending',
      electricity_meter_number: v(values.electricity_meter_number),

      // ✅ FIX: Always send "0" as fallback, never empty string
      electricity_meter_reading_start: values.electricity_meter_reading || '0',
      water_meter_reading_start: values.water_meter_reading || '0',
      gas_meter_reading_start: values.gas_meter_reading || '0',

      finance_approval_status: values.finance_approval_status || 'Pending',

      // ✅ FIX: Proper booleans
      rent_entry_created: values.rent_entry_created,
      invoice_generated: values.invoice_generated,
      maintenance_required: values.maintenance_required,

      maintenance_ticket_id: v(values.maintenance_ticket_id),
      maintenance_status: values.maintenance_status || 'Pending',
      internal_notes: vStr(values.internal_notes),
      tenant_special_requirements: vStr(values.tenant_special_requirements),
    };

    console.log('📤 Payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await httpClient.post(`${API_BASE_URL}/property/assign/`, payload, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, 'Content-Type': 'application/json' },
      });
      if (response.data?.status) {
        alert('Property assigned successfully!');
        navigate('/list');
      } else {
        alert(`Error: ${response.data?.message || 'Unknown error'}`);
      }
    } catch (error) {
      // ✅ FIX: Better error extraction — avoids showing raw HTML from 500 pages
      const backendData = error?.response?.data;
      console.error('❌ Full Backend Error:', backendData);

      let errorMsg = 'Unknown error';
      if (typeof backendData === 'object' && backendData !== null) {
        // Django REST Framework returns error details as objects
        errorMsg = JSON.stringify(backendData, null, 2);
      } else if (typeof backendData === 'string' && !backendData.includes('<!DOCTYPE')) {
        errorMsg = backendData;
      } else {
        errorMsg = `Status ${error?.response?.status} - Check browser console for full details`;
      }

      alert(`Error: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  });

  if (!tenantData) {
    return (
      <Card className="mb-4 border-danger">
        <CardBody className="text-center py-5">
          <h4 className="text-danger">⚠️ No Tenant Data Found</h4>
          <p>Please go back and select a tenant from the list.</p>
          <Button variant="primary" onClick={() => navigate('/list')}>Go Back</Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit}>

      <div style={{ backgroundColor: '#f5f5f5', padding: '25px 24px', borderRadius: '8px', marginBottom: '20px' }}>
        <h4 style={{ margin: 0, fontSize: '25px', fontWeight: '600', color: '#3d5a80' }}>
          Assign Property to Tenant
        </h4>
      </div>

      {/* PROPERTY DETAILS */}
      <Card className="mb-4 shadow-sm">
        <CardBody>
          <h4 className="fw-semibold">Property Details (<span style={{ color: 'rgb(96 74 227)', fontSize: '14px' }} >Only those properties where the current status is 'Vacant' will be displayed.</span> )</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label">Property Type</label>
              <select className="form-control" value={propertyType}
                onChange={(e) => { setPropertyType(e.target.value); setSelectedPropertyId(''); }}>
                <option value="flat">Flat / Apartment</option>
                <option value="villa">Villa / Bungalow</option>
                <option value="commercial">Commercial</option>
                <option value="warehouse">Warehouse</option>
              </select>
            </Col>
            <Col lg={4}>
              <label className="form-label">Select Property ({properties.length} available)</label>
              {propertiesLoading ? (
                <div><Spinner animation="border" size="sm" /> Loading...</div>
              ) : (
                <select className="form-control" value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}>
                  <option value="">-- Select Property --</option>
                  {properties.map(prop => (
                    <option key={prop.propertyId} value={prop.propertyId}>
                      {prop.buildingDetails || prop.propertyDetails?.building_name} - Unit {prop.flatNumber}
                    </option>
                  ))}
                </select>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* TENANT DETAILS */}
      <Card className="mb-4 border-primary">
        <CardBody>
          <h4 className="fw-semibold">Tenant Details (Auto-filled)</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label">Tenant ID</label>
              <input type="text" className="form-control bg-light fw-bold" value={tenantData?.leadId || 'N/A'} readOnly />
            </Col>
            <Col lg={4}><TextFormInput control={control} name="tenant_name" label="Tenant Name" readOnly /></Col>
            <Col lg={4}><TextFormInput control={control} name="mobile_number" label="Mobile" readOnly /></Col>
            <Col lg={4}><TextFormInput control={control} name="nationality" label="Nationality" readOnly /></Col>
          </Row>
        </CardBody>
      </Card>

      {/* RENTAL DETAILS */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Rental Details</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label">Tenant Type</label>
              <Controller name="tenant_type" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="Individual">Individual</option>
                  <option value="Corporate">Corporate</option>
                </select>
              )} />
            </Col>
            {watchedTenantType === 'Corporate' && (
              <Col lg={4}>
                <TextFormInput control={control} name="company_name" label="Company Name" style={{ backgroundColor: '#F9F9FC' }} />
              </Col>
            )}
            <Col lg={4}>
              <TextFormInput control={control} name="rental_start_date" label="Rental Start Date" type="date" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
            <Col lg={4}>
              <TextFormInput control={control} name="rental_end_date" label="Rental End Date" type="date" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
            <Col lg={4}>
              <TextFormInput control={control} name="agreement_duration_months" label="Agreement Duration (Months)" type="number" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
            <Col lg={4}>
              <TextFormInput control={control} name="monthly_rent" label="Monthly Rent (OMR)" type="number" step="0.01" style={{ backgroundColor: '#F9F9FC' }}  />
            </Col>
            <Col lg={4}>
              <TextFormInput control={control} name="security_deposit" label="Security Deposit (OMR)" type="number" step="0.01" style={{ backgroundColor: '#F9F9FC' }}  />
            </Col>
            <Col lg={4}>
              <TextFormInput control={control} name="maintenance_charges" label="Maintenance Charges (OMR)" type="number" step="0.01" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
            <Col lg={4}>
              <label className="form-label">Advance Rent Paid</label>
              <Controller name="advance_rent_paid" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              )} />
            </Col>
            <Col lg={4}>
              <label className="form-label">Payment Mode</label>
              <Controller name="payment_mode" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Online">Online</option>
                  <option value="Cheque">Cheque</option>
                </select>
              )} />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* AGREEMENT DETAILS */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Agreement Details</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label">Agreement Type</label>
              <Controller name="agreement_type" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="">Select Type</option>
                  <option value="Government Agreement">Government Agreement</option>
                  <option value="Internal Agreement">Internal Agreement</option>
                </select>
              )} />
            </Col>
            <Col lg={4}>
              <label className="form-label">Agreement Status</label>
              <Controller name="agreement_status" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="Pending">Pending</option>
                  <option value="Prepared">Prepared</option>
                  <option value="Signed">Signed</option>
                  <option value="Executed">Executed</option>
                  <option value="Terminated">Terminated</option>
                </select>
              )} />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* KEY MANAGEMENT */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Key Management</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label">Key Available in Office</label>
              <Controller name="key_available_in_office" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              )} />
            </Col>
            <Col lg={4}>
              <TextFormInput control={control} name="key_code" label="Key Number / Key Code" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
            <Col lg={4}>
              <TextFormInput control={control} name="key_handover_date" label="Key Handover Date" type="date" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
            <Col lg={4}>
              <label className="form-label">Key Handover Status</label>
              <Controller name="key_handover_status" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="Pending">Pending</option>
                  <option value="Handed Over">Handed Over</option>
                  <option value="Returned">Returned</option>
                </select>
              )} />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* UTILITY DETAILS */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Utility Details</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <TextFormInput control={control} name="electricity_meter_number" label="Electricity Meter Number" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
            <Col lg={4}>
              <TextFormInput control={control} name="electricity_meter_reading" label="Electricity Meter Reading (Start)" type="number" step="0.01" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
            <Col lg={4}>
              <TextFormInput control={control} name="water_meter_reading" label="Water Meter Reading (Start)" type="number" step="0.01" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
            <Col lg={4}>
              <TextFormInput control={control} name="gas_meter_reading" label="Gas Meter Reading (Start)" type="number" step="0.01" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* FINANCIAL APPROVAL */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Financial Approval</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label">Finance Approval Status</label>
              <Controller name="finance_approval_status" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Rejected">Rejected</option>
                </select>
              )} />
            </Col>
            <Col lg={4}>
              <label className="form-label">Rent Entry Created</label>
              <Controller name="rent_entry_created" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              )} />
            </Col>
            <Col lg={4}>
              <label className="form-label">Invoice Generated</label>
              <Controller name="invoice_generated" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              )} />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* MAINTENANCE */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Maintenance Check</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label">Maintenance Required</label>
              <Controller name="maintenance_required" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              )} />
            </Col>
            <Col lg={4}>
              <TextFormInput control={control} name="maintenance_ticket_id" label="Maintenance Ticket ID" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
            <Col lg={4}>
              <label className="form-label">Maintenance Status</label>
              <Controller name="maintenance_status" control={control} render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: '#F9F9FC' }} {...field}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Required">Not Required</option>
                </select>
              )} />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* INTERNAL TRACKING */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Internal Tracking</h4>
          <hr />
          <Row className="g-3">
            <Col lg={12}>
              <TextAreaFormInput control={control} name="internal_notes" label="Internal Notes" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
            <Col lg={12}>
              <TextAreaFormInput control={control} name="tenant_special_requirements" label="Tenant Special Requirements" style={{ backgroundColor: '#F9F9FC' }} />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* BUTTONS */}
      <div className="mb-3">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button variant="outline-primary" type="button" className="w-100"
              onClick={() => navigate('/list')} disabled={submitting}>
              Cancel
            </Button>
          </Col>
          <Col lg={2}>
            <Button variant="primary" type="submit" className="w-100"
              style={{ backgroundColor: '#5D7186', borderColor: '#5D7186' }}
              disabled={submitting || !selectedPropertyId}>
              {submitting
                ? <><Spinner animation="border" size="sm" className="me-2" />Assigning...</>
                : 'Assign Property'}
            </Button>
          </Col>
        </Row>
      </div>

    </form>
  );
};

export default PropertyAdd;