import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/helpers/api';

// form select for flat_configuration uses spaced labels ("1 BHK"), API stores compact ("1BHK")
const REVERSE_FLAT_CONFIG = {
  Studio: 'Studio',
  '1BHK': '1 BHK',
  '2BHK': '2 BHK',
  '3BHK': '3 BHK',
  '4BHK': '4 BHK',
};

const clean = (v) => (v == null || v === '-' || v === 'N/A' ? '' : v);

const toTenantTypeFlags = (list) => {
  const flags = {};
  (Array.isArray(list) ? list : []).forEach((t) => { flags[`tenant_type_${t}`] = true; });
  return flags;
};

const toIndustryTypeFlags = (list) => {
  const flags = {};
  (Array.isArray(list) ? list : []).forEach((t) => { flags[`industry_type_${t}`] = true; });
  return flags;
};

// Reverses the field mapping PropertyAdd's onSubmit builds, so editing an
// existing property doesn't silently blank/overwrite fields it doesn't show.
const mapPropertyToFormValues = (property) => {
  const pd = property.propertyDetails || {};
  const fd = property.flatData || {};
  const vd = property.villaData || {};
  const cd = property.commercialData || {};
  const wd = property.warehouseData || {};

  const rentalType = (property.rentalType || '').toLowerCase();
  const propertyType = ['flat', 'villa', 'commercial', 'warehouse'].includes(rentalType) ? rentalType : 'flat';

  const values = {
    propertyId: property.propertyId,
    property_type: propertyType,
    property_code: property.propertyId != null ? String(property.propertyId) : '',
    building_name: clean(pd.buildingName) || clean(vd.villaName) || clean(property.buildingDetails),
    building_block: clean(property.block) || clean(fd.buildingBlock) || clean(wd.warehouseName),
    floor_number: clean(fd.floorNumber) || clean(cd.floorNumber) || clean(wd.industrialEstateName) || clean(property.floor),
    flat_no: clean(fd.flatNumber) || clean(wd.plotShedNumber) || clean(property.flatNumber),
    total_floors: clean(pd.totalFloors),
    carpet_area: clean(pd.carpetAreaSqft) || clean(property.dimensionAreaSqft),
    builtup_area: clean(pd.builtupAreaSqft),
    monthly_rent: clean(pd.monthlyRent) || clean(property.expectedRent),
    security_deposit: clean(pd.securityDepositAmount),
    status: clean(pd.currentStatus) || 'Vacant',
    landlord_id: pd.landlordId != null ? String(pd.landlordId) : '',
    assigned_to_user_id:
      property.assignedTo?.userId != null
        ? String(property.assignedTo.userId)
        : pd.createdById != null
          ? String(pd.createdById)
          : '',
    address1: clean(pd.addressLine1),
    address2: clean(pd.addressLine2),
    area: clean(pd.areaZone),
    city: clean(pd.city),
    state: clean(pd.state),
    country: clean(pd.country) || 'Oman',
    po_box: clean(pd.pincode),
    map_url: clean(pd.googleMapLocation),
    available_from: pd.availableFrom ? new Date(pd.availableFrom) : null,
    internal_notes: clean(pd.internalNotes),
    late_fee_type: clean(pd.lateFeeType),
    late_fee_value: clean(pd.lateFeeValue),
    electricity_charge_type: clean(pd.electricityChargeType) || 'Meter',
    water_charge_type: clean(pd.waterChargeType) || 'Meter',
    rental_purpose: property.rentalFor === 'Commercial' ? 'Commercial' : 'Residential',
    maintenance:
      clean(fd.maintenanceChargeAmount) ||
      clean(vd.maintenanceChargeAmount) ||
      clean(cd.maintenanceChargeAmount) ||
      clean(wd.maintenanceCharges),
  };

  if (propertyType === 'flat') {
    Object.assign(values, {
      flat_configuration: REVERSE_FLAT_CONFIG[fd.flatConfiguration] || fd.flatConfiguration || '1 BHK',
      bathrooms: clean(fd.noOfBathrooms),
      kitchen_type: clean(fd.kitchenType) || 'Open',
      facing: clean(fd.facing) || 'East',
      balcony: fd.balcony ? 'Yes' : 'No',
      store_room: !!fd.storeRoom,
      amenity_Parking: !!fd.parking,
      amenity_Lift: !!fd.lift,
      amenity_PowerBackup: !!fd.powerBackup,
      amenity_Security: !!fd.security,
      amenity_CCTV: !!fd.cctv,
      amenity_GasPipeline: !!fd.gasPipeline,
      amenity_WaterSupply: !!fd.waterSupply,
      amenity_Intercom: !!fd.intercom,
      amenity_FireSafety: !!fd.fireSafety,
      other_charges: clean(pd.otherCharges),
      ...toTenantTypeFlags(fd.allowedTenantTypes),
    });
  } else if (propertyType === 'villa') {
    Object.assign(values, {
      villa_type: clean(vd.villaType) || 'Independent',
      villa_configuration: clean(vd.villaConfiguration) || '2BHK',
      plot_area: clean(vd.plotAreaSqft),
      villa_bedrooms: clean(vd.numberOfBedrooms),
      villa_bathrooms: clean(vd.numberOfBathrooms),
      villa_living_rooms: clean(vd.livingRoomsCount),
      villa_store_room: !!vd.storeRoom,
      villa_servant_room: !!vd.servantRoom,
      villa_balcony_or_sitout: !!vd.balconyOrSitout,
      villa_facing: clean(vd.facing) || 'East',
      villa_private_garden: !!vd.privateGarden,
      villa_terrace_access: !!vd.terraceAccess,
      villa_boundary_wall: !!vd.boundaryWall,
      villa_driveway: !!vd.driveway,
      villa_private_parking: clean(vd.privateParking),
      villa_water_supply_24x7: !!vd.waterSupply24x7,
      villa_power_backup: !!vd.powerBackup,
      villa_security_guard: !!vd.securityGuard,
      villa_cctv: !!vd.cctv,
      villa_clubhouse_access: !!vd.clubhouseAccess,
      villa_gym: !!vd.gym,
      villa_childrens_play_area: !!vd.childrensPlayArea,
      villa_internal_roads: !!vd.internalRoads,
      villa_street_lights: !!vd.streetLights,
      villa_gated_community: !!vd.gatedCommunity,
      villa_gardening_charges: clean(vd.gardeningCharges),
      villa_other_charges: clean(pd.otherCharges),
      ...toTenantTypeFlags(vd.allowedTenantTypes),
    });
  } else if (propertyType === 'commercial') {
    Object.assign(values, {
      commercial_category: clean(cd.commercialCategory) || 'Shop',
      commercial_frontage_width: clean(cd.frontageWidthFt),
      commercial_ceiling_height: clean(cd.ceilingHeightFt),
      commercial_no_of_cabins: clean(cd.noOfCabins),
      commercial_no_of_washrooms: clean(cd.noOfWashrooms),
      commercial_gst_percentage: clean(cd.gstPercentage),
      commercial_lease_tenure_year: clean(cd.leaseTenureYears),
      commercial_lock_in_period: clean(cd.lockInPeriodMonths),
      commercial_power_load: clean(cd.powerLoadKw),
      commercial_dg_backup: !!cd.hasDgBackup,
      commercial_lift_type: clean(cd.liftType),
      commercial_fire_safety_compliant: !!cd.fireSafetyCompliant,
      commercial_emergency_exit: !!cd.emergencyExit,
      commercial_parking_availability: clean(cd.parkingAvailability),
      commercial_cctv: !!cd.cctv,
      commercial_gst_applicable: !!cd.gstApplicable,
      commercial_allowed_business_type: clean(cd.allowedBusiness),
      commercial_prohibited_business: clean(cd.prohibitedBusiness),
      commercial_super_builtup_area: clean(cd.superBuiltupAreaSqft),
      commercial_other_charges: clean(pd.otherCharges),
      loading_area: clean(cd.loadingArea) || 'Warehouse',
    });
  } else if (propertyType === 'warehouse') {
    Object.assign(values, {
      warehouse_category: clean(wd.warehouseCategory) || 'Industrial Warehouse',
      loading_area: clean(wd.loadingArea) || 'Warehouse',
      warehouse_plot_area: clean(wd.plotAreaSqft),
      warehouse_clear_height: clean(wd.clearHeightFt),
      warehouse_no_of_bays: clean(wd.noOfBays),
      warehouse_no_of_loading_docks: clean(wd.noOfLoadingDocks),
      warehouse_dock_height: clean(wd.dockHeightFt),
      warehouse_floor_load: clean(wd.floorLoadCapacityMtSqft),
      warehouse_column_spacing: clean(wd.columnSpacingFt),
      warehouse_office_space_area: clean(wd.officeSpaceAreaSqft),
      warehouse_cam_charges: clean(wd.camCharges),
      warehouse_rent_escalation: clean(wd.rentEscalationPercentage),
      warehouse_lock_in_period: clean(wd.lockInPeriodMonths),
      warehouse_mezzanine_floor: !!wd.hasMezzanineFloor,
      warehouse_power_supply: clean(wd.powerLoadKw),
      warehouse_transformer: !!wd.hasTransformer,
      warehouse_dg_backup: !!wd.hasDgBackup,
      warehouse_water_supply_source: clean(wd.waterSupplySource),
      warehouse_drainage_system: !!wd.hasDrainageSystem,
      warehouse_internet_fiber: !!wd.hasInternetFiber,
      warehouse_entry_gate_width: clean(wd.entryGateWidthFt),
      warehouse_road_width: clean(wd.roadWidthFt),
      warehouse_truck_parking_capacity: clean(wd.truckParkingCapacity),
      warehouse_container_access: clean(wd.containerAccess),
      warehouse_turning_radius: clean(wd.turningRadius),
      warehouse_weighbridge_nearby: !!wd.hasWeighbridgeNearby,
      warehouse_monthly_rent_type: clean(wd.monthlyRentType) || 'Lump Sum',
      warehouse_other_charges: clean(pd.otherCharges),
      ...toIndustryTypeFlags(wd.allowedIndustryTypes),
    });
  }

  return values;
};

