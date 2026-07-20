import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect, useState } from 'react';
import { fetchRecentProperties } from '../data';
import {
  Button, Card, CardBody, CardFooter, CardHeader, CardTitle,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Property type ke basis par name get karne ka function
const getPropertyName = (item) => {
  const propertyType = item.rentalType?.toLowerCase() || item.propertyType?.toLowerCase() || '';
  
  switch (propertyType) {
    case 'flat':
      return item.property_details?.building_name || 
             item.buildingName || 
             item.buildingDetails || 
             'Building';
    
    case 'villa':
      return item.villa_data?.villa_name || 
             item.villaName || 
             item.property_details?.building_name ||
             item.buildingName || 
             'Villa';
    
    case 'commercial':
      return item.property_details?.building_name || 
             item.buildingName || 
             item.complexName || 
             item.buildingDetails || 
             'Commercial Building';
    
    case 'warehouse':
      return item.warehouseName || 
             item.property_details?.building_name ||
             item.buildingName || 
             'Warehouse';
    
    default:
      return item.property_details?.building_name || 
             item.buildingName || 
             item.buildingDetails || 
             item.villaName || 
             item.warehouseName || 
             'Property';
  }
};

// Get monthly rent based on property type
const getMonthlyRent = (item) => {
  let rent = null;
  
  // Priority: property_details.monthly_rent > expected_rent
  rent = item.property_details?.monthly_rent || item.expectedRent;
  
  // Validate and format
  if (!rent || rent === '—' || rent === 0 || rent === '0') return '—';
  
  // Handle string or number
  const numericRent = typeof rent === 'string' ? parseFloat(rent) : rent;
  
  if (isNaN(numericRent) || numericRent <= 0) return '—';
  
  // Format with currency (change 'OMR' to your currency)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'OMR', // Change to USD, AED, etc. as needed
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericRent);
};

// Property display text with block and flat
const getPropertyDisplayText = (item) => {
  const propertyName = getPropertyName(item);
  const parts = [propertyName];
  
  // Get block from flat_data or direct property
  const block = item.flat_data?.building_block || item.block;
  if (block && block !== '—' && block !== 'string') {
    parts.push(`Block ${block}`);
  }
  
  // Get flat number from flat_data or direct property
  const flatNumber = item.flat_data?.flat_number || item.flatNumber;
  if (flatNumber && flatNumber !== '—' && flatNumber !== 0 && flatNumber !== 'string') {
    parts.push(`Flat ${flatNumber}`);
  }
  
  return parts.join(', ') || '—';
};

const JoinAgent = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRecentProperties();
        console.log('Fetched properties:', data);
        setProperties(data || []);
      } catch (err) {
        console.error('RecentProperties fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const lastIdx = properties.length - 1;

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center border-0">
        <div>
          <CardTitle as="h4" className="mb-1">
            Recent Property
          </CardTitle>
          <p className="mb-0 fs-13">{loading ? '...' : `${properties.length} Properties`}</p>
        </div>
        <Link to="/landlord/property-grid">
          <IconifyIcon icon="ri:edit-box-line" className="fs-20 text-dark" />
        </Link>
      </CardHeader>

      <CardBody className="pt-2">
        {loading ? (
          // Skeleton placeholders - showing 5 items
          [1, 2, 3, 4, 5].map((i) => (
            <div className="d-flex align-items-center gap-2 py-3 border-bottom" key={i}>
              <div
                className="placeholder rounded-circle"
                style={{ width: 36, height: 36, flexShrink: 0 }}
              />
              <div className="flex-grow-1">
                <span className="placeholder rounded d-block mb-1" style={{ width: '60%', height: '0.85rem' }} />
                <span className="placeholder rounded d-block mb-1" style={{ width: '40%', height: '0.75rem' }} />
                <span className="placeholder rounded d-block" style={{ width: '30%', height: '0.75rem' }} />
              </div>
              <span className="placeholder rounded" style={{ width: '4rem', height: '0.75rem' }} />
            </div>
          ))
        ) : error ? (
          <p className="text-danger text-center py-3">Error: {error}</p>
        ) : properties.length === 0 ? (
          <p className="text-muted text-center py-3">No properties found</p>
        ) : (
          properties.map((item, idx) => (
            <div
              key={item.propertyId ?? idx}
              className={`d-flex flex-wrap align-items-center justify-content-between gap-2
                ${idx !== lastIdx ? 'border-bottom' : ''}
                ${idx === 0 ? 'pb-3' : idx === lastIdx ? 'pt-3' : 'py-3'}
              `}
            >
              {/* Icon avatar */}
              <div className="d-flex align-items-center gap-2">
                <div className="avatar-sm bg-primary bg-opacity-10 rounded flex-centered flex-shrink-0">
                  <IconifyIcon icon="solar:home-2-broken" className="text-primary fs-20" />
                </div>
                <div>
                  <Link to="/landlord/property-grid" className="text-dark fw-medium fs-15">
                    {getPropertyDisplayText(item)}
                  </Link>
                  <p className="mb-0 fs-13 text-muted">
                    {item.rentalType || item.propertyType || '—'} &nbsp;·&nbsp; {item.city || '—'}
                  </p>
                  {/* Monthly Rent Display */}
                  <p className="mb-0 fs-13 fw-semibold text-primary">
                    {getMonthlyRent(item)}/month
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardBody>

      <CardFooter className="border-top">
        <Button as={Link} to="/landlord/property-grid" variant="primary" className="w-100">
          View All
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JoinAgent;