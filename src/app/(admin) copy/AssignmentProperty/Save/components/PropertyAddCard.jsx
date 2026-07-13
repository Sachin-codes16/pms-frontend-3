import properties1 from '@/assets/images/properties/p-1.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import { Button, Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import httpClient from '@/helpers/httpClient';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';

const PropertyAddCard = ({ selectedProperty }) => {
  // If no property is selected yet, show a placeholder
  if (!selectedProperty) {
    return (
      <Col xl={12} lg={12}>
        <Card>
          <CardBody>
            <div className="text-center py-5">
              <IconifyIcon icon="solar:home-broken" className="fs-1 text-muted mb-3" />
              <h5 className="text-muted">No Property Selected</h5>
              <p className="text-muted small">Select a property from the form to view details</p>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }

  // Get property image - use first photo if available, otherwise placeholder
  const propertyImage = selectedProperty.photos && selectedProperty.photos.length > 0 
    ? `${API_BASE_URL}${selectedProperty.photos[0]}`
    : properties1;

  // Determine property configuration
  const getConfiguration = () => {
    if (selectedProperty.rentalType === 'Flat' && selectedProperty.flatData) {
      return selectedProperty.flatData.flat_configuration || 'N/A';
    } else if (selectedProperty.rentalType === 'Villa' && selectedProperty.villaData) {
      return selectedProperty.villaData.villa_configuration || 'N/A';
    } else if (selectedProperty.rentalType === 'Commercial' && selectedProperty.commercialData) {
      return selectedProperty.commercialData.commercial_category || 'N/A';
    }
    return 'N/A';
  };

  // Get number of bedrooms
  const getBedrooms = () => {
    if (selectedProperty.rentalType === 'Villa' && selectedProperty.villaData) {
      return selectedProperty.villaData.number_of_bedrooms || 0;
    } else if (selectedProperty.rentalType === 'Flat' && selectedProperty.flatData) {
      // Extract from configuration like "2BHK" -> 2
      const config = selectedProperty.flatData.flat_configuration || '';
      const match = config.match(/(\d+)BHK/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  };

  // Get number of bathrooms
  const getBathrooms = () => {
    if (selectedProperty.rentalType === 'Villa' && selectedProperty.villaData) {
      return selectedProperty.villaData.number_of_bathrooms || 0;
    } else if (selectedProperty.rentalType === 'Flat' && selectedProperty.flatData) {
      return selectedProperty.flatData.no_of_bathrooms || 0;
    } else if (selectedProperty.rentalType === 'Commercial' && selectedProperty.commercialData) {
      return selectedProperty.commercialData.no_of_washrooms || 0;
    }
    return 0;
  };

  const bedrooms = getBedrooms();
  const bathrooms = getBathrooms();
  const configuration = getConfiguration();

  return (
    <Col xl={12} lg={12}>
      <Card>
        <CardBody>
          <div className="position-relative">
            <img 
              src={propertyImage} 
              alt="property" 
              className="img-fluid rounded bg-light" 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = properties1; // Fallback to placeholder on error
              }}
            />
            <span className="position-absolute top-0 end-0 p-1">
              <span className="badge bg-success text-light fs-13">For Rent</span>
            </span>
          </div>
          <div className="mt-3">
            <h4 className="mb-1">
              {selectedProperty.buildingDetails || selectedProperty.propertyDetails?.building_name}
              <span className="fs-14 text-muted ms-1">({selectedProperty.rentalType})</span>
            </h4>
            <p className="mb-1 text-muted small">
              {selectedProperty.block} - Floor {selectedProperty.floor} - Unit {selectedProperty.flatNumber}
            </p>
            <p className="mb-1 text-muted small">
              {selectedProperty.propertyDetails?.address_line_1}, {selectedProperty.propertyDetails?.city}
            </p>
            <h5 className="text-dark fw-medium mt-3">Price :</h5>
            <h4 className="fw-semibold mt-2 text-muted">
              OMR {parseFloat(selectedProperty.expectedRent || 0).toFixed(2)}
            </h4>
          </div>
          <Row className="mt-2 g-2">
            {bedrooms > 0 && (
              <Col xs={6}>
                <span className="badge bg-light-subtle text-muted border fs-12 d-inline-flex align-items-center gap-1 w-100" style={{ padding: '8px 6px' }}>
                  <IconifyIcon icon="solar:bed-broken" className="fs-14 flex-shrink-0" />
                  <span className="text-truncate">{bedrooms} Beds</span>
                </span>
              </Col>
            )}
            {bathrooms > 0 && (
              <Col xs={6}>
                <span className="badge bg-light-subtle text-muted border fs-12 d-inline-flex align-items-center gap-1 w-100" style={{ padding: '8px 6px' }}>
                  <IconifyIcon icon="solar:bath-broken" className="fs-14 flex-shrink-0" />
                  <span className="text-truncate">{bathrooms} Bath</span>
                </span>
              </Col>
            )}
            <Col xs={6}>
              <span className="badge bg-light-subtle text-muted border fs-12 d-inline-flex align-items-center gap-1 w-100" style={{ padding: '8px 6px' }}>
                <IconifyIcon icon="solar:scale-broken" className="fs-14 flex-shrink-0" />
                <span className="text-truncate">{selectedProperty.dimensionAreaSqft} ft</span>
              </span>
            </Col>
            <Col xs={6}>
              <span className="badge bg-light-subtle text-muted border fs-12 d-inline-flex align-items-center gap-1 w-100" style={{ padding: '8px 6px' }}>
                <IconifyIcon icon="solar:double-alt-arrow-up-broken" className="fs-14 flex-shrink-0" />
                <span className="text-truncate">{selectedProperty.floor} Floor</span>
              </span>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default PropertyAddCard;