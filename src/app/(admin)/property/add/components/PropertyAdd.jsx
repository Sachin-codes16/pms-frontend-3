import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import TextFormInput from '@/components/from/TextFormInput';
import TextAreaFormInput from '@/components/from/TextAreaFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardBody, Col, Row, Form, Button, Modal } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/helpers/api';
import { useAuthContext } from '@/context/useAuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import  './PropertyAdd.css';

const schema = yup.object({
  building_name: yup.string().trim().required('Building/Property name is required'),
  landlord_id: yup.string().trim().required('Landlord is required'),
  address1: yup.string().trim().required('Address is required'),
  city: yup.string().trim().required('City is required'),
  monthly_rent: yup
    .string()
    .trim()
    .required('Monthly rent is required')
    .test('is-positive-number', 'Monthly rent must be a positive number', (v) => !v || (Number(v) > 0 && Number.isFinite(Number(v)))),
});

const propertyTypeOptions = [
  { value: 'flat', label: 'Flat / Apartment', fieldValue: 'Flat', sectionTitle: 'Basic Property Details' },
  { value: 'villa', label: 'Villa/Banglow', fieldValue: 'Villa', sectionTitle: 'Basic Villa Details' },
  { value: 'commercial', label: 'Commercial', fieldValue: 'Commercial', sectionTitle: 'Basic Commercial Details' },
  { value: 'warehouse', label: 'Warehouse', fieldValue: 'Warehouse', sectionTitle: 'Basic Warehouse Details' },
];

const fieldBg = '#F9F9FC';

const FLAT_CONFIG_MAP = {
  Studio: 'Studio',
  '1 BHK': '1BHK', '2 BHK': '2BHK', '3 BHK': '3BHK', '4 BHK': '4BHK',
  '1BHK': '1BHK',  '2BHK': '2BHK',  '3BHK': '3BHK',  '4BHK': '4BHK',
};

const LandlordSelect = ({ control, landlords }) => (
  <div>
    <label className="form-label" style={{ backgroundColor: '#F9F9FC' }}>Landlord Name</label>
    <Controller name="landlord_id" control={control} defaultValue="" render={({ field, fieldState }) => (
      <>
        <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
          <option value="">Select Landlord</option>
          {landlords.map((l) => (
            <option key={l.leadId} value={l.leadId}>
              {[l.firstName, l.lastName].filter(Boolean).join(' ') || `Lead #${l.leadId}`}
            </option>
          ))}
        </select>
        {fieldState.error?.message && (
          <div className="text-danger small mt-1">{fieldState.error.message}</div>
        )}
      </>
    )} />
  </div>
);

const AvailableFromField = ({ control }) => (
  <div>
    <label className="form-label">Available From</label>
    <Controller name="available_from" control={control} defaultValue={null} render={({ field }) => (
      <DatePicker
        selected={field.value instanceof Date ? field.value : (field.value ? new Date(field.value) : null)}
        onChange={(date) => field.onChange(date)}
        dateFormat="dd-MM-yyyy"
        placeholderText="dd-mm-yyyy"
        className="form-control"
        wrapperClassName="d-block"
        isClearable
      />
    )} />
  </div>
);

const BoolCheck = ({ control, name, label }) => (
  <Controller name={name} control={control} defaultValue={false} render={({ field: { value, onChange, ...field } }) => (
    <Form.Check type="checkbox" label={label} checked={!!value} onChange={(e) => onChange(e.target.checked)} {...field} />
  )} />
);

const ChargeTypeSelect = ({ control, name, label }) => (
  <div>
    <label className="form-label">{label}</label>
    <Controller name={name} control={control} defaultValue="Meter" render={({ field }) => (
      <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
        <option value="Meter">Meter</option>
        <option value="Fixed">Fixed</option>
      </select>
    )} />
  </div>
);

const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="form-label">{label}</label>
    <input
      className="form-control"
      readOnly
      style={{ backgroundColor: fieldBg, fontStyle: 'italic' }}
      value={value}
    />
  </div>
);

