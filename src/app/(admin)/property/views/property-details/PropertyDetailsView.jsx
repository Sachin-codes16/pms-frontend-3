import { Row } from 'react-bootstrap';
import { usePropertyDetailsController } from '../../controllers/usePropertyDetailsController';
import OwnerDetails from '../../details/components/OwnerDetails';
import PropertyDetails from '../../details/components/PropertyDetails';

const PropertyDetailsView = () => {
  const { breadcrumb } = usePropertyDetailsController();

  return (
    <>
      <div style={{ fontSize: '1.2rem', fontWeight: 550, color: 'black', marginBottom: '1rem', paddingLeft: '' }}>
        {breadcrumb}
      </div>

      <Row>
        <OwnerDetails />
        <PropertyDetails />
      </Row>
    </>
  );
};

export default PropertyDetailsView;
