import FileUpload from '@/components/FileUpload';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { usePropertyAddController } from '../../controllers/usePropertyAddController';
import PropertyAdd from '../../add/components/PropertyAdd';

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const PropertyAddView = () => {
  usePropertyAddController();
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const handleFileUpload = async (files) => {
    const base64s = await Promise.all(files.map(fileToBase64));
    setUploadedPhotos(base64s.map((raw) => ({ type: 'new', raw })));
  };

  return (
    <>
      <h4 className="mb-3 fw-semibold">Add Property</h4>
      <Row>
        <Col xl={12}>
          <FileUpload title="Add Property Photo" onFileUpload={handleFileUpload} />
          <PropertyAdd uploadedPhotos={uploadedPhotos} />
        </Col>
      </Row>
    </>
  );
};

export default PropertyAddView;
