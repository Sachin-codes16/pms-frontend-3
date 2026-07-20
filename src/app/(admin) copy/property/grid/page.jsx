import PageTitle from '@/components/PageTitle';
import { useState } from 'react';
import { Row } from 'react-bootstrap';
import PropertiesData from './components/PropertiesData';
import PropertiesFilter from './components/PropertiesFilter';

const PropertyGridPage = () => {
  // Start with empty filters object - shows all properties
  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: 0,
    maxPrice: 100000,
    city: '',
    propertyType: '',
    tenantType: '',
  });

  return (
    <>
      <PageTitle title="Property List" subName="" />
      <Row>
        <PropertiesFilter onFiltersChange={setAppliedFilters} />
        <PropertiesData filters={appliedFilters} />
      </Row>
    </>
  );
};

export default PropertyGridPage;