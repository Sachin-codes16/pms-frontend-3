import FileUpload from '@/components/FileUpload';
import { useState } from 'react';
import { Alert, Col, Row, Spinner } from 'react-bootstrap';
import { usePropertyAddController } from '../../controllers/usePropertyAddController';
import PropertyAdd from '../../add/components/PropertyAdd';
import PropertyPreviewCard from '../../add/components/PropertyPreviewCard';

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const PropertyAddView = () => {
  const { mode, initialData, loading, error } = usePropertyAddController();
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const handleFileUpload = async (files) => {
    const base64s = await Promise.all(files.map(fileToBase64));
    setUploadedPhotos(base64s.map((raw) => ({ type: 'new', raw })));
  };

  return (
    <>
      <h4 className="mb-3 fw-semibold">{mode === 'update' ? 'Edit Property' : 'Add Property'}</h4>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          <PropertyPreviewCard image={uploadedPhotos[0]?.raw} />
          <Col xl={9} lg={8}>
            <FileUpload title="Add Property Photo" onFileUpload={handleFileUpload} />
            <PropertyAdd uploadedPhotos={uploadedPhotos} initialData={initialData} mode={mode} />
          </Col>
        </Row>
      )}
    </>
  );
};

export default PropertyAddView;
