import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

// "Property Type :" (Residential/Commercial) is intentionally left decorative -
// there is no backend equivalent for that grouping, only the real property_types
// enum below ("Properties Type :"). Same treatment as Rental Report's identical group.
const decorativePropertyType = [
  { id: 'property-type-residential', label: 'Residential' },
  { id: 'property-type-commercial', label: 'Commercial' }
];

// real property_types enum: Apartment,Villa,Warehouse,Commercial
const propertiesTypeOptions = ['All Properties', 'Apartment', 'Villa', 'Warehouse', 'Commercial'];

// real features enum is exactly Balcony,Parking,Pool - confirmed via testing that this
// endpoint (unlike Rental Report's) silently returns the FULL UNFILTERED set for any
// unrecognized value instead of an empty result, so Spa/Restaurant/Fitness Club were
// removed rather than left as filters that silently do nothing.
const amenityOptions = ['Balcony', 'Parking', 'Pool'];

// real rental_for enum: Bachelor,Family,Labour
const rentalForOptions = ['Bachelor', 'Family', 'Labour'];

const bedroomOptions = ['1 BHK', '2 BHK', '3 BHK', '4 & 5 BHK'];

const cityOptions = ['Choose a city', 'Muscat', 'Nizwa', 'Salalah', 'Sohar'];

const CheckOption = ({ id, label, checked, onChange }) => (
  <Col xs={6}>
    <div className="filter-check">
      <input className="form-check-input" type="checkbox" id={id} checked={checked} onChange={onChange} />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  </Col>
);

const PropertiesFilter = ({
  presentPage = 1,
  totalPage = 1,
  city = '',
  setCity = () => {},
  selectedTypes = [],
  toggleType = () => {},
  selectedBedrooms = [],
  toggleBedroom = () => {},
  selectedFeatures = [],
  toggleFeature = () => {},
  selectedRentalFor = [],
  toggleRentalFor = () => {},
  minRentInput = '',
  setMinRentInput = () => {},
  maxRentInput = '',
  setMaxRentInput = () => {},
}) => {
  const onToggleType = (item) =>
    item === 'All Properties' ? selectedTypes.forEach((t) => toggleType(t)) : toggleType(item);

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

          .bedroom-options {
            display: grid;
            gap: 4px;
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .bedroom-options > div {
            min-width: 0;
          }

          .bedroom-options .btn {
            align-items: center;
            border-color: #604ae3;
            border-radius: 5px;
            color: #604ae3;
            display: flex;
            font-size: 13px;
            justify-content: center;
            min-height: 39px;
            padding: 8px 4px;
            text-align: center;
            white-space: normal;
          }

          .bedroom-options .btn-check:checked + .btn {
            background: #604ae3;
            border-color: #604ae3;
            color: #fff;
          }
        `}
      </style>

      <Card className="properties-filter-card">
        <CardHeader className="border-bottom">
          <CardTitle as="h4" className="filter-title mb-1">
            Properties
          </CardTitle>
          <p className="filter-subtitle mb-0">Page {presentPage} of {totalPage}</p>
        </CardHeader>

        <CardBody>
          <div>
            <label htmlFor="property-city" className="form-label filter-subtitle mb-2">
              Properties Location
            </label>
            <ChoicesFormInput
              className="form-control"
              id="property-city"
              defaultValue={city}
              onChange={(value) => setCity(value === 'Choose a city' ? '' : value)}
            >
              {cityOptions.map((option) => (
                <option key={option} value={option === 'Choose a city' ? '' : option}>
                  {option}
                </option>
              ))}
            </ChoicesFormInput>
          </div>

          <div className="filter-section">
            <h5 className="filter-label">Custom Price Range :</h5>
            <div className="d-flex align-items-center gap-2">
              <input
                type="number"
                min="0"
                className="form-control text-center"
                placeholder="Min OMR"
                value={minRentInput}
                onChange={(e) => setMinRentInput(e.target.value)}
              />
              <span className="filter-subtitle fw-semibold">to</span>
              <input
                type="number"
                min="0"
                className="form-control text-center"
                placeholder="Max OMR"
                value={maxRentInput}
                onChange={(e) => setMaxRentInput(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-section">
            <h5 className="filter-label">Property Type :</h5>
            <Row className="g-0">
              {decorativePropertyType.map((item) => (
                <CheckOption key={item.id} {...item} checked={false} onChange={() => {}} />
              ))}
            </Row>
          </div>

          <div className="filter-section">
            <h5 className="filter-label">Properties Type :</h5>
            <Row className="g-0">
              {propertiesTypeOptions.map((item) => (
                <CheckOption
                  key={item}
                  id={`properties-type-${item.replace(/\W+/g, '-').toLowerCase()}`}
                  label={item}
                  checked={item === 'All Properties' ? selectedTypes.length === 0 : selectedTypes.includes(item)}
                  onChange={() => onToggleType(item)}
                />
              ))}
            </Row>
          </div>

          <div className="filter-section">
            <h5 className="filter-label">Bedrooms :</h5>
            <div className="bedroom-options" role="group" aria-label="Bedroom options">
              {bedroomOptions.map((item) => (
                <div key={item}>
                  <input
                    type="checkbox"
                    className="btn-check"
                    id={`bedroom-${item.replace(/\W+/g, '-').toLowerCase()}`}
                    checked={selectedBedrooms.includes(item)}
                    onChange={() => toggleBedroom(item)}
                  />
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
              {amenityOptions.map((item) => (
                <CheckOption
                  key={item}
                  id={`amenity-${item.replace(/\W+/g, '-').toLowerCase()}`}
                  label={item}
                  checked={selectedFeatures.includes(item)}
                  onChange={() => toggleFeature(item)}
                />
              ))}
            </Row>
          </div>

          <div className="filter-section">
            <h5 className="filter-label">Rental For</h5>
            <Row className="g-0">
              {rentalForOptions.map((item) => (
                <CheckOption
                  key={item}
                  id={`rental-for-${item.replace(/\W+/g, '-').toLowerCase()}`}
                  label={item}
                  checked={selectedRentalFor.includes(item)}
                  onChange={() => toggleRentalFor(item)}
                />
              ))}
            </Row>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default PropertiesFilter;
