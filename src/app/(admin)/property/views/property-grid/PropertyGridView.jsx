import { Row } from 'react-bootstrap';
import { usePropertyGridController } from '../../controllers/usePropertyGridController';
import ListingGrid from '../../Properties/components/ListingGrid';
import PropertiesFilter from '../../Properties/components/PropertiesFilter';

const PropertyGridView = () => {
  usePropertyGridController();

  return (
    <>
      <h4 className="mb-3 fw-semibold">Listing Grid</h4>
      <Row>
        <PropertiesFilter />
        <ListingGrid />
      </Row>
    </>
  );
};

export default PropertyGridView;
