import Nouislider from 'nouislider-react';
import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import httpClient from '@/helpers/httpClient';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';

const HEADERS = { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' };

const PropertiesFilter = ({ onFiltersChange }) => {
  const [selectedValue, setSelectedValue] = useState([0, 100000]);
  const [propertyType, setPropertyType]   = useState([]);
  const [tenantType, setTenantType]       = useState([]); // Yeh rentalFor ke liye use hoga

  const [countries, setCountries]               = useState([]);  
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [selectedCountry, setSelectedCountry]   = useState('');  
  const [allCities, setAllCities]           = useState([]); 
  const [citiesLoading, setCitiesLoading]   = useState(true);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity]     = useState('');

  const currency = 'OMR';

  useEffect(() => {
    (async () => {
      setCountriesLoading(true);
      try {
        const res  = await httpClient.get(`${API_BASE_URL}/helper/country/get_all?limit=1000`, { headers: HEADERS });
        const data = res.data?.data?.data ?? res.data?.data ?? [];
        setCountries(data.filter((c) => c.name));
      } catch (e) {
        console.error('Countries fetch error:', e);
      } finally {
        setCountriesLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setCitiesLoading(true);
      try {
        const res  = await httpClient.get(`${API_BASE_URL}/helper/city/get_all?limit=1000`, { headers: HEADERS });
        const data = res.data?.data?.data ?? res.data?.data ?? [];
        setAllCities(data.filter((c) => c.name));
      } catch (e) {
        console.error('Cities fetch error:', e);
      } finally {
        setCitiesLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setSelectedCity(''); 
    if (!selectedCountry) {
      setFilteredCities(allCities);
      return;
    }
    const norm = selectedCountry.trim().toLowerCase();
    const matched = allCities.filter(
      (c) => (c.countryName ?? '').trim().toLowerCase() === norm
    );
    setFilteredCities(matched);
  }, [selectedCountry, allCities]);

  useEffect(() => {
    onFiltersChange?.({
      minPrice:     selectedValue[0],
      maxPrice:     selectedValue[1],
      city:         selectedCity,
      propertyType,
      tenantType,   // rentalFor filter
    });
  }, [selectedValue, selectedCity, propertyType, tenantType, onFiltersChange]);

  const handleSliderChange = (values) =>
    setSelectedValue(values.map((v) => Math.round(v)));

  const handleInputChange = (e, index) => {
    const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
    if (index === 0 && value <= selectedValue[1]) setSelectedValue([value, selectedValue[1]]);
    if (index === 1 && value >= selectedValue[0]) setSelectedValue([selectedValue[0], value]);
  };

  const handleCheckboxChange = (val, state, setState) => {
    if (val === '') {
      setState([]); 
      return;
    }
    if (state.includes(val)) {
      setState(state.filter(item => item !== val));
    } else {
      setState([...state, val]);
    }
  };

  return (
    <Col xl={3} lg={12}>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle as="h4">Properties</CardTitle>
          <p className="mb-0 text-muted small">Filter your search</p>
        </CardHeader>
        <CardBody>

          <label className="form-label fw-medium">City</label>
          <select
            className="form-select mb-3"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={citiesLoading}
          >
            <option value="">
              {citiesLoading ? 'Loading cities…' : 'All Cities'}
            </option>
            {filteredCities.map((c) => (
              <option key={c.cityId} value={c.name}>{c.name}</option>
            ))}
          </select>

          <h5 className="text-dark fw-medium my-3">Custom Price Range :</h5>
          <Nouislider
            range={{ min: 0, max: 100000 }}
            start={selectedValue}
            connect
            className="product-price-range"
            onSlide={handleSliderChange}
          />
          <div className="formCost d-flex gap-2 align-items-center mt-3">
            <input
              className="form-control form-control-sm text-center"
              type="text"
              value={`${currency} ${selectedValue[0]}`}
              onChange={(e) => handleInputChange(e, 0)}
            />
            <span className="fw-semibold text-muted">to</span>
            <input
              className="form-control form-control-sm text-center"
              type="text"
              value={`${currency} ${selectedValue[1]}`}
              onChange={(e) => handleInputChange(e, 1)}
            />
          </div>

          <h5 className="text-dark fw-medium my-3">Property Type :</h5>
          <Row className="g-1">
            {['', 'Flat', 'Villa', 'Commercial', 'Warehouse'].map((val) => (
              <Col lg={6} key={val}>
                <div className="mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`type_${val || 'all'}`}
                    checked={val === '' ? propertyType.length === 0 : propertyType.includes(val)}
                    onChange={() => handleCheckboxChange(val, propertyType, setPropertyType)}
                  />
                  &nbsp;
                  <label className="form-check-label ms-1" htmlFor={`type_${val || 'all'}`}>
                    {val || 'All'}
                  </label>
                </div>
              </Col>
            ))}
          </Row>

          <h5 className="text-dark fw-medium my-3">Rental For :</h5>
          <Row className="g-1">
            {['', 'Family', 'Bachelor', 'Company'].map((val) => (
              <Col lg={6} key={val}>
                <div className="mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`tenant_${val || 'all'}`}
                    checked={val === '' ? tenantType.length === 0 : tenantType.includes(val)}
                    onChange={() => handleCheckboxChange(val, tenantType, setTenantType)}
                  />
                  &nbsp;
                  <label className="form-check-label ms-1" htmlFor={`tenant_${val || 'all'}`}>
                    {val || 'All'}
                  </label>
                </div>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default PropertiesFilter;