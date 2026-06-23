import TextAreaFormInput from '@/components/from/TextAreaFormInput';
import TextFormInput from '@/components/from/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ReactSelect from 'react-select';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import httpClient from '@/helpers/httpClient';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const IMAGE_BASE_URL = 'https://alw.checkour.work/media/';

const ChoicesFormInput = (props) => <select {...props} />;

// ════════════════════════════════════════════════════════════════════════════
// IMAGE COMPRESSION UTILITY
// ════════════════════════════════════════════════════════════════════════════
const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        canvas.toBlob(
          (blob) => {
            const compressedReader = new FileReader();
            compressedReader.readAsDataURL(blob);
            compressedReader.onloadend = () => {
              const base64String = compressedReader.result;
              // Extract just the base64 part (without data:image/jpeg;base64,)
              const base64Data = base64String.split(',')[1];
              
              console.log('📸 Image compressed:', {
                originalSize: `${(file.size / 1024).toFixed(2)} KB`,
                compressedSize: `${(blob.size / 1024).toFixed(2)} KB`,
                dimensions: `${width}x${height}`,
                base64Length: base64Data.length
              });

              resolve({
                preview: base64String, 
                base64: base64Data,    
                size: blob.size
              });
            };
            compressedReader.onerror = reject;
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

// Rest of your constants remain the same...
const fallbackCountryOptions = [
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'KW', label: 'Kuwait' },
  { value: 'QA', label: 'Qatar' },
  { value: 'BH', label: 'Bahrain' },
  { value: 'JO', label: 'Jordan' },
  { value: 'EG', label: 'Egypt' },
  { value: 'IN', label: 'India' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'PH', label: 'Philippines' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
];

const countryPhoneCodes = [
  { value: '+968', label: 'Oman (+968)', isoCode: 'om', flag: '🇴🇲' },
  { value: '+971', label: 'UAE (+971)', isoCode: 'ae', flag: '🇦🇪' },
  { value: '+966', label: 'Saudi Arabia (+966)', isoCode: 'sa', flag: '🇸🇦' },
  { value: '+965', label: 'Kuwait (+965)', isoCode: 'kw', flag: '🇰🇼' },
  { value: '+974', label: 'Qatar (+974)', isoCode: 'qa', flag: '🇶🇦' },
  { value: '+973', label: 'Bahrain (+973)', isoCode: 'bh', flag: '🇧🇭' },
  { value: '+962', label: 'Jordan (+962)', isoCode: 'jo', flag: '🇯🇴' },
  { value: '+20', label: 'Egypt (+20)', isoCode: 'eg', flag: '🇪🇬' },
  { value: '+91', label: 'India (+91)', isoCode: 'in', flag: '🇮🇳' },
  { value: '+92', label: 'Pakistan (+92)', isoCode: 'pk', flag: '🇵🇰' },
  { value: '+63', label: 'Philippines (+63)', isoCode: 'ph', flag: '🇵🇭' },
  { value: '+44', label: 'United Kingdom (+44)', isoCode: 'gb', flag: '🇬🇧' },
  { value: '+1', label: 'United States (+1)', isoCode: 'us', flag: '🇺🇸' },
];

const countryIsoMap = {
  'India': 'in', 'United States': 'us', 'United Kingdom': 'gb',
  'Canada': 'ca', 'Australia': 'au', 'Germany': 'de', 'France': 'fr',
  'Japan': 'jp', 'Brazil': 'br', 'UAE': 'ae', 'United Arab Emirates': 'ae',
  'Saudi Arabia': 'sa', 'Kuwait': 'kw', 'Qatar': 'qa', 'Bahrain': 'bh',
  'Jordan': 'jo', 'Egypt': 'eg', 'Pakistan': 'pk', 'Philippines': 'ph',
  'Bangladesh': 'bd', 'Sri Lanka': 'lk', 'Nepal': 'np', 'China': 'cn',
  'South Africa': 'za', 'Nigeria': 'ng', 'Russia': 'ru', 'Turkey': 'tr',
  'Oman': 'om',
};

const formatCountryOption = (option) => {
  const iso = option.isoCode || option.value?.toLowerCase() || '';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {iso && (
        <img
          src={`https://flagcdn.com/w40/${iso}.png`}
          alt={option.label}
          style={{ width: '24px', height: '18px', objectFit: 'cover', borderRadius: '2px' }}
        />
      )}
      <span>{option.label}</span>
    </div>
  );
};

const formatPhoneCodeOption = (option) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    {option.isoCode && (
      <img
        src={`https://flagcdn.com/w40/${option.isoCode}.png`}
        alt={option.label}
        style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }}
      />
    )}
    <span style={{ fontSize: '14px' }}>{option.value}</span>
  </div>
);

const countrySelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#F9F9FC',
    fontWeight: '600',
    border: '1.5px solid #c6c6c6',
    boxShadow: 'none',
    '&:hover': { border: '1.5px solid #c6c6c6' },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#604ae3' : state.isFocused ? '#f0f0f0' : '#fff',
    color: state.isSelected ? '#fff' : '#333',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({ ...base, color: '#333' }),
  placeholder: (base) => ({ ...base, color: '#6c757d', fontWeight: '400' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, padding: '4px' }),
};

const phoneCodeSelectStyles = {
  ...countrySelectStyles,
  control: (base) => ({
    ...base,
    backgroundColor: '#F9F9FC',
    fontWeight: '600',
    border: '1.5px solid #c6c6c6',
    boxShadow: 'none',
    minWidth: '140px',
    '&:hover': { border: '1.5px solid #c6c6c6' },
  }),
};

const TENANT_PURPOSES = ['tenant'];
const LANDLORD_PURPOSES = ['landlord'];

function formatDisplayDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return String(value); }
}

function getCurrentTimestamp() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const month = now.toLocaleString('en-US', { month: 'short' });
  return `${displayHours}:${minutes}${ampm} ${month} ${now.getDate()} ${now.getFullYear()}`;
}

function resolveProfileImageUrl(raw) {
  if (!raw || typeof raw !== 'string' || raw.trim() === '') return null;
  if (raw.startsWith('data:image')) return raw;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (!raw.includes('/') && raw.length > 100) {
    return `data:image/jpeg;base64,${raw}`;
  }
  return `${IMAGE_BASE_URL}${raw}`;
}

function getDefaultValuesFromLead(lead) {
  if (!lead) return undefined;
  const purpose = String(lead.purpose || '').toLowerCase();
  const isTenant = TENANT_PURPOSES.includes(purpose);
  const isLandlord = LANDLORD_PURPOSES.includes(purpose);
  const step = isTenant ? 'tenant' : isLandlord ? 'landlord' : 'main';
  const leadValue = purpose && purpose !== 'tenant' && purpose !== 'landlord' ? purpose : '';

  return {
    first_name: lead.firstName ?? lead.first_name ?? '',
    last_name: lead.lastName ?? lead.last_name ?? '',
    description: lead.address ?? '',
    number: lead.phone_number ?? lead.phoneNumber ?? '',
    lead_origin: lead.leadOrigin ?? lead.lead_origin ?? lead.leadorigin ?? '',
    passport_id: lead.passportOrId ?? lead.passport_or_id ?? '',
    created_at: formatDisplayDate(lead.createdAt ?? lead.created_at ?? ''),
    updated_at: formatDisplayDate(lead.updatedAt ?? lead.updated_at ?? ''),
    country: lead.country?.name ?? (typeof lead.country === 'string' ? lead.country : ''),
    countryId: lead.country?.countryId ?? lead.countryId ?? null,
    city: lead.city?.name ?? (typeof lead.city === 'string' ? lead.city : ''),
    cityId: lead.city?.cityId ?? lead.cityId ?? null,
    po_box: lead.poBox ?? lead.po_box ?? lead.POBox ?? lead.PO_BOX ?? '', // ← FIXED
    feedback: lead.feedback ?? lead.feedback ?? '', // ← FIXED
    _step: step,
    _leadValue: leadValue,
    _nationalityId: lead.nationality?.nationalityId
      ?? lead.nationality?.nationality_id
      ?? lead.nationalityId
      ?? null,
    _nationalityName: lead.nationality?.name ?? (typeof lead.nationality === 'string' ? lead.nationality : ''), // ← FIXED
    _managerId: lead.leadAssignTo?.userId ?? lead.leadAssignTo?.managerId ?? lead.lead_assign_to_id ?? null,
    _managerName: lead.leadAssignTo?.name ?? '',
    _managerPhone: lead.leadAssignTo?.phoneNumber ?? '',
    _profilePicture: lead.profileImage ?? lead.profilePicture ?? lead.profile_image ?? lead.profile_picture ?? null,
  };
}

