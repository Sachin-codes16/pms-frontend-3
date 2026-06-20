import PageTitle from '@/components/PageTitle';
import { Row } from 'react-bootstrap';
import { usePropertyGridController } from '../../controllers/usePropertyGridController';
import ListingGrid from '../../Properties/components/ListingGrid';
import PropertiesFilter from '../../Properties/components/PropertiesFilter';

const PropertyGridView = () => {
  usePropertyGridController();

  return (
    <>
      <PageTitle title="Listing Grid" subName="" />
      <Row>
        <PropertiesFilter />
        <ListingGrid />
      </Row>
    </>
  );
};

export default PropertyGridView;
