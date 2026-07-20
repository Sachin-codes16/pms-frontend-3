import { useRef } from 'react';
import { Card, CardBody } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const PropertyPhotoUpload = ({ title = "Add Property Photo", photos = [], onPhotosChange }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPhotos = files.map((file) => ({
      preview: URL.createObjectURL(file),
      raw: '',
      type: 'new',
      file: file,
    }));

    Promise.all(
      newPhotos.map((photo) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            photo.raw = base64;
            resolve(photo);
          };
          reader.readAsDataURL(photo.file);
        });
      })
    ).then((processedPhotos) => {
      onPhotosChange([...photos, ...processedPhotos]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  const handleDeletePhoto = (indexToDelete) => {
    const updatedPhotos = photos.filter((_, index) => index !== indexToDelete);
    onPhotosChange(updatedPhotos);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#6366f1';
    e.currentTarget.style.backgroundColor = '#eef2ff';
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.borderColor = '#dee2e6';
    e.currentTarget.style.backgroundColor = '#f9fafb';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#dee2e6';
    e.currentTarget.style.backgroundColor = '#f9fafb';
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      const event = { target: { files } };
      handleFileSelect(event);
    }
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <h4 className="fw-semibold mb-3">{title}</h4>

        {/* Upload Area */}
        <div
          className="border-dashed p-5 text-center mb-3"
          style={{
            border: '2px dashed #dee2e6',
            borderRadius: '12px',
            backgroundColor: '#f9fafb',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpg,image/jpeg,image/gif,image/webp,image/bmp"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="property-photo-upload"
          />
          <IconifyIcon
            icon="material-symbols:cloud-upload"
            width={56}
            height={56}
            className="text-primary mb-3"
            style={{ opacity: 0.7 }}
          />
          <h5 className="mb-2">Drop your images here, or click to browse</h5>
          <p className="text-muted mb-0">
            PNG, JPG, JPEG, GIF, WEBP, BMP. 1600×1200 (4:3) recommended.
          </p>
        </div>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="row g-3">
            {photos.map((photo, index) => {
              const displaySrc = photo.preview || photo.src;
              const isExisting = photo.type === 'existing';

              return (
                <div key={index} className="col-lg-3 col-md-4 col-6">
                  <div
                    className="position-relative"
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <img
                      src={displaySrc}
                      alt={`Property ${index + 1}`}
                      className="img-fluid"
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect fill="%23ddd" width="200" height="150"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />

                    {/* Delete Button */}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                      style={{
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(index);
                      }}
                      title={isExisting ? 'Delete saved photo' : 'Remove new photo'}
                    >
                      <IconifyIcon icon="mdi:close" width={20} height={20} />
                    </button>

                    {/* Badge: Saved / New */}
                    <span
                      className={`badge position-absolute bottom-0 start-0 m-2 ${
                        isExisting ? 'bg-success' : 'bg-info'
                      }`}
                      style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px' }}
                    >
                      {isExisting ? (
                        <>
                          <IconifyIcon icon="mdi:check-circle" width={14} className="me-1" />
                          Saved
                        </>
                      ) : (
                        <>
                          <IconifyIcon icon="mdi:new-box" width={14} className="me-1" />
                          New
                        </>
                      )}
                    </span>

                    {/* Index Badge */}
                    <span
                      className="badge bg-dark position-absolute top-0 start-0 m-2"
                      style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', opacity: 0.8 }}
                    >
                      #{index + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Photo Count Info */}
        {photos.length > 0 && (
          <div
            className="mt-3 p-3 rounded"
            style={{ backgroundColor: '#f0f9ff', border: '1px solid #bfdbfe' }}
          >
            <div className="d-flex align-items-center gap-2">
              <IconifyIcon icon="mdi:information-outline" width={20} className="text-primary" />
              <span className="text-sm">
                <strong>{photos.length}</strong> photo{photos.length !== 1 ? 's' : ''} added
                {photos.filter((p) => p.type === 'existing').length > 0 && (
                  <>
                    {' '}
                    •{' '}
                    <strong>{photos.filter((p) => p.type === 'existing').length}</strong> saved
                  </>
                )}
                {photos.filter((p) => p.type === 'new').length > 0 && (
                  <>
                    {' '}
                    •{' '}
                    <strong>{photos.filter((p) => p.type === 'new').length}</strong> new
                  </>
                )}
              </span>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PropertyPhotoUpload;