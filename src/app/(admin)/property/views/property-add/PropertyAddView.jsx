import FileUpload from '@/components/FileUpload';
import PageTitle from '@/components/PageTitle';
import { Col, Row } from 'react-bootstrap';
import { usePropertyAddController } from '../../controllers/usePropertyAddController';
import PropertyAdd from '../../add/components/PropertyAdd';
import PropertyAddCard from '../../add/components/PropertyAddCard';

const PropertyAddView = () => {
  usePropertyAddController();

  return (
    <>
      <PageTitle title="Add Property" subName="" />
      <Row>
        <PropertyAddCard />
        <Col xl={9} lg={8}>
          <FileUpload title="Add Property Photo" />
          <PropertyAdd />
        </Col>
      </Row>
    </>
  );
};

export default PropertyAddView;