const PropertyTypeSelect = ({ value, options, onChange }) => (
  <div>
    <label className="form-label">Select Property Type</label>
    <select
      className="form-select"
      style={{ backgroundColor: fieldBg }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const PropertyAdd = ({ initialData = null, mode = 'create', uploadedPhotos = [] }) => {
  const [successModal, setSuccessModal] = useState({ show: false, message: '' });
  const [propertyType , setPropertyType] = useState('flat')
  const [selectedCountry, setSelectedCountry] = useState({ code: 'OM', name: 'Oman' });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [landlords, setLandlords] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const loggedInUserId = user?.user_id ?? user?.userId ?? '';
   const countries = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'US', name: 'U.S.A' },
    { code: 'DK', name: 'Denmark' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'IN', name: 'India' },
    { code: 'OM', name: 'Oman' },
    { code: 'ES', name: 'Spain' },
    { code: 'AE', name: 'United Arab Emirates' }
  ];
  
  const { handleSubmit, control, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      property_type: 'flat',
      country: 'Oman',
      rental_purpose: 'Residential',
      status: 'Vacant',
      balcony: 'Yes',
      kitchen_type: 'Open',
      facing: 'East',
      landlord_id: '',
      assigned_to_user_id: String(loggedInUserId || ''),
    }
  });

  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        const res = await api.get('/lead/get_all/', { params: { limit: 99999 } });
        const all = res?.data?.data?.data || [];
        // purpose casing is inconsistent in the backend data ("Landlord" vs "landlord"),
        // so filter client-side case-insensitively instead of relying on an exact
        // server-side match that silently drops differently-cased records.
        setLandlords(all.filter((l) => l.purpose?.toLowerCase() === 'landlord'));
      } catch (e) {
        console.error('Failed to fetch landlords', e);
      }
    };
    fetchLandlords();
  }, []);

  useEffect(() => {
    if (initialData && mode === 'update') {
      reset(initialData);
      if (initialData.property_type) {
        setPropertyType(initialData.property_type);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, mode]);

  const selectedPropertyType = propertyTypeOptions.find((option) => option.value === propertyType) ?? propertyTypeOptions[0];
  const handlePropertyTypeChange = (nextType) => {
    setPropertyType(nextType);
    setValue('property_type', nextType, { shouldDirty: true });
  };
  // helpers
  const toNum = (v) => {
    if (v === '' || v == null) return 0;
    const n = Number(v); return Number.isFinite(n) ? n : 0;
  };
  const toStr = (v) => (v == null ? '' : String(v));
  const toApiDate = (v) => {
    if (!v) return new Date().toISOString().slice(0,10);
    if (v instanceof Date) return v.toISOString().slice(0,10);
    return String(v).trim();
  };

  const sanitizePayload = (obj) => {
    if (obj === null || obj === undefined) return undefined;
    if (Array.isArray(obj)) return obj.map(sanitizePayload);
    if (typeof obj === 'object') {
      const out = {};
      for (const [k,v] of Object.entries(obj)) {
        if (v === null || v === undefined) continue;
        out[k]= typeof v==='object' ? sanitizePayload(v) : v;
      }
      return out;
    }
    return obj;
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const type = propertyType || values.property_type || 'flat';
      const rentalType = type==='villa' ? 'Villa' : type==='warehouse' ? 'Warehouse' : type==='commercial' ? 'Commercial' : 'Flat';
      const landlordId = toNum(values.landlord_id) || 0;
      const selectedLandlord = landlords.find((landlord) => toNum(landlord?.leadId) === landlordId);

      const property_details = {
        building_name: toStr(values.building_name) || 'N/A',
        total_floors: toNum(values.total_floors),
        carpet_area_sqft: toStr(values.carpet_area) || '0',
        builtup_area_sqft: toStr(values.builtup_area) || '0',
        monthly_rent: toStr(values.monthly_rent) || '0',
        security_deposit_amount: toStr(values.security_deposit) || '0',
        current_status: toStr(values.status) || 'Vacant',
        landlord_id: landlordId,
        address_line_1: toStr(values.address1) || 'N/A',
        address_line_2: toStr(values.address2) || '-',
        area_zone: toStr(values.area) || '-',
        city: toStr(values.city) || 'N/A',
        country: toStr(values.country || selectedCountry.name) || 'Oman',
        pincode: toStr(values.po_box) || '-',
        google_map_location: toStr(values.map_url) || '-',
        available_from: toApiDate(values.available_from),
        internal_notes: toStr(values.internal_notes) || '-',
        state: toStr(values.state) || 'N/A',
        year_of_construction:
          (type === 'villa' && toNum(values.total_floors)) || new Date().getFullYear(),
        late_fee_type: toStr(values.late_fee_type) || 'Day wise',
        late_fee_value: toStr(values.late_fee_value) || '0',
        other_charges: toStr(
          values.other_charges || values.villa_other_charges || values.commercial_other_charges || values.warehouse_other_charges
        ) || '0',
        electricity_charge_type: toStr(values.electricity_charge_type) || 'Meter',
        water_charge_type: toStr(values.water_charge_type) || 'Meter',
        created_by_id: toNum(values.assigned_to_user_id) || toNum(loggedInUserId) || 0,
      };

      const payload = {
        block: toStr(values.building_block) || 'N/A',
        building_details: toStr(values.building_name),
        floor: toStr(values.floor_number),
        flat_number: toNum(values.flat_no),
        dimension_area_sqft: toStr(values.carpet_area ?? ''),
        rental_type: rentalType,
        rental_for: values.rental_purpose === 'Commercial' ? 'Commercial' : 'Family',
        expected_rent: toStr(values.monthly_rent ?? ''),
        assigned_to: {
          user_id: toNum(values.assigned_to_user_id) || toNum(loggedInUserId) || 0,
          name: '',
          phone_number: '',
          email: '',
        },
        property_details,
      };

      if (type==='flat') {
        payload.flat_data = {
          flat_number: toStr(values.flat_no) || 'N/A',
          flat_configuration: FLAT_CONFIG_MAP[toStr(values.flat_configuration)] || '1BHK',
          floor_number: toNum(values.floor_number),
          building_block: toStr(values.building_block),
          no_of_bathrooms: toNum(values.bathrooms),
          kitchen_type: toStr(values.kitchen_type),
          facing: toStr(values.facing),
          balcony: values.balcony === 'Yes',
          parking: !!values.amenity_Parking,
          lift: !!values.amenity_Lift,
          power_backup: !!values.amenity_PowerBackup,
          security: !!values.amenity_Security,
          cctv: !!values.amenity_CCTV,
          gas_pipeline: !!values.amenity_GasPipeline,
          water_supply: !!values.amenity_WaterSupply,
          intercom: !!values.amenity_Intercom,
          fire_safety: !!values.amenity_FireSafety,
          store_room: !!values.store_room,
          allowed_tenant_types: ['Bachelor', 'Family', 'Company Staff', 'Labour'].filter((t) => !!values[`tenant_type_${t}`]),
          maintenance_charge_amount: toStr(values.maintenance) || '0',
        };
      } else if (type==='villa') {
        payload.villa_data = {
          villa_name: toStr(values.building_name) || 'N/A',
          villa_type: toStr(values.villa_type) || 'Independent',
          villa_configuration: toStr(values.villa_configuration) || '2BHK',
          plot_area_sqft: toStr(values.plot_area) || '0',
          number_of_bedrooms: toNum(values.villa_bedrooms),
          number_of_bathrooms: toNum(values.villa_bathrooms),
          living_rooms_count: toNum(values.villa_living_rooms),
          maintenance_charge_amount: toStr(values.maintenance) || '0',
          gardening_charges: toStr(values.villa_gardening_charges) || '0',
          store_room: !!values.villa_store_room,
          servant_room: !!values.villa_servant_room,
          balcony_or_sitout: !!values.villa_balcony_or_sitout,
          facing: toStr(values.villa_facing) || 'East',
          private_garden: !!values.villa_private_garden,
          terrace_access: !!values.villa_terrace_access,
          boundary_wall: !!values.villa_boundary_wall,
          driveway: !!values.villa_driveway,
          private_parking: toStr(values.villa_private_parking) || undefined,
          water_supply_24x7: !!values.villa_water_supply_24x7,
          power_backup: !!values.villa_power_backup,
          security_guard: !!values.villa_security_guard,
          cctv: !!values.villa_cctv,
          clubhouse_access: !!values.villa_clubhouse_access,
          gym: !!values.villa_gym,
          childrens_play_area: !!values.villa_childrens_play_area,
          internal_roads: !!values.villa_internal_roads,
          street_lights: !!values.villa_street_lights,
          gated_community: !!values.villa_gated_community,
          allowed_tenant_types: ['Bachelor', 'Family', 'Company Staff', 'Labour'].filter((t) => !!values[`tenant_type_${t}`]),
        };
      } else if (type === 'warehouse') {
        payload.warehouse_data = {
          warehouse_category: toStr(values.warehouse_category) || 'Industrial Warehouse',
          warehouse_name: toStr(values.building_block) || toStr(values.building_name) || 'N/A',
          loading_area: toStr(values.loading_area) || 'Warehouse',
          plot_area_sqft: toStr(values.warehouse_plot_area) || '0',
          clear_height_ft: toStr(values.warehouse_clear_height) || '0',
          no_of_bays: toNum(values.warehouse_no_of_bays),
          no_of_loading_docks: toNum(values.warehouse_no_of_loading_docks),
          dock_height_ft: toStr(values.warehouse_dock_height) || '0',
          floor_load_capacity_mt_sqft: toStr(values.warehouse_floor_load) || '0',
          column_spacing_ft: toStr(values.warehouse_column_spacing) || '0',
          office_space_area_sqft: toStr(values.warehouse_office_space_area) || '0',
          maintenance_charges: toStr(values.maintenance) || '0',
          cam_charges: toStr(values.warehouse_cam_charges) || '0',
          rent_escalation_percentage: toStr(values.warehouse_rent_escalation) || '0',
          lock_in_period_months: toNum(values.warehouse_lock_in_period),
          has_mezzanine_floor: !!values.warehouse_mezzanine_floor,
          power_load_kw: toStr(values.warehouse_power_supply) || '0',
          has_transformer: !!values.warehouse_transformer,
          has_dg_backup: !!values.warehouse_dg_backup,
          water_supply_source: toStr(values.warehouse_water_supply_source) || undefined,
          has_drainage_system: !!values.warehouse_drainage_system,
          has_internet_fiber: !!values.warehouse_internet_fiber,
          entry_gate_width_ft: toStr(values.warehouse_entry_gate_width) || '0',
          road_width_ft: toStr(values.warehouse_road_width) || '0',
          truck_parking_capacity: toNum(values.warehouse_truck_parking_capacity),
          container_access: toStr(values.warehouse_container_access) || undefined,
          turning_radius: toStr(values.warehouse_turning_radius) || undefined,
          has_weighbridge_nearby: !!values.warehouse_weighbridge_nearby,
          monthly_rent_type: toStr(values.warehouse_monthly_rent_type) || 'Lump Sum',
          allowed_industry_types: ['FMCG','Pharma','Ecommerce','Manufacturing','Logistics'].filter((t) => !!values[`industry_type_${t}`]),
          industrial_estate_name: toStr(values.floor_number) || undefined,
          plot_shed_number: toStr(values.flat_no) || undefined,
        };
      } else {
        payload.commercial_data = {
          commercial_category: toStr(values.commercial_category) || 'Shop',
          floor_number: toNum(values.floor_number),
          loading_area: toStr(values.loading_area) || 'Warehouse',
          frontage_width_ft: toStr(values.commercial_frontage_width) || '0',
          ceiling_height_ft: toStr(values.commercial_ceiling_height) || '0',
          no_of_cabins: toNum(values.commercial_no_of_cabins),
          no_of_washrooms: toNum(values.commercial_no_of_washrooms),
          maintenance_charge_amount: toStr(values.maintenance) || '0',
          gst_percentage: toStr(values.commercial_gst_percentage) || '0',
          lease_tenure_years: toNum(values.commercial_lease_tenure_year),
          lock_in_period_months: toNum(values.commercial_lock_in_period),
          power_load_kw: toStr(values.commercial_power_load) || '0',
          has_dg_backup: !!values.commercial_dg_backup,
          lift_type: toStr(values.commercial_lift_type) || undefined,
          fire_safety_compliant: !!values.commercial_fire_safety_compliant,
          emergency_exit: !!values.commercial_emergency_exit,
          parking_availability: toStr(values.commercial_parking_availability) || undefined,
          cctv: !!values.commercial_cctv,
          gst_applicable: !!values.commercial_gst_applicable,
          allowed_business: toStr(values.commercial_allowed_business_type) || undefined,
          prohibited_business: toStr(values.commercial_prohibited_business) || undefined,
          super_builtup_area_sqft: toStr(values.commercial_super_builtup_area) || undefined,
        };
      }

      if (Array.isArray(uploadedPhotos) && uploadedPhotos.length>0) {
        // /property/create/ expects photos as plain base64 strings (or URLs) with
        // no data-URI prefix — confirmed live; a "data:image/...;base64," prefix
        // is accepted (201) but silently fails to persist.
        payload.photos = uploadedPhotos
          .map((p) => p.raw)
          .filter(Boolean)
          .map((raw) => (raw.startsWith('data:') ? raw.split(',')[1] : raw));
      }
      if (selectedLandlord) {
        payload.assigned_to = {
          user_id: toNum(selectedLandlord.lead_assign_to_id) || toNum(values.assigned_to_user_id) || toNum(loggedInUserId) || 0,
          name: `${selectedLandlord.firstName || ''} ${selectedLandlord.lastName || ''}`.trim(),
          phone_number: selectedLandlord.phoneNumber || '',
          email: selectedLandlord.email || '',
        };
      }
// changes updated succesfully
      const sanitized = sanitizePayload(payload);

      if (mode==='update' && initialData?.propertyId) {
        const updatePayload = { property_id: initialData.propertyId, ...sanitized };
        await api.put('/property/update/', updatePayload);
        setSuccessModal({ show: true, message: 'Property updated successfully.' });
      } else {
        await api.post('/property/create/', sanitized);
        setSuccessModal({ show: true, message: 'Property added successfully.' });
      }

    } catch (e) {
      console.error('Property save failed', e);
      const res = e?.response?.data;
      let msg = e?.message || 'Failed to save property.';
      if (res) msg = JSON.stringify(res);
      alert(msg);
    }
  });


  const handleSuccessModalClose = () => {
    setSuccessModal({ show: false, message: '' });
    navigate('/landlord/property-grid');
  };

  return (
    <>
    <form className="property-add-form" onSubmit={onSubmit}>

      <Card className="mb-4 property-add-card">
        <CardBody className="p-0">
          <div
            className="property-add-header d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3"
          >
            <h3 className="property-add-title mb-0">
              {mode === 'update' ? 'Edit Property' : 'Add New Property'}
            </h3>
          </div>

          <div className="property-add-card-body">
          <h4 className="fw-semibold">
            {selectedPropertyType.sectionTitle}
          </h4>
          <hr />
          <Row className="g-3">
            {propertyType === 'flat' && 
            <>
            <Col lg={4}><PropertyTypeSelect value={propertyType} options={propertyTypeOptions} onChange={handlePropertyTypeChange} /></Col>
            <Col lg={4}><TextFormInput control={control}style ={{ backgroundColor: '#F9F9FC' }} name="property_code" label="Property Code / ID" placeholder="Auto-Generated" /></Col>
            <Col lg={4}>
              <TextFormInput control={control} name="building_name" label="Building Name" style={{ backgroundColor: '#F9F9FC' }}/>
            </Col>
            
<Col lg={4}>
  <TextFormInput 
    control={control} 
    name="building_block" 
    label="Building Block" 
    style={{ backgroundColor: '#F9F9FC' }}
  />
</Col>
<Col lg={4}>
  <TextFormInput 
    control={control} 
    name="floor_number" 
    label="Floor Number" 
    style={{ backgroundColor: '#F9F9FC' }}
  />
</Col>
            <Col lg={4}>
  <TextFormInput 
    control={control} 
    name="flat_no" 
    label="Flat No / Name" 
    style={{ backgroundColor: '#F9F9FC' }}
  />
</Col>
           <Col lg={4}>
  <TextFormInput 
    control={control} 
    name="total_floors" 
    label="Total Floors (Bldg)" 
    style={{ backgroundColor: '#F9F9FC' }}
  />
</Col>
</>}

            {propertyType === 'villa' && 
            <>
            <Col lg={4}><PropertyTypeSelect value={propertyType} options={propertyTypeOptions} onChange={handlePropertyTypeChange} /></Col>
            <Col lg={4} ><TextFormInput control={control} name="property_code" label="Property Code / ID" placeholder="Auto-Generated" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}>
              <TextFormInput control={control} name="building_name" label="Villa Name / Number" style={{ backgroundColor: '#F9F9FC' }}/>
            </Col>
            <Col lg={4}><TextFormInput control={control} name="building_block" label="Project / Society Name" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="floor_number" label="Unit Number (Gated)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="flat_no" label="Total Floors" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="total_floors" label="Year of Construction" style={{ backgroundColor: '#F9F9FC' }}/></Col></>}

            {propertyType === 'commercial' && 
            <>
            <Col lg={4}><PropertyTypeSelect value={propertyType} options={propertyTypeOptions} onChange={handlePropertyTypeChange} /></Col>
            <Col lg={4}><TextFormInput control={control} name="property_code" label="Property Code / ID" placeholder="Auto-Generated"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}>
              <label className="form-label">Commercial Category</label>
              <Controller name="commercial_category" control={control} defaultValue="Shop" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Shop">Shop</option>
                  <option value="Office">Office</option>
                  <option value="Showroom">Showroom</option>
                  <option value="Godown">Godown</option>
                  <option value="Industrial Unit">Industrial Unit</option>
                </select>
              )} />
            </Col>
            <Col lg={4}><TextFormInput control={control} name="building_block" label="Building / Complex Name" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="floor_number" label="Unit / Shop / Office No." style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="flat_no" label="Floor Number"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}><TextFormInput control={control} name="commercial_total_floors_unit" label="Total Floors" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="total_floors" label="Year of Construction" style={{ backgroundColor: '#F9F9FC' }}/></Col></>}

              {propertyType === 'warehouse' && 
            <>
            <Col lg={4}><PropertyTypeSelect value={propertyType} options={propertyTypeOptions} onChange={handlePropertyTypeChange} /></Col>
            <Col lg={4}><TextFormInput control={control} name="property_code" label="Property Code / ID" placeholder="Auto-Generated"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}>
              <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Warehouse Category</label>
              <Controller name="warehouse_category" control={control} defaultValue="Industrial Warehouse" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Industrial Warehouse">Industrial Warehouse</option>
                  <option value="Logistics Warehouse">Logistics Warehouse</option>
                  <option value="Cold Storage">Cold Storage</option>
                  <option value="Godown">Godown</option>
                </select>
              )} />
            </Col>
            <Col lg={4}><TextFormInput control={control} name="building_block" label="Warehouse Name / Code" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="floor_number" label="Indusrial Estate / MIDC" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="flat_no" label="Plot / Shed Number" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="total_floors" label="Year of Construction" style={{ backgroundColor: '#F9F9FC' }}/></Col></>}
              
          </Row>
          </div>
        </CardBody>
      </Card>

      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">
            {propertyType === 'flat' ? 'Flat Configuration' : 
            propertyType === 'villa' ? 'Villa Configuration' : 
            propertyType === 'commercial' ? 'Area & Layout Details' : 
            'Area & Structural Details'}
          </h4>
          <hr />
          <Row className="g-3">
            {propertyType === 'flat' && 
            <>
          <>
  <Col lg={4}>
    <label className="form-label">BHK Configuration</label>
    <Controller name="flat_configuration" control={control} defaultValue="1 BHK" render={({ field }) => (
      <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
        <option value="Studio">Studio</option>
        <option value="1 BHK">1 BHK</option>
        <option value="2 BHK">2 BHK</option>
        <option value="3 BHK">3 BHK</option>
        <option value="4 BHK">4 BHK</option>
      </select>
    )} />
  </Col>
</>

            <Col lg={4}><TextFormInput control={control} name="carpet_area" label="Carpet Area (Sq.Ft)"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}><TextFormInput control={control} name="builtup_area" label="Built-up Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}>
              <label className="form-label">Balcony</label>
              <Controller name="balcony" control={control} defaultValue="Yes" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              )} />
            </Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="No. of Bathrooms" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}>
              <label className="form-label">Kitchen Type</label>
              <Controller name="kitchen_type" control={control} defaultValue="Open" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              )} />
            </Col>
            <Col lg={4}>
              <BoolCheck control={control} name="store_room" label="Store Room" />
            </Col>
            <Col lg={4}>
              <label className="form-label">Facing</label>
              <Controller name="facing" control={control} defaultValue="East" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                </select>
              )} />
            </Col></>}


            {propertyType === 'villa' && 
            <>
            <Col lg={4} >
              <label className="form-label">Villa Type</label>
              <Controller name="villa_type" control={control} defaultValue="Independent" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Independent">Independent</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                </select>
              )} />
            </Col>
            <Col lg={4}>
              <label className="form-label">BHK Configuration</label>
              <Controller name="villa_configuration" control={control} defaultValue="2BHK" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="2BHK">2 BHK</option>
                  <option value="3BHK">3 BHK</option>
                  <option value="4BHK">4 BHK</option>
                  <option value="5BHK">5 BHK</option>
                </select>
              )} />
            </Col>
             <Col lg={4}><TextFormInput control={control} name="carpet_area" label="Carpet Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="builtup_area" label="Built-up Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="plot_area" label="Plot Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="villa_bedrooms" label="No. of Bedrooms"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}><TextFormInput control={control} name="villa_bathrooms" label="No. of Bathrooms"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}><TextFormInput control={control} name="villa_living_rooms" label="Living Rooms Count"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}>
              <BoolCheck control={control} name="villa_store_room" label="Store Room" />
            </Col>

            <Col lg={4}>
              <BoolCheck control={control} name="villa_servant_room" label="Servant Room" />
            </Col>

            <Col lg={4}>
              <BoolCheck control={control} name="villa_balcony_or_sitout" label="Balcony / Sit-out" />
            </Col>

            <Col lg={4}>
              <label className="form-label">Facing</label>
              <Controller name="villa_facing" control={control} defaultValue="East" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                </select>
              )} />
            </Col></>}


            {propertyType === 'commercial' && 
            <>
            
             <Col lg={4}><TextFormInput control={control} name="carpet_area" label="Carpet Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="builtup_area" label="Built-up Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="commercial_super_builtup_area" label="Super Built-up (Optional)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="commercial_frontage_width" label="Frontage Width (Feet)"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}><TextFormInput control={control} name="commercial_ceiling_height" label="Ceiling Height (Feet)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="commercial_no_of_cabins" label="No. of Cabins"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}><TextFormInput control={control} name="commercial_no_of_washrooms" label="No. of Washrooms"style={{ backgroundColor: '#F9F9FC' }} /></Col>

            <Col lg={4}>
              <label className="form-label">Loading Area</label>
              <Controller name="loading_area" control={control} defaultValue="Warehouse" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Godown">Godown</option>
                </select>
              )} />
            </Col>
            </>}

             {propertyType === 'warehouse' && 
            <>
             <Col lg={4}><TextFormInput control={control} name="warehouse_plot_area" label="Plot Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
              <Col lg={4}><TextFormInput control={control} name="builtup_area" label="Built-up Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
             <Col lg={4}><TextFormInput control={control} name="carpet_area" label="Carpet Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="warehouse_clear_height" label="Clear Height(Feet)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="warehouse_no_of_bays" label="No. of Bays" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="warehouse_no_of_loading_docks" label="No. of Loading docks" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="warehouse_dock_height" label="Dock Height (Feet)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="warehouse_floor_load" label="Floor Load (MT / Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="warehouse_column_spacing" label="Column Spacing (Feet)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
    
            <Col lg={4}>
              <BoolCheck control={control} name="warehouse_mezzanine_floor" label="Mezzanine Floor" />
            </Col>
           <Col lg={4}><TextFormInput control={control} name="warehouse_office_space_area" label="Office Space Area" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            </>}

            
          </Row>
        </CardBody>
      </Card>

      {propertyType === 'villa' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Outdoor & Exclusive Features</h4>
            <hr />
            <Row className="g-3">
              {[
                ['villa_private_garden', 'Private Garden /  Lawn'],
                ['villa_terrace_access', 'Terrace / Rooftop Access'],
                ['villa_boundary_wall', 'Boundry Wall'],
                ['villa_driveway', 'Driveway'],
              ].map(([name, label]) => (
                <Col lg={3} key={name}>
                  <BoolCheck control={control} name={name} label={label} />
                </Col>
              ))}
              <Col lg={3}>
                <label className="form-label">Private Parking</label>
                <Controller name="villa_private_parking" control={control} defaultValue="" render={({ field }) => (
                  <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                    <option value="">— Select —</option>
                    <option value="Open">Open</option>
                    <option value="Covered">Covered</option>
                    <option value="Both">Both</option>
                  </select>
                )} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {propertyType === 'commercial' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Commercial Infrastructure</h4>
            <hr />
            <Row className="g-3">
              <Col lg={4}><TextFormInput control={control} name="commercial_power_load" label="Pwer Load (KW) " style ={{ backgroundColor: '#F9F9FC' }}/></Col>
              <Col lg={4}>
                <BoolCheck control={control} name="commercial_dg_backup" label="DG / Power Backup" />
              </Col>

              <Col lg={4}>
                <label className="form-label">Lift Type</label>
                <Controller name="commercial_lift_type" control={control} defaultValue="" render={({ field }) => (
                  <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                    <option value="">— Select —</option>
                    <option value="Passenger">Passenger</option>
                    <option value="Goods">Goods</option>
                    <option value="Both">Both</option>
                  </select>
                )} />
              </Col>
              <Col lg={4}>
                <BoolCheck control={control} name="commercial_fire_safety_compliant" label="Fire Safety Compliant" />
              </Col>
              <Col lg={4}>
                <BoolCheck control={control} name="commercial_emergency_exit" label="Emergency Exit" />
              </Col>

              <Col lg={4}>
                <label className="form-label">Parking Availability</label>
                <Controller name="commercial_parking_availability" control={control} defaultValue="" render={({ field }) => (
                  <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                    <option value="">— Select —</option>
                    <option value="Open">Open</option>
                    <option value="Covered">Covered</option>
                    <option value="Both">Both</option>
                  </select>
                )} />
              </Col>

              <Col lg={4}>
                <BoolCheck control={control} name="commercial_cctv" label="CCTV / Security" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {propertyType === 'warehouse' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Infrastructure & Utilities</h4>
            <hr />
            <Row className="g-3">
              <Col lg={4}><TextFormInput control={control} name="warehouse_power_supply" label="Power Supply (KW)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            
              <Col lg={4}>
                <BoolCheck control={control} name="warehouse_transformer" label="Transformer Available" />
              </Col>

              <Col lg={4}>
                <BoolCheck control={control} name="warehouse_dg_backup" label="DG Set / Backup" />
              </Col>

              <Col lg={4}>
                <label className="form-label">Water Supply Source</label>
                <Controller name="warehouse_water_supply_source" control={control} defaultValue="" render={({ field }) => (
                  <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                    <option value="">— Select —</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Municipal">Municipal</option>
                    <option value="Tanker">Tanker</option>
                  </select>
                )} />
              </Col>

              <Col lg={4}>
                <BoolCheck control={control} name="warehouse_drainage_system" label="Drainage System" />
              </Col>

              <Col lg={4}>
                <BoolCheck control={control} name="warehouse_internet_fiber" label="Internet / Fiber" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {propertyType === 'warehouse' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Logistics & Vehicle Access</h4>
            <hr />
            <Row className="g-3">
              <Col lg={4}><TextFormInput control={control} name="warehouse_entry_gate_width" label="Entry Gate Width(Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
              <Col lg={4}><TextFormInput control={control} name="warehouse_road_width" label="Road Width(Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
              <Col lg={4}><TextFormInput control={control} name="warehouse_truck_parking_capacity" label="Truck Parking Capacity" style={{ backgroundColor: '#F9F9FC' }}/></Col>
              <Col lg={4}>
                <label className="form-label">Container Access</label>
                <Controller name="warehouse_container_access" control={control} defaultValue="" render={({ field }) => (
                  <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                    <option value="">— Select —</option>
                    <option value="20 ft">20 ft</option>
                    <option value="40 ft">40 ft</option>
                    <option value="Both">Both</option>
                  </select>
                )} />
              </Col>

              <Col lg={4}>
                <label className="form-label">Turning Radius</label>
                <Controller name="warehouse_turning_radius" control={control} defaultValue="" render={({ field }) => (
                  <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                    <option value="">— Select —</option>
                    <option value="Adequate">Adequate</option>
                    <option value="Limited">Limited</option>
                  </select>
                )} />
              </Col>

              <Col lg={4}>
                <BoolCheck control={control} name="warehouse_weighbridge_nearby" label="Weighbridge Nearby" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}

      
                        
{propertyType === 'flat' && (
  <Card className="mb-4">
    <CardBody>
      <h4 className="fw-semibold">Rental & Financial Details</h4>
      <hr />
      <Row className="g-3">
        <Col lg={4}><TextFormInput control={control} name="monthly_rent" label="Monthly Rent" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="security_deposit" label="Security Deposit" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="maintenance" label="Maintenance (Monthly)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}>
          <ChargeTypeSelect control={control} name="electricity_charge_type" label="Electricity Type" />
        </Col>
        <Col lg={4}>
          <ChargeTypeSelect control={control} name="water_charge_type" label="Water Type" />
        </Col>
        <Col lg={4}><TextFormInput control={control} name="other_charges" label="Other Charges" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}>
          <label className="form-label">Late Fee (% / Amt)</label>
          <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
            <option>Yes</option>
            <option>No</option>
          </ChoicesFormInput>
        </Col>
      </Row>
    </CardBody>
  </Card>
)}


{propertyType === 'villa' && (
  <Card className="mb-4">
    <CardBody>
      <h4 className="fw-semibold">Rental & Financial Details</h4>
      <hr />
      <Row className="g-3">
        <Col lg={4}><TextFormInput control={control} name="monthly_rent" label="Monthly Rent" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="security_deposit" label="Security Deposit" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="maintenance" label="Maintenance (Monthly)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}>
          <ChargeTypeSelect control={control} name="electricity_charge_type" label="Electricity Charges" />
        </Col>
        <Col lg={4}>
          <ChargeTypeSelect control={control} name="water_charge_type" label="Water Charges" />
        </Col>
        <Col lg={4}><TextFormInput control={control} name="villa_gardening_charges" label="Gardening Charges" style={{ backgroundColor: '#F9F9FC' }} /></Col>
        <Col lg={4}><TextFormInput control={control} name="villa_other_charges" label="Other Charges" style={{ backgroundColor: '#F9F9FC' }} /></Col>
        <Col lg={4}><TextFormInput control={control} name="villa_late_fee_rule" label="Late Fee Rule" style={{ backgroundColor: '#F9F9FC' }}/></Col>
      </Row>
    </CardBody>
  </Card>
)}


{propertyType === 'commercial' && (
  <Card className="mb-4">
    <CardBody>
      <h4 className="fw-semibold">Rental & Financial Details</h4>
      <hr />
      <Row className="g-3">
        <Col lg={4}><TextFormInput control={control} name="monthly_rent" label="Monthly Rent" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="security_deposit" label="Security Deposit" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="maintenance" label="Maintenance Charges" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}>
          <BoolCheck control={control} name="commercial_gst_applicable" label="GST Applicable" />
        </Col>
        <Col lg={4}><TextFormInput control={control} name="commercial_gst_percentage" label="GST %" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}>
          <ChargeTypeSelect control={control} name="electricity_charge_type" label="Electricity Charges" />
        </Col>
        <Col lg={4}>
          <ChargeTypeSelect control={control} name="water_charge_type" label="Water Charges" />
        </Col>
        <Col lg={4}><TextFormInput control={control} name="commercial_other_charges" label="Other Charges" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="commercial_late_fee_rule" label="Late Fee Rule" style={{ backgroundColor: '#F9F9FC' }}/></Col>
      </Row>
    </CardBody>
  </Card>
)}

{propertyType === 'warehouse' && (
  <Card className="mb-4">
    <CardBody>
      <h4 className="fw-semibold">Rental & Financial Terms</h4>
      <hr />
      <Row className="g-3">
        <Col lg={4}><TextFormInput control={control} name="monthly_rent" label="Monthly Rent" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="security_deposit" label="Security Deposit" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="maintenance" label="Maintenance Charges" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}>
          <ChargeTypeSelect control={control} name="electricity_charge_type" label="Electricity Charges" />
        </Col>
        <Col lg={4}>
          <ChargeTypeSelect control={control} name="water_charge_type" label="Water Charges" />
        </Col>
        <Col lg={4}>
          <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Monthly Rent Type</label>
          <Controller name="warehouse_monthly_rent_type" control={control} defaultValue="Lump Sum" render={({ field }) => (
            <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
              <option value="Per Sq. Ft.">Per Sq. Ft.</option>
              <option value="Lump Sum">Lump Sum</option>
            </select>
          )} />
        </Col>
        <Col lg={4}><TextFormInput control={control} name="warehouse_cam_charges" label="CAM Charges" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="warehouse_other_charges" label="Other Charges" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="warehouse_rent_escalation" label="Rent Escalation %/Year" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="warehouse_lock_in_period" label="Lock-in Period" style={{ backgroundColor: '#F9F9FC' }}/></Col>
      </Row>
    </CardBody>
  </Card>
)}

     { propertyType === 'warehouse' && (   <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Tenant & Usage Preference</h4>
          <hr />
          <div className="mb-3">
            <LandlordSelect control={control} landlords={landlords} />
          </div>

          <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Allowed Industry Type</label>
          <Row className="g-3">
            {['FMCG','Pharma','Ecommerce','Manufacturing','Logistics'].map(t => (
              <Col lg={3} key={t}>
                <BoolCheck control={control} name={`industry_type_${t}`} label={t} />
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>)}

      
          {propertyType === 'warehouse' && ( <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Availability & Status</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label">Status</label>
              <Controller name="status" control={control} defaultValue="Vacant" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Vacant">Vacant</option>
                  <option value="Booked">Booked</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              )} />
            </Col>
            <Col lg={4}><AvailableFromField control={control} /></Col>
            {/* <Col lg={4}><TextFormInput control={control} name="current_tenant" label="Current Tenant" style={{ backgroundColor: '#F9F9FC' }}/></Col> */}
          </Row>
        </CardBody>
      </Card>)}


      {propertyType === 'villa' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Facilities (Villa)</h4>
            <hr />
            <Row className="g-3">
              {[
                ['villa_water_supply_24x7', '24x7 Water Supply'],
                ['villa_power_backup', 'Power Backup'],
                ['villa_security_guard', 'Security / Guard'],
                ['villa_cctv', 'CCTV'],
                ['villa_clubhouse_access', 'Clubhouse Access'],
                ['villa_gym', 'Gym'],
                ['villa_childrens_play_area', 'Children’s Play Area'],
                ['villa_internal_roads', 'Internal Roads'],
                ['villa_street_lights', 'Street Lights'],
                ['villa_gated_community', 'Gated Community'],
              ].map(([name, label]) => (
                <Col lg={3} key={name}>
                  <BoolCheck control={control} name={name} label={label} />
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>
      )}

        { propertyType === 'villa' && (   <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Tenant Preference</h4>
          <hr />
          <label className="form-label">Rental Purpose</label>
          <Controller name="rental_purpose" control={control} defaultValue="Residential" render={({ field }) => (
            <select className="form-control mb-3" style={{ backgroundColor: fieldBg }} {...field}>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          )} />

          <label className="form-label">Tenant Type Allowed</label>
          <Row className="g-3">
            {['Bachelor','Family','Company Staff','Labour'].map(t => (
              <Col lg={3} key={t}>
                <BoolCheck control={control} name={`tenant_type_${t}`} label={t} />
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>)}

      {propertyType === 'commercial' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Business & Tenant Preference</h4>
            <hr />
            <Row className="g-3">
              <Col lg={4}><LandlordSelect control={control} landlords={landlords} /></Col>
              <Col lg={4}><TextFormInput control={control} name="commercial_allowed_business_type" label="Allowed Business Type" style={{ backgroundColor: '#F9F9FC' }}/></Col>
              <Col lg={4}><TextFormInput control={control} name="commercial_prohibited_business" label="Prohibited Business" style={{ backgroundColor: '#F9F9FC' }}/></Col>
              <Col lg={4}>
                <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Lease Type</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Company Lease</option>
                  <option>No</option>
                </ChoicesFormInput>
              </Col>

           <Col lg={4}><TextFormInput control={control} name="commercial_lease_tenure_year" label="Lease Tenure Year" style ={{ backgroundColor: '#F9F9FC' }}/></Col>
           <Col lg={4}><TextFormInput control={control} name="commercial_lock_in_period" label="Lock-in Period" style ={{ backgroundColor: '#F9F9FC' }}/></Col>

            </Row>
          </CardBody>
        </Card>
      )}

          {propertyType === 'commercial' && ( <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Availability & Status</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label">Status</label>
              <Controller name="status" control={control} defaultValue="Vacant" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Vacant">Vacant</option>
                  <option value="Booked">Booked</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              )} />
            </Col>
            <Col lg={4}><AvailableFromField control={control} /></Col>
          </Row>
        </CardBody>
      </Card>)}
   {(propertyType === 'flat' || propertyType === 'villa') && (  
     <Card className="mb-2">
        <CardBody>
          <h4 className="fw-semibold">Ownership</h4>
          <hr />
           <Row>
          <Col lg={4} md={6}>
            <LandlordSelect control={control} landlords={landlords} />
         </Col></Row>
          
        </CardBody>
      </Card>)}

      {propertyType === 'villa' && ( <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Availability & Status</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Status</label>
              <Controller name="status" control={control} defaultValue="Vacant" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Vacant">Vacant</option>
                  <option value="Booked">Booked</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              )} />
            </Col>
            <Col lg={4}><AvailableFromField control={control} /></Col>
          </Row>
        </CardBody>
      </Card>)}

   { propertyType === 'flat' && (
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Facilities & Amenities</h4>
          <hr />
          <Row className="g-3">
            {[
              ['amenity_Parking', 'Parking'],
              ['amenity_Lift', 'Lift'],
              ['amenity_PowerBackup', 'Power Backup'],
              ['amenity_Security', 'Security'],
              ['amenity_CCTV', 'CCTV'],
              ['amenity_GasPipeline', 'Gas Pipeline'],
              ['amenity_WaterSupply', 'Water Supply'],
              ['amenity_Intercom', 'Intercom'],
              ['amenity_FireSafety', 'Fire Safety'],
            ].map(([name, label]) => (
              <Col lg={3} key={name}>
                <BoolCheck control={control} name={name} label={label} />
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>)}

    {propertyType === 'flat' && (
  <Card className="mb-3">
    <CardBody>

      <h4 className="fw-semibold mb-3">Tenant Preference</h4>
      <hr className="mb-4" />

      <Row className="mb-4">
        <Col lg={4} md={6}>
          <label className="form-label mb-2">Rental Purpose</label>

          <Controller name="rental_purpose" control={control} defaultValue="Residential" render={({ field }) => (
            <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          )} />
        </Col>
      </Row>

      <label className="form-label mb-3">Tenant Type Allowed</label>

      <div
        className="p-3 rounded"
        style={{
          backgroundColor: '#F9F9FC',
          border: '1px solid #e6e8ee'
        }}
      >
        <Row className="gx-4 gy-3">
          {['Bachelor', 'Family', 'Company Staff', 'Labour'].map(t => (
            <Col lg={3} md={6} key={t}>
              <BoolCheck control={control} name={`tenant_type_${t}`} label={t} />
            </Col>
          ))}
        </Row>
      </div>

    </CardBody>
  </Card>
)}




     {propertyType === 'flat' && ( 
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Availability & Status</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Status</label>
              <Controller name="status" control={control} defaultValue="Vacant" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Vacant">Vacant</option>
                  <option value="Booked">Booked</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              )} />
            </Col>
            <Col lg={4}><AvailableFromField control={control} /></Col>
          </Row>
        </CardBody>
      </Card>)}

      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Location Details</h4>
          <hr />
         <div className="mb-3">
  <TextFormInput
  style ={{ backgroundColor: '#F9F9FC' }}
    control={control}
    name="address1"
    label="Address Line 1"
  />
</div>

<TextFormInput
style ={{ backgroundColor: '#F9F9FC' }}
  control={control}
  name="address2"
  label="Address Line 2"
/>

          <Row className="g-3 mt-1">
            <Col lg={4}><TextFormInput control={control} name="area" label="Area / Locality" style ={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="city" label="City" style ={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="state" label="State"style ={{ backgroundColor: '#F9F9FC' }} /></Col>
 <Col lg={4}>
  <div className="mb-3">
    <label htmlFor="choices-country" className="form-label">
      Country
    </label>

    <div className="custom-country-dropdown" >
      <div 
        className="country-select-box"style ={{ backgroundColor: '#F9F9FC' }}
        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
      >
        <div style={{ backgroundColor: '#F9F9FC',display: 'flex', alignItems: 'center', gap: '10px',  }}>
          <img 
            src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
            alt={selectedCountry.name}
            className="country-flag"
          />
          <span className="country-name">{selectedCountry.name}</span>
        </div>
        <span className={`dropdown-arrow${showCountryDropdown ? ' open' : ''}`} />
      </div>
      
      {showCountryDropdown && (
        <div className="country-dropdown-list">
          {countries.map((country) => (
            <div
              key={country.code}
              className="country-dropdown-item"
              onClick={() => {
                setSelectedCountry(country);
                setValue('country', country.name, { shouldDirty: true });
                setShowCountryDropdown(false);
              }}
            >
              <img 
                src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                alt={country.name}
                className="country-flag"
              />
              <span className="country-name">{country.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</Col>             
            <Col lg={4}><TextFormInput control={control} name="po_box" label="PO BOX" style ={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="map_url" label="Google Map URL"style ={{ backgroundColor: '#F9F9FC' }}/></Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Internal Tracking</h4>
          <hr />
          <TextAreaFormInput control={control} name="internal_notes" label="Internal Notes" containerClassName="my-4" style={{ backgroundColor: '#F9F9FC' }}/>
        </CardBody>
      </Card>

      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button variant="outline-primary" type="button" className="w-100 edit-detail-btn-cancel" onClick={() => navigate('/landlord/property-grid')}>
              Cancel
            </Button>
          </Col>
          <Col lg={2}>
            <Button
  variant="primary"
  type="submit"
  className="w-100"
  style={{ backgroundColor: '#5D7186', borderColor: '#5D7186' }}
>
  {mode === 'update' ? 'Save Changes' : 'Add Property'}
</Button>
          </Col>
        </Row>
      </div>

    </form>

    <Modal show={successModal.show} onHide={handleSuccessModalClose} centered>
      <Modal.Body className="text-center p-4">
        <div
          className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: 64, height: 64, backgroundColor: '#E6F4EA' }}
        >
          <IconifyIcon icon="ri:checkbox-circle-fill" style={{ color: '#28A745', fontSize: 36 }} />
        </div>
        <h5 className="fw-semibold mb-2">Success</h5>
        <p className="text-muted mb-4">{successModal.message}</p>
        <Button
          variant="primary"
          className="px-4"
          style={{ backgroundColor: '#5D7186', borderColor: '#5D7186' }}
          onClick={handleSuccessModalClose}
        >
          OK
        </Button>
      </Modal.Body>
    </Modal>
    </>
  );
};

export default PropertyAdd;





