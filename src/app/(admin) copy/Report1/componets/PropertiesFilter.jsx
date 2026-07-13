import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

const PropertiesFilter = () => {
  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: '0.5rem' }}>
      {/* Header */}
      <CardHeader className="bg-white border-bottom" style={{ padding: '1.25rem 1.5rem' }}>
        <div>
          <CardTitle as={'h4'} className="mb-1" style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937' }}>
            Landlord
          </CardTitle>
          <p className="mb-0" style={{ fontSize: '0.875rem', color: '#6c757d' }}>
            Show 15,780 Landlord
          </p>
        </div>
      </CardHeader>

      {/* Body */}
      <CardBody style={{ padding: '1.5rem' }}>
        {/* Lead Location */}
        <div className="mb-4">
          <label 
            htmlFor="lead-location" 
            className="form-label mb-2"
            style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}
          >
            Location wise
          </label>
          <ChoicesFormInput 
            className="form-control" 
            id="lead-location" 
            data-placeholder="Choose a city"
            style={{
              border: '1px solid #dee2e6',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem'
            }}
          >
            <option>Choose a city</option>
            <optgroup label="UK">
              <option value="London">London</option>
              <option value="Manchester">Manchester</option>
              <option value="Liverpool">Liverpool</option>
            </optgroup>
            <optgroup label="FR">
              <option value="Paris">Paris</option>
              <option value="Lyon">Lyon</option>
              <option value="Marseille">Marseille</option>
            </optgroup>
            <optgroup label="US">
              <option value="New York">New York</option>
              <option value="Washington">Washington</option>
              <option value="Michigan">Michigan</option>
            </optgroup>
          </ChoicesFormInput>
        </div>

        {/* Tenants Rent */}
        <div className="mb-4">
          <h5 
            className="mb-3" 
            style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}
          >
            Landlord Properties :
          </h5>
          <Row className="g-3">
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="rentPaid"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="rentPaid"
                  style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
                >
                  Rent Paid
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="rentPending"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="rentPending"
                  style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
                >
                  Rent Pending
                </label>
              </div>
            </Col>
          </Row>
        </div>

        {/* Tenant Type */}
        <div className="mb-4">
          <h5 
            className="mb-3" 
            style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}
          >
            Landlord Type :
          </h5>
          <div className="d-flex flex-column gap-2">
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="newTenant" 
                defaultChecked
                style={{ cursor: 'pointer' }}
              />
              <label 
                className="form-check-label" 
                htmlFor="newTenant"
                style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
              >
                New Tenant
              </label>
            </div>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="activeTenant"
                style={{ cursor: 'pointer' }}
              />
              <label 
                className="form-check-label" 
                htmlFor="activeTenant"
                style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
              >
                Active
              </label>
            </div>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="inactiveTenant"
                style={{ cursor: 'pointer' }}
              />
              <label 
                className="form-check-label" 
                htmlFor="inactiveTenant"
                style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
              >
                Inactive Tenant
              </label>
            </div>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="mb-4">
          <h5 
            className="mb-3" 
            style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}
          >
            Bedrooms :
          </h5>
          <div className="d-flex flex-wrap gap-2">
            <input type="checkbox" className="btn-check" id="bhk1" />
            <label 
              className="btn btn-outline-primary" 
              htmlFor="bhk1"
              style={{
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                borderColor: '#5d5fef',
                color: '#5d5fef'
              }}
            >
              1 BHK
            </label>

            <input type="checkbox" className="btn-check" id="bhk2" />
            <label 
              className="btn btn-outline-primary" 
              htmlFor="bhk2"
              style={{
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                borderColor: '#5d5fef',
                color: '#5d5fef'
              }}
            >
              2 BHK
            </label>

            <input type="checkbox" className="btn-check" id="bhk3" defaultChecked />
            <label 
              className="btn" 
              htmlFor="bhk3"
              style={{
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#3b4b7d',
                color: 'white',
                border: 'none'
              }}
            >
              3 BHK
            </label>
          </div>
        </div>

        {/* Lead Origin */}
        <div className="mb-4">
          <h5 
            className="mb-3" 
            style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}
          >
            Landlord Origin
          </h5>
          <Row className="g-2">
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="web"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="web"
                  style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
                >
                  Web
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="call"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="call"
                  style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
                >
                  Call
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="whatsapp"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="whatsapp"
                  style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
                >
                  WhatsApp
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="referral"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="referral"
                  style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
                >
                  Referral
                </label>
              </div>
            </Col>
          </Row>
        </div>

        {/* Rental For */}
        <div className="mb-4">
          <h5 
            className="mb-3" 
            style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}
          >
            Rental For
          </h5>
          <Row className="g-2">
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="bachelor"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="bachelor"
                  style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
                >
                  Bachelor
                </label>
              </div>
            </Col>
            <Col xs={6}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="family"
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="family"
                  style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}
                >
                  Family
                </label>
              </div>
            </Col>
          </Row>
        </div>

        {/* Apply Button - Inside CardBody */}
       
      </CardBody>
    </Card>
    
  );
};


export default PropertiesFilter;