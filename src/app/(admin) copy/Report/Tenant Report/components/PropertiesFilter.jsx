// import ChoicesFormInput from '@/components/from/ChoicesFormInput';
// import Nouislider from 'nouislider-react';
// import { useState } from 'react';
// import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
// const PropertiesFilter = () => {
//   const [selectedValue, setSelectedValue] = useState([6000, 100000]);
//   const handleSliderChange = values => {
//     setSelectedValue(values);
//   };
//   const handleInputChange = event => {
//     if (selectedValue[0] <= Math.round(event.target.value)) {
//       setSelectedValue([selectedValue[0], Math.round(event.target.value)]);
//     }
//   };
//   return <Col xl={3} lg={12}>
//       <Card>
//         <CardHeader className="border-bottom">
//           <div>
//             <CardTitle as={'h4'}>Properties</CardTitle>
//             <p className="mb-0">Show 15,780 Properties</p>
//           </div>
//         </CardHeader>
//         <CardBody className="border-light">
//           <form>
//             <label htmlFor="choices-single-groups" className="form-label">
//               Properties Location
//             </label>
//             <ChoicesFormInput className="form-control" id="choices-single-groups" data-placeholder="Select City">
//               <option>Choose a city</option>
//               <optgroup label="UK">
//                 <option value="London">London</option>
//                 <option value="Manchester">Manchester</option>
//                 <option value="Liverpool">Liverpool</option>
//               </optgroup>
//               <optgroup label="FR">
//                 <option value="Paris">Paris</option>
//                 <option value="Lyon">Lyon</option>
//                 <option value="Marseille">Marseille</option>
//               </optgroup>
//               <optgroup label="DE" disabled>
//                 <option value="Hamburg">Hamburg</option>
//                 <option value="Munich">Munich</option>
//                 <option value="Berlin">Berlin</option>
//               </optgroup>
//               <optgroup label="US">
//                 <option value="New York">New York</option>
//                 <option value="Washington" disabled>
//                   Washington
//                 </option>
//                 <option value="Michigan">Michigan</option>
//               </optgroup>
//               <optgroup label="SP">
//                 <option value="Madrid">Madrid</option>
//                 <option value="Barcelona">Barcelona</option>
//                 <option value="Malaga">Malaga</option>
//               </optgroup>
//               <optgroup label="CA">
//                 <option value="Montreal">Montreal</option>
//                 <option value="Toronto">Toronto</option>
//                 <option value="Vancouver">Vancouver</option>
//               </optgroup>
//             </ChoicesFormInput>
            
//           </form>
//           <h5 className="text-dark fw-medium my-3">Custom Price Range :</h5>
//           <Nouislider range={{
//           min: 1000,
//           max: 10000
//         }} start={selectedValue} connect={true} className="product-price-range" onSlide={handleSliderChange} />
//           <div className="formCost d-flex gap-2 align-items-center mt-3">
//             <input className="form-control form-control-sm text-center" type="number" id="minCost" value={selectedValue[0]} onChange={handleInputChange} />
//             <span className="fw-semibold text-muted">to</span>
//             <input className="form-control form-control-sm text-center" type="number" id="maxCost" value={selectedValue[1]} onChange={handleInputChange} />
//           </div>
//           <h5 className="text-dark fw-medium my-3">Property Type :</h5>
//           <Row className="g-1">
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck11" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck11">
//                   Residential
//                 </label>
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck12" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck12">
//                   Commertial
//                 </label>
//               </div>
//             </Col>
//           </Row>
//           <h5 className="text-dark fw-medium my-3">Properties Type :</h5>
//           <Row className="g-1">
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck" defaultChecked />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck">
//                   All Properties
//                 </label>
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck1" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck1">
//                   Cottage
//                 </label>
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck2" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck1">
//                   Villas
//                 </label>
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck3" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck1">
//                   Apartment
//                 </label>
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck4" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck1">
//                   Duplex Bungalow
//                 </label>
//               </div>
//             </Col>
//           </Row>
//           <h5 className="text-dark fw-medium my-3">Bedrooms :</h5>
//           <div role="group" aria-label="Basic checkbox toggle button group">
//             <input type="checkbox" className="btn-check " id="btncheck1" />
//             <label className="btn btn-outline-primary me-1" htmlFor="btncheck1">
//               1 BHK
//             </label>
//             <input type="checkbox" className="btn-check" id="btncheck2" />
//             <label className="btn btn-outline-primary me-1" htmlFor="btncheck2">
//               2 BHK
//             </label>
//             <input type="checkbox" className="btn-check" id="btncheck3" defaultChecked />
//             <label className="btn btn-outline-primary me-1" htmlFor="btncheck3">
//               3 BHK
//             </label>
//             <input type="checkbox" className="btn-check" id="btncheck4" />
//             <label className="btn btn-outline-primary my-1" htmlFor="btncheck4">
//               4 &amp; 5 BHK
//             </label>
//           </div>
//           <h5 className="text-dark fw-medium my-3">Accessibility Features :</h5>
//           <Row className="g-1">
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck5" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck1">
//                   Balcony
//                 </label>
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck6" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck1">
//                   Parking
//                 </label>
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck7" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck1">
//                   Spa
//                 </label>
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck8" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck1">
//                   Pool
//                 </label>
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck9" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck1">
//                   Restaurant
//                 </label>
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="mb-2">
//                 <input className="form-check-input" type="checkbox" id="defaultCheck10" />
//                 &nbsp;
//                 <label className="form-check-label ms-1" htmlFor="defaultCheck1">
//                   Fitness Club
//                 </label>
//               </div>
//             </Col>
//           </Row>
//         </CardBody>
//         <CardFooter>
//           <Button variant="primary" className="w-100">
//             Apply
//           </Button>
//         </CardFooter>
//       </Card>
//     </Col>;
// };
// export default PropertiesFilter;
import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

const PropertiesFilter = () => {
  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: '0.5rem' }}>
      {/* Header */}
      <CardHeader className="bg-white border-bottom" style={{ padding: '1.25rem 1.5rem' }}>
        <div>
          <CardTitle as={'h4'} className="mb-1" style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937' }}>
            Properties
          </CardTitle>
          <p className="mb-0" style={{ fontSize: '0.875rem', color: '#6c757d' }}>
            Show 15,780 Properties
          </p>
        </div>
      </CardHeader>

      {/* Body */}
      <CardBody style={{ padding: '1.5rem' }}>
        {/* Landlord Location */}
        <div className="mb-4">
          <label 
            htmlFor="lead-location" 
            className="form-label mb-2"
            style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}
          >
            Landlord Location
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
            Landlord Rent :
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

        {/* Landlord Type */}
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
            Lead Origin
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
        <div className="mt-4">
          <Button 
            variant="primary" 
            className="w-100"
            style={{
              backgroundColor: '#3b4b7d',
              borderColor: '#3b4b7d',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            Apply
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default PropertiesFilter;