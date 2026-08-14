import { Row } from 'react-bootstrap';
import { usePropertyGridController } from '../../controllers/usePropertyGridController';
import ListingGrid from '../../Properties/components/ListingGrid';
import PropertiesFilter from '../../Properties/components/PropertiesFilter';

const PropertyGridView = () => {
  const gridController = usePropertyGridController();

  return (
    <>
      <h4 className="mb-3 fw-semibold">Listing Grid</h4>
      <Row>
        <PropertiesFilter {...gridController} />
        <ListingGrid {...gridController} />
      </Row>
    </>
  );
};

export default PropertyGridView;
