import PageTitle from '@/components/PageTitle';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import AddCustomer from './components/AddCustomer';
import CustomerAddCard from './components/CustomerAddCard';

const CustomerAddPage = () => {
  const [preview, setPreview] = useState({});

  console.log('🟢 CustomerAddPage - Current preview state:', {
    hasPreview: Object.keys(preview).length > 0,
    previewKeys: Object.keys(preview),
    hasProfileImage: !!preview.profileImage
  });

  return (
    <>
      <PageTitle title="Add Leads" subName="" />
      <Row>
        <CustomerAddCard preview={preview} /> 
        <Col xl={9} lg={12}>
          {/* AddCustomer now includes the file upload functionality */}
          <AddCustomer onFormValuesChange={setPreview} />
        </Col>
      </Row>
    </>
  );
};

export default CustomerAddPage;