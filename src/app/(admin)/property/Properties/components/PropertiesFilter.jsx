import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

const checkboxGroups = {
  propertyType: [
    { id: 'property-type-residential', label: 'Residential' },
    { id: 'property-type-commercial', label: 'Commercial' }
  ],
  propertiesType: [
    { id: 'properties-type-all', label: 'All Properties', defaultChecked: true },
    { id: 'properties-type-apartment', label: 'Apartment' },
    { id: 'properties-type-villas', label: 'Villas' },
    { id: 'properties-type-warehouse', label: 'Ware House' },
    { id: 'properties-type-commercial', label: 'Commercial' }
  ],
  amenities: [
    { id: 'amenity-balcony', label: 'Balcony' },
    { id: 'amenity-parking', label: 'Parking' },
    { id: 'amenity-spa', label: 'Spa' },
    { id: 'amenity-pool', label: 'Pool' },
    { id: 'amenity-restaurant', label: 'Restaurant' },
    { id: 'amenity-fitness-club', label: 'Fitness Club' }
  ],
  rentalFor: [
    { id: 'rental-for-bachelor', label: 'Bachelor' },
    { id: 'rental-for-family', label: 'Family' }
  ]
};

const bedrooms = ['1 BHK', '2 BHK', '3 BHK', '4 & 5 BHK'];

const CheckOption = ({ id, label, defaultChecked = false }) => (
  <Col xs={6}>
    <div className="filter-check">
      <input className="form-check-input" type="checkbox" id={id} defaultChecked={defaultChecked} />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  </Col>
);

