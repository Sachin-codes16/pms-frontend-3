import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import Nouislider from 'nouislider-react';
import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

const PropertiesFilter = () => {
  const [selectedValue, setSelectedValue] = useState([1000, 10000]);
  
  const handleSliderChange = values => {
    setSelectedValue(values);
  };
  
  const handleInputChange = (event, type) => {
    const value = Math.round(event.target.value);
    if (type === 'min') {
      setSelectedValue([value, selectedValue[1]]);
    } else {
      if (value >= selectedValue[0]) {
        setSelectedValue([selectedValue[0], value]);
      }
    }
  };

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: '0.5rem' }}>
      {/* Header */}
      <CardHeader className="bg-white border-bottom" style={{ padding: '1.25rem 1.5rem' }}>
        <div>
          <CardTitle as={'h5'} className="mb-1" style={{ fontSize: '1rem', fontWeight: 600, color: '#6c757d' }}>
            Property
          </CardTitle>
          <p className="mb-0" style={{ fontSize: '0.813rem', color: '#8e9aaf' }}>
            Show 15,780 Property
          </p>
        </div>
      </CardHeader>

      {/* Body */}
      <CardBody style={{ padding: '1.5rem' }}>
        {/* Properties Location */}
        <div className="mb-4">
          <label 
            htmlFor="properties-location" 
            className="form-label mb-2"
            style={{ fontSize: '0.813rem', fontWeight: 600, color: '#4a5568' }}
          >
            Properties Location
          </label>
          <select
            id="properties-location"
            className="form-select"
            style={{
              border: '1px solid #dee2e6',
              borderRadius: '0.5rem',
              fontSize: '0.813rem',
              padding: '0.625rem 0.75rem',
              color: '#8e9aaf'
            }}
          >
            <option>Choose a city</option>
            <option value="London">London</option>
            <option value="Manchester">Manchester</option>
            <option value="Paris">Paris</option>
            <option value="New York">New York</option>
          </select>
        </div>

        {/* Custom Price Range */}
        <div className="mb-4">
          <h6 
            className="mb-3" 
            style={{ fontSize: '0.813rem', fontWeight: 600, color: '#4a5568' }}
          >
            Custom Price Range :
          </h6>
          <div className="mb-3">
            <Nouislider 
              range={{ min: 1000, max: 10000 }} 
              start={selectedValue} 
              connect={true} 
              className="product-price-range" 
              onSlide={handleSliderChange}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <input 
              className="form-control text-center" 
              type="text" 
              value={`OMR ${selectedValue[0]}`}
              readOnly
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '0.375rem',
                fontSize: '0.813rem',
                padding: '0.5rem',
                color: '#4a5568'
              }}
            />
            <span className="fw-medium" style={{ fontSize: '0.813rem', color: '#6c757d' }}>to</span>
            <input 
              className="form-control text-center" 
              type="text" 
              value={`OMR ${selectedValue[1]}`}
              readOnly
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '0.375rem',
                fontSize: '0.813rem',
                padding: '0.5rem',
                color: '#4a5568'
              }}
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="mb-4">
          <h6 
            className="mb-3" 
            style={{ fontSize: '0.813rem', fontWeight: 600, color: '#4a5568' }}
          >
            Property Type :
          </h6>
          <Row className="g-2">
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="residential"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="residential"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Residential
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="commercial"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="commercial"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Commercial
                </label>
              </div>
            </Col>
          </Row>
        </div>

        {/* Properties Type */}
        <div className="mb-4">
          <h6 
            className="mb-3" 
            style={{ fontSize: '0.813rem', fontWeight: 600, color: '#4a5568' }}
          >
            Properties Type :
          </h6>
          <Row className="g-2">
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="allProperties" 
                  defaultChecked
                  style={{ cursor: 'pointer', accentColor: '#3b4b7d' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="allProperties"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  All Properties
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="flat"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="flat"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Flat
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="room"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="room"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Room
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="villa"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="villa"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Villa
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="shop"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="shop"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Shop
                </label>
              </div>
            </Col>
          </Row>
        </div>

        {/* Bedrooms */}
        <div className="mb-4">
          <h6 
            className="mb-3" 
            style={{ fontSize: '0.813rem', fontWeight: 600, color: '#4a5568' }}
          >
            Bedrooms :
          </h6>
          <div className="d-flex flex-wrap gap-2">
            <input type="checkbox" className="btn-check" id="bhk1" />
            <label 
              className="btn btn-outline-primary" 
              htmlFor="bhk1"
              style={{
                fontSize: '0.813rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                borderColor: '#5d6eb8',
                color: '#5d6eb8',
                fontWeight: 500
              }}
            >
              1 BHK
            </label>

            <input type="checkbox" className="btn-check" id="bhk2" />
            <label 
              className="btn btn-outline-primary" 
              htmlFor="bhk2"
              style={{
                fontSize: '0.813rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                borderColor: '#5d6eb8',
                color: '#5d6eb8',
                fontWeight: 500
              }}
            >
              2 BHK
            </label>

            <input type="checkbox" className="btn-check" id="bhk3" defaultChecked />
            <label 
              className="btn" 
              htmlFor="bhk3"
              style={{
                fontSize: '0.813rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#3b4b7d',
                color: 'white',
                border: 'none',
                fontWeight: 500
              }}
            >
              3 BHK
            </label>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="mb-0">
          <h6 
            className="mb-3" 
            style={{ fontSize: '0.813rem', fontWeight: 600, color: '#4a5568' }}
          >
            Accessibility Features :
          </h6>
          <Row className="g-2">
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="balcony"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="balcony"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Balcony
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="parking"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="parking"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Parking
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="spa"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="spa"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Spa
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="pool"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="pool"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Pool
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="restaurant"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="restaurant"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Restaurant
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="fitnessClub"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="fitnessClub"
                  style={{ fontSize: '0.813rem', color: '#6c757d', cursor: 'pointer' }}
                >
                  Fitness Club
                </label>
              </div>
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};

export default PropertiesFilter;