const Addlead = ({ onFormValuesChange, initialData = null, mode = 'create' }) => {
  const isUpdate = mode === 'update';
  const defaults = getDefaultValuesFromLead(initialData);

  const navigate = useNavigate();

  // ══════════════════════════════════════════════════════════════════════════
  // IMAGE STATE - UPDATED
  // ══════════════════════════════════════════════════════════════════════════
  const [profileImageBase64, setProfileImageBase64] = useState(null); // Clean base64 for API
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(() =>
    resolveProfileImageUrl(defaults?._profilePicture)
  );
  const [imageFileName, setImageFileName] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const [phone, setPhone] = useState(() => initialData ? (initialData.phone_number ?? initialData.phoneNumber ?? '') : '');
  const [phoneCode, setPhoneCode] = useState(() => {
    if (initialData) {
      const storedPhone = initialData.phone_number ?? initialData.phoneNumber ?? '';
      const matched = countryPhoneCodes.find(c => storedPhone.startsWith(c.value));
      if (matched) return matched;
    }
    return countryPhoneCodes[0];
  });
  const [step, setStep] = useState(defaults?._step ?? 'main');
  const [leadValue, setLeadValue] = useState(defaults?._leadValue ?? '');

  const [selectedLeadOrigin, setSelectedLeadOrigin] = useState(defaults?.lead_origin ?? '');

  // ── Estimated Closing Date (datetime-local picker) ────────────────────────
  const [estimatedClosingDate, setEstimatedClosingDate] = useState('');

  // Country
  const [apiCountryOptions, setApiCountryOptions] = useState(null);
  const [selectedCountryLabel, setSelectedCountryLabel] = useState(defaults?.country ?? '');
  const [selectedCountryId, setSelectedCountryId] = useState(defaults?.countryId ?? null);

  // City
  const [allCities, setAllCities] = useState(null);
  const [selectedCity, setSelectedCity] = useState(defaults?.city ?? '');
  const [selectedCityId, setSelectedCityId] = useState(defaults?.cityId ?? null);

  // Nationality
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [selectedNationalityId, setSelectedNationalityId] = useState(defaults?._nationalityId ?? null);
  const [selectedNationalityValue, setSelectedNationalityValue] = useState(
    defaults?._nationalityId
      ? { value: defaults._nationalityId, label: defaults._nationalityName }
      : null
  );

  // Manager
  const [managerOptions, setManagerOptions] = useState([]);
  const [selectedManager, setSelectedManager] = useState(
    defaults?._managerId
      ? { value: defaults._managerId, label: defaults._managerName, phoneNumber: defaults._managerPhone }
      : null
  );

  // ══════════════════════════════════════════════════════════════════════════
  // IMAGE HANDLERS - UPDATED WITH COMPRESSION
  // ══════════════════════════════════════════════════════════════════════════
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📷 Original file:', {
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.type
    });

    setImageFileName(file.name);
    setImageFile(file);
    setIsCompressing(true);

    try {
      // Compress the image
      const compressed = await compressImage(file, 1200, 1200, 0.8);
      
      setImagePreview(compressed.preview);
      setProfileImageBase64(compressed.base64);
      
      console.log('✅ Image ready for upload:', {
        fileName: file.name,
        compressedSize: `${(compressed.size / 1024).toFixed(2)} KB`,
        base64Length: compressed.base64.length
      });
    } catch (error) {
      console.error('❌ Image compression failed:', error);
      alert('Failed to process image. Please try a different image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleImageDelete = () => {
    setImagePreview(null);
    setProfileImageBase64(null);
    setImageFile(null);
    setImageFileName(null);
    const fileInput = document.getElementById('profileImageInput');
    if (fileInput) fileInput.value = '';
  };

  // ── Fetch dropdowns ───────────────────────────────────────────────────────
  useEffect(() => {
    const headers = { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' };

    // Countries
    httpClient.get(`${API_BASE_URL}/helper/country/get_all?limit=999999`, { headers })
      .then((res) => {
        const list = res.data?.data?.data ?? [];
        if (!list.length) return;
        const options = list.map((c) => ({
          value: countryIsoMap[c.name] || c.name.toLowerCase().slice(0, 2),
          label: c.name,
          isoCode: countryIsoMap[c.name] || '',
          countryId: c.countryId,
        }));
        setApiCountryOptions(options);

        if (defaults?.countryId) {
          const match = options.find(o => o.countryId === defaults.countryId);
          if (match) { setSelectedCountryLabel(match.label); setSelectedCountryId(match.countryId); }
        } else if (defaults?.country) {
          const match = options.find(o => o.label.toLowerCase() === String(defaults.country).toLowerCase());
          if (match) { setSelectedCountryLabel(match.label); setSelectedCountryId(match.countryId); }
        } else if (!isUpdate) {
          const oman = options.find(o => o.label.toLowerCase() === 'oman');
          if (oman) { setSelectedCountryLabel(oman.label); setSelectedCountryId(oman.countryId); }
        }
      })
      .catch((err) => console.error('Failed to fetch countries:', err?.message));

    // Cities
    httpClient.get(`${API_BASE_URL}/helper/city/get_all?limit=999999`, { headers })
      .then((res) => {
        const list = res.data?.data?.data ?? [];
        if (!list.length) return;
        setAllCities(list);
        if (defaults?.cityId) {
          const match = list.find(c => c.cityId === defaults.cityId);
          if (match) { setSelectedCity(match.name); setSelectedCityId(match.cityId); }
        } else if (defaults?.city) {
          const match = list.find(c => c.name.toLowerCase() === String(defaults.city).toLowerCase());
          if (match) { setSelectedCity(match.name); setSelectedCityId(match.cityId); }
        }
      })
      .catch((err) => console.error('Failed to fetch cities:', err?.message));

    // Nationality
    httpClient.get(`${API_BASE_URL}/helper/nationality/get_all?limit=999999`, { headers })
      .then((res) => {
        const list = res.data?.data?.data ?? [];
        const options = list.map((n) => ({
          value: Number(n.nationalityId ?? n.countryId),
          label: n.name,
        }));
        setNationalityOptions(options);

        const targetId = defaults?._nationalityId ? Number(defaults._nationalityId) : null;
        if (targetId) {
          const match = options.find(o => o.value === targetId);
          if (match) {
            setSelectedNationalityId(match.value);
            setSelectedNationalityValue(match);
          }
        } else if (defaults?._nationalityName) {
          const match = options.find(
            o => o.label.toLowerCase() === defaults._nationalityName.toLowerCase()
          );
          if (match) {
            setSelectedNationalityId(match.value);
            setSelectedNationalityValue(match);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch nationalities:', err?.message));

    // Managers
    httpClient.get(`${API_BASE_URL}/marketing/manager/get_all/`, { headers })
      .then((res) => {
        const list = res.data?.data?.data ?? [];
        const options = list.map((m) => ({
          value: m.managerId ?? m.userId,
          label: m.name,
          department: m.department || 'N/A',
          phoneNumber: m.phoneNumber || '',
        }));
        setManagerOptions(options);
        if (defaults?._managerId) {
          const match = options.find(o => String(o.value) === String(defaults._managerId));
          if (match) setSelectedManager(match);
        }
      })
      .catch((err) => console.error('Failed to fetch managers:', err?.message));

  }, []);

  const countryOptions = apiCountryOptions ?? fallbackCountryOptions;

  const filteredCities = allCities && selectedCountryId
    ? allCities.filter((c) =>
      c.countryId === selectedCountryId ||
      c.countryName?.toLowerCase() === selectedCountryLabel.toLowerCase()
    )
    : [];

  const messageSchema = yup.object({
    first_name: yup.string().required('Please enter first name'),
    last_name: yup.string().required('Please enter last name'),
    description: yup.string().nullable().notRequired().transform((v) => v ?? ''),
  });

  const { handleSubmit, control, watch, reset, setValue } = useForm({
    resolver: yupResolver(messageSchema),
    defaultValues: defaults
      ? {
        first_name: defaults.first_name,
        last_name: defaults.last_name,
        description: defaults.description,
        number: defaults.number,
        passport_id: defaults.passport_id,
        'Created At': defaults.created_at,
        'Updated At': defaults.updated_at,
        country: defaults.country,
        city: defaults.city,
        'PO BOX': defaults.po_box,
        feedback: defaults.feedback,
      }
      : {
        description: '',
        country: '',
        city: '',
        'PO BOX': '',
        feedback: '',
        'Created At': getCurrentTimestamp(),
        'Updated At': '',
      },
  });

  // ── Re-sync when initialData changes ─────────────────────────────────────
  useEffect(() => {
    if (!initialData) return;
    const d = getDefaultValuesFromLead(initialData);
    if (!d) return;
  
    reset({
      first_name: d.first_name, 
      last_name: d.last_name,
      description: d.description, 
      number: d.number,
      passport_id: d.passport_id,
      'Created At': d.created_at, 
      'Updated At': d.updated_at,
      country: d.country, 
      city: d.city,
      'PO BOX': d.po_box,     
      feedback: d.feedback,    
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 🔧 FIX: Properly set lead type and lead category
    // ─────────────────────────────────────────────────────────────────────────
    // purpose field contains the lead TYPE (tenant/landlord)
    // lead_category field contains the CATEGORY (family/bachelor/owner/company)
    
    const rawPurpose = String(initialData.purpose || '').toLowerCase();
    const rawLeadCategory = initialData.lead_category || initialData.leadCategory || '';
    
    console.log('🔍 Loading lead data:', {
      rawPurpose,
      rawLeadCategory,
      fullInitialData: initialData
    });
    
    // Set step based on purpose (lead type)
    if (rawPurpose === 'tenant') {
      setStep('tenant');
    } else if (rawPurpose === 'landlord') {
      setStep('landlord');
    } else {
      setStep('main');
    }
    
    // Set leadValue based on lead_category
    setLeadValue(rawLeadCategory);
    
    console.log('✅ Set step and leadValue:', {
      step: rawPurpose === 'tenant' ? 'tenant' : rawPurpose === 'landlord' ? 'landlord' : 'main',
      leadValue: rawLeadCategory
    });
    // ─────────────────────────────────────────────────────────────────────────
    
    setPhone(initialData.phone_number ?? initialData.phoneNumber ?? '');
    setSelectedLeadOrigin(d.lead_origin ?? '');

    if (d._nationalityId) {
      setSelectedNationalityId(Number(d._nationalityId));
      setSelectedNationalityValue({ value: Number(d._nationalityId), label: d._nationalityName });
    }

    // Only restore preview — do NOT set profileImage or imageFile
    if (d._profilePicture) {
      setImagePreview(resolveProfileImageUrl(d._profilePicture));
    }

    setProfileImageBase64(null);
    setImageFile(null);
    setImageFileName(null);

    // ── Pre-fill Estimated Closing Date if available in initialData ───────
    const rawClosing = initialData.estimatedClosingDate ?? initialData.estimated_closing_date ?? initialData.updatedAt ?? initialData.updated_at ?? '';
    if (rawClosing) {
      try {
        const d2 = new Date(rawClosing);
        if (!Number.isNaN(d2.getTime())) {
          const local = new Date(d2.getTime() - d2.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
          setEstimatedClosingDate(local);
          const formatted = d2.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          });
          setValue('Updated At', formatted);
        }
      } catch { /* ignore */ }
    }

  }, [initialData, reset, setValue]);

  const watched = watch();
  const stableOnFormValuesChange = useCallback(onFormValuesChange, []);

  useEffect(() => {
    const leadType = step === 'tenant' ? 'Tenant' : step === 'landlord' ? 'Landlord' : '';
    const fullPhone = phone ? `${phoneCode.value}${phone}` : '';

    if (typeof stableOnFormValuesChange === 'function') {
      stableOnFormValuesChange({
        first_name: watched.first_name,
        last_name: watched.last_name,
        description: watched.description,
        phone: fullPhone,
        email: watched.email,
        leadType,
        leadId: watched.leadId,
        createdAt: watched['Created At'],
        updatedAt: watched['Updated At'],
        profileImage: imagePreview,
      });
    }
  }, [
    watched.first_name, watched.last_name, watched.description,
    watched.email, watched.leadId, watched['Created At'], watched['Updated At'],
    phone, phoneCode.value, step, imagePreview,
    stableOnFormValuesChange,
  ]);

  const onSubmit = handleSubmit(async (values) => {

    console.log('\n🟡 FORM VALUES:', values);

    // ── Determine Lead Type (purpose) and Lead Category separately ───────────
    const leadType = step === 'tenant' ? 'tenant' : step === 'landlord' ? 'landlord' : '';
    const leadCategory = leadValue || '';

    console.log('\n🟠 STATE values:', {
      step,
      leadValue,
      leadType,
      leadCategory,
      phone,
      phoneCode,
      fullPhone: phone ? `${phoneCode.value}${phone}` : '',
      selectedLeadOrigin,
      estimatedClosingDate,
      selectedCountryLabel,
      selectedCountryId,
      selectedCity,
      selectedCityId,
      selectedNationalityId,
      selectedNationalityValue,
      selectedManager,
      imagePreview: imagePreview ? '(present)' : null,
      profileImageBase64: profileImageBase64 ? `(${profileImageBase64.length} chars)` : null,
      imageFile: imageFile ? imageFile.name : null,
      imageFileName,
    });

    try {

      // ── VALIDATIONS ─────────────────────────────

      if (!leadType) {
        alert('Please select Lead Type (Tenant or Landlord).');
        return;
      }

      if (!leadCategory) {
        alert('Please select Lead Category.');
        return;
      }

      if (!values.description || values.description.trim() === '') {
        alert('Please add address. Address field cannot be empty.');
        return;
      }

      if (!selectedCountryId) {
        alert('Please select a Country.');
        return;
      }

      if (!selectedCityId) {
        alert('Please select a City.');
        return;
      }

      if (!selectedNationalityId) {
        alert('Please select a Nationality.');
        return;
      }

      if (!selectedManager?.value) {
        alert('Please select a manager to assign this lead to (Lead Assigned To).');
        return;
      }

      // ── BUILD BASE PAYLOAD ─────────────────────────────

      const basePayload = {
        lead_assign_to: {
          user_id: selectedManager.value
        },

        first_name: values.first_name,
        last_name: values.last_name,

        address: values.description.trim(),

        purpose: leadType,           // Lead Type (tenant/landlord)
        lead_category: leadCategory,  // Lead Category (family/bachelor/owner/company etc.)

        permissions: {
          property: true
        }
      };


      // ── OPTIONAL FIELDS ─────────────────────────────

      if (selectedLeadOrigin)
        basePayload.lead_origin = selectedLeadOrigin;

      if (selectedCountryId)
        basePayload.country = {
          country_id: selectedCountryId
        };

      if (selectedCityId)
        basePayload.city = {
          city_id: selectedCityId
        };

      if (selectedNationalityId)
        basePayload.nationality = {
          nationality_id: selectedNationalityId
        };

      if (phone)
        basePayload.phone_number =
          `${phoneCode.value}${phone}`;

      if (values.passport_id)
        basePayload.passport_or_id =
          values.passport_id;

      if (values['PO BOX'])
        basePayload.po_box =
          values['PO BOX'];

      if (values['feedback'])
        basePayload.feedback =
          values['feedback'];

      if (values['Updated At'])
        basePayload.updated_at =
          values['Updated At'];


      // ══════════════════════════════════════════════════════════════════════
      // PROFILE PICTURE - UPDATED LOGIC
      // ══════════════════════════════════════════════════════════════════════
      
      // Only add profile_picture if user uploaded a NEW image
      if (profileImageBase64 && imageFile) {
        basePayload.profile_picture = profileImageBase64;
        console.log('📸 Including new profile picture in payload');
      }


      // ── LOG BASE PAYLOAD ─────────────────────────────

      console.log('\n🟢 BASE PAYLOAD OBJECT:', basePayload);

      console.log(
        '\n📦 BASE PAYLOAD JSON (without image):',
        JSON.stringify({ ...basePayload, profile_picture: basePayload.profile_picture ? '[BASE64_DATA]' : undefined }, null, 2)
      );


      // ── UPDATE MODE ─────────────────────────────

      if (isUpdate && initialData) {

        const leadId =
          initialData.leadId ??
          initialData.lead_id;

        const updatePayload = {
          ...basePayload,
          lead_id: leadId
        };

        console.log('\n🟣 UPDATE PAYLOAD:', { ...updatePayload, profile_picture: updatePayload.profile_picture ? '[BASE64_DATA]' : undefined });

        const response =
          await httpClient.put(
            `${API_BASE_URL}/lead/update/`,
            updatePayload,
            {
              headers: {
                Authorization:
                  `Bearer ${AUTH_TOKEN}`,
                'Content-Type':
                  'application/json'
              }
            }
          );

        console.log(
          '✅ Update Response:',
          response.data
        );

        alert('Lead updated successfully.');
        navigate('/New-leads');

        return;
      }


      // ── CREATE MODE ─────────────────────────────

      basePayload.permissions = {
        property: true,
        lead: true
      };

      console.log('\n🔵 CREATE PAYLOAD:', { ...basePayload, profile_picture: basePayload.profile_picture ? '[BASE64_DATA]' : undefined });

      const response =
        await httpClient.post(
          `${API_BASE_URL}/lead/create/`,
          basePayload,
          {
            headers: {
              Authorization:
                `Bearer ${AUTH_TOKEN}`,
              'Content-Type':
                'application/json'
            }
          }
        );

      console.log(
        '✅ Create Response:',
        response.data
      );

      alert('Lead created successfully.');

      navigate('/New-leads');

    }

    // ── ERROR HANDLING ─────────────────────────────

    catch (e) {

      console.error('❌ API ERROR:', e);

      console.error(
        '❌ RESPONSE:',
        e.response?.data
      );

      let errorMsg =
        isUpdate
          ? 'Failed to update lead. '
          : 'Failed to create lead. ';

      if (e.response?.data?.message)
        errorMsg +=
          e.response.data.message;

      else if (e.response?.data?.error)
        errorMsg +=
          e.response.data.error;

      else if (e.response?.status === 413)
        errorMsg +=
          'Image file is too large. Please use a smaller image.';

      else if (e.response?.status === 400)
        errorMsg +=
          'Invalid data. Please check all fields.';

      else if (e.response?.status === 401)
        errorMsg +=
          'Authentication failed. Please login again.';

      else
        errorMsg +=
          'Please try again.';

      alert(errorMsg);

    }

  });

  return (
    <form onSubmit={onSubmit}>
      {/* ── Profile Photo Card ─────────────────────────────────────────────── */}
      <Card className="mb-3">
        <CardHeader>
          <CardTitle as="h4">Add Profile Photo</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="text-center">

            <div onClick={() => document.getElementById('profileImageInput').click()}
              style={{
                border: '2px dashed #ccc', borderRadius: '10px',
                padding: '40px', cursor: 'pointer', backgroundColor: '#f9f9fc',
              }}
            >
              <div className="mb-3">
                <i className="ri-upload-cloud-2-line" style={{ fontSize: '48px', color: '#604ae3' }} />
              </div>
              <p className="text-muted mb-1">
                {isCompressing ? 'Compressing image...' : 'Drop your images here, or click to browse'}
              </p>
              <small className="text-muted">
                (1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed)
              </small>
            </div>

            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              disabled={isCompressing}
            />

            {imagePreview && (
              <div className="mt-3 d-flex justify-content-between align-items-center p-3 border rounded">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden' }}>
                    <img
                      src={imagePreview}
                      alt="thumbnail"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="text-start">
                    <p className="mb-0 fw-medium">{imageFileName || 'Current profile photo'}</p>
                    <small className="text-muted">
                      {imageFileName 
                        ? (profileImageBase64 ? `✅ Ready to upload (${(profileImageBase64.length / 1024).toFixed(0)} KB)` : 'Processing...') 
                        : 'Existing image'
                      }
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ backgroundColor: '#604ae3', color: 'white', border: 'none' }}
                  onClick={(e) => { e.stopPropagation(); handleImageDelete(); }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Rest of your form remains the same... */}
      <Card>
        <CardHeader>
          <CardTitle as="h4">Add Lead Information</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="first_name" placeholder="Enter first name" label="First Name *" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="last_name" placeholder="Enter last name" label="Last Name *" />
              </div>
            </Col>

            {/* Contact Number */}
            <Col lg={6}>
              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: '0 0 140px' }}>
                    <ReactSelect
                      options={countryPhoneCodes}
                      formatOptionLabel={formatPhoneCodeOption}
                      styles={phoneCodeSelectStyles}
                      value={phoneCode}
                      onChange={(selected) => setPhoneCode(selected)}
                      isSearchable={false}
                      isClearable={false}
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter contact number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ backgroundColor: '#F9F9FC', fontWeight: '600', border: '1.5px solid #c6c6c6', flex: 1 }}
                  />
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="passport_id" placeholder="Enter Detail" label="Passport ID / Number" />
              </div>
            </Col>

            {/* Lead Types */}
            <Col lg={6}>
              <div className="mb-3">
                <label className="form-label">Lead Types *</label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="form-control"
                    style={{ backgroundColor: '#F9F9FC', fontWeight: '600', border: '1.5px solid #c6c6c6', appearance: 'none', paddingRight: '2.5rem' }}
                    value={step === 'main' ? '' : step}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStep(val === 'tenant' ? 'tenant' : val === 'landlord' ? 'landlord' : 'main');
                      setLeadValue('');
                    }}
                  >
                    <option value="">Select Lead Type</option>
                    <option value="tenant">Tenant</option>
                    <option value="landlord">Landlord</option>
                  </select>
                  <span style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c757d' }}>
                    <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18} />
                  </span>
                </div>
              </div>
            </Col>

            {/* Lead Category */}
            <Col lg={6}>
              <div className="mb-3">
                <label className="form-label">Lead Category *</label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="form-control"
                    style={{ backgroundColor: '#F9F9FC', fontWeight: '600', border: '1.5px solid #c6c6c6', appearance: 'none', paddingRight: '2.5rem' }}
                    value={leadValue}
                    disabled={step === 'main'}
                    onChange={(e) => setLeadValue(e.target.value)}
                  >
                    {step === 'main' && <option value="">Select Lead Type first</option>}
                    {step === 'tenant' && (
                      <>
                        <option value="">Select Category</option>
                        <option value="family">Family</option>
                        <option value="company_staff">Company Staff</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="labour">Labour</option>
                      </>
                    )}
                    {step === 'landlord' && (
                      <>
                        <option value="">Select Category</option>
                        <option value="owner">Owner</option>
                        <option value="company">Company</option>
                      </>
                    )}
                  </select>
                  <span style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c757d' }}>
                    <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18} />
                  </span>
                </div>
              </div>
            </Col>

            {/* Address */}
            <Col lg={12}>
              <div className="mb-3">
                <TextAreaFormInput
                  control={control} name="description" type="text"
                  label="Lead Address *" rows={3} placeholder="Address"
                  style={{ backgroundColor: '#F9F9FC', fontWeight: '600', border: '1.5px solid #c6c6c6' }}
                />
              </div>
            </Col>

            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput control={control} name="PO BOX" placeholder="PO BOX" label="PO BOX"
                  style={{ backgroundColor: '#F9F9FC', fontWeight: '600', border: '1.5px solid #c6c6c6' }} />
              </div>
            </Col>

            {/* Country */}
            <Col lg={4}>
              <div className="mb-3">
                <label className="form-label">Country *</label>
                <ReactSelect
                  options={countryOptions}
                  formatOptionLabel={formatCountryOption}
                  styles={countrySelectStyles}
                  placeholder="Select Country"
                  value={countryOptions.find(o => o.countryId === selectedCountryId) ?? null}
                  onChange={(selected) => {
                    setSelectedCountryLabel(selected?.label || '');
                    setSelectedCountryId(selected?.countryId ?? null);
                    setSelectedCity('');
                    setSelectedCityId(null);
                  }}
                  isClearable={false}
                />
              </div>
            </Col>

            {/* City */}
            <Col lg={4}>
              <div className="mb-3">
                <label className="form-label">City</label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="form-control"
                    style={{ backgroundColor: '#F9F9FC', fontWeight: '600', border: '1.5px solid #c6c6c6', appearance: 'none', paddingRight: '2.5rem' }}
                    value={selectedCity}
                    onChange={(e) => {
                      const cityName = e.target.value;
                      setSelectedCity(cityName);
                      if (allCities) {
                        const found = allCities.find(c => c.name === cityName);
                        setSelectedCityId(found?.cityId ?? null);
                      }
                    }}
                  >
                    <option value="">{!selectedCountryId ? 'Select Country first' : 'Choose a City'}</option>
                    {filteredCities.map((city) => (
                      <option key={city.cityId} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                  <span style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c757d' }}>
                    <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18} />
                  </span>
                </div>
              </div>
            </Col>

            {/* Nationality */}
            <Col lg={4}>
              <div className="mb-3">
                <label className="form-label">Nationality</label>
                <ReactSelect
                  options={nationalityOptions}
                  styles={countrySelectStyles}
                  placeholder="Select Nationality"
                  value={selectedNationalityValue}
                  onChange={(selected) => {
                    setSelectedNationalityId(selected?.value ?? null);
                    setSelectedNationalityValue(selected);
                  }}
                  isClearable={false}
                  noOptionsMessage={() => nationalityOptions.length === 0 ? 'Loading...' : 'No options'}
                />
              </div>
            </Col>

            {/* Lead Origin */}
            <Col lg={4}>
              <div className="mb-3">
                <label className="form-label">Lead Origin</label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="form-control"
                    style={{ backgroundColor: '#F9F9FC', fontWeight: '600', border: '1.5px solid #c6c6c6', appearance: 'none', paddingRight: '2.5rem' }}
                    value={selectedLeadOrigin}
                    onChange={(e) => setSelectedLeadOrigin(e.target.value)}
                  >
                    <option value="">Select Lead Origin</option>
                    <option value="Open Sooq">Open Sooq</option>
                    <option value="OLX">OLX</option>
                    <option value="Employee Referral">Employee Referral</option>
                    <option value="Reference">Reference</option>
                    <option value="Website Inquiry">Website Inquiry</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="Walk-in Customer">Walk-in Customer</option>
                    <option value="Phone Inquiry">Phone Call Inquiry</option>
                    <option value="Office Visit">Office Visit</option>
                    <option value="Online Portal">Online Property Portal</option>
                    <option value="Printing Banner">Printing Banner</option>
                  </select>
                  <span style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c757d' }}>
                    <IconifyIcon icon="ri:arrow-down-s-line" width={18} height={18} />
                  </span>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput control={control} name="Created At" placeholder="Time-Lapse" label="Created At" readOnly
                  style={{ backgroundColor: '#F9F9FC', fontWeight: '600', border: '1.5px solid #c6c6c6' }} />
              </div>
            </Col>

            {/* ── Estimated Closing Date — manual datetime picker ───────────── */}
            <Col lg={4}>
              <div className="mb-3">
                <label className="form-label">Estimated Closing Date</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={estimatedClosingDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEstimatedClosingDate(val);
                    const formatted = val
                      ? new Date(val).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })
                      : '';
                    setValue('Updated At', formatted);
                  }}
                  style={{
                    backgroundColor: '#F9F9FC',
                    fontWeight: '600',
                    border: '1.5px solid #c6c6c6',
                    colorScheme: 'light',
                    height: '38px',
                  }}
                />
              </div>
            </Col>

            {/* Lead Assigned To */}
            <Col lg={4}>
              <div className="mb-3">
                <label className="form-label">Lead Assigned To *</label>
                <ReactSelect
                  options={managerOptions}
                  styles={countrySelectStyles}
                  placeholder="Select Manager"
                  value={selectedManager}
                  onChange={(selected) => setSelectedManager(selected)}
                  formatOptionLabel={(option) => (
                    <div>
                      <div style={{ fontWeight: '600' }}>{option.label}</div>
                      <small style={{ color: '#6c757d' }}>
                        ID: {option.value}{option.phoneNumber && ` • ${option.phoneNumber}`}
                      </small>
                    </div>
                  )}
                  isClearable={false}
                  noOptionsMessage={() => managerOptions.length === 0 ? 'Loading managers...' : 'No managers found'}
                />
              </div>
            </Col>

            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput control={control} name="feedback" placeholder="Enter Comments" label="Comments"
                  style={{ backgroundColor: '#F9F9FC', fontWeight: '600', border: '1.5px solid #c6c6c6' }} />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button variant="outline-primary" type="submit" className="w-100" disabled={isCompressing}>
              {isCompressing ? 'Processing...' : (isUpdate ? 'Update Lead' : 'Save Lead')}
            </Button>
          </Col>
          <Col lg={2}>
            <Button
              variant="primary"
              className="w-100"
              style={{ backgroundColor: '#5D7186', borderColor: '#5D7186' }}
              type="button"
              onClick={() => {
                  navigate('/New-leads');
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default Addlead;