const PropertiesFilter = () => {
  const [selectedValue, setSelectedValue] = useState([1000, 10000]);

  const handleInputChange = (event, index) => {
    const value = Number(event.target.value.replace(/\D/g, '')) || 0;

    if (index === 0 && value <= selectedValue[1]) {
      setSelectedValue([value, selectedValue[1]]);
    }

    if (index === 1 && value >= selectedValue[0]) {
      setSelectedValue([selectedValue[0], value]);
    }
  };

  return (
    <Col xl={3} lg={12}>
      <style>
        {`
          .properties-filter-card {
            border: 0;
            border-radius: 5px;
            box-shadow: 0 1px 6px rgba(47, 56, 72, 0.08);
            overflow: hidden;
          }

          .properties-filter-card .card-header {
            background: #fff;
            padding: 16px 20px;
          }

          .properties-filter-card .card-body {
            padding: 20px;
          }

          .properties-filter-card .card-footer {
            background: transparent;
            border: 0;
            padding: 14px 24px 0;
          }

          .properties-filter-card .filter-title {
            color: #536b86;
            font-size: 16px;
            font-weight: 600;
          }

          .properties-filter-card .filter-subtitle,
          .properties-filter-card .form-check-label,
          .properties-filter-card .form-control,
          .properties-filter-card .choices__inner {
            color: #536b86;
            font-size: 14px;
          }

          .properties-filter-card .filter-label {
            color: #2f3848;
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 12px;
          }

          .properties-filter-card .filter-section {
            margin-top: 20px;
          }

          .properties-filter-card .filter-check {
            align-items: center;
            display: flex;
            gap: 8px;
            margin-bottom: 14px;
          }

          .properties-filter-card .form-check-input {
            border-color: #cfd7df;
            height: 15px;
            margin: 0;
            width: 15px;
          }

          .properties-filter-card .form-check-input:checked {
            background-color: #604ae3;
            border-color: #604ae3;
          }

          .properties-filter-card .form-control,
          .properties-filter-card .choices__inner {
            border-color: #dfe6ee;
            border-radius: 5px;
            min-height: 39px;
          }

          .properties-filter-card .noUi-target {
            align-items: center;
            display: flex;
            height: 7px;
            margin: 18px 8px 22px;
          }

          .properties-filter-card .noUi-connect {
            background: #604ae3;
            border-radius: 999px;
            display: block;
            height: 7px;
            width: 100%;
          }

          .properties-filter-card .noUi-handle {
            background: #604ae3;
            border-radius: 50%;
            display: block;
            flex: 0 0 18px;
            height: 18px;
            width: 18px;
          }

          .bedroom-options {
            display: grid;
            gap: 4px;
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .bedroom-options .btn {
            border-color: #604ae3;
            border-radius: 5px;
            color: #604ae3;
            font-size: 14px;
            min-height: 39px;
            padding: 8px 6px;
            white-space: nowrap;
          }

          .bedroom-options .btn-check:checked + .btn {
            background: #604ae3;
            border-color: #604ae3;
            color: #fff;
          }

          .properties-filter-card .apply-btn {
            background: #604ae3;
            border-color: #604ae3;
            border-radius: 5px;
            min-height: 39px;
          }
        `}
      </style>

      <Card className="properties-filter-card">
        <CardHeader className="border-bottom">
          <CardTitle as="h4" className="filter-title mb-1">
            Properties
          </CardTitle>
          <p className="filter-subtitle mb-0">Show 15,780 Properties</p>
        </CardHeader>

        <CardBody>
          <div>
            <label htmlFor="property-city" className="form-label filter-subtitle mb-2">
              Properties Location
            </label>
            <ChoicesFormInput className="form-control" id="property-city">
              <option>Choose a city</option>
              <option value="Muscat">Muscat</option>
              <option value="Nizwa">Nizwa</option>
              <option value="Salalah">Salalah</option>
              <option value="Sohar">Sohar</option>
            </ChoicesFormInput>
          </div>

          <div className="filter-section">
            <h5 className="filter-label">Custom Price Range :</h5>
            <div className="noUi-target" aria-hidden="true">
              <span className="noUi-handle" />
              <span className="noUi-connect" />
              <span className="noUi-handle" />
            </div>
            <div className="d-flex align-items-center gap-2">
              <input className="form-control text-center" type="text" value={`OMR ${selectedValue[0]}`} onChange={event => handleInputChange(event, 0)} />
              <span className="filter-subtitle fw-semibold">to</span>
              <input className="form-control text-center" type="text" value={`OMR ${selectedValue[1]}`} onChange={event => handleInputChange(event, 1)} />
            </div>
          </div>

          <div className="filter-section">
            <h5 className="filter-label">Property Type :</h5>
            <Row className="g-0">
              {checkboxGroups.propertyType.map(item => (
                <CheckOption key={item.id} {...item} />
              ))}
            </Row>
          </div>

          <div className="filter-section">
            <h5 className="filter-label">Properties Type :</h5>
            <Row className="g-0">
              {checkboxGroups.propertiesType.map(item => (
                <CheckOption key={item.id} {...item} />
              ))}
            </Row>
          </div>

          <div className="filter-section">
            <h5 className="filter-label">Bedrooms :</h5>
            <div className="bedroom-options" role="group" aria-label="Bedroom options">
              {bedrooms.map(item => (
                <div key={item}>
                  <input type="checkbox" className="btn-check" id={`bedroom-${item.replace(/\W+/g, '-').toLowerCase()}`} defaultChecked={item === '3 BHK'} />
                  <label className="btn w-100" htmlFor={`bedroom-${item.replace(/\W+/g, '-').toLowerCase()}`}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h5 className="filter-label">Amenities:</h5>
            <Row className="g-0">
              {checkboxGroups.amenities.map(item => (
                <CheckOption key={item.id} {...item} />
              ))}
            </Row>
          </div>

          <div className="filter-section">
            <h5 className="filter-label">Rental For</h5>
            <Row className="g-0">
              {checkboxGroups.rentalFor.map(item => (
                <CheckOption key={item.id} {...item} />
              ))}
            </Row>
          </div>
        </CardBody>

        <CardFooter>
          <Button variant="primary" className="apply-btn w-100">
            Apply
          </Button>
        </CardFooter>
      </Card>
    </Col>
  );
};

export default PropertiesFilter;
