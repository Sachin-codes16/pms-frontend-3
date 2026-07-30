import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import TextFormInput from '@/components/from/TextFormInput';
import TextAreaFormInput from '@/components/from/TextAreaFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardBody, Col, Row, Form, Button } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/helpers/api';
import { normalizePhotosForApi } from '@/utils/imageStorage';
import  './PropertyAdd.css';

const schema = yup.object({});

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

const PropertyAdd = ({ initialData = null, mode = 'create', uploadedPhotos = [] }) => {
  const [propertyType , setPropertyType] = useState('flat')
  const [selectedCountry, setSelectedCountry] = useState({ code: 'OM', name: 'Oman' });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [landlords, setLandlords] = useState([]);
  const navigate = useNavigate();
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
      assigned_to_user_id: '36',
    }
  });

  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        const res = await api.get('/lead/get_all/', { params: { limit: 99999 } });
        setLandlords(res?.data?.data?.data || []);
      } catch (e) {
        console.error('Failed to fetch landlords', e);
      }
    };
    fetchLandlords();
  }, []);

  useEffect(() => {
    if (initialData && mode === 'update') {
      reset(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, mode]);

  const selectedPropertyType = propertyTypeOptions.find((option) => option.value === propertyType) ?? propertyTypeOptions[0];
  const cyclePropertyType = () => {
    const currentIndex = propertyTypeOptions.findIndex((option) => option.value === propertyType);
    const nextIndex = (currentIndex + 1) % propertyTypeOptions.length;
    const nextType = propertyTypeOptions[nextIndex].value;
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
        created_by_id: toNum(values.assigned_to_user_id) || 36,
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
        photos: [],
        assigned_to: {
          user_id: toNum(values.assigned_to_user_id) || 36,
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
        };
      } else if (type==='villa') {
        payload.villa_data = {
          villa_name: toStr(values.building_name) || 'N/A',
          villa_type: toStr(values.villa_type) || 'Independent',
          villa_configuration: toStr(values.villa_configuration) || '2BHK',
          plot_area_sqft: toStr(values.plot_area) || '0',
        };
      } else {
        const commercialData = {
          commercial_category: toStr(values.commercial_category) || (type === 'warehouse' ? 'Warehouse' : 'Shop'),
          floor_number: toNum(values.floor_number),
          loading_area: toStr(values.loading_area) || 'Warehouse',
        };

        if (type === 'warehouse') {
          payload.warehouse_data = {
            warehouse_category: commercialData.commercial_category,
            floor_number: commercialData.floor_number,
            loading_area: commercialData.loading_area,
          };
        } else {
          payload.commercial_data = commercialData;
        }
      }

      if (Array.isArray(uploadedPhotos) && uploadedPhotos.length>0) {
        const existingPhotos = uploadedPhotos.filter(p=>p.type==='existing').map(p=>p.raw);
        const newBase64 = uploadedPhotos.filter(p=>p.type==='new').map(p=>p.raw);
        const normalizedNew = normalizePhotosForApi(newBase64);
        payload.photos = [...existingPhotos, ...normalizedNew];
      }
      if (selectedLandlord) {
        payload.assigned_to = {
          user_id: toNum(selectedLandlord.lead_assign_to_id) || toNum(values.assigned_to_user_id) || 36,
          name: `${selectedLandlord.firstName || ''} ${selectedLandlord.lastName || ''}`.trim(),
          phone_number: selectedLandlord.phoneNumber || '',
          email: selectedLandlord.email || '',
        };
      }

      const sanitized = sanitizePayload(payload);

      if (mode==='update' && initialData?.propertyId) {
        const updatePayload = { property_id: initialData.propertyId, ...sanitized };
        await api.put('/property/update/', updatePayload);
        alert('Property updated successfully.');
        navigate('/landlord/property-grid');
      } else {
        await api.post('/property/create/', sanitized);
        alert('Property added successfully.');
        navigate('/landlord/property-grid');
      }

    } catch (e) {
      console.error('Property save failed', e);
      const res = e?.response?.data;
      let msg = e?.message || 'Failed to save property.';
      if (res) msg = JSON.stringify(res);
      alert(msg);
    }
  });


  return (
    <form className="property-add-form" onSubmit={onSubmit}>

      <Card className="mb-4 property-add-card">
        <CardBody className="p-0">
          <div
            className="property-add-header d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3"
          >
            <h3 className="property-add-title mb-0">
              Add New Property
            </h3>
            <div className="d-flex align-items-center gap-3">
              <span className="property-type-label">Select Property Type:</span>
              <button
                type="button"
                onClick={cyclePropertyType}
                className="property-type-toggle d-flex align-items-center justify-content-between"
              >
                <span>{selectedPropertyType.label}</span>
                <span className="property-type-toggle-arrow" />
              </button>
            </div>
          </div>

          <div className="property-add-card-body">
          <h4 className="fw-semibold">
            {selectedPropertyType.sectionTitle}
          </h4>
          <hr />
          <Row className="g-3">
            {propertyType === 'flat' && 
            <>
            <Col lg={4}><ReadOnlyField label="Property Type" value={selectedPropertyType.fieldValue} /></Col>
            <Col lg={4}><TextFormInput control={control}style ={{ backgroundColor: '#F9F9FC' }} name="property_code" label="Property Code / ID" placeholder="Auto-Generated" /></Col>
            <Col lg={4}>
              <label className="form-label">Building Name</label>
              <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                <option>Select Building</option>
              </ChoicesFormInput>
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
            <Col lg={4}><ReadOnlyField label="Property Type" value={selectedPropertyType.fieldValue} /></Col>
            <Col lg={4} ><TextFormInput control={control} name="property_code" label="Property Code / ID" placeholder="Auto-Generated" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}>
              <label className="form-label">Villa Name / Number</label>
              <ChoicesFormInput className="form-control" >
                <option>Villa Name / Number</option>
              </ChoicesFormInput>
            </Col>
            <Col lg={4}><TextFormInput control={control} name="building_block" label="Project / Society Name" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="floor_number" label="Unit Number (Gated)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="flat_no" label="Total Floors" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="total_floors" label="Year of Construction" style={{ backgroundColor: '#F9F9FC' }}/></Col></>}

            {propertyType === 'commercial' && 
            <>
            <Col lg={4}><ReadOnlyField label="Property Type" value={selectedPropertyType.fieldValue} /></Col>
            <Col lg={4}><TextFormInput control={control} name="property_code" label="Property Code / ID" placeholder="Auto-Generated"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}>
              <label className="form-label">Commercial Category</label>
              <Controller name="commercial_category" control={control} defaultValue="Shop" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Shop">Shop</option>
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
            <Col lg={4}><ReadOnlyField label="Property Type" value={selectedPropertyType.fieldValue} /></Col>
            <Col lg={4}><TextFormInput control={control} name="property_code" label="Property Code / ID" placeholder="Auto-Generated"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}>
              <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Warehouse Category</label>
              <Controller name="commercial_category" control={control} defaultValue="Warehouse" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Warehouse">Warehouse</option>
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
              <label className="form-label">Store Room</label>
              <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                <option>Yes</option>
                <option>No</option>
              </ChoicesFormInput>
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
              <Controller name="villa_configuration" control={control} defaultValue="Independent" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Independent">Independent</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                </select>
              )} />
            </Col>
             <Col lg={4}><TextFormInput control={control} name="carpet_area" label="Carpet Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="builtup_area" label="Built-up Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="plot_area" label="Plot Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="No. of Bedrooms"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="No. of Bathrooms"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="Living Rooms Count"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}>
              <label className="form-label">Kitchen Type</label>
              <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                <option>Open</option>
                <option>Closed</option>
              </ChoicesFormInput>
            </Col>
            <Col lg={4}>
              <label className="form-label">Store Room</label>
              <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                <option>Yes</option>
                <option>No</option>
              </ChoicesFormInput>
            </Col>

            <Col lg={4}>
              <label className="form-label">Servant Room</label>
              <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                <option>Yes</option>
                <option>No</option>
              </ChoicesFormInput>
            </Col>

            <Col lg={4}>
              <label className="form-label">Balcony / Sit-out</label>
              <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                <option>Yes</option>
                <option>No</option>
              </ChoicesFormInput>
            </Col>

            <Col lg={4}>
              <label className="form-label">Facing</label>
              <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                <option>East</option>
                <option>West</option>
                <option>North</option>
                <option>South</option>
              </ChoicesFormInput>
            </Col></>}


            {propertyType === 'commercial' && 
            <>
            
             <Col lg={4}><TextFormInput control={control} name="carpet_area" label="Carpet Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="builtup_area" label="Built-up Area (Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="commercial_super_builtup_area" label="Super Built-up (Optional)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="Frontage Width (Feet)"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="Ceiling Height (Feet)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="No. of Cabins"style={{ backgroundColor: '#F9F9FC' }} /></Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="No. of Washrooms"style={{ backgroundColor: '#F9F9FC' }} /></Col>

            <Col lg={4}>
              <label className="form-label">Pantry</label>
              <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                <option>Yes</option>
                <option>No</option>
              </ChoicesFormInput>
            </Col>

            <Col lg={4}>
              <label className="form-label">Store Room</label>
              <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                <option>Yes</option>
                <option>No</option>
              </ChoicesFormInput>
            </Col>

            <Col lg={4}>
              <label className="form-label">Loading Area</label>
              <Controller name="loading_area" control={control} defaultValue="Yes" render={({ field }) => (
                <select className="form-control" style={{ backgroundColor: fieldBg }} {...field}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
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
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="No. of Bays" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="No. of Loading docks" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="Dock Height (Feet)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="Floor Load (MT / Sq.Ft)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="bathrooms" label="Column Spacing (Feet)" style={{ backgroundColor: '#F9F9FC' }}/></Col>
    
            <Col lg={4}>
              <label className="form-label">Mezzanine Floor</label>
              <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                <option>Yes</option>
                <option>No</option>
              </ChoicesFormInput>
            </Col>
           <Col lg={4}><TextFormInput control={control} name="bathrooms" label="Office Space Area" style={{ backgroundColor: '#F9F9FC' }}/></Col>
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
                'Private Garden /  Lawn','Private Parking','Swiming Pool','Terrace / Rooftop Access','Boundry Wall',
                'Driveway'
              ].map(item => (
                <Col lg={3} key={item}>
                  <Form.Check type="checkbox" label={item} />
                </Col>
              ))}
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
                <label className="form-label">DG / Power Backup</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Yes</option>
                  <option>No</option>
                </ChoicesFormInput>
              </Col>

              <Col lg={4}>
                <label className="form-label">Lift Type</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Passanger</option>
                  <option>No</option>
                </ChoicesFormInput>
              </Col>
              <Col lg={4}><TextFormInput control={control} name="commercial_fire_safety_compliance" label="Fire Safety Compliance"style={{ backgroundColor: '#F9F9FC' }}/></Col>
              <Col lg={4}>
                <label className="form-label">Emergency Exit</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Yes</option>
                  <option>No</option>
                </ChoicesFormInput>
              </Col>

              <Col lg={4}>
                <label className="form-label">Parking Availability</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Open</option>
                  <option>Close</option>
                </ChoicesFormInput>
              </Col>

              <Col lg={4}>
                <label className="form-label">CCTV / Security</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Yes</option>
                  <option>No</option>
                </ChoicesFormInput>
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
                <label className="form-label">Transformer Available </label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Yes</option>
                  <option>No</option>
                </ChoicesFormInput>
              </Col>

              <Col lg={4}>
                <label className="form-label">DG Set / Backup</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Yes</option>
                  <option>No</option>
                </ChoicesFormInput>
              </Col>

              <Col lg={4}>
                <label className="form-label">Water Supply Source</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Borewell</option>
                  <option>No</option>
                </ChoicesFormInput>
              </Col>

              <Col lg={4}>
                <label className="form-label">Drainage System</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Yes</option>
                  <option>No</option>
                </ChoicesFormInput>
              </Col>

              <Col lg={4}>
                <label className="form-label">Internet / Fiber</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Yes</option>
                  <option>No</option>
                </ChoicesFormInput>
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
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>20ft</option>
                  <option>No</option>
                </ChoicesFormInput>
              </Col>

              <Col lg={4}>
                <label className="form-label">Turning Radius</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Adequate</option>
                  <option>No</option>
                </ChoicesFormInput>
              </Col>

              <Col lg={4}>
                <label className="form-label">Weighbridge Nearby</label>
                <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
                  <option>Yes</option>
                  <option>No</option>
                </ChoicesFormInput>
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
          <label className="form-label">Electricity Type</label>
          <ChoicesFormInput className="form-control"><option>Meter</option></ChoicesFormInput>
        </Col>
        <Col lg={4}>
          <label className="form-label">Water Type</label>
          <ChoicesFormInput className="form-control"><option>Meter</option></ChoicesFormInput>
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
          <label className="form-label">Electricity Charges</label>
          <ChoicesFormInput className="form-control"><option>Meter</option></ChoicesFormInput>
        </Col>
        <Col lg={4}>
          <label className="form-label">Water Charges</label>
          <ChoicesFormInput className="form-control"><option>Meter</option></ChoicesFormInput>
        </Col>
        <Col lg={4}><TextFormInput control={control} name="other_charges" label="Gardening Charges" style={{ backgroundColor: '#F9F9FC' }} /></Col>
        <Col lg={4}><TextFormInput control={control} name="other_charges" label="Other Charges" style={{ backgroundColor: '#F9F9FC' }} /></Col>
        <Col lg={4}><TextFormInput control={control} name="other_charges" label="Late Fee Rule" style={{ backgroundColor: '#F9F9FC' }}/></Col>
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
          <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>GST Applicable</label>
          <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}>
            <option>Yes</option>
            <option>No</option>
          </ChoicesFormInput>
        </Col>
        <Col lg={4}><TextFormInput control={control} name="maintenance" label="GST %" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}>
          <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Electricity Charges</label>
          <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}><option>Meter</option></ChoicesFormInput>
        </Col>
        <Col lg={4}>
          <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Water Charges</label>
          <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}><option>Meter</option></ChoicesFormInput>
        </Col>
        <Col lg={4}><TextFormInput control={control} name="other_charges" label="Other Charges" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="other_charges" label="Late Fee Rule" style={{ backgroundColor: '#F9F9FC' }}/></Col>
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
          <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Electricity Charges</label>
          <ChoicesFormInput className="form-control"><option>Meter</option></ChoicesFormInput>
        </Col>
        <Col lg={4}>
          <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Water Charges</label>
          <ChoicesFormInput className="form-control"style ={{ backgroundColor: '#F9F9FC' }}><option>Meter</option></ChoicesFormInput>
        </Col>
        <Col lg={4}><TextFormInput control={control} name="other_charges" label="CAM Charges" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="other_charges" label="Other Charges" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="other_charges" label="Rent Escalation %/Year" style={{ backgroundColor: '#F9F9FC' }}/></Col>
        <Col lg={4}><TextFormInput control={control} name="other_charges" label="Lock-in Period" style={{ backgroundColor: '#F9F9FC' }}/></Col>
      </Row>
    </CardBody>
  </Card>
)}

     { propertyType === 'warehouse' && (   <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Tenant & Usage Preference</h4>
          <hr />
          <label className="form-label">Landlord Name</label>
          <ChoicesFormInput className="form-control mb-3"style ={{ backgroundColor: '#F9F9FC' }}>
            <option>Select From Master</option>
          </ChoicesFormInput>

          <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Allowed Industry Type</label>
          <Row className="g-3">
            {['FMCG','Pharma','Ecommerce','Manufacturing','Logistics'].map(t => (
              <Col lg={3} key={t}>
                <Form.Check label={t} />
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
                  <option value="Occupied">Occupied</option>
                </select>
              )} />
            </Col>
            <Col lg={4}><TextFormInput control={control} name="available_from" label="Available From" placeholder="dd-mm-yyyy" style={{ backgroundColor: '#F9F9FC' }}/></Col>
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
                '24x7 Water Supply',
                'Power Backup',
                'Security / Guard',
                'CCTV',
                'Clubhouse Access',
                'Gym',
                'Children’s Play Area',
                'Internal Roads',
                'Street Lights',
                'Gated Community'
              ].map(item => (
                <Col lg={3} key={item}>
                  <Form.Check type="checkbox" label={item} />
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
                <Form.Check label={t} />
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
              <Col lg={4}><TextFormInput control={control} name="commercial_landlord_name" label="Landlord Name"style={{ backgroundColor: '#F9F9FC' }} /></Col>
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
                  <option value="Occupied">Occupied</option>
                </select>
              )} />
            </Col>
            <Col lg={4}><TextFormInput control={control} name="available_from" label="Available From" placeholder="dd-mm-yyyy" style={{ backgroundColor: '#F9F9FC' }}/></Col>
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

          <label className="form-label"style ={{ backgroundColor: '#F9F9FC' }}>Landlord Name</label>
          <ChoicesFormInput className="form-control mb-2"style ={{ backgroundColor: '#F9F9FC' }}>
            <option>Landlord Master</option>
          
          </ChoicesFormInput>
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
                  <option value="Occupied">Occupied</option>
                </select>
              )} />
            </Col>
            <Col lg={4}><TextFormInput control={control} name="available_from" label="Available From" placeholder="dd-mm-yyyy" style={{ backgroundColor: '#F9F9FC' }}/></Col>
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
              'Parking','Lift','Power Backup','Security','CCTV',
              'Gas Pipeline','Water Supply','Intercom','Fire Safety'
            ].map(item => (
              <Col lg={3} key={item}>
                {item === 'Parking' ? (
                  <Controller name="amenity_Parking" control={control} defaultValue={false} render={({ field: { value, onChange, ...field } }) => (
                    <Form.Check type="checkbox" label={item} checked={!!value} onChange={(e) => onChange(e.target.checked)} {...field} />
                  )} />
                ) : (
                  <Form.Check type="checkbox" label={item} />
                )}
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
              <Form.Check
                type="checkbox"
                label={t}
                className="fw-medium"
              />
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
                  <option value="Occupied">Occupied</option>
                </select>
              )} />
            </Col>
            <Col lg={4}><TextFormInput control={control} name="available_from" label="Available From" placeholder="dd-mm-yyyy" style={{ backgroundColor: '#F9F9FC' }}/></Col>
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
        <span className="dropdown-arrow">▼</span>
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
          <TextFormInput control={control} name="created_by" label="Created By" containerClassName="my-4" style={{ backgroundColor: '#F9F9FC' }} />
        </CardBody>
      </Card>

      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">System Fields (Auto)</h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}><TextFormInput control={control} name="created_time" label="Created Time" placeholder="Time Stamp" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="updated_by" label="Last Updated By" style={{ backgroundColor: '#F9F9FC' }}/></Col>
            <Col lg={4}><TextFormInput control={control} name="updated_time" label="Last Updated Time" style={{ backgroundColor: '#F9F9FC' }}/></Col>
          </Row>
        </CardBody>
      </Card>

      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button variant="outline-primary" type="button" className="w-100" onClick={() => navigate('/landlord/property-grid')}>
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
  Add Property
</Button>
          </Col>
        </Row>
      </div>

    </form>
  );
};

export default PropertyAdd;





