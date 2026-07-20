import TextFormInput from '@/components/from/TextFormInput';
import TextAreaFormInput from '@/components/from/TextAreaFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import httpClient from '@/helpers/httpClient';
import { normalizePhotosForApi } from '@/utils/imageStorage';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardBody, Col, Row, Form, Button } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse, isValid } from 'date-fns';
import * as yup from 'yup';
import './PropertyAdd.css';

const schema = yup.object({});

const toNum = (v) => {
  if (v === '' || v == null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const toStr = (v) => (v == null ? '' : String(v));

function toApiDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (value instanceof Date) {
    return isValid(value) ? format(value, 'yyyy-MM-dd') : new Date().toISOString().slice(0, 10);
  }
  const s = toStr(value).trim();
  if (!s) return new Date().toISOString().slice(0, 10);
  const parts = s.split(/[-/.]/).map((p) => parseInt(p, 10));
  if (parts.length === 3 && parts.every(Number.isFinite)) {
    const [a, b, c] = parts;
    if (a > 31)
      return `${String(a).padStart(4, '0')}-${String(b).padStart(2, '0')}-${String(c).padStart(2, '0')}`;
    const y = c > 99 ? c : c < 50 ? 2000 + c : 1900 + c;
    return `${String(y).padStart(4, '0')}-${String(b).padStart(2, '0')}-${String(a).padStart(2, '0')}`;
  }
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

const FLAT_CONFIG_MAP = {
  Studio: 'Studio',
  '1 BHK': '1BHK', '2 BHK': '2BHK', '3 BHK': '3BHK', '4 BHK': '4BHK',
  '1BHK': '1BHK', '2BHK': '2BHK', '3BHK': '3BHK', '4BHK': '4BHK',
};

const VILLA_CONFIG_MAP = {
  Studio: 'Studio', Independent: 'Independent',
  '2 BHK': '2BHK', '3 BHK': '3BHK', '4 BHK': '4BHK', '5 BHK': '5BHK',
  '2BHK': '2BHK', '3BHK': '3BHK', '4BHK': '4BHK', '5BHK': '5BHK',
};

const VILLA_TYPE_MAP = {
  Independent: 'Independent', 'Semi-Detached': 'Semi-Detached',
  'Row House': 'Row House', Duplex: 'Duplex', Triplex: 'Triplex',
};

const NUMERIC_KEYS = new Set([
  'user_id', 'landlord_id', 'created_by_id', 'current_tenant_id', 'agreement_id',
  'year_of_construction', 'flat_number', 'floor_number', 'total_floors',
  'no_of_bathrooms', 'no_of_cabins', 'no_of_washrooms', 'number_of_bedrooms',
  'number_of_bathrooms', 'living_rooms_count', 'lease_tenure_years',
  'lock_in_period_months', 'security_deposit_months', 'advance_amount_rent',
]);

const OMIT_IF_EMPTY = new Set([
  'address_line_2', 'area_zone', 'state', 'pincode',
  'google_map_location', 'internal_notes', 'other_charges',
]);

function sanitizePayload(obj) {
  if (obj === null || obj === undefined) return undefined;
  if (Array.isArray(obj)) return obj.map((item) => sanitizePayload(item));
  if (typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const isEmpty = v === null || v === undefined || v === '';
      if (isEmpty) {
        if (NUMERIC_KEYS.has(k)) out[k] = 0;
        else if (OMIT_IF_EMPTY.has(k)) { /* skip */ }
        else out[k] = '';
      } else {
        out[k] = sanitizePayload(v);
      }
    }
    return out;
  }
  return obj;
}

function parseDateValue(val) {
  if (!val) return null;
  if (val instanceof Date) return isValid(val) ? val : null;
  const s = String(val).trim();
  if (!s) return null;
  const d1 = parse(s, 'yyyy-MM-dd', new Date());
  if (isValid(d1)) return d1;
  const d2 = parse(s, 'dd-MM-yyyy', new Date());
  if (isValid(d2)) return d2;
  const d3 = parse(s, 'dd/MM/yyyy', new Date());
  if (isValid(d3)) return d3;
  const d4 = new Date(s);
  if (isValid(d4)) return d4;
  return null;
}

// ─── Reads both camelCase (API) and snake_case keys safely ──────────────────
function pick(obj, camel, snake, fallback = undefined) {
  const v = obj[camel] !== undefined ? obj[camel] : obj[snake];
  return v !== undefined ? v : fallback;
}

function getDefaultsFromProperty(prop) {
  if (!prop) return undefined;

  // Support both camelCase (API response) and snake_case
  const pd = prop.propertyDetails ?? prop.property_details ?? {};
  const fd = prop.flatData       ?? prop.flat_data         ?? {};
  const vd = prop.villaData      ?? prop.villa_data        ?? {};
  const cd = prop.commercialData ?? prop.commercial_data   ?? {};
  const wd = prop.warehouseData  ?? prop.warehouse_data    ?? {};

  // ── Determine property type ─────────────────────────────────────────────
  const rentalType = (prop.rentalType ?? prop.rental_type ?? 'Flat').toLowerCase();
  let propType = 'flat';
  if (rentalType === 'villa')      propType = 'villa';
  else if (rentalType === 'warehouse') propType = 'warehouse';
  else if (rentalType === 'commercial') propType = 'commercial';

  // ── propertyDetails (API sends camelCase) ───────────────────────────────
  const buildingName    = pick(pd, 'buildingName',      'building_name',       prop.buildingDetails ?? prop.building_details ?? '');
  const totalFloors     = pick(pd, 'totalFloors',       'total_floors',        '');
  const carpetArea      = pick(pd, 'carpetAreaSqft',    'carpet_area_sqft',    prop.dimensionAreaSqft ?? prop.dimension_area_sqft ?? '');
  const builtupArea     = pick(pd, 'builtupAreaSqft',   'builtup_area_sqft',   '');
  const monthlyRent     = pick(pd, 'monthlyRent',       'monthly_rent',        prop.expectedRent ?? prop.expected_rent ?? '');
  const securityDep     = pick(pd, 'securityDepositAmount', 'security_deposit_amount', '');
  const lateFeeType     = pick(pd, 'lateFeeType',       'late_fee_type',       '');
  const lateFeeValue    = pick(pd, 'lateFeeValue',      'late_fee_value',      '');
  const currentStatus   = pick(pd, 'currentStatus',     'current_status',      'Vacant');
  const landlordId      = pick(pd, 'landlordId',        'landlord_id',         0);
  const addressLine1    = pick(pd, 'addressLine1',      'address_line_1',      '');
  const addressLine2    = pick(pd, 'addressLine2',      'address_line_2',      '');
  const areaZone        = pick(pd, 'areaZone',          'area_zone',           '');
  const city            = pd.city    ?? '';
  const state           = pd.state   ?? '';
  const country         = pd.country ?? 'Oman';
  const pincode         = pd.pincode ?? '';
  const googleMap       = pick(pd, 'googleMapLocation', 'google_map_location', '');
  const yearOfConst     = pick(pd, 'yearOfConstruction','year_of_construction', '');
  const otherCharges    = pick(pd, 'otherCharges',      'other_charges',       '');
  const availableFrom   = parseDateValue(pick(pd, 'availableFrom', 'available_from', null));
  const currentTenantId = pick(pd, 'currentTenantId',  'current_tenant_id',   '');
  const internalNotes   = pick(pd, 'internalNotes',     'internal_notes',      '');

  // ── flatData ────────────────────────────────────────────────────────────
  const flatConfig      = pick(fd, 'flatConfiguration', 'flat_configuration',  '1BHK');
  const flatBathrooms   = pick(fd, 'noOfBathrooms',     'no_of_bathrooms',     '');
  const flatKitchen     = pick(fd, 'kitchenType',       'kitchen_type',        'Open');
  const flatFacing      = fd.facing ?? 'East';
  const flatBalcony     = fd.balcony ?? false;
  const flatStoreRoom   = pick(fd, 'storeRoom',         'store_room',          false);
  const flatBlock       = pick(fd, 'buildingBlock',     'building_block',      prop.block ?? '');
  const flatMaintenance = pick(fd, 'maintenanceChargeAmount', 'maintenance_charge_amount', '');
  const flatTenantTypes = pick(fd, 'allowedTenantTypes','allowed_tenant_types', []);

  // ── villaData ───────────────────────────────────────────────────────────
  const villaConfig     = pick(vd, 'villaConfiguration','villa_configuration',  '2BHK');
  const villaType       = pick(vd, 'villaType',         'villa_type',           'Independent');
  const villaProject    = pick(vd, 'projectName',       'project_name',         prop.block ?? '');
  const villaPlotArea   = pick(vd, 'plotAreaSqft',      'plot_area_sqft',       '');
  const villaBedrooms   = pick(vd, 'numberOfBedrooms',  'number_of_bedrooms',   '');
  const villaBathrooms  = pick(vd, 'numberOfBathrooms', 'number_of_bathrooms',  '');
  const villaLivingRooms= pick(vd, 'livingRoomsCount',  'living_rooms_count',   '');
  const villaServantRoom= pick(vd, 'servantRoom',       'servant_room',         false);
  const villaBalcony    = pick(vd, 'balconyOrSitout',   'balcony_or_sitout',    false);
  const villaGarden     = pick(vd, 'privateGarden',     'private_garden',       false);
  const villaTerrace    = pick(vd, 'terraceAccess',     'terrace_access',       false);
  const villaBoundary   = pick(vd, 'boundaryWall',      'boundary_wall',        false);
  const villaDriveway   = vd.driveway ?? false;
  const villaParking    = pick(vd, 'privateParking',    'private_parking',      'Open');
  const villaPool       = pick(vd, 'swimmingPool',      'swimming_pool',        'No');
  const villaGardCharge = pick(vd, 'gardeningCharges',  'gardening_charges',    '');
  const villa24Water    = pick(vd, 'waterSupply24X7',   'water_supply_24x7',    false);
  const villaSecGuard   = pick(vd, 'securityGuard',     'security_guard',       false);
  const villaClubhouse  = pick(vd, 'clubhouseAccess',   'clubhouse_access',     false);
  const villaGym        = vd.gym ?? false;
  const villaPlayArea   = pick(vd, 'childrensPlayArea', 'childrens_play_area',  false);
  const villaRoads      = pick(vd, 'internalRoads',     'internal_roads',       false);
  const villaStreetLt   = pick(vd, 'streetLights',      'street_lights',        false);
  const villaGated      = pick(vd, 'gatedCommunity',    'gated_community',      false);
  const villaPowerBkp   = pick(vd, 'powerBackup',       'power_backup',         false);
  const villaCctv       = vd.cctv ?? false;
  const villaStoreRoom  = pick(vd, 'storeRoom',         'store_room',           false);
  const villaMaintenance= pick(vd, 'maintenanceChargeAmount', 'maintenance_charge_amount', '');
  const villaTenantTypes= pick(vd, 'allowedTenantTypes','allowed_tenant_types', []);

  // ── commercialData ──────────────────────────────────────────────────────
  const commCategory    = pick(cd, 'commercialCategory', 'commercial_category', 'Shop');
  const commFrontage    = pick(cd, 'frontageWidthFt',    'frontage_width_ft',   '');
  const commCeiling     = pick(cd, 'ceilingHeightFt',    'ceiling_height_ft',   '');
  const commCabins      = pick(cd, 'noOfCabins',         'no_of_cabins',        '');
  const commWashrooms   = pick(cd, 'noOfWashrooms',      'no_of_washrooms',     '');
  const commLoadingArea = pick(cd, 'loadingArea',        'loading_area',        'Warehouse');
  const commPowerLoad   = pick(cd, 'powerLoadKw',        'power_load_kw',       '');
  const commDgBackup    = pick(cd, 'hasDgBackup',        'has_dg_backup',       false);
  const commLiftType    = pick(cd, 'liftType',           'lift_type',           'Passenger');
  const commFireSafety  = pick(cd, 'fireSafetyCompliant','fire_safety_compliant', false);
  const commEmergExit   = pick(cd, 'emergencyExit',      'emergency_exit',      false);
  const commParking     = pick(cd, 'parkingAvailability','parking_availability', 'Open');
  const commMaintenance = pick(cd, 'maintenanceChargeAmount', 'maintenance_charge_amount', '');
  const commGst         = pick(cd, 'gstApplicable',      'gst_applicable',      false);
  const commGstPct      = pick(cd, 'gstPercentage',      'gst_percentage',      '');
  const commLeaseType   = pick(cd, 'leaseType',          'lease_type',          'Company');
  const commLeaseTenure = pick(cd, 'leaseTenureYears',   'lease_tenure_years',  '');
  const commLockIn      = pick(cd, 'lockInPeriodMonths', 'lock_in_period_months', '');
  const commAllowedBiz  = pick(cd, 'allowedBusiness',    'allowed_business',    '');
  const commProhibBiz   = pick(cd, 'prohibitedBusiness', 'prohibited_business', '');

  const tenantTypes = propType === 'flat' ? flatTenantTypes : villaTenantTypes;
  const maintenance = propType === 'villa' ? villaMaintenance
    : propType === 'commercial' ? commMaintenance
    : flatMaintenance;

  return {
    property_type:        propType,
    building_name:        buildingName,
    building_block:       propType === 'villa' ? villaProject : flatBlock,
    floor_number:         toStr(prop.floor ?? pick(fd,'floorNumber','floor_number','') ?? pick(cd,'floorNumber','floor_number','')),
    flat_no:              toStr(prop.flatNumber ?? prop.flat_number ?? pick(fd,'flatNumber','flat_number','')),
    total_floors:         toStr(totalFloors),
    year_of_construction: toStr(yearOfConst),

    // Flat
    configuration:        flatConfig,
    bathrooms:            toStr(propType === 'villa' ? villaBathrooms : flatBathrooms),
    kitchen_type:         flatKitchen,
    store_room:           (propType === 'villa' ? villaStoreRoom : flatStoreRoom) ? 'Yes' : 'No',
    facing:               flatFacing,
    balcony:              (propType === 'villa' ? villaBalcony : flatBalcony) ? 'Yes' : 'No',

    // Villa
    villa_configuration:  villaConfig,
    villa_type:           villaType,
    carpet_area:          toStr(carpetArea),
    builtup_area:         toStr(builtupArea),
    plot_area:            toStr(villaPlotArea),
    villa_bedrooms:       toStr(villaBedrooms),
    living_rooms_count:   toStr(villaLivingRooms),
    villa_servant_room:   villaServantRoom ? 'Yes' : 'No',
    villa_private_garden: villaGarden,
    villa_private_parking: ['Open','Covered','Both'].includes(villaParking) ? villaParking : 'Open',
    villa_swimming_pool:  villaPool,
    villa_terrace:        villaTerrace,
    villa_boundary_wall:  villaBoundary,
    villa_driveway:       villaDriveway,
    gardening_charges:    toStr(villaGardCharge),
    villa_24water:        villa24Water,
    villa_power_backup:   villaPowerBkp,
    villa_security:       villaSecGuard,
    villa_cctv:           villaCctv,
    villa_clubhouse:      villaClubhouse,
    villa_gym:            villaGym,
    villa_play_area:      villaPlayArea,
    villa_internal_roads: villaRoads,
    villa_street_lights:  villaStreetLt,
    villa_gated:          villaGated,

    // Commercial
    commercial_category:  commCategory,
    frontage_width:       toStr(commFrontage),
    ceiling_height:       toStr(commCeiling),
    no_of_cabins:         toStr(commCabins),
    no_of_washrooms:      toStr(commWashrooms),
    loading_area:         commLoadingArea,
    power_load_kw:        toStr(commPowerLoad),
    dg_backup:            commDgBackup ? 'Yes' : 'No',
    lift_type:            commLiftType,
    fire_safety:          commFireSafety ? 'Yes' : 'No',
    emergency_exit:       commEmergExit ? 'Yes' : 'No',
    parking_availability: commParking,
    gst_applicable:       commGst ? 'Yes' : 'No',
    gst_percentage:       toStr(commGstPct),
    lease_type:           commLeaseType,
    lease_tenure_years:   toStr(commLeaseTenure),
    lock_in_period:       toStr(commLockIn),
    allowed_business:     commAllowedBiz,
    prohibited_business:  commProhibBiz,

    // Financial
    monthly_rent:         toStr(monthlyRent),
    security_deposit:     toStr(securityDep),
    maintenance:          toStr(maintenance),
    late_fee_type:        lateFeeType,
    late_fee_value:       toStr(lateFeeValue),
    other_charges:        toStr(otherCharges),

    // Status
    status:               currentStatus,
    available_from:       availableFrom,
    current_tenant:       toStr(currentTenantId),

    // Location
    address1:             addressLine1,
    address2:             addressLine2,
    area:                 areaZone,
    city,
    state,
    country,
    po_box:               toStr(pincode),
    map_url:              googleMap,
    internal_notes:       internalNotes,

    // Ownership — MUST be string for <select> value matching
    landlord_id:          landlordId ? String(landlordId) : '',
    assigned_to_user_id:  toStr(prop.assignedTo?.userId ?? prop.assigned_to?.user_id ?? 36),

    rental_purpose: (prop.rentalFor === 'Commercial' || prop.rental_for === 'Commercial') ? 'Commercial' : 'Residential',

    // Flat amenities — API returns camelCase
    amenity_Parking:      pick(fd, 'parking',     'parking',      false),
    amenity_Lift:         pick(fd, 'lift',         'lift',         false),
    amenity_PowerBackup:  pick(fd, 'powerBackup',  'power_backup', false),
    amenity_Security:     pick(fd, 'security',     'security',     false),
    amenity_CCTV:         pick(fd, 'cctv',         'cctv',         false),
    amenity_GasPipeline:  pick(fd, 'gasPipeline',  'gas_pipeline', false),
    amenity_WaterSupply:  pick(fd, 'waterSupply',  'water_supply', false),
    amenity_Intercom:     pick(fd, 'intercom',     'intercom',     false),
    amenity_FireSafety:   pick(fd, 'fireSafety',   'fire_safety',  false),

    // Tenant types
    tenant_Bachelor:      tenantTypes.includes('Bachelor'),
    tenant_Family:        tenantTypes.includes('Family'),
    tenant_CompanyStaff:  tenantTypes.includes('Company Staff'),
    tenant_Labour:        tenantTypes.includes('Labour'),

    // Industry (warehouse)
    industry_FMCG: false, industry_Pharma: false, industry_Ecommerce: false,
    industry_Manufacturing: false, industry_Logistics: false,
  };
}

const EMPTY_DEFAULTS = {
  property_type: 'flat',
  building_name: '', building_block: '', floor_number: '', flat_no: '',
  total_floors: '', year_of_construction: '',
  configuration: '1BHK', villa_configuration: '2BHK', villa_type: 'Independent',
  carpet_area: '', builtup_area: '', plot_area: '',
  villa_bedrooms: '', bathrooms: '', living_rooms_count: '',
  balcony: 'No', kitchen_type: 'Open', store_room: 'No', villa_servant_room: 'No', facing: 'East',
  commercial_category: 'Shop', frontage_width: '', ceiling_height: '',
  no_of_cabins: '', no_of_washrooms: '', loading_area: 'Warehouse',
  power_load_kw: '', dg_backup: 'No', lift_type: 'Passenger',
  fire_safety: 'No', emergency_exit: 'No', parking_availability: 'Open',
  gst_applicable: 'No', gst_percentage: '', lease_type: 'Company',
  lease_tenure_years: '', lock_in_period: '', allowed_business: '', prohibited_business: '',
  monthly_rent: '', security_deposit: '', maintenance: '',
  late_fee_type: '', late_fee_value: '', other_charges: '', gardening_charges: '',
  rental_purpose: 'Residential', status: 'Vacant', available_from: null,
  landlord_id: '', current_tenant: '', assigned_to_user_id: '36',
  address1: '', address2: '', area: '', city: '', state: '', country: 'Oman', po_box: '', map_url: '',
  internal_notes: '',
  villa_private_parking: 'Open', villa_swimming_pool: 'No',
  mezzanine: 'No', transformer: 'No', drainage: 'No', internet_fiber: 'No',
  water_supply_source: 'Borewell', container_access: 'No',
  turning_radius: 'Adequate', weighbridge: 'No',
  amenity_Parking: false, amenity_Lift: false, amenity_PowerBackup: false,
  amenity_Security: false, amenity_CCTV: false, amenity_GasPipeline: false,
  amenity_WaterSupply: false, amenity_Intercom: false, amenity_FireSafety: false,
  tenant_Bachelor: false, tenant_Family: false, tenant_CompanyStaff: false, tenant_Labour: false,
  industry_FMCG: false, industry_Pharma: false, industry_Ecommerce: false,
  industry_Manufacturing: false, industry_Logistics: false,
  villa_private_garden: false, villa_terrace: false, villa_boundary_wall: false,
  villa_driveway: false, villa_24water: false, villa_power_backup: false,
  villa_security: false, villa_cctv: false, villa_clubhouse: false,
  villa_gym: false, villa_play_area: false, villa_internal_roads: false,
  villa_street_lights: false, villa_gated: false,
};

const inputStyle = { backgroundColor: '#F9F9FC' };

const PropertyAdd = ({ initialData = null, mode = 'create', onFormValuesChange, uploadedPhotos = [] }) => {
  const isUpdate = mode === 'update';
  const navigate = useNavigate();
  const [landlords, setLandlords] = useState([]);
  const [landlordsLoading, setLandlordsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

  const { handleSubmit, control, watch, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: EMPTY_DEFAULTS,
  });

  useEffect(() => {
    const fetchLandlords = async () => {
      setLandlordsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/lead/get_all/?limit=99999`, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}`, 'Content-Type': 'application/json' },
        });
        const json = await res.json();
        setLandlords(json?.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch landlords', err);
      } finally {
        setLandlordsLoading(false);
      }
    };
    fetchLandlords();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      setCountriesLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/helper/country/get_all?limit=99999`, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}`, 'Content-Type': 'application/json' },
        });
        const json = await res.json();
        setCountries(json?.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch countries', err);
      } finally {
        setCountriesLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // landlords is in deps so that after landlords load, landlord_id string matches the option
  useEffect(() => {
    if (isUpdate && initialData) {
      const editDefaults = getDefaultsFromProperty(initialData);
      console.log('[PropertyAdd] edit defaults:', editDefaults);
      if (editDefaults) reset(editDefaults);
    } else if (!isUpdate) {
      reset(EMPTY_DEFAULTS);
    }
  }, [initialData, isUpdate, reset, landlords]);

  const watched = watch();
  const propertyType = watched.property_type || 'flat';

  useEffect(() => {
    if (typeof onFormValuesChange !== 'function') return;
    const fullAddress = [watched.address1, watched.city, watched.country].filter(Boolean).join(', ');
    const beds = String(watched.configuration || '').replace(/[^0-9]/g, '') || '';
    onFormValuesChange({
      building_name: watched.building_name || '',
      name: watched.building_name || '',
      address: fullAddress,
      price: watched.monthly_rent || '',
      beds,
      baths: watched.bathrooms || '',
      area: watched.carpet_area || '',
      floor: watched.floor_number || '',
      status: watched.status || 'For Rent',
    });
  }, [
    onFormValuesChange,
    watched.building_name, watched.address1, watched.city, watched.country,
    watched.monthly_rent, watched.configuration, watched.bathrooms,
    watched.carpet_area, watched.floor_number, watched.status,
  ]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const assignedUserId = toNum(values.assigned_to_user_id) || 36;
      const type = values.property_type || 'flat';
      const rentalType =
        type === 'villa'       ? 'Villa'
        : type === 'warehouse' ? 'Warehouse'
        : type === 'commercial' ? 'Commercial'
        : 'Flat';

      const landlordId = toNum(values.landlord_id) || 0;
      const selectedLandlord = landlords.find((l) => l.leadId === landlordId);
      const landlordManagerId = selectedLandlord?.lead_assign_to_id || assignedUserId;

      const property_details = {
        building_name: toStr(values.building_name) || 'N/A',
        total_floors: toNum(values.total_floors),
        carpet_area_sqft: toStr(values.carpet_area) || '0',
        builtup_area_sqft: toStr(values.builtup_area) || '0',
        monthly_rent: toStr(values.monthly_rent) || '0',
        security_deposit_amount: toStr(values.security_deposit) || '0',
        late_fee_type: values.late_fee_type || 'Day wise',
        late_fee_value: toStr(values.late_fee_value) || '0',
        current_status: toStr(values.status) || 'Vacant',
        landlord_id: landlordId,
        created_by_id: assignedUserId,
        address_line_1: toStr(values.address1) || 'N/A',
        address_line_2: toStr(values.address2) || '-',
        area_zone: toStr(values.area) || '-',
        city: toStr(values.city) || 'N/A',
        state: toStr(values.state) || '-',
        country: toStr(values.country) || 'Oman',
        pincode: toStr(values.po_box) || '-',
        google_map_location: toStr(values.map_url) || '-',
        year_of_construction: toNum(values.year_of_construction) || 0,
        other_charges: toStr(values.other_charges) || '0',
        available_from: toApiDate(values.available_from),
        current_tenant_id: toNum(values.current_tenant) || 0,
        internal_notes: toStr(values.internal_notes) || '-',
      };

      const payload = {
        block: toStr(values.building_block) || 'N/A',
        building_details: toStr(values.building_name),
        floor: toStr(values.floor_number),
        flat_number: toNum(values.flat_no),
        dimension_length_ft: toStr(values.dimension_length ?? ''),
        dimension_breadth_ft: toStr(values.dimension_breadth ?? ''),
        dimension_area_sqft: toStr(values.carpet_area ?? ''),
        rental_type: rentalType,
        rental_for: values.rental_purpose === 'Commercial' ? 'Commercial' : 'Family',
        advance_amount_rent: 0,
        expected_rent: toStr(values.monthly_rent ?? ''),
        agreement_id: 0,
        photos: [],
        videos: [],
        assigned_to: {
          user_id: landlordManagerId,
          name: selectedLandlord ? `${selectedLandlord.firstName || ''} ${selectedLandlord.lastName || ''}`.trim() : '',
          phone_number: selectedLandlord?.phoneNumber || '',
          email: selectedLandlord?.email || '',
        },
        property_details,
      };

      if (type === 'flat') {
        payload.flat_data = {
          flat_number: toStr(values.flat_no),
          floor_number: toNum(values.floor_number),
          building_block: toStr(values.building_block),
          flat_configuration: FLAT_CONFIG_MAP[toStr(values.configuration)] || '1BHK',
          no_of_bathrooms: toNum(values.bathrooms),
          kitchen_type: toStr(values.kitchen_type),
          facing: toStr(values.facing),
          balcony: values.balcony === 'Yes',
          parking: values.amenity_Parking ?? false,
          lift: values.amenity_Lift ?? false,
          security: values.amenity_Security ?? false,
          gas_pipeline: values.amenity_GasPipeline ?? false,
          water_supply: values.amenity_WaterSupply ?? false,
          intercom: values.amenity_Intercom ?? false,
          fire_safety: values.amenity_FireSafety ?? false,
          power_backup: values.amenity_PowerBackup ?? false,
          cctv: values.amenity_CCTV ?? false,
          allowed_tenant_types: [
            values.tenant_Bachelor && 'Bachelor',
            values.tenant_Family && 'Family',
            values.tenant_CompanyStaff && 'Company Staff',
            values.tenant_Labour && 'Labour',
          ].filter(Boolean),
          store_room: values.store_room === 'Yes',
          maintenance_charge_amount: toStr(values.maintenance) || '0',
        };
      } else if (type === 'villa') {
        const villaConfig = VILLA_CONFIG_MAP[toStr(values.villa_configuration)] || '2BHK';
        const rawParking = toStr(values.villa_private_parking);
        const safeParking = ['Yes','Open','Covered','Both'].includes(rawParking) ? rawParking : 'Open';
        payload.villa_data = {
          villa_name: toStr(values.building_name) || 'N/A',
          villa_type: VILLA_TYPE_MAP[toStr(values.villa_type)] || 'Independent',
          villa_configuration: villaConfig,
          project_name: toStr(values.building_block) || 'N/A',
          plot_area_sqft: toStr(values.plot_area) || toStr(values.carpet_area) || 'N/A',
          number_of_bedrooms: toNum(values.villa_bedrooms) || 0,
          number_of_bathrooms: toNum(values.bathrooms) || 0,
          living_rooms_count: toNum(values.living_rooms_count) || 0,
          servant_room: values.villa_servant_room === 'Yes',
          balcony_or_sitout: values.balcony === 'Yes',
          private_garden: values.villa_private_garden === 'Yes' || values.villa_private_garden === true,
          terrace_access: values.villa_terrace === 'Yes' || values.villa_terrace === true,
          boundary_wall: values.villa_boundary_wall === 'Yes' || values.villa_boundary_wall === true,
          driveway: values.villa_driveway === 'Yes' || values.villa_driveway === true,
          private_parking: safeParking,
          swimming_pool: toStr(values.villa_swimming_pool) || 'No',
          villa_maintenance_charge_type: 'Monthly',
          gardening_charges: toStr(values.gardening_charges) || '0',
          water_supply_24x7: values.villa_24water ?? false,
          security_guard: values.villa_security ?? false,
          clubhouse_access: values.villa_clubhouse ?? false,
          gym: values.villa_gym ?? false,
          childrens_play_area: values.villa_play_area ?? false,
          internal_roads: values.villa_internal_roads ?? false,
          street_lights: values.villa_street_lights ?? false,
          gated_community: values.villa_gated ?? false,
          bachelor_allowed: values.tenant_Bachelor ?? false,
          pets_allowed: false,
          power_backup: values.villa_power_backup ?? false,
          cctv: values.villa_cctv ?? false,
          allowed_tenant_types: [
            values.tenant_Bachelor && 'Bachelor',
            values.tenant_Family && 'Family',
            values.tenant_CompanyStaff && 'Company Staff',
            values.tenant_Labour && 'Labour',
          ].filter(Boolean),
          store_room: values.store_room === 'Yes',
          maintenance_charge_amount: toStr(values.maintenance) || '0',
        };
      } else if (type === 'commercial') {
        payload.commercial_data = {
          commercial_category: toStr(values.commercial_category) || 'Shop',
          floor_number: toNum(values.floor_number),
          frontage_width_ft: toStr(values.frontage_width) || '0',
          ceiling_height_ft: toStr(values.ceiling_height) || '0',
          no_of_cabins: toNum(values.no_of_cabins) || 0,
          no_of_washrooms: toNum(values.no_of_washrooms) || 0,
          loading_area: toStr(values.loading_area) || 'Warehouse',
          power_load_kw: toStr(values.power_load_kw) || '0',
          has_dg_backup: values.dg_backup === 'Yes',
          lift_type: toStr(values.lift_type) || 'Passenger',
          fire_safety_compliant: values.fire_safety === 'Yes',
          emergency_exit: values.emergency_exit === 'Yes',
          parking_availability: toStr(values.parking_availability) || 'Open',
          commercial_maintenance_charge_type: 'Monthly',
          maintenance_charge_amount: toStr(values.maintenance) || '0',
          gst_applicable: values.gst_applicable === 'Yes',
          gst_percentage: toStr(values.gst_percentage) || '0',
          security_deposit_months: 0,
          lease_type: toStr(values.lease_type) || 'Company',
          lease_tenure_years: toNum(values.lease_tenure_years) || 0,
          lock_in_period_months: toNum(values.lock_in_period) || 0,
          allowed_business: toStr(values.allowed_business) || 'N/A',
          prohibited_business: toStr(values.prohibited_business) || 'N/A',
        };
      } else if (type === 'warehouse') {
        const safeLoadingArea = ['Warehouse','Godown'].includes(toStr(values.loading_area))
          ? toStr(values.loading_area) : 'Warehouse';
        payload.warehouse_data = {
          warehouse_category: toStr(values.commercial_category) || 'Godown',
          plot_area_sqft: toStr(values.plot_area) || '0',
          builtup_area_sqft: toStr(values.builtup_area) || '0',
          carpet_area_sqft: toStr(values.carpet_area) || '0',
          clear_height_ft: toStr(values.clear_height) || '0',
          no_of_bays: toNum(values.no_of_bays) || 0,
          loading_docks: toNum(values.loading_docks) || 0,
          dock_height_ft: toStr(values.dock_height) || '0',
          floor_load_mt: toStr(values.floor_load) || '0',
          column_spacing_ft: toStr(values.column_spacing) || '0',
          mezzanine_floor: values.mezzanine === 'Yes',
          office_space_area: toStr(values.office_space_area) || '0',
          loading_area: safeLoadingArea,
          power_load_kw: toStr(values.power_load_kw) || '0',
          transformer_available: values.transformer === 'Yes',
          has_dg_backup: values.dg_backup === 'Yes',
          water_supply_source: toStr(values.water_supply_source) || 'Borewell',
          drainage_system: values.drainage === 'Yes',
          internet_fiber: values.internet_fiber === 'Yes',
          entry_gate_width_ft: toStr(values.entry_gate_width) || '0',
          road_width_ft: toStr(values.road_width) || '0',
          truck_parking_capacity: toNum(values.truck_parking) || 0,
          container_access: toStr(values.container_access) || 'No',
          turning_radius: toStr(values.turning_radius) || 'Adequate',
          weighbridge_nearby: values.weighbridge === 'Yes',
          warehouse_maintenance_charge_type: 'Monthly',
          maintenance_charge_amount: toStr(values.maintenance) || '0',
          cam_charges: toStr(values.cam_charges) || '0',
          rent_escalation_percent: toStr(values.rent_escalation) || '0',
          lock_in_period_months: toNum(values.lock_in_period) || 0,
          security_deposit_months: 0,
          allowed_industry_types: [
            values.industry_FMCG && 'FMCG',
            values.industry_Pharma && 'Pharma',
            values.industry_Ecommerce && 'Ecommerce',
            values.industry_Manufacturing && 'Manufacturing',
            values.industry_Logistics && 'Logistics',
          ].filter(Boolean),
        };
      }

      if (Array.isArray(uploadedPhotos) && uploadedPhotos.length > 0) {
        const existingPhotos = uploadedPhotos.filter((p) => p.type === 'existing').map((p) => p.raw);
        const newBase64Photos = uploadedPhotos.filter((p) => p.type === 'new').map((p) => p.raw);
        const normalizedNew = normalizePhotosForApi(newBase64Photos);
        payload.photos = [...existingPhotos, ...normalizedNew];
      } else {
        payload.photos = [];
      }

      const sanitized = sanitizePayload(payload);
      console.log('=== FULL PAYLOAD ===');
      console.log(JSON.stringify(sanitized, null, 2));

      const config = {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, 'Content-Type': 'application/json' },
      };

      if (isUpdate && initialData?.propertyId) {
        const updatePayload = { property_id: initialData.propertyId, ...sanitized };
        await httpClient.put(`${API_BASE_URL}/property/update/`, updatePayload, config);
        alert('Property updated successfully.');
        navigate('/landlord/property-grid');
      } else {
        await httpClient.post(`${API_BASE_URL}/property/create/`, sanitized, config);
        alert('Property added successfully.');
        navigate('/landlord/property-grid');
      }
    } catch (e) {
      const res = e?.response?.data;
      console.error('Save failed:', e);
      let msg = 'Failed to save property. Please try again.';
      if (res) {
        if (typeof res.message === 'string' && res.message)    msg = res.message;
        else if (typeof res.detail === 'string' && res.detail) msg = res.detail;
        else if (typeof res.error === 'string' && res.error)   msg = res.error;
        else if (typeof res === 'object') {
          const lines = [];
          const flatten = (obj, prefix) => {
            for (const [k, v] of Object.entries(obj)) {
              const label = prefix ? `${prefix} > ${k}` : k;
              if (Array.isArray(v)) lines.push(`${label}: ${v.join(', ')}`);
              else if (v && typeof v === 'object') flatten(v, label);
              else if (v != null) lines.push(`${label}: ${v}`);
            }
          };
          flatten(res, '');
          if (lines.length) msg = lines.join('\n');
        }
      } else if (e?.message) msg = e.message;
      if (typeof msg === 'string' && msg.includes('varying(100)'))
        msg = 'Photo data is too long for the database.';
      alert(msg);
    }
  });

  const Select = ({ name, children, ...rest }) => (
    <Controller name={name} control={control} render={({ field }) => (
      <div style={{ position: 'relative' }}>
        <select className="form-control" style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem' }} {...rest} {...field}>
          {children}
        </select>
        <span style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c757d' }}>
          <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18} />
        </span>
      </div>
    )} />
  );

  const DatePickerField = ({ name, label, placeholderText = 'DD-MM-YYYY' }) => (
    <Controller name={name} control={control} render={({ field }) => (
      <div>
        {label && <label className="form-label">{label}</label>}
        <div style={{ position: 'relative' }}>
          <DatePicker
            selected={field.value instanceof Date && isValid(field.value) ? field.value : null}
            onChange={(date) => field.onChange(date)}
            dateFormat="dd-MM-yyyy" placeholderText={placeholderText}
            className="form-control" wrapperClassName="w-100"
            style={{ ...inputStyle, width: '100%' }} autoComplete="off"
            showYearDropdown showMonthDropdown dropdownMode="select" isClearable
          />
          <span style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c757d' }}>
            <IconifyIcon icon="ri:calendar-line" width={18} height={18} />
          </span>
        </div>
      </div>
    )} />
  );

  return (
    <form id="property-add-form" onSubmit={onSubmit} className="property-add-input-bg">

      {/* ===== BASIC DETAILS ===== */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">
            {propertyType === 'flat' && 'Basic Property Details'}
            {propertyType === 'villa' && 'Basic Villa Details'}
            {propertyType === 'commercial' && 'Basic Commercial Details'}
            {propertyType === 'warehouse' && 'Basic Warehouse Details'}
          </h4>
          <hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label">Select Property Type</label>
              <Controller name="property_type" control={control} render={({ field }) => (
                <div style={{ position: 'relative' }}>
                  <select className="form-control" style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem' }} {...field}>
                    <option value="flat">Flat / Apartment</option>
                    <option value="villa">Villa / Bungalow</option>
                    <option value="commercial">Commercial</option>
                    <option value="warehouse">Warehouse</option>
                  </select>
                  <span style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c757d' }}>
                    <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18} />
                  </span>
                </div>
              )} />
            </Col>

            {propertyType === 'flat' && (<>
              <Col lg={4}><TextFormInput control={control} name="property_code" label="Property Code / ID" placeholder="Auto-Generated" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="building_name" label="Building Name" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="building_block" label="Building Block" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="floor_number" label="Floor Number" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="flat_no" label="Flat No / Name" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="total_floors" label="Total Floors (Optional)" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="year_of_construction" label="Year of Construction" style={inputStyle} type="number" /></Col>
            </>)}

            {propertyType === 'villa' && (<>
              <Col lg={4}><TextFormInput control={control} name="property_code" label="Property Code / ID" placeholder="Auto-Generated" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="building_name" label="Villa Name / Number" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="building_block" label="Project / Society Name" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="floor_number" label="Unit Number (Gated)" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="flat_no" label="Total Floors" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="total_floors" label="Year of Construction" style={inputStyle} type="number" /></Col>
            </>)}

            {propertyType === 'commercial' && (<>
              <Col lg={4}><TextFormInput control={control} name="property_code" label="Property Code / ID" placeholder="Auto-Generated" style={inputStyle} /></Col>
              <Col lg={4}>
                <label className="form-label">Commercial Category</label>
                <Select name="commercial_category">
                  <option value="Shop">Shop</option><option value="Office">Office</option>
                  <option value="Showroom">Showroom</option><option value="Godown">Godown</option>
                  <option value="Industrial Unit">Industrial Unit</option>
                </Select>
              </Col>
              <Col lg={4}><TextFormInput control={control} name="building_name" label="Building / Complex Name" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="flat_no" label="Unit / Shop / Office No." style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="floor_number" label="Floor Number" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="total_floors" label="Year of Construction" style={inputStyle} type="number" /></Col>
            </>)}

            {propertyType === 'warehouse' && (<>
              <Col lg={4}><TextFormInput control={control} name="property_code" label="Property Code / ID" placeholder="Auto-Generated" style={inputStyle} /></Col>
              <Col lg={4}>
                <label className="form-label">Warehouse Category</label>
                <Select name="commercial_category">
                <option value="Shop">Shop</option><option value="Office">Office</option>
                  <option value="Showroom">Showroom</option><option value="Godown">Godown</option>
                  <option value="Industrial Unit">Industrial Unit</option>
                </Select>
              </Col>
              <Col lg={4}><TextFormInput control={control} name="building_block" label="Warehouse Name / Code" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="floor_number" label="Industrial Estate / MIDC" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="flat_no" label="Plot / Shed Number" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="total_floors" label="Year of Construction" style={inputStyle} type="number" /></Col>
            </>)}
          </Row>
        </CardBody>
      </Card>

      {/* ===== CONFIGURATION ===== */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">
            {propertyType === 'flat' && 'Flat Configuration'}
            {propertyType === 'villa' && 'Villa Configuration'}
            {propertyType === 'commercial' && 'Area & Layout Details'}
            {propertyType === 'warehouse' && 'Area & Structural Details'}
          </h4>
          <hr />
          <Row className="g-3">
            {propertyType === 'flat' && (<>
              <Col lg={4}>
                <label className="form-label">BHK Configuration</label>
                <Select name="configuration">
                  <option value="Studio">Studio</option><option value="1BHK">1 BHK</option>
                  <option value="2BHK">2 BHK</option><option value="3BHK">3 BHK</option>
                  <option value="4BHK">4 BHK</option>
                </Select>
              </Col>
              <Col lg={4}><TextFormInput control={control} name="carpet_area" label="Carpet Area (Sq.Ft)" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="builtup_area" label="Built-up Area (Sq.Ft)" style={inputStyle} type="number" /></Col>
              <Col lg={4}><label className="form-label">Balcony</label><Select name="balcony"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><TextFormInput control={control} name="bathrooms" label="No. of Bathrooms" style={inputStyle} type="number" /></Col>
              <Col lg={4}><label className="form-label">Kitchen Type</label><Select name="kitchen_type"><option value="Open">Open</option><option value="Closed">Closed</option></Select></Col>
              <Col lg={4}><label className="form-label">Store Room</label><Select name="store_room"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Facing</label><Select name="facing"><option value="East">East</option><option value="West">West</option><option value="North">North</option><option value="South">South</option></Select></Col>
            </>)}

            {propertyType === 'villa' && (<>
              <Col lg={4}><label className="form-label">Villa Type</label><Select name="villa_type"><option value="Independent">Independent</option><option value="Duplex">Duplex</option><option value="Triplex">Triplex</option></Select></Col>
              <Col lg={4}><label className="form-label">BHK Configuration</label><Select name="villa_configuration"><option value="2BHK">2 BHK</option><option value="3BHK">3 BHK</option><option value="4BHK">4 BHK</option><option value="5BHK">5 BHK</option></Select></Col>
              <Col lg={4}><TextFormInput control={control} name="carpet_area" label="Carpet Area (Sq.Ft)" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="builtup_area" label="Built-up Area (Sq.Ft)" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="plot_area" label="Plot Area (Sq.Ft)" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="villa_bedrooms" label="No. of Bedrooms" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="bathrooms" label="No. of Bathrooms" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="living_rooms_count" label="Living Rooms Count" style={inputStyle} /></Col>
              <Col lg={4}><label className="form-label">Kitchen Type</label><Select name="kitchen_type"><option value="Open">Open</option><option value="Closed">Closed</option></Select></Col>
              <Col lg={4}><label className="form-label">Store Room</label><Select name="store_room"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Servant Room</label><Select name="villa_servant_room"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Balcony / Sit-out</label><Select name="balcony"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Facing</label><Select name="facing"><option value="East">East</option><option value="West">West</option><option value="North">North</option><option value="South">South</option></Select></Col>
            </>)}

            {propertyType === 'commercial' && (<>
              <Col lg={4}><TextFormInput control={control} name="carpet_area" label="Carpet Area (Sq.Ft)" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="builtup_area" label="Built-up Area (Sq.Ft)" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="frontage_width" label="Frontage Width (Feet)" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="ceiling_height" label="Ceiling Height (Feet)" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="no_of_cabins" label="No. of Cabins" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="no_of_washrooms" label="No. of Washrooms" style={inputStyle} /></Col>
              <Col lg={4}><label className="form-label">Store Room</label><Select name="store_room"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Loading Area</label><Select name="loading_area"><option value="Warehouse">Warehouse</option><option value="Godown">Godown</option></Select></Col>
            </>)}

            {propertyType === 'warehouse' && (<>
              <Col lg={4}><TextFormInput control={control} name="plot_area" label="Plot Area (Sq.Ft)" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="builtup_area" label="Built-up Area (Sq.Ft)" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="carpet_area" label="Carpet Area (Sq.Ft)" style={inputStyle} type="number" /></Col>
              <Col lg={4}><TextFormInput control={control} name="clear_height" label="Clear Height (Feet)" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="no_of_bays" label="No. of Bays" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="loading_docks" label="No. of Loading Docks" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="dock_height" label="Dock Height (Feet)" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="floor_load" label="Floor Load (MT/Sq.Ft)" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="column_spacing" label="Column Spacing (Feet)" style={inputStyle} /></Col>
              <Col lg={4}><label className="form-label">Mezzanine Floor</label><Select name="mezzanine"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><TextFormInput control={control} name="office_space_area" label="Office Space Area" style={inputStyle} /></Col>
              <Col lg={4}><label className="form-label">Loading Area</label><Select name="loading_area"><option value="Warehouse">Warehouse</option><option value="Godown">Godown</option></Select></Col>
            </>)}
          </Row>
        </CardBody>
      </Card>

      {/* ===== VILLA OUTDOOR ===== */}
      {propertyType === 'villa' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Outdoor & Exclusive Features</h4><hr />
            <Row className="g-3">
              <Col lg={4}><label className="form-label">Private Garden / Lawn</label><Select name="villa_private_garden"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Private Parking</label><Select name="villa_private_parking"><option value="Open">Open</option><option value="Covered">Covered</option><option value="Both">Both</option></Select></Col>
              <Col lg={4}><label className="form-label">Swimming Pool</label><Select name="villa_swimming_pool"><option value="No">No</option><option value="Private">Private</option><option value="Common">Common</option></Select></Col>
              <Col lg={4}><label className="form-label">Terrace / Rooftop Access</label><Select name="villa_terrace"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Boundary Wall</label><Select name="villa_boundary_wall"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Driveway</label><Select name="villa_driveway"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {/* ===== COMMERCIAL INFRASTRUCTURE ===== */}
      {propertyType === 'commercial' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Commercial Infrastructure</h4><hr />
            <Row className="g-3">
              <Col lg={4}><TextFormInput control={control} name="power_load_kw" label="Power Load (KW)" style={inputStyle} /></Col>
              <Col lg={4}><label className="form-label">DG / Power Backup</label><Select name="dg_backup"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Lift Type</label><Select name="lift_type"><option value="Passenger">Passenger</option><option value="Goods">Goods</option><option value="Both">Both</option></Select></Col>
              <Col lg={4}><label className="form-label">Fire Safety Compliant</label><Select name="fire_safety"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Emergency Exit</label><Select name="emergency_exit"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Parking Availability</label><Select name="parking_availability"><option value="Open">Open</option><option value="Closed">Closed</option><option value="Both">Both</option></Select></Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {/* ===== WAREHOUSE INFRASTRUCTURE ===== */}
      {propertyType === 'warehouse' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Infrastructure & Utilities</h4><hr />
            <Row className="g-3">
              <Col lg={4}><TextFormInput control={control} name="power_load_kw" label="Power Supply (KW)" style={inputStyle} /></Col>
              <Col lg={4}><label className="form-label">Transformer Available</label><Select name="transformer"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">DG Set / Backup</label><Select name="dg_backup"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Water Supply Source</label><Select name="water_supply_source"><option value="Borewell">Borewell</option><option value="Municipal">Municipal</option><option value="Tanker">Tanker</option></Select></Col>
              <Col lg={4}><label className="form-label">Drainage System</label><Select name="drainage"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Internet / Fiber</label><Select name="internet_fiber"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {/* ===== WAREHOUSE LOGISTICS ===== */}
      {propertyType === 'warehouse' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Logistics & Vehicle Access</h4><hr />
            <Row className="g-3">
              <Col lg={4}><TextFormInput control={control} name="entry_gate_width" label="Entry Gate Width (Ft)" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="road_width" label="Road Width (Ft)" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="truck_parking" label="Truck Parking Capacity" style={inputStyle} /></Col>
              <Col lg={4}><label className="form-label">Container Access</label><Select name="container_access"><option value="20ft">20ft</option><option value="40ft">40ft</option><option value="No">No</option></Select></Col>
              <Col lg={4}><label className="form-label">Turning Radius</label><Select name="turning_radius"><option value="Adequate">Adequate</option><option value="Limited">Limited</option></Select></Col>
              <Col lg={4}><label className="form-label">Weighbridge Nearby</label><Select name="weighbridge"><option value="Yes">Yes</option><option value="No">No</option></Select></Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {/* ===== RENTAL & FINANCIAL ===== */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">{propertyType === 'warehouse' ? 'Rental & Financial Terms' : 'Rental & Financial Details'}</h4><hr />
          <Row className="g-3">
            <Col lg={4}><TextFormInput control={control} name="monthly_rent" label="Monthly Rent (OMR)" style={inputStyle} type="number" /></Col>
            <Col lg={4}><TextFormInput control={control} name="security_deposit" label="Security Deposit (OMR)" style={inputStyle} type="number" /></Col>
            <Col lg={4}><TextFormInput control={control} name="maintenance" label={propertyType === 'commercial' || propertyType === 'warehouse' ? 'Maintenance Charges (OMR)' : 'Maintenance (OMR/Month)'} style={inputStyle} type="number" /></Col>
            <Col lg={12}>
              <Row className="g-3 align-items-end">
                <Col lg={4}><TextFormInput control={control} name="other_charges" label="Other Charges" style={inputStyle} /></Col>
                <Col lg={4}>
                  <label className="form-label">Late Fee Applicable</label>
                  <Controller name="late_fee_type" control={control} render={({ field }) => (
                    <div style={{ position: 'relative' }}>
                      <select className="form-control" style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem' }} {...field}>
                        <option value="">Select Type</option>
                        <option value="Day wise">Day wise</option>
                        <option value="Month wise">Month wise</option>
                      </select>
                      <span style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c757d' }}>
                        <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18} />
                      </span>
                    </div>
                  )} />
                </Col>
                <Col lg={4}><TextFormInput control={control} name="late_fee_value" label="Late Fee Value" style={inputStyle} type="number" /></Col>
              </Row>
            </Col>
            {propertyType === 'villa' && <Col lg={4}><TextFormInput control={control} name="gardening_charges" label="Gardening Charges" style={inputStyle} /></Col>}
            {propertyType === 'commercial' && (<>
              <Col lg={4}><label className="form-label">GST Applicable</label><Select name="gst_applicable"><option value="No">No</option><option value="Yes">Yes</option></Select></Col>
              {watched.gst_applicable === 'Yes' && <Col lg={4}><TextFormInput control={control} name="gst_percentage" label="GST %" style={inputStyle} /></Col>}
            </>)}
            {propertyType === 'warehouse' && (<>
              <Col lg={4}><TextFormInput control={control} name="cam_charges" label="CAM Charges" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="rent_escalation" label="Rent Escalation %/Year" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="lock_in_period" label="Lock-in Period (Months)" style={inputStyle} /></Col>
            </>)}
          </Row>
        </CardBody>
      </Card>

      {/* ===== WAREHOUSE TENANT USAGE ===== */}
      {propertyType === 'warehouse' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Tenant & Usage Preference</h4><hr />
            <label className="form-label">Allowed Industry Type</label>
            <Row className="g-3 mt-1">
              {['FMCG','Pharma','Ecommerce','Manufacturing','Logistics'].map((t) => (
                <Col lg={3} key={t}>
                  <Controller name={`industry_${t}`} control={control} defaultValue={false} render={({ field }) => (
                    <Form.Check type="checkbox" label={t} checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  )} />
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>
      )}

      {/* ===== OWNERSHIP ===== */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Ownership</h4><hr />
          <Row>
            <Col lg={4} md={6}>
              <label className="form-label">Landlord</label>
              <Controller name="landlord_id" control={control} render={({ field }) => (
                <div style={{ position: 'relative' }}>
                  <select className="form-control" style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem' }}
                    {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} disabled={landlordsLoading}>
                    <option value="">{landlordsLoading ? 'Loading landlords…' : '— Select Landlord —'}</option>
                    {landlords.map((lead) => (
                      <option key={lead.leadId} value={String(lead.leadId)}>
                        {[lead.firstName, lead.lastName].filter(Boolean).join(' ')}{lead.city ? ` — ${lead.city}` : ''}
                      </option>
                    ))}
                  </select>
                  <span style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c757d' }}>
                    <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18} />
                  </span>
                </div>
              )} />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* ===== FLAT AMENITIES ===== */}
      {propertyType === 'flat' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Facilities & Amenities</h4><hr />
            <Row className="g-3">
              {[
                { key: 'amenity_Parking', label: 'Parking' }, { key: 'amenity_Lift', label: 'Lift' },
                { key: 'amenity_PowerBackup', label: 'Power Backup' }, { key: 'amenity_Security', label: 'Security' },
                { key: 'amenity_CCTV', label: 'CCTV' }, { key: 'amenity_GasPipeline', label: 'Gas Pipeline' },
                { key: 'amenity_WaterSupply', label: 'Water Supply' }, { key: 'amenity_Intercom', label: 'Intercom' },
                { key: 'amenity_FireSafety', label: 'Fire Safety' },
              ].map(({ key, label }) => (
                <Col lg={3} key={key}>
                  <Controller name={key} control={control} defaultValue={false} render={({ field }) => (
                    <Form.Check type="checkbox" label={label} checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  )} />
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>
      )}

      {/* ===== VILLA FACILITIES ===== */}
      {propertyType === 'villa' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Facilities (Villa)</h4><hr />
            <Row className="g-3">
              {[
                { key: 'villa_24water', label: '24x7 Water Supply' }, { key: 'villa_power_backup', label: 'Power Backup' },
                { key: 'villa_security', label: 'Security / Guard' }, { key: 'villa_cctv', label: 'CCTV' },
                { key: 'villa_clubhouse', label: 'Clubhouse Access' }, { key: 'villa_gym', label: 'Gym' },
                { key: 'villa_play_area', label: "Children's Play Area" }, { key: 'villa_internal_roads', label: 'Internal Roads' },
                { key: 'villa_street_lights', label: 'Street Lights' }, { key: 'villa_gated', label: 'Gated Community' },
              ].map(({ key, label }) => (
                <Col lg={3} key={key}>
                  <Controller name={key} control={control} defaultValue={false} render={({ field }) => (
                    <Form.Check type="checkbox" label={label} checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  )} />
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>
      )}

      {/* ===== TENANT PREFERENCE (Flat & Villa) ===== */}
      {(propertyType === 'flat' || propertyType === 'villa') && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Tenant Preference</h4><hr />
            <label className="form-label">Rental Purpose</label>
            <Controller name="rental_purpose" control={control} render={({ field }) => (
              <div style={{ position: 'relative' }} className="mb-3">
                <select className="form-control" style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem' }} {...field}>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <span style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c757d' }}>
                  <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18} />
                </span>
              </div>
            )} />
            <label className="form-label">Tenant Type Allowed</label>
            <div className="p-3 rounded" style={{ backgroundColor: '#F9F9FC', border: '1px solid #e6e8ee' }}>
              <Row className="gx-4 gy-3">
                {[
                  { name: 'tenant_Bachelor', label: 'Bachelor' }, { name: 'tenant_Family', label: 'Family' },
                  { name: 'tenant_CompanyStaff', label: 'Company Staff' }, { name: 'tenant_Labour', label: 'Labour' },
                ].map(({ name, label }) => (
                  <Col lg={3} md={6} key={name}>
                    <Controller name={name} control={control} defaultValue={false} render={({ field }) => (
                      <Form.Check type="checkbox" label={label} checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
                    )} />
                  </Col>
                ))}
              </Row>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ===== COMMERCIAL BUSINESS & TENANT ===== */}
      {propertyType === 'commercial' && (
        <Card className="mb-4">
          <CardBody>
            <h4 className="fw-semibold">Business & Tenant Preference</h4><hr />
            <Row className="g-3">
              <Col lg={4}><TextFormInput control={control} name="allowed_business" label="Allowed Business Type" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="prohibited_business" label="Prohibited Business" style={inputStyle} /></Col>
              <Col lg={4}><label className="form-label">Lease Type</label><Select name="lease_type"><option value="Company">Company Lease</option><option value="Individual">Individual Lease</option></Select></Col>
              <Col lg={4}><TextFormInput control={control} name="lease_tenure_years" label="Lease Tenure (Years)" style={inputStyle} /></Col>
              <Col lg={4}><TextFormInput control={control} name="lock_in_period" label="Lock-in Period (Months)" style={inputStyle} /></Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {/* ===== AVAILABILITY & STATUS ===== */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Availability & Status</h4><hr />
          <Row className="g-3">
            <Col lg={4}>
              <label className="form-label">Status</label>
              <Select name="status">
                <option value="Vacant">Vacant</option><option value="Booked">Booked</option>
                <option value="Occupied">Occupied</option><option value="Under Maintenance">Under Maintenance</option>
              </Select>
            </Col>
            <Col lg={4}><DatePickerField name="available_from" label="Available From" /></Col>
            <Col lg={4}><TextFormInput control={control} name="current_tenant" label="Current Tenant ID" style={inputStyle} /></Col>
          </Row>
        </CardBody>
      </Card>

      {/* ===== LOCATION DETAILS ===== */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Location Details</h4><hr />
          <div className="mb-3"><TextFormInput control={control} name="address1" label="Address Line 1" style={inputStyle} /></div>
          <TextFormInput control={control} name="address2" label="Address Line 2" style={inputStyle} />
          <Row className="g-3 mt-1">
            <Col lg={4}><TextFormInput control={control} name="area" label="Area / Locality" style={inputStyle} /></Col>
            <Col lg={4}><TextFormInput control={control} name="city" label="City" style={inputStyle} /></Col>
            <Col lg={4}><TextFormInput control={control} name="state" label="State" style={inputStyle} /></Col>
            <Col lg={4}>
              <label className="form-label">Country</label>
              <Controller name="country" control={control} render={({ field }) => (
                <div style={{ position: 'relative' }}>
                  <select className="form-control" style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem' }}
                    {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} disabled={countriesLoading}>
                    <option value="">{countriesLoading ? 'Loading countries…' : '— Select Country —'}</option>
                    {countries.map((c) => (<option key={c.countryId} value={c.name}>{c.name}</option>))}
                  </select>
                  <span style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c757d' }}>
                    <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18} />
                  </span>
                </div>
              )} />
            </Col>
            <Col lg={4}><TextFormInput control={control} name="po_box" label="PO BOX" style={inputStyle} /></Col>
            <Col lg={4}><TextFormInput control={control} name="map_url" label="Google Map URL" style={inputStyle} /></Col>
          </Row>
        </CardBody>
      </Card>

      {/* ===== INTERNAL TRACKING ===== */}
      <Card className="mb-4">
        <CardBody>
          <h4 className="fw-semibold">Internal Tracking</h4><hr />
          <TextAreaFormInput control={control} name="internal_notes" label="Internal Notes" style={inputStyle} />
          <TextFormInput control={control} name="created_by" label="Created By" style={inputStyle} />
        </CardBody>
      </Card>

      {/* ===== BUTTONS ===== */}
      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button variant="outline-primary" type="button" className="w-100" style={{ padding: '10px' }} onClick={() => window.history.back()}>
              Cancel
            </Button>
          </Col>
          <Col lg={2}>
            <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: '#5D7186', borderColor: '#5D7186', padding: '10px' }}>
              {isUpdate ? 'Update Property' : 'Add Property'}
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default PropertyAdd;