export const usePropertyAddController = () => {
  const [searchParams] = useSearchParams();
  const propertyId = useMemo(() => {
    const raw = searchParams.get('property_id');
    return raw ? Number(raw) : null;
  }, [searchParams]);

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!propertyId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!propertyId) {
      setInitialData(null);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/property/get/?property_id=${propertyId}`);
        const payload = res.data;
        let found = null;

        if (payload?.data?.propertyId) {
          found = payload.data;
        } else if (Array.isArray(payload?.data?.data)) {
          found = payload.data.data.find((p) => p.propertyId === propertyId) ?? null;
        } else if (Array.isArray(payload?.data)) {
          found = payload.data.find((p) => p.propertyId === propertyId) ?? null;
        }

        if (!found) throw new Error('not_found');
        if (!cancelled) setInitialData(mapPropertyToFormValues(found));
      } catch {
        try {
          const allRes = await api.get('/property/get_all/', { params: { limit: 999999 } });
          const list = allRes.data?.data?.data ?? allRes.data?.data ?? [];
          const found = list.find((p) => p.propertyId === propertyId) ?? null;
          if (!found) {
            if (!cancelled) setError(`Property #${propertyId} not found.`);
            return;
          }
          if (!cancelled) setInitialData(mapPropertyToFormValues(found));
        } catch (e2) {
          if (!cancelled) setError(e2?.response?.data?.message || e2?.message || 'Failed to load property');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  return {
    mode: propertyId ? 'update' : 'create',
    initialData,
    loading,
    error,
  };